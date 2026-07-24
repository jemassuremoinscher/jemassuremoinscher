import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { STAGES, type DealRow, type StageId } from "./types";
import { CANONICAL_INSURANCE_TYPES, INSURANCE_TYPE_LABELS } from "@/utils/insuranceTypeNormalizer";
import { Pencil } from "lucide-react";

type Agent = { id: string; user_id: string | null; full_name: string };

export function EditDealSection({ deal, onSaved }: { deal: DealRow; onSaved: () => void }) {
  const [editing, setEditing] = useState(false);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [form, setForm] = useState({
    stage: deal.stage as StageId,
    insurance_type: deal.insurance_type,
    assigned_to: deal.assigned_to ?? "",
    estimated_commission: deal.estimated_commission ?? 0,
    lead_score: deal.lead_score ?? 0,
    notes: deal.notes ?? "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.from("sales_agents").select("id,user_id,full_name").eq("is_active", true)
      .then(({ data }) => setAgents((data ?? []) as Agent[]));
  }, []);

  useEffect(() => {
    setForm({
      stage: deal.stage,
      insurance_type: deal.insurance_type,
      assigned_to: deal.assigned_to ?? "",
      estimated_commission: deal.estimated_commission ?? 0,
      lead_score: deal.lead_score ?? 0,
      notes: deal.notes ?? "",
    });
  }, [deal]);

  const save = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("deals")
      .update({
        stage: form.stage,
        insurance_type: form.insurance_type,
        assigned_to: form.assigned_to || null,
        estimated_commission: Number(form.estimated_commission) || 0,
        lead_score: Number(form.lead_score) || 0,
        notes: form.notes || null,
      })
      .eq("id", deal.id);
    setSaving(false);
    if (error) return toast.error("Erreur : " + error.message);
    toast.success("Deal mis à jour");
    setEditing(false);
    onSaved();
  };

  return (
    <section className="rounded-3xl border border-[#E9D5FF] bg-white p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-800">Détails du deal</h3>
        <Button size="sm" variant="ghost" onClick={() => setEditing((v) => !v)} className="text-[#7C3AED]">
          <Pencil className="mr-1 h-3.5 w-3.5" />
          {editing ? "Fermer" : "Modifier"}
        </Button>
      </div>

      {!editing ? (
        <dl className="mt-3 grid grid-cols-2 gap-3 text-sm">
          <div><dt className="text-xs text-slate-500">Étape</dt><dd>{STAGES.find(s => s.id === deal.stage)?.label}</dd></div>
          <div><dt className="text-xs text-slate-500">Produit</dt><dd>{deal.insurance_type}</dd></div>
          <div><dt className="text-xs text-slate-500">Commission est.</dt><dd>{deal.estimated_commission ?? 0} €</dd></div>
          <div><dt className="text-xs text-slate-500">Score</dt><dd>{deal.lead_score ?? 0}</dd></div>
        </dl>
      ) : (
        <div className="mt-3 grid gap-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label>Étape</Label>
              <select value={form.stage} onChange={(e) => setForm({ ...form, stage: e.target.value as StageId })}
                className="h-9 rounded-md border border-input bg-background px-2 text-sm">
                {STAGES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
              </select>
            </div>
            <div className="grid gap-1.5">
              <Label>Produit</Label>
              <select value={form.insurance_type} onChange={(e) => setForm({ ...form, insurance_type: e.target.value })}
                className="h-9 rounded-md border border-input bg-background px-2 text-sm">
                {CANONICAL_INSURANCE_TYPES.map(t => (
                  <option key={t} value={t}>{INSURANCE_TYPE_LABELS[t]}</option>
                ))}
              </select>
            </div>
            <div className="grid gap-1.5">
              <Label>Commercial</Label>
              <select value={form.assigned_to} onChange={(e) => setForm({ ...form, assigned_to: e.target.value })}
                className="h-9 rounded-md border border-input bg-background px-2 text-sm">
                <option value="">— Non assigné —</option>
                {agents.filter(a => a.user_id).map(a => (
                  <option key={a.id} value={a.user_id!}>{a.full_name}</option>
                ))}
              </select>
            </div>
            <div className="grid gap-1.5">
              <Label>Commission (€)</Label>
              <Input type="number" value={form.estimated_commission}
                onChange={(e) => setForm({ ...form, estimated_commission: Number(e.target.value) })} />
            </div>
            <div className="grid gap-1.5">
              <Label>Score</Label>
              <Input type="number" min={0} max={100} value={form.lead_score}
                onChange={(e) => setForm({ ...form, lead_score: Number(e.target.value) })} />
            </div>
          </div>
          <div className="grid gap-1.5">
            <Label>Notes</Label>
            <Textarea rows={4} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setEditing(false)}>Annuler</Button>
            <Button size="sm" onClick={save} disabled={saving} className="bg-[#7C3AED] hover:bg-[#6D28D9]">
              {saving ? "…" : "Enregistrer"}
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}
