import { supabase } from '@/integrations/supabase/client';
import type { CommissionPaymentRow, MarkCommissionReceivedPayload } from '@/types/commissions';

// `commission_payments` existe en base mais ne figure pas dans
// src/integrations/supabase/types.ts (généré, périmé — même constat que
// activities/deal_tasks, cf. src/lib/crmApi.ts).
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const commissionPaymentsFrom = (): any => supabase.from('commission_payments' as any);

export async function fetchCommissionPaymentsForContract(contractId: string): Promise<CommissionPaymentRow[]> {
  const { data, error } = await commissionPaymentsFrom()
    .select('*')
    .eq('contract_id', contractId)
    .order('period_start', { ascending: false });

  if (error) throw error;
  return (data ?? []) as CommissionPaymentRow[];
}

export async function markCommissionReceived(
  id: string,
  payload: MarkCommissionReceivedPayload
): Promise<CommissionPaymentRow> {
  const { data, error } = await commissionPaymentsFrom()
    .update({
      amount_received: payload.amount_received,
      received_at: payload.received_at,
      status: 'received',
    })
    .eq('id', id)
    .select('*')
    .single();

  if (error) throw error;
  return data as CommissionPaymentRow;
}
