/**
 * Applique les snapshots prérendus (Option C) à la sortie de `vite build`,
 * sans dépendance Chromium — ce script est celui qui tourne réellement sur
 * Vercel.
 *
 * Contexte : scripts/prerender-routes.mjs a besoin d'un Chromium, absent de
 * l'image de build Vercel (confirmé par les logs : "[prerender] Aucun
 * Chromium trouvé — skip"). Il tourne donc en local (`npm run
 * prerender:snapshot`) et écrit un HTML figé par route dans
 * prerender-snapshots/, committé dans le dépôt. Ce fichier-ci prend le relais
 * au build réel : aucun navigateur nécessaire, juste de la manipulation de
 * texte.
 *
 * Problème réglé ici : les noms de fichiers sous /assets/ sont hashés par
 * Vite à partir du contenu, donc différents à chaque build. Le snapshot
 * committé référence les hash du moment où il a été généré ; ce script les
 * réécrit avec les hash du build courant en comparant les noms de base
 * (avant le hash) présents dans dist/assets/ après `vite build`.
 *
 * Non bloquant à chaque étage : pas de snapshot committé, pas de dist/,
 * ou un asset introuvable dans le mapping -> avertissement, jamais d'échec
 * de build.
 */
import { existsSync } from "node:fs";
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const rootDir = process.cwd();
const distDir = path.join(rootDir, "dist");
const snapshotDir = path.join(rootDir, "prerender-snapshots");

// route -> fichier snapshot (cf. routeSlug dans prerender-routes.mjs).
const SNAPSHOTS = [
  { route: "/", file: "home.html" },
  { route: "/assurance-auto", file: "assurance-auto.html" },
  { route: "/assurance-moto", file: "assurance-moto.html" },
  { route: "/profil/resilie-non-paiement", file: "profil-resilie-non-paiement.html" },
  { route: "/comparatif/maif-vs-macif", file: "comparatif-maif-vs-macif.html" },

  // Pages catégorie (MultiStepQuoteForm) — reste des 17, 2 déjà ci-dessus.
  { route: "/comparateur", file: "comparateur.html" },
  { route: "/assurance-trottinette", file: "assurance-trottinette.html" },
  { route: "/assurance-sante", file: "assurance-sante.html" },
  { route: "/assurance-habitation", file: "assurance-habitation.html" },
  { route: "/assurance-pret", file: "assurance-pret.html" },
  { route: "/assurance-prevoyance", file: "assurance-prevoyance.html" },
  { route: "/assurance-animaux", file: "assurance-animaux.html" },
  { route: "/assurance-vie", file: "assurance-vie.html" },
  { route: "/assurance-expatries", file: "assurance-expatries.html" },
  { route: "/assurance-mrp", file: "assurance-mrp.html" },
  { route: "/assurance-rc-pro", file: "assurance-rc-pro.html" },
  { route: "/assurance-metiers-atypiques", file: "assurance-metiers-atypiques.html" },
  { route: "/assurance-gli", file: "assurance-gli.html" },
  { route: "/assurance-pno", file: "assurance-pno.html" },
  { route: "/gestion-locative", file: "gestion-locative.html" },

  // Profils niche (/profil/:slug) — reste des 14, 1 déjà ci-dessus.
  { route: "/profil/retrait-permis", file: "profil-retrait-permis.html" },
  { route: "/profil/frequence-sinistres", file: "profil-frequence-sinistres.html" },
  { route: "/profil/sans-antecedents", file: "profil-sans-antecedents.html" },
  { route: "/profil/jeune-conducteur-voiture-puissante", file: "profil-jeune-conducteur-voiture-puissante.html" },
  { route: "/profil/fausse-declaration", file: "profil-fausse-declaration.html" },
  { route: "/profil/malus-eleve", file: "profil-malus-eleve.html" },
  { route: "/profil/permis-etranger", file: "profil-permis-etranger.html" },
  { route: "/profil/senior-75-plus", file: "profil-senior-75-plus.html" },
  { route: "/profil/voiture-collection", file: "profil-voiture-collection.html" },
  { route: "/profil/vehicule-importe", file: "profil-vehicule-importe.html" },
  { route: "/profil/chauffeur-vtc-taxi", file: "profil-chauffeur-vtc-taxi.html" },
  { route: "/profil/alcoolemie-stupefiants", file: "profil-alcoolemie-stupefiants.html" },
  { route: "/profil/delit-de-fuite", file: "profil-delit-de-fuite.html" },

  // Duels comparatif (/comparatif/:slug) — liste canonique popularDuels (duelData.ts),
  // 21 au total, 1 déjà ci-dessus.
  { route: "/comparatif/axa-vs-allianz", file: "comparatif-axa-vs-allianz.html" },
  { route: "/comparatif/amv-vs-maaf", file: "comparatif-amv-vs-maaf.html" },
  { route: "/comparatif/direct-assurance-vs-l-olivier", file: "comparatif-direct-assurance-vs-l-olivier.html" },
  { route: "/comparatif/maaf-vs-gmf", file: "comparatif-maaf-vs-gmf.html" },
  { route: "/comparatif/matmut-vs-mma", file: "comparatif-matmut-vs-mma.html" },
  { route: "/comparatif/maif-vs-axa", file: "comparatif-maif-vs-axa.html" },
  { route: "/comparatif/macif-vs-groupama", file: "comparatif-macif-vs-groupama.html" },
  { route: "/comparatif/direct-assurance-vs-luko", file: "comparatif-direct-assurance-vs-luko.html" },
  { route: "/comparatif/gmf-vs-matmut", file: "comparatif-gmf-vs-matmut.html" },
  { route: "/comparatif/allianz-vs-maaf", file: "comparatif-allianz-vs-maaf.html" },
  { route: "/comparatif/axa-vs-maaf", file: "comparatif-axa-vs-maaf.html" },
  { route: "/comparatif/maif-vs-gmf", file: "comparatif-maif-vs-gmf.html" },
  { route: "/comparatif/generali-vs-axa", file: "comparatif-generali-vs-axa.html" },
  { route: "/comparatif/april-vs-alan", file: "comparatif-april-vs-alan.html" },
  { route: "/comparatif/acheel-vs-direct-assurance", file: "comparatif-acheel-vs-direct-assurance.html" },
  { route: "/comparatif/abeille-vs-groupama", file: "comparatif-abeille-vs-groupama.html" },
  { route: "/comparatif/harmonie-vs-ag2r", file: "comparatif-harmonie-vs-ag2r.html" },
  { route: "/comparatif/swiss-life-vs-generali", file: "comparatif-swiss-life-vs-generali.html" },
  { route: "/comparatif/luko-vs-acheel", file: "comparatif-luko-vs-acheel.html" },
  { route: "/comparatif/alan-vs-april", file: "comparatif-alan-vs-april.html" },
];

// Référence un asset hashé Vite : /assets/nom-<hash>.ext
const ASSET_RE = /\/assets\/([a-zA-Z0-9._-]+?)-([\w-]{8,})\.(js|css|png|jpe?g|webp|svg|avif|woff2?|ico)/g;

const buildCurrentAssetMap = async () => {
  const assetsDir = path.join(distDir, "assets");
  const map = new Map(); // "nom.ext" -> "nom-hash.ext" (build courant)
  if (!existsSync(assetsDir)) return map;
  const files = await readdir(assetsDir);
  for (const file of files) {
    const m = file.match(/^(.+?)-([\w-]{8,})(\.[a-zA-Z0-9]+)$/);
    if (m) {
      const [, base, , ext] = m;
      map.set(`${base}${ext}`, file);
    }
  }
  return map;
};

const remapAssets = (html, currentMap) => {
  const missing = [];
  const remapped = html.replace(ASSET_RE, (full, base, _oldHash, ext) => {
    const key = `${base}.${ext}`;
    const current = currentMap.get(key);
    if (!current) {
      missing.push(key);
      return full; // on garde l'ancienne référence plutôt que de casser le lien
    }
    return `/assets/${current}`;
  });
  return { remapped, missing };
};

const main = async () => {
  if (!existsSync(distDir) || !existsSync(path.join(distDir, "index.html"))) {
    console.warn("[prerender-snapshot] dist/ introuvable — build d'abord. Skip.");
    return;
  }
  if (!existsSync(snapshotDir)) {
    console.log("[prerender-snapshot] Aucun snapshot committé (prerender-snapshots/) — skip.");
    return;
  }

  const currentMap = await buildCurrentAssetMap();

  for (const { route, file } of SNAPSHOTS) {
    const snapshotPath = path.join(snapshotDir, file);
    if (!existsSync(snapshotPath)) {
      console.warn(`[prerender-snapshot] ${file} introuvable — route ${route} laissée en SPA.`);
      continue;
    }

    const html = await readFile(snapshotPath, "utf8");
    const { remapped, missing } = remapAssets(html, currentMap);

    const outDir = route === "/" ? distDir : path.join(distDir, route.replace(/^\//, ""));
    await mkdir(outDir, { recursive: true });
    const outFile = path.join(outDir, "index.html");

    // Garde le HTML SPA d'origine (sortie brute de vite build) comme filet de sécurité.
    if (route === "/" && !existsSync(path.join(distDir, "index.spa.html"))) {
      await writeFile(path.join(distDir, "index.spa.html"), await readFile(outFile, "utf8"), "utf8");
    }

    await writeFile(outFile, remapped, "utf8");
    console.log(
      `[prerender-snapshot] ${route} → ${path.relative(rootDir, outFile)} (${Math.round(remapped.length / 1024)} Ko)` +
        (missing.length ? ` — ${missing.length} asset(s) non retrouvé(s) dans dist/assets/ : ${missing.join(", ")}` : "")
    );
  }
};

await main();
