// Types pour `activities` et `deal_tasks`.
// Ces deux tables existent en base mais sont absentes de
// src/integrations/supabase/types.ts (généré et périmé — ne pas s'y fier pour
// savoir ce qui existe réellement). Voir src/lib/crmApi.ts pour le point de
// contact unique avec Supabase pour ces tables.

export type CallOutcome = 'answered' | 'no_answer' | 'callback_requested';

export interface CallActivityMetadata {
  outcome: CallOutcome;
}

export interface AdviceActivityMetadata {
  kind: 'advice';
  need: string;
  recommendation: string;
}

export type ActivityMetadata =
  | CallActivityMetadata
  | AdviceActivityMetadata
  | Record<string, unknown>
  | null;

// action_type n'est pas une colonne enum côté base (texte libre) : le code existant
// (ex. la GED dans DealDrawer.tsx) y écrit déjà des valeurs comme
// "document_validated" / "document_linked" en dehors de celles composées ici.
export interface Activity {
  id: string;
  deal_id: string;
  author_id: string | null;
  action_type: string;
  description: string | null;
  metadata: ActivityMetadata;
  created_at: string;
}

// Types d'activité composables depuis ActivityComposer (note/call/email/sms/whatsapp
// → tel quel, "Conseil délivré" → meeting avec metadata.kind = 'advice'). sms/whatsapp
// sont une simple qualification manuelle (Paul journalise après avoir contacté le
// client par ce canal) — aucune action déclenchée, comme note/call/email.
export type ComposableActionType = 'note' | 'call' | 'email' | 'sms' | 'whatsapp' | 'meeting';

export interface ActivityInsert {
  deal_id: string;
  action_type: string;
  description?: string | null;
  metadata?: ActivityMetadata;
  author_id?: string | null;
}

export type TaskPriority = 'low' | 'normal' | 'high' | 'urgent';
export type TaskStatus = 'open' | 'done' | 'cancelled';
// Type de contact prévu pour un rappel planifié — pas une action déclenchée,
// juste une qualification stockée sur la tâche (cf. ScheduleTaskDialog).
export type TaskContactMethod = 'call' | 'email' | 'sms' | 'whatsapp';

export interface DealTask {
  id: string;
  deal_id: string;
  title: string;
  description: string | null;
  due_at: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  assigned_to: string | null;
  created_by: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
  // Colonne déjà présente en base (cf. src/integrations/supabase/types.ts),
  // jamais exposée côté code jusqu'ici. Les tâches créées avant ce jour ont
  // une valeur quelconque (pas forcément l'une des 4 ci-dessus) : tout code
  // de lecture doit ignorer silencieusement une valeur non reconnue plutôt
  // que planter ou l'afficher telle quelle.
  category: string;
}

export interface DealTaskInsert {
  deal_id: string;
  title: string;
  description?: string | null;
  due_at?: string | null;
  priority?: TaskPriority;
  status?: TaskStatus;
  assigned_to?: string | null;
  created_by?: string | null;
  category?: TaskContactMethod;
}

// Vue qualite_par_source (lecture seule, une ligne par source_type, mois en cours) —
// alimente le badge "% erronées" de la colonne Kanban "Coordonnées erronées"
// (cf. src/pages/crm/types.ts pour le stage invalid_contact, src/pages/crm/KanbanColumn.tsx).
export interface QualiteParSourceRow {
  source_type: string;
  total_leads: number;
  coordonnees_erronees: number;
  pct_erronees: number;
  gagnes: number;
  pct_conversion: number;
}
