/**
 * Single source of truth for global, marketing-wide numbers displayed across the site.
 * Product-level sub-counts (e.g. "25 assureurs auto") remain in their own modules — they
 * are legitimate subsets of NB_ASSUREURS.
 *
 * NB_ASSUREURS dérive de src/data/partners.ts (chantier 2026-09-30) au lieu
 * d'être une constante manuelle — seule cette liste fait foi.
 *
 * NB_AGENCES (constante manuelle "2500", jamais sourcée par une vraie liste
 * d'agences) a été retirée le 2026-09-30 avec toutes les mentions "2 500+
 * agences locales" du site (décision de Paul, audit accueil) : à
 * réintroduire seulement si une donnée réelle existe pour la justifier.
 */
import { partners } from "@/data/partners";

export const NB_ASSUREURS = partners.length;
// Nombre EXACT (décision de Paul, 2026-10-01) : ni "+" ni "Plus de" accolé.
// Nom conservé pour ne pas toucher les ~100 usages ; vaut String(NB_ASSUREURS).
export const NB_ASSUREURS_LABEL = `${NB_ASSUREURS}`;

/** ORIAS — numéro officiel attribué. */
export const ORIAS_NUMBER = "26011100";
export const ORIAS_STATUS_FR = `Immatriculé ORIAS n° ${ORIAS_NUMBER}`;
export const ORIAS_STATUS_EN = `ORIAS registered, No. ${ORIAS_NUMBER}`;
/** Lien direct vers la fiche de recherche ORIAS (évite de retaper le numéro). */
export const ORIAS_VERIFY_URL = `https://www.orias.fr/home/resultSearch?valueSaisie=${ORIAS_NUMBER}`;

/** Google Place ID used by the /api/google-reviews serverless function. */
export const GOOGLE_PLACE_ID = "ChIJEW-5W2jRzRIRDhndqH-zyMs";
export const GOOGLE_REVIEWS_PUBLIC_URL = "https://g.page/r/CVVFJisN4h4iEAE";
export const GOOGLE_REVIEW_WRITE_URL = "https://g.page/r/CVVFJisN4h4iEAE/review";

/**
 * Trottinette (EDPM) — RC seule, tarif d'appel utilisé sur la landing et le
 * pilier. Emplacement unique délibéré (chantier 2026-09-30, après la
 * découverte d'un prix figé "3,50€/mois" dans le HTML statique alors que
 * landingConfigs.tsx disait "2,90€/mois") : à mettre à jour ICI uniquement
 * dès que Paul fournit le devis April (prix + périodicité réels) — ne pas
 * remettre un prix en dur ailleurs.
 * IMPORTANT : 2,90€/mois × 12 = 34,80€/an, pas 33€/an — les deux valeurs ne
 * sont PAS équivalentes (l'annuel n'est pas un simple ×12, cohérent avec un
 * tarif annuel réellement différent). Ne jamais afficher les deux constantes
 * dans la même phrase/bloc de texte : mensuel dans l'accroche/le titre,
 * annuel seulement dans le détail du contrat (décision de Paul, 2026-09-30).
 */
export const TROTTINETTE_RC_PRICE_MONTHLY = "2,90€/mois";
export const TROTTINETTE_RC_PRICE_ANNUAL = "33€/an";
/**
 * Vol non couvert par l'IPID e-Trottineur (05/2025), contrat d'entrée de gamme
 * décrit par le tableau de garanties ; d'autres assureurs le proposent
 * (décision du 3 octobre 2026). Une seule constante, reprise par le tableau.
 */
export const TROTTINETTE_VOL_STATUS = "Non incluse dans ce contrat ; proposée par d'autres assureurs, selon leurs conditions";
/** Note affichée sous le tableau de garanties trottinette. */
export const TROTTINETTE_TABLE_NOTE =
  "Ce tableau décrit le contrat d'entrée de gamme mis en avant sur cette page (document d'information d'un contrat du marché, 2025). Les garanties vol, casse et assistance dépendent de l'assureur : un conseiller vous présente ce que chaque contrat inclut ou exclut.";
