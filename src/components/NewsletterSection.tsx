import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useLanguage } from "@/contexts/LanguageContext";

export const NewsletterSection = () => {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { trackEvent, trackConversion } = useAnalytics();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { toast.error("Email invalide"); return; }
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("newsletter-subscribe", { body: { email } });
      if (error) throw error;
      if (data?.success) { setIsSubscribed(true); setEmail(""); toast.success("Presque terminé !", { description: data.message }); trackConversion('newsletter_signup'); trackEvent('newsletter_signup', { category: 'engagement' }); }
      else { toast.error(t('insPage.toast.error'), { description: data?.message }); }
    } catch (error: any) { console.error("Newsletter subscription error:", error); toast.error(t('insPage.toast.error')); }
    finally { setIsLoading(false); }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-primary/95 via-primary to-primary/90 relative overflow-hidden">
      <div className="absolute top-10 right-10 w-72 h-72 bg-accent/20 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/10 rounded-full blur-3xl" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-accent/30 backdrop-blur-sm mb-6 animate-float shadow-lg"><Mail className="h-10 w-10 text-accent" /></div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-primary-foreground mb-6 leading-tight">
            {t('newsletter.title')}<br /><span className="text-accent">{t('newsletter.titleHighlight')}</span>
          </h2>
          <p className="text-xl text-primary-foreground/95 mb-10 max-w-2xl mx-auto leading-relaxed">
            {t('newsletter.desc')}<br /><span className="font-bold text-accent">{t('newsletter.freeNoSpam')}</span>
          </p>
          {isSubscribed ? (
            <div className="bg-card/95 backdrop-blur-md border-2 border-accent rounded-3xl p-10 shadow-2xl animate-scale-in max-w-2xl mx-auto">
              <div className="flex flex-col items-center gap-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-accent to-accent/80 flex items-center justify-center shadow-lg animate-pulse"><Check className="h-10 w-10 text-accent-foreground" /></div>
                <h3 className="text-3xl font-bold text-foreground">{t('newsletter.checkEmail')}</h3>
                <p className="text-muted-foreground text-lg leading-relaxed">{t('newsletter.confirmationSent')}</p>
                <Button variant="outline" onClick={() => setIsSubscribed(false)} className="mt-4 border-2">{t('newsletter.otherEmail')}</Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
              <div className="flex-1">
                <label htmlFor="newsletter-email" className="sr-only">{t('newsletter.title')}</label>
                <Input id="newsletter-email" type="email" placeholder="votre@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className="h-16 px-6 text-lg bg-card/95 backdrop-blur-sm border-2 border-transparent focus:border-accent transition-all shadow-lg rounded-xl w-full" disabled={isLoading} aria-required="true" />
              </div>
              <Button type="submit" size="lg" className="h-16 px-10 text-lg bg-accent hover:bg-accent/90 text-accent-foreground font-bold shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 rounded-xl" disabled={isLoading} aria-label="S'inscrire à la newsletter">
                {isLoading ? (<><Loader2 className="mr-2 h-5 w-5 animate-spin" aria-hidden="true" />{t('newsletter.subscribing')}</>) : (<><Mail className="mr-2 h-5 w-5" aria-hidden="true" />{t('newsletter.subscribe')}</>)}
              </Button>
            </form>
          )}
          <div className="flex items-center justify-center gap-6 mt-8 text-primary-foreground/80 text-sm">
            <span>{t('newsletter.noCommitment')}</span>
            <span>{t('newsletter.oneClickUnsub')}</span>
            <span>{t('newsletter.secureData')}</span>
          </div>
        </div>
      </div>
    </section>
  );
};