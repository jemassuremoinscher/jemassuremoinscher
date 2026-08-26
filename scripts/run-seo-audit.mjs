import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

const rootDir = process.cwd();
const reportPath = path.join(rootDir, "public", "seo-audit-report.json");
const geoContent = JSON.parse(await readFile(path.join(rootDir, "src/data/geo-content.json"), "utf8"));
const excludedDirectories = new Set(["dist", "node_modules", ".git", "test-hosting-paths"]);

const readDirRecursive = async (dirPath) => {
  const entries = await readdir(dirPath, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (excludedDirectories.has(entry.name)) continue;
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      files.push(...await readDirRecursive(fullPath));
    } else {
      files.push(fullPath);
    }
  }
  return files;
};

const htmlFiles = (await readDirRecursive(rootDir))
  .filter((file) => file.endsWith(".html"))
  .map((file) => path.relative(rootDir, file).replace(/\\/g, "/"))
  .sort();

const fileContents = Object.fromEntries(
  await Promise.all(htmlFiles.map(async (file) => [file, await readFile(path.join(rootDir, file), "utf8")])),
);

const addCheck = (checks, check) => checks.push(check);
const getTitle = (html) => html.match(/<title>([^<]+)<\/title>/i)?.[1]?.trim() ?? null;
const getMetaByName = (html, name) => {
  const pattern = new RegExp(`<meta[^>]+name=["']${name}["'][^>]+content=(?:"([^"]*)"|'([^']*)')[^>]*>`, "i");
  const match = html.match(pattern);
  return match?.[1] ?? match?.[2] ?? null;
};
const getMetaByProperty = (html, property) => {
  const pattern = new RegExp(`<meta[^>]+property=["']${property}["'][^>]+content=(?:"([^"]*)"|'([^']*)')[^>]*>`, "i");
  const match = html.match(pattern);
  return match?.[1] ?? match?.[2] ?? null;
};
const getCanonical = (html) => html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["'][^>]*>/i)?.[1]?.trim() ?? null;
const getLang = (html) => html.match(/<html[^>]+lang=["']([^"']+)["']/i)?.[1]?.trim() ?? null;
const getH1Count = (html) => (html.match(/<div id="root">[\s\S]*?<h1[\s>]/gi) ?? []).length;
const getJsonLdCount = (html) => (html.match(/<script[^>]+type=["']application\/ld\+json["'][^>]*>/gi) ?? []).length;
const getInternalLinksCount = (html) => (html.match(/<a[^>]+href=["']\/(?!\/)[^"']*["']/gi) ?? []).length;

const checks = [];
const makeCheck = ({ id, file, category, description, pass, weight, expected, actual = null }) => ({
  id,
  file,
  category,
  description,
  pass,
  weight,
  impact: weight,
  expected,
  actual,
  reason: pass
    ? `Passe : ${actual ? `${actual} observé, conforme à ${expected}.` : `conforme à ${expected}.`}`
    : `Échec : ${actual ? `${actual} observé` : "élément manquant"}, attendu ${expected}.`,
});

for (const file of htmlFiles) {
  const html = fileContents[file];
  const title = getTitle(html);
  const description = getMetaByName(html, "description");
  const robots = getMetaByName(html, "robots");
  const viewport = getMetaByName(html, "viewport");
  const canonical = getCanonical(html);
  const lang = getLang(html);
  const ogTitle = getMetaByProperty(html, "og:title");
  const ogDescription = getMetaByProperty(html, "og:description");
  const h1Count = getH1Count(html);
  const jsonLdCount = getJsonLdCount(html);
  const internalLinksCount = getInternalLinksCount(html);

  addCheck(checks, makeCheck({ id: `${file}-title-length`, file, category: "title", description: "Le title est présent et dans une plage SEO reconnue (30-60 caractères)", pass: Boolean(title && title.length >= 30 && title.length <= 60), weight: 15, expected: "title de 30 à 60 caractères", actual: title ? `${title.length} caractères` : null }));
  addCheck(checks, makeCheck({ id: `${file}-meta-description`, file, category: "meta-description", description: "La meta description est présente et concise (70-160 caractères)", pass: Boolean(description && description.length >= 70 && description.length <= 160), weight: 15, expected: "meta description de 70 à 160 caractères", actual: description ? `${description.length} caractères` : null }));
  addCheck(checks, makeCheck({ id: `${file}-canonical`, file, category: "canonical", description: "Une canonical absolue est présente", pass: Boolean(canonical && canonical.startsWith(geoContent.baseUrl)), weight: 10, expected: `canonical absolue commençant par ${geoContent.baseUrl}`, actual: canonical }));
  addCheck(checks, makeCheck({ id: `${file}-robots`, file, category: "robots", description: "La meta robots autorise bien l'indexation", pass: Boolean(robots && /index/i.test(robots) && /follow/i.test(robots)), weight: 5, expected: "meta robots contenant index, follow", actual: robots }));
  addCheck(checks, makeCheck({ id: `${file}-viewport`, file, category: "mobile", description: "La viewport mobile est déclarée", pass: Boolean(viewport && /width=device-width/i.test(viewport)), weight: 5, expected: "meta viewport avec width=device-width", actual: viewport }));
  addCheck(checks, makeCheck({ id: `${file}-lang`, file, category: "language", description: "La langue du document est définie", pass: Boolean(lang), weight: 5, expected: "attribut lang sur <html>", actual: lang }));
  addCheck(checks, makeCheck({ id: `${file}-single-h1`, file, category: "headings", description: "La page contient exactement un H1 dans le shell principal", pass: h1Count === 1, weight: 15, expected: "1 H1 dans #root", actual: `${h1Count} H1` }));
  addCheck(checks, makeCheck({ id: `${file}-social-tags`, file, category: "social", description: "Les balises Open Graph principales sont présentes", pass: Boolean(ogTitle && ogDescription), weight: 10, expected: "og:title et og:description", actual: `og:title=${Boolean(ogTitle)}, og:description=${Boolean(ogDescription)}` }));
  addCheck(checks, makeCheck({ id: `${file}-jsonld`, file, category: "structured-data", description: "La page expose au moins un bloc JSON-LD", pass: jsonLdCount > 0, weight: 10, expected: "au moins 1 script application/ld+json", actual: `${jsonLdCount} bloc(s)` }));
  addCheck(checks, makeCheck({ id: `${file}-internal-links`, file, category: "internal-linking", description: "La page contient des liens internes crawlables", pass: internalLinksCount >= 1, weight: 10, expected: "au moins 1 lien interne relatif", actual: `${internalLinksCount} lien(s)` }));
}

const pageScores = htmlFiles.map((file) => {
  const fileChecks = checks.filter((check) => check.file === file);
  const totalWeight = fileChecks.reduce((sum, check) => sum + check.weight, 0);
  const passedWeight = fileChecks.filter((check) => check.pass).reduce((sum, check) => sum + check.weight, 0);
  return {
    file,
    score: totalWeight === 0 ? 100 : Math.round((passedWeight / totalWeight) * 100),
    issues: fileChecks.filter((check) => !check.pass).length,
  };
});

const totalWeight = checks.reduce((sum, check) => sum + check.weight, 0);
const passedWeight = checks.filter((check) => check.pass).reduce((sum, check) => sum + check.weight, 0);
const failedChecks = checks.filter((check) => !check.pass);
const score = totalWeight === 0 ? 100 : Math.round((passedWeight / totalWeight) * 100);
const status = score >= 90 ? "excellent" : score >= 75 ? "good" : score >= 60 ? "warning" : "critical";

const report = {
  generatedAt: new Date().toISOString(),
  score,
  status,
  methodology: "Score on-page pondéré sur toutes les pages HTML du site : title, meta description, canonical, robots, viewport, lang, H1 principal, Open Graph, JSON-LD et maillage interne.",
  summary: {
    auditedPages: htmlFiles.length,
    totalChecks: checks.length,
    passedChecks: checks.length - failedChecks.length,
    failedChecks: failedChecks.length,
    weightedPassed: passedWeight,
    weightedTotal: totalWeight,
    strongPages: pageScores.filter((page) => page.score >= 80).length,
  },
  pageScores,
  issues: failedChecks,
  // Le rapport est servi publiquement (public/ -> /seo-audit-report.json). On
  // n'ecrit que les checks en echec : les deux consommateurs (GeoScoreCard,
  // SEOSuggestions) filtrent tous leurs acces par !pass, et `summary` conserve
  // les compteurs exacts. Ecrire les ~2500 checks reussis faisait 1,9 Mo.
  checks: failedChecks,
};

await mkdir(path.dirname(reportPath), { recursive: true });
await writeFile(reportPath, JSON.stringify(report, null, 2), "utf8");

console.log(`\n[SEO Audit] Score ${score}/100 — ${checks.length - failedChecks.length}/${checks.length} checks passés`);
if (failedChecks.length === 0) {
  console.log(`[SEO Audit] Aucun écart SEO détecté sur ${htmlFiles.length} pages HTML auditées.\n`);
} else {
  console.log("[SEO Audit] Points SEO à surveiller :");
  failedChecks.slice(0, 25).forEach((issue, index) => {
    console.log(`${index + 1}. [${issue.category}] ${issue.file} — ${issue.description}`);
    console.log(`   poids: ${issue.weight}`);
    console.log(`   attendu: ${issue.expected}`);
    if (issue.actual) console.log(`   trouvé: ${issue.actual}`);
  });
  console.log("");
}