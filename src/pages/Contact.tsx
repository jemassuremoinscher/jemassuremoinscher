import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEOOptimized from '@/components/SEOOptimized';
import { Mail, Clock, MapPin, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import arthurThumbsUp from '@/assets/mascotte/arthur-thumbs-up.png';
import arthurFlying from '@/assets/mascotte/arthur-flying.png';
import Breadcrumbs from '@/components/Breadcrumbs';


const Contact = () => {
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ prenom: "", email: "", sujet: "", message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.prenom || !formData.email || !formData.sujet) {
      toast.error(t('quoteForm.toastErrorDesc'));
      return;
    }
    setIsLoading(true);
    try {
      const { error } = await supabase.from("contact_callbacks").insert({
        full_name: formData.prenom,
        email: formData.email,
        phone: "",
        preferred_time: "morning",
        message: `${formData.sujet}${formData.message ? ` - ${formData.message}` : ""}`,
        status: "pending",
      });
      if (error) throw error;
      toast.success(t('quoteForm.toastSuccess'));
      setFormData({ prenom: "", email: "", sujet: "", message: "" });
    } catch (error) {
      console.error("Error submitting contact form:", error);
      toast.error(t('quoteForm.toastError'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <SEOOptimized 
        title="Contactez-nous | jemassuremoinscher.fr"
        description="Besoin d'aide ? Contactez-nous par email ou formulaire. Réponse sous 2h."
        canonical="https://www.jemassuremoinscher.fr/contact"
      />
      
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <Breadcrumbs items={[{ label: "Contact" }]} />
        
        <main id="main-content" className="flex-grow">
          {/* Hero */}
          <section className="relative bg-gradient-to-br from-primary via-primary/90 to-primary/80 overflow-hidden">
            <div className="container mx-auto px-4 py-14 md:py-20">
              <div className="max-w-[65%] sm:max-w-[70%] md:max-w-2xl relative z-10">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                  {t('contactPage.title')}
                </h1>
                <p className="text-base md:text-lg text-white/80 leading-relaxed">
                  {t('contactPage.subtitle')}
                </p>
              </div>
              <img
                src={arthurThumbsUp}
                alt="Arthur mascotte jemassuremoinscher - contactez-nous"
                className="absolute right-4 md:right-12 bottom-0 h-24 sm:h-32 md:h-48 lg:h-56 object-contain opacity-90 pointer-events-none select-none"
                width={224}
                height={280}
                loading="lazy"
              />
            </div>
          </section>

          <div className="container mx-auto px-4 py-10 md:py-14">
            <div className="max-w-5xl mx-auto space-y-10">

              {/* Contact card */}
              <div className="max-w-md mx-auto">
                <a href="mailto:contact@jemassuremoinscher.fr" className="glass-card p-6 rounded-[2rem] text-center hover:shadow-[var(--shadow-hover)] transition-all duration-300 group block">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-bold text-foreground mb-1">{t('contactPage.email')}</h3>
                  <p className="text-primary font-semibold text-sm">contact@jemassuremoinscher.fr</p>
                  <p className="text-xs text-muted-foreground mt-1">{t('contactPage.emailDelay')}</p>
                </a>
              </div>

              {/* Form section */}
              <div className="glass-card p-8 md:p-10 rounded-[2rem]">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">{t('contactPage.formTitle')}</h2>
                <p className="text-muted-foreground mb-8">{t('contactPage.formDesc')}</p>

                <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="contact-prenom" className="sr-only">{t('contactPage.firstName')}</label>
                    <Input
                      id="contact-prenom"
                      type="text"
                      placeholder={t('contactPage.firstName')}
                      value={formData.prenom}
                      onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                      className="h-12 text-base rounded-2xl"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-email" className="sr-only">{t('contactPage.emailField')}</label>
                    <Input
                      id="contact-email"
                      type="email"
                      placeholder={t('contactPage.emailField')}
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="h-12 text-base rounded-2xl"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="contact-sujet" className="sr-only">{t('contactPage.subject')}</label>
                    <Input
                      id="contact-sujet"
                      type="text"
                      placeholder={t('contactPage.subject')}
                      value={formData.sujet}
                      onChange={(e) => setFormData({ ...formData, sujet: e.target.value })}
                      className="h-12 text-base rounded-2xl"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="contact-message" className="sr-only">{t('contactPage.message')}</label>
                    <Textarea
                      id="contact-message"
                      placeholder={t('contactPage.message')}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="min-h-[120px] text-base rounded-2xl resize-none"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Button
                      type="submit"
                      disabled={isLoading}
                      size="lg"
                      className="w-full md:w-auto rounded-full font-bold px-10 text-base"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          {t('contactPage.sending')}
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-5 w-5" />
                          {t('contactPage.send')}
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </div>

              {/* Info row */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="glass-card p-6 rounded-[2rem] flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground mb-1">{t('contactPage.hours')}</h3>
                    <p className="text-sm text-muted-foreground">{t('contactPage.weekdays')}</p>
                    <p className="text-sm text-muted-foreground">{t('contactPage.saturday')}</p>
                  </div>
                </div>
                <div className="glass-card p-6 rounded-[2rem] flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground mb-1">{t('contactPage.office')}</h3>
                    <p className="text-sm text-muted-foreground">Paris, France</p>
                    <p className="text-sm text-muted-foreground">{t('contactPage.onlineService')}</p>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="relative bg-gradient-to-r from-primary to-primary/80 rounded-[2rem] p-8 md:p-12 text-center overflow-visible">
                <div className="relative z-10">
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                    {t('contactPage.quickQuote')}
                  </h2>
                  <p className="text-white/80 mb-6 max-w-xl mx-auto">
                    {t('contactPage.quickQuoteDesc')}
                  </p>
                  <a
                    href="/comparateur"
                    className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold px-8 py-4 rounded-full text-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    {t('insPage.compareNowBtn')}
                  </a>
                </div>
                <img
                  src={arthurFlying}
                  alt="Arthur en vol - comparer vos assurances gratuitement"
                  className="absolute -top-10 right-4 md:right-12 h-16 sm:h-24 md:h-36 object-contain pointer-events-none select-none"
                  width={144}
                  height={144}
                  loading="lazy"
                />
              </div>

            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Contact;
