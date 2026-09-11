/**
 * Single source of truth for global, marketing-wide numbers displayed across the site.
 * Product-level sub-counts (e.g. "25 assureurs auto") remain in their own modules — they
 * are legitimate subsets of NB_ASSUREURS.
 */
export const NB_ASSUREURS = 70;
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
