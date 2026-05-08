#!/usr/bin/env node
/**
 * refresh-sitemap-lastmod.mjs
 * Met à jour TOUS les <lastmod> du fichier public/sitemap.xml à la date du jour (UTC, format YYYY-MM-DD).
 * Exécuté automatiquement avant chaque build (script `prebuild` dans package.json).
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SITEMAP_PATH = resolve(__dirname, "..", "public", "sitemap.xml");

if (!existsSync(SITEMAP_PATH)) {
  console.warn(`[sitemap] ${SITEMAP_PATH} introuvable — skip.`);
  process.exit(0);
}

const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
const xml = readFileSync(SITEMAP_PATH, "utf8");

let count = 0;
const updated = xml.replace(/<lastmod>[^<]+<\/lastmod>/g, () => {
  count++;
  return `<lastmod>${today}</lastmod>`;
});

if (updated !== xml) {
  writeFileSync(SITEMAP_PATH, updated, "utf8");
  console.log(`[sitemap] ${count} <lastmod> rafraîchis à ${today}.`);
} else {
  console.log(`[sitemap] Déjà à jour (${today}, ${count} entrées).`);
}
