import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Shield, Euro, Clock } from "lucide-react";
import { useRef } from "react";
import SEOOptimized from "@/components/SEOOptimized";
import { addServiceSchema, addFAQSchema, addBreadcrumbSchema, addInsuranceProductSchema } from "@/utils/seoUtils";
import arthurAnimals from "@/assets/mascotte/arthur-animals.webp";
import ArthurHero from "@/components/insurance/ArthurHero";
import InsuranceSEOTabs from "@/components/insurance/InsuranceSEOTabs";
import CourtierValueCards from "@/components/insurance/CourtierValueCards";
import InsuranceBottomHub from "@/components/insurance/InsuranceBottomHub";
import EnBref from "@/components/seo/EnBref";
import BrandName from "@/components/BrandName";
import arthurFlying from "@/assets/mascotte/arthur-walking.webp";
import { useLanguage } from "@/contexts/LanguageContext";
import Breadcrumbs from "@/components/Breadcrumbs";
import { MultiStepQuoteForm } from "@/components/forms/MultiStepQuoteForm";
import AnimauxPillar from "@/components/insurance/AnimauxPillar";
import { ANIMAUX_FAQ } from "@/data/animauxPilier";

const AssuranceAnimaux = () => {
  const { t, language } = useLanguage();
  const isFr = language === "fr";
  const formRef = useRef<HTMLDivElement>(null);
  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const breadcrumbSchema = addBreadcrumbSchema([
    { name: "Accueil", url: "https://www.jemassuremoinscher.fr/" },
    { name: "Assurance Animaux", url: "https://www.jemassuremoinscher.fr/assurance-animaux" },
  ]);
  const serviceSchema = addServiceSchema({
    name: "Comparateur Assurance Animaux",
    description: "Comparez les assurances pour chiens et chats : le taux de remboursement des frais vétérinaires dépend de la formule choisie.",
    provider: "jemassuremoinscher.fr",
    areaServed: "France",
  });
  // FAQPage = exactement la FAQ affichée : celle du pilier en français, celle
  // des onglets en anglais.
  const enFaqs = [1, 2, 3, 4].map((n) => ({
    question: t(`animauxPage.faq${n}.q`),
    answer: t(`animauxPage.faq${n}.a`),
  }));
  const faqSchema = addFAQSchema(isFr ? ANIMAUX_FAQ : enFaqs);
  const insuranceProductSchema = addInsuranceProductSchema({
    name: "Assurance Animaux",
    description: "Comparateur d'assurance chien, chat et NAC.",
    category: "Assurance Animaux",
    url: "https://www.jemassuremoinscher.fr/assurance-animaux",
  });
  const advantages = [
    { icon: Euro, title: t("animauxPage.adv1.title"), description: t("animauxPage.adv1.desc") },
    { icon: Clock, title: t("insPage.quoteIn2min"), description: t("insPage.quoteIn2minDesc") },
    { icon: Shield, title: t("animauxPage.adv2.title"), description: t("animauxPage.adv2.desc") },
  ];

  return (
    <div className="min-h-screen">
      <SEOOptimized
        title={t("seo.animaux.title")}
        description={t("seo.animaux.description")}
        keyword="assurance chien chat"
        keywords="assurance chien, assurance chat, mutuelle animaux, assurance NAC"
        canonical="https://www.jemassuremoinscher.fr/assurance-animaux"
        ogTitle="Assurance chien et chat : remboursement, plafond, carence"
        ogDescription="Remboursement, plafond, franchise, carence, âge limite : comment fonctionne une assurance chien ou chat. Fourchettes de trois contrats, sources citées."
        twitterDescription="Remboursement, plafond, franchise, carence, âge limite : comment fonctionne une assurance chien ou chat. Fourchettes de trois contrats, sources citées."
        jsonLd={[breadcrumbSchema, serviceSchema, faqSchema, insuranceProductSchema]}
      />
      <Header />
      <Breadcrumbs items={[{ label: "Assurance Animaux" }]} />
      <main id="main-content">
        <section className="relative pt-6 pb-10 md:pt-8 md:pb-14">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <ArthurHero
                imageSrc={arthurAnimals}
                imageAlt="Arthur avec des animaux"
                title={t("animauxPage.title")}
                subtitle={t("animauxPage.subtitle")}
                ctaLabel={t("insPage.compareNow")}
                onCtaClick={scrollToForm}
                // Pilier : pas de promesse d'économie (encart par défaut « Économisez »).
                savingsValue={isFr ? "Devis gratuit" : "Free quote"}
                savingsLabel={isFr ? "et sans engagement" : "with no commitment"}
              />
            </div>
          </div>
        </section>
        <div className="container mx-auto px-4 py-12">

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
            <MultiStepQuoteForm insuranceType="animaux" />
          </div>


          <CourtierValueCards product="animaux" />

          {isFr ? (
            <AnimauxPillar onCtaClick={scrollToForm} />
          ) : (
            <InsuranceSEOTabs faqTitle={t("insPage.faqTitle")} faqs={enFaqs} />
          )}

          <InsuranceBottomHub
            currentPage="animaux"
            enBref={
              <EnBref
                facts={[
                  <>
                    <BrandName /> compare les assurances chien, chat et NAC.
                  </>,
                  "Le tarif dépend de l'espèce et des garanties choisies.",
                  "Le taux de remboursement des frais vétérinaires dépend de la formule choisie.",
                  "Devis gratuit en moins de 2 minutes, sans engagement.",
                ]}
              />
            }
            ctaTitle={t("animauxPage.readyTitle")}
            ctaDescription={t("animauxPage.readyDesc")}
            ctaButtonLabel={t("insPage.compareNowBtn")}
            ctaMascotSrc={arthurFlying}
            ctaMascotAlt="Arthur - assurance animaux"
            onCtaClick={scrollToForm}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AssuranceAnimaux;
