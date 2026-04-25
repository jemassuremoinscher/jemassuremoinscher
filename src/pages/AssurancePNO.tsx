import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Home, Clock } from "lucide-react";
import { useRef } from "react";
import SEOOptimized from "@/components/SEOOptimized";
import { addServiceSchema, addFAQSchema, addBreadcrumbSchema, addInsuranceProductSchema } from "@/utils/seoUtils";
import arthurHouse from "@/assets/mascotte/arthur-house.webp";
import ArthurHero from "@/components/insurance/ArthurHero";
import InsuranceSEOTabs from "@/components/insurance/InsuranceSEOTabs";
import ProductGuaranteeTable from "@/components/insurance/ProductGuaranteeTable";
import CourtierValueCards from "@/components/insurance/CourtierValueCards";
import InsuranceBottomHub from "@/components/insurance/InsuranceBottomHub";
import arthurFlying from "@/assets/mascotte/arthur-welcome.webp";
import { useLanguage } from "@/contexts/LanguageContext";
import Breadcrumbs from "@/components/Breadcrumbs";
import DynamicUpdateDate from "@/components/DynamicUpdateDate";
import { MultiStepQuoteForm } from "@/components/forms/MultiStepQuoteForm";

const AssurancePNO = () => {
  const { t } = useLanguage();
  const formRef = useRef<HTMLDivElement>(null);
  const scrollToForm = () => { formRef.current?.scrollIntoView({ behavior: 'smooth' }); };

  const breadcrumbSchema = addBreadcrumbSchema([{ name: "Accueil", url: "https://www.jemassuremoinscher.fr/" }, { name: "Assurance PNO", url: "https://www.jemassuremoinscher.fr/assurance-pno" }]);
  const serviceSchema = addServiceSchema({ name: "Comparateur Assurance PNO", description: "Comparez les assurances PNO pour protéger votre bien immobilier.", provider: "jemassuremoinscher.fr", areaServed: "France" });
  const faqSchema = addFAQSchema([{ question: t('pnoPage.faq1.q'), answer: t('pnoPage.faq1.a') }, { question: t('pnoPage.faq2.q'), answer: t('pnoPage.faq2.a') }, { question: t('pnoPage.faq3.q'), answer: t('pnoPage.faq3.a') }]);
  const insuranceProductSchema = addInsuranceProductSchema({ name: "PNO Assurance", description: "Comparateur d'assurance propriétaire non occupant. Obligatoire en copropriété (loi Alur). Dès 5€/mois.", category: "Assurance PNO", url: "https://www.jemassuremoinscher.fr/assurance-pno" });
  const advantages = [
    { icon: Home, title: t('pnoPage.adv1.title'), description: t('pnoPage.adv1.desc') },
    { icon: Clock, title: t('insPage.quoteIn2min'), description: t('insPage.quoteIn2minDesc') },
    { icon: Shield, title: t('pnoPage.adv2.title'), description: t('pnoPage.adv2.desc') }
  ];

  return (
    <div className="min-h-screen">
      <SEOOptimized title="PNO Assurance dès 5€/mois [Month] | Copropriété" description="PNO assurance : comparez les assurances propriétaire non occupant. Obligatoire en copropriété (loi Alur). 50+ assureurs comparés. Devis gratuit." keyword="PNO assurance" keywords="pno assurance, assurance PNO, propriétaire non occupant, assurance logement vide, PNO obligatoire, assurance bailleur" canonical="https://www.jemassuremoinscher.fr/assurance-pno" jsonLd={[breadcrumbSchema, serviceSchema, faqSchema, insuranceProductSchema]} />
      <Header />
      <Breadcrumbs items={[{ label: "Assurance PNO" }]} />
      <main id="main-content">
      <section className="bg-gradient-to-br from-primary/5 to-primary/10 py-16 relative overflow-hidden">
        <div className="container mx-auto px-4"><div className="max-w-4xl mx-auto text-center relative">
          <ArthurHero imageSrc={arthurHouse} imageAlt="Arthur - PNO" speechText={t('pnoPage.subtitle')} />
          <h1 className="text-4xl md:text-5xl font-bold text-accent mb-6">PNO Assurance : Comparez et Économisez dès 5€/mois</h1>
          <Button size="lg" onClick={scrollToForm} className="text-lg px-8 py-6" aria-label="Comparer les assurances PNO maintenant">{t('insPage.compareNow')}</Button>
        </div></div>
      </section>
      <div className="container mx-auto px-4 py-12">
        <DynamicUpdateDate />

        <section className="max-w-4xl mx-auto mb-12"><div className="grid md:grid-cols-3 gap-6">{advantages.map((item, index) => (<Card key={index} className="p-6 text-center"><div className="flex justify-center mb-4"><div className="p-3 rounded-full bg-primary/10"><item.icon className="h-8 w-8 text-primary" /></div></div><h2 className="font-bold text-lg mb-2">{item.title}</h2><p className="text-muted-foreground text-sm">{item.description}</p></Card>))}</div></section>
        <div ref={formRef} className="mb-16 min-h-[480px]"><MultiStepQuoteForm insuranceType="pno" /></div>

        <ProductGuaranteeTable product="pno" />

        <CourtierValueCards product="pno" />

        <InsuranceSEOTabs
          faqTitle={t('insPage.faqTitle')}
          faqs={[
            { question: t('pnoPage.faq1.q'), answer: t('pnoPage.faq1.a') },
            { question: t('pnoPage.faq2.q'), answer: t('pnoPage.faq2.a') },
            { question: t('pnoPage.faq3.q'), answer: t('pnoPage.faq3.a') },
          ]}
        />

        <InsuranceBottomHub
          currentPage="pno"
          ctaTitle={t('pnoPage.ctaTitle')}
          ctaDescription={t('pnoPage.ctaDesc')}
          ctaButtonLabel={t('insPage.compareNowBtn')}
          ctaMascotSrc={arthurFlying}
          ctaMascotAlt="Arthur - PNO"
          onCtaClick={scrollToForm}
        />
      </div>
      </main>
      <Footer />
    </div>
  );
};

export default AssurancePNO;
