import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';

const INSURANCE_TYPES = [
  { value: 'auto', label: 'Auto' },
  { value: 'habitation', label: 'Habitation' },
  { value: 'sante', label: 'Santé' },
  { value: 'vie', label: 'Vie' },
  { value: 'pret', label: 'Prêt' },
  { value: 'prevoyance', label: 'Prévoyance' },
  { value: 'rc-pro', label: 'RC Pro' },
  { value: 'mrp', label: 'MRP' },
  { value: 'gli', label: 'GLI' },
  { value: 'pno', label: 'PNO' },
  { value: 'moto', label: 'Moto' },
  { value: 'animaux', label: 'Animaux' },
];

interface ManualLeadFormProps {
  onLeadCreated: () => void;
}

export const ManualLeadForm = ({ onLeadCreated }: ManualLeadFormProps) => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    insurance_type: '',
    assigned_to: '',
    notes: '',
    lead_source: 'manual',
  });

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

  const handleSubmit = async () => {
    if (!form.full_name || !form.email || !form.phone || !form.insurance_type) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const agent = agents?.find(a => a.id === form.assigned_to);
    const assignValue = agent?.user_id || agent?.id || null;

    const { error } = await supabase.from('insurance_quotes').insert({
      full_name: form.full_name,
      email: form.email,
      phone: form.phone,
      insurance_type: form.insurance_type,
      assigned_to: assignValue,
      notes: form.notes || null,
      lead_source: 'manual',
      quote_data: { source: 'manual_entry' },
      status: 'pending',
    });

    if (error) {
      toast.error("Erreur lors de la création: " + error.message);
    } else {
      toast.success('Lead créé avec succès');
      setForm({
        full_name: '',
        email: '',
        phone: '',
        insurance_type: '',
        assigned_to: '',
        notes: '',
        lead_source: 'manual',
      });
      setOpen(false);
      onLeadCreated();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un lead
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Créer un lead manuellement</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nom complet *</Label>
              <Input
                value={form.full_name}
                onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                placeholder="Jean Dupont"
              />
            </div>
            <div className="space-y-2">
              <Label>Email *</Label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="jean@example.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Téléphone *</Label>
              <Input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+33 6 12 34 56 78"
              />
            </div>
            <div className="space-y-2">
              <Label>Type d'assurance *</Label>
              <Select value={form.insurance_type} onValueChange={(v) => setForm({ ...form, insurance_type: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Choisir..." />
                </SelectTrigger>
                <SelectContent>
                  {INSURANCE_TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Attribuer à</Label>
            <Select value={form.assigned_to} onValueChange={(v) => setForm({ ...form, assigned_to: v })}>
              <SelectTrigger>
                <SelectValue placeholder="Non attribué" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">— Non attribué</SelectItem>
                {agents?.map((agent) => (
                  <SelectItem key={agent.id} value={agent.id}>
                    {agent.full_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Notes</Label>
            <Textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Notes sur ce lead..."
              rows={3}
            />
          </div>

          <Button onClick={handleSubmit} className="w-full">
            Créer le lead
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
