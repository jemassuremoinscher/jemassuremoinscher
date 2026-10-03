/**
 * Contrôle post-build des vignettes de l'étape contact du tunnel de devis
 * (src/components/forms/teaserPrices.ts). Échoue si :
 * (a) un produit (InsuranceType) ayant une étape contact n'a pas d'entrée dans
 *     teaserPrices. Le comparateur délègue au produit choisi (ses étapes sont
 *     remplacées par celles du produit, cf. MultiStepQuoteForm) : on vérifie
 *     donc que chaque type proposé par son étape « type » a une entrée ;
 * (b) une vignette contient « Meilleur prix » ;
 * (c) un pool animaux contient un assureur non spécialisé, ou les trois
 *     vignettes animaux n'utilisent pas le même pool de 6 logos (trois logos
 *     affichés toujours différents) ;
 * (d) les noms des vignettes d'un produit diffèrent des libellés (fr) des
 *     options de son étape « formule » (ids des niches : table
 *     FORMULE_STEP_ID, ex. « trot_formule », « velo_formule », « me_niveau »).
 *
 * Décisions du 3 octobre 2026. Lancé par npm run build.
 */
import path from "node:path";

const rootDir = process.cwd();

// Assureurs spécialisés dans l'animal autorisés dans les vignettes animaux.
const ANIMAUX_ALLOWED = ["santevet", "acheel", "fidanimo", "bulle-bleue", "animaux-sante", "goodflair"];

const { createServer } = await import("vite");
const stubAssets = {
  name: "stub-assets",
  enforce: "pre",
  resolveId(id) {
    if (/\.(jpg|jpeg|png|webp|svg|gif|avif)(\?.*)?$/.test(id)) return "\0stub:" + id;
  },
  // Le stub renvoie le chemin du fichier : on identifie l'assureur par son nom.
  load(id) {
    if (id.startsWith("\0stub:")) return `export default ${JSON.stringify(id.slice(6))};`;
  },
};
const vite = await createServer({
  configFile: false,
  root: rootDir,
  resolve: { alias: { "@": path.join(rootDir, "src") } },
  plugins: [stubAssets],
  server: { middlewareMode: true },
  optimizeDeps: { noDiscovery: true, include: [] },
  logLevel: "silent",
});

const problems = [];
try {
  const { teaserPrices, ANIMAUX_POOL } = await vite.ssrLoadModule(path.join(rootDir, "src/components/forms/teaserPrices.ts"));
  const { buildStepConfigs } = await vite.ssrLoadModule(path.join(rootDir, "src/components/forms/stepConfigs.ts"));
  const fr = (await vite.ssrLoadModule(path.join(rootDir, "src/i18n/fr.ts"))).default;
  const t = (key, vars) => {
    let raw = fr[key] ?? key;
    for (const [k, v] of Object.entries(vars || {})) raw = raw.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
    return raw;
  };
  const configs = buildStepConfigs(t);
  const logoName = (src) => path.basename(String(src)).replace(/\.(png|webp|jpg|jpeg|svg|avif)(\?.*)?$/, "");

  // (a)
  for (const [type, steps] of Object.entries(configs)) {
    if (!steps.some((s) => s.type === "contact")) continue;
    if (type === "comparateur") {
      const typeStep = steps.find((s) => s.field === "insuranceType");
      for (const o of typeStep?.options || []) {
        if (!teaserPrices[o.value]) problems.push(`(a) comparateur → ${o.value} : aucune entrée dans teaserPrices`);
      }
      continue;
    }
    if (!teaserPrices[type]) problems.push(`(a) ${type} : étape contact sans entrée dans teaserPrices`);
  }

  // (b)
  for (const [type, entry] of Object.entries(teaserPrices)) {
    for (const p of entry.prices) {
      if (/meilleur prix/i.test(JSON.stringify(p))) problems.push(`(b) ${type} / ${p.name} : « Meilleur prix »`);
    }
  }

  // (c)
  const animaux = teaserPrices.animaux?.prices || [];
  const poolNames = (ANIMAUX_POOL || []).map(logoName);
  if (poolNames.length !== 6 || poolNames.some((n) => !ANIMAUX_ALLOWED.includes(n)) || new Set(poolNames).size !== 6) {
    problems.push(`(c) ANIMAUX_POOL doit contenir exactement les 6 assureurs spécialisés (${ANIMAUX_ALLOWED.join(", ")}) : ${poolNames.join(", ")}`);
  }
  for (const p of animaux) {
    const names = p.logoPool.map(logoName);
    const bad = names.filter((n) => !ANIMAUX_ALLOWED.includes(n));
    if (bad.length) problems.push(`(c) animaux / ${p.name} : assureur(s) non spécialisé(s) : ${bad.join(", ")}`);
    if (names.join("|") !== poolNames.join("|")) problems.push(`(c) animaux / ${p.name} : pool différent d'ANIMAUX_POOL (logos affichés pas forcément distincts)`);
  }
  for (let seed = 0; seed < 997; seed += 1) {
    const shown = animaux.map((p, i) => p.logoPool[(seed + i * 7) % p.logoPool.length]);
    if (new Set(shown).size !== shown.length) {
      problems.push(`(c) animaux : logos affichés non distincts pour rotationSeed=${seed}`);
      break;
    }
  }

  // (d) Étape « formule » de chaque produit. Les niches ont des ids
  // différents : table explicite (décision du 3 octobre 2026).
  const FORMULE_STEP_ID = {
    trottinette: "trot_formule",
    velo: "velo_formule",
    camping_car: "cc_formule",
    sans_permis: "sp_formule",
    auto_temporaire: "at_formule",
    protection_juridique: "pj_formule",
    mutuelle_entreprise: "me_niveau",
  };
  for (const [type, steps] of Object.entries(configs)) {
    const formule = steps.find((s) => s.id === (FORMULE_STEP_ID[type] || "formule"));
    if (!formule || !teaserPrices[type]) continue;
    const labels = (formule.options || []).map((o) => o.label);
    const names = teaserPrices[type].prices.map((p) => p.name);
    if (labels.join("|") !== names.join("|")) {
      problems.push(`(d) ${type} : vignettes [${names.join(" | ")}] ≠ étape ${formule.id} [${labels.join(" | ")}]`);
    }
  }
} finally {
  await vite.close();
}

if (problems.length === 0) {
  console.log("[verify-teasers] OK — vignettes conformes (entrées, « Meilleur prix », pool animaux, noms des formules).");
  process.exit(0);
}
console.error(`[verify-teasers] ÉCHEC — ${problems.length} problème(s) :\n${problems.map((p) => `  - ${p}`).join("\n")}`);
process.exit(1);
