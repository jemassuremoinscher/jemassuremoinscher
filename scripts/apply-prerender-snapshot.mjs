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

  // Pages VerticalInsurancePage (composant partagé) — oubliées lors du lot
  // "17 pages catégorie (MultiStepQuoteForm)" du 2026-09-05, qui ne comptait
  // que les pages important MultiStepQuoteForm directement. Sans snapshot, leur
  // HTML brut était le shell SPA de la home (titre, description et canonical de
  // l'accueil) : contenu invisible aux crawlers sans JavaScript.
  { route: "/assurance-velo", file: "assurance-velo.html" },
  { route: "/assurance-scooter-50cc", file: "assurance-scooter-50cc.html" },
  { route: "/assurance-sans-permis", file: "assurance-sans-permis.html" },
  { route: "/assurance-camping-car", file: "assurance-camping-car.html" },
  { route: "/assurance-cyber", file: "assurance-cyber.html" },
  { route: "/assurance-decennale", file: "assurance-decennale.html" },
  { route: "/assurance-flotte-auto", file: "assurance-flotte-auto.html" },
  { route: "/assurance-vtc", file: "assurance-vtc.html" },
  { route: "/assurance-mutuelle-entreprise", file: "assurance-mutuelle-entreprise.html" },
  { route: "/assurance-protection-juridique", file: "assurance-protection-juridique.html" },
  { route: "/assurance-auto-temporaire", file: "assurance-auto-temporaire.html" },

  // Pages de contenu restées en shell SPA (canonical de l'accueil dans le HTML
  // brut), ajoutées le 2026-09-21 après audit des 100 routes statiques. Exclues
  // volontairement : 7 pages utilitaires noindex (/auth, /reset-password,
  // /commercial, /merci, /merci-guide, /blog-preview, /newsletter-gestion) et
  // 10 pages déjà servies par generate-static-pages.mjs avec un canonical propre.
  // /assurance-emprunteur : le canonical pointe volontairement vers
  // /assurance-pret (code de la page) ; le snapshot le reproduit fidèlement.
  { route: "/assurance-auto-jeune-conducteur", file: "assurance-auto-jeune-conducteur.html" },
  { route: "/assurance-trottinette-livreur", file: "assurance-trottinette-livreur.html" },
  { route: "/assurance-auto-malus", file: "assurance-auto-malus.html" },
  { route: "/assurance-auto-comparatif", file: "assurance-auto-comparatif.html" },
  { route: "/assurance-auto-permis-etranger", file: "assurance-auto-permis-etranger.html" },
  { route: "/assurance-emprunteur", file: "assurance-emprunteur.html" },
  { route: "/mutuelle-tns", file: "mutuelle-tns.html" },
  { route: "/qui-sommes-nous", file: "qui-sommes-nous.html" },
  { route: "/qui-sommes-nous/paul", file: "qui-sommes-nous-paul.html" },
  { route: "/qui-sommes-nous/groupe-mammouth", file: "qui-sommes-nous-groupe-mammouth.html" },
  { route: "/avis-clients", file: "avis-clients.html" },
  { route: "/faq", file: "faq.html" },
  { route: "/sources-et-methodologie", file: "sources-et-methodologie.html" },
  { route: "/comparatif", file: "comparatif.html" },
  { route: "/profil", file: "profil.html" },

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

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const remapAssets = (html, currentMap) => {
  let working = html;
  const removed = [];

  // Chunk JS/CSS référencé par un snapshot mais absent du build courant (ex. le chunk
  // "charts", supprimé de vite.config.ts le 2026-09-13 alors que 53 snapshots le
  // référençaient encore). Garder l'ancienne référence est pire que la retirer : le
  // repli SPA de Vercel répond 200 avec le HTML de l'accueil (300 Ko) à la place du
  // fichier, que chaque visiteur téléchargeait sans cache. On retire donc la balise
  // <script>/<link> entière.
  const stale = new Map();
  for (const m of html.matchAll(ASSET_RE)) {
    const [, base, , ext] = m;
    if ((ext === "js" || ext === "css") && !currentMap.has(`${base}.${ext}`)) stale.set(`${base}.${ext}`, { base, ext });
  }
  for (const [key, { base, ext }] of stale) {
    const tagRe = new RegExp(
      `<(?:script|link)\\b[^>]*\\b(?:src|href)="/assets/${escapeRe(base)}-[\\w-]{8,}\\.${ext}"[^>]*>(?:\\s*</script>)?`,
      "g"
    );
    const before = working.length;
    working = working.replace(tagRe, () => {
      removed.push(key);
      return "";
    });
    if (working.length === before) removed.push(`${key} (référence hors balise, conservée)`);
  }

  // Autres références absentes du build (images, polices…) : on garde l'ancienne
  // référence plutôt que de casser le lien, et on la signale.
  const missing = [];
  const remapped = working.replace(ASSET_RE, (full, base, _oldHash, ext) => {
    const key = `${base}.${ext}`;
    const current = currentMap.get(key);
    if (!current) {
      missing.push(key);
      return full;
    }
    return `/assets/${current}`;
  });
  return { remapped, missing, removed };
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
    const { remapped, missing, removed } = remapAssets(html, currentMap);

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
        (removed.length ? ` — ${removed.length} balise(s) vers un chunk disparu retirée(s) : ${removed.join(", ")}` : "") +
        (missing.length ? ` — ${missing.length} asset(s) non retrouvé(s) dans dist/assets/ : ${missing.join(", ")}` : "")
    );
  }
};

await main();
