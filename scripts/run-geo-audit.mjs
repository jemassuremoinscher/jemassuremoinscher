import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const rootDir = process.cwd();
const reportPath = path.join(rootDir, "public", "geo-audit-report.json");
const geoContent = JSON.parse(await readFile(path.join(rootDir, "src/data/geo-content.json"), "utf8"));

const trust = geoContent.trust;
const stalePatterns = [
  { pattern: /4\.8\/5/g, label: "Ancienne note 4.8/5" },
  { pattern: /2 500\+ avis/g, label: "Ancien volume d'avis 2 500+" },
  { pattern: /2500\+ avis/g, label: "Ancien volume d'avis 2500+" },
  { pattern: /2500 avis/g, label: "Ancien volume d'avis 2500" },
  { pattern: /2547/g, label: "Ancien compteur 2547" },
];

const filesToRead = [
  "index.html",
  "contact/index.html",
  "blog/index.html",
  "glossaire/index.html",
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
  await Promise.all(
    filesToRead.map(async (file) => [file, await readFile(path.join(rootDir, file), "utf8")]),
  ),
);

const checks = [];

const addCheck = ({ id, category, file, description, pass, expected, actual = null }) => {
  checks.push({ id, category, file, description, pass, expected, actual });
};

const staticPagesByDir = Object.fromEntries(geoContent.staticPages.map((page) => [page.outputDir, page]));

for (const outputDir of ["contact", "blog", "glossaire"]) {
  const page = staticPagesByDir[outputDir];
  const html = contents[`${outputDir}/index.html`];

  addCheck({
    id: `${outputDir}-title`,
    category: "static-title",
    file: `${outputDir}/index.html`,
    description: `Le titre statique de ${outputDir} correspond à la source GEO`,
    pass: html.includes(`<title>${page.title}</title>`),
    expected: page.title,
  });

  addCheck({
    id: `${outputDir}-description`,
    category: "static-description",
    file: `${outputDir}/index.html`,
    description: `La meta description statique de ${outputDir} correspond à la source GEO`,
    pass: html.includes(`content="${page.description}"`),
    expected: page.description,
  });

  addCheck({
    id: `${outputDir}-h1`,
    category: "static-h1",
    file: `${outputDir}/index.html`,
    description: `Le H1 statique de ${outputDir} correspond à la source GEO`,
    pass: html.includes(`<h1>${page.h1}</h1>`),
    expected: page.h1,
  });
}

addCheck({
  id: "home-route-map-review",
  category: "static-metric",
  file: "index.html",
  description: "La route /avis-clients du shell statique utilise les métriques GEO partagées",
  pass: contents["index.html"].includes(`'/avis-clients':{t:'Avis Clients | ${trust.ratingValueLabel}/5 sur ${trust.reviewCountLabel}+ avis vérifiés',d:'Lisez les avis de nos clients. Note moyenne ${trust.ratingValueLabel}/5 sur plus de ${trust.reviewCountLabel} avis vérifiés.'}`),
  expected: `Avis Clients | ${trust.ratingValueLabel}/5 sur ${trust.reviewCountLabel}+ avis vérifiés`,
});

addCheck({
  id: "home-jsonld-rating",
  category: "structured-data",
  file: "index.html",
  description: "Le JSON-LD statique utilise la note et le nombre d'avis partagés",
  pass: contents["index.html"].includes(`"ratingValue":"${trust.ratingValueLabel}","reviewCount":"${trust.reviewCountLabel}"`),
  expected: `${trust.ratingValueLabel} / ${trust.reviewCountLabel}`,
});

addCheck({
  id: "react-home-shared-source",
  category: "react-source",
  file: "src/pages/Index.tsx",
  description: "La home React lit la note GEO depuis la source partagée",
  pass: contents["src/pages/Index.tsx"].includes("addOrganizationSchema(geoContent.trust.ratingValue, geoContent.trust.reviewCount)"),
  expected: "geoContent.trust.ratingValue + geoContent.trust.reviewCount",
});

for (const file of [
  "src/pages/AvisClients.tsx",
  "src/pages/LlmsTxt.tsx",
  "src/components/comparison/WhyUsComparison.tsx",
  "src/components/insurance/ExpertiseSection.tsx",
]) {
  addCheck({
    id: `${file}-shared-rating`,
    category: "react-source",
    file,
    description: `${path.basename(file)} lit bien les métriques GEO depuis la source partagée`,
    pass: contents[file].includes("geoContent.trust.ratingValueLabel") && contents[file].includes("geoContent.trust.reviewCountLabel"),
    expected: "geoContent.trust.ratingValueLabel + geoContent.trust.reviewCountLabel",
  });
}

for (const file of ["index.html", "public/llms.txt", "src/components/admin/SERPPreview.tsx", "src/data/landingConfigs.tsx"]) {
  const fileContent = contents[file];
  for (const { pattern, label } of stalePatterns) {
    const matches = [...fileContent.matchAll(pattern)];
    matches.forEach((match, index) => {
      addCheck({
        id: `${file}-${label}-${index}`,
        category: "stale-copy",
        file,
        description: `${label} détecté dans ${file}`,
        pass: false,
        expected: `Remplacer par ${trust.ratingValueLabel}/5 et ${trust.reviewCountLabel} avis si c'est une métrique marque`,
        actual: match[0],
      });
    });
  }
}

const passedChecks = checks.filter((check) => check.pass).length;
const failedChecks = checks.length - passedChecks;
const score = checks.length === 0 ? 100 : Math.round((passedChecks / checks.length) * 100);

const status = score >= 95 ? "excellent" : score >= 80 ? "good" : score >= 60 ? "warning" : "critical";

const report = {
  generatedAt: new Date().toISOString(),
  score,
  status,
  summary: {
    totalChecks: checks.length,
    passedChecks,
    failedChecks,
    auditedFiles: [...new Set(checks.map((check) => check.file))].length,
    staticRoutes: geoContent.staticPages.length + 1,
  },
  mismatches: checks.filter((check) => !check.pass),
  checks,
};

await mkdir(path.dirname(reportPath), { recursive: true });
await writeFile(reportPath, JSON.stringify(report, null, 2), "utf8");

console.log(`\n[GEO Audit] Score ${score}/100 — ${passedChecks}/${checks.length} checks passés`);

if (failedChecks === 0) {
  console.log("[GEO Audit] Aucun écart détecté entre React et le HTML statique audité.\n");
} else {
  console.log("[GEO Audit] Différences détectées avant build :");
  report.mismatches.forEach((diff, index) => {
    console.log(`${index + 1}. [${diff.category}] ${diff.file} — ${diff.description}`);
    if (diff.actual) {
      console.log(`   trouvé: ${diff.actual}`);
    }
    console.log(`   attendu: ${diff.expected}`);
  });
  console.log("");
}