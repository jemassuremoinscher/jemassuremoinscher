import { supabase } from '@/integrations/supabase/client';
import type {
  Activity,
  ActivityInsert,
  DealTask,
  DealTaskInsert,
} from '@/types/crm';

// `activities` et `deal_tasks` existent déjà en base mais ne figurent pas dans
// src/integrations/supabase/types.ts, qui est régénéré automatiquement depuis le
// schéma et ne doit pas être édité à la main (et n'est pas fiable pour savoir ce
// qui existe réellement — cf. `profiles`, aussi absente et pourtant bien réelle).
// `crmFrom` est le seul endroit du projet où l'on sort du typage généré pour ces
// deux tables : chaque fonction exportée ci-dessous retype explicitement ce
// qu'elle renvoie, donc ce `any` reste confiné à cette ligne.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const crmFrom = (table: 'activities' | 'deal_tasks'): any => supabase.from(table as any);

// Même confinement pour `profiles` (id, email, full_name, is_active, created_at,
// updated_at) : réelle en base, absente du schéma généré.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const profilesFrom = (): any => supabase.from('profiles' as any);

// ---------------------------------------------------------------------------
// Activités (registre de preuve DDA — lecture seule une fois créées)
// ---------------------------------------------------------------------------

export async function fetchDealActivities(dealId: string): Promise<Activity[]> {
  const { data, error } = await crmFrom('activities')
    .select('*')
    .eq('deal_id', dealId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data ?? []) as Activity[];
}

export async function createActivity(payload: ActivityInsert): Promise<Activity> {
  const { data, error } = await crmFrom('activities')
    .insert(payload)
    .select('*')
    .single();

  if (error) throw error;
  return data as Activity;
}

// Résout un lot d'author_id — DES USER_ID (auth.uid()), pas des sales_agents.id —
// en noms affichables : d'abord sales_agents.full_name (via sales_agents.user_id),
// puis profiles.full_name/email pour ce qui reste non résolu.
// ⚠️ Ne pas utiliser pour résoudre deal_tasks.assigned_to : voir resolveAssigneeNames
// ci-dessous, qui joint sur un référentiel d'identité différent (sales_agents.id).
export async function resolveAuthorNames(authorIds: string[]): Promise<Map<string, string>> {
  const uniqueIds = Array.from(new Set(authorIds));
  const names = new Map<string, string>();
  if (uniqueIds.length === 0) return names;

  const { data: agentRows, error: agentError } = await supabase
    .from('sales_agents')
    .select('user_id, full_name')
    .in('user_id', uniqueIds);

  if (agentError) throw agentError;
  (agentRows ?? []).forEach((row) => {
    if (row.user_id) names.set(row.user_id, row.full_name);
  });

  const stillUnresolved = uniqueIds.filter((id) => !names.has(id));
  if (stillUnresolved.length > 0) {
    const { data: profileRows, error: profileError } = await profilesFrom()
      .select('id, full_name, email')
      .in('id', stillUnresolved);

    if (profileError) throw profileError;
    (profileRows ?? []).forEach((row: { id: string; full_name: string | null; email: string | null }) => {
      names.set(row.id, row.full_name || row.email || 'Utilisateur');
    });
  }

  return names;
}

// ---------------------------------------------------------------------------
// Identité de l'agent courant (pour author_id / created_by / filtrage "mes tâches")
// ---------------------------------------------------------------------------

export interface CurrentAgentRef {
  userId: string;
  agentId: string | null; // sales_agents.id, si une fiche existe pour cet utilisateur
}

export async function resolveCurrentAgentRef(): Promise<CurrentAgentRef | null> {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) return null;

  const { data: agent, error: agentError } = await supabase
    .from('sales_agents')
    .select('id')
    .eq('user_id', userData.user.id)
    .maybeSingle();

  if (agentError) throw agentError;

  return { userId: userData.user.id, agentId: agent?.id ?? null };
}

// ---------------------------------------------------------------------------
// Tâches
// ---------------------------------------------------------------------------

interface FetchOpenTasksParams {
  scope: 'mine' | 'team';
  agentId?: string | null;
}

// ---------------------------------------------------------------------------
// ⚠️ Deux référentiels d'identité distincts coexistent dans ce schéma — ne pas
// les confondre lors d'une résolution de nom, ni réutiliser l'une des deux
// fonctions ci-dessous pour l'autre colonne :
//   - deal_tasks.assigned_to → un sales_agents.ID (PK) → resolveAssigneeNames()
//     (jointure DIRECTE sur sales_agents.id, PAS via user_id)
//   - deal_tasks.created_by, activities.author_id, deals.assigned_to → un
//     USER_ID (auth.uid()) → resolveAuthorNames() ci-dessus (jointure sur
//     sales_agents.user_id, puis fallback profiles)
// Le "destinataire" d'une tâche (à qui elle est assignée) se résout donc
// TOUJOURS avec resolveAssigneeNames(), jamais avec resolveAuthorNames().
// ---------------------------------------------------------------------------
export async function resolveAssigneeNames(assigneeIds: string[]): Promise<Map<string, string>> {
  const uniqueIds = Array.from(new Set(assigneeIds));
  const names = new Map<string, string>();
  if (uniqueIds.length === 0) return names;

  const { data, error } = await supabase.from('sales_agents').select('id, full_name').in('id', uniqueIds);

  if (error) throw error;
  (data ?? []).forEach((row) => names.set(row.id, row.full_name));

  return names;
}

export async function fetchOpenDealTasks({ scope, agentId }: FetchOpenTasksParams): Promise<DealTask[]> {
  let query = crmFrom('deal_tasks').select('*').eq('status', 'open').order('due_at', { ascending: true });

  if (scope === 'mine') {
    // `agentId` doit être un sales_agents.id (cf. CurrentAgentRef, résolu via
    // user_id = auth.uid()) : assigned_to n'est jamais comparé à auth.uid() directement.
    if (!agentId) return [];
    query = query.eq('assigned_to', agentId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as DealTask[];
}

export async function createDealTask(payload: DealTaskInsert): Promise<DealTask> {
  const { data, error } = await crmFrom('deal_tasks')
    .insert(payload)
    .select('*')
    .single();

  if (error) throw error;
  return data as DealTask;
}

// Marque la tâche comme terminée et journalise l'action sur la timeline du deal.
export async function completeDealTask(task: DealTask, authorId: string | null): Promise<void> {
  const completedAt = new Date().toISOString();

  const { error: updateError } = await crmFrom('deal_tasks')
    .update({ status: 'done', completed_at: completedAt })
    .eq('id', task.id);

  if (updateError) throw updateError;

  await createActivity({
    deal_id: task.deal_id,
    action_type: 'task_completed',
    description: task.title,
    author_id: authorId,
  });
}

// Une seule requête agrégée pour signaler les deals ayant une tâche ouverte en
// retard, à réutiliser pour toutes les cartes du Kanban (jamais une requête par carte).
export async function fetchOverdueDealIds(): Promise<Set<string>> {
  const { data, error } = await crmFrom('deal_tasks')
    .select('deal_id')
    .eq('status', 'open')
    .lt('due_at', new Date().toISOString());

  if (error) throw error;

  return new Set((data ?? []).map((row: { deal_id: string }) => row.deal_id));
}

// ---------------------------------------------------------------------------
// Libellés des deals pour l'affichage des tâches (batch, pas de N+1)
// ---------------------------------------------------------------------------

interface DealLabelRow {
  id: string;
  contacts: { full_name: string | null; email: string | null } | { full_name: string | null; email: string | null }[] | null;
}

export async function fetchDealLabels(dealIds: string[]): Promise<Map<string, string>> {
  const uniqueIds = Array.from(new Set(dealIds));
  const labels = new Map<string, string>();
  if (uniqueIds.length === 0) return labels;

  const { data, error } = await supabase
    .from('deals')
    .select('id, contacts(full_name, email)')
    .in('id', uniqueIds);

  if (error) throw error;

  // Le join `contacts(...)` est typé par Supabase-js comme un tableau potentiel
  // même en 1:1 ; on normalise ici (même pattern que CrmKanban.tsx / DealDrawer.tsx).
  (data as unknown as DealLabelRow[] | null ?? []).forEach((row) => {
    const contact = Array.isArray(row.contacts) ? row.contacts[0] : row.contacts;
    labels.set(row.id, contact?.full_name || contact?.email || 'Deal');
  });

  return labels;
}

// ---------------------------------------------------------------------------
// Suppression manuelle d'un deal — passe par la fonction Postgres
// supprimer_deal_manuel (pas de DELETE direct) : elle seule sait refuser les
// leads venant du site (source_type = 'site'), soft-delete côté base, et
// journaliser le motif. Absente de types.ts (généré), d'où le cast `as any`.
// ---------------------------------------------------------------------------

export interface SupprimerDealResult {
  ok: boolean;
  motif?: string | null;
  message?: string | null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function supprimerDealManuel(dealId: string): Promise<SupprimerDealResult> {
  const { data, error } = await (supabase.rpc as any)('supprimer_deal_manuel', { p_deal_id: dealId });
  if (error) throw error;
  return data as SupprimerDealResult;
}
