// Types pour `contracts`, `advice_records` et les vues du portefeuille
// (client_360, opportunites_multi_equipement, deals_dormants,
// tableau_bord_portefeuille). Ces tables/vues existent en base mais ne
// figurent pas dans src/integrations/supabase/types.ts (généré, périmé —
// voir src/lib/crmApi.ts pour le même constat sur activities/deal_tasks).
// Voir src/lib/portfolioApi.ts pour le point de contact unique avec Supabase.

export type ContractStatus =
  | 'active'
  | 'pending'
  | 'lapsed'
  | 'cancelled_client'
  | 'cancelled_insurer'
  | 'transferred';

// contracts.assigned_to est un USER_ID (auth.uid()), jamais un sales_agents.id
// — même référentiel que deals.assigned_to / activities.author_id, distinct
// de deal_tasks.assigned_to (cf. crmApi.ts).
export interface Contract {
  id: string;
  contact_id: string;
  deal_id: string | null;
  insurance_type: string;
  insurer_name: string;
  policy_number: string | null;
  premium_annual: number | null;
  commission_year_one: number | null;
  commission_recurring: number | null;
  effective_date: string | null;
  renewal_date: string | null;
  status: ContractStatus;
  cancellation_reason: string | null;
  cancelled_at: string | null;
  assigned_to: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  // Présent uniquement quand la requête embarque la jointure (cf. fetchContracts).
  contacts?: { full_name: string | null; email: string | null; phone: string | null } | null;
}

export interface ContractInsert {
  contact_id: string;
  deal_id?: string | null;
  insurance_type: string;
  insurer_name: string;
  policy_number?: string | null;
  premium_annual?: number | null;
  commission_year_one?: number | null;
  commission_recurring?: number | null;
  effective_date?: string | null;
  renewal_date?: string | null;
  status?: ContractStatus;
  cancellation_reason?: string | null;
  cancelled_at?: string | null;
  assigned_to?: string | null;
  notes?: string | null;
}

// Une ligne de solutions_studied (jsonb) : un assureur/formule comparé lors
// du conseil, avec la prime proposée et si c'est celui retenu.
export interface SolutionStudied {
  insurer: string;
  formula: string;
  premium: number | null;
  selected: boolean;
}

// advice_records est IMMUABLE côté base (un UPDATE lève une exception SQL) :
// ne jamais écrire de fonction de mise à jour ici, uniquement création et
// lecture. advisor_id est un USER_ID (auth.uid()), pas un sales_agents.id.
export interface AdviceRecord {
  id: string;
  contact_id: string;
  deal_id: string | null;
  contract_id: string | null;
  client_needs: string;
  client_situation: string;
  solutions_studied: SolutionStudied[];
  recommendation: string;
  recommendation_reason: string;
  client_decision: string | null;
  advisor_id: string | null;
  advisor_name: string | null;
  delivered_at: string | null;
  document_url: string | null;
  created_at: string;
}

export interface AdviceRecordInsert {
  contact_id: string;
  deal_id?: string | null;
  contract_id?: string | null;
  client_needs: string;
  client_situation: string;
  solutions_studied: SolutionStudied[];
  recommendation: string;
  recommendation_reason: string;
  client_decision?: string | null;
  advisor_id?: string | null;
  advisor_name?: string | null;
  delivered_at?: string | null;
  document_url?: string | null;
}

// Vue client_360 (lecture seule) — colonnes vérifiées directement sur la base.
export interface Client360Row {
  contact_id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  nb_contrats_actifs: number;
  produits_detenus: string[] | null;
  prime_totale: number;
  commission_recurrente: number;
  prochaine_echeance: string | null;
  nb_deals: number;
  dernier_contrat_le: string | null;
  mono_produit: boolean;
  a_document_conseil: boolean;
}

// Vue opportunites_multi_equipement (lecture seule) — colonnes vérifiées
// directement sur la base (vue vide au moment de l'écriture, aucun contrat
// n'existe encore : vérifié par sondage des colonnes, pas par échantillon).
export interface OpportuniteMultiEquipementRow {
  contact_id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  produit_suggere: string;
  produits_detenus: string[] | null;
  nb_contrats_actifs: number;
  prime_totale: number;
}

// Vue deals_dormants (lecture seule) — colonnes vérifiées directement sur la
// base (vue vide au moment de l'écriture : vérifié par sondage des colonnes).
export interface DealDormantRow {
  deal_id: string;
  insurance_type: string;
  stage: string;
  lead_score: number | null;
  jours_sans_activite: number;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  commercial: string | null;
  derniere_activite: string | null;
}

// Vue tableau_bord_portefeuille (lecture seule, ligne unique).
export interface TableauBordPortefeuilleRow {
  contrats_actifs: number;
  primes_sous_gestion: number;
  commissions_recurrentes: number;
  echeances_60j: number;
  resiliations_12m: number;
  clients_mono_produit: number;
  clients_sans_conseil_dda: number;
  deals_dormants: number;
}
