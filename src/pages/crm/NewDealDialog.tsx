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
import { z } from "zod";

const INSURANCE_TYPES = [
  "auto", "moto", "habitation", "sante", "pret", "animaux",
  "vie", "prevoyance", "rc_pro", "mrp", "gli", "pno",
  "gestion_locative", "metiers_atypiques",
];

const schema = z.object({
  full_name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().min(6).max(30),
  insurance_type: z.string().min(1),
  notes: z.string().max(2000).optional(),
});

export function NewDealDialog({
  open,
  onOpenChange,
  onCreated,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onCreated: () => void;
}) {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    insurance_type: "auto",
    notes: "",
  });

  const set = (k: keyof typeof form, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  const submit = async () => {
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error("Vérifiez les champs (email, téléphone, nom).");
      return;
    }
    setSaving(true);
    try {
      // Upsert contact
      const email = form.email.trim().toLowerCase();
      const { data: contact, error: cErr } = await supabase
        .from("contacts")
        .upsert(
          {
            email,
            full_name: form.full_name.trim(),
            phone: form.phone.trim(),
            source: "crm_manual",
            rgpd_consent: true,
          },
          { onConflict: "email" }
        )
        .select("id")
        .single();
      if (cErr || !contact) throw cErr ?? new Error("contact");

      const { data: userRes } = await supabase.auth.getUser();
      const { error: dErr } = await supabase.from("deals").insert({
        contact_id: contact.id,
        insurance_type: form.insurance_type,
        stage: "lead",
        lead_score: 50,
        assigned_to: userRes.user?.id ?? null,
        source_type: "crm_manual",
        notes: form.notes || null,
      });
      if (dErr) throw dErr;

      toast.success("Deal créé");
      onCreated();
      onOpenChange(false);
      setForm({
        full_name: "",
        email: "",
        phone: "",
        insurance_type: "auto",
        notes: "",
      });
    } catch (e: any) {
      toast.error("Impossible de créer le deal");
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nouveau deal</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3 py-2">
          <div className="grid gap-1.5">
            <Label htmlFor="fn">Nom complet</Label>
            <Input
              id="fn"
              value={form.full_name}
              onChange={(e) => set("full_name", e.target.value)}
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="em">Email</Label>
            <Input
              id="em"
              type="email"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="ph">Téléphone</Label>
            <Input
              id="ph"
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
            />
          </div>
          <div className="grid gap-1.5">
            <Label>Type d'assurance</Label>
            <Select
              value={form.insurance_type}
              onValueChange={(v) => set("insurance_type", v)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {INSURANCE_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="nt">Notes</Label>
            <Textarea
              id="nt"
              rows={3}
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button
            onClick={submit}
            disabled={saving}
            className="bg-[#7C3AED] hover:bg-[#6D28D9]"
          >
            {saving ? "Création…" : "Créer le deal"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
