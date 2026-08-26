import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

const rootDir = process.cwd();
const reportPath = path.join(rootDir, "public", "geo-audit-report.json");
const geoContent = JSON.parse(await readFile(path.join(rootDir, "src/data/geo-content.json"), "utf8"));
const trust = geoContent.trust;
const excludedDirectories = new Set(["dist", "node_modules", ".git", "test-hosting-paths"]);

// ---- Overrides de meta (Supabase) ----------------------------------------
// Interroges en REST plutot qu'avec supabase-js : pas de dependance au
// WebSocket natif, donc le meme comportement en local (Node 20) et sur Vercel.
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || "https://ybqxpngkbgosobtetxac.supabase.co";
const SUPABASE_ANON = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlicXhwbmdrYmdvc29idGV0eGFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyNTM0NzksImV4cCI6MjA3NzgyOTQ3OX0.ekYS4QpTPlcJ82Cf4xXvwS1LsM4LhFodG-u31Mb7Rbg";

const metaOverrides = new Map();
let overridesAvailable = false;
try {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/page_meta_overrides?select=page_path,meta_title,meta_description`,
    { headers: { apikey: SUPABASE_ANON, Authorization: `Bearer ${SUPABASE_ANON}` } },
  );
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  for (const row of await res.json()) {
    if (row?.page_path) metaOverrides.set(row.page_path, row);
  }
  overridesAvailable = true;
  console.log(`[GEO Audit] ${metaOverrides.size} page_meta_overrides charges.`);
} catch (err) {
  console.warn(`[GEO Audit] Supabase indisponible (${err?.message || err}), repli sur geo-content.json : les divergences liees a un override seront comptees comme des echecs.`);
}

// Un override est considere anormal si un mot significatif de son premier
// segment de titre n'apparait nulle part dans le contenu visible de la page.
// C'est ce qui distingue "/blog" titre avec le mot-cle d'un article precis
// d'un titre simplement reformule a la main.
const STOPWORDS = new Set(["assurance", "assurances", "jemassuremoinscher", "moins", "cher", "gratuit", "ligne", "france", "votre", "notre", "pour", "avec", "guide", "guides", "definition", "definitions", "comparatif", "comparateur", "meilleur", "meilleure", "meilleures", "meilleurs", "conseils", "tarif", "tarifs", "devis", "prix", "2025", "2026"]);
const normalizeWords = (value = "") =>
  value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
// On ne regarde QUE le corps rendu (#root), jamais le <head> : sinon le titre
// se trouverait lui-meme dans le texte compare et le check se validerait tout
// seul — c'est precisement ce qui aurait laisse passer la contamination /blog.
const visibleText = (html = "") => {
  const body = html.match(/<div id="root">([\s\S]*?)<\/body>/i)?.[1] ?? html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)?.[1] ?? "";
  return normalizeWords(body.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " "));
};
const anomalousOverrideWords = (metaTitle, html) => {
  const firstSegment = String(metaTitle || "").split("|")[0];
  const body = visibleText(html);
  return normalizeWords(firstSegment)
    .split(" ")
    .filter((w) => w.length >= 5 && !STOPWORDS.has(w))
    // Comparaison par prefixe de 5 caracteres : "contactez" doit matcher une
    // page qui ecrit "contact", sans quoi toute variante morphologique du
    // titre produirait un faux positif.
    .filter((w) => !body.includes(w.slice(0, 5)));
};

const stalePatterns = [
  { pattern: /4\.8\/5/g, label: "Ancienne note 4.9/5" },
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

const makeCheck = ({ id, category, file, description, pass, expected, weight, actual = null, severity = "error" }) => ({
  id,
  category,
  file,
  description,
  pass,
  expected,
  // severity "info" = divergence expliquee par un override assume : elle est
  // listee pour information mais exclue du score, sinon toute page volontairement
  // personnalisee en base plafonnerait le score indefiniment.
  severity,
  weight,
  impact: severity === "info" ? 0 : weight,
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
  const descriptionMatch = html.match(/<meta[^>]+name=["']description["'][^>]+content=(?:"([^"]*)"|'([^']*)')/i);
  const description = descriptionMatch?.[1] ?? descriptionMatch?.[2] ?? null;
  const h1 = extractTagContent(html, /<div id="root">[\s\S]*?<h1>([^<]+)<\/h1>/i);
  const override = metaOverrides.get(page.route);

  // Deux categories : si la valeur observee correspond a un override existant,
  // la divergence avec geo-content.json est intentionnelle -> info non penalisante.
  // Si elle ne correspond ni a la source GEO ni a un override -> echec.
  const evaluate = (id, category, label, actual, geoExpected, overrideExpected) => {
    const matchesGeo = actual === geoExpected;
    const matchesOverride = Boolean(overrideExpected) && actual === overrideExpected;
    const explained = !matchesGeo && matchesOverride;
    addCheck(makeCheck({
      id: `${outputDir}-${id}`,
      category: explained ? `${category}-override` : category,
      file,
      description: explained
        ? `${label} de ${outputDir} suit un override assume en base (divergence attendue avec la source GEO)`
        : `${label} de ${outputDir} correspond à la source GEO`,
      pass: matchesGeo || matchesOverride,
      expected: explained ? overrideExpected : geoExpected,
      actual,
      weight: 10,
      severity: explained ? "info" : "error",
    }));
  };

  evaluate("title", "static-title", "Le titre statique", title, page.title, override?.meta_title);
  evaluate("description", "static-description", "La meta description statique", description, page.description, override?.meta_description);
  evaluate("h1", "static-h1", "Le H1 statique", h1, page.h1, null);

  // Heuristique : un override dont le titre introduit un mot absent de la page
  // est probablement une contamination automatique, pas une reformulation.
  if (override?.meta_title) {
    const strayWords = anomalousOverrideWords(override.meta_title, html);
    addCheck(makeCheck({
      id: `${outputDir}-override-coherence`,
      category: "override-anomaly",
      file,
      description: `L'override de ${outputDir} reste cohérent avec le contenu de la page`,
      pass: strayWords.length === 0,
      expected: "aucun mot du titre absent du contenu de la page",
      actual: strayWords.length ? `mot(s) absent(s) de la page : ${strayWords.join(", ")} — override « ${override.meta_title} »` : null,
      weight: 10,
    }));
  }
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

// Le score se calcule sur `impact` et non `weight` : les checks de severite
// "info" (divergences expliquees par un override) valent 0 des deux cotes,
// donc elles ne penalisent ni ne gonflent le score.
const scored = checks.filter((check) => check.impact > 0);
const passedWeight = scored.filter((check) => check.pass).reduce((sum, check) => sum + check.impact, 0);
const totalWeight = scored.reduce((sum, check) => sum + check.impact, 0);
const passedChecks = checks.filter((check) => check.pass).length;
const failedChecks = checks.length - passedChecks;
const infoChecks = checks.filter((check) => check.severity === "info");
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
    infoChecks: infoChecks.length,
    overridesLoaded: overridesAvailable ? metaOverrides.size : null,
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

console.log(`\n[GEO Audit] Score ${score}/100 — ${passedChecks}/${checks.length} checks passés${infoChecks.length ? `, ${infoChecks.length} divergences assumées (override)` : ""}`);
if (infoChecks.length) {
  console.log("[GEO Audit] Divergences expliquées par un override (non comptées dans le score) :");
  infoChecks.forEach((c) => console.log(`   - ${c.file} : ${c.category}`));
}
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