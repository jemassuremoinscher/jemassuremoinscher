import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface Message { role: "user" | "assistant"; content: string; }
interface TransferDialogProps { isOpen: boolean; onClose: () => void; messages: Message[]; }

export const TransferDialog = ({ isOpen, onClose, messages }: TransferDialogProps) => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", reason: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const PHONE_REGEX = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || formData.name.trim().length < 2) { toast.error("Veuillez renseigner votre nom"); return; }
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) { toast.error("Email invalide"); return; }
    if (formData.phone && !PHONE_REGEX.test(formData.phone)) { toast.error("Numéro invalide"); return; }
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("chatbot_transfers").insert([{ visitor_email: formData.email, visitor_name: formData.name || null, visitor_phone: formData.phone || null, transfer_reason: formData.reason || null, conversation_history: JSON.parse(JSON.stringify(messages)), status: "pending" }]);
      if (error) throw error;
      await supabase.functions.invoke('send-quote-email', {
        body: { name: formData.name, email: formData.email, phone: formData.phone || '', type: 'Transfert chatbot', details: { source: 'chatbot_transfer', reason: formData.reason || '', messageCount: messages.length }, estimatedPrice: 0 },
      }).catch(err => console.error('Email notification error:', err));
      toast.success(t('transfer.successTitle'), { description: t('transfer.successDesc') });
      setFormData({ name: "", email: "", phone: "", reason: "" });
      onClose();
    } catch (error) {
      console.error("Error submitting transfer request:", error);
      toast.error(t('insPage.toast.error'));
    } finally { setIsSubmitting(false); }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t('transfer.title')}</DialogTitle>
          <DialogDescription>{t('transfer.desc')}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2"><Label htmlFor="name">{t('transfer.fullName')}</Label><Input id="name" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Jean Dupont" /></div>
          <div className="space-y-2"><Label htmlFor="email">{t('transfer.email')}</Label><Input id="email" type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="jean.dupont@example.com" /></div>
          <div className="space-y-2"><Label htmlFor="phone">{t('transfer.phone')}</Label><Input id="phone" type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="06 12 34 56 78" /></div>
          <div className="space-y-2"><Label htmlFor="reason">{t('transfer.reason')}</Label><Textarea id="reason" value={formData.reason} onChange={(e) => setFormData({ ...formData, reason: e.target.value })} placeholder={t('transfer.reasonPlaceholder')} rows={3} /></div>
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1" disabled={isSubmitting}>{t('transfer.cancel')}</Button>
            <Button type="submit" className="flex-1 bg-gradient-primary" disabled={isSubmitting}>
              {isSubmitting ? (<><Loader2 className="h-4 w-4 mr-2 animate-spin" />{t('transfer.sending')}</>) : t('transfer.submit')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};