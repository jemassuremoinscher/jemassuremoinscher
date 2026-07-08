// scripts/generate-rss.mjs
// Génère dist/rss.xml au build en parsant dist/sitemap.xml — zéro import src/.
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const SITE = "https://www.jemassuremoinscher.fr";
const root = process.cwd();

const sitemap = readFileSync(resolve(root, "dist", "sitemap.xml"), "utf-8");

const blogRe = /<url>\s*<loc>(https:\/\/www\.jemassuremoinscher\.fr\/blog\/([^<]+))<\/loc>(?:\s*<lastmod>([^<]+)<\/lastmod>)?/g;
const items = [];
let m;
while ((m = blogRe.exec(sitemap)) !== null) {
    items.push({ url: m[1], slug: m[2], lastmod: m[3] || "" });
}

const toRFC822 = (iso) => {
    if (!iso) return new Date().toUTCString();
    return new Date(iso).toUTCString();
};
const esc = (s) => (s || "").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
const cdata = (s) => `<![CDATA[${(s||"").replace(/]]>/g,"]]]]><![CDATA[>")}]]>`;

const getTitle = (slug) => {
    try {
          const html = readFileSync(resolve(root, "dist", "blog", slug, "index.html"), "utf-8");
          const t = html.match(/<title>([^<]+)<\/title>/);
          return t ? t[1].replace(/ \| jemassuremoinscher\.fr$/, "").trim() : slug;
    } catch { return slug; }
};

const getDesc = (slug) => {
    try {
          const html = readFileSync(resolve(root, "dist", "blog", slug, "index.html"), "utf-8");
          const d = html.match(/<meta name="description" content="([^"]+)"/);
          return d ? d[1] : "";
    } catch { return ""; }
};

// Date réelle de publication de l'article (stable dans le temps), lue depuis la
// balise <meta property="article:published_time"> de chaque page blog.
// NE PAS utiliser le <lastmod> du sitemap : celui-ci est réécrit à la date du
// build à chaque déploiement pour TOUS les articles (cf. syncBlogSitemap dans
// generate-static-pages.mjs), ce qui rendait le tri "derniers articles" et le
// pubDate du flux RSS instables — un article différent (parfois ancien) pouvait
// ressortir "en tête" à chaque build, provoquant des republications en boucle
// côté automatisations (Make/LinkedIn/Facebook).
const getPublishedTime = (slug) => {
    try {
          const html = readFileSync(resolve(root, "dist", "blog", slug, "index.html"), "utf-8");
          const p = html.match(/<meta property="article:published_time" content="([^"]+)"/);
          return p ? p[1] : null;
    } catch { return null; }
};

for (const it of items) {
    it.publishedTime = getPublishedTime(it.slug) || it.lastmod;
}

items.sort((a, b) => (b.publishedTime > a.publishedTime ? 1 : -1));
const top = items.slice(0, 20);

const itemsXml = top.map((a) => {
    const title = getTitle(a.slug);
    const desc = getDesc(a.slug);
    const pubDate = toRFC822(a.publishedTime);
    return `  <item>
        <title>${cdata(title)}</title>
            <link>${esc(a.url)}</link>
                <guid isPermaLink="true">${esc(a.url)}</guid>
                    <pubDate>${pubDate}</pubDate>
                        <description>${cdata(desc || title)}</description>
                          </item>`;
}).join("\n");

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
      <title>Blog jemassuremoinscher.fr — Conseils &amp; guides assurance</title>
          <link>${SITE}</link>
              <description>Conseils, guides pratiques et actualités sur les assurances en France.</description>
                  <language>fr-FR</language>
                      <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
                          <atom:link href="${SITE}/rss.xml" rel="self" type="application/rss+xml"/>
                          ${itemsXml}
                            </channel>
                            </rss>`;

const out = resolve(root, "dist", "rss.xml");
writeFileSync(out, xml, "utf-8");
console.log(`RSS OK → ${out} (${top.length} articles, tri par date de publication réelle)`);
