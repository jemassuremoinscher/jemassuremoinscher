// Types pour lead_activities et lead_tasks.
// Ces deux tables existent déjà en base mais ne sont pas encore présentes dans
// src/integrations/supabase/types.ts (auto-généré). Voir src/lib/crmApi.ts pour
// le point de contact unique avec Supabase.

export type LeadType = 'quote' | 'callback';

export type ActivityType =
  | 'note'
  | 'call'
  | 'email'
  | 'sms'
  | 'meeting'
  | 'status_change'
  | 'assignment'
  | 'task_completed'
  | 'system';

// Activités posées automatiquement par un trigger base de données — jamais par le front.
export const AUTOMATIC_ACTIVITY_TYPES: ReadonlySet<ActivityType> = new Set([
  'status_change',
  'assignment',
]);

export type CallOutcome = 'answered' | 'no_answer' | 'callback_requested';

export interface CallActivityMetadata {
  outcome: CallOutcome;
}

export interface AdviceActivityMetadata {
  kind: 'advice';
  need: string;
  recommendation: string;
}

export type LeadActivityMetadata =
  | CallActivityMetadata
  | AdviceActivityMetadata
  | Record<string, unknown>
  | null;

export interface LeadActivity {
  id: string;
  lead_type: LeadType;
  lead_id: string;
  activity_type: ActivityType;
  content: string | null;
  metadata: LeadActivityMetadata;
  created_by: string | null;
  author_name: string | null;
  created_at: string;
}

export interface LeadActivityInsert {
  lead_type: LeadType;
  lead_id: string;
  activity_type: ActivityType;
  content?: string | null;
  metadata?: LeadActivityMetadata;
  created_by?: string | null;
  author_name?: string | null;
}

export type TaskPriority = 'low' | 'normal' | 'high' | 'urgent';
export type TaskStatus = 'open' | 'done' | 'cancelled';

export interface LeadTask {
  id: string;
  lead_type: LeadType;
  lead_id: string;
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
}

export interface LeadTaskInsert {
  lead_type: LeadType;
  lead_id: string;
  title: string;
  description?: string | null;
  due_at?: string | null;
  priority?: TaskPriority;
  status?: TaskStatus;
  assigned_to?: string | null;
  created_by?: string | null;
}

// Identité minimale nécessaire pour relier une tâche/activité à sa fiche lead.
export interface LeadRef {
  leadType: LeadType;
  leadId: string;
}
