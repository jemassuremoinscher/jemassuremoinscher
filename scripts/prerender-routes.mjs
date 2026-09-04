/**
 * Prérendu réel des routes React (Option C) — outil de génération LOCALE.
 *
 * Charge chaque route dans un Chromium headless servi depuis `dist/`, scrolle
 * jusqu'en bas pour déclencher les <DeferredRender>/lazy sections, puis écrit
 * le HTML rendu.
 *
 * Ce script suppose un Chromium disponible en local (cache Playwright, ou
 * PRERENDER_CHROMIUM/CHROME_PATH) : le build Vercel n'en a jamais eu et n'en
 * aura pas — voir scripts/apply-prerender-snapshot.mjs pour la partie qui
 * s'exécute réellement en production, sans Chromium, à partir des fichiers
 * générés ici et committés dans prerender-snapshots/.
 *
 * Deux modes de sortie, selon PRERENDER_OUT_DIR :
 * - non défini (défaut) : écrit directement dans dist/<route>/index.html
 *   (utile pour un test local avec `vite preview`, ou un déploiement qui aurait
 *   son propre Chromium). Garde le HTML SPA d'origine dans dist/index.spa.html.
 * - PRERENDER_OUT_DIR=prerender-snapshots : écrit un fichier plat par route
 *   (prerender-snapshots/<slug>.html), destiné à être committé. C'est le mode
 *   utilisé par `npm run prerender:snapshot`.
 *
 * Le bundle JS est conservé dans le snapshot : au montage, createRoot() écrase
 * le contenu de #root, donc aucun risque de mismatch d'hydratation. Les noms de
 * fichiers hashés qu'il référence datent de ce build local — c'est
 * apply-prerender-snapshot.mjs qui les réécrit au build réel.
 *
 * Usage :
 *   node scripts/prerender-routes.mjs            # routes par défaut
 *   node scripts/prerender-routes.mjs / /assurance-auto
 *   PRERENDER_OUT_DIR=prerender-snapshots node scripts/prerender-routes.mjs /
 *
 * Non bloquant : si aucun Chromium n'est disponible, le script log et sort en 0.
 */
import { createReadStream, existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import http from "node:http";
import path from "node:path";

const rootDir = process.cwd();
const distDir = path.join(rootDir, "dist");
const snapshotOutDir = process.env.PRERENDER_OUT_DIR
  ? path.join(rootDir, process.env.PRERENDER_OUT_DIR)
  : null;
const PORT = Number(process.env.PRERENDER_PORT || 4183);

// Nom de fichier plat pour le mode snapshot (prerender-snapshots/<slug>.html).
const routeSlug = (route) => (route === "/" ? "home" : route.replace(/^\/|\/$/g, "").replace(/\//g, "-"));

// Routes prérendues. Étape 1 : la home uniquement.
const DEFAULT_ROUTES = ["/"];
const routes = process.argv.slice(2).filter((a) => a.startsWith("/"));
const targets = routes.length ? routes : DEFAULT_ROUTES;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".mjs": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml",
  ".pdf": "application/pdf",
};

const startServer = () =>
  new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const urlPath = decodeURIComponent((req.url || "/").split("?")[0]);
      let filePath = path.join(distDir, urlPath);
      if (!filePath.startsWith(distDir)) {
        res.writeHead(403).end();
        return;
      }
      if (existsSync(filePath) && !path.extname(filePath)) filePath = path.join(filePath, "index.html");
      if (!existsSync(filePath) || !path.extname(filePath)) filePath = path.join(distDir, "index.html");
      res.writeHead(200, { "content-type": MIME[path.extname(filePath)] || "application/octet-stream" });
      createReadStream(filePath).pipe(res);
    });
    server.listen(PORT, "127.0.0.1", () => resolve(server));
  });

const resolveChromium = async (chromium) => {
  const candidates = [
    process.env.PRERENDER_CHROMIUM,
    process.env.CHROME_PATH,
    "/bin/chromium",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
    "/usr/bin/google-chrome",
  ].filter(Boolean);
  for (const p of candidates) if (existsSync(p)) return p;
  // Chromium fourni par `npx playwright install chromium`, si présent.
  try {
    const bundled = chromium.executablePath();
    if (bundled && existsSync(bundled)) return bundled;
  } catch {
    /* ignore */
  }
  return null;
};

const main = async () => {
  if (!existsSync(path.join(distDir, "index.html"))) {
    console.warn("[prerender] dist/index.html introuvable — build d'abord. Skip.");
    return;
  }

  let chromium;
  try {
    ({ chromium } = await import("playwright-core"));
  } catch {
    console.warn("[prerender] playwright-core indisponible — skip (build non bloqué).");
    return;
  }

  const executablePath = await resolveChromium(chromium);
  if (!executablePath) {
    console.warn("[prerender] Aucun Chromium trouvé — skip (build non bloqué).");
    return;
  }

  const server = await startServer();
  let browser;
  try {
    browser = await chromium.launch({
      headless: true,
      executablePath,
      args: ["--no-sandbox", "--disable-dev-shm-usage"],
    });
    const context = await browser.newContext({
      viewport: { width: 1280, height: 1200 },
      locale: "fr-FR",
      userAgent:
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 JMMC-Prerender",
    });

    // Neutralise le bandeau cookies + les modales d'intention de sortie dans le snapshot.
    await context.addInitScript(() => {
      try {
        window.localStorage.setItem(
          "cookie-consent",
          JSON.stringify({
            hasConsented: true,
            preferences: { necessary: true, analytics: false, marketing: false },
            timestamp: new Date().toISOString(),
          })
        );
        window.localStorage.setItem("exit-intent-shown", "true");
        window.__PRERENDER__ = true;
      } catch {
        /* ignore */
      }
    });

    for (const route of targets) {
      const url = `http://127.0.0.1:${PORT}${route}`;
      const page = await context.newPage();
      try {
        await page.goto(url, { waitUntil: "networkidle", timeout: 45000 });

        // Scroll progressif : déclenche les IntersectionObserver des DeferredRender.
        await page.evaluate(async () => {
          const step = Math.round(window.innerHeight * 0.8);
          for (let y = 0; y < document.body.scrollHeight + 4000; y += step) {
            window.scrollTo(0, y);
            await new Promise((r) => setTimeout(r, 120));
          }
          window.scrollTo(0, document.body.scrollHeight);
          await new Promise((r) => setTimeout(r, 600));
          window.scrollTo(0, 0);
        });
        await page.waitForLoadState("networkidle").catch(() => {});
        await page.waitForTimeout(800);

        // Nettoyage du snapshot : overlays purement runtime.
        await page.evaluate(() => {
          document
            .querySelectorAll('[data-prerender-strip], [role="dialog"], [data-sonner-toaster]')
            .forEach((el) => el.remove());
        });

        const html = "<!DOCTYPE html>\n" + (await page.content()).replace(/^<!DOCTYPE html>/i, "").trim();

        let outFile;
        if (snapshotOutDir) {
          await mkdir(snapshotOutDir, { recursive: true });
          outFile = path.join(snapshotOutDir, `${routeSlug(route)}.html`);
        } else {
          const outDir = route === "/" ? distDir : path.join(distDir, route.replace(/^\//, ""));
          await mkdir(outDir, { recursive: true });
          outFile = path.join(outDir, "index.html");

          // Garde le HTML SPA d'origine comme filet de sécurité (fallback hosting).
          if (route === "/" && !existsSync(path.join(distDir, "index.spa.html"))) {
            await writeFile(path.join(distDir, "index.spa.html"), await readFile(outFile, "utf8"), "utf8");
          }
        }

        await writeFile(outFile, html, "utf8");
        console.log(
          `[prerender] ${route} → ${path.relative(rootDir, outFile)} (${Math.round(html.length / 1024)} Ko)`
        );
      } catch (err) {
        console.warn(`[prerender] Échec sur ${route} : ${err?.message || err} — route laissée en SPA.`);
      } finally {
        await page.close();
      }
    }
  } finally {
    if (browser) await browser.close().catch(() => {});
    server.close();
  }
};

await main();
