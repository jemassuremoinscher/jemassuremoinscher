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
import CourtierValueCards from "@/components/insurance/CourtierValueCards";
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
  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const breadcrumbSchema = addBreadcrumbSchema([
    { name: "Accueil", url: "https://www.jemassuremoinscher.fr/" },
    { name: "Assurance Vie", url: "https://www.jemassuremoinscher.fr/assurance-vie" },
  ]);
  const serviceSchema = addServiceSchema({
    name: "Comparateur Assurance Vie",
    description:
      "Comparez les contrats d'assurance vie pour l'épargne et la protection, avec 0% de frais d'entrée et frais d'arbitrage offerts sur nos contrats partenaires.",
    provider: "jemassuremoinscher.fr",
    areaServed: "France",
  });

  const faqSchema = addFAQSchema([
    { question: t("viePage.faq1.q"), answer: t("viePage.faq1.a") },
    { question: t("viePage.faq2.q"), answer: t("viePage.faq2.a") },
    {
      question: "Les frais d'entrée et d'arbitrage sont-ils offerts ?",
      answer:
        "Oui, sur nos contrats partenaires sélectionnés, les frais d'entrée sont à 0% et les frais d'arbitrage sont offerts, sous réserve des conditions du contrat choisi.",
    },
  ]);
  const insuranceProductSchema = addInsuranceProductSchema({
    name: "Assurance Vie",
    description:
      "Comparateur d'assurance vie. Fonds euros, unités de compte, PER : comparez les meilleurs rendements 2026 avec 0% de frais d'entrée et frais d'arbitrage offerts sur nos contrats partenaires.",
    category: "Assurance Vie",
    url: "https://www.jemassuremoinscher.fr/assurance-vie",
    ratingValue: 4.9,
    reviewCount: 1124,
  });
  const advantages = [
    {
      icon: Euro,
      title: "0% de frais d'entrée",
      description: "Frais d'entrée offerts sur nos contrats partenaires sélectionnés.",
    },
    { icon: Clock, title: t("insPage.quoteIn2min"), description: t("insPage.quoteIn2minDesc") },
    {
      icon: Shield,
      title: "Frais d'arbitrage offerts",
      description: "Ajustez votre allocation plus librement selon les conditions du contrat.",
    },
  ];

  return (
    <div className="min-h-screen">
      <SEOOptimized
        title="Assurance Vie [Month] : Frais 0% Offerts"
        description="Assurance vie : comparez fonds euros et UC. 0% de frais d'entrée, frais d'arbitrage offerts, fiscalité avantageuse après 8 ans."
        keyword="assurance vie frais entrée offerts"
        keywords="assurance vie 2026, 0% frais entrée, frais arbitrage offerts, épargne, placement, transmission patrimoine, PER"
        canonical="https://www.jemassuremoinscher.fr/assurance-vie"
        ogTitle="Assurance Vie en 2025 : 0% de frais d'entrée, comparez les meilleures offres"
        ogDescription="Comparez les meilleures assurances vie : fonds euros sécurisés et unités de compte. 0% de frais d'entrée. Fiscalité avantageuse après 8 ans."
        twitterDescription="Assurance vie 0% frais d'entrée. Comparez fonds euros et UC. Fiscalité avantageuse après 8 ans."
        jsonLd={[breadcrumbSchema, serviceSchema, faqSchema, insuranceProductSchema]}
      />
      <Header />
      <Breadcrumbs items={[{ label: "Assurance Vie" }]} />
      <main id="main-content">
        <section className="relative overflow-hidden py-16 md:py-20 bg-gradient-to-b from-primary/[0.06] via-background to-accent/[0.05]">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center relative">
              <ArthurHero
                imageSrc={arthurIdea}
                imageAlt="Arthur réfléchit - assurance vie"
                speechText={t("viePage.subtitle")}
              />
              <h1 className="text-4xl md:text-5xl font-bold text-accent mb-6">{t("viePage.title")}</h1>
              <Button
                size="lg"
                onClick={scrollToForm}
                className="text-lg px-8 py-6"
                aria-label="Comparer les assurances vie maintenant"
              >
                {t("insPage.compareNow")}
              </Button>
            </div>
          </div>
        </section>
        <div className="container mx-auto px-4 py-12">
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
            <MultiStepQuoteForm insuranceType="vie" />
          </div>
          <CourtierValueCards product="vie" />

          <InsuranceSEOTabs
            showGuarantees={false}
            faqTitle={t("insPage.faqTitle")}
            faqs={[
              { question: t("viePage.faq1.q"), answer: t("viePage.faq1.a") },
              { question: t("viePage.faq2.q"), answer: t("viePage.faq2.a") },
              { question: t("viePage.faq3.q"), answer: t("viePage.faq3.a") },
              {
                question: "Quels frais sont offerts sur l'assurance vie ?",
                answer:
                  "Les contrats partenaires mis en avant peuvent proposer 0% de frais d'entrée et des frais d'arbitrage offerts, pour réduire le coût d'accès et de gestion de votre épargne.",
              },
            ]}
          />

          <InsuranceBottomHub
            currentPage="vie"
            enBref={
              <EnBref
                facts={[
                  <>
                    <BrandName /> compare les contrats d'assurance vie des meilleurs assureurs.
                  </>,
                  "0% de frais d'entrée et frais d'arbitrage offerts sur nos contrats partenaires sélectionnés.",
                  "Fonds euros, unités de compte, PER : toutes les options comparées.",
                  "Fiscalité avantageuse après 8 ans de détention.",
                ]}
              />
            }
            ctaTitle={t("viePage.ctaTitle")}
            ctaDescription={t("viePage.ctaDesc")}
            ctaButtonLabel={t("insPage.compareNowBtn")}
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
