// Vercel Serverless Function — RSS 2.0 feed of the blog.
// Reuses the same article source as the blog pages (src/data/blogArticles.ts).
// Served at /rss.xml via a rewrite in vercel.json.

import { blogArticles } from "../src/data/blogArticles";

const SITE = "https://www.jemassuremoinscher.fr";

const FR_MONTHS: Record<string, number> = {
  janvier: 0, février: 1, mars: 2, avril: 3, mai: 4, juin: 5,
  juillet: 6, août: 7, septembre: 8, octobre: 9, novembre: 10, décembre: 11,
};

function parseFrenchDate(d: string): Date {
  const parts = (d || "").trim().split(/\s+/);
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const month = FR_MONTHS[parts[1].toLowerCase()] ?? 0;
    const year = parseInt(parts[2], 10);
    // 09:00:00 GMT so the RFC-822 date is stable & explicit.
    return new Date(Date.UTC(year, month, day, 9, 0, 0));
  }
  return new Date();
}

function toRFC822(d: Date): string {
  // e.g. "Tue, 10 Jun 2026 09:00:00 GMT"
  return d.toUTCString();
}

function cdata(s: string): string {
  return `<![CDATA[${(s || "").replace(/]]>/g, "]]]]><![CDATA[>")}]]>`;
}

function escapeXml(s: string): string {
  return (s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export default function handler(_req: any, res: any) {
  const items = [...blogArticles]
    .sort(
      (a, b) =>
        parseFrenchDate(b.date).getTime() - parseFrenchDate(a.date).getTime(),
    )
    .slice(0, 20);

  const lastBuildDate = toRFC822(new Date());

  const itemsXml = items
    .map((a) => {
      const url = `${SITE}/blog/${a.slug}`;
      const pubDate = toRFC822(parseFrenchDate(a.date));
      return `    <item>
      <title>${cdata(a.title)}</title>
      <link>${escapeXml(url)}</link>
      <guid isPermaLink="true">${escapeXml(url)}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${cdata(a.description || a.title)}</description>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Blog jemassuremoinscher.fr — Conseils & guides assurance</title>
    <link>${SITE}</link>
    <description>Conseils, guides pratiques et actualités sur les assurances en France : auto, santé, habitation, emprunteur, pro.</description>
    <language>fr-FR</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${SITE}/rss.xml" rel="self" type="application/rss+xml"/>
${itemsXml}
  </channel>
</rss>
`;

  res.setHeader("Content-Type", "application/rss+xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
  res.status(200).send(xml);
}
