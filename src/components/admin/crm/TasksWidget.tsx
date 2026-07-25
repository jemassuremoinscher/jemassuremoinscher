import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { ListTodo, AlertTriangle, CalendarDays, CalendarClock } from 'lucide-react';
import { addDays, endOfDay, format, isToday } from 'date-fns';
import { fr } from 'date-fns/locale';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { completeLeadTask, fetchLeadNames, fetchOpenLeadTasks, leadKey, resolveCurrentAgent } from '@/lib/crmApi';
import type { LeadTask, LeadType, TaskPriority } from '@/types/crm';

interface TasksWidgetProps {
  onNavigateToLead: (result: { id: string; type: LeadType; name: string }) => void;
}

const PRIORITY_STYLES: Record<TaskPriority, string> = {
  low: 'bg-muted text-muted-foreground',
  normal: 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',
  high: 'bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400',
  urgent: 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400',
};

const PRIORITY_LABELS: Record<TaskPriority, string> = {
  low: 'Basse',
  normal: 'Normale',
  high: 'Haute',
  urgent: 'Urgente',
};

const formatDue = (dueAt: string | null) => {
  if (!dueAt) return 'Sans échéance';
  const d = new Date(dueAt);
  return isToday(d) ? `Aujourd'hui à ${format(d, 'HH:mm')}` : format(d, "dd/MM 'à' HH:mm", { locale: fr });
};

export const TasksWidget = ({ onNavigateToLead }: TasksWidgetProps) => {
  const [teamScope, setTeamScope] = useState(false);
  const queryClient = useQueryClient();

  const { data: agent } = useQuery({
    queryKey: ['current-agent'],
    queryFn: resolveCurrentAgent,
    staleTime: Infinity,
  });

  const { data: canSeeTeam } = useQuery({
    queryKey: ['current-user-can-see-team'],
    queryFn: async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return false;
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userData.user.id)
        .in('role', ['admin', 'owner']);
      if (error) throw error;
      return (data?.length ?? 0) > 0;
    },
    staleTime: Infinity,
  });

  const scope: 'mine' | 'team' = teamScope && canSeeTeam ? 'team' : 'mine';

  const { data: tasks, isLoading } = useQuery({
    queryKey: ['lead-tasks-open', scope, agent?.id],
    queryFn: () => fetchOpenLeadTasks({ scope, agentId: agent?.id }),
    enabled: scope === 'team' || !!agent,
  });

  const taskRefs = (tasks ?? []).map((t) => ({ leadType: t.lead_type, leadId: t.lead_id }));
  const { data: leadNames } = useQuery({
    queryKey: ['lead-task-lead-names', taskRefs.map((r) => leadKey(r.leadType, r.leadId)).join(',')],
    queryFn: () => fetchLeadNames(taskRefs),
    enabled: taskRefs.length > 0,
  });

  const completeMutation = useMutation({
    mutationFn: (task: LeadTask) => completeLeadTask(task, agent ?? null),
    onSuccess: () => {
      toast.success('Tâche terminée');
      queryClient.invalidateQueries({ queryKey: ['lead-tasks-open'] });
      queryClient.invalidateQueries({ queryKey: ['lead-activities'] });
      queryClient.invalidateQueries({ queryKey: ['lead-tasks-overdue'] });
    },
    onError: () => toast.error('Erreur lors de la clôture de la tâche'),
  });

  const now = new Date();
  const endToday = endOfDay(now);
  const in7Days = addDays(now, 7);

  // Ne garde que ce qui sera effectivement affiché dans une des 4 sections ci-dessous,
  // pour que le compteur du header reste cohérent avec la liste rendue.
  const relevantTasks = (tasks ?? []).filter((t) => !t.due_at || new Date(t.due_at) <= in7Days);
  const withDueDate = relevantTasks.filter((t) => t.due_at);
  const withoutDueDate = relevantTasks.filter((t) => !t.due_at);
  const overdue = withDueDate.filter((t) => new Date(t.due_at as string) < now);
  const dueToday = withDueDate.filter((t) => new Date(t.due_at as string) >= now && isToday(new Date(t.due_at as string)));
  const upcoming = withDueDate.filter(
    (t) => new Date(t.due_at as string) > endToday && new Date(t.due_at as string) <= in7Days,
  );

  const renderTask = (task: LeadTask) => {
    const name = leadNames?.get(leadKey(task.lead_type, task.lead_id)) || 'Lead';
    return (
      <div key={task.id} className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-muted/50 transition-colors">
        <Checkbox
          className="mt-0.5"
          checked={false}
          disabled={completeMutation.isPending}
          onCheckedChange={() => completeMutation.mutate(task)}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              className="text-sm font-medium hover:underline text-left"
              onClick={() => onNavigateToLead({ id: task.lead_id, type: task.lead_type, name })}
            >
              {task.title}
            </button>
            <Badge variant="outline" className={`text-[10px] px-1.5 py-0 h-4 ${PRIORITY_STYLES[task.priority]}`}>
              {PRIORITY_LABELS[task.priority]}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            {name} · {formatDue(task.due_at)}
          </p>
        </div>
      </div>
    );
  };

  const totalOpen = relevantTasks.length;

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold flex items-center gap-2">
          <ListTodo className="h-5 w-5 text-primary" />
          Mes tâches
          {!isLoading && <Badge variant="outline">{totalOpen}</Badge>}
        </h3>
        {canSeeTeam && (
          <div className="flex items-center gap-2">
            <Label htmlFor="team-scope-toggle" className="text-sm text-muted-foreground">
              Toute l'équipe
            </Label>
            <Switch id="team-scope-toggle" checked={teamScope} onCheckedChange={setTeamScope} />
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-4 w-4 rounded" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3 w-2/3" />
                <Skeleton className="h-3 w-1/3" />
              </div>
            </div>
          ))}
        </div>
      ) : totalOpen === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <ListTodo className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Aucune tâche en cours.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {overdue.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wide text-red-600 flex items-center gap-1.5 mb-1">
                <AlertTriangle className="h-3.5 w-3.5" />
                En retard ({overdue.length})
              </h4>
              <div className="divide-y">{overdue.map(renderTask)}</div>
            </div>
          )}

          {dueToday.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1.5 mb-1">
                <CalendarDays className="h-3.5 w-3.5" />
                Aujourd'hui ({dueToday.length})
              </h4>
              <div className="divide-y">{dueToday.map(renderTask)}</div>
            </div>
          )}

          {upcoming.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1.5 mb-1">
                <CalendarClock className="h-3.5 w-3.5" />
                À venir (7 j) ({upcoming.length})
              </h4>
              <div className="divide-y">{upcoming.map(renderTask)}</div>
            </div>
          )}

          {withoutDueDate.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">
                Sans échéance ({withoutDueDate.length})
              </h4>
              <div className="divide-y">{withoutDueDate.map(renderTask)}</div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};
