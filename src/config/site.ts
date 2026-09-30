/**
 * Single source of truth for global, marketing-wide numbers displayed across the site.
 * Product-level sub-counts (e.g. "25 assureurs auto") remain in their own modules — they
 * are legitimate subsets of NB_ASSUREURS.
 *
 * NB_ASSUREURS dérive maintenant de src/data/partners.ts (chantier 2026-09-30)
 * au lieu d'être une constante manuelle. Elle vaut 52 aujourd'hui (40
 * historiques + 12 animaux ajoutés le 2026-09-30), pas 70 — le "70+" affiché
 * ailleurs sur le site (145 occurrences trouvées, hors de ce fichier) n'a
 * jamais été dérivé de cette liste et reste à corriger séparément.
 */
import { partners } from "@/data/partners";

export const NB_ASSUREURS = partners.length;
export const NB_AGENCES = 2500;
export const NB_ASSUREURS_LABEL = `${NB_ASSUREURS}+`;
export const NB_AGENCES_LABEL = `${NB_AGENCES.toLocaleString("fr-FR")}+`;

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
 * Vol non couvert par l'IPID e-Trottineur (05/2025) : Paul ajoutera une
 * option plus tard. Ligne conservée dans le tableau de garanties avec cette
 * valeur exacte (ni "Option" ni "Incluse", sur demande explicite) — une
 * seule constante pour la remplacer d'un coup quand l'option existera.
 */
export const TROTTINETTE_VOL_STATUS = "Non incluse. Option à venir.";
