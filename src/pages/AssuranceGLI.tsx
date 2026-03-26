import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Euro, Clock } from "lucide-react";
import { useRef } from "react";
import SEOOptimized from "@/components/SEOOptimized";
import { addServiceSchema, addFAQSchema, addBreadcrumbSchema, addInsuranceProductSchema } from "@/utils/seoUtils";
import arthurDetective from "@/assets/mascotte/arthur-detective.webp";
import ArthurHero from "@/components/insurance/ArthurHero";
import InsuranceSEOTabs from "@/components/insurance/InsuranceSEOTabs";
import InsuranceBottomHub from "@/components/insurance/InsuranceBottomHub";
import arthurFlying from "@/assets/mascotte/arthur-question.webp";
import { useLanguage } from "@/contexts/LanguageContext";
import Breadcrumbs from "@/components/Breadcrumbs";
import DynamicUpdateDate from "@/components/DynamicUpdateDate";
import { MultiStepQuoteForm } from "@/components/forms/MultiStepQuoteForm";

const AssuranceGLI = () => {
  const { t } = useLanguage();
  const formRef = useRef<HTMLDivElement>(null);
  const scrollToForm = () => { formRef.current?.scrollIntoView({ behavior: 'smooth' }); };

  const breadcrumbSchema = addBreadcrumbSchema([{ name: "Accueil", url: "https://www.jemassuremoinscher.fr/" }, { name: "Garantie Loyer Impayé", url: "https://www.jemassuremoinscher.fr/assurance-gli" }]);
  const serviceSchema = addServiceSchema({ name: "Comparateur GLI", description: "Protégez vos revenus locatifs avec une assurance GLI." });
  const faqSchema = addFAQSchema([{ question: t('gliPage.faq1.q'), answer: t('gliPage.faq1.a') }, { question: t('gliPage.faq2.q'), answer: t('gliPage.faq2.a') }, { question: t('gliPage.faq3.q'), answer: t('gliPage.faq3.a') }]);
  const insuranceProductSchema = addInsuranceProductSchema({ name: "Garantie Loyer Impayé", description: "Comparateur GLI. Protégez vos revenus locatifs contre les impayés et dégradations.", category: "Assurance Loyer Impayé", url: "https://www.jemassuremoinscher.fr/assurance-gli" });
  const advantages = [
    { icon: Euro, title: t('gliPage.adv1.title'), description: t('gliPage.adv1.desc') },
    { icon: Clock, title: t('insPage.quoteIn2min'), description: t('insPage.quoteIn2minDesc') },
    { icon: Shield, title: t('gliPage.adv2.title'), description: t('gliPage.adv2.desc') }
  ];

  return (
    <div className="min-h-screen">
      <SEOOptimized title="GLI : Garantie Loyer Impayé dès 2,5% du Loyer" description="Loyers impayés, dégradations, frais juridiques : sécurisez vos revenus locatifs. Comparez les GLI de 50+ assureurs. Devis gratuit." keyword="garantie loyer impayé" keywords="assurance GLI, protection bailleur, assurance loyer impayé, GLI comparateur" canonical="https://www.jemassuremoinscher.fr/assurance-gli" jsonLd={[breadcrumbSchema, serviceSchema, faqSchema, insuranceProductSchema]} />
      <Header />
      <Breadcrumbs items={[{ label: "Garantie Loyer Impayé" }]} />
      <main id="main-content">
      <section className="bg-gradient-to-br from-primary/5 to-primary/10 py-16 relative overflow-hidden">
        <div className="container mx-auto px-4"><div className="max-w-4xl mx-auto text-center relative">
          <ArthurHero imageSrc={arthurDetective} imageAlt="Arthur détective - GLI" speechText={t('gliPage.subtitle')} />
          <h1 className="text-4xl md:text-5xl font-bold text-accent mb-6">{t('gliPage.title')}</h1>
          <Button size="lg" onClick={scrollToForm} className="text-lg px-8 py-6" aria-label="Comparer les garanties loyer impayé maintenant">{t('insPage.compareNow')}</Button>
        </div></div>
      </section>
      <div className="container mx-auto px-4 py-12">
        <DynamicUpdateDate />

        <section className="max-w-4xl mx-auto mb-12"><div className="grid md:grid-cols-3 gap-6">{advantages.map((item, index) => (<Card key={index} className="p-6 text-center"><div className="flex justify-center mb-4"><div className="p-3 rounded-full bg-primary/10"><item.icon className="h-8 w-8 text-primary" /></div></div><h2 className="font-bold text-lg mb-2">{item.title}</h2><p className="text-muted-foreground text-sm">{item.description}</p></Card>))}</div></section>
        <div ref={formRef} className="mb-16 min-h-[480px]"><MultiStepQuoteForm insuranceType="gli" /></div>

        <InsuranceSEOTabs
          faqTitle={t('insPage.faqTitle')}
          faqs={[
            { question: t('gliPage.faq1.q'), answer: t('gliPage.faq1.a') },
            { question: t('gliPage.faq2.q'), answer: t('gliPage.faq2.a') },
            { question: t('gliPage.faq3.q'), answer: t('gliPage.faq3.a') },
          ]}
        />

        <InsuranceBottomHub
          currentPage="gli"
          ctaTitle={t('gliPage.ctaTitle')}
          ctaDescription={t('gliPage.ctaDesc')}
          ctaButtonLabel={t('insPage.compareNowBtn')}
          ctaMascotSrc={arthurFlying}
          ctaMascotAlt="Arthur - GLI"
          onCtaClick={scrollToForm}
        />
      </div>
      </main>
      <Footer />
    </div>
  );
};

export default AssuranceGLI;
