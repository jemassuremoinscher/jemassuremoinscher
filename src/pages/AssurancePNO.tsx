import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Shield, Home, Clock } from "lucide-react";
import { useRef } from "react";
import SEOOptimized from "@/components/SEOOptimized";
import { addServiceSchema, addFAQSchema, addBreadcrumbSchema, addInsuranceProductSchema } from "@/utils/seoUtils";
import arthurHouse from "@/assets/mascotte/arthur-house.webp?w=480&format=webp";
import ArthurHero from "@/components/insurance/ArthurHero";
import InsuranceSEOTabs from "@/components/insurance/InsuranceSEOTabs";
import ProductGuaranteeTable from "@/components/insurance/ProductGuaranteeTable";
import CourtierValueCards from "@/components/insurance/CourtierValueCards";
import InsuranceBottomHub from "@/components/insurance/InsuranceBottomHub";
import arthurFlying from "@/assets/mascotte/arthur-welcome.webp";
import { useLanguage } from "@/contexts/LanguageContext";
import Breadcrumbs from "@/components/Breadcrumbs";
import { MultiStepQuoteForm } from "@/components/forms/MultiStepQuoteForm";

const AssurancePNO = () => {
  const { t } = useLanguage();
  const formRef = useRef<HTMLDivElement>(null);
  const scrollToForm = () => { formRef.current?.scrollIntoView({ behavior: 'smooth' }); };

  const breadcrumbSchema = addBreadcrumbSchema([{ name: "Accueil", url: "https://www.jemassuremoinscher.fr/" }, { name: "Assurance PNO", url: "https://www.jemassuremoinscher.fr/assurance-pno" }]);
  const serviceSchema = addServiceSchema({ name: "Comparateur Assurance PNO", description: "Comparez les assurances PNO pour protéger votre bien immobilier.", provider: "jemassuremoinscher.fr", areaServed: "France" });
  const faqSchema = addFAQSchema([{ question: t('pnoPage.faq1.q'), answer: t('pnoPage.faq1.a') }, { question: t('pnoPage.faq2.q'), answer: t('pnoPage.faq2.a') }, { question: t('pnoPage.faq3.q'), answer: t('pnoPage.faq3.a') }]);
  const insuranceProductSchema = addInsuranceProductSchema({ name: "PNO Assurance", description: "Comparateur d'assurance propriétaire non occupant. Obligatoire en copropriété (loi Alur).", category: "Assurance PNO", url: "https://www.jemassuremoinscher.fr/assurance-pno" });
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "url": "https://www.jemassuremoinscher.fr/assurance-pno",
    "dateModified": "2026-09-26",
  };

  const advantages = [
    { icon: Home, title: t('pnoPage.adv1.title'), description: t('pnoPage.adv1.desc') },
    { icon: Clock, title: t('insPage.quoteIn2min'), description: t('insPage.quoteIn2minDesc') },
    { icon: Shield, title: t('pnoPage.adv2.title'), description: t('pnoPage.adv2.desc') }
  ];

  return (
    <div className="min-h-screen">
      <SEOOptimized title={t("seo.pno.title")} description={t("seo.pno.description")} keyword="PNO assurance" keywords="pno assurance, assurance PNO, propriétaire non occupant, assurance logement vide, PNO obligatoire, assurance bailleur" canonical="https://www.jemassuremoinscher.fr/assurance-pno" jsonLd={[webPageSchema, breadcrumbSchema, serviceSchema, faqSchema, insuranceProductSchema]} />
      <Header />
      <Breadcrumbs items={[{ label: "Assurance PNO" }]} />
      <main id="main-content">
      <section className="relative pt-6 pb-10 md:pt-8 md:pb-14">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <ArthurHero
              imageSrc={arthurHouse}
              imageAlt="Arthur - PNO"
              title="PNO Assurance : Comparez et Trouvez une Offre Avantageuse"
              subtitle={t('pnoPage.subtitle')}
              ctaLabel={t('insPage.compareNow')}
              onCtaClick={scrollToForm}
            />
          </div>
        </div>
      </section>
      <div className="container mx-auto px-4 py-12">

        <section className="max-w-4xl mx-auto mb-8 prose prose-sm md:prose-base max-w-none">
          <p className="text-muted-foreground leading-relaxed">
            En copropriété, l'assurance PNO est obligatoire pour tout copropriétaire non-occupant depuis la loi Alur : l'article 9-1 de la loi n°65-557 du 10 juillet 1965 (créé par l'article 58 de la{" "}
            <a href="https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000028772256/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">
              loi n°2014-366 du 24 mars 2014
            </a>
            , en vigueur depuis le 1er janvier 2015) impose à chaque copropriétaire de s'assurer contre les risques de responsabilité civile dont il doit répondre en sa qualité de copropriétaire occupant ou non-occupant. Hors copropriété, ce n'est pas une obligation légale générale, mais fortement recommandé.
          </p>
        </section>

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
