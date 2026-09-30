/**
 * Contrôle post-build : fait échouer le build si le <title> HTML d'une
 * landing (dist/landing/<key>/index.html) diffère du seoTitle courant de sa
 * config dans landingConfigs.tsx — source unique.
 *
 * Bug trouvé le 2026-09-30 : generate-static-pages.mjs ne régénérait
 * landing/<key>/index.html qu'une fois ("déjà généré -> skip"), donc une
 * config corrigée après coup (ex. trottinette : 3,50€/mois -> 2,90€/mois)
 * n'avait plus aucun effet sur le HTML réellement servi. Corrigé côté
 * générateur (régénération systématique) ; ce script est le filet de
 * sécurité qui empêche une régression du même type de passer inaperçue.
 */
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const rootDir = process.cwd();
const distDir = path.join(rootDir, "dist");

// renderPage() échappe le titre en HTML (& -> &amp;, etc.) : on décode avant
// de comparer, sinon tout titre contenant "&" ressort en faux positif.
const decodeHtmlEntities = (s) =>
  s.replaceAll("&amp;", "&").replaceAll("&lt;", "<").replaceAll("&gt;", ">").replaceAll("&quot;", '"').replaceAll("&#39;", "'");

const extractTitle = (html) => {
  const m = html.match(/<title>([^<]*)<\/title>/);
  return m ? decodeHtmlEntities(m[1]) : null;
};

const main = async () => {
  if (!existsSync(distDir)) {
    console.error("[verify-landing-titles] dist/ introuvable — build d'abord.");
    process.exit(1);
  }

  let vite;
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

  const mismatches = [];
  const missing = [];
  let total = 0;

  try {
    const landingMod = await vite.ssrLoadModule(path.join(rootDir, "src/data/landingConfigs.tsx"));
    const configs = landingMod.landingConfigs || {};
    total = Object.keys(configs).length;

    for (const [key, raw] of Object.entries(configs)) {
      const cfg = raw && raw.fr ? raw.fr : raw;
      if (!cfg || !cfg.seoTitle) continue;

      const distFile = path.join(distDir, "landing", key, "index.html");
      if (!existsSync(distFile)) {
        missing.push(key);
        continue;
      }

      const html = await readFile(distFile, "utf8");
      const actualTitle = extractTitle(html);
      if (actualTitle !== cfg.seoTitle) {
        mismatches.push({ key, expected: cfg.seoTitle, actual: actualTitle });
      }
    }
  } finally {
    await vite.close().catch(() => {});
  }

  if (missing.length || mismatches.length) {
    console.error(`[verify-landing-titles] ÉCHEC.`);
    if (missing.length) {
      console.error(`\n${missing.length} landing(s) sans dist/landing/<key>/index.html :`);
      missing.forEach((k) => console.error(`  - ${k}`));
    }
    if (mismatches.length) {
      console.error(`\n${mismatches.length} landing(s) avec un <title> différent du seoTitle courant :`);
      mismatches.forEach(({ key, expected, actual }) => {
        console.error(`  - ${key}`);
        console.error(`      attendu : "${expected}"`);
        console.error(`      trouvé  : "${actual}"`);
      });
    }
    process.exit(1);
  }

  console.log(`[verify-landing-titles] OK — ${total} landings vérifiées, tous les <title> correspondent à leur seoTitle.`);
};

await main();
