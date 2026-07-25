import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import {
  StickyNote,
  Phone,
  Mail,
  MessageSquare,
  Users,
  ArrowRightLeft,
  UserCheck,
  CheckCircle2,
  Settings,
  Download,
  History,
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { fetchLeadActivities } from '@/lib/crmApi';
import { exportToCSV } from '@/utils/exportCSV';
import { AUTOMATIC_ACTIVITY_TYPES, type ActivityType, type LeadActivity, type LeadType } from '@/types/crm';

interface LeadTimelineProps {
  leadType: LeadType;
  leadId: string;
}

const ACTIVITY_ICONS: Record<ActivityType, typeof Phone> = {
  note: StickyNote,
  call: Phone,
  email: Mail,
  sms: MessageSquare,
  meeting: Users,
  status_change: ArrowRightLeft,
  assignment: UserCheck,
  task_completed: CheckCircle2,
  system: Settings,
};

const ACTIVITY_LABELS: Record<ActivityType, string> = {
  note: 'Note',
  call: 'Appel',
  email: 'Email',
  sms: 'SMS',
  meeting: 'Rendez-vous',
  status_change: 'Changement de statut',
  assignment: 'Réattribution',
  task_completed: 'Tâche terminée',
  system: 'Système',
};

const CALL_OUTCOME_LABELS: Record<string, string> = {
  answered: 'Répondu',
  no_answer: 'Pas de réponse',
  callback_requested: 'Rappel demandé',
};

const HUMAN_ICON_STYLES: Partial<Record<ActivityType, string>> = {
  note: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
  call: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400',
  email: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
  sms: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
  meeting: 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400',
  task_completed: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400',
};

const AUTO_ICON_STYLE = 'bg-muted text-muted-foreground';

const activityIconStyle = (type: ActivityType) =>
  AUTOMATIC_ACTIVITY_TYPES.has(type) ? AUTO_ICON_STYLE : HUMAN_ICON_STYLES[type] || 'bg-muted text-muted-foreground';

// Aplati une activité en une ligne CSV lisible pour l'export réglementaire (registre de preuve DDA).
const activityCsvContent = (activity: LeadActivity): string => {
  const meta = activity.metadata as Record<string, unknown> | null;
  if (activity.activity_type === 'call' && meta?.outcome) {
    const outcome = CALL_OUTCOME_LABELS[meta.outcome as string] || String(meta.outcome);
    return [activity.content, outcome].filter(Boolean).join(' — ');
  }
  if (activity.activity_type === 'meeting' && meta?.kind === 'advice') {
    return `Besoin exprimé : ${meta.need || '—'} / Recommandation : ${meta.recommendation || '—'}`;
  }
  return activity.content || '';
};

export const LeadTimeline = ({ leadType, leadId }: LeadTimelineProps) => {
  const { data: activities, isLoading } = useQuery({
    queryKey: ['lead-activities', leadType, leadId],
    queryFn: () => fetchLeadActivities(leadType, leadId),
  });

  const handleExport = () => {
    if (!activities || activities.length === 0) return;
    const rows = activities.map((a) => ({
      Date: format(new Date(a.created_at), 'dd/MM/yyyy HH:mm', { locale: fr }),
      Type: ACTIVITY_LABELS[a.activity_type] || a.activity_type,
      Auteur: a.author_name || '—',
      Contenu: activityCsvContent(a),
    }));
    exportToCSV(rows, `historique-lead-${leadId}`);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold flex items-center gap-2">
          <History className="h-4 w-4 text-muted-foreground" />
          Historique
        </h4>
        <Button variant="outline" size="sm" onClick={handleExport} disabled={!activities || activities.length === 0}>
          <Download className="h-3.5 w-3.5 mr-2" />
          Exporter l'historique du lead
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex gap-3">
              <Skeleton className="h-8 w-8 rounded-full shrink-0" />
              <div className="flex-1 space-y-2 pt-1">
                <Skeleton className="h-3 w-1/3" />
                <Skeleton className="h-3 w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : !activities || activities.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground border rounded-lg bg-muted/30">
          <History className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Aucune activité enregistrée pour ce lead.</p>
        </div>
      ) : (
        <div className="relative pl-4">
          <div className="absolute left-[19px] top-2 bottom-2 w-px bg-border" aria-hidden />
          <div className="space-y-4">
            {activities.map((activity) => {
              const Icon = ACTIVITY_ICONS[activity.activity_type] || Settings;
              const isAutomatic = AUTOMATIC_ACTIVITY_TYPES.has(activity.activity_type);
              const meta = activity.metadata as Record<string, unknown> | null;

              return (
                <div key={activity.id} className="relative flex gap-3">
                  <div
                    className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${activityIconStyle(activity.activity_type)}`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0 pt-0.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-sm font-medium ${isAutomatic ? 'text-muted-foreground' : ''}`}>
                        {ACTIVITY_LABELS[activity.activity_type] || activity.activity_type}
                      </span>
                      {isAutomatic && (
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 text-muted-foreground">
                          Automatique
                        </Badge>
                      )}
                      {activity.activity_type === 'call' && Boolean(meta?.outcome) && (
                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
                          {CALL_OUTCOME_LABELS[meta!.outcome as string] || String(meta!.outcome)}
                        </Badge>
                      )}
                    </div>

                    {activity.activity_type === 'meeting' && meta?.kind === 'advice' ? (
                      <div className="mt-1 space-y-1 text-sm">
                        <p>
                          <span className="text-muted-foreground">Besoin exprimé par le client : </span>
                          {(meta.need as string) || '—'}
                        </p>
                        <p>
                          <span className="text-muted-foreground">Recommandation formulée : </span>
                          {(meta.recommendation as string) || '—'}
                        </p>
                      </div>
                    ) : activity.content ? (
                      <p className="mt-1 text-sm whitespace-pre-wrap break-words">{activity.content}</p>
                    ) : null}

                    <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                      {activity.author_name && <span>{activity.author_name}</span>}
                      {activity.author_name && <span>·</span>}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="cursor-default">
                            {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true, locale: fr })}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          {format(new Date(activity.created_at), "dd/MM/yyyy 'à' HH:mm", { locale: fr })}
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
