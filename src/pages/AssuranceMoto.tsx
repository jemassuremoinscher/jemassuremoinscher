import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Euro, Clock } from "lucide-react";
import { useRef } from "react";
import SEOOptimized from "@/components/SEOOptimized";
import { addServiceSchema, addFAQSchema, addInsuranceProductSchema } from "@/utils/seoUtils";
import arthurMoto from "@/assets/mascotte/arthur-moto.webp";
import ArthurHero from "@/components/insurance/ArthurHero";
import ExpertiseSection from "@/components/insurance/ExpertiseSection";
import InsuranceSEOTabs from "@/components/insurance/InsuranceSEOTabs";
import ProductGuaranteeTable from "@/components/insurance/ProductGuaranteeTable";
import CourtierValueCards from "@/components/insurance/CourtierValueCards";
import InsuranceBottomHub from "@/components/insurance/InsuranceBottomHub";
import EnBref from "@/components/seo/EnBref";
import BrandName from "@/components/BrandName";
import arthurFlying from "@/assets/mascotte/arthur-excited.webp";
import { useLanguage } from "@/contexts/LanguageContext";
import Breadcrumbs from "@/components/Breadcrumbs";
import DynamicUpdateDate from "@/components/DynamicUpdateDate";
import { MultiStepQuoteForm } from "@/components/forms/MultiStepQuoteForm";

const AssuranceMoto = () => {
  const { t } = useLanguage();
  const formRef = useRef<HTMLDivElement>(null);
  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const serviceSchema = addServiceSchema({
    name: "Comparateur Assurance Moto",
    description: "Comparez les assurances moto et scooter. Devis gratuit et rapide.",
    provider: "jemassuremoinscher.fr",
    areaServed: "France",
  });

  const faqSchema = addFAQSchema([
    {
      question: "Quelle assurance moto choisir ?",
      answer:
        "Le choix dépend de votre moto, votre profil et usage. Comparez les formules au tiers, intermédiaire et tous risques.",
    },
    {
      question: "L'assurance moto est-elle obligatoire ?",
      answer: "Oui, au minimum une assurance au tiers est obligatoire pour circuler.",
    },
  ]);
  const insuranceProductSchema = addInsuranceProductSchema({
    name: "Assurance Moto",
    description: "Comparateur d'assurance moto et scooter. Tous risques dès 15€/mois. Comparez 25+ assureurs.",
    category: "Assurance Moto",
    url: "https://www.jemassuremoinscher.fr/assurance-moto",
    ratingValue: 4.5,
    reviewCount: 987,
  });

  const advantages = [
    { icon: Euro, title: t("motoPage.adv1.title"), description: t("motoPage.adv1.desc") },
    { icon: Clock, title: t("insPage.quoteIn2min"), description: t("insPage.quoteIn2minDesc") },
    { icon: Shield, title: t("motoPage.adv2.title"), description: t("motoPage.adv2.desc") },
  ];

  return (
    <div className="min-h-screen">
      <SEOOptimized
        title="Assurance Moto Moins Chère [Month] : -35% ⭐"
        description="Moto, scooter, 125cc : comparez 50+ assureurs. Tous risques dès 15€/mois. Devis gratuit et sans engagement."
        keyword="assurance moto moins chère"
        keywords="assurance scooter, comparateur assurance moto, assurance 125, assurance moto jeune conducteur"
        canonical="https://www.jemassuremoinscher.fr/assurance-moto"
        ogTitle="Assurance Moto Moins Chère en 2025 : Comparez 50+ assureurs, économisez 35%"
        ogDescription="Comparez 50+ assureurs moto et scooter en 2 minutes. Tous risques dès 15€/mois. Devis gratuit pour moto, scooter, 125cc."
        twitterDescription="Comparez 50+ assureurs moto en 2 min. Économisez jusqu'à 35%. Devis gratuit sans engagement."
        jsonLd={[serviceSchema, faqSchema, insuranceProductSchema]}
      />
      <Header />
      <Breadcrumbs items={[{ label: "Assurance Moto" }]} />

      <main id="main-content">
        <section className="bg-gradient-to-br from-primary/5 to-primary/10 py-16 relative overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center relative">
              <ArthurHero
                imageSrc={arthurMoto}
                imageAlt="Arthur en moto - assurance moto moins chère"
                speechText={t("motoPage.subtitle")}
              />
              <h1 className="text-4xl md:text-5xl font-bold text-accent mb-6">{t("motoPage.title")}</h1>
              <Button
                size="lg"
                onClick={scrollToForm}
                className="text-lg px-8 py-6"
                aria-label="Comparer les assurances moto maintenant"
              >
                {t("insPage.compareNow")}
              </Button>
            </div>
          </div>
        </section>

        <div
          className="container mx-auto px-4 py-12"
          data-ai-description="Comparateur d'assurance moto — jemassuremoinscher.fr compare 25+ assureurs, devis gratuit en moins de 2 minutes"
        >
          <DynamicUpdateDate />

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
            <MultiStepQuoteForm insuranceType="moto" />
          </div>

          <ProductGuaranteeTable product="moto" />

          <CourtierValueCards product="moto" />

          <InsuranceSEOTabs
            faqTitle={t("insPage.faqTitle")}
            faqs={[
              { question: t("motoPage.faq1.q"), answer: t("motoPage.faq1.a") },
              { question: t("motoPage.faq2.q"), answer: t("motoPage.faq2.a") },
              { question: t("motoPage.faq3.q"), answer: t("motoPage.faq3.a") },
              { question: t("motoPage.faq4.q"), answer: t("motoPage.faq4.a") },
            ]}
          />

          <InsuranceBottomHub
            currentPage="moto"
            expertiseSection={<ExpertiseSection insuranceType="assurance moto" />}
            enBref={
              <EnBref
                facts={[
                  <>
                    <BrandName /> compare les offres de 25+ assureurs moto et scooter.
                  </>,
                  "Assurance moto dès 15€/mois selon le profil et la cylindrée.",
                  "Devis gratuit en moins de 2 minutes, sans engagement.",
                  "Couverture disponible : tiers, tiers étendu, tous risques.",
                ]}
              />
            }
            ctaTitle={`${t("insPage.readyToSave")} ${t("motoPage.readyToSave")} ?`}
            ctaDescription={t("insPage.compareFree")}
            ctaButtonLabel={t("insPage.compareNowBtn")}
            ctaMascotSrc={arthurFlying}
            ctaMascotAlt="Arthur en vol - économisez sur votre assurance moto"
            onCtaClick={scrollToForm}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AssuranceMoto;
