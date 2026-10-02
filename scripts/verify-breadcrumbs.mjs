/**
 * Contrôle post-build : chaque route de SNAPSHOTS (apply-prerender-snapshot.mjs)
 * doit contenir exactement UN BreadcrumbList JSON-LD dans dist/<route>/index.html.
 *
 * Contexte (2026-10-02) : GlobalSchemas, le composant Breadcrumbs et le jsonLd
 * de SEOOptimized émettaient chacun le leur (2 ou 3 par page sur 81 des 84
 * captures). Corrigé par contexts/BreadcrumbDeclarationContext.tsx ; ce script
 * empêche la régression.
 *
 * Le HTML de ces routes vient des captures committées (prerender-snapshots/) :
 * tant qu'elles n'ont pas été régénérées après le correctif, elles contiennent
 * encore les doublons. D'où l'option --warn : liste les écarts sans faire
 * échouer le build. À retirer du script "build" en même temps que la
 * régénération des captures.
 */
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const rootDir = process.cwd();
const distDir = path.join(rootDir, "dist");
const warnOnly = process.argv.includes("--warn");

const snapshotSource = readFileSync(path.join(rootDir, "scripts", "apply-prerender-snapshot.mjs"), "utf8");
const routes = [...snapshotSource.matchAll(/\{\s*route:\s*"([^"]+)",\s*file:\s*"[^"]+"\s*\}/g)].map((m) => m[1]);

if (!existsSync(distDir)) {
  console.error("[verify-breadcrumbs] dist/ introuvable — build d'abord.");
  process.exit(1);
}
if (routes.length === 0) {
  console.error("[verify-breadcrumbs] aucune route lue dans SNAPSHOTS (apply-prerender-snapshot.mjs).");
  process.exit(1);
}

const countBreadcrumbLists = (html) => {
  let n = 0;
  const visit = (node) => {
    if (Array.isArray(node)) return node.forEach(visit);
    if (!node || typeof node !== "object") return;
    if (node["@type"] === "BreadcrumbList") n += 1;
    if (Array.isArray(node["@graph"])) node["@graph"].forEach(visit);
  };
  for (const m of html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
    try {
      visit(JSON.parse(m[1]));
    } catch {
      /* JSON-LD illisible : ignoré ici, hors du périmètre de ce contrôle */
    }
  }
  return n;
};

const problems = [];
for (const route of routes) {
  const file = route === "/" ? path.join(distDir, "index.html") : path.join(distDir, route, "index.html");
  if (!existsSync(file)) {
    problems.push(`${route} : ${path.relative(rootDir, file)} introuvable`);
    continue;
  }
  const n = countBreadcrumbLists(readFileSync(file, "utf8"));
  if (n !== 1) problems.push(`${route} : ${n} BreadcrumbList`);
}

if (problems.length === 0) {
  console.log(`[verify-breadcrumbs] OK — ${routes.length} routes, un seul BreadcrumbList chacune.`);
  process.exit(0);
}

const header = `[verify-breadcrumbs] ${problems.length}/${routes.length} routes sans exactement un BreadcrumbList :`;
const list = problems.map((p) => `  - ${p}`).join("\n");
if (warnOnly) {
  console.warn(`${header}\n${list}\n[verify-breadcrumbs] mode --warn : build non bloqué (captures à régénérer).`);
  process.exit(0);
}
console.error(`${header}\n${list}`);
process.exit(1);
