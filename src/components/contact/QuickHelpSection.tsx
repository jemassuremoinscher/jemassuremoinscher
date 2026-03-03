import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, Loader2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import arthurThinking from "@/assets/mascotte/arthur-thinking.png";
import { useLanguage } from "@/contexts/LanguageContext";

const PHONE_NUMBER = "+33493881684";
const PHONE_DISPLAY = "04 93 88 16 84";

const QuickHelpSection = () => {
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ prenom: "", email: "", sujet: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.prenom || !formData.email || !formData.sujet) { toast.error("Veuillez remplir tous les champs"); return; }
    setIsLoading(true);
    try {
      const { error } = await supabase.from("contact_callbacks").insert({
        full_name: formData.prenom, email: formData.email, phone: "", preferred_time: "morning", message: formData.sujet, status: "pending",
      });
      if (error) throw error;
      await supabase.functions.invoke('send-quote-email', {
        body: { name: formData.prenom, email: formData.email, phone: '', type: 'Contact rapide', details: { source: 'quick_help', message: formData.sujet }, estimatedPrice: 0 },
      }).catch(err => console.error('Email notification error:', err));
      toast.success("Message envoyé ! Nous vous répondons rapidement.");
      setFormData({ prenom: "", email: "", sujet: "" });
    } catch (error) {
      console.error("Error submitting contact form:", error);
      toast.error("Erreur. Veuillez réessayer.");
    } finally { setIsLoading(false); }
  };

  return (
    <section className="py-12 md:py-16 bg-background">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">{t('quickHelp.title')}</h2>
        </motion.div>
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="flex flex-col items-center gap-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="relative bg-white rounded-2xl shadow-lg p-4 max-w-[240px] border border-border/50">
              <p className="text-sm md:text-base font-medium text-foreground text-center">{t('quickHelp.bubble')}</p>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-r border-b border-border/50 transform rotate-45" />
            </motion.div>
            <img src={arthurThinking} alt="Arthur mascotte" className="w-36 h-36 md:w-44 md:h-44 object-contain drop-shadow-lg" />
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input type="text" placeholder={t('quickHelp.firstName')} value={formData.prenom} onChange={(e) => setFormData({ ...formData, prenom: e.target.value })} className="h-12 text-base bg-muted/30 border-border/50 focus:border-primary" />
              <Input type="email" placeholder={t('quickHelp.email')} value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="h-12 text-base bg-muted/30 border-border/50 focus:border-primary" />
              <Input type="text" placeholder={t('quickHelp.subject')} value={formData.sujet} onChange={(e) => setFormData({ ...formData, sujet: e.target.value })} className="h-12 text-base bg-muted/30 border-border/50 focus:border-primary" />
              <Button type="submit" disabled={isLoading} className="w-full h-12 text-base font-semibold active:scale-95 transition-transform">
                {isLoading ? (<><Loader2 className="mr-2 h-5 w-5 animate-spin" />{t('quickHelp.sending')}</>) : t('quickHelp.send')}
              </Button>
            </form>
          </motion.div>
        </div>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="mt-10 flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
          <Button asChild size="lg" className="flex-1 h-14 text-base font-semibold bg-[#4CAF50] hover:bg-[#43A047] text-white active:scale-95 transition-transform">
            <a href={`tel:${PHONE_NUMBER}`}><Phone className="mr-2 h-5 w-5" />{PHONE_DISPLAY}</a>
          </Button>
          <Button asChild size="lg" className="flex-1 h-14 text-base font-semibold bg-[#25D366] hover:bg-[#20BD5A] text-white active:scale-95 transition-transform">
            <a href={`https://wa.me/${PHONE_NUMBER.replace('+', '')}?text=Bonjour`} target="_blank" rel="noopener noreferrer"><MessageCircle className="mr-2 h-5 w-5" />WhatsApp</a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default QuickHelpSection;