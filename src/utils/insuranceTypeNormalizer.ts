/**
 * Canonical insurance type slugs used across the application.
 * All insurance_type values stored in the database MUST use these canonical forms.
 */
export const CANONICAL_INSURANCE_TYPES = [
  'auto', 'moto', 'habitation', 'sante', 'pret', 'animaux',
  'vie', 'prevoyance', 'rc_pro', 'mrp', 'gli', 'pno', 'gestion_locative',
  'metiers_atypiques',
  'velo', 'camping_car', 'sans_permis', 'auto_temporaire', 'flotte',
  'cyber', 'decennale', 'protection_juridique', 'mutuelle_entreprise',
] as const;

export type CanonicalInsuranceType = typeof CANONICAL_INSURANCE_TYPES[number];

/**
 * Maps various user-facing or legacy labels to the canonical slug.
 * Add any new variant here to keep normalization centralized.
 */
const ALIAS_MAP: Record<string, CanonicalInsuranceType> = {
  // Auto
  'auto': 'auto',
  'assurance auto': 'auto',
  'assurance automobile': 'auto',
  'automobile': 'auto',
  // Moto
  'moto': 'moto',
  'assurance moto': 'moto',
  // Habitation
  'habitation': 'habitation',
  'assurance habitation': 'habitation',
  // Santé
  'sante': 'sante',
  'santé': 'sante',
  'assurance sante': 'sante',
  'assurance santé': 'sante',
  'mutuelle': 'sante',
  'mutuelle santé': 'sante',
  'mutuelle tns': 'sante',
  // Prêt
  'pret': 'pret',
  'prêt': 'pret',
  'assurance pret': 'pret',
  'assurance emprunteur': 'pret',
  'assurance pret immobilier': 'pret',
  // Animaux
  'animaux': 'animaux',
  'assurance animaux': 'animaux',
  // Vie
  'vie': 'vie',
  'assurance vie': 'vie',
  // Prévoyance
  'prevoyance': 'prevoyance',
  'prévoyance': 'prevoyance',
  'assurance prevoyance': 'prevoyance',
  'assurance prévoyance': 'prevoyance',
  // RC Pro
  'rc_pro': 'rc_pro',
  'rc pro': 'rc_pro',
  'rc professionnelle': 'rc_pro',
  'assurance rc pro': 'rc_pro',
  'assurance rcpro': 'rc_pro',
  // MRP
  'mrp': 'mrp',
  'assurance mrp': 'mrp',
  'multirisque professionnelle': 'mrp',
  // GLI
  'gli': 'gli',
  'assurance gli': 'gli',
  'garantie loyers impayés': 'gli',
  'garantie loyers impayes': 'gli',
  // PNO
  'pno': 'pno',
  'assurance pno': 'pno',
  'propriétaire non occupant': 'pno',
  'proprietaire non occupant': 'pno',
  // Gestion locative
  'gestion_locative': 'gestion_locative',
  'gestion locative': 'gestion_locative',
  'gestion immobilière': 'gestion_locative',
  'gestion immobiliere': 'gestion_locative',
  'administrateur de biens': 'gestion_locative',
  // Métiers atypiques (risques aggravés)
  'metiers_atypiques': 'metiers_atypiques',
  'metiers atypiques': 'metiers_atypiques',
  'métiers atypiques': 'metiers_atypiques',
  'assurance metiers atypiques': 'metiers_atypiques',
  'assurance métiers atypiques': 'metiers_atypiques',
  'risques aggravés': 'metiers_atypiques',
  'risques aggraves': 'metiers_atypiques',
  'accrobranche': 'metiers_atypiques',
  'cordiste': 'metiers_atypiques',
  'cordiste btp': 'metiers_atypiques',
  'evenementiel': 'metiers_atypiques',
  'événementiel': 'metiers_atypiques',
  'moniteur sport': 'metiers_atypiques',
  'moniteur de sport': 'metiers_atypiques',
  // Vélo / VAE
  'velo': 'velo',
  'vélo': 'velo',
  'assurance velo': 'velo',
  'assurance vélo': 'velo',
  'vae': 'velo',
  'assurance vae': 'velo',
  // Camping-car
  'camping_car': 'camping_car',
  'camping car': 'camping_car',
  'camping-car': 'camping_car',
  'assurance camping car': 'camping_car',
  'assurance camping-car': 'camping_car',
  // Sans permis
  'sans_permis': 'sans_permis',
  'sans permis': 'sans_permis',
  'voiture sans permis': 'sans_permis',
  'vsp': 'sans_permis',
  // Auto temporaire
  'auto_temporaire': 'auto_temporaire',
  'auto temporaire': 'auto_temporaire',
  'assurance auto temporaire': 'auto_temporaire',
  // Flotte
  'flotte': 'flotte',
  'flotte auto': 'flotte',
  'assurance flotte': 'flotte',
  'assurance flotte auto': 'flotte',
  // Cyber
  'cyber': 'cyber',
  'cyber risques': 'cyber',
  'cyber-risques': 'cyber',
  'assurance cyber': 'cyber',
  // Décennale
  'decennale': 'decennale',
  'décennale': 'decennale',
  'assurance decennale': 'decennale',
  'assurance décennale': 'decennale',
  // Protection juridique
  'protection_juridique': 'protection_juridique',
  'protection juridique': 'protection_juridique',
  'assurance protection juridique': 'protection_juridique',
  // Mutuelle entreprise
  'mutuelle_entreprise': 'mutuelle_entreprise',
  'mutuelle entreprise': 'mutuelle_entreprise',
  'mutuelle collective': 'mutuelle_entreprise',
  'ani': 'mutuelle_entreprise',
};

/**
 * Normalizes any insurance type string to its canonical slug.
 * Falls back to lowercase-trimmed input if no alias is found.
 */
export function normalizeInsuranceType(input: string): CanonicalInsuranceType | string {
  const key = input.trim().toLowerCase();
  return ALIAS_MAP[key] ?? key;
}

/**
 * Strict normalization: returns canonical slug or `null` if input cannot be mapped.
 * Use this in form validation paths to reject invalid types before DB insert.
 */
export function normalizeInsuranceTypeStrict(input: string | null | undefined): CanonicalInsuranceType | null {
  if (!input) return null;
  const key = input.trim().toLowerCase();
  return ALIAS_MAP[key] ?? null;
}

/**
 * Type guard: checks whether a value is one of the canonical insurance types.
 */
export function isCanonicalInsuranceType(value: unknown): value is CanonicalInsuranceType {
  return typeof value === 'string' && (CANONICAL_INSURANCE_TYPES as readonly string[]).includes(value);
}

/**
 * Display labels for canonical insurance types (French).
 */
export const INSURANCE_TYPE_LABELS: Record<CanonicalInsuranceType, string> = {
  auto: 'Assurance Auto',
  moto: 'Assurance Moto',
  habitation: 'Assurance Habitation',
  sante: 'Assurance Santé',
  pret: 'Assurance Emprunteur',
  animaux: 'Assurance Animaux',
  vie: 'Assurance Vie',
  prevoyance: 'Assurance Prévoyance',
  rc_pro: 'RC Professionnelle',
  mrp: 'Assurance MRP',
  gli: 'Assurance GLI',
  pno: 'Assurance PNO',
  gestion_locative: 'Gestion Locative',
  metiers_atypiques: 'Métiers Atypiques',
  velo: 'Assurance Vélo & VAE',
  camping_car: 'Assurance Camping-Car',
  sans_permis: 'Assurance Sans Permis',
  auto_temporaire: 'Assurance Auto Temporaire',
  flotte: 'Assurance Flotte Auto',
  cyber: 'Assurance Cyber',
  decennale: 'Garantie Décennale',
  protection_juridique: 'Protection Juridique',
  mutuelle_entreprise: 'Mutuelle Entreprise',
};
