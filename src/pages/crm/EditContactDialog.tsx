import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type Contact = {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  source: string | null;
  tags: string[] | null;
};

export function EditContactDialog({
  contact,
  open,
  onOpenChange,
  onSaved,
}: {
  contact: Contact | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState<Contact | null>(contact);
  const [saving, setSaving] = useState(false);

  useEffect(() => setForm(contact), [contact]);

  if (!form) return null;

  const save = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("contacts")
      .update({
        full_name: form.full_name || null,
        email: form.email.toLowerCase().trim(),
        phone: form.phone || null,
        source: form.source || null,
        tags: form.tags ?? [],
      })
      .eq("id", form.id);
    setSaving(false);
    if (error) return toast.error("Erreur : " + error.message);
    toast.success("Contact mis à jour");
    onOpenChange(false);
    onSaved();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Modifier le contact</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3 py-2">
          <div className="grid gap-1.5">
            <Label>Nom complet</Label>
            <Input value={form.full_name ?? ""} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
          </div>
          <div className="grid gap-1.5">
            <Label>Email</Label>
            <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div className="grid gap-1.5">
            <Label>Téléphone</Label>
            <Input value={form.phone ?? ""} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div className="grid gap-1.5">
            <Label>Source</Label>
            <Input value={form.source ?? ""} onChange={(e) => setForm({ ...form, source: e.target.value })} />
          </div>
          <div className="grid gap-1.5">
            <Label>Tags (séparés par une virgule)</Label>
            <Input
              value={(form.tags ?? []).join(", ")}
              onChange={(e) =>
                setForm({
                  ...form,
                  tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean),
                })
              }
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
          <Button onClick={save} disabled={saving} className="bg-[#7C3AED] hover:bg-[#6D28D9]">
            {saving ? "Enregistrement…" : "Enregistrer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
