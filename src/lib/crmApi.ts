import { supabase } from '@/integrations/supabase/client';
import type {
  LeadActivity,
  LeadActivityInsert,
  LeadTask,
  LeadTaskInsert,
  LeadRef,
  LeadType,
} from '@/types/crm';

// lead_activities et lead_tasks existent déjà en base (voir migrations Supabase)
// mais ne figurent pas dans src/integrations/supabase/types.ts, qui est régénéré
// automatiquement depuis le schéma et ne doit pas être édité à la main.
// `crmFrom` est le seul endroit du projet où l'on sort du typage généré : chaque
// fonction exportée ci-dessous retype explicitement ce qu'elle renvoie, donc ce
// `any` reste confiné à cette ligne et ne se propage jamais vers les composants.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const crmFrom = (table: 'lead_activities' | 'lead_tasks'): any => supabase.from(table as any);

export const leadKey = (leadType: LeadType, leadId: string) => `${leadType}:${leadId}`;

// ---------------------------------------------------------------------------
// Activités (registre de preuve DDA — lecture seule une fois créées)
// ---------------------------------------------------------------------------

export async function fetchLeadActivities(leadType: LeadType, leadId: string): Promise<LeadActivity[]> {
  const { data, error } = await crmFrom('lead_activities')
    .select('*')
    .eq('lead_type', leadType)
    .eq('lead_id', leadId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data ?? []) as LeadActivity[];
}

export async function createLeadActivity(payload: LeadActivityInsert): Promise<LeadActivity> {
  const { data, error } = await crmFrom('lead_activities')
    .insert(payload)
    .select('*')
    .single();

  if (error) throw error;
  return data as LeadActivity;
}

// ---------------------------------------------------------------------------
// Identité de l'agent courant (pour created_by / author_name)
// ---------------------------------------------------------------------------

export interface CurrentAgent {
  id: string;
  fullName: string;
  userId: string;
}

// `profiles` existe en base (id, email, full_name, is_active, created_at, updated_at)
// mais, comme lead_activities/lead_tasks, n'est pas dans le schéma auto-généré :
// même point de confinement que crmFrom, aucun `any` ne sort de cette fonction.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const profilesFrom = (): any => supabase.from('profiles' as any);

// Ordre de résolution du nom affiché comme auteur : fiche commerciale d'abord
// (nom métier), puis profil utilisateur, puis email en dernier recours.
export async function resolveCurrentAgent(): Promise<CurrentAgent | null> {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) return null;

  const { data: agent, error: agentError } = await supabase
    .from('sales_agents')
    .select('id, full_name, user_id')
    .eq('user_id', userData.user.id)
    .maybeSingle();

  if (agentError) throw agentError;

  let fullName = agent?.full_name || null;

  if (!fullName) {
    const { data: profile, error: profileError } = await profilesFrom()
      .select('full_name, email')
      .eq('id', userData.user.id)
      .maybeSingle();

    if (profileError) throw profileError;

    fullName = (profile?.full_name as string | undefined) || (profile?.email as string | undefined) || null;
  }

  return {
    id: agent?.id ?? userData.user.id,
    fullName: fullName || userData.user.email || 'Utilisateur',
    userId: userData.user.id,
  };
}

// ---------------------------------------------------------------------------
// Tâches
// ---------------------------------------------------------------------------

interface FetchOpenTasksParams {
  scope: 'mine' | 'team';
  agentId?: string;
}

export async function fetchOpenLeadTasks({ scope, agentId }: FetchOpenTasksParams): Promise<LeadTask[]> {
  let query = crmFrom('lead_tasks').select('*').eq('status', 'open').order('due_at', { ascending: true });

  if (scope === 'mine') {
    if (!agentId) return [];
    query = query.eq('assigned_to', agentId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as LeadTask[];
}

export async function createLeadTask(payload: LeadTaskInsert): Promise<LeadTask> {
  const { data, error } = await crmFrom('lead_tasks')
    .insert(payload)
    .select('*')
    .single();

  if (error) throw error;
  return data as LeadTask;
}

// Marque la tâche comme terminée et journalise l'action sur la timeline du lead.
export async function completeLeadTask(task: LeadTask, agent: CurrentAgent | null): Promise<void> {
  const completedAt = new Date().toISOString();

  const { error: updateError } = await crmFrom('lead_tasks')
    .update({ status: 'done', completed_at: completedAt })
    .eq('id', task.id);

  if (updateError) throw updateError;

  await createLeadActivity({
    lead_type: task.lead_type,
    lead_id: task.lead_id,
    activity_type: 'task_completed',
    content: task.title,
    created_by: agent?.userId ?? null,
    author_name: agent?.fullName ?? null,
  });
}

// Une seule requête agrégée pour signaler les leads ayant une tâche ouverte en retard,
// à réutiliser pour tous les leads affichés (jamais une requête par carte).
export async function fetchOverdueLeadKeys(): Promise<Set<string>> {
  const { data, error } = await crmFrom('lead_tasks')
    .select('lead_type, lead_id')
    .eq('status', 'open')
    .lt('due_at', new Date().toISOString());

  if (error) throw error;

  const keys = new Set<string>();
  (data ?? []).forEach((row: { lead_type: LeadType; lead_id: string }) => {
    keys.add(leadKey(row.lead_type, row.lead_id));
  });
  return keys;
}

// ---------------------------------------------------------------------------
// Résolution des noms de leads pour l'affichage des tâches (batch, pas de N+1)
// ---------------------------------------------------------------------------

export async function fetchLeadNames(refs: LeadRef[]): Promise<Map<string, string>> {
  const quoteIds = refs.filter((r) => r.leadType === 'quote').map((r) => r.leadId);
  const callbackIds = refs.filter((r) => r.leadType === 'callback').map((r) => r.leadId);

  const [quotesResult, callbacksResult] = await Promise.all([
    quoteIds.length
      ? supabase.from('insurance_quotes').select('id, full_name').in('id', quoteIds)
      : Promise.resolve({ data: [], error: null }),
    callbackIds.length
      ? supabase.from('contact_callbacks').select('id, full_name').in('id', callbackIds)
      : Promise.resolve({ data: [], error: null }),
  ]);

  if (quotesResult.error) throw quotesResult.error;
  if (callbacksResult.error) throw callbacksResult.error;

  const names = new Map<string, string>();
  (quotesResult.data ?? []).forEach((row: { id: string; full_name: string }) => {
    names.set(leadKey('quote', row.id), row.full_name);
  });
  (callbacksResult.data ?? []).forEach((row: { id: string; full_name: string }) => {
    names.set(leadKey('callback', row.id), row.full_name);
  });
  return names;
}
