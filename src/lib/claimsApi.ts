import { supabase } from '@/integrations/supabase/client';
import type { ClaimRow, ClaimInsert, SinistraliteContratsRow } from '@/types/claims';

// `claims` existe en base mais ne figure pas dans src/integrations/supabase/types.ts
// (généré, périmé — même constat que activities/deal_tasks, cf. src/lib/crmApi.ts).
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const claimsFrom = (): any => supabase.from('claims' as any);

// Vue sinistralite_contrats (lecture seule), absente du schéma généré.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const sinistraliteFrom = (): any => supabase.from('sinistralite_contrats' as any);

export async function fetchClaimsForContract(contractId: string): Promise<ClaimRow[]> {
  const { data, error } = await claimsFrom()
    .select('*')
    .eq('contract_id', contractId)
    .order('claim_date', { ascending: false });

  if (error) throw error;
  return (data ?? []) as ClaimRow[];
}

export async function createClaim(payload: ClaimInsert): Promise<ClaimRow> {
  const { data, error } = await claimsFrom().insert(payload).select('*').single();
  if (error) throw error;
  return data as ClaimRow;
}

export async function fetchSinistraliteForContract(contractId: string): Promise<SinistraliteContratsRow | null> {
  const { data, error } = await sinistraliteFrom().select('*').eq('contract_id', contractId).maybeSingle();
  if (error) throw error;
  return (data ?? null) as SinistraliteContratsRow | null;
}
