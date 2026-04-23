import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const rootDir = process.cwd();
const geoContentPath = path.join(rootDir, "src/data/geo-content.json");
const reportPath = path.join(rootDir, "public", "seo-audit-report.json");

const geoContent = JSON.parse(await readFile(geoContentPath, "utf8"));
const filesToAudit = [
  "index.html",
  ...geoContent.staticPages.map((page) => `${page.outputDir}/index.html`),
];

const fileContents = Object.fromEntries(
  await Promise.all(filesToAudit.map(async (file) => [file, await readFile(path.join(rootDir, file), "utf8")])),
);

const checks = [];

const addCheck = ({ id, file, category, description, pass, weight, expected, actual = null }) => {
  checks.push({ id, file, category, description, pass, weight, expected, actual });
};

const getTitle = (html) => html.match(/<title>([^<]+)<\/title>/i)?.[1]?.trim() ?? null;
const getMetaByName = (html, name) => {
  const pattern = new RegExp(`<meta[^>]+name=["']${name}["'][^>]+content=["']([^"']*)["'][^>]*>`, "i");
  return html.match(pattern)?.[1]?.trim() ?? null;
};
const getMetaByProperty = (html, property) => {
  const pattern = new RegExp(`<meta[^>]+property=["']${property}["'][^>]+content=["']([^"']*)["'][^>]*>`, "i");
  return html.match(pattern)?.[1]?.trim() ?? null;
};
const getCanonical = (html) => html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["'][^>]*>/i)?.[1]?.trim() ?? null;
const getLang = (html) => html.match(/<html[^>]+lang=["']([^"']+)["']/i)?.[1]?.trim() ?? null;
const getH1Count = (html) => (html.match(/<h1[\s>]/gi) ?? []).length;
const getJsonLdCount = (html) => (html.match(/<script[^>]+type=["']application\/ld\+json["'][^>]*>/gi) ?? []).length;
const getInternalLinksCount = (html) => (html.match(/<a[^>]+href=["']\/(?!\/)[^"']*["']/gi) ?? []).length;

for (const file of filesToAudit) {
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

  addCheck({
    id: `${file}-title-length`,
    file,
    category: "title",
    description: "Le title est présent et dans une plage SEO reconnue (30-60 caractères)",
    pass: Boolean(title && title.length >= 30 && title.length <= 60),
    weight: 15,
    expected: "Title de 30 à 60 caractères",
    actual: title ? `${title.length} caractères` : null,
  });

  addCheck({
    id: `${file}-meta-description`,
    file,
    category: "meta-description",
    description: "La meta description est présente et concise (70-160 caractères)",
    pass: Boolean(description && description.length >= 70 && description.length <= 160),
    weight: 15,
    expected: "Meta description de 70 à 160 caractères",
    actual: description ? `${description.length} caractères` : null,
  });

  addCheck({
    id: `${file}-canonical`,
    file,
    category: "canonical",
    description: "Une canonical absolue est présente",
    pass: Boolean(canonical && canonical.startsWith(geoContent.baseUrl)),
    weight: 10,
    expected: `Canonical absolue commençant par ${geoContent.baseUrl}`,
    actual: canonical,
  });

  addCheck({
    id: `${file}-robots`,
    file,
    category: "robots",
    description: "La meta robots autorise bien l'indexation",
    pass: Boolean(robots && /index/i.test(robots) && /follow/i.test(robots)),
    weight: 5,
    expected: "Meta robots contenant index, follow",
    actual: robots,
  });

  addCheck({
    id: `${file}-viewport`,
    file,
    category: "mobile",
    description: "La viewport mobile est déclarée",
    pass: Boolean(viewport && /width=device-width/i.test(viewport)),
    weight: 5,
    expected: "Meta viewport avec width=device-width",
    actual: viewport,
  });

  addCheck({
    id: `${file}-lang`,
    file,
    category: "language",
    description: "La langue du document est définie",
    pass: Boolean(lang),
    weight: 5,
    expected: "Attribut lang sur <html>",
    actual: lang,
  });

  addCheck({
    id: `${file}-single-h1`,
    file,
    category: "headings",
    description: "La page contient exactement un H1",
    pass: h1Count === 1,
    weight: 15,
    expected: "1 H1 par page",
    actual: `${h1Count} H1`,
  });

  addCheck({
    id: `${file}-social-tags`,
    file,
    category: "social",
    description: "Les balises Open Graph principales sont présentes",
    pass: Boolean(ogTitle && ogDescription),
    weight: 10,
    expected: "og:title et og:description",
    actual: `og:title=${Boolean(ogTitle)}, og:description=${Boolean(ogDescription)}`,
  });

  addCheck({
    id: `${file}-jsonld`,
    file,
    category: "structured-data",
    description: "La page expose au moins un bloc JSON-LD",
    pass: jsonLdCount > 0,
    weight: 10,
    expected: "Au moins 1 script application/ld+json",
    actual: `${jsonLdCount} bloc(s)`,
  });

  addCheck({
    id: `${file}-internal-links`,
    file,
    category: "internal-linking",
    description: "La page contient des liens internes crawlables",
    pass: internalLinksCount >= 1,
    weight: 10,
    expected: "Au moins 1 lien interne relatif",
    actual: `${internalLinksCount} lien(s)`,
  });
}

const checksByFile = Object.fromEntries(
  filesToAudit.map((file) => {
    const fileChecks = checks.filter((check) => check.file === file);
    const totalWeight = fileChecks.reduce((sum, check) => sum + check.weight, 0);
    const passedWeight = fileChecks.filter((check) => check.pass).reduce((sum, check) => sum + check.weight, 0);
    return [file, { score: totalWeight === 0 ? 100 : Math.round((passedWeight / totalWeight) * 100), issues: fileChecks.filter((check) => !check.pass).length }];
  }),
);

const totalWeight = checks.reduce((sum, check) => sum + check.weight, 0);
const passedWeight = checks.filter((check) => check.pass).reduce((sum, check) => sum + check.weight, 0);
const score = totalWeight === 0 ? 100 : Math.round((passedWeight / totalWeight) * 100);
const failedChecks = checks.filter((check) => !check.pass);
const status = score >= 90 ? "excellent" : score >= 75 ? "good" : score >= 60 ? "warning" : "critical";

const report = {
  generatedAt: new Date().toISOString(),
  score,
  status,
  methodology: "Score on-page basé sur critères SEO reconnus : title, meta description, canonical, robots, viewport, lang, H1, Open Graph, JSON-LD, maillage interne.",
  summary: {
    auditedPages: filesToAudit.length,
    totalChecks: checks.length,
    passedChecks: checks.length - failedChecks.length,
    failedChecks: failedChecks.length,
    weightedPassed: passedWeight,
    weightedTotal: totalWeight,
    strongPages: Object.values(checksByFile).filter((file) => file.score >= 80).length,
  },
  pageScores: Object.entries(checksByFile).map(([file, data]) => ({ file, ...data })),
  issues: failedChecks,
  checks,
};

await mkdir(path.dirname(reportPath), { recursive: true });
await writeFile(reportPath, JSON.stringify(report, null, 2), "utf8");

console.log(`\n[SEO Audit] Score ${score}/100 — ${checks.length - failedChecks.length}/${checks.length} checks passés`);

if (failedChecks.length === 0) {
  console.log("[SEO Audit] Aucun écart SEO détecté sur le périmètre audité.\n");
} else {
  console.log("[SEO Audit] Points SEO à surveiller :");
  failedChecks.slice(0, 20).forEach((issue, index) => {
    console.log(`${index + 1}. [${issue.category}] ${issue.file} — ${issue.description}`);
    console.log(`   attendu: ${issue.expected}`);
    if (issue.actual) console.log(`   trouvé: ${issue.actual}`);
  });
  console.log("");
}