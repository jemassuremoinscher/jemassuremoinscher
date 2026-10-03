/**
 * Verrou i18n (chantier i18n, étape 1). Vérifie les dictionnaires
 * src/i18n/{fr,en,it}.ts :
 *   (1) parité : clé française absente d'une langue, ou clé d'une langue
 *       absente du français (clé morte) ;
 *   (2) valeur identique au français hors invariants
 *       (docs/i18n/invariants.json : clés 'all' et '<langue>', 'patterns') ;
 *   (3) clé française jamais référencée dans src/ (ni littéralement, ni par
 *       un préfixe de clé dynamique t(`prefixe.${x}`)).
 *
 * Mode AVERTISSEMENT par défaut (le build continue) ; mode STRICT avec
 * --strict ou I18N_STRICT=1 : code de sortie 1 au moindre écart (étape 9).
 */
import path from "node:path";
import { readFileSync, readdirSync, statSync } from "node:fs";

const rootDir = process.cwd();
const strict = process.argv.includes("--strict") || process.env.I18N_STRICT === "1";
const LANGS = ["en", "it"];

const { createServer } = await import("vite");
const vite = await createServer({
  configFile: false,
  root: rootDir,
  resolve: { alias: { "@": path.join(rootDir, "src") } },
  server: { middlewareMode: true },
  optimizeDeps: { noDiscovery: true, include: [] },
  logLevel: "silent",
});
const dict = {};
try {
  for (const lang of ["fr", ...LANGS]) dict[lang] = (await vite.ssrLoadModule(path.join(rootDir, `src/i18n/${lang}.ts`))).default;
} finally {
  await vite.close();
}

const inv = JSON.parse(readFileSync(path.join(rootDir, "docs/i18n/invariants.json"), "utf8"));
const patterns = (inv.patterns || []).map((p) => new RegExp(p));
const isInvariant = (lang, key, value) =>
  (inv.all || []).includes(key) || (inv[lang] || []).includes(key) || patterns.some((re) => re.test(value));

// Sources (hors dictionnaires) : chaînes citées et préfixes de clés dynamiques.
const files = [];
const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    const p = path.join(dir, name);
    if (statSync(p).isDirectory()) { if (p !== path.join(rootDir, "src/i18n")) walk(p); }
    else if (/\.(tsx?|mjs|js)$/.test(name)) files.push(p);
  }
};
walk(path.join(rootDir, "src"));
const quoted = new Set();
const prefixes = new Set();
for (const f of files) {
  const src = readFileSync(f, "utf8");
  for (const m of src.matchAll(/(['"`])([A-Za-z0-9_]+(?:\.[A-Za-z0-9_-]+)+)\1/g)) quoted.add(m[2]);
  for (const m of src.matchAll(/`([A-Za-z0-9_.-]+\.)\$\{/g)) prefixes.add(m[1]);
}
const isUsed = (key) => quoted.has(key) || [...prefixes].some((p) => key.startsWith(p));

const frKeys = Object.keys(dict.fr);
const report = { missing: {}, dead: {}, identical: {}, unused: frKeys.filter((k) => !isUsed(k)) };
for (const lang of LANGS) {
  const d = dict[lang];
  report.missing[lang] = frKeys.filter((k) => !(k in d));
  report.dead[lang] = Object.keys(d).filter((k) => !(k in dict.fr));
  report.identical[lang] = frKeys.filter((k) => k in d && d[k] === dict.fr[k] && !isInvariant(lang, k, dict.fr[k]));
}

const sample = (arr, n = 8) => (arr.length ? ` (ex. ${arr.slice(0, n).join(", ")}${arr.length > n ? ", …" : ""})` : "");
const lines = [];
for (const lang of LANGS) {
  lines.push(`${lang} : ${report.missing[lang].length} clé(s) manquante(s)${sample(report.missing[lang], 5)}`);
  lines.push(`${lang} : ${report.dead[lang].length} clé(s) absente(s) du français${sample(report.dead[lang])}`);
  lines.push(`${lang} : ${report.identical[lang].length} valeur(s) identique(s) au français hors invariants${sample(report.identical[lang])}`);
}
lines.push(`fr : ${report.unused.length} clé(s) jamais référencée(s) dans src/${sample(report.unused)}`);

const issues = LANGS.reduce((n, l) => n + report.missing[l].length + report.dead[l].length + report.identical[l].length, 0) + report.unused.length;
const tag = "[verify-i18n]";
if (!issues) {
  console.log(`${tag} OK — ${frKeys.length} clés, parité complète en ${LANGS.join(", ")}.`);
} else if (strict) {
  console.error(`${tag} ÉCHEC (strict) — ${issues} écart(s) :`);
  for (const l of lines) console.error(`  - ${l}`);
  process.exit(1);
} else {
  console.log(`${tag} AVERTISSEMENT — ${issues} écart(s), ${frKeys.length} clés françaises (mode avertissement, strict à l'étape 9) :`);
  for (const l of lines) console.log(`  - ${l}`);
}
