// Types pour `commission_payments`. Cette table existe en base mais ne
// figure pas dans src/integrations/supabase/types.ts (généré, périmé — même
// constat que activities/deal_tasks, cf. src/lib/crmApi.ts). Voir
// src/lib/commissionsApi.ts pour le point de contact unique avec Supabase.

export type CommissionPaymentStatus = 'pending' | 'received' | 'disputed' | 'written_off';

export const COMMISSION_PAYMENT_STATUS_LABELS: Record<CommissionPaymentStatus, string> = {
  pending: 'En attente',
  received: 'Reçue',
  disputed: 'Contestée',
  written_off: 'Passée en perte',
};

export interface CommissionPaymentRow {
  id: string;
  contract_id: string;
  period_start: string;
  period_end: string;
  amount_expected: number;
  amount_received: number | null;
  received_at: string | null;
  status: CommissionPaymentStatus;
  created_at: string;
}

export interface MarkCommissionReceivedPayload {
  amount_received: number;
  received_at: string;
}
