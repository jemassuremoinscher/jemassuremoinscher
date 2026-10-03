/**
 * Contrôle post-build des vignettes de l'étape contact du tunnel de devis
 * (src/components/forms/teaserPrices.ts). Échoue si :
 * (a) un produit (InsuranceType) ayant une étape contact n'a pas d'entrée dans
 *     teaserPrices. Le comparateur délègue au produit choisi (ses étapes sont
 *     remplacées par celles du produit, cf. MultiStepQuoteForm) : on vérifie
 *     donc que chaque type proposé par son étape « type » a une entrée ;
 * (b) la vignette affiche un BADGE « Meilleur prix » (champ badge d'une vignette
 *     ou badge rendu par FlipPriceCard.tsx). Décision du 3 octobre 2026 : la
 *     règle ne concerne que ce badge ; « meilleur prix » reste permis ailleurs ;
 * (c) un pool animaux contient un assureur non spécialisé, ou les trois
 *     vignettes animaux n'utilisent pas le même pool de 6 logos (trois logos
 *     affichés toujours différents) ;
 * (d) les noms des vignettes d'un produit diffèrent des libellés (fr) des
 *     options de son étape « formule » (ids des niches : table
 *     FORMULE_STEP_ID, ex. « trot_formule », « velo_formule », « me_niveau »).
 *
 * (e) pour vélo, camping-car, sans permis, auto temporaire, protection
 *     juridique et mutuelle entreprise, une garantie hors du libellé de la
 *     formule (ex. casse dans « Vol uniquement », durée fixe en auto temporaire) ;
 * (f) une vignette promet de l'immédiateté (« Couverture immédiate »…) ;
 * (h) trois vignettes d'un produit n'affichent pas trois logos d'assureurs
 *     différents (tous produits, sauf trottinette : logo April seul) ;
 * (g) un produit mélange vignettes avec prix et « Sur devis », ou un produit
 *     « Sur devis » (animaux, trottinette, auto temporaire) affiche un prix.
 *
 * Décisions du 3 octobre 2026. Lancé par npm run build.
 */
import path from "node:path";
import { readFileSync } from "node:fs";

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

  // (b) badge de vignette uniquement
  for (const [type, entry] of Object.entries(teaserPrices)) {
    for (const p of entry.prices) {
      if (/meilleur prix/i.test(String(p.badge || ""))) problems.push(`(b) ${type} / ${p.name} : badge « Meilleur prix »`);
    }
  }
  const flipSource = readFileSync(path.join(rootDir, "src/components/forms/FlipPriceCard.tsx"), "utf8")
    .replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");
  if (/meilleur prix/i.test(flipSource)) problems.push("(b) FlipPriceCard.tsx : badge « Meilleur prix » rendu sur une vignette");

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

  // (e) Garanties alignées sur le libellé de la formule pour les 6 produits
  // renommés (décision du 3 octobre 2026) : une formule « Au tiers »,
  // « … seule » ou « … uniquement » ne liste ni casse, ni incendie, ni
  // dommages, ni bris de glace, ni assistance ; « Vol uniquement » ne liste
  // pas non plus la responsabilité civile ; l'auto temporaire ne parle pas de
  // durées fixes (ses formules ne sont pas des durées).
  const ALIGNED = ["velo", "camping_car", "sans_permis", "auto_temporaire", "protection_juridique", "mutuelle_entreprise"];
  for (const type of ALIGNED) {
    for (const p of teaserPrices[type]?.prices || []) {
      const feats = p.features.join(" | ");
      if (/^au tiers|\bseule\b|\buniquement\b/i.test(p.name) && /\b(casse|incendie|dommages|bris de glace|assistance)\b/i.test(feats)) {
        problems.push(`(e) ${type} / ${p.name} : garantie hors formule (${feats})`);
      }
      if (/vol uniquement/i.test(p.name) && /responsabilit/i.test(feats)) problems.push(`(e) ${type} / ${p.name} : responsabilité civile hors formule`);
      if (type === "auto_temporaire" && /\b\d+\s*jours?\b|jour par jour/i.test(`${p.name} ${feats}`)) problems.push(`(e) auto_temporaire / ${p.name} : durée fixe (${feats})`);
    }
  }

  // (h) Trois logos différents pour TOUS les produits, pour chacune des 997
  // valeurs de rotationSeed, avec le calcul de MultiStepQuoteForm (premier logo
  // du pool tourné qui n'est pas déjà affiché). Deux fichiers du même
  // assureur (ex. macif / macif-new) comptent comme un seul logo.
  // Exception : trottinette, logo April seul par décision de Paul (3 octobre
  // 2026), en attendant qu'il valide d'autres assureurs.
  const LOGO_EXEMPT = new Set(["trottinette"]);
  const insurerKey = (src) => logoName(src).replace(/-(new|moto)$/, "").replace(/^alan-new$/, "alan");
  const pickTeaserLogos = (prices, seed) => {
    const used = new Set();
    return prices.map((p, i) => {
      const pool = p.logoPool.filter(Boolean);
      const start = pool.length ? (seed + i * 7) % pool.length : 0;
      const rotated = pool.slice(start).concat(pool.slice(0, start));
      const logo = rotated.find((l) => !used.has(l)) ?? rotated[0] ?? "";
      used.add(logo);
      return logo;
    });
  };
  for (const [type, entry] of Object.entries(teaserPrices)) {
    if (LOGO_EXEMPT.has(type)) continue;
    for (let seed = 0; seed < 997; seed += 1) {
      const shown = pickTeaserLogos(entry.prices, seed).map(insurerKey);
      if (new Set(shown).size !== shown.length) {
        problems.push(`(h) ${type} : logos en double pour rotationSeed=${seed} (${shown.join(", ")})`);
        break;
      }
    }
  }

  // (g) Homogénéité : dans un produit, les trois vignettes ont toutes un prix
  // ou sont toutes « Sur devis » ; produits obligatoirement « Sur devis ».
  const SUR_DEVIS = ["animaux", "trottinette", "auto_temporaire"];
  for (const [type, entry] of Object.entries(teaserPrices)) {
    const withPrice = entry.prices.filter((p) => !!p.price).length;
    if (withPrice !== 0 && withPrice !== entry.prices.length) problems.push(`(g) ${type} : vignettes mélangées prix / « Sur devis »`);
    if (SUR_DEVIS.includes(type) && withPrice > 0) problems.push(`(g) ${type} : doit être entièrement « Sur devis »`);
  }

  // (f) Aucune promesse d'immédiateté dans les vignettes.
  for (const [type, entry] of Object.entries(teaserPrices)) {
    for (const p of entry.prices) {
      if (/imm[ée]diat/i.test(`${p.name} ${p.features.join(" ")}`)) problems.push(`(f) ${type} / ${p.name} : promesse d'immédiateté`);
    }
  }
} finally {
  await vite.close();
}

if (problems.length === 0) {
  console.log("[verify-teasers] OK — vignettes conformes (entrées, badge « Meilleur prix », pool animaux, noms et garanties des formules, immédiateté).");
  process.exit(0);
}
console.error(`[verify-teasers] ÉCHEC — ${problems.length} problème(s) :\n${problems.map((p) => `  - ${p}`).join("\n")}`);
process.exit(1);
