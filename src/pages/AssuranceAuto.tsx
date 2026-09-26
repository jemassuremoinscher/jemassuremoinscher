import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Shield, Euro, Clock } from "lucide-react";
import { useRef } from "react";
import SEOOptimized from "@/components/SEOOptimized";
import { addServiceSchema, addFAQSchema, addHowToSchema, addInsuranceProductSchema } from "@/utils/seoUtils";
import arthurCar from "@/assets/mascotte/arthur-car.webp?w=480&format=webp";
import ArthurHero from "@/components/insurance/ArthurHero";
import ExpertiseSection from "@/components/insurance/ExpertiseSection";
import InsuranceSEOTabs from "@/components/insurance/InsuranceSEOTabs";
import ProductGuaranteeTable from "@/components/insurance/ProductGuaranteeTable";
import CourtierValueCards from "@/components/insurance/CourtierValueCards";
import InsuranceBottomHub from "@/components/insurance/InsuranceBottomHub";
import EnBref from "@/components/seo/EnBref";
import BrandName from "@/components/BrandName";
import arthurFlying from "@/assets/mascotte/arthur-sprint-coin.webp";
import { useLanguage } from "@/contexts/LanguageContext";
import Breadcrumbs from "@/components/Breadcrumbs";
import { MultiStepQuoteForm } from "@/components/forms/MultiStepQuoteForm";
import ProtectionJuridiqueSection from "@/components/insurance/ProtectionJuridiqueSection";
import RelatedArticles from "@/components/blog/RelatedArticles";

const AssuranceAuto = () => {
  const { t } = useLanguage();
  const formRef = useRef<HTMLDivElement>(null);
  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const serviceSchema = addServiceSchema({
    name: "Comparateur Assurance Auto",
    description:
      "Comparez les meilleures offres d'assurance auto en France. Devis gratuit et personnalisé en 2 minutes.",
    provider: "jemassuremoinscher.fr",
    areaServed: "France",
  });

  const howToSchema = addHowToSchema({
    name: "Comment obtenir un devis d'assurance auto en ligne",
    description: "Guide étape par étape pour comparer et obtenir votre devis d'assurance auto en 2 minutes",
    totalTime: "PT2M",
    steps: [
      {
        name: "Renseignez les informations de votre véhicule",
        text: "Indiquez la marque, le modèle, la date de mise en circulation et l'usage de votre véhicule.",
      },
      {
        name: "Précisez votre profil de conducteur",
        text: "Renseignez votre âge, votre ancienneté de permis et votre coefficient bonus-malus.",
      },
      {
        name: "Comparez les offres disponibles",
        text: "Recevez instantanément plusieurs devis d'assureurs partenaires.",
      },
      {
        name: "Faites-vous rappeler",
        text: "Sélectionnez l'offre qui vous convient et demandez à être rappelé par un conseiller.",
      },
    ],
  });
  const faqSchema = addFAQSchema([
    {
      question: "Quelle assurance auto choisir ?",
      answer:
        "Le choix dépend de votre profil, votre véhicule et votre budget. Notre comparateur vous aide à trouver l'offre la mieux adaptée.",
    },
    {
      question: "Combien coûte une assurance auto ?",
      answer:
        "Le prix varie selon votre âge, votre véhicule, votre historique et votre lieu de résidence. Comparez des devis établis pour votre profil.",
    },
    {
      question: "Puis-je changer d'assurance auto à tout moment ?",
      answer: "Oui, grâce à la loi Hamon, vous pouvez résilier après un an sans frais ni justification.",
    },
  ]);
  const insuranceProductSchema = addInsuranceProductSchema({
    name: "Assurance Auto",
    description: "Comparateur d'assurance auto. Comparez les offres de 25+ assureurs et trouvez un contrat plus avantageux.",
    category: "Assurance Automobile",
    url: "https://www.jemassuremoinscher.fr/assurance-auto",
  });

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "url": "https://www.jemassuremoinscher.fr/assurance-auto",
    "dateModified": "2026-09-26",
  };

  const advantages = [
    { icon: Euro, title: t("autoPage.adv1.title"), description: t("autoPage.adv1.desc") },
    { icon: Clock, title: t("insPage.quoteIn2min"), description: t("insPage.quoteIn2minDesc") },
    { icon: Shield, title: t("autoPage.adv2.title"), description: t("autoPage.adv2.desc") },
  ];

  return (
    <div className="min-h-screen">
      <SEOOptimized
        title={t("seo.auto.title")}
        description={t("seo.auto.description")}
        keyword="assurance auto moins chère"
        keywords="assurance auto moins cher, Comparateur assurance auto, devis assurance voiture, changer assurance auto"
        canonical="https://www.jemassuremoinscher.fr/assurance-auto"
        ogTitle="Assurance Auto Moins Chère | Comparez 70+ assureurs"
        ogDescription="Comparez 70+ assureurs auto en 2 minutes. Devis gratuit et personnalisé. Tiers, Tiers+, Tous Risques."
        twitterDescription="Comparez 70+ assureurs auto en 2 minutes. Gratuit et sans engagement."
        jsonLd={[webPageSchema, serviceSchema, howToSchema, faqSchema, insuranceProductSchema]}
      />
      <Header />
      <Breadcrumbs items={[{ label: "Assurance Auto" }]} />

      <main id="main-content">
        {/* Zone 1 — Hero */}
        <section className="relative pt-6 pb-10 md:pt-8 md:pb-14">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <ArthurHero
                imageSrc={arthurCar}
                imageAlt="Arthur mascotte avec assurance auto jemassuremoinscher protégeant voiture"
                title={t("autoPage.title")}
                subtitle={t("autoPage.subtitle")}
                ctaLabel={t("insPage.compareNow")}
                onCtaClick={scrollToForm}
              />
            </div>
          </div>
        </section>

        <div
          className="container mx-auto px-4 py-12"
          data-ai-description="Comparateur d'assurance auto — jemassuremoinscher.fr compare 25+ assureurs, devis gratuit en moins de 2 minutes"
        >

          {/* H2 above-the-fold ciblé "assurances voiture moins chères" */}
          <section className="max-w-4xl mx-auto mb-10 prose prose-sm md:prose-base max-w-none">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Comment trouver les <span className="text-primary">assurances voiture moins chères</span> en 2026 ?
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Pour décrocher l'assurance voiture la moins chère adaptée à votre profil, trois leviers font la différence : <strong>la formule</strong> (au tiers, tiers étendu ou tous risques), <strong>votre coefficient bonus malus</strong> (un CRM de 0,50 divise la prime par deux par rapport à 1,00) et <strong>la mise en concurrence</strong> des assureurs.
            </p>
            <ul className="text-sm text-muted-foreground mt-4 space-y-1.5 list-none pl-0">
              <li>✓ Connaître son CRM exact avant de demander un devis — <Link to="/outils/calculateur-bonus-malus" className="text-primary hover:underline font-medium">calculer mon bonus malus</Link></li>
              <li>✓ Comparer au moins 3 formules équivalentes (Tiers / Tiers+ / Tous Risques)</li>
              <li>✓ Profiter de la loi Hamon pour résilier à tout moment après 1 an, sans frais</li>
              <li>✓ Adapter ses garanties à l'usage réel et à l'âge du véhicule</li>
            </ul>
            <p className="text-xs text-muted-foreground/80 mt-4">
              Service 100% en ligne basé à Nice (06000).
            </p>
          </section>

          {/* Zone 2 — Avantages + Formulaire */}
          <section className="max-w-4xl mx-auto mb-12">
            <div className="grid md:grid-cols-3 gap-6">
              {advantages.map((item, index) => (
                <Card key={index} className="p-6 text-center">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 rounded-full bg-primary/10">
                      <item.icon className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.description}</p>
                </Card>
              ))}
            </div>
          </section>

          <div ref={formRef} className="mb-16 min-h-[480px]">
            <MultiStepQuoteForm insuranceType="auto" />
          </div>

          {/* Tableau garanties par formule (SEO/GEO — extraction LLM) */}
          <ProductGuaranteeTable product="auto" />

          <ProtectionJuridiqueSection context="auto" />

          <CourtierValueCards product="auto" />

          {/* Zone 3 — FAQ + Garanties en tabs */}
          <InsuranceSEOTabs
            faqTitle={t("insPage.faqTitle")}
            faqs={[
              { question: t("autoPage.faq1.q"), answer: t("autoPage.faq1.a") },
              { question: t("autoPage.faq2.q"), answer: t("autoPage.faq2.a") },
              { question: t("autoPage.faq3.q"), answer: t("autoPage.faq3.a") },
              { question: t("autoPage.faq4.q"), answer: t("autoPage.faq4.a") },
            ]}
          />

          {/* Zone 4 & 5 — Confiance + Maillage + EnBref + CTA */}
          <InsuranceBottomHub
            currentPage="auto"
            expertiseSection={<ExpertiseSection insuranceType="assurance auto" />}
            enBref={
              <EnBref
                facts={[
                  <>
                    <BrandName /> compare les offres de 25+ assureurs auto partenaires.
                  </>,
                  "Trois formules disponibles : au tiers, tiers étendu, tous risques.",
                  "Devis gratuit en moins de 2 minutes, sans engagement.",
                  "Comparez plusieurs assureurs pour trouver le tarif le plus adapté à votre profil.",
                ]}
              />
            }
            ctaTitle={`${t("insPage.readyToSave")} ${t("autoPage.readyToSave")} ?`}
            ctaDescription={t("insPage.compareFree")}
            ctaButtonLabel={t("insPage.compareNowBtn")}
            ctaMascotSrc={arthurFlying}
            ctaMascotAlt="Arthur en vol - économisez sur votre assurance auto"
            onCtaClick={scrollToForm}
          />
          <div className="container mx-auto px-4">
            <RelatedArticles
              keywords={["auto", "voiture", "conducteur", "bonus-malus", "hamon"]}
              limit={3}
              title="À lire aussi sur l'assurance auto"
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AssuranceAuto;
