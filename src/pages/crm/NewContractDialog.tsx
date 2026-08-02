import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { createContract } from "@/lib/portfolioApi";
import type { ContractStatus } from "@/types/portfolio";
import type { DealRow } from "./types";

const STATUS_OPTIONS: { value: ContractStatus; label: string }[] = [
  { value: "active", label: "Actif" },
  { value: "pending", label: "En attente" },
];

export function NewContractDialog({
  deal,
  open,
  onOpenChange,
  onCreated,
}: {
  deal: DealRow;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onCreated: () => void;
}) {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    insurer_name: "",
    policy_number: "",
    premium_annual: "",
    commission_year_one: "",
    commission_recurring: "",
    effective_date: "",
    renewal_date: "",
    status: "active" as ContractStatus,
    notes: "",
  });

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const reset = () =>
    setForm({
      insurer_name: "",
      policy_number: "",
      premium_annual: "",
      commission_year_one: "",
      commission_recurring: "",
      effective_date: "",
      renewal_date: "",
      status: "active",
      notes: "",
    });

  const submit = async () => {
    if (!deal.contact_id) {
      toast.error("Ce deal n'a pas de contact associé");
      return;
    }
    if (!form.insurer_name.trim()) {
      toast.error("L'assureur est requis");
      return;
    }
    setSaving(true);
    try {
      const { data: userRes } = await supabase.auth.getUser();
      await createContract({
        contact_id: deal.contact_id,
        deal_id: deal.id,
        insurance_type: deal.insurance_type,
        insurer_name: form.insurer_name.trim(),
        policy_number: form.policy_number.trim() || null,
        premium_annual: form.premium_annual ? Number(form.premium_annual) : null,
        commission_year_one: form.commission_year_one ? Number(form.commission_year_one) : null,
        commission_recurring: form.commission_recurring ? Number(form.commission_recurring) : null,
        effective_date: form.effective_date || null,
        renewal_date: form.renewal_date || null,
        status: form.status,
        assigned_to: userRes.user?.id ?? null,
        notes: form.notes.trim() || null,
      });
      toast.success("Contrat créé");
      onCreated();
      onOpenChange(false);
      reset();
    } catch (e) {
      toast.error("Impossible de créer le contrat");
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Créer le contrat</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3 py-2">
          <div className="rounded-2xl border border-[#E9D5FF] bg-[#FAF5FF] px-3 py-2 text-xs text-slate-600">
            <span className="font-medium text-[#5B21B6]">{deal.contacts?.full_name || deal.contacts?.email}</span>
            {" · "}
            {deal.insurance_type}
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="insurer">Assureur</Label>
            <Input
              id="insurer"
              value={form.insurer_name}
              onChange={(e) => set("insurer_name", e.target.value)}
              placeholder="Ex. Axa, Maif…"
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="policy">N° de police</Label>
            <Input
              id="policy"
              value={form.policy_number}
              onChange={(e) => set("policy_number", e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="premium">Prime annuelle (€)</Label>
              <Input
                id="premium"
                type="number"
                min="0"
                step="0.01"
                value={form.premium_annual}
                onChange={(e) => set("premium_annual", e.target.value)}
              />
            </div>
            <div className="grid gap-1.5">
              <Label>Statut</Label>
              <Select value={form.status} onValueChange={(v) => set("status", v as ContractStatus)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="commY1">Commission an 1 (€)</Label>
              <Input
                id="commY1"
                type="number"
                min="0"
                step="0.01"
                value={form.commission_year_one}
                onChange={(e) => set("commission_year_one", e.target.value)}
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="commRec">Commission récurrente (€/an)</Label>
              <Input
                id="commRec"
                type="number"
                min="0"
                step="0.01"
                value={form.commission_recurring}
                onChange={(e) => set("commission_recurring", e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="eff">Date d'effet</Label>
              <Input
                id="eff"
                type="date"
                value={form.effective_date}
                onChange={(e) => set("effective_date", e.target.value)}
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="renew">Date d'échéance</Label>
              <Input
                id="renew"
                type="date"
                value={form.renewal_date}
                onChange={(e) => set("renewal_date", e.target.value)}
              />
            </div>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="cnotes">Notes</Label>
            <Textarea
              id="cnotes"
              rows={2}
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={submit} disabled={saving} className="bg-[#7C3AED] hover:bg-[#6D28D9]">
            {saving ? "Création…" : "Créer le contrat"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
