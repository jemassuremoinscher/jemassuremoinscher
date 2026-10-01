/**
 * Contrôle post-build : fait échouer le build si le HTML servi d'un article
 * local (dist/blog/<slug>/index.html) ne correspond plus à sa source TS
 * (src/data/blogArticles*.ts).
 *
 * Bug trouvé le 2026-10-01 : ces pages n'étaient créées qu'une fois par
 * generate-static-pages.mjs, puis jamais réécrites ; 77 sur 80 servaient en
 * production un contenu périmé (auteurs fictifs, chiffres retirés de la
 * source). Le générateur les régénère désormais à chaque build et y écrit
 * l'empreinte de la source (meta jmmc-source-hash) ; ce script la recalcule
 * et compare. Exemptés : pages écrites depuis Supabase (meta jmmc-source =
 * supabase : la base prime) et LOCAL_ARTICLES_CREATE_ONLY. Les pages en
 * noindex sont contrôlées aussi : le générateur les régénère en gardant
 * leur balise robots.
 */
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { LOCAL_ARTICLES_CREATE_ONLY, localArticleSourceHash } from "./lib/local-article-source.mjs";

const rootDir = process.cwd();
const distDir = path.join(rootDir, "dist");

const main = async () => {
  if (!existsSync(distDir)) {
    console.error("[verify-local-articles] dist/ introuvable — build d'abord.");
    process.exit(1);
  }

  const { createServer } = await import("vite");
  const stubAssets = {
    name: "stub-assets",
    enforce: "pre",
    resolveId(id) { if (/\.(jpg|jpeg|png|webp|svg|gif|avif)(\?.*)?$/.test(id)) return "\0stub:" + id; },
    load(id) { if (id.startsWith("\0stub:")) return `export default ${JSON.stringify(id.slice(6))};`; },
  };
  const vite = await createServer({
    configFile: false,
    root: rootDir,
    resolve: { alias: { "@": path.join(rootDir, "src") } },
    plugins: [stubAssets],
    server: { middlewareMode: true },
    optimizeDeps: { noDiscovery: true, include: [] },
    logLevel: "silent",
  });

  const stale = [];
  const missing = [];
  let checked = 0;
  let exempt = 0;

  try {
    const mod = await vite.ssrLoadModule(path.join(rootDir, "src/data/blogArticles.ts"));
    for (const a of mod.blogArticles || []) {
      if (!a?.slug || a.noindex) continue;
      if (LOCAL_ARTICLES_CREATE_ONLY.has(a.slug)) { exempt += 1; continue; }
      const distFile = path.join(distDir, "blog", a.slug, "index.html");
      if (!existsSync(distFile)) { missing.push(a.slug); continue; }
      const html = await readFile(distFile, "utf8");
      if (/name=["']jmmc-source["'][^>]*content=["']supabase["']/i.test(html)) { exempt += 1; continue; }
      checked += 1;
      const actual = html.match(/<meta name="jmmc-source-hash" content="([^"]*)"/)?.[1] ?? null;
      if (actual !== localArticleSourceHash(a)) stale.push(a.slug);
    }
  } finally {
    await vite.close().catch(() => {});
  }

  if (stale.length || missing.length) {
    console.error(`[verify-local-articles] ÉCHEC — HTML différent de la source TS : ${stale.length}, absent de dist/ : ${missing.length}.`);
    for (const s of stale) console.error(`  périmé : blog/${s}/index.html`);
    for (const s of missing) console.error(`  absent : dist/blog/${s}/index.html`);
    process.exit(1);
  }
  console.log(`[verify-local-articles] OK — ${checked} articles locaux conformes à leur source TS (${exempt} exemptés : base ou création seule).`);
};

main().catch((err) => {
  console.error("[verify-local-articles] Erreur :", err?.message || err);
  process.exit(1);
});
