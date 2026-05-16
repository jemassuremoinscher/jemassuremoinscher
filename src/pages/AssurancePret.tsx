import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Shield, Euro, Clock } from "lucide-react";
import { useRef } from "react";
import SEOOptimized from "@/components/SEOOptimized";
import { addServiceSchema, addFAQSchema, addBreadcrumbSchema, addInsuranceProductSchema } from "@/utils/seoUtils";
import arthurThinking from "@/assets/mascotte/arthur-thinking.webp";
import ArthurHero from "@/components/insurance/ArthurHero";
import InsuranceSEOTabs from "@/components/insurance/InsuranceSEOTabs";
import ProductGuaranteeTable from "@/components/insurance/ProductGuaranteeTable";
import CourtierValueCards from "@/components/insurance/CourtierValueCards";
import InsuranceBottomHub from "@/components/insurance/InsuranceBottomHub";
import EnBref from "@/components/seo/EnBref";
import BrandName from "@/components/BrandName";
import arthurFlying from "@/assets/mascotte/arthur-idea.webp";
import { useLanguage } from "@/contexts/LanguageContext";
import Breadcrumbs from "@/components/Breadcrumbs";
import DynamicUpdateDate from "@/components/DynamicUpdateDate";
import { MultiStepQuoteForm } from "@/components/forms/MultiStepQuoteForm";

const AssurancePret = () => {
  const { t } = useLanguage();
  const formRef = useRef<HTMLDivElement>(null);
  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const breadcrumbSchema = addBreadcrumbSchema([
    { name: "Accueil", url: "https://www.jemassuremoinscher.fr/" },
    { name: "Assurance Emprunteur", url: "https://www.jemassuremoinscher.fr/assurance-pret" },
  ]);
  const serviceSchema = addServiceSchema({
    name: "Comparateur Assurance Emprunteur",
    description: "Économisez des milliers d'euros sur votre crédit immobilier. Loi Lemoine.",
    provider: "jemassuremoinscher.fr",
    areaServed: "France",
  });
  const faqSchema = addFAQSchema([
    { question: t("pretPage.faq1.q"), answer: t("pretPage.faq1.a") },
    { question: t("pretPage.faq2.q"), answer: t("pretPage.faq2.a") },
  ]);
  const insuranceProductSchema = addInsuranceProductSchema({
    name: "Assurance Emprunteur",
    description:
      "Comparateur d'assurance de prêt immobilier. Loi Lemoine : changez à tout moment. Économisez jusqu'à 15 000€.",
    category: "Assurance Emprunteur",
    url: "https://www.jemassuremoinscher.fr/assurance-pret",
  });
  const advantages = [
    { icon: Euro, title: t("pretPage.adv1.title"), description: t("pretPage.adv1.desc") },
    { icon: Clock, title: t("pretPage.adv2.title"), description: t("pretPage.adv2.desc") },
    { icon: Shield, title: t("pretPage.adv3.title"), description: t("pretPage.adv3.desc") },
  ];

  return (
    <div className="min-h-screen">
      <SEOOptimized
        title={t("seo.pret.title")}
        description={t("seo.pret.description")}
        keyword="assurance emprunteur moins chère"
        keywords="assurance emprunteur, loi Lemoine, délégation assurance, changer assurance emprunteur"
        canonical="https://www.jemassuremoinscher.fr/assurance-pret"
        ogTitle="Assurance Emprunteur Moins Chère en 2025 : Loi Lemoine, économisez jusqu'à 15 000€"
        ogDescription="Comparez 50+ assureurs emprunteur. Grâce à la loi Lemoine, changez d'assurance de prêt à tout moment. Économisez jusqu'à 50% sur votre assurance crédit."
        twitterDescription="Loi Lemoine : changez d'assurance prêt quand vous voulez. Économisez jusqu'à 15 000€. Devis gratuit en 2 min."
        jsonLd={[breadcrumbSchema, serviceSchema, faqSchema, insuranceProductSchema]}
      />
      <Header />
      <Breadcrumbs items={[{ label: "Assurance Emprunteur" }]} />
      <main id="main-content">
        <section className="relative pt-6 pb-10 md:pt-8 md:pb-14">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <ArthurHero
                imageSrc={arthurThinking}
                imageAlt="Arthur réfléchit - assurance emprunteur moins chère"
                title={t("pretPage.title")}
                subtitle={t("pretPage.subtitle")}
                ctaLabel={t("insPage.compareNow")}
                onCtaClick={scrollToForm}
              />
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
            <MultiStepQuoteForm insuranceType="pret" />
          </div>

          <ProductGuaranteeTable product="pret" />

          <CourtierValueCards product="pret" />

          <InsuranceSEOTabs
            faqTitle={t("insPage.faqTitle")}
            faqs={[
              { question: t("pretPage.faq1.q"), answer: t("pretPage.faq1.a") },
              { question: t("pretPage.faq2.q"), answer: t("pretPage.faq2.a") },
              { question: t("pretPage.faq3.q"), answer: t("pretPage.faq3.a") },
              { question: t("pretPage.faq4.q"), answer: t("pretPage.faq4.a") },
            ]}
          />

          <InsuranceBottomHub
            currentPage="pret"
            enBref={
              <EnBref
                facts={[
                  <>
                    <BrandName /> compare les assurances de prêt immobilier de 25+ assureurs.
                  </>,
                  "Loi Lemoine : changez d'assurance emprunteur à tout moment, sans frais.",
                  "Économie moyenne constatée : jusqu'à 15 000€ sur la durée du prêt.",
                  "Devis gratuit en moins de 2 minutes, sans engagement.",
                ]}
              />
            }
            ctaTitle={t("pretPage.ctaTitle")}
            ctaDescription={t("pretPage.ctaDesc")}
            ctaButtonLabel={t("insPage.compareNowBtn")}
            ctaMascotSrc={arthurFlying}
            ctaMascotAlt="Arthur - assurance emprunteur"
            onCtaClick={scrollToForm}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AssurancePret;
