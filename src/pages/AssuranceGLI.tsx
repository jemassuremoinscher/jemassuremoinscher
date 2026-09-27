import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Shield, Euro, Clock } from "lucide-react";
import { useRef } from "react";
import SEOOptimized from "@/components/SEOOptimized";
import { addServiceSchema, addFAQSchema, addBreadcrumbSchema, addInsuranceProductSchema } from "@/utils/seoUtils";
import arthurDetective from "@/assets/mascotte/arthur-detective.webp";
import ArthurHero from "@/components/insurance/ArthurHero";
import InsuranceSEOTabs from "@/components/insurance/InsuranceSEOTabs";
import ProductGuaranteeTable from "@/components/insurance/ProductGuaranteeTable";
import CourtierValueCards from "@/components/insurance/CourtierValueCards";
import InsuranceBottomHub from "@/components/insurance/InsuranceBottomHub";
import arthurFlying from "@/assets/mascotte/arthur-question.webp";
import { useLanguage } from "@/contexts/LanguageContext";
import Breadcrumbs from "@/components/Breadcrumbs";
import { MultiStepQuoteForm } from "@/components/forms/MultiStepQuoteForm";

const AssuranceGLI = () => {
  const { t } = useLanguage();
  const formRef = useRef<HTMLDivElement>(null);
  const scrollToForm = () => { formRef.current?.scrollIntoView({ behavior: 'smooth' }); };

  const breadcrumbSchema = addBreadcrumbSchema([{ name: "Accueil", url: "https://www.jemassuremoinscher.fr/" }, { name: "Garantie Loyer Impayé", url: "https://www.jemassuremoinscher.fr/assurance-gli" }]);
  const serviceSchema = addServiceSchema({ name: "Comparateur GLI", description: "Protégez vos revenus locatifs avec une assurance GLI." });
  const faqSchema = addFAQSchema([{ question: t('gliPage.faq1.q'), answer: t('gliPage.faq1.a') }, { question: t('gliPage.faq2.q'), answer: t('gliPage.faq2.a') }, { question: t('gliPage.faq3.q'), answer: t('gliPage.faq3.a') }]);
  const insuranceProductSchema = addInsuranceProductSchema({ name: "Garantie Loyer Impayé", description: "Comparateur GLI. Protégez vos revenus locatifs contre les impayés et dégradations.", category: "Assurance Loyer Impayé", url: "https://www.jemassuremoinscher.fr/assurance-gli" });
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "url": "https://www.jemassuremoinscher.fr/assurance-gli",
    "dateModified": "2026-09-26",
  };

  const advantages = [
    { icon: Euro, title: t('gliPage.adv1.title'), description: t('gliPage.adv1.desc') },
    { icon: Clock, title: t('insPage.quoteIn2min'), description: t('insPage.quoteIn2minDesc') },
    { icon: Shield, title: t('gliPage.adv2.title'), description: t('gliPage.adv2.desc') }
  ];

  return (
    <div className="min-h-screen">
      <SEOOptimized title={t("seo.gli.title")} description={t("seo.gli.description")} keyword="garantie loyer impayé" keywords="assurance GLI, protection bailleur, assurance loyer impayé, GLI comparateur" canonical="https://www.jemassuremoinscher.fr/assurance-gli" jsonLd={[webPageSchema, breadcrumbSchema, serviceSchema, faqSchema, insuranceProductSchema]} />
      <Header />
      <Breadcrumbs items={[{ label: "Garantie Loyer Impayé" }]} />
      <main id="main-content">
      <section className="relative pt-6 pb-10 md:pt-8 md:pb-14">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <ArthurHero
              imageSrc={arthurDetective}
              imageAlt="Arthur détective - GLI"
              title={t('gliPage.title')}
              subtitle={t('gliPage.subtitle')}
              ctaLabel={t('insPage.compareNow')}
              onCtaClick={scrollToForm}
            />
          </div>
        </div>
      </section>
      <div className="container mx-auto px-4 py-12">

        <section className="max-w-4xl mx-auto mb-8 prose prose-sm md:prose-base max-w-none">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            GLI ou <span className="text-primary">Visale</span> : comment choisir ?
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Un bailleur ayant souscrit une GLI ne peut pas cumuler celle-ci avec une caution solidaire classique : l'{" "}
            <a href="https://www.legifrance.gouv.fr/loda/article_lc/LEGIARTI000037670657/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">
              article 22-1 de la loi n°89-462 du 6 juillet 1989
            </a>
            , renforcé par la loi Boutin n°2009-323 du 25 mars 2009, prévoit la nullité du cautionnement dans ce cas — sauf logement loué à un étudiant ou un apprenti, seule exception légale.
          </p>
          <p className="text-muted-foreground leading-relaxed mt-4">
            La <strong>garantie Visale</strong> d'Action Logement fonctionne sur le même principe d'exclusivité : c'est une caution gratuite, couvrant jusqu'à 3 ans d'impayés et les dégradations dans la limite de 2 mois de loyer et charges. Mais son accès est <strong>restreint</strong> : elle ne concerne que les locataires de moins de 31 ans (quel que soit leur statut), les salariés de plus de 30 ans en mobilité professionnelle, ou les apprentis et étudiants en alternance. Pour tout autre profil de locataire, la GLI reste la seule option pour se protéger contre les impayés.
          </p>
        </section>

        <section className="max-w-4xl mx-auto mb-12"><div className="grid md:grid-cols-3 gap-6">{advantages.map((item, index) => (<Card key={index} className="p-6 text-center"><div className="flex justify-center mb-4"><div className="p-3 rounded-full bg-primary/10"><item.icon className="h-8 w-8 text-primary" /></div></div><h2 className="font-bold text-lg mb-2">{item.title}</h2><p className="text-muted-foreground text-sm">{item.description}</p></Card>))}</div></section>
        <div ref={formRef} className="mb-16 min-h-[480px]"><MultiStepQuoteForm insuranceType="gli" /></div>

        <ProductGuaranteeTable product="gli" />

        <CourtierValueCards product="gli" />

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
