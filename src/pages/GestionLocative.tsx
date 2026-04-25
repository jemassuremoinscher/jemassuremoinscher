import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Clock, Shield } from "lucide-react";
import { useRef } from "react";
import SEOOptimized from "@/components/SEOOptimized";
import { addServiceSchema, addFAQSchema, addBreadcrumbSchema } from "@/utils/seoUtils";
import arthurHouse from "@/assets/mascotte/arthur-house.webp";
import arthurFlying from "@/assets/mascotte/arthur-welcome.webp";
import ArthurHero from "@/components/insurance/ArthurHero";
import InsuranceSEOTabs from "@/components/insurance/InsuranceSEOTabs";
import ProductGuaranteeTable from "@/components/insurance/ProductGuaranteeTable";
import CourtierValueCards from "@/components/insurance/CourtierValueCards";
import InsuranceBottomHub from "@/components/insurance/InsuranceBottomHub";
import { useLanguage } from "@/contexts/LanguageContext";
import Breadcrumbs from "@/components/Breadcrumbs";
import DynamicUpdateDate from "@/components/DynamicUpdateDate";
import { MultiStepQuoteForm } from "@/components/forms/MultiStepQuoteForm";

const GestionLocative = () => {
  const { t } = useLanguage();
  const formRef = useRef<HTMLDivElement>(null);
  const scrollToForm = () => { formRef.current?.scrollIntoView({ behavior: 'smooth' }); };

  const breadcrumbSchema = addBreadcrumbSchema([
    { name: "Accueil", url: "https://www.jemassuremoinscher.fr/" },
    { name: "Gestion Locative", url: "https://www.jemassuremoinscher.fr/gestion-locative" },
  ]);
  const serviceSchema = addServiceSchema({
    name: "Comparateur Gestion Locative",
    description: "Trouvez le meilleur gestionnaire pour vos biens locatifs. Gestion complète, partielle ou déclarative.",
    provider: "jemassuremoinscher.fr",
    areaServed: "France",
  });
  const faqs = [
    {
      question: "Qu'est-ce que la gestion locative ?",
      answer: "La gestion locative consiste à confier la gestion quotidienne de votre bien immobilier à un professionnel : recherche de locataires, état des lieux, encaissement des loyers, gestion des travaux et déclarations fiscales.",
    },
    {
      question: "Quels sont les types de gestion proposés ?",
      answer: "Trois types principaux : la gestion complète (tout délégué), la gestion partielle (certaines tâches uniquement) et la gestion déclarative (suivi administratif et fiscal).",
    },
    {
      question: "Combien coûte la gestion locative ?",
      answer: "Les honoraires varient généralement entre 5% et 10% des loyers perçus, selon le niveau de service choisi et le nombre de biens gérés. Des dégressivités sont possibles dès 2 biens.",
    },
  ];
  const faqSchema = addFAQSchema(faqs);

  const advantages = [
    { icon: Building2, title: "Gestionnaires triés", description: "Comparez les meilleures agences et plateformes du marché." },
    { icon: Clock, title: t('insPage.quoteIn2min'), description: t('insPage.quoteIn2minDesc') },
    { icon: Shield, title: "Honoraires maîtrisés", description: "Tarifs dégressifs dès 2 biens, sans frais cachés." },
  ];

  return (
    <div className="min-h-screen">
      <SEOOptimized
        title="Gestion Locative : Comparez les Gestionnaires"
        description="Comparez gratuitement les offres de gestion locative. Gestion complète, partielle ou déclarative. Honoraires dès 5%. Devis en 2 minutes."
        keyword="gestion locative"
        keywords="gestion immobilière, administrateur de biens, gestionnaire locatif, honoraires gestion locative"
        canonical="https://www.jemassuremoinscher.fr/gestion-locative"
        jsonLd={[breadcrumbSchema, serviceSchema, faqSchema]}
      />
      <Header />
      <Breadcrumbs items={[{ label: "Gestion Locative" }]} />
      <main id="main-content">
        <section className="bg-gradient-to-br from-primary/5 to-primary/10 py-16 relative overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center relative">
              <ArthurHero imageSrc={arthurHouse} imageAlt="Arthur - Gestion Locative" speechText={t('gestionPage.subtitle')} />
              <h1 className="text-4xl md:text-5xl font-bold text-accent mb-6">{t('gestionPage.title')}</h1>
              <Button size="lg" onClick={scrollToForm} className="text-lg px-8 py-6" aria-label="Comparer les gestionnaires locatifs maintenant">
                {t('insPage.compareNow')}
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
            <MultiStepQuoteForm insuranceType="gestion_locative" />
          </div>

          <ProductGuaranteeTable product="gestion-locative" />

        <CourtierValueCards product="gestion-locative" />

          <InsuranceSEOTabs faqTitle={t('insPage.faqTitle')} faqs={faqs} />

          <InsuranceBottomHub
            currentPage="gestionLocative"
            ctaTitle="Prêt à déléguer la gestion de vos biens ?"
            ctaDescription="Comparez gratuitement les meilleurs gestionnaires en 2 minutes."
            ctaButtonLabel={t('insPage.compareNowBtn')}
            ctaMascotSrc={arthurFlying}
            ctaMascotAlt="Arthur - Gestion Locative"
            onCtaClick={scrollToForm}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default GestionLocative;
