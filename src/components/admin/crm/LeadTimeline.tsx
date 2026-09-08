import { useMemo } from 'react';
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
  MessageCircle,
  Users,
  GraduationCap,
  CheckCircle2,
  FileCheck2,
  Paperclip,
  Settings,
  Download,
  History,
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { fetchDealActivities, resolveAuthorNames } from '@/lib/crmApi';
import { exportToCSV } from '@/utils/exportCSV';
import type { Activity } from '@/types/crm';

interface LeadTimelineProps {
  dealId: string;
}

const CALL_OUTCOME_LABELS: Record<string, string> = {
  answered: 'Répondu',
  no_answer: 'Pas de réponse',
  callback_requested: 'Rappel demandé',
};

const ACTIVITY_ICONS: Record<string, typeof Phone> = {
  note: StickyNote,
  call: Phone,
  email: Mail,
  sms: MessageSquare,
  whatsapp: MessageCircle,
  meeting: Users,
  advice: GraduationCap,
  task_completed: CheckCircle2,
  document_validated: FileCheck2,
  document_linked: Paperclip,
};

const ACTIVITY_LABELS: Record<string, string> = {
  note: 'Note',
  call: 'Appel',
  email: 'Email',
  sms: 'SMS',
  whatsapp: 'WhatsApp',
  meeting: 'Rendez-vous',
  task_completed: 'Tâche terminée',
  document_validated: 'Document validé',
  document_linked: 'Document lié',
  system: 'Système',
};

const humanizeActionType = (type: string): string =>
  type.replace(/_/g, ' ').replace(/^./, (s) => s.toUpperCase());

const isAdvice = (activity: Activity) =>
  activity.action_type === 'meeting' && (activity.metadata as Record<string, unknown> | null)?.kind === 'advice';

const activityIcon = (activity: Activity) => {
  if (isAdvice(activity)) return ACTIVITY_ICONS.advice;
  return ACTIVITY_ICONS[activity.action_type] || Settings;
};

const activityLabel = (activity: Activity) => {
  if (isAdvice(activity)) return 'Conseil délivré';
  return ACTIVITY_LABELS[activity.action_type] || humanizeActionType(activity.action_type);
};

// Aplati une activité en une ligne CSV lisible pour l'export réglementaire (registre de preuve DDA).
const activityCsvContent = (activity: Activity): string => {
  const meta = activity.metadata as Record<string, unknown> | null;
  if (activity.action_type === 'call' && meta?.outcome) {
    const outcome = CALL_OUTCOME_LABELS[meta.outcome as string] || String(meta.outcome);
    return [activity.description, outcome].filter(Boolean).join(' — ');
  }
  if (isAdvice(activity)) {
    return `Besoin exprimé : ${meta?.need || '—'} / Recommandation : ${meta?.recommendation || '—'}`;
  }
  return activity.description || '';
};

export const LeadTimeline = ({ dealId }: LeadTimelineProps) => {
  const { data: activities, isLoading } = useQuery({
    queryKey: ['deal-activities', dealId],
    queryFn: () => fetchDealActivities(dealId),
  });

  const authorIds = useMemo(
    () => Array.from(new Set((activities ?? []).map((a) => a.author_id).filter((id): id is string => !!id))),
    [activities],
  );

  const { data: authorNames } = useQuery({
    queryKey: ['activity-authors', authorIds.join(',')],
    queryFn: () => resolveAuthorNames(authorIds),
    enabled: authorIds.length > 0,
  });

  const authorDisplayName = (activity: Activity): { name: string; isSystem: boolean } => {
    const metaAuthorName = (activity.metadata as Record<string, unknown> | null)?.author_name as string | undefined;
    if (activity.author_id) {
      return { name: authorNames?.get(activity.author_id) || metaAuthorName || 'Utilisateur', isSystem: false };
    }
    return { name: metaAuthorName || 'Système', isSystem: true };
  };

  const handleExport = () => {
    if (!activities || activities.length === 0) return;
    const rows = activities.map((a) => ({
      Date: format(new Date(a.created_at), 'dd/MM/yyyy HH:mm', { locale: fr }),
      Type: activityLabel(a),
      Auteur: authorDisplayName(a).name,
      Contenu: activityCsvContent(a),
    }));
    exportToCSV(rows, `historique-deal-${dealId}`);
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
          Exporter l'historique du deal
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
          <p className="text-sm">Aucune activité enregistrée pour ce deal.</p>
        </div>
      ) : (
        <div className="relative pl-4">
          <div className="absolute left-[19px] top-2 bottom-2 w-px bg-border" aria-hidden />
          <div className="space-y-4">
            {activities.map((activity) => {
              const Icon = activityIcon(activity);
              const { name: authorName, isSystem } = authorDisplayName(activity);
              const meta = activity.metadata as Record<string, unknown> | null;

              return (
                <div key={activity.id} className="relative flex gap-3">
                  <div
                    className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                      isSystem
                        ? 'bg-muted text-muted-foreground'
                        : 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0 pt-0.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-sm font-medium ${isSystem ? 'text-muted-foreground' : ''}`}>
                        {activityLabel(activity)}
                      </span>
                      {isSystem && (
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 text-muted-foreground">
                          Système
                        </Badge>
                      )}
                      {activity.action_type === 'call' && Boolean(meta?.outcome) && (
                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
                          {CALL_OUTCOME_LABELS[meta!.outcome as string] || String(meta!.outcome)}
                        </Badge>
                      )}
                    </div>

                    {isAdvice(activity) ? (
                      <div className="mt-1 space-y-1 text-sm">
                        <p>
                          <span className="text-muted-foreground">Besoin exprimé par le client : </span>
                          {(meta?.need as string) || '—'}
                        </p>
                        <p>
                          <span className="text-muted-foreground">Recommandation formulée : </span>
                          {(meta?.recommendation as string) || '—'}
                        </p>
                      </div>
                    ) : activity.description ? (
                      <p className="mt-1 text-sm whitespace-pre-wrap break-words">{activity.description}</p>
                    ) : null}

                    <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{authorName}</span>
                      <span>·</span>
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
