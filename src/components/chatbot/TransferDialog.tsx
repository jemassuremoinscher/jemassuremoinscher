import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface TransferDialogProps {
  isOpen: boolean;
  onClose: () => void;
  messages: Message[];
}

export const TransferDialog = ({ isOpen, onClose, messages }: TransferDialogProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    reason: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("chatbot_transfers").insert([{
        visitor_email: formData.email,
        visitor_name: formData.name || null,
        visitor_phone: formData.phone || null,
        transfer_reason: formData.reason || null,
        conversation_history: JSON.parse(JSON.stringify(messages)),
        status: "pending",
      }]);

      if (error) throw error;

      toast.success("Demande envoyée !", {
        description: "Un conseiller va vous contacter sous peu.",
      });

      // Reset form
      setFormData({ name: "", email: "", phone: "", reason: "" });
      onClose();
    } catch (error) {
      console.error("Error submitting transfer request:", error);
      toast.error("Erreur", {
        description: "Impossible d'envoyer la demande. Veuillez réessayer.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Parler à un conseiller</DialogTitle>
          <DialogDescription>
            Un conseiller humain prendra contact avec vous dans les plus brefs délais.
            Horaires : Lundi-Vendredi, 9h-18h
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom complet *</Label>
            <Input
              id="name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Jean Dupont"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="jean.dupont@example.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Téléphone</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="06 12 34 56 78"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Motif de la demande (optionnel)</Label>
            <Textarea
              id="reason"
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              placeholder="Décrivez brièvement votre besoin..."
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Envoi...
                </>
              ) : (
                "Demander un transfert"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
