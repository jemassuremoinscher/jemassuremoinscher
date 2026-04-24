import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Euro, Clock } from "lucide-react";
import { useRef } from "react";
import SEOOptimized from "@/components/SEOOptimized";
import { addServiceSchema, addFAQSchema, addBreadcrumbSchema, addInsuranceProductSchema } from "@/utils/seoUtils";
import arthurIdea from "@/assets/mascotte/arthur-idea.webp";
import ArthurHero from "@/components/insurance/ArthurHero";
import InsuranceSEOTabs from "@/components/insurance/InsuranceSEOTabs";
import ProductGuaranteeTable from "@/components/insurance/ProductGuaranteeTable";
import InsuranceBottomHub from "@/components/insurance/InsuranceBottomHub";
import EnBref from "@/components/seo/EnBref";
import BrandName from "@/components/BrandName";
import arthurFlying from "@/assets/mascotte/arthur-pointing.webp";
import { useLanguage } from "@/contexts/LanguageContext";
import Breadcrumbs from "@/components/Breadcrumbs";
import DynamicUpdateDate from "@/components/DynamicUpdateDate";
import { MultiStepQuoteForm } from "@/components/forms/MultiStepQuoteForm";

const AssuranceVie = () => {
  const { t } = useLanguage();
  const formRef = useRef<HTMLDivElement>(null);
  const scrollToForm = () => { formRef.current?.scrollIntoView({ behavior: 'smooth' }); };

  const breadcrumbSchema = addBreadcrumbSchema([{ name: "Accueil", url: "https://www.jemassuremoinscher.fr/" }, { name: "Assurance Vie", url: "https://www.jemassuremoinscher.fr/assurance-vie" }]);
  const serviceSchema = addServiceSchema({ name: "Comparateur Assurance Vie", description: "Comparez les contrats d'assurance vie pour l'épargne et la protection.", provider: "jemassuremoinscher.fr", areaServed: "France" });
  
  const faqSchema = addFAQSchema([{ question: t('viePage.faq1.q'), answer: t('viePage.faq1.a') }, { question: t('viePage.faq2.q'), answer: t('viePage.faq2.a') }]);
  const insuranceProductSchema = addInsuranceProductSchema({ name: "Assurance Vie", description: "Comparateur d'assurance vie. Fonds euros, unités de compte, PER : comparez les meilleurs rendements 2026.", category: "Assurance Vie", url: "https://www.jemassuremoinscher.fr/assurance-vie", ratingValue: 4.6, reviewCount: 1124 });
  const advantages = [
    { icon: Euro, title: t('viePage.adv1.title'), description: t('viePage.adv1.desc') },
    { icon: Clock, title: t('insPage.quoteIn2min'), description: t('insPage.quoteIn2minDesc') },
    { icon: Shield, title: t('viePage.adv2.title'), description: t('viePage.adv2.desc') }
  ];

  return (
    <div className="min-h-screen">
      <SEOOptimized title="Assurance Vie [Month] : Meilleurs Rendements" description="Fonds euros, unités de compte, PER : comparez les meilleures assurances vie. Fiscalité avantageuse après 8 ans. Devis gratuit." keyword="assurance vie meilleur rendement" keywords="assurance vie 2026, épargne, placement, transmission patrimoine, PER" canonical="https://www.jemassuremoinscher.fr/assurance-vie" jsonLd={[breadcrumbSchema, serviceSchema, faqSchema, insuranceProductSchema]} />
      <Header />
      <Breadcrumbs items={[{ label: "Assurance Vie" }]} />
      <main id="main-content">
      <section className="bg-gradient-to-br from-primary/5 to-primary/10 py-16 relative overflow-hidden">
        <div className="container mx-auto px-4"><div className="max-w-4xl mx-auto text-center relative">
          <ArthurHero imageSrc={arthurIdea} imageAlt="Arthur réfléchit - assurance vie" speechText={t('viePage.subtitle')} />
          <h1 className="text-4xl md:text-5xl font-bold text-accent mb-6">{t('viePage.title')}</h1>
          <Button size="lg" onClick={scrollToForm} className="text-lg px-8 py-6" aria-label="Comparer les assurances vie maintenant">{t('insPage.compareNow')}</Button>
        </div></div>
      </section>
      <div className="container mx-auto px-4 py-12">
        <DynamicUpdateDate />

        <section className="max-w-4xl mx-auto mb-12"><div className="grid md:grid-cols-3 gap-6">{advantages.map((item, index) => (<Card key={index} className="p-6 text-center"><div className="flex justify-center mb-4"><div className="p-3 rounded-full bg-primary/10"><item.icon className="h-8 w-8 text-primary" /></div></div><h2 className="font-bold text-lg mb-2">{item.title}</h2><p className="text-muted-foreground text-sm">{item.description}</p></Card>))}</div></section>
        <div ref={formRef} className="mb-16 min-h-[480px]"><MultiStepQuoteForm insuranceType="vie" /></div>

        <ProductGuaranteeTable product="vie" />

        <InsuranceSEOTabs
          faqTitle={t('insPage.faqTitle')}
          faqs={[
            { question: t('viePage.faq1.q'), answer: t('viePage.faq1.a') },
            { question: t('viePage.faq2.q'), answer: t('viePage.faq2.a') },
            { question: t('viePage.faq3.q'), answer: t('viePage.faq3.a') },
          ]}
        />

        <InsuranceBottomHub
          currentPage="vie"
          enBref={
            <EnBref facts={[
              <><BrandName /> compare les contrats d'assurance vie des meilleurs assureurs.</>,
              "Fonds euros, unités de compte, PER : toutes les options comparées.",
              "Fiscalité avantageuse après 8 ans de détention.",
              "Devis gratuit et personnalisé, sans engagement.",
            ]} />
          }
          ctaTitle={t('viePage.ctaTitle')}
          ctaDescription={t('viePage.ctaDesc')}
          ctaButtonLabel={t('insPage.compareNowBtn')}
          ctaMascotSrc={arthurFlying}
          ctaMascotAlt="Arthur - assurance vie"
          onCtaClick={scrollToForm}
        />
      </div>
      </main>
      <Footer />
    </div>
  );
};

export default AssuranceVie;
