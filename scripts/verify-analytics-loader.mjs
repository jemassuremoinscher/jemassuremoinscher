/**
 * Contrôle post-build : fait échouer le build si un dist/**\/index.html ne
 * contient pas le loader analytics courant (window.__analyticsLoaderVersion
 * = 2), ou contient encore l'ancien loader sans consentement (marqueur
 * "function loadAnalytics", v1). Chantier consentement, 2026-09-29.
 */
import { readdirSync, statSync, readFileSync, existsSync } from "node:fs";
import path from "node:path";

const rootDir = process.cwd();
const distDir = path.join(rootDir, "dist");

const CURRENT_VERSION_MARKER = "window.__analyticsLoaderVersion = 2";
const OLD_LOADER_MARKER = "function loadAnalytics";

const findIndexHtmlFiles = (dir) => {
  const results = [];
  let entries = [];
  try {
    entries = readdirSync(dir);
  } catch {
    return results;
  }
  for (const name of entries) {
    const full = path.join(dir, name);
    let st;
    try {
      st = statSync(full);
    } catch {
      continue;
    }
    if (st.isDirectory()) {
      results.push(...findIndexHtmlFiles(full));
    } else if (name === "index.html") {
      results.push(full);
    }
  }
  return results;
};

const main = () => {
  if (!existsSync(distDir)) {
    console.error("[verify-analytics-loader] dist/ introuvable — build d'abord.");
    process.exit(1);
  }

  const files = findIndexHtmlFiles(distDir).filter(
    (f) => path.basename(path.dirname(f)) !== "dist" || f === path.join(distDir, "index.html")
  );
  // index.spa.html (filet de sécurité) n'est pas un index.html servi — exclu naturellement (nom différent).

  const missing = [];
  const stale = [];

  for (const file of files) {
    const html = readFileSync(file, "utf8");
    const hasCurrent = html.includes(CURRENT_VERSION_MARKER);
    const hasOld = html.includes(OLD_LOADER_MARKER);
    if (!hasCurrent && !hasOld) missing.push(file);
    else if (!hasCurrent && hasOld) stale.push(file);
  }

  if (missing.length || stale.length) {
    console.error(`[verify-analytics-loader] ÉCHEC — ${files.length} fichiers vérifiés.`);
    if (missing.length) {
      console.error(`\n${missing.length} fichier(s) SANS AUCUN loader analytics :`);
      missing.forEach((f) => console.error(`  - ${path.relative(rootDir, f)}`));
    }
    if (stale.length) {
      console.error(`\n${stale.length} fichier(s) avec l'ANCIEN loader (sans consentement, v1) :`);
      stale.forEach((f) => console.error(`  - ${path.relative(rootDir, f)}`));
    }
    process.exit(1);
  }

  console.log(`[verify-analytics-loader] OK — ${files.length} fichiers vérifiés, tous en v2.`);
};

main();
