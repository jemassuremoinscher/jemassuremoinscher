import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Shield, Heart, Clock } from "lucide-react";
import { useRef } from "react";
import SEOOptimized from "@/components/SEOOptimized";
import { addServiceSchema, addFAQSchema, addBreadcrumbSchema, addInsuranceProductSchema } from "@/utils/seoUtils";
import arthurInjured from "@/assets/mascotte/arthur-injured.webp";
import ArthurHero from "@/components/insurance/ArthurHero";
import InsuranceSEOTabs from "@/components/insurance/InsuranceSEOTabs";
import ProductGuaranteeTable from "@/components/insurance/ProductGuaranteeTable";
import CourtierValueCards from "@/components/insurance/CourtierValueCards";
import InsuranceBottomHub from "@/components/insurance/InsuranceBottomHub";
import EnBref from "@/components/seo/EnBref";
import BrandName from "@/components/BrandName";
import arthurFlying from "@/assets/mascotte/arthur-confident.webp";
import { useLanguage } from "@/contexts/LanguageContext";
import Breadcrumbs from "@/components/Breadcrumbs";
import { MultiStepQuoteForm } from "@/components/forms/MultiStepQuoteForm";

const AssurancePrevoyance = () => {
  const { t } = useLanguage();
  const formRef = useRef<HTMLDivElement>(null);
  const scrollToForm = () => { formRef.current?.scrollIntoView({ behavior: 'smooth' }); };

  const breadcrumbSchema = addBreadcrumbSchema([{ name: "Accueil", url: "https://www.jemassuremoinscher.fr/" }, { name: "Assurance Prévoyance", url: "https://www.jemassuremoinscher.fr/assurance-prevoyance" }]);
  const serviceSchema = addServiceSchema({ name: "Comparateur Assurance Prévoyance", description: "Comparez les meilleures assurances prévoyance.", provider: "jemassuremoinscher.fr", areaServed: "France" });
  const faqSchema = addFAQSchema([{ question: t('prevoyancePage.faq1.q'), answer: t('prevoyancePage.faq1.a') }, { question: t('prevoyancePage.faq2.q'), answer: t('prevoyancePage.faq2.a') }]);
  const insuranceProductSchema = addInsuranceProductSchema({ name: "Assurance Prévoyance", description: "Comparateur d'assurance prévoyance. Décès, invalidité, obsèques : protégez votre famille.", category: "Assurance Prévoyance", url: "https://www.jemassuremoinscher.fr/assurance-prevoyance" });
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "url": "https://www.jemassuremoinscher.fr/assurance-prevoyance",
    "dateModified": "2026-09-26",
  };

  const advantages = [
    { icon: Heart, title: t('prevoyancePage.adv1.title'), description: t('prevoyancePage.adv1.desc') },
    { icon: Clock, title: t('insPage.quoteIn2min'), description: t('insPage.quoteIn2minDesc') },
    { icon: Shield, title: t('prevoyancePage.adv2.title'), description: t('prevoyancePage.adv2.desc') }
  ];

  return (
    <div className="min-h-screen">
      <SEOOptimized title={t("seo.prevoyance.title")} description={t("seo.prevoyance.description")} keyword="assurance prévoyance" keywords="assurance décès, assurance obsèques, dépendance, prévoyance TNS" canonical="https://www.jemassuremoinscher.fr/assurance-prevoyance" jsonLd={[webPageSchema, breadcrumbSchema, serviceSchema, faqSchema, insuranceProductSchema]} />
      <Header />
      <Breadcrumbs items={[{ label: "Assurance Prévoyance" }]} />
      <main id="main-content">
      <section className="relative pt-6 pb-10 md:pt-8 md:pb-14">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <ArthurHero
              imageSrc={arthurInjured}
              imageAlt="Arthur blessé - prévoyance"
              title={t('prevoyancePage.title')}
              subtitle={t('prevoyancePage.subtitle')}
              ctaLabel={t('insPage.compareNow')}
              onCtaClick={scrollToForm}
            />
          </div>
        </div>
      </section>
      <div className="container mx-auto px-4 py-12">

        <section className="max-w-4xl mx-auto mb-12"><div className="grid md:grid-cols-3 gap-6">{advantages.map((item, index) => (<Card key={index} className="p-6 text-center"><div className="flex justify-center mb-4"><div className="p-3 rounded-full bg-primary/10"><item.icon className="h-8 w-8 text-primary" /></div></div><h2 className="font-bold text-lg mb-2">{item.title}</h2><p className="text-muted-foreground text-sm">{item.description}</p></Card>))}</div></section>
        <div ref={formRef} className="mb-16 min-h-[480px]"><MultiStepQuoteForm insuranceType="prevoyance" /></div>

        <ProductGuaranteeTable product="prevoyance" />

        <CourtierValueCards product="prevoyance" />

        <InsuranceSEOTabs
          faqTitle={t('insPage.faqTitle')}
          faqs={[
            { question: t('prevoyancePage.faq1.q'), answer: t('prevoyancePage.faq1.a') },
            { question: t('prevoyancePage.faq2.q'), answer: t('prevoyancePage.faq2.a') },
            { question: t('prevoyancePage.faq3.q'), answer: t('prevoyancePage.faq3.a') },
          ]}
        />

        <InsuranceBottomHub
          currentPage="prevoyance"
          enBref={
            <EnBref facts={[
              <><BrandName /> compare les assurances prévoyance de 25+ assureurs.</>,
              "Prévoyance : décès, invalidité, incapacité, obsèques.",
              "Protégez votre famille avec un contrat adapté à votre situation.",
              "Devis gratuit en moins de 2 minutes, sans engagement.",
            ]} />
          }
          ctaTitle={t('prevoyancePage.ctaTitle')}
          ctaDescription={t('prevoyancePage.ctaDesc')}
          ctaButtonLabel={t('insPage.compareNowBtn')}
          ctaMascotSrc={arthurFlying}
          ctaMascotAlt="Arthur - prévoyance"
          onCtaClick={scrollToForm}
        />
      </div>
      </main>
      <Footer />
    </div>
  );
};

export default AssurancePrevoyance;
