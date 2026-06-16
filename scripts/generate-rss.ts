// scripts/generate-rss.ts — génère dist/rss.xml au build (après vite build)

import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { blogArticles } from "../src/data/blogArticles";

const SITE = "https://www.jemassuremoinscher.fr";

const FR_MONTHS: Record<string, number> = {
  janvier:0, février:1, mars:2, avril:3, mai:4, juin:5,
  juillet:6, août:7, septembre:8, octobre:9, novembre:10, décembre:11,
};

function parseFrenchDate(d: string): Date {
  const p = (d || "").trim().split(/\s+/);
  if (p.length === 3) {
    const day = parseInt(p[0],10);
    const month = FR_MONTHS[p[1].toLowerCase()] ?? 0;
    const year = parseInt(p[2],10);
    return new Date(Date.UTC(year, month, day, 9, 0, 0));
  }
  return new Date();
}

const toRFC822 = (d: Date) => d.toUTCString();
const cdata = (s: string) => `<![CDATA[${(s||"").replace(/]]>/g,"]]]]><![CDATA[>")}]]>`;
const escapeXml = (s: string) => (s||"")
  .replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")
  .replace(/"/g,"&quot;").replace(/'/g,"&apos;");

const items = [...blogArticles]
  .sort((a,b) => parseFrenchDate(b.date).getTime() - parseFrenchDate(a.date).getTime())
  .slice(0, 20);

const lastBuildDate = toRFC822(new Date());

const itemsXml = items.map((a) => {
  const url = `${SITE}/blog/${a.slug}`;
  const pubDate = toRFC822(parseFrenchDate(a.date));
  return `    <item>
      <title>${cdata(a.title)}</title>
      <link>${escapeXml(url)}</link>
      <guid isPermaLink="true">${escapeXml(url)}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${cdata(a.description || a.title)}</description>
    </item>`;
}).join("\n");

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Blog jemassuremoinscher.fr — Conseils &amp; guides assurance</title>
    <link>${SITE}</link>
    <description>Conseils, guides pratiques et actualités sur les assurances en France : auto, santé, habitation, emprunteur, pro.</description>
    <language>fr-FR</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${SITE}/rss.xml" rel="self" type="application/rss+xml"/>
${itemsXml}
  </channel>
</rss>
`;

const outPath = resolve(process.cwd(), "dist", "rss.xml");
writeFileSync(outPath, xml, "utf-8");
console.log(`RSS genere: ${outPath} (${items.length} articles)`);
