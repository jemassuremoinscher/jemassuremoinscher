/**
 * Single source of truth for global, marketing-wide numbers displayed across the site.
 * Product-level sub-counts (e.g. "25 assureurs auto") remain in their own modules — they
 * are legitimate subsets of NB_ASSUREURS.
 */
export const NB_ASSUREURS = 70;
export const NB_AGENCES = 2500;
export const NB_ASSUREURS_LABEL = `${NB_ASSUREURS}+`;
export const NB_AGENCES_LABEL = `${NB_AGENCES.toLocaleString("fr-FR")}+`;

/** ORIAS — registration pending. Do not surface a number until it is officially attributed. */
export const ORIAS_STATUS_FR = "Immatriculation ORIAS en cours";
export const ORIAS_STATUS_EN = "ORIAS registration pending";

/** Google Place ID used by the /api/google-reviews serverless function. */
export const GOOGLE_PLACE_ID = "ChIJEW-5W2jRzRIRDhndqH-zyMs";
export const GOOGLE_REVIEWS_PUBLIC_URL = "https://g.page/r/CVVFJisN4h4iEAE";
export const GOOGLE_REVIEW_WRITE_URL = "https://g.page/r/CVVFJisN4h4iEAE/review";
