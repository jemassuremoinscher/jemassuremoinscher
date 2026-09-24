import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Shield, Euro, Clock } from "lucide-react";
import { useRef } from "react";
import SEOOptimized from "@/components/SEOOptimized";
import { addServiceSchema, addFAQSchema, addInsuranceProductSchema } from "@/utils/seoUtils";
import arthurHouse from "@/assets/mascotte/arthur-house.webp?w=480&format=webp";
import ArthurHero from "@/components/insurance/ArthurHero";
import ExpertiseSection from "@/components/insurance/ExpertiseSection";
import InsuranceSEOTabs from "@/components/insurance/InsuranceSEOTabs";
import ProductGuaranteeTable from "@/components/insurance/ProductGuaranteeTable";
import CourtierValueCards from "@/components/insurance/CourtierValueCards";
import InsuranceBottomHub from "@/components/insurance/InsuranceBottomHub";
import EnBref from "@/components/seo/EnBref";
import BrandName from "@/components/BrandName";
import arthurFlying from "@/assets/mascotte/arthur-waving.webp";
import { useLanguage } from "@/contexts/LanguageContext";
import Breadcrumbs from "@/components/Breadcrumbs";
import { MultiStepQuoteForm } from "@/components/forms/MultiStepQuoteForm";
import ProtectionJuridiqueSection from "@/components/insurance/ProtectionJuridiqueSection";

const AssuranceHabitation = () => {
  const { t } = useLanguage();
  const formRef = useRef<HTMLDivElement>(null);
  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const serviceSchema = addServiceSchema({
    name: "Comparateur Assurance Habitation",
    description: "Comparez les assurances habitation. Devis gratuit et rapide.",
    provider: "jemassuremoinscher.fr",
    areaServed: "France",
  });

  const faqSchema = addFAQSchema([
    {
      question: "L'assurance habitation est-elle obligatoire ?",
      answer: "Oui pour les locataires. Fortement recommandée pour les propriétaires.",
    },
    {
      question: "Combien coûte une assurance habitation ?",
      answer: "Entre 120€ et 350€ par an selon la surface et les garanties.",
    },
  ]);
  const insuranceProductSchema = addInsuranceProductSchema({
    name: "Assurance Habitation",
    description:
      "Comparateur d'assurance habitation. Maison ou appartement, locataire ou propriétaire, trouvez la meilleure couverture.",
    category: "Assurance Habitation",
    url: "https://www.jemassuremoinscher.fr/assurance-habitation",
  });

  const advantages = [
    { icon: Euro, title: t("habitationPage.adv1.title"), description: t("habitationPage.adv1.desc") },
    { icon: Clock, title: t("insPage.quoteIn2min"), description: t("insPage.quoteIn2minDesc") },
    { icon: Shield, title: t("habitationPage.adv2.title"), description: t("habitationPage.adv2.desc") },
  ];

  return (
    <div className="min-h-screen">
      <SEOOptimized
        title={t("seo.habitation.title")}
        description={t("seo.habitation.description")}
        keyword="assurance habitation moins chère"
        keywords="assurance maison, assurance appartement, assurance logement, assurance locataire"
        canonical="https://www.jemassuremoinscher.fr/assurance-habitation"
        ogTitle="Assurance Habitation Moins Chère en 2025 : Comparez 70+ assureurs dès 3€/mois"
        ogDescription="Comparez 70+ assureurs habitation en 2 minutes. Locataire ou propriétaire, maison ou appartement. Économisez jusqu'à 40% sur votre contrat."
        twitterDescription="Comparez 70+ assureurs habitation. Économisez jusqu'à 40%/an. Devis gratuit en 2 min."
        jsonLd={[serviceSchema, faqSchema, insuranceProductSchema]}
      />
      <Header />
      <Breadcrumbs items={[{ label: "Assurance Habitation" }]} />

      <main id="main-content">
        <section className="relative pt-6 pb-10 md:pt-8 md:pb-14">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <ArthurHero
                imageSrc={arthurHouse}
                imageAlt="Arthur mascotte avec assurance habitation jemassuremoinscher protégeant maison"
                title={t("habitationPage.title")}
                subtitle={t("habitationPage.subtitle")}
                ctaLabel={t("insPage.compareNow")}
                onCtaClick={scrollToForm}
              />
            </div>
          </div>
        </section>

        <div
          className="container mx-auto px-4 py-12"
          data-ai-description="Comparateur d'assurance habitation — jemassuremoinscher.fr compare 25+ assureurs, devis gratuit en moins de 2 minutes"
        >

          <section className="max-w-4xl mx-auto mb-12">
            <div className="grid md:grid-cols-3 gap-6">
              {advantages.map((item, index) => (
                <Card key={index} className="p-6 text-center">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 rounded-full bg-primary/10">
                      <item.icon className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  <h2 className="font-bold text-lg mb-2">{item.title}</h2>
                  <p className="text-muted-foreground text-sm">{item.description}</p>
                </Card>
              ))}
            </div>
          </section>

          <div ref={formRef} className="mb-16 min-h-[480px]">
            <MultiStepQuoteForm insuranceType="habitation" />
          </div>

          <ProductGuaranteeTable product="habitation" />

          <ProtectionJuridiqueSection context="habitation" />

          <CourtierValueCards product="habitation" />

          <InsuranceSEOTabs
            faqTitle={t("insPage.faqTitle")}
            faqs={[
              { question: t("habitationPage.faq1.q"), answer: t("habitationPage.faq1.a") },
              { question: t("habitationPage.faq2.q"), answer: t("habitationPage.faq2.a") },
              { question: t("habitationPage.faq3.q"), answer: t("habitationPage.faq3.a") },
              { question: t("habitationPage.faq4.q"), answer: t("habitationPage.faq4.a") },
            ]}
          />

          <InsuranceBottomHub
            currentPage="habitation"
            expertiseSection={<ExpertiseSection insuranceType="assurance habitation" />}
            enBref={
              <EnBref
                facts={[
                  <>
                    <BrandName /> compare les offres de 25+ assureurs habitation.
                  </>,
                  "Assurance habitation dès 3€/mois selon le logement et les garanties.",
                  "Devis gratuit en moins de 2 minutes, sans engagement.",
                  "Locataire ou propriétaire : trouvez la meilleure couverture au meilleur prix.",
                ]}
              />
            }
            ctaTitle={`${t("insPage.readyToSave")} ${t("habitationPage.readyToSave")} ?`}
            ctaDescription={t("insPage.compareFree")}
            ctaButtonLabel={t("insPage.compareNowBtn")}
            ctaMascotSrc={arthurFlying}
            ctaMascotAlt="Arthur en vol - économisez sur votre assurance habitation"
            onCtaClick={scrollToForm}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AssuranceHabitation;
