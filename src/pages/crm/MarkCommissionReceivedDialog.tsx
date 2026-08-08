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
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";
import { markCommissionReceived } from "@/lib/commissionsApi";
import type { CommissionPaymentRow } from "@/types/commissions";

const today = () => new Date().toISOString().slice(0, 10);

export function MarkCommissionReceivedDialog({
  payment,
  onUpdated,
}: {
  payment: CommissionPaymentRow;
  onUpdated: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [amountReceived, setAmountReceived] = useState(String(payment.amount_expected ?? ""));
  const [receivedAt, setReceivedAt] = useState(today());
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    const amount = Number(amountReceived);
    if (!amountReceived || Number.isNaN(amount)) {
      toast.error("Montant invalide");
      return;
    }
    setSaving(true);
    try {
      await markCommissionReceived(payment.id, { amount_received: amount, received_at: receivedAt });
      toast.success("Commission marquée comme reçue");
      setOpen(false);
      onUpdated();
    } catch (e) {
      toast.error("Erreur lors de la mise à jour");
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="rounded-full border-[#E9D5FF] dark:border-[#362B54]">
          <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
          Marquer reçue
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Marquer la commission reçue</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3 py-2">
          <div className="grid gap-1.5">
            <Label htmlFor="comm-amount">Montant reçu (€)</Label>
            <Input
              id="comm-amount"
              type="number"
              min="0"
              step="0.01"
              value={amountReceived}
              onChange={(e) => setAmountReceived(e.target.value)}
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="comm-date">Date de réception</Label>
            <Input
              id="comm-date"
              type="date"
              value={receivedAt}
              onChange={(e) => setReceivedAt(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Annuler
          </Button>
          <Button onClick={submit} disabled={saving} className="bg-[#7C3AED] hover:bg-[#6D28D9]">
            {saving ? "Enregistrement…" : "Confirmer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
