import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const rootDir = process.cwd();
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || "https://ybqxpngkbgosobtetxac.supabase.co";
const SUPABASE_ANON = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlicXhwbmdrYmdvc29idGV0eGFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyNTM0NzksImV4cCI6MjA3NzgyOTQ3OX0.ekYS4QpTPlcJ82Cf4xXvwS1LsM4LhFodG-u31Mb7Rbg";
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
  updated = updated.replace(/(<div id="root">[\s\S]*?<main class="seo-shell">\s*)<h2>([^<]+)<\/h2>/i, "$1<h1>$2</h1>");

  if (!/<meta[^>]+property=["']og:title["']/i.test(updated)) {
    updated = injectBeforeHeadEnd(updated, `    <meta property="og:type" content="website" />\n    <meta property="og:title" content="${escapeAttribute(title)}" />\n    <meta property="og:description" content="${escapeAttribute(description)}" />\n    <meta property="og:url" content="${escapeAttribute(canonical)}" />\n    <meta property="og:site_name" content="${escapeAttribute(geoContent.brandName)}" />\n    <meta name="twitter:card" content="summary_large_image" />\n    <meta name="twitter:title" content="${escapeAttribute(title)}" />\n    <meta name="twitter:description" content="${escapeAttribute(description)}" />`);
  }

  if (!/<script[^>]+type=["']application\/ld\+json["']/i.test(updated)) {
    updated = injectBeforeHeadEnd(updated, buildWebPageJsonLd({ title, description, canonical, heading }));
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
const markdownToHtml = (md = "") => {
  if (!md) return "";
  const escaped = escapeHtml(md);
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

const renderArticle = (article) => {
  const canonical = `${baseUrl}/blog/${article.slug}`;
  const title = article.title || "Article";
  const description = article.suggested_meta_description || article.short_description || article.title || "";
  const author = article.suggested_author || "Rédaction jemassuremoinscher.fr";
  const publishedAt = article.published_at || article.created_at || new Date().toISOString();
  const image = article.image_url || `${baseUrl}/opengraph-image.png`;
  const bodyHtml = markdownToHtml(article.suggested_content || "");

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
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeAttribute(description)}" />
    <meta name="robots" content="index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1" />
    <meta name="author" content="${escapeAttribute(author)}" />
    <link rel="canonical" href="${escapeAttribute(canonical)}" />
    <meta property="og:type" content="article" />
    <meta property="og:title" content="${escapeAttribute(title)}" />
    <meta property="og:description" content="${escapeAttribute(description)}" />
    <meta property="og:url" content="${escapeAttribute(canonical)}" />
    <meta property="og:image" content="${escapeAttribute(image)}" />
    <meta property="og:site_name" content="${escapeAttribute(geoContent.brandName)}" />
    <meta property="article:published_time" content="${escapeAttribute(publishedAt)}" />
    <meta property="article:author" content="${escapeAttribute(author)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeAttribute(title)}" />
    <meta name="twitter:description" content="${escapeAttribute(description)}" />
    <meta name="twitter:image" content="${escapeAttribute(image)}" />
    <script type="application/ld+json">${JSON.stringify(articleJsonLd)}</script>
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
        <p class="meta">Par ${escapeHtml(author)} — ${escapeHtml(new Date(publishedAt).toLocaleDateString("fr-FR"))}</p>
        ${bodyHtml}
      </main>
    </noscript>

    <div id="root">
      <main class="seo-shell">
        <h1>${escapeHtml(title)}</h1>
        <p class="meta">Par ${escapeHtml(author)} — ${escapeHtml(new Date(publishedAt).toLocaleDateString("fr-FR"))}</p>
        ${bodyHtml}
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
    for (const article of data) {
      if (!article.slug) continue;
      const outputPath = path.join(rootDir, "blog", article.slug, "index.html");
      await mkdir(path.dirname(outputPath), { recursive: true });
      await writeFile(outputPath, renderArticle(article), "utf8");
      count += 1;
    }
    console.log(`[generate-static-pages] Prerendered ${count} blog articles.`);
  } catch (err) {
    console.warn("[generate-static-pages] Skipping blog prerender:", err?.message || err);
  }
};

await generateBlogArticles();

await syncExistingHtmlPages();