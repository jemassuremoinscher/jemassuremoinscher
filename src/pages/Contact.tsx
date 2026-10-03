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
import ArthurHero from '@/components/insurance/ArthurHero';
import geoContent from '@/data/geo-content.json';
import { invokeSendQuoteEmail, preloadRecaptcha } from '@/lib/recaptcha';
import { reportSiteError } from '@/lib/siteErrorLog';
import { useAnalytics } from '@/hooks/useAnalytics';

// Même règle que validate_contact_callback() en base : 6 à 30 caractères.
// Caractères admis : chiffres, espaces, +, point, tiret.
const PHONE_RE = /^[0-9\s+.-]{6,30}$/;

// Horaires de rappel : ContactPoint.hoursAvailable (7j/7, 8h-19h), source
// unique geo-content.json. Pas d'openingHoursSpecification sur l'Organization.
const contactPageSchema = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  "url": "https://www.jemassuremoinscher.fr/contact",
  "mainEntity": {
    "@type": "Organization",
    "@id": "https://www.jemassuremoinscher.fr/#organization",
    "name": "jemassuremoinscher.fr",
    "url": "https://www.jemassuremoinscher.fr/",
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "url": "https://www.jemassuremoinscher.fr/contact",
      ...geoContent.contactHours.contactPointSchema,
    },
  },
};


const Contact = () => {
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const { trackConversion, trackEvent } = useAnalytics();
  const [formData, setFormData] = useState({ prenom: "", email: "", phone: "", sujet: "", message: "" });
  const [phoneError, setPhoneError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const phone = formData.phone.trim();
    if (!formData.prenom || !formData.email || !formData.sujet || !phone) {
      if (!phone) setPhoneError(t('contactPage.phoneRequired'));
      toast.error(t('quoteForm.toastErrorDesc'));
      return;
    }
    if (!PHONE_RE.test(phone)) {
      setPhoneError(t('contactPage.phoneInvalid'));
      return;
    }
    setPhoneError(null);
    setIsLoading(true);
    try {
      const { error } = await supabase.from("contact_callbacks").insert({
        full_name: formData.prenom,
        email: formData.email,
        phone,
        preferred_time: "morning",
        message: `${formData.sujet}${formData.message ? ` - ${formData.message}` : ""}`,
        status: "pending"
      });
      if (error) {
        // Le message technique (ex. règle de validation en base) va dans
        // site_error_log, jamais à l'écran.
        reportSiteError({ type: "callback_submit", message: `contact_callbacks : ${error.message}`, context: { code: error.code, source: "contact_page" } });
        throw error;
      }

      // Email interne à contact@ (et confirmation au prospect), avec jeton
      // reCAPTCHA. invokeSendQuoteEmail trace lui-même jeton manquant et
      // échec d'appel dans site_error_log ; l'envoi ne bloque pas l'écran.
      invokeSendQuoteEmail({
        name: formData.prenom,
        email: formData.email,
        phone,
        type: 'Demande de rappel',
        details: { source: 'contact_page', source_page: '/contact', sujet: formData.sujet, message: formData.message || '' },
        estimatedPrice: 0,
      }, 'contact_callback').catch((err) => {
        reportSiteError({ type: "edge_function", message: `send-quote-email (contact) : ${err instanceof Error ? err.message : String(err)}`, context: { source: "contact_page" } });
      });

      // Conversion Ads « Demande de devis » : même label et mêmes garde-fous
      // que le formulaire de devis (trackConversion).
      trackConversion('callback_request');
      trackEvent('callback_request', { category: 'lead_generation', label: 'contact_page' });

      toast.success(t('quoteForm.toastSuccess'));
      setFormData({ prenom: "", email: "", phone: "", sujet: "", message: "" });
    } catch (error) {
      console.error("Error submitting contact form:", error);
      toast.error(t('quoteForm.toastError'), { description: t('quoteForm.toastErrorDesc') });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <SEOOptimized
        title={t("seo.contact.title")}
        description={t("seo.contact.description")}
        canonical="https://www.jemassuremoinscher.fr/contact"
        jsonLd={contactPageSchema} />
      
      
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <Breadcrumbs items={[{ label: "Contact" }]} />
        
        <main id="main-content" className="flex-grow">
          <section className="relative pt-6 pb-10 md:pt-8 md:pb-14">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <ArthurHero
                  imageSrc={arthurThumbsUp}
                  imageAlt="Arthur mascotte jemassuremoinscher.fr - contactez-nous"
                  title={t('contactPage.title')}
                  subtitle={t('contactPage.subtitle')}
                  ctaLabel={t('contactPage.send')}
                  onCtaClick={() => {
                    document.getElementById('contact-prenom')?.focus();
                  }}
                  showSavingsCard={false}
                />
              </div>
            </div>
          </section>

          <div className="container mx-auto px-4 py-6 md:py-10">
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

                {/* reCAPTCHA préchargé au premier champ touché, pas au chargement de la page. */}
                <form onSubmit={handleSubmit} onFocus={preloadRecaptcha} className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="contact-prenom" className="sr-only">{t('contactPage.firstName')}</label>
                    <Input
                      id="contact-prenom"
                      type="text"
                      placeholder={t('contactPage.firstName')}
                      value={formData.prenom}
                      onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                      className="h-12 text-base rounded-2xl" />
                    
                  </div>
                  <div>
                    <label htmlFor="contact-email" className="sr-only">{t('contactPage.emailField')}</label>
                    <Input
                      id="contact-email"
                      type="email"
                      placeholder={t('contactPage.emailField')}
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="h-12 text-base rounded-2xl" />
                    
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="contact-phone" className="sr-only">{t('contactPage.phoneField')}</label>
                    <Input
                      id="contact-phone"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      placeholder={t('contactPage.phoneField')}
                      value={formData.phone}
                      aria-invalid={!!phoneError}
                      aria-describedby={phoneError ? 'contact-phone-error' : undefined}
                      onChange={(e) => {
                        setFormData({ ...formData, phone: e.target.value });
                        if (phoneError) setPhoneError(null);
                      }}
                      className={`h-12 text-base rounded-2xl ${phoneError ? 'border-destructive' : ''}`} />
                    {phoneError && (
                      <p id="contact-phone-error" role="alert" className="mt-1.5 text-sm text-destructive">{phoneError}</p>
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="contact-sujet" className="sr-only">{t('contactPage.subject')}</label>
                    <Input
                      id="contact-sujet"
                      type="text"
                      placeholder={t('contactPage.subject')}
                      value={formData.sujet}
                      onChange={(e) => setFormData({ ...formData, sujet: e.target.value })}
                      className="h-12 text-base rounded-2xl" />
                    
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="contact-message" className="sr-only">{t('contactPage.message')}</label>
                    <Textarea
                      id="contact-message"
                      placeholder={t('contactPage.message')}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="min-h-[120px] text-base rounded-2xl resize-none" />
                    
                  </div>
                  <div className="md:col-span-2">
                    <Button
                      type="submit"
                      disabled={isLoading}
                      size="lg"
                      className="w-full md:w-auto rounded-full font-bold px-10 text-base">
                      
                      {isLoading ?
                      <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          {t('contactPage.sending')}
                        </> :

                      <>
                          <Send className="mr-2 h-5 w-5" />
                          {t('contactPage.send')}
                        </>
                      }
                    </Button>
                    <p className="mt-3 text-sm font-medium text-foreground">{t('contactPage.callbackHours')}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {t('contactPage.legal')}{' '}
                      <a href="/politique-confidentialite" className="underline hover:text-primary">{t('contactPage.legalLink')}</a>.
                    </p>
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
                    <h3 className="font-bold text-foreground mb-1">Horaires de contact</h3>
                    <p className="text-sm text-muted-foreground">{t('contactPage.hoursValue')}</p>
                  </div>
                </div>
                <div className="glass-card p-6 rounded-[2rem] flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground mb-1">{t('contactPage.office')}</h3>
                    <p className="text-sm text-muted-foreground">06000 Nice</p>
                    <p className="text-sm text-muted-foreground">Service 100% en ligne</p>
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
                    className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold px-8 py-4 rounded-full text-lg transition-all duration-200 shadow-lg hover:shadow-xl">
                    
                    {t('insPage.compareNowBtn')}
                  </a>
                </div>
                <img
                  src={arthurFlying}
                  alt={t("a11y.contact.mascotAlt")}
                  className="absolute -top-10 right-4 md:right-12 h-16 sm:h-24 md:h-36 object-contain pointer-events-none select-none"
                  width={144}
                  height={144}
                  loading="lazy" />
                
              </div>

            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>);

};

export default Contact;