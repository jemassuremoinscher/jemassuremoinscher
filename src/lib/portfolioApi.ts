import { supabase } from '@/integrations/supabase/client';
import type {
  Contract,
  ContractInsert,
  AdviceRecord,
  AdviceRecordInsert,
  Client360Row,
  OpportuniteMultiEquipementRow,
  DealDormantRow,
  TableauBordPortefeuilleRow,
  AlerteConformiteDdaRow,
} from '@/types/portfolio';

// `contracts` et `advice_records` existent déjà en base mais ne figurent pas
// dans src/integrations/supabase/types.ts (généré, périmé — même constat que
// activities/deal_tasks, cf. crmApi.ts). `portfolioFrom` est le seul endroit
// du projet où l'on sort du typage généré pour ces deux tables : chaque
// fonction exportée ci-dessous retype explicitement ce qu'elle renvoie.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const portfolioFrom = (table: 'contracts' | 'advice_records'): any => supabase.from(table as any);

// Idem pour les 5 vues en lecture seule (client_360, opportunites_multi_equipement,
// deals_dormants, tableau_bord_portefeuille, alertes_conformite_dda) : absentes du schéma généré.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const portfolioViewFrom = (view: string): any => supabase.from(view as any);

// ---------------------------------------------------------------------------
// Contrats
// ---------------------------------------------------------------------------

interface FetchContractsParams {
  status?: Contract['status'];
}

export async function fetchContracts({ status }: FetchContractsParams = {}): Promise<Contract[]> {
  let query = portfolioFrom('contracts')
    .select('*, contacts(full_name, email, phone)')
    .order('renewal_date', { ascending: true, nullsFirst: false });
  if (status) query = query.eq('status', status);

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as Contract[];
}

export async function createContract(payload: ContractInsert): Promise<Contract> {
  const { data, error } = await portfolioFrom('contracts').insert(payload).select('*').single();
  if (error) throw error;
  return data as Contract;
}

// ---------------------------------------------------------------------------
// Conseil DDA — advice_records est IMMUABLE côté base (un UPDATE lève une
// exception SQL) : uniquement création et lecture ici, jamais de fonction
// d'édition, volontairement.
// ---------------------------------------------------------------------------

export async function fetchAdviceRecordsForDeal(dealId: string): Promise<AdviceRecord[]> {
  const { data, error } = await portfolioFrom('advice_records')
    .select('*')
    .eq('deal_id', dealId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data ?? []) as AdviceRecord[];
}

export async function createAdviceRecord(payload: AdviceRecordInsert): Promise<AdviceRecord> {
  const { data, error } = await portfolioFrom('advice_records').insert(payload).select('*').single();
  if (error) throw error;
  return data as AdviceRecord;
}

// ---------------------------------------------------------------------------
// Vues (lecture seule)
// ---------------------------------------------------------------------------

export async function fetchTableauBordPortefeuille(): Promise<TableauBordPortefeuilleRow | null> {
  const { data, error } = await portfolioViewFrom('tableau_bord_portefeuille').select('*').maybeSingle();
  if (error) throw error;
  return (data ?? null) as TableauBordPortefeuilleRow | null;
}

export async function fetchOpportunitesMultiEquipement(): Promise<OpportuniteMultiEquipementRow[]> {
  const { data, error } = await portfolioViewFrom('opportunites_multi_equipement')
    .select('*')
    .order('prime_totale', { ascending: false });

  if (error) throw error;
  return (data ?? []) as OpportuniteMultiEquipementRow[];
}

export async function fetchDealsDormants(): Promise<DealDormantRow[]> {
  const { data, error } = await portfolioViewFrom('deals_dormants')
    .select('*')
    .order('jours_sans_activite', { ascending: false });

  if (error) throw error;
  return (data ?? []) as DealDormantRow[];
}

export async function fetchAlertesConformiteDda(): Promise<AlerteConformiteDdaRow[]> {
  const { data, error } = await portfolioViewFrom('alertes_conformite_dda')
    .select('*')
    .order('jours_sans_conseil', { ascending: false });

  if (error) throw error;
  return (data ?? []) as AlerteConformiteDdaRow[];
}

// Pour le badge "aucun document de conseil" dans l'onglet DDA d'un deal —
// a_document_conseil est précalculé par la vue, pas besoin de recompter
// les advice_records du contact ici.
export async function fetchClient360ForContact(contactId: string): Promise<Client360Row | null> {
  const { data, error } = await portfolioViewFrom('client_360')
    .select('*')
    .eq('contact_id', contactId)
    .maybeSingle();

  if (error) throw error;
  return (data ?? null) as Client360Row | null;
}
