import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Shield, Euro, Clock } from "lucide-react";
import { useRef } from "react";
import SEOOptimized from "@/components/SEOOptimized";
import { addServiceSchema, addFAQSchema, addInsuranceProductSchema } from "@/utils/seoUtils";
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
import { MultiStepQuoteForm } from "@/components/forms/MultiStepQuoteForm";

const AssuranceVie = () => {
  const { t } = useLanguage();
  const formRef = useRef<HTMLDivElement>(null);
  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

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
  });
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "url": "https://www.jemassuremoinscher.fr/assurance-vie",
    "dateModified": "2026-09-26",
  };

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
        title={t("seo.vie.title")}
        description={t("seo.vie.description")}
        keyword="assurance vie frais entrée offerts"
        keywords="assurance vie 2026, 0% frais entrée, frais arbitrage offerts, épargne, placement, transmission patrimoine, PER"
        canonical="https://www.jemassuremoinscher.fr/assurance-vie"
        ogTitle="Assurance Vie : 0% de frais d'entrée, comparez les meilleures offres"
        ogDescription="Comparez les meilleures assurances vie : fonds euros sécurisés et unités de compte. 0% de frais d'entrée. Fiscalité avantageuse après 8 ans."
        twitterDescription="Assurance vie 0% frais d'entrée. Comparez fonds euros et UC. Fiscalité avantageuse après 8 ans."
        jsonLd={[webPageSchema, serviceSchema, faqSchema, insuranceProductSchema]}
      />
      <Header />
      <Breadcrumbs items={[{ label: "Assurance Vie" }]} />
      <main id="main-content">
        <section className="relative pt-6 pb-10 md:pt-8 md:pb-14">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <ArthurHero
                imageSrc={arthurIdea}
                imageAlt="Arthur réfléchit - assurance vie"
                title={t("viePage.title")}
                subtitle={t("viePage.subtitle")}
                ctaLabel={t("insPage.compareNow")}
                onCtaClick={scrollToForm}
              />
            </div>
          </div>
        </section>
        <div className="container mx-auto px-4 py-12">

          <section className="max-w-4xl mx-auto mb-10 prose prose-sm md:prose-base max-w-none">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Fiscalité, fonds euros et garanties : <span className="text-primary">ce qu'il faut savoir</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              L'avantage fiscal de l'assurance vie ne s'active qu'après <strong>8 ans de détention</strong> (article 125-0 A du Code général des impôts) : un abattement annuel de <strong>4 600€</strong> (personne seule) ou <strong>9 200€</strong> (couple marié ou pacsé) s'applique sur les gains lors d'un retrait — jamais sur le capital versé. Au-delà de cet abattement, les gains restent taxés à 7,5% (pour la part des primes ≤150 000€) ou 12,8% au-delà, plus 17,2% de prélèvements sociaux.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Sur le support d'investissement : le <strong>fonds euros</strong> offre un capital garanti par l'assureur, tandis que les <strong>unités de compte</strong> présentent un risque de perte en capital, la valeur suivant les marchés financiers.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              ⚠️ Une confusion fréquente à éviter : le <strong>FGAP</strong> (Fonds de Garantie des Assurances de Personnes, Code des assurances{" "}
              <a href="https://www.legifrance.gouv.fr/codes/section_lc/LEGITEXT000006073984/LEGISCTA000006159161/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">
                articles L423-1 à L423-8
              </a>
              ) garantit jusqu'à 70 000€ par assuré et par assureur — mais <strong>uniquement en cas de défaillance de l'assureur lui-même</strong>, jamais contre une baisse de marché. Si votre fonds euros ou vos unités de compte perdent de la valeur suite à une crise boursière, ce fonds de garantie n'intervient pas : ce risque reste entièrement le vôtre.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Un crédit immobilier en cours ? L'<Link to="/assurance-pret" className="text-primary hover:underline font-medium">assurance emprunteur</Link> qui y est attachée est un produit différent de l'assurance vie : elle ne couvre que ce prêt, sans épargne ni clause bénéficiaire propre.
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
