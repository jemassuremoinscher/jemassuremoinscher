const CACHE_NAME = 'jmamc-v6';
const IMG_CACHE_NAME = 'jmamc-img-v3';
const MAX_IMG_CACHE_ITEMS = 120;
const MAX_STATIC_CACHE_ITEMS = 200;

// Install: lightweight
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

// Click on a notification shown by the SW -> focus/open the target URL
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const target = (event.notification.data && event.notification.data.url) || '/admin';
  event.waitUntil((async () => {
    const allClients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const client of allClients) {
      try {
        const url = new URL(client.url);
        if (url.origin === self.location.origin) {
          await client.focus();
          if ('navigate' in client) {
            try { await client.navigate(target); } catch {}
          }
          return;
        }
      } catch {}
    }
    if (self.clients.openWindow) await self.clients.openWindow(target);
  })());
});

// Activate: clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k !== CACHE_NAME && k !== IMG_CACHE_NAME)
          .map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// Trim cache to max size (LRU-style: oldest entries removed first)
async function trimCache(cacheName, maxItems) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  if (keys.length > maxItems) {
    await Promise.all(keys.slice(0, keys.length - maxItems).map((k) => cache.delete(k)));
  }
}

// Fetch strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET and cross-origin
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;

  // Skip API/auth calls
  if (url.pathname.startsWith('/rest/') || url.pathname.startsWith('/auth/')) return;

  // Images: stale-while-revalidate (fast display, background refresh)
  if (url.pathname.match(/\.(png|jpg|jpeg|webp|svg|ico)$/)) {
    event.respondWith(
      caches.open(IMG_CACHE_NAME).then(async (cache) => {
        const cached = await cache.match(request);
        const fetchPromise = fetch(request).then((response) => {
          if (response.ok) {
            cache.put(request, response.clone());
            trimCache(IMG_CACHE_NAME, MAX_IMG_CACHE_ITEMS);
          }
          return response;
        }).catch(() => cached);

        return cached || fetchPromise;
      })
    );
    return;
  }

  // JS/CSS/fonts: cache-first (hashed filenames = immutable)
  if (
    url.pathname.match(/\.(js|css|woff2)$/) ||
    url.pathname.startsWith('/assets/')
  ) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, clone);
              trimCache(CACHE_NAME, MAX_STATIC_CACHE_ITEMS);
            });
          }
          return response;
        });
      })
    );
    return;
  }

  // HTML navigation: network-first (SEO bots get fresh HTML)
  if (request.mode === 'navigate' || request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request.url, clone));
          }
          return response;
        })
        .catch(() => caches.match(request.url) || caches.match('/'))
    );
    return;
  }
});
