import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

const rootDir = process.cwd();
const reportPath = path.join(rootDir, "public", "geo-audit-report.json");
const geoContent = JSON.parse(await readFile(path.join(rootDir, "src/data/geo-content.json"), "utf8"));
const trust = geoContent.trust;
const excludedDirectories = new Set(["dist", "node_modules", ".git", "test-hosting-paths"]);

const stalePatterns = [
  { pattern: /4\.8\/5/g, label: "Ancienne note 4.8/5" },
  { pattern: /2 500\+ avis/g, label: "Ancien volume d'avis 2 500+" },
  { pattern: /2500\+ avis/g, label: "Ancien volume d'avis 2500+" },
  { pattern: /2500 avis/g, label: "Ancien volume d'avis 2500" },
  { pattern: /2547/g, label: "Ancien compteur 2547" },
];

const readDirRecursive = async (dirPath) => {
  const entries = await readdir(dirPath, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (excludedDirectories.has(entry.name)) continue;
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) files.push(...await readDirRecursive(fullPath));
    else files.push(fullPath);
  }
  return files;
};

const htmlFiles = (await readDirRecursive(rootDir))
  .filter((file) => file.endsWith(".html"))
  .map((file) => path.relative(rootDir, file).replace(/\\/g, "/"))
  .sort();

const sourceFiles = [
  "public/llms.txt",
  "src/pages/Index.tsx",
  "src/pages/AvisClients.tsx",
  "src/pages/LlmsTxt.tsx",
  "src/components/comparison/WhyUsComparison.tsx",
  "src/components/insurance/ExpertiseSection.tsx",
  "src/components/admin/SERPPreview.tsx",
  "src/data/landingConfigs.tsx",
];

const contents = Object.fromEntries(
  await Promise.all([...htmlFiles, ...sourceFiles].map(async (file) => [file, await readFile(path.join(rootDir, file), "utf8")])),
);

const staticPagesByDir = Object.fromEntries(geoContent.staticPages.map((page) => [page.outputDir, page]));
const extractTagContent = (html, regex) => html.match(regex)?.[1]?.trim() ?? null;
const checks = [];

const makeCheck = ({ id, category, file, description, pass, expected, weight, actual = null }) => ({
  id,
  category,
  file,
  description,
  pass,
  expected,
  weight,
  impact: weight,
  actual,
  reason: pass
    ? `Passe : ${actual ? `${actual} observé, conforme à ${expected}.` : `conforme à ${expected}.`}`
    : `Échec : ${actual ? `${actual} observé` : "valeur attendue introuvable"}, attendu ${expected}.`,
});

const addCheck = (check) => checks.push(check);

for (const htmlFile of htmlFiles) {
  const html = contents[htmlFile];
  addCheck(makeCheck({
    id: `${htmlFile}-shared-trust-clean`,
    category: "stale-copy",
    file: htmlFile,
    description: "La page statique ne contient pas d'anciennes métriques de confiance",
    pass: !stalePatterns.some(({ pattern }) => pattern.test(html)),
    expected: `Aucune ancienne métrique, utiliser ${trust.ratingValueLabel}/5 et ${trust.reviewCountLabel} avis si la page expose une preuve sociale`,
    weight: 5,
    actual: stalePatterns.flatMap(({ pattern }) => [...html.matchAll(pattern)].map((m) => m[0])).join(", ") || null,
  }));
}

for (const outputDir of Object.keys(staticPagesByDir)) {
  const page = staticPagesByDir[outputDir];
  const file = `${outputDir}/index.html`;
  const html = contents[file];
  const title = extractTagContent(html, /<title>([^<]+)<\/title>/i);
  const description = html.match(/<meta[^>]+name=["']description["'][^>]+content=(?:"([^"]*)"|'([^']*)')/i);
  const h1 = extractTagContent(html, /<div id="root">[\s\S]*?<h1>([^<]+)<\/h1>/i);

  addCheck(makeCheck({ id: `${outputDir}-title`, category: "static-title", file, description: `Le titre statique de ${outputDir} correspond à la source GEO`, pass: title === page.title, expected: page.title, actual: title, weight: 10 }));
  addCheck(makeCheck({ id: `${outputDir}-description`, category: "static-description", file, description: `La meta description statique de ${outputDir} correspond à la source GEO`, pass: (description?.[1] ?? description?.[2] ?? null) === page.description, expected: page.description, actual: description?.[1] ?? description?.[2] ?? null, weight: 10 }));
  addCheck(makeCheck({ id: `${outputDir}-h1`, category: "static-h1", file, description: `Le H1 statique de ${outputDir} correspond à la source GEO`, pass: h1 === page.h1, expected: page.h1, actual: h1, weight: 10 }));
}

addCheck(makeCheck({
  id: "home-route-map-review",
  category: "static-metric",
  file: "index.html",
  description: "La route /avis-clients du shell statique utilise les métriques GEO partagées",
  pass: contents["index.html"].includes(`'/avis-clients':{t:'Avis Clients | ${trust.ratingValueLabel}/5 sur ${trust.reviewCountLabel}+ avis vérifiés',d:'Lisez les avis de nos clients. Note moyenne ${trust.ratingValueLabel}/5 sur plus de ${trust.reviewCountLabel} avis vérifiés.'}`),
  expected: `Avis Clients | ${trust.ratingValueLabel}/5 sur ${trust.reviewCountLabel}+ avis vérifiés`,
  weight: 10,
}));

addCheck(makeCheck({
  id: "home-jsonld-rating",
  category: "structured-data",
  file: "index.html",
  description: "Le JSON-LD statique utilise la note et le nombre d'avis partagés",
  pass: contents["index.html"].includes(`"ratingValue":"${trust.ratingValueLabel}","reviewCount":"${trust.reviewCountLabel}"`),
  expected: `${trust.ratingValueLabel} / ${trust.reviewCountLabel}`,
  weight: 10,
}));

addCheck(makeCheck({
  id: "react-home-shared-source",
  category: "react-source",
  file: "src/pages/Index.tsx",
  description: "La home React lit la note GEO depuis la source partagée",
  pass: contents["src/pages/Index.tsx"].includes("addOrganizationSchema(geoContent.trust.ratingValue, geoContent.trust.reviewCount)"),
  expected: "geoContent.trust.ratingValue + geoContent.trust.reviewCount",
  weight: 10,
}));

for (const file of [
  "src/pages/AvisClients.tsx",
  "src/pages/LlmsTxt.tsx",
  "src/components/comparison/WhyUsComparison.tsx",
  "src/components/insurance/ExpertiseSection.tsx",
]) {
  addCheck(makeCheck({
    id: `${file}-shared-rating`,
    category: "react-source",
    file,
    description: `${path.basename(file)} lit bien les métriques GEO depuis la source partagée`,
    pass: contents[file].includes("geoContent.trust.ratingValueLabel") && contents[file].includes("geoContent.trust.reviewCountLabel"),
    expected: "geoContent.trust.ratingValueLabel + geoContent.trust.reviewCountLabel",
    weight: 10,
  }));
}

for (const file of ["public/llms.txt", "src/components/admin/SERPPreview.tsx", "src/data/landingConfigs.tsx"]) {
  const fileContent = contents[file];
  addCheck(makeCheck({
    id: `${file}-stale-copy-free`,
    category: "stale-copy",
    file,
    description: `${path.basename(file)} ne contient pas d'ancienne métrique marque`,
    pass: !stalePatterns.some(({ pattern }) => pattern.test(fileContent)),
    expected: `Aucune ancienne métrique, utiliser ${trust.ratingValueLabel}/5 et ${trust.reviewCountLabel} avis`,
    weight: 10,
    actual: stalePatterns.flatMap(({ pattern }) => [...fileContent.matchAll(pattern)].map((m) => m[0])).join(", ") || null,
  }));
}

const passedWeight = checks.filter((check) => check.pass).reduce((sum, check) => sum + check.weight, 0);
const totalWeight = checks.reduce((sum, check) => sum + check.weight, 0);
const passedChecks = checks.filter((check) => check.pass).length;
const failedChecks = checks.length - passedChecks;
const score = totalWeight === 0 ? 100 : Math.round((passedWeight / totalWeight) * 100);
const status = score >= 95 ? "excellent" : score >= 80 ? "good" : score >= 60 ? "warning" : "critical";

const report = {
  generatedAt: new Date().toISOString(),
  score,
  status,
  methodology: "Score GEO pondéré sur toutes les pages HTML du site plus les sources React/marketing critiques : dérive des métriques partagées, cohérence du shell statique et absence de stale copy.",
  summary: {
    totalChecks: checks.length,
    passedChecks,
    failedChecks,
    auditedFiles: htmlFiles.length + sourceFiles.length,
    auditedPages: htmlFiles.length,
    staticRoutes: htmlFiles.length,
    weightedPassed: passedWeight,
    weightedTotal: totalWeight,
  },
  mismatches: checks.filter((check) => !check.pass),
  checks,
};

await mkdir(path.dirname(reportPath), { recursive: true });
await writeFile(reportPath, JSON.stringify(report, null, 2), "utf8");

console.log(`\n[GEO Audit] Score ${score}/100 — ${passedChecks}/${checks.length} checks passés`);
if (failedChecks === 0) {
  console.log(`[GEO Audit] Aucun écart détecté sur ${htmlFiles.length} pages HTML et ${sourceFiles.length} sources critiques.\n`);
} else {
  console.log("[GEO Audit] Différences détectées avant build :");
  report.mismatches.slice(0, 25).forEach((diff, index) => {
    console.log(`${index + 1}. [${diff.category}] ${diff.file} — ${diff.description}`);
    console.log(`   poids: ${diff.weight}`);
    if (diff.actual) console.log(`   trouvé: ${diff.actual}`);
    console.log(`   attendu: ${diff.expected}`);
  });
  console.log("");
}