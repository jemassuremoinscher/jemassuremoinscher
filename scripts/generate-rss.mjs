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

items.sort((a, b) => (b.lastmod > a.lastmod ? 1 : -1));
const top = items.slice(0, 20);

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

const itemsXml = top.map((a) => {
  const title = getTitle(a.slug);
  const desc = getDesc(a.slug);
  const pubDate = toRFC822(a.lastmod);
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
console.log(`RSS OK → ${out} (${top.length} articles)`);
