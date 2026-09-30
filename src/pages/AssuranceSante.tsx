import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Shield, Euro, Clock } from "lucide-react";
import { useRef } from "react";
import SEOOptimized from "@/components/SEOOptimized";
import { addServiceSchema, addFAQSchema, addInsuranceProductSchema } from "@/utils/seoUtils";
import arthurSick from "@/assets/mascotte/arthur-sick.webp";
import { NB_ASSUREURS_LABEL } from "@/config/site";
import ArthurHero from "@/components/insurance/ArthurHero";
import ExpertiseSection from "@/components/insurance/ExpertiseSection";
import InsuranceSEOTabs from "@/components/insurance/InsuranceSEOTabs";
import ProductGuaranteeTable from "@/components/insurance/ProductGuaranteeTable";
import CourtierValueCards from "@/components/insurance/CourtierValueCards";
import InsuranceBottomHub from "@/components/insurance/InsuranceBottomHub";
import EnBref from "@/components/seo/EnBref";
import BrandName from "@/components/BrandName";
import arthurFlying from "@/assets/mascotte/arthur-thumbsup-coin.webp";
import { useLanguage } from "@/contexts/LanguageContext";
import Breadcrumbs from "@/components/Breadcrumbs";
import { MultiStepQuoteForm } from "@/components/forms/MultiStepQuoteForm";
import geoContent from "@/data/geo-content.json";
import RelatedArticles from "@/components/blog/RelatedArticles";

const AssuranceSante = () => {
  const { t } = useLanguage();
  const formRef = useRef<HTMLDivElement>(null);
  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const serviceSchema = addServiceSchema({
    name: "Comparateur Mutuelle Santé",
    description: "Comparez les meilleures mutuelles santé en France. Devis gratuit et personnalisé en 2 minutes.",
    provider: "jemassuremoinscher.fr",
    areaServed: "France",
  });

  const faqSchema = addFAQSchema([
    {
      question: "Qu'est-ce qu'une mutuelle santé ?",
      answer:
        "Une mutuelle santé rembourse tout ou partie des dépenses de santé non couvertes par la Sécurité sociale.",
    },
    {
      question: "Comment choisir sa mutuelle santé ?",
      answer:
        "Choisissez selon vos besoins : niveau de remboursement optique/dentaire, délais de carence et votre budget.",
    },
    {
      question: "Combien coûte une mutuelle santé ?",
      answer:
        "Le prix varie selon votre âge, votre situation familiale et le niveau de garanties choisi. Comparez plusieurs mutuelles pour trouver le tarif adapté à votre profil.",
    },
  ]);
  const insuranceProductSchema = addInsuranceProductSchema({
    name: "Mutuelle Santé",
    description:
      "Comparateur de mutuelles santé. Optique, dentaire, hospitalisation : comparez 25+ mutuelles partenaires.",
    category: "Complémentaire Santé",
    url: "https://www.jemassuremoinscher.fr/assurance-sante",
  });

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "url": "https://www.jemassuremoinscher.fr/assurance-sante",
    "dateModified": "2026-09-26",
  };

  const advantages = [
    { icon: Euro, title: t("santePage.adv1.title"), description: t("santePage.adv1.desc") },
    { icon: Clock, title: t("insPage.quoteIn2min"), description: t("insPage.quoteIn2minDesc") },
    { icon: Shield, title: t("santePage.adv2.title"), description: t("santePage.adv2.desc") },
  ];

  return (
    <div className="min-h-screen">
      <SEOOptimized
        title={t("seo.sante.title")}
        description={t("seo.sante.description")}
        keyword="mutuelle santé moins chère"
        keywords="complémentaire santé, comparateur mutuelle, mutuelle moins cher, mutuelle famille"
        canonical="https://www.jemassuremoinscher.fr/assurance-sante"
        ogTitle={`Mutuelle Santé Moins Chère | Comparez ${NB_ASSUREURS_LABEL} mutuelles`}
        ogDescription={`Comparez ${NB_ASSUREURS_LABEL} mutuelles santé en 2 minutes. Optique, dentaire, hospitalisation. Devis gratuit et personnalisé.`}
        twitterDescription={`Comparez ${NB_ASSUREURS_LABEL} mutuelles en 2 min. Gratuit et sans engagement.`}
        jsonLd={[webPageSchema, serviceSchema, faqSchema, insuranceProductSchema]}
      />
      <Header />
      <Breadcrumbs items={[{ label: "Mutuelle Santé" }]} />

      <main id="main-content">
        <section className="relative pt-6 pb-10 md:pt-8 md:pb-14">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <ArthurHero
                imageSrc={arthurSick}
                imageAlt="Arthur mascotte avec assurance santé mutuelle jemassuremoinscher"
                title={t("santePage.title")}
                subtitle={t("santePage.subtitle")}
                ctaLabel={t("insPage.compareNow")}
                onCtaClick={scrollToForm}
              />
            </div>
          </div>
        </section>

        <div
          className="container mx-auto px-4 py-12"
          data-ai-description="Comparateur de mutuelle santé — jemassuremoinscher.fr compare 25+ mutuelles, devis gratuit en moins de 2 minutes"
        >

          <section className="max-w-4xl mx-auto mb-10 prose prose-sm md:prose-base max-w-none">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Comment fonctionne le remboursement <span className="text-primary">Sécu + mutuelle</span> ?
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              La Sécurité sociale rembourse vos soins sur une <strong>base de remboursement</strong> (le tarif de convention), pas sur le prix réellement facturé. La part non remboursée sur cette base — le <strong>ticket modérateur</strong> — varie selon le soin : environ 30% pour une consultation chez un généraliste conventionné, 40% pour le dentaire, 20% pour l'hospitalisation. Une mutuelle santé complète tout ou partie de ce ticket modérateur, et peut aussi couvrir les dépassements d'honoraires, que la Sécu ne prend jamais en charge.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Depuis le{" "}
              <a href="https://www.legifrance.gouv.fr/loda/id/JORFTEXT000037995163" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">
                décret n°2019-21 du 11 janvier 2019
              </a>
              , la réforme <strong>100% Santé</strong> garantit un reste à charge nul sur un panier de soins défini en optique, dentaire et audiologie, dès lors que la mutuelle est un <strong>contrat responsable</strong> — le cas de plus de 95% des contrats du marché. Ce cadre (<a href="https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000042685398" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">articles L871-1 à L871-3 du Code de la sécurité sociale</a>) impose notamment l'absence de questionnaire médical à l'adhésion et l'interdiction de moduler les cotisations selon l'état de santé.
            </p>
          </section>

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
            <MultiStepQuoteForm insuranceType="sante" />
          </div>

          <ProductGuaranteeTable product="sante" />

          <CourtierValueCards product="sante" />

          <InsuranceSEOTabs
            faqTitle={t("insPage.faqTitle")}
            faqs={[
              { question: t("santePage.faq1.q"), answer: t("santePage.faq1.a") },
              { question: t("santePage.faq2.q"), answer: t("santePage.faq2.a") },
              { question: t("santePage.faq3.q"), answer: t("santePage.faq3.a") },
              { question: t("santePage.faq4.q"), answer: t("santePage.faq4.a") },
            ]}
          />

          <InsuranceBottomHub
            currentPage="sante"
            expertiseSection={<ExpertiseSection insuranceType="mutuelle santé" />}
            enBref={
              <EnBref
                facts={[
                  <>
                    <BrandName /> compare les offres de 25+ mutuelles santé partenaires.
                  </>,
                  "Le tarif dépend de l'âge et des garanties choisies.",
                  "Devis gratuit en moins de 2 minutes, sans engagement.",
                  "Optique, dentaire, hospitalisation : comparez tous les niveaux de remboursement.",
                ]}
              />
            }
            ctaTitle={`${t("insPage.readyToSave")} ${t("santePage.readyToSave")} ?`}
            ctaDescription={t("insPage.compareFree")}
            ctaButtonLabel={t("insPage.compareNowBtn")}
            ctaMascotSrc={arthurFlying}
            ctaMascotAlt="Arthur en vol - économisez sur votre mutuelle santé"
            onCtaClick={scrollToForm}
          />
          <RelatedArticles
            keywords={["santé", "sante", "mutuelle", "remboursement", "tns"]}
            limit={3}
            title="À lire aussi sur la mutuelle santé"
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AssuranceSante;
