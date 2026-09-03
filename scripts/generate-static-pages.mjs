import { access, mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const rootDir = process.cwd();
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || "https://ybqxpngkbgosobtetxac.supabase.co";
const SUPABASE_ANON = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlicXhwbmdrYmdvc29idGV0eGFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyNTM0NzksImV4cCI6MjA3NzgyOTQ3OX0.ekYS4QpTPlcJ82Cf4xXvwS1LsM4LhFodG-u31Mb7Rbg";
const geoContentPath = path.join(rootDir, "src/data/geo-content.json");
const geoContent = JSON.parse(await readFile(geoContentPath, "utf8"));

const { baseUrl, staticPages: pages } = geoContent;
const excludedDirectories = new Set(["dist", "node_modules", ".git", "test-hosting-paths"]);

// Charge les overrides meta_title/meta_description une seule fois, pour que
// renderPage()/renderArticle() puissent les appliquer au HTML pre-genere —
// jusqu'ici cette table n'etait lue que cote client (SEOOptimized.tsx), donc
// jamais visible des crawlers qui ne executent pas le JS.
const metaOverrides = new Map();
try {
  const overridesSupabase = createClient(SUPABASE_URL, SUPABASE_ANON, { auth: { persistSession: false } });
  const { data: overrideRows, error: overrideError } = await overridesSupabase
    .from("page_meta_overrides")
    .select("page_path, meta_title, meta_description");
  if (overrideError) {
    console.warn("[generate-static-pages] Could not load page_meta_overrides:", overrideError.message);
  } else {
    for (const row of overrideRows || []) {
      if (row.page_path) metaOverrides.set(row.page_path, row);
    }
    console.log(`[generate-static-pages] Loaded ${metaOverrides.size} page_meta_overrides.`);
  }
} catch (err) {
  console.warn("[generate-static-pages] Skipping page_meta_overrides:", err?.message || err);
}

const escapeHtml = (value = "") => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
const escapeAttribute = (value = "") => escapeHtml(value).replaceAll('"', "&quot;");
const escapeJson = (value = "") => value.replaceAll("\\", "\\\\").replaceAll('"', '\\"');

// Certains contenus first-party (nicheInsuranceData.ts) embarquent des liens internes
// écrits en HTML. On échappe tout, puis on restaure uniquement les <a href="/..."> :
// href relatif obligatoire, aucun attribut conservé, donc pas de vecteur d'injection.
const escapeHtmlKeepingInternalLinks = (value = "") =>
  escapeHtml(value).replace(
    /&lt;a\s+href=['"](\/[^'"]*)['"][^&]*?&gt;([\s\S]*?)&lt;\/a&gt;/g,
    (_match, href, label) => `<a href="${escapeAttribute(href)}">${label}</a>`
  );

const renderSection = (section) => {
  if (section.html) {
    return `
      <section>
        <h2>${escapeHtml(section.title)}</h2>
        ${section.html}
      </section>`;
  }

  if (section.table) {
    return `
      <section>
        <h2>${escapeHtml(section.title)}</h2>
        <table>
          <thead><tr>${section.table.headers.map((h) => `<th>${escapeHtml(h)}</th>`).join("")}</tr></thead>
          <tbody>${section.table.rows.map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell ?? "")}</td>`).join("")}</tr>`).join("")}</tbody>
        </table>
      </section>`;
  }

  if (section.faqs) {
    return `
      <section>
        <h2>${escapeHtml(section.title)}</h2>
        <dl>
          ${section.faqs.map((f) => `<dt>${escapeHtml(f.question)}</dt><dd>${escapeHtmlKeepingInternalLinks(f.answer)}</dd>`).join("")}
        </dl>
      </section>`;
  }

  if (section.paragraphs) {
    return `
      <section>
        <h2>${escapeHtml(section.title)}</h2>
        ${section.paragraphs.map((para) => `<p>${escapeHtmlKeepingInternalLinks(para)}</p>`).join("")}
      </section>`;
  }

  if (section.list) {
    return `
      <section>
        <h2>${escapeHtml(section.title)}</h2>
        <ul>
          ${section.list.map((item) => `<li><a href="${escapeAttribute(item.href)}">${escapeHtml(item.label)}</a></li>`).join("")}
        </ul>
      </section>`;
  }

  return `
    <section>
      <h2>${escapeHtml(section.title)}</h2>
      <p>${escapeHtmlKeepingInternalLinks(section.body)}</p>
    </section>`;
};

const buildWebPageJsonLd = ({ title, description, canonical, heading }) => `
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "${escapeJson(title)}",
      "headline": "${escapeJson(heading || title)}",
      "description": "${escapeJson(description)}",
      "url": "${escapeJson(canonical)}",
      "inLanguage": "fr-FR",
      "isPartOf": {
        "@type": "WebSite",
        "name": "${escapeJson(geoContent.brandName)}",
        "url": "${escapeJson(baseUrl)}"
      },
      "about": {
        "@type": "Thing",
        "name": "${escapeJson(heading || title)}"
      }
    }
    </script>`;

const buildBreadcrumbJsonLd = (items) => `
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [${items.map((it, i) => `{ "@type": "ListItem", "position": ${i + 1}, "name": "${escapeJson(it.name)}", "item": "${escapeJson(it.url)}" }`).join(", ")}]
    }
    </script>`;

const renderPage = (page) => {
  const canonical = `${baseUrl}${page.route}`;
  const override = metaOverrides.get(page.route);
  const title = override?.meta_title || page.title;
  const description = override?.meta_description || page.description;
  return `<!doctype html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <!-- Dark mode bootstrap: apply 'dark' class before paint, based on saved preference or OS setting -->
    <script>
    (function(){
      try {
        var saved = localStorage.getItem('theme');
        var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        var isDark = saved ? saved === 'dark' : prefersDark;
        if (isDark) document.documentElement.classList.add('dark');
        // Live-update when OS preference changes (only if user hasn't chosen explicitly)
        if (window.matchMedia) {
          window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e){
            if (!localStorage.getItem('theme')) {
              document.documentElement.classList.toggle('dark', e.matches);
            }
          });
        }
      } catch(e){}
    })();
    </script>

    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeAttribute(description)}" />
    <meta name="robots" content="index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1" />
    <link rel="canonical" href="${escapeAttribute(canonical)}" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="${escapeAttribute(title)}" />
    <meta property="og:description" content="${escapeAttribute(description)}" />
    <meta property="og:url" content="${escapeAttribute(canonical)}" />
    <meta property="og:site_name" content="${escapeAttribute(geoContent.brandName)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeAttribute(title)}" />
    <meta name="twitter:description" content="${escapeAttribute(description)}" />
${buildWebPageJsonLd({ title, description, canonical, heading: page.h1 })}
${buildBreadcrumbJsonLd(page.breadcrumb || [{ name: "Accueil", url: `${baseUrl}/` }, { name: page.h1, url: canonical }])}
    <style>
      body { margin: 0; font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif; color: #111827; background: #ffffff; }
      .seo-shell { max-width: 900px; margin: 0 auto; padding: 2rem 1rem; line-height: 1.65; }
      h1 { font-size: clamp(1.75rem, 3vw, 2.5rem); margin: 0 0 1rem; }
      h2 { font-size: 1.25rem; margin: 1.5rem 0 0.75rem; }
      ul { padding-left: 1.25rem; }
      li { margin-bottom: 0.5rem; }
      a { color: #1d4ed8; }
      .cta { display: inline-block; margin-top: 1rem; font-weight: 600; }
    </style>
  </head>
  <body>
    <noscript>
      <main class="seo-shell">
        <h2>${escapeHtml(page.h1)}</h2>
        <p>${escapeHtml(page.intro)}</p>
        ${page.sections.map(renderSection).join("")}
        <p><a class="cta" href="${escapeAttribute(page.ctaHref)}">${escapeHtml(page.ctaLabel)}</a></p>
      </main>
    </noscript>

    <div id="root">
      <main class="seo-shell">
        <h1>${escapeHtml(page.h1)}</h1>
        <p>${escapeHtml(page.intro)}</p>
        ${page.sections.map(renderSection).join("")}
        <p><a class="cta" href="${escapeAttribute(page.ctaHref)}">${escapeHtml(page.ctaLabel)}</a></p>
      </main>
    </div>

    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`;
};

const readDirRecursive = async (dirPath) => {
  const entries = await readdir(dirPath, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (excludedDirectories.has(entry.name)) continue;
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      files.push(...await readDirRecursive(fullPath));
    } else {
      files.push(fullPath);
    }
  }

  return files;
};

const extractTagContent = (html, regex) => html.match(regex)?.[1]?.trim() ?? null;
const extractMetaContent = (html, key, type = "name") => {
  const pattern = new RegExp(`<meta[^>]+${type}=["']${key}["'][^>]+content=(?:"([^"]*)"|'([^']*)')[^>]*>`, "i");
  const match = html.match(pattern);
  return match?.[1] ?? match?.[2] ?? null;
};

const injectBeforeHeadEnd = (html, snippet) => html.replace("</head>", `${snippet}\n  </head>`);
const buildRouteFromFile = (relativePath) => {
  if (relativePath === "index.html") return "/";
  return `/${relativePath.replace(/\/index\.html$/, "").replace(/index\.html$/, "").replace(/\\/g, "/")}`;
};

const patchHtmlSeo = (html, relativePath) => {
  const title = extractTagContent(html, /<title>([^<]+)<\/title>/i);
  const description = extractMetaContent(html, "description");
  const canonical = extractTagContent(html, /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["'][^>]*>/i) ?? `${baseUrl}${buildRouteFromFile(relativePath)}`;
  const heading = extractTagContent(html, /<div id="root">[\s\S]*?<h1>([^<]+)<\/h1>/i) ?? extractTagContent(html, /<h1>([^<]+)<\/h1>/i) ?? title;

  if (!title || !description || !heading) return html;

let updated = html.replace(/<noscript>[\s\S]*?<\/noscript>/i, "")
  updated = updated.replace(/(<div id="root">[\s\S]*?<main class="seo-shell">\s*)<h2>([^<]+)<\/h2>/i, "$1<h1>$2</h1>");

  if (!/<meta[^>]+property=["']og:title["']/i.test(updated)) {
    updated = injectBeforeHeadEnd(updated, `    <meta property="og:type" content="website" />\n    <meta property="og:title" content="${escapeAttribute(title)}" />\n    <meta property="og:description" content="${escapeAttribute(description)}" />\n    <meta property="og:url" content="${escapeAttribute(canonical)}" />\n    <meta property="og:site_name" content="${escapeAttribute(geoContent.brandName)}" />\n    <meta name="twitter:card" content="summary_large_image" />\n    <meta name="twitter:title" content="${escapeAttribute(title)}" />\n    <meta name="twitter:description" content="${escapeAttribute(description)}" />`);
  }

  if (!/<script[^>]+type=["']application\/ld\+json["']/i.test(updated)) {
    updated = injectBeforeHeadEnd(updated, buildWebPageJsonLd({ title, description, canonical, heading }));
  }

  // BreadcrumbList (idempotent) — niveaux selon la route
  if (!/BreadcrumbList/.test(updated)) {
    const route = buildRouteFromFile(relativePath);
    let items = null;
    if (route.startsWith("/blog/")) {
      items = [{ name: "Accueil", url: `${baseUrl}/` }, { name: "Blog", url: `${baseUrl}/blog` }, { name: title, url: canonical }];
    } else if (route !== "/" && route !== "/blog") {
      items = [{ name: "Accueil", url: `${baseUrl}/` }, { name: heading || title, url: canonical }];
    }
    if (items) {
      const bc = `    <script type="application/ld+json">{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[${items.map((it, i) => `{"@type":"ListItem","position":${i + 1},"name":"${escapeJson(it.name)}","item":"${escapeJson(it.url)}"}`).join(",")}]}</script>`;
      updated = injectBeforeHeadEnd(updated, bc);
    }
  }

  // Liens piliers dans le fallback statique des articles (idempotent)
  if (buildRouteFromFile(relativePath).startsWith("/blog/") && !updated.includes("jmmc-pillars")) {
    const pillars = `\n        <p class="jmmc-pillars"><a href="/comparateur">Comparer les assurances gratuitement</a> &middot; <a href="/blog">Tous nos articles</a></p>\n      `;
    updated = updated.replace("</main>\n    </div>", `${pillars}</main>\n    </div>`);
  }

  // Liens cross-site (réseau) dans le fallback statique — toutes pages (idempotent)
  if (!updated.includes("jmmc-network")) {
    const network = `\n        <p class="jmmc-network" style="font-size:12px;color:#6b7280;">Nos autres services : <a href="https://www.mayocreche.fr" rel="noopener">Mayo Crèche — crèche multilingue à Nice</a> &middot; <a href="https://www.mammouth-ai.com" rel="noopener">Mammouth AI — agents IA pour entrepreneurs</a></p>`;
    updated = updated.replace("</body>", `${network}\n  </body>`);
  }

  return updated;
};

const managedBlock = (name, body) => `# BEGIN JMMC ${name}\n${body.trim()}\n# END JMMC ${name}`;
const stripManagedBlock = (content, name) => content.replace(new RegExp(`\\n?# BEGIN JMMC ${name}[\\s\\S]*?# END JMMC ${name}\\n?`, "g"), "\n").trimEnd();

const collectStaticHtmlRoutes = async () => {
  const allFiles = await readDirRecursive(rootDir);
  return allFiles
    .map((file) => path.relative(rootDir, file).replace(/\\/g, "/"))
    .filter((relativePath) => relativePath.endsWith("/index.html"))
    .filter((relativePath) => !relativePath.startsWith("public/") && !relativePath.startsWith("src/"))
    .map((relativePath) => buildRouteFromFile(relativePath))
    .filter((route) => route !== "/")
    .sort((a, b) => a.localeCompare(b, "fr"));
};

const syncHostingRouteConfig = async () => {
  const routes = await collectStaticHtmlRoutes();

  const redirectsPath = path.join(rootDir, "public", "_redirects");
  const redirectsOriginal = await readFile(redirectsPath, "utf8").catch(() => "");
  const exactRewrites = routes.map((route) => `${route}   ${route}/index.html   200!`).join("\n");
  const redirectsFallback = "/*   /index.html   200";
  await writeFile(
    redirectsPath,
    `${stripManagedBlock(redirectsOriginal, "STATIC HTML ROUTES")}\n\n${managedBlock("STATIC HTML ROUTES", `${exactRewrites}\n${redirectsFallback}`)}\n`,
    "utf8",
  );

  const htaccessPath = path.join(rootDir, "public", ".htaccess");
  const htaccessOriginal = await readFile(htaccessPath, "utf8").catch(() => "");
  const apacheRewrites = routes
    .map((route) => `  RewriteRule ^${route.slice(1).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$ ${route}/index.html [L]`)
    .join("\n");
  const htaccessUpdated = stripManagedBlock(htaccessOriginal, "STATIC HTML ROUTES")
    .replace(
      /\n\s*# SPA fallback:/,
      `\n\n${managedBlock("STATIC HTML ROUTES", apacheRewrites)}\n\n  # SPA fallback:`,
    );
  await writeFile(htaccessPath, `${htaccessUpdated.trimEnd()}\n`, "utf8");

  const vercelConfig = {
    cleanUrls: true,
    trailingSlash: false,
    rewrites: [
      ...routes.map((route) => ({ source: route, destination: `${route}/index.html` })),
      { source: "/(.*)", destination: "/index.html" },
    ],
  };
  await writeFile(path.join(rootDir, "vercel.json"), `${JSON.stringify(vercelConfig, null, 2)}\n`, "utf8");
};

const syncRootIndex = async () => {
  const indexPath = path.join(rootDir, "index.html");
  const trust = geoContent.trust;
  const reviewSnippet = `${trust.ratingValueLabel}/5 sur ${trust.reviewCountLabel}+ avis vérifiés`;
  const reviewSentence = `Note moyenne ${trust.ratingValueLabel}/5 sur plus de ${trust.reviewCountLabel} avis vérifiés.`;

  const indexTemplate = await readFile(indexPath, "utf8");
  let updatedIndex = indexTemplate
    .replace(/Avis Clients \| [^']+ avis vérifiés/g, `Avis Clients | ${reviewSnippet}`)
    .replace(/Note moyenne [^.]+ avis vérifiés\./g, reviewSentence)
    .replace(/"ratingValue":"[0-9.]+","reviewCount":"\d+"/g, `"ratingValue":"${trust.ratingValueLabel}","reviewCount":"${trust.reviewCountLabel}"`)
    .replace(/<strong>[0-9.]+\/5<\/strong> — Plus de [^<]+ avis clients vérifiés/g, `<strong>${trust.ratingValueLabel}/5</strong> — Plus de ${trust.reviewCountLabel} avis clients vérifiés`)
    .replace(/<strong>[0-9.]+\/5 — Plus de [^<]+ avis clients vérifiés<\/strong>/g, `<strong>${trust.ratingValueLabel}/5 — Plus de ${trust.reviewCountLabel} avis clients vérifiés</strong>`);

  updatedIndex = patchHtmlSeo(updatedIndex, "index.html");

  if (updatedIndex !== indexTemplate) {
    await writeFile(indexPath, updatedIndex, "utf8");
  }
};

const syncExistingHtmlPages = async () => {
  const allFiles = await readDirRecursive(rootDir);
  const htmlFiles = allFiles.filter((file) => file.endsWith(".html"));

  await Promise.all(htmlFiles.map(async (filePath) => {
    const relativePath = path.relative(rootDir, filePath).replace(/\\/g, "/");
    const original = await readFile(filePath, "utf8");
    const patched = patchHtmlSeo(original, relativePath);
    if (patched !== original) {
      await writeFile(filePath, patched, "utf8");
    }
  }));
};

await syncRootIndex();

for (const page of pages) {
  const outputPath = path.join(rootDir, page.outputDir, "index.html");
  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, renderPage(page), "utf8");
}

// ============ Blog articles prerender ============
// Formatage inline appliqué APRES escapeHtml : le contenu est deja neutralise,
// on ne fait que reintroduire du balisage sur des motifs markdown reconnus.
// Sans ca, les **gras** et les [liens](/url) sortaient en texte litteral.
const inlineMarkdown = (text = "") =>
  text
    .replace(/\[([^\]]+)\]\((\/[^)\s]*|https:\/\/[^)\s]*)\)/g, (_m, label, href) => `<a href="${escapeAttribute(href)}">${label}</a>`)
    .replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>");

const markdownToHtml = (md = "") => {
  if (!md) return "";
  const escaped = inlineMarkdown(escapeHtml(md));
  const lines = escaped.split(/\r?\n/);
  const out = [];
  let inList = false;
  const closeList = () => { if (inList) { out.push("</ul>"); inList = false; } };
  for (const raw of lines) {
    const line = raw.trim();
    if (!line) { closeList(); continue; }
    if (/^######\s+/.test(line)) { closeList(); out.push(`<h6>${line.replace(/^######\s+/, "")}</h6>`); continue; }
    if (/^#####\s+/.test(line)) { closeList(); out.push(`<h5>${line.replace(/^#####\s+/, "")}</h5>`); continue; }
    if (/^####\s+/.test(line)) { closeList(); out.push(`<h4>${line.replace(/^####\s+/, "")}</h4>`); continue; }
    if (/^###\s+/.test(line)) { closeList(); out.push(`<h3>${line.replace(/^###\s+/, "")}</h3>`); continue; }
    if (/^##\s+/.test(line)) { closeList(); out.push(`<h2>${line.replace(/^##\s+/, "")}</h2>`); continue; }
    if (/^#\s+/.test(line)) { closeList(); out.push(`<h2>${line.replace(/^#\s+/, "")}</h2>`); continue; }
    if (/^[-*]\s+/.test(line)) {
      if (!inList) { out.push("<ul>"); inList = true; }
      out.push(`<li>${line.replace(/^[-*]\s+/, "")}</li>`);
      continue;
    }
    closeList();
    out.push(`<p>${line}</p>`);
  }
  closeList();
  return out.join("\n        ");
};

const renderArticle = (article, related = []) => {
  const canonical = `${baseUrl}/blog/${article.slug}`;
  // `title` reste le titre visible (H1, JSON-LD headline, fil d'Ariane) —
  // jamais réécrit par un override, pour ne pas faire diverger la page de
  // son propre H1. `metaTitle`/`description` alimentent uniquement <title>,
  // meta description, og:*/twitter:* et JSON-LD "description" (invisibles).
  const title = article.title || "Article";
  const override = metaOverrides.get(`/blog/${article.slug}`);
  const metaTitle = override?.meta_title || title;
  const description = override?.meta_description || (article.suggested_meta_description || article.short_description || article.title || "");
  const author = article.suggested_author || "Rédaction jemassuremoinscher.fr";
  const publishedAt = article.published_at || article.created_at || new Date().toISOString();
  const image = article.image_url || `${baseUrl}/opengraph-image.png`;
  const bodyHtml = markdownToHtml(article.suggested_content || "");
  const relatedHtml =
    (related && related.length)
      ? `\n        <nav aria-label="Articles sur le même thème">\n          <h2>Sur le même thème</h2>\n          <ul>\n            ${related.map((r) => `<li><a href="${escapeAttribute(`/blog/${r.slug}`)}">${escapeHtml(r.title)}</a></li>`).join("")}\n          </ul>\n        </nav>`
      : "";
  const pillarHtml = `\n        <p class="meta jmmc-pillars"><a href="/comparateur">Comparer les assurances gratuitement</a> &middot; <a href="/blog">Tous nos articles</a></p>`;

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    image,
    datePublished: publishedAt,
    dateModified: publishedAt,
    author: { "@type": "Person", name: author },
    publisher: {
      "@type": "Organization",
      name: geoContent.brandName,
      logo: { "@type": "ImageObject", url: `${baseUrl}/favicon.ico` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": canonical },
    inLanguage: "fr-FR",
  };

  return `<!doctype html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <!-- Dark mode bootstrap: apply 'dark' class before paint, based on saved preference or OS setting -->
    <script>
    (function(){
      try {
        var saved = localStorage.getItem('theme');
        var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        var isDark = saved ? saved === 'dark' : prefersDark;
        if (isDark) document.documentElement.classList.add('dark');
        // Live-update when OS preference changes (only if user hasn't chosen explicitly)
        if (window.matchMedia) {
          window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e){
            if (!localStorage.getItem('theme')) {
              document.documentElement.classList.toggle('dark', e.matches);
            }
          });
        }
      } catch(e){}
    })();
    </script>

    <title>${escapeHtml(metaTitle)}</title>
    <meta name="description" content="${escapeAttribute(description)}" />
    <meta name="robots" content="index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1" />
    <meta name="author" content="${escapeAttribute(author)}" />
    <link rel="canonical" href="${escapeAttribute(canonical)}" />
    <meta property="og:type" content="article" />
    <meta property="og:title" content="${escapeAttribute(metaTitle)}" />
    <meta property="og:description" content="${escapeAttribute(description)}" />
    <meta property="og:url" content="${escapeAttribute(canonical)}" />
    <meta property="og:image" content="${escapeAttribute(image)}" />
    <meta property="og:site_name" content="${escapeAttribute(geoContent.brandName)}" />
    <meta property="article:published_time" content="${escapeAttribute(publishedAt)}" />
    <meta property="article:author" content="${escapeAttribute(author)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeAttribute(metaTitle)}" />
    <meta name="twitter:description" content="${escapeAttribute(description)}" />
    <meta name="twitter:image" content="${escapeAttribute(image)}" />
    <script type="application/ld+json">${JSON.stringify(articleJsonLd)}</script>
    ${buildBreadcrumbJsonLd([{ name: "Accueil", url: `${baseUrl}/` }, { name: "Blog", url: `${baseUrl}/blog` }, { name: title, url: canonical }])}
    <style>
      body { margin: 0; font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif; color: #111827; background: #ffffff; }
      .seo-shell { max-width: 820px; margin: 0 auto; padding: 2rem 1rem; line-height: 1.7; }
      h1 { font-size: clamp(1.75rem, 3vw, 2.5rem); margin: 0 0 1rem; }
      h2 { font-size: 1.4rem; margin: 1.75rem 0 0.75rem; }
      h3 { font-size: 1.15rem; margin: 1.5rem 0 0.5rem; }
      ul { padding-left: 1.25rem; }
      li { margin-bottom: 0.4rem; }
      a { color: #1d4ed8; }
      .meta { color: #6b7280; font-size: 0.9rem; margin-bottom: 1.5rem; }
    </style>
  </head>
  <body>
    <noscript>
      <main class="seo-shell">
        <h2>${escapeHtml(title)}</h2>
        <p class="meta">Par <a href="/qui-sommes-nous">${escapeHtml(author)}</a> — ${escapeHtml(new Date(publishedAt).toLocaleDateString("fr-FR"))}</p>
        ${bodyHtml}${relatedHtml}${pillarHtml}
      </main>
    </noscript>

    <div id="root">
      <main class="seo-shell">
        <h1>${escapeHtml(title)}</h1>
        <p class="meta">Par <a href="/qui-sommes-nous">${escapeHtml(author)}</a> — ${escapeHtml(new Date(publishedAt).toLocaleDateString("fr-FR"))}</p>
        ${bodyHtml}${relatedHtml}${pillarHtml}
      </main>
    </div>

    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`;
};

const generateBlogArticles = async () => {
  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON, { auth: { persistSession: false } });
    const { data, error } = await supabase
      .from("seo_article_suggestions")
      .select("slug,title,suggested_content,suggested_meta_description,suggested_author,short_description,image_url,published_at,created_at,status")
      .eq("status", "approved")
      .lte("published_at", new Date().toISOString())
      .not("slug", "ilike", "%test%")
      .not("title", "ilike", "%test%")
      .order("published_at", { ascending: false })
      .limit(500);

    if (error) {
      console.warn("[generate-static-pages] Supabase error:", error.message);
      return;
    }
    if (!data?.length) {
      console.log("[generate-static-pages] No approved articles to prerender.");
      return;
    }

    let count = 0;
    let preserved = 0;
    for (const article of data) {
      if (!article.slug) continue;
      const outputPath = path.join(rootDir, "blog", article.slug, "index.html");
      // Un doublon SEO consolidé (noindex manuel) ne doit jamais être régénéré à
      // l'identique depuis Supabase : sans ce garde-fou, ce prerender écrase le
      // noindex à chaque build et le fait réapparaître dans le sitemap.
      try {
        const existing = await readFile(outputPath, "utf8");
        const robotsTag = existing.match(/<meta[^>]+name=["']robots["'][^>]*>/i)?.[0] || "";
        if (/noindex/i.test(robotsTag)) {
          preserved += 1;
          continue;
        }
      } catch {
        // pas de fichier existant -> génération normale ci-dessous
      }
      await mkdir(path.dirname(outputPath), { recursive: true });
      await writeFile(outputPath, renderArticle(article), "utf8");
      count += 1;
    }
    console.log(`[generate-static-pages] Prerendered ${count} blog articles (${preserved} noindex préservés).`);
  } catch (err) {
    console.warn("[generate-static-pages] Skipping blog prerender:", err?.message || err);
  }
};

await generateBlogArticles();

// ============ Local blog articles prerender (src/data/blogArticles*.ts) ============
// Mirrors the Supabase prerender but sources articles from the in-repo TS files that
// the SPA itself renders. Only fills slugs that don't already have a page (Supabase wins).
const FR_MONTHS = { janvier: 0, "février": 1, fevrier: 1, mars: 2, avril: 3, mai: 4, juin: 5, juillet: 6, "août": 7, aout: 7, septembre: 8, octobre: 9, novembre: 10, "décembre": 11, decembre: 11 };
const parseFrenchDate = (d = "") => {
  const parts = String(d).trim().replace(/^1er/, "1").split(/\s+/);
  if (parts.length >= 3) {
    const day = parseInt(parts[0], 10);
    const month = FR_MONTHS[parts[1].toLowerCase()];
    const year = parseInt(parts[2], 10);
    if (!Number.isNaN(day) && month !== undefined && !Number.isNaN(year)) return new Date(Date.UTC(year, month, day, 12));
  }
  const fb = new Date(d);
  return Number.isNaN(fb.getTime()) ? new Date() : fb;
};

const generateLocalBlogArticles = async () => {
  let vite;
  try {
    const { createServer } = await import("vite");
    const stubAssets = {
      name: "stub-assets",
      enforce: "pre",
      resolveId(id) { if (/\.(jpg|jpeg|png|webp|svg|gif|avif)(\?.*)?$/.test(id)) return "\0stub:" + id; },
      load(id) { if (id.startsWith("\0stub:")) return `export default ${JSON.stringify(id.slice(6))};`; },
    };
    vite = await createServer({
      configFile: false,
      root: rootDir,
      resolve: { alias: { "@": path.join(rootDir, "src") } },
      plugins: [stubAssets],
      server: { middlewareMode: true },
      optimizeDeps: { noDiscovery: true, include: [] },
      logLevel: "silent",
    });
    const mod = await vite.ssrLoadModule(path.join(rootDir, "src/data/blogArticles.ts"));
    const articles = mod.blogArticles || [];
    const byCat = {};
    for (const a of articles) {
      if (!a?.slug || a.noindex) continue;
      (byCat[a.category] = byCat[a.category] || []).push({ slug: a.slug, title: a.title });
    }
    let created = 0;
    let skipped = 0;
    for (const a of articles) {
      if (!a?.slug || a.noindex) continue;
      const outputPath = path.join(rootDir, "blog", a.slug, "index.html");
      try {
        await access(outputPath);
        skipped += 1;
        continue;
      } catch {
        // no existing file -> generate
      }
      const mapped = {
        slug: a.slug,
        title: a.title,
        suggested_meta_description: a.description,
        short_description: a.description,
        suggested_content: a.content,
        suggested_author: a.author,
        published_at: parseFrenchDate(a.date).toISOString(),
        image_url: a.image || undefined,
      };
      const related = (byCat[a.category] || []).filter((r) => r.slug !== a.slug).slice(0, 3);
      await mkdir(path.dirname(outputPath), { recursive: true });
      await writeFile(outputPath, renderArticle(mapped, related), "utf8");
      created += 1;
    }
    console.log(`[generate-static-pages] Local blog articles: ${created} created, ${skipped} already present.`);
  } catch (err) {
    console.warn("[generate-static-pages] Skipping local blog prerender:", err?.message || err);
  } finally {
    if (vite) await vite.close().catch(() => {});
  }
};

await generateLocalBlogArticles();


// ============ Glossary terms prerender ============
const generateGlossaryTerms = async () => {
  let vite;
  try {
    // Le parsing regex precedent ne pouvait lire que term/slug/definition : content,
    // relatedTerms et relatedProducts restaient inaccessibles. On charge le module
    // comme le fait le generateur profil, ce qui donne acces a tous les champs.
    const { createServer } = await import("vite");
    vite = await createServer({
      configFile: false,
      root: rootDir,
      resolve: { alias: { "@": path.join(rootDir, "src") } },
      server: { middlewareMode: true },
      optimizeDeps: { noDiscovery: true, include: [] },
      logLevel: "silent",
    });
    const mod = await vite.ssrLoadModule(path.join(rootDir, "src/data/glossaryTerms.ts"));
    const terms = mod.glossaryTerms || [];
    const byId = new Map(terms.map((t) => [String(t.id), t]));

    let count = 0;
    for (const t of terms) {
      if (!t?.slug || !t.term || !t.definition) continue;
      const title = `${t.term} : définition assurance | ${geoContent.brandName}`;
      const description = t.definition.length > 155 ? `${t.definition.slice(0, 152)}...` : t.definition;

      // `definition` est deja rendue en intro sous le H1 : on ne la repete pas
      // en section, ce qui evitait ~440 mots dupliques sur les 25 pages.
      const sections = [];

      if (typeof t.content === "string" && t.content.trim()) {
        sections.push({ title: `Tout savoir sur : ${t.term}`, html: markdownToHtml(t.content) });
      }

      const related = (t.relatedTerms || [])
        .map((id) => byId.get(String(id)))
        .filter((r) => r && r.slug && r.term)
        .map((r) => ({ href: `/glossaire/${r.slug}`, label: r.term }));
      if (related.length) {
        sections.push({ title: "Termes liés", list: related });
      }

      const products = (t.relatedProducts || []).filter((pr) => pr?.url && pr?.label)
        .map((pr) => ({ href: pr.url, label: pr.label }));
      if (products.length) {
        sections.push({ title: "Produits d'assurance concernés", list: products });
      }

      sections.push({ title: "Voir aussi", list: [
        { href: "/glossaire", label: "Tous les termes du glossaire" },
        { href: "/comparateur", label: "Comparer les assurances" },
      ]});

      const page = {
        route: `/glossaire/${t.slug}`,
        title,
        description,
        h1: t.term,
        intro: t.definition,
        sections,
        ctaHref: "/comparateur",
        ctaLabel: "Comparer les assurances",
      };
      const outputPath = path.join(rootDir, "glossaire", t.slug, "index.html");
      await mkdir(path.dirname(outputPath), { recursive: true });
      await writeFile(outputPath, renderPage(page), "utf8");
      count += 1;
    }
    console.log(`[generate-static-pages] Prerendered ${count} glossary terms.`);
  } catch (err) {
    console.warn("[generate-static-pages] Skipping glossary prerender:", err?.message || err);
  } finally {
    if (vite) await vite.close();
  }
};

await generateGlossaryTerms();

const generateLandingAndProfilePages = async () => {
  let vite;
  try {
    const { createServer } = await import("vite");
    const stubAssets = {
      name: "stub-assets",
      enforce: "pre",
      resolveId(id) { if (/\.(jpg|jpeg|png|webp|svg|gif|avif)(\?.*)?$/.test(id)) return "\0stub:" + id; },
      load(id) { if (id.startsWith("\0stub:")) return `export default ${JSON.stringify(id.slice(6))};`; },
    };
    vite = await createServer({
      configFile: false,
      root: rootDir,
      resolve: { alias: { "@": path.join(rootDir, "src") } },
      plugins: [stubAssets],
      server: { middlewareMode: true },
      optimizeDeps: { noDiscovery: true, include: [] },
      logLevel: "silent",
    });

    const relatedList = {
      title: "Voir aussi",
      list: [
        { href: "/comparateur", label: "Comparateur d'assurances gratuit" },
        { href: "/assurance-auto", label: "Assurance auto" },
        { href: "/assurance-sante", label: "Mutuelle santé" },
        { href: "/assurance-habitation", label: "Assurance habitation" },
      ],
    };

    // ---- Landing pages (src/data/landingConfigs.tsx) ----
    let lCreated = 0, lSkipped = 0;
    try {
      const landingMod = await vite.ssrLoadModule(path.join(rootDir, "src/data/landingConfigs.tsx"));
      const configs = landingMod.landingConfigs || {};
      for (const [key, raw] of Object.entries(configs)) {
        const cfg = raw && raw.fr ? raw.fr : raw;
        if (!cfg || !cfg.seoTitle || !cfg.seoDescription) continue;
        const outputPath = path.join(rootDir, "landing", key, "index.html");
        try { await access(outputPath); lSkipped += 1; continue; } catch {}
        const h1 = [cfg.heroTitle, cfg.heroHighlight].filter(Boolean).join(" ").replace(/\s+/g, " ").trim() || cfg.seoTitle;
        const page = {
          route: `/landing/${key}`,
          // cfg.seoTitle etait valide par le garde-fou ci-dessus mais jamais
          // transmis : renderPage tombait sur page.title === undefined et
          // emettait <title></title> sur 35 des 36 landings.
          title: cfg.seoTitle,
          description: cfg.seoDescription,
          h1,
          intro: cfg.seoDescription,
          sections: [
            { title: "Pourquoi comparer avec jemassuremoinscher.fr ?", body: "Courtier indépendant, immatriculation ORIAS en cours. Comparez plus de 70 assureurs partenaires en 2 minutes, gratuitement et sans engagement." },
            relatedList,
          ],
          ctaHref: "/comparateur",
          ctaLabel: "Comparer gratuitement",
        };
        await mkdir(path.dirname(outputPath), { recursive: true });
        await writeFile(outputPath, renderPage(page), "utf8");
        lCreated += 1;
      }
      console.log(`[generate-static-pages] Landing pages: ${lCreated} created, ${lSkipped} already present.`);
    } catch (err) {
      console.warn("[generate-static-pages] Skipping landing prerender:", err?.message || err);
    }

    // Expose dans le HTML statique le contenu déjà présent dans nicheInsuranceData.ts
    // (expertiseBlocks, solutions, faqs...) — auparavant seul un paragraphe générique
    // était émis, ce qui laissait ces pages à ~85 mots pour les robots sans JS.
    const buildProfilSections = (prof, related) => {
      const sections = [];

      if (prof.heroSubtitle) {
        sections.push({ title: prof.heroTitle || prof.title, body: prof.heroSubtitle });
      }

      for (const block of prof.expertiseBlocks || []) {
        if (block?.title && block?.content) sections.push({ title: block.title, body: block.content });
      }

      if (typeof prof.expertContent === "string" && prof.expertContent.trim()) {
        sections.push({
          title: "L'analyse de nos courtiers",
          paragraphs: prof.expertContent.split(/\n{2,}/).map((s) => s.trim()).filter(Boolean),
        });
      }

      if (prof.surchargeExplanation) {
        sections.push({ title: prof.surchargeLabel || "Majoration appliquée", body: prof.surchargeExplanation });
      }

      if (prof.solutions?.length) {
        sections.push({
          title: "Formules et tarifs indicatifs",
          table: {
            headers: ["Formule", "Couverture", "Franchise", "Prix indicatif", "Idéal pour"],
            rows: prof.solutions.map((s) => [s.formule, s.couverture, s.franchise, s.prixIndicatif, s.ideal]),
          },
        });
      }

      if (prof.faqs?.length) {
        sections.push({ title: "Questions fréquentes", faqs: prof.faqs });
      }

      sections.push({ title: "Un accompagnement adapté à votre profil", body: "Nos courtiers partenaires sont spécialisés dans les profils spécifiques et négocient des solutions auprès d'assureurs adaptés. Comparaison gratuite, sans engagement." });
      sections.push(related);
      return sections;
    };

    // ---- Profil pages (src/data/nicheInsuranceData.ts) ----
    let pCreated = 0, pSkipped = 0;
    try {
      const profilMod = await vite.ssrLoadModule(path.join(rootDir, "src/data/nicheInsuranceData.ts"));
      const profiles = profilMod.nicheProfiles || [];
      for (const prof of profiles) {
        if (!prof?.slug || !prof.title || !prof.metaDescription) continue;
        const outputPath = path.join(rootDir, "profil", prof.slug, "index.html");
        try { await access(outputPath); pSkipped += 1; continue; } catch {}
        const page = {
          route: `/profil/${prof.slug}`,
          title: prof.title,
          description: prof.metaDescription,
          h1: prof.title,
          intro: prof.metaDescription,
          sections: buildProfilSections(prof, relatedList),
          ctaHref: "/comparateur",
          ctaLabel: "Trouver mon assurance",
        };
        await mkdir(path.dirname(outputPath), { recursive: true });
        await writeFile(outputPath, renderPage(page), "utf8");
        pCreated += 1;
      }
      console.log(`[generate-static-pages] Profil pages: ${pCreated} created, ${pSkipped} already present.`);
    } catch (err) {
      console.warn("[generate-static-pages] Skipping profil prerender:", err?.message || err);
    }
  } catch (err) {
    console.warn("[generate-static-pages] Skipping landing/profil prerender:", err?.message || err);
  } finally {
    if (vite) await vite.close().catch(() => {});
  }
};

await generateLandingAndProfilePages();

await syncExistingHtmlPages();

// NOTE: hosting route config sync removed.
// Vercel handles directory-index resolution natively with cleanUrls.
// vercel.json now contains a minimal SPA fallback only.
// await syncHostingRouteConfig();


// ============ Blog sitemap sync ============
// Régénère la section <url> /blog/ de public/sitemap.xml à partir des articles
// réellement pré-rendus sur le disque (Supabase + src/data/blogArticles*.ts).
// Retire les URLs blog sans page (fantômes), ajoute les pages orphelines,
// exclut les pages noindex, et laisse TOUTES les autres sections intactes.
const syncBlogSitemap = async () => {
  try {
    const sitemapPath = path.join(rootDir, "public", "sitemap.xml");
    let xml;
    try {
      xml = await readFile(sitemapPath, "utf8");
    } catch {
      console.warn("[sitemap] public/sitemap.xml introuvable — skip blog sync.");
      return;
    }

    const blogDir = path.join(rootDir, "blog");
    let entries;
    try {
      entries = await readdir(blogDir, { withFileTypes: true });
    } catch {
      console.warn("[sitemap] répertoire blog/ introuvable — skip blog sync.");
      return;
    }

    const slugs = [];
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      let html;
      try {
        html = await readFile(path.join(blogDir, entry.name, "index.html"), "utf8");
      } catch {
        continue; // pas de page rendue -> ignorer
      }
      // Ne jamais lister une page noindex dans le sitemap
      const robotsTag = html.match(/<meta[^>]+name=["']robots["'][^>]*>/i)?.[0] || "";
      if (/noindex/i.test(robotsTag)) continue;
      slugs.push(entry.name);
    }

    if (!slugs.length) {
      console.warn("[sitemap] aucun article blog indexable — skip blog sync.");
      return;
    }
    slugs.sort();

    const today = new Date().toISOString().slice(0, 10);
    const blogBlockArr = [];
    for (const slug of slugs) {
      let img = "";
      try {
        const h = await readFile(path.join(blogDir, slug, "index.html"), "utf8");
        img = h.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)?.[1] || "";
      } catch {}
      if (img.startsWith("/")) img = `${baseUrl}${img}`;
      const imageTag = img ? `\n    <image:image>\n      <image:loc>${img}</image:loc>\n    </image:image>` : "";
      blogBlockArr.push(`  <url>\n    <loc>${baseUrl}/blog/${slug}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.9</priority>${imageTag}\n  </url>`);
    }
    const blogBlocks = blogBlockArr.join("\n");

    const withoutBlog = xml.replace(
      /[ \t]*<url>\s*<loc>[^<]*\/blog\/[^<]*<\/loc>[\s\S]*?<\/url>\s*\n?/g,
      ""
    );
    const updated = withoutBlog.replace(/<\/urlset>/, `${blogBlocks}\n</urlset>\n`);

    if (updated !== xml) {
      await writeFile(sitemapPath, updated, "utf8");
      const total = (updated.match(/<url>/g) || []).length;
      console.log(`[sitemap] Section blog régénérée: ${slugs.length} URLs blog (total sitemap ${total}).`);
    } else {
      console.log(`[sitemap] Section blog déjà alignée (${slugs.length} URLs).`);
    }
  } catch (err) {
    console.warn("[sitemap] Skipping blog sitemap sync:", err?.message || err);
  }
};

await syncBlogSitemap();


// ============ Landing & Profil sitemap sync ============
const syncLandingProfileSitemap = async () => {
  try {
    const sitemapPath = path.join(rootDir, "public", "sitemap.xml");
    let xml;
    try { xml = await readFile(sitemapPath, "utf8"); } catch { return; }
    const today = new Date().toISOString().slice(0, 10);
    let blocks = "";
    for (const [dir, prefix, priority] of [["landing", "/landing/", "0.8"], ["profil", "/profil/", "0.7"]]) {
      let entries;
      try { entries = await readdir(path.join(rootDir, dir), { withFileTypes: true }); } catch { continue; }
      const slugs = [];
      for (const e of entries) {
        if (!e.isDirectory()) continue;
        let html;
        try { html = await readFile(path.join(rootDir, dir, e.name, "index.html"), "utf8"); } catch { continue; }
        const robots = html.match(/<meta[^>]+name=["']robots["'][^>]*>/i)?.[0] || "";
        if (/noindex/i.test(robots)) continue;
        slugs.push(e.name);
      }
      slugs.sort();
      const re = new RegExp(`[ \\t]*<url>\\s*<loc>[^<]*${prefix.replace(/\//g, "\\/")}[^<]*<\\/loc>[\\s\\S]*?<\\/url>\\s*\\n?`, "g");
      xml = xml.replace(re, "");
      if (slugs.length) {
        blocks += slugs.map((s) => `  <url>\n    <loc>${baseUrl}${prefix}${s}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>${priority}</priority>\n  </url>`).join("\n") + "\n";
      }
    }
    if (blocks) {
      const updated = xml.replace(/<\/urlset>/, `${blocks}</urlset>\n`);
      if (updated !== xml) {
        await writeFile(sitemapPath, updated, "utf8");
        const total = (updated.match(/<url>/g) || []).length;
        console.log(`[sitemap] Sections landing/profil régénérées (total sitemap ${total}).`);
      }
    }
  } catch (err) {
    console.warn("[sitemap] Skipping landing/profil sitemap sync:", err?.message || err);
  }
};

await syncLandingProfileSitemap();
