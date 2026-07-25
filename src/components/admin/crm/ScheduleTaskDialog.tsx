import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { addDays, format, setHours, setMinutes } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { CalendarClock } from 'lucide-react';
import { createDealTask, resolveCurrentAgentRef } from '@/lib/crmApi';
import type { TaskPriority } from '@/types/crm';

interface ScheduleTaskDialogProps {
  dealId: string;
  onCreated: () => void;
}

const defaultDueAt = () => format(setMinutes(setHours(addDays(new Date(), 1), 9), 0), "yyyy-MM-dd'T'HH:mm");

const PRIORITY_OPTIONS: { value: TaskPriority; label: string }[] = [
  { value: 'low', label: 'Basse' },
  { value: 'normal', label: 'Normale' },
  { value: 'high', label: 'Haute' },
  { value: 'urgent', label: 'Urgente' },
];

export const ScheduleTaskDialog = ({ dealId, onCreated }: ScheduleTaskDialogProps) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('Rappeler le client');
  const [dueAt, setDueAt] = useState(defaultDueAt());
  const [priority, setPriority] = useState<TaskPriority>('normal');
  const [assignedTo, setAssignedTo] = useState<string>('unassigned');
  const [submitting, setSubmitting] = useState(false);

  const { data: agents } = useQuery({
    queryKey: ['sales-agents-list'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sales_agents')
        .select('id, full_name, user_id, is_active')
        .eq('is_active', true)
        .order('full_name');
      if (error) throw error;
      return data;
    },
  });

  const resetForm = () => {
    setTitle('Rappeler le client');
    setDueAt(defaultDueAt());
    setPriority('normal');
    setAssignedTo('unassigned');
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast.error('Le titre est obligatoire');
      return;
    }

    setSubmitting(true);
    try {
      const agent = await resolveCurrentAgentRef();
      await createDealTask({
        deal_id: dealId,
        title: title.trim(),
        due_at: dueAt ? new Date(dueAt).toISOString() : null,
        priority,
        assigned_to: assignedTo === 'unassigned' ? null : assignedTo,
        created_by: agent?.userId ?? null,
      });
      toast.success('Tâche planifiée');
      resetForm();
      setOpen(false);
      onCreated();
    } catch {
      toast.error('Erreur lors de la planification de la tâche');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <CalendarClock className="h-4 w-4 mr-2" />
          Planifier un rappel
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Planifier un rappel</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label htmlFor="task-title">Titre</Label>
            <Input id="task-title" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="task-due">Date et heure</Label>
            <Input id="task-due" type="datetime-local" value={dueAt} onChange={(e) => setDueAt(e.target.value)} />
          </div>
          <div>
            <Label>Priorité</Label>
            <Select value={priority} onValueChange={(v) => setPriority(v as TaskPriority)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PRIORITY_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Assigné à</Label>
            <Select value={assignedTo} onValueChange={setAssignedTo}>
              <SelectTrigger>
                <SelectValue placeholder="Non assigné" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unassigned">— Non assigné</SelectItem>
                {agents?.map((a) => (
                  <SelectItem key={a.id} value={a.id}>
                    {a.full_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="ghost" onClick={() => setOpen(false)} disabled={submitting}>
            Annuler
          </Button>
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? 'Planification...' : 'Planifier'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
