import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Building2, Clock, Shield } from "lucide-react";
import { useRef } from "react";
import SEOOptimized from "@/components/SEOOptimized";
import { addServiceSchema, addFAQSchema } from "@/utils/seoUtils";
import arthurHouse from "@/assets/mascotte/arthur-house.webp?w=480&format=webp";
import arthurFlying from "@/assets/mascotte/arthur-welcome.webp";
import ArthurHero from "@/components/insurance/ArthurHero";
import InsuranceSEOTabs from "@/components/insurance/InsuranceSEOTabs";
import ProductGuaranteeTable from "@/components/insurance/ProductGuaranteeTable";
import CourtierValueCards from "@/components/insurance/CourtierValueCards";
import InsuranceBottomHub from "@/components/insurance/InsuranceBottomHub";
import { useLanguage } from "@/contexts/LanguageContext";
import Breadcrumbs from "@/components/Breadcrumbs";
import { MultiStepQuoteForm } from "@/components/forms/MultiStepQuoteForm";

const GestionLocative = () => {
  const { t } = useLanguage();
  const formRef = useRef<HTMLDivElement>(null);
  const scrollToForm = () => { formRef.current?.scrollIntoView({ behavior: 'smooth' }); };

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

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "url": "https://www.jemassuremoinscher.fr/gestion-locative",
    "dateModified": "2026-09-26",
  };

  const advantages = [
    { icon: Building2, title: "Gestionnaires triés", description: "Comparez les meilleures agences et plateformes du marché." },
    { icon: Clock, title: t('insPage.quoteIn2min'), description: t('insPage.quoteIn2minDesc') },
    { icon: Shield, title: "Honoraires maîtrisés", description: "Tarifs dégressifs dès 2 biens, sans frais cachés." },
  ];

  return (
    <div className="min-h-screen">
      <SEOOptimized
        title={t("seo.gestionLocative.title")}
        description={t("seo.gestionLocative.description")}
        keyword="gestion locative"
        keywords="gestion immobilière, administrateur de biens, gestionnaire locatif, honoraires gestion locative"
        canonical="https://www.jemassuremoinscher.fr/gestion-locative"
        jsonLd={[webPageSchema, serviceSchema, faqSchema]}
      />
      <Header />
      <Breadcrumbs items={[{ label: "Gestion Locative" }]} />
      <main id="main-content">
        <section className="relative pt-6 pb-10 md:pt-8 md:pb-14">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <ArthurHero
                imageSrc={arthurHouse}
                imageAlt="Arthur - Gestion Locative"
                title={t('gestionPage.title')}
                subtitle={t('gestionPage.subtitle')}
                ctaLabel={t('insPage.compareNow')}
                onCtaClick={scrollToForm}
              />
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-12">

          <section className="max-w-4xl mx-auto mb-8 prose prose-sm md:prose-base max-w-none">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Ce que la loi <span className="text-primary">impose</span> à un gestionnaire locatif
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              La gestion locative est encadrée par la{" "}
              <a href="https://www.legifrance.gouv.fr/loda/id/JORFTEXT000000855024" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">
                loi Hoguet n°70-9 du 2 janvier 1970
              </a>
              {" "}et son décret d'application n°72-678 du 20 juillet 1972 : le mandataire doit détenir une carte professionnelle (valable 3 ans, renouvelable sous conditions de RC Pro et de garantie financière), et le mandat de gestion doit être écrit, numéroté et établi en double exemplaire, mentionnant l'identité des parties, le numéro de carte professionnelle du mandataire, sa garantie financière et sa rémunération.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              La durée du mandat ne peut dépasser 30 ans (10 ans en cas de tacite reconduction), et le mandataire doit rendre compte au propriétaire de ce qu'il a encaissé et dépensé <strong>au moins une fois par an</strong> — en pratique, souvent mensuellement ou trimestriellement. L'absence de reddition de comptes est reconnue par la jurisprudence comme une faute pouvant justifier une résiliation du mandat.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Confier la gestion à un professionnel ne dispense pas des garanties propriétaire : <Link to="/assurance-pno" className="text-primary hover:underline font-medium">PNO</Link> et <Link to="/assurance-gli" className="text-primary hover:underline font-medium">GLI</Link> ne sont pas automatiquement incluses dans un mandat de gestion locative — vérifiez votre contrat avant de souscrire en double.
            </p>
          </section>

          <ProductGuaranteeTable product="gestion-locative" />

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

        <CourtierValueCards product="gestion-locative" />

          <InsuranceSEOTabs faqTitle={t('insPage.faqTitle')} faqs={faqs} showGuarantees={false} />

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
