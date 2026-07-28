import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Checkbox } from '@/components/ui/checkbox';
import { ListTodo, AlertTriangle, CalendarDays, CalendarClock } from 'lucide-react';
import { addDays, endOfDay, format, isToday } from 'date-fns';
import { fr } from 'date-fns/locale';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  completeDealTask,
  fetchDealLabels,
  fetchOpenDealTasks,
  resolveAssigneeNames,
  resolveCurrentAgentRef,
} from '@/lib/crmApi';
import type { DealTask, TaskPriority } from '@/types/crm';

interface TasksWidgetProps {
  onNavigateToDeal: (dealId: string) => void;
}

// Mêmes teintes que les accents d'étape du Kanban (qualified/subscription/incomplete)
// pour rester dans la palette déjà utilisée par le reste du nouvel admin.
const PRIORITY_STYLES: Record<TaskPriority, string> = {
  low: 'bg-slate-100 dark:bg-[#262140] text-slate-500 dark:text-slate-400',
  normal: 'bg-[#EEF2FF] dark:bg-[#23253F] text-[#4F46E5] dark:text-[#A5B4FC]',
  high: 'bg-[#FEF3C7] dark:bg-[#3D2E12] text-[#D97706] dark:text-[#FBBF24]',
  urgent: 'bg-[#FEE2E2] dark:bg-[#3D1515] text-[#DC2626] dark:text-[#F87171]',
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

export const TasksWidget = ({ onNavigateToDeal }: TasksWidgetProps) => {
  const [teamScope, setTeamScope] = useState(false);
  const queryClient = useQueryClient();

  const { data: agent } = useQuery({
    queryKey: ['current-agent-ref'],
    queryFn: resolveCurrentAgentRef,
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
    queryKey: ['deal-tasks-open', scope, agent?.agentId],
    queryFn: () => fetchOpenDealTasks({ scope, agentId: agent?.agentId }),
    enabled: scope === 'team' || !!agent,
  });

  const dealIds = (tasks ?? []).map((t) => t.deal_id);
  const { data: dealLabels } = useQuery({
    queryKey: ['deal-task-labels', dealIds.join(',')],
    queryFn: () => fetchDealLabels(dealIds),
    enabled: dealIds.length > 0,
  });

  // deal_tasks.assigned_to est un sales_agents.id : ne pas résoudre ces noms
  // avec resolveAuthorNames() (qui attend des user_id) — voir crmApi.ts.
  const assigneeIds = Array.from(
    new Set((tasks ?? []).map((t) => t.assigned_to).filter((id): id is string => !!id)),
  );
  const { data: assigneeNames } = useQuery({
    queryKey: ['deal-task-assignees', assigneeIds.join(',')],
    queryFn: () => resolveAssigneeNames(assigneeIds),
    enabled: assigneeIds.length > 0,
  });

  const completeMutation = useMutation({
    mutationFn: (task: DealTask) => completeDealTask(task, agent?.userId ?? null),
    onSuccess: () => {
      toast.success('Tâche terminée');
      queryClient.invalidateQueries({ queryKey: ['deal-tasks-open'] });
      queryClient.invalidateQueries({ queryKey: ['deal-activities'] });
      queryClient.invalidateQueries({ queryKey: ['deal-tasks-overdue'] });
    },
    onError: () => toast.error('Erreur lors de la clôture de la tâche'),
  });

  const now = new Date();
  const endToday = endOfDay(now);
  const in7Days = addDays(now, 7);

  const relevantTasks = tasks ?? [];
  const withDueDate = relevantTasks.filter((t) => t.due_at);
  const withoutDueDate = relevantTasks.filter((t) => !t.due_at);
  const overdue = withDueDate.filter((t) => new Date(t.due_at as string) < now);
  const dueToday = withDueDate.filter((t) => new Date(t.due_at as string) >= now && isToday(new Date(t.due_at as string)));
  const upcoming = withDueDate.filter(
    (t) => new Date(t.due_at as string) > endToday && new Date(t.due_at as string) <= in7Days,
  );
  const later = withDueDate.filter((t) => new Date(t.due_at as string) > in7Days);

  const renderTask = (task: DealTask) => {
    const label = dealLabels?.get(task.deal_id) || 'Deal';
    const assigneeName = task.assigned_to ? assigneeNames?.get(task.assigned_to) : null;
    return (
      <div key={task.id} className="flex items-start gap-3 rounded-2xl p-2.5 hover:bg-[#FAF5FF] dark:hover:bg-[#262140] transition-colors">
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
              className="text-sm font-medium text-slate-800 dark:text-slate-100 hover:text-[#7C3AED] dark:hover:text-[#C4B5FD] text-left"
              onClick={() => onNavigateToDeal(task.deal_id)}
            >
              {task.title}
            </button>
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${PRIORITY_STYLES[task.priority]}`}>
              {PRIORITY_LABELS[task.priority]}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {label} · {formatDue(task.due_at)}
            {assigneeName && <> · Assigné à {assigneeName}</>}
          </p>
        </div>
      </div>
    );
  };

  const totalOpen = relevantTasks.length;

  return (
    <section className="rounded-3xl border border-[#E9D5FF] dark:border-[#362B54] bg-white dark:bg-[#1E1B2E] p-5">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-100">
          <ListTodo className="h-4 w-4 text-[#7C3AED] dark:text-[#C4B5FD]" />
          Mes tâches
          {!isLoading && (
            <span className="rounded-full bg-[#F3E8FF] dark:bg-[#262140] px-2 py-0.5 text-[11px] font-semibold text-[#5B21B6] dark:text-[#D8B4FE]">
              {totalOpen}
            </span>
          )}
        </h3>
        {canSeeTeam && (
          <div className="flex rounded-full border border-[#E9D5FF] dark:border-[#362B54] bg-white dark:bg-[#1E1B2E] p-0.5">
            <button
              type="button"
              onClick={() => setTeamScope(false)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                !teamScope ? 'bg-[#7C3AED] text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-[#F5F3FF] dark:hover:bg-[#262140]'
              }`}
            >
              Moi
            </button>
            <button
              type="button"
              onClick={() => setTeamScope(true)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                teamScope ? 'bg-[#7C3AED] text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-[#F5F3FF] dark:hover:bg-[#262140]'
              }`}
            >
              Équipe
            </button>
          </div>
        )}
      </div>

      {isLoading ? (
        <p className="mt-4 text-xs text-slate-400 dark:text-slate-500">Chargement…</p>
      ) : totalOpen === 0 ? (
        <div className="mt-4 grid h-24 place-items-center rounded-2xl border border-dashed border-[#E9D5FF] dark:border-[#362B54] text-xs text-slate-400 dark:text-slate-500">
          Aucune tâche en cours.
        </div>
      ) : (
        <div className="mt-4 space-y-4">
          {overdue.length > 0 && (
            <div>
              <h4 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-[#DC2626] dark:text-[#F87171]">
                <AlertTriangle className="h-3.5 w-3.5" />
                En retard ({overdue.length})
              </h4>
              <div className="mt-1 divide-y divide-[#F3E8FF] dark:divide-[#362B54]">{overdue.map(renderTask)}</div>
            </div>
          )}

          {dueToday.length > 0 && (
            <div>
              <h4 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                <CalendarDays className="h-3.5 w-3.5" />
                Aujourd'hui ({dueToday.length})
              </h4>
              <div className="mt-1 divide-y divide-[#F3E8FF] dark:divide-[#362B54]">{dueToday.map(renderTask)}</div>
            </div>
          )}

          {upcoming.length > 0 && (
            <div>
              <h4 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                <CalendarClock className="h-3.5 w-3.5" />
                À venir (7 j) ({upcoming.length})
              </h4>
              <div className="mt-1 divide-y divide-[#F3E8FF] dark:divide-[#362B54]">{upcoming.map(renderTask)}</div>
            </div>
          )}

          {later.length > 0 && (
            <div>
              <h4 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                <CalendarClock className="h-3.5 w-3.5" />
                Plus tard ({later.length})
              </h4>
              <div className="mt-1 divide-y divide-[#F3E8FF] dark:divide-[#362B54]">{later.map(renderTask)}</div>
            </div>
          )}

          {withoutDueDate.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Sans échéance ({withoutDueDate.length})
              </h4>
              <div className="mt-1 divide-y divide-[#F3E8FF] dark:divide-[#362B54]">{withoutDueDate.map(renderTask)}</div>
            </div>
          )}
        </div>
      )}
    </section>
  );
};
