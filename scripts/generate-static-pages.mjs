import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

const rootDir = process.cwd();
const geoContentPath = path.join(rootDir, "src/data/geo-content.json");
const geoContent = JSON.parse(await readFile(geoContentPath, "utf8"));

const { baseUrl, staticPages: pages } = geoContent;
const excludedDirectories = new Set(["dist", "node_modules", ".git", "test-hosting-paths"]);

const escapeHtml = (value = "") => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
const escapeAttribute = (value = "") => escapeHtml(value).replaceAll('"', "&quot;");
const escapeJson = (value = "") => value.replaceAll("\\", "\\\\").replaceAll('"', '\\"');

const renderSection = (section) => {
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
      <p>${escapeHtml(section.body)}</p>
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

const renderPage = (page) => {
  const canonical = `${baseUrl}${page.route}`;
  return `<!doctype html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(page.title)}</title>
    <meta name="description" content="${escapeAttribute(page.description)}" />
    <meta name="robots" content="index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1" />
    <link rel="canonical" href="${escapeAttribute(canonical)}" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="${escapeAttribute(page.title)}" />
    <meta property="og:description" content="${escapeAttribute(page.description)}" />
    <meta property="og:url" content="${escapeAttribute(canonical)}" />
    <meta property="og:site_name" content="${escapeAttribute(geoContent.brandName)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeAttribute(page.title)}" />
    <meta name="twitter:description" content="${escapeAttribute(page.description)}" />
${buildWebPageJsonLd({ title: page.title, description: page.description, canonical, heading: page.h1 })}
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

  let updated = html.replace(/<noscript>([\s\S]*?)<\/noscript>/i, (match) => match.replace(/<h1>([^<]+)<\/h1>/i, "<h2>$1</h2>"));

  if (!/<meta[^>]+property=["']og:title["']/i.test(updated)) {
    updated = injectBeforeHeadEnd(updated, `    <meta property="og:type" content="website" />\n    <meta property="og:title" content="${escapeAttribute(title)}" />\n    <meta property="og:description" content="${escapeAttribute(description)}" />\n    <meta property="og:url" content="${escapeAttribute(canonical)}" />\n    <meta property="og:site_name" content="${escapeAttribute(geoContent.brandName)}" />\n    <meta name="twitter:card" content="summary_large_image" />\n    <meta name="twitter:title" content="${escapeAttribute(title)}" />\n    <meta name="twitter:description" content="${escapeAttribute(description)}" />`);
  }

  if (!/<script[^>]+type=["']application\/ld\+json["']/i.test(updated)) {
    updated = injectBeforeHeadEnd(updated, buildWebPageJsonLd({ title, description, canonical, heading }));
  }

  return updated;
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

await syncExistingHtmlPages();