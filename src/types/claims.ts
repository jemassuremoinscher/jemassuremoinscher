// Types pour `claims` et la vue sinistralite_contrats. Cette table/vue existe
// en base mais ne figure pas dans src/integrations/supabase/types.ts (généré,
// périmé — même constat que activities/deal_tasks, cf. src/lib/crmApi.ts).
// Voir src/lib/claimsApi.ts pour le point de contact unique avec Supabase.

export type ClaimResponsibility = 'full' | 'partial' | 'none' | 'pending';

export type ClaimStatus = 'declared' | 'under_review' | 'accepted' | 'refused' | 'paid' | 'closed';

export const CLAIM_RESPONSIBILITY_LABELS: Record<ClaimResponsibility, string> = {
  full: 'Totale',
  partial: 'Partielle',
  none: 'Aucune',
  pending: 'En cours de détermination',
};

export const CLAIM_STATUS_LABELS: Record<ClaimStatus, string> = {
  declared: 'Déclaré',
  under_review: 'En cours d\'instruction',
  accepted: 'Accepté',
  refused: 'Refusé',
  paid: 'Indemnisé',
  closed: 'Clôturé',
};

// reported_by est un USER_ID (auth.uid()), même référentiel que
// contracts.assigned_to / deals.assigned_to (cf. src/types/portfolio.ts).
export interface ClaimRow {
  id: string;
  contract_id: string;
  claim_date: string;
  claim_type: string;
  description: string | null;
  amount_claimed: number | null;
  amount_paid: number | null;
  responsibility: ClaimResponsibility;
  status: ClaimStatus;
  impact_bonus_malus: boolean;
  reported_by: string | null;
  created_at: string;
}

export interface ClaimInsert {
  contract_id: string;
  claim_date: string;
  claim_type: string;
  description?: string | null;
  amount_claimed?: number | null;
  amount_paid?: number | null;
  responsibility?: ClaimResponsibility;
  status?: ClaimStatus;
  impact_bonus_malus?: boolean;
  reported_by?: string | null;
}

// Vue sinistralite_contrats (lecture seule) — colonnes fournies par la
// spécification, une ligne par contrat concerné.
export interface SinistraliteContratsRow {
  contract_id: string;
  insurance_type: string;
  policy_number: string | null;
  full_name: string | null;
  nb_sinistres: number;
  total_verse: number;
  premium_annual: number | null;
  ratio_sinistres_prime: number;
  dernier_sinistre: string | null;
}

// Au-delà de ce seuil, le ratio sinistres/prime déclenche une alerte visuelle.
export const RATIO_SINISTRES_PRIME_ALERT_THRESHOLD = 0.7;
