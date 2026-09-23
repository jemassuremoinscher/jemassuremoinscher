import { Card } from "@/components/ui/card";

/**
 * Sections de fond de /assurance-vtc, rédigées le 2026-09-23 à partir de
 * sources primaires lues le même jour (aucun chiffre de prix : uniquement
 * des règles attribuées à leur source).
 *
 * Sources (toutes paraphrasées, jamais recopiées) :
 * - Code des transports : L3120-1 (définition, en vigueur), L3120-2-2 (créé
 *   par l'article 9 de la loi n° 2016-1920 du 29 décembre 2016), L3120-4
 *   (créé par la loi n° 2014-1104 du 1er octobre 2014 — DEUX textes
 *   différents, à ne pas confondre), L3122-3 et L3122-4
 * - service-public.gouv.fr, « Devenir chauffeur de VTC » (vérifiée le
 *   12 août 2026)
 * - SDES (Service des données et études statistiques), Observatoire
 *   national des transports publics particuliers de personnes, page
 *   publiée le 13 novembre 2025
 *
 * Pas de section HowTo ni de schéma HowTo sur cette page : contrairement à
 * sans-permis, vélo et camping-car, il n'existe pas de formulaire de devis
 * VTC dédié dans le dépôt. Le CTA renvoie vers le comparateur générique
 * (insuranceType="comparateur", même flux que la page Comparateur et le
 * Hero de la page d'accueil) : inventer des étapes numérotées spécifiques
 * au VTC aurait fixé une fausse promesse de parcours dédié.
 *
 * Volontairement ABSENTS (non vérifiés) : tout chiffre de prix ; le contenu
 * réglementaire détaillé des articles R3122-x (conditions techniques du
 * véhicule) ; un repère de marché sur le chiffre d'affaires ou les revenus
 * des chauffeurs.
 */

const SRC = {
  l31201: { label: "Code des transports, article L3120-1 (Légifrance)", href: "https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000029530535" },
  l312022: { label: "Code des transports, article L3120-2-2 (Légifrance)", href: "https://www.legifrance.gouv.fr/affichCodeArticle.do?cidTexte=LEGITEXT000023086525&idArticle=LEGIARTI000033738163" },
  l31204: { label: "Code des transports, article L3120-4 (Légifrance)", href: "https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000033745494" },
  l31223: { label: "Code des transports, article L3122-3 (Légifrance)", href: "https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000043154009" },
  spVtc: { label: "service-public.gouv.fr, devenir chauffeur de VTC (vérifiée le 12 août 2026)", href: "https://entreprendre.service-public.gouv.fr/vosdroits/F31027" },
  sdes: { label: "SDES, Observatoire national des transports publics particuliers de personnes (13 novembre 2025)", href: "https://www.statistiques.developpement-durable.gouv.fr/les-chauffeurs-des-plateformes-de-vtc-en-2024-premiers-resultats" },
} as const;

type SrcKey = keyof typeof SRC;

const Sources = ({ keys }: { keys: SrcKey[] }) => (
  <p className="text-xs text-muted-foreground mt-4 leading-relaxed">
    Sources :{" "}
    {keys.map((k, i) => (
      <span key={k}>
        <a href={SRC[k].href} target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">
          {SRC[k].label}
        </a>
        {i < keys.length - 1 ? " · " : ""}
      </span>
    ))}
  </p>
);

const H2 = "text-xl md:text-2xl font-bold text-foreground mb-3";
const H3 = "text-base md:text-lg font-semibold text-foreground mt-6 mb-2";
const P = "text-muted-foreground leading-relaxed mb-3";
const UL = "list-disc pl-5 space-y-2 text-muted-foreground leading-relaxed mb-3";

export const VtcReglementation = () => (
  <section className="max-w-4xl mx-auto mb-12" aria-labelledby="vtc-regle-title">
    <h2 id="vtc-regle-title" className={H2}>VTC : ce que dit la réglementation</h2>
    <p className={P}>
      Le VTC (voiture de transport avec chauffeur) est un service de transport de personnes exécuté à titre onéreux, avec un véhicule de moins de dix places — au moins quatre et au plus neuf, conducteur compris (Code des transports, article L3120-1). C'est un statut distinct du taxi.
    </p>
    <h3 className={H3}>Carte professionnelle et registre</h3>
    <ul className={UL}>
      <li>
        <strong className="text-foreground">Carte professionnelle.</strong> Obligatoire, délivrée par l'autorité administrative (article L3120-2-2, créé par l'article 9 de la loi n° 2016-1920 du 29 décembre 2016).
      </li>
      <li>
        <strong className="text-foreground">Conditions.</strong> Selon service-public.gouv.fr : permis B depuis 3 ans (2 ans si conduite accompagnée), casier judiciaire sans certaines condamnations (bulletin n° 2), contrôle médical favorable, réussite de l'examen théorique et pratique — ou équivalence par expérience professionnelle de transporteur de personnes.
      </li>
      <li>
        <strong className="text-foreground">Registre.</strong> L'exploitant est inscrit sur un registre public, renouvelable tous les 5 ans (article L3122-3).
      </li>
    </ul>
    <Sources keys={["l31201", "l312022", "l31223", "spVtc"]} />
  </section>
);

export const VtcAssuranceObligatoire = () => (
  <section className="max-w-4xl mx-auto mb-12" aria-labelledby="vtc-assurance-title">
    <h2 id="vtc-assurance-title" className={H2}>Assurance obligatoire : deux textes à ne pas confondre</h2>
    <p className={P}>
      L'article L3120-4 du Code des transports impose à toute personne exerçant cette activité de « pouvoir justifier à tout moment de l'existence d'un contrat d'assurance couvrant sa responsabilité civile professionnelle ». L'inscription au registre doit être accompagnée de l'attestation correspondante (article L3122-4).
    </p>
    <p className={P}>
      Cette obligation d'assurance ne vient pas du même texte que la carte professionnelle : elle a été créée par la loi n° 2014-1104 du 1ᵉʳ octobre 2014, deux ans avant la loi n° 2016-1920 du 29 décembre 2016 qui a créé la carte professionnelle. Ce sont deux réformes distinctes, souvent confondues sous le seul nom de « loi Grandguillaume ».
    </p>
    <p className={P}>
      Selon service-public.gouv.fr, cette assurance responsabilité civile professionnelle est disponible « chez tous les assureurs ». Son défaut est puni d'une amende pouvant aller jusqu'à 3 750 €.
    </p>
    <Sources keys={["l31204", "spVtc"]} />
  </section>
);

export const VtcMarche = () => (
  <section className="max-w-4xl mx-auto mb-12" aria-labelledby="vtc-marche-title">
    <h2 id="vtc-marche-title" className={H2}>Le marché du VTC en France</h2>
    <p className={P}>
      Selon le SDES (Observatoire national des transports publics particuliers de personnes, page publiée le 13 novembre 2025), la France comptait environ 71 300 chauffeurs actifs sur les plateformes de VTC en 2024, soit 27 % de plus qu'en 2023 et 51 % de plus qu'en 2022.
    </p>
    <Sources keys={["sdes"]} />
  </section>
);

export const VtcSourcesNote = () => (
  <Card className="p-4 md:p-5 bg-muted/30 max-w-4xl mx-auto mb-12">
    <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
      <strong className="text-foreground">Sources consultées le 23 septembre 2026.</strong> Les textes de loi ont été lus sur Légifrance le même jour. Le bouton de comparaison de cette page ouvre notre comparateur général, où vous choisissez vous-même le type de contrat à comparer : ce n'est pas un parcours de devis VTC dédié. Les pages de sources sont publiques, susceptibles d'évoluer : les textes en vigueur et votre contrat font foi.
    </p>
  </Card>
);
