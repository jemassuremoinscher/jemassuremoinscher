import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { AlertOctagon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { createClaim } from "@/lib/claimsApi";
import {
  CLAIM_RESPONSIBILITY_LABELS,
  CLAIM_STATUS_LABELS,
  type ClaimResponsibility,
  type ClaimStatus,
} from "@/types/claims";

const RESPONSIBILITY_OPTIONS = Object.keys(CLAIM_RESPONSIBILITY_LABELS) as ClaimResponsibility[];
const STATUS_OPTIONS = Object.keys(CLAIM_STATUS_LABELS) as ClaimStatus[];

const today = () => new Date().toISOString().slice(0, 10);

export function DeclareClaimDialog({
  contractId,
  onCreated,
}: {
  contractId: string;
  onCreated: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    claim_date: today(),
    claim_type: "",
    description: "",
    amount_claimed: "",
    amount_paid: "",
    responsibility: "pending" as ClaimResponsibility,
    status: "declared" as ClaimStatus,
    impact_bonus_malus: false,
  });

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const reset = () =>
    setForm({
      claim_date: today(),
      claim_type: "",
      description: "",
      amount_claimed: "",
      amount_paid: "",
      responsibility: "pending",
      status: "declared",
      impact_bonus_malus: false,
    });

  const submit = async () => {
    if (!form.claim_type.trim()) {
      toast.error("Le type de sinistre est requis");
      return;
    }
    setSaving(true);
    try {
      const { data: userRes } = await supabase.auth.getUser();
      await createClaim({
        contract_id: contractId,
        claim_date: form.claim_date,
        claim_type: form.claim_type.trim(),
        description: form.description.trim() || null,
        amount_claimed: form.amount_claimed ? Number(form.amount_claimed) : null,
        amount_paid: form.amount_paid ? Number(form.amount_paid) : null,
        responsibility: form.responsibility,
        status: form.status,
        impact_bonus_malus: form.impact_bonus_malus,
        reported_by: userRes.user?.id ?? null,
      });
      toast.success("Sinistre déclaré");
      reset();
      setOpen(false);
      onCreated();
    } catch (e) {
      toast.error("Erreur lors de la déclaration du sinistre");
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) reset(); }}>
      <DialogTrigger asChild>
        <Button size="sm" className="rounded-full bg-[#7C3AED] hover:bg-[#6D28D9]">
          <AlertOctagon className="mr-1.5 h-3.5 w-3.5" />
          Déclarer un sinistre
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Déclarer un sinistre</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3 py-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="claim-date">Date du sinistre</Label>
              <Input
                id="claim-date"
                type="date"
                value={form.claim_date}
                onChange={(e) => set("claim_date", e.target.value)}
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="claim-type">Type</Label>
              <Input
                id="claim-type"
                value={form.claim_type}
                onChange={(e) => set("claim_type", e.target.value)}
                placeholder="Ex. Dégât des eaux"
              />
            </div>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="claim-desc">Description</Label>
            <Textarea
              id="claim-desc"
              rows={2}
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="claim-amount-claimed">Montant réclamé (€)</Label>
              <Input
                id="claim-amount-claimed"
                type="number"
                min="0"
                step="0.01"
                value={form.amount_claimed}
                onChange={(e) => set("amount_claimed", e.target.value)}
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="claim-amount-paid">Montant versé (€)</Label>
              <Input
                id="claim-amount-paid"
                type="number"
                min="0"
                step="0.01"
                value={form.amount_paid}
                onChange={(e) => set("amount_paid", e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label>Responsabilité</Label>
              <Select value={form.responsibility} onValueChange={(v) => set("responsibility", v as ClaimResponsibility)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {RESPONSIBILITY_OPTIONS.map((r) => (
                    <SelectItem key={r} value={r}>
                      {CLAIM_RESPONSIBILITY_LABELS[r]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5">
              <Label>Statut</Label>
              <Select value={form.status} onValueChange={(v) => set("status", v as ClaimStatus)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((s) => (
                    <SelectItem key={s} value={s}>
                      {CLAIM_STATUS_LABELS[s]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="claim-bonus-malus"
              checked={form.impact_bonus_malus}
              onCheckedChange={(c) => set("impact_bonus_malus", !!c)}
            />
            <Label htmlFor="claim-bonus-malus" className="text-sm font-normal">
              Impacte le bonus-malus
            </Label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Annuler
          </Button>
          <Button onClick={submit} disabled={saving} className="bg-[#7C3AED] hover:bg-[#6D28D9]">
            {saving ? "Enregistrement…" : "Déclarer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
