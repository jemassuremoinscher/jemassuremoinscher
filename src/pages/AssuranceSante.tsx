import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Euro, Clock } from "lucide-react";
import { useRef } from "react";
import SEOOptimized from "@/components/SEOOptimized";
import { addServiceSchema, addFAQSchema, addInsuranceProductSchema } from "@/utils/seoUtils";
import arthurSick from "@/assets/mascotte/arthur-sick.webp";
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
import DynamicUpdateDate from "@/components/DynamicUpdateDate";
import { MultiStepQuoteForm } from "@/components/forms/MultiStepQuoteForm";
import geoContent from "@/data/geo-content.json";

const AssuranceSante = () => {
  const { t } = useLanguage();
  const formRef = useRef<HTMLDivElement>(null);
  const scrollToForm = () => { formRef.current?.scrollIntoView({ behavior: 'smooth' }); };

  const serviceSchema = addServiceSchema({ name: "Comparateur Mutuelle Santé", description: "Comparez les meilleures mutuelles santé en France. Devis gratuit et personnalisé en 2 minutes.", provider: "jemassuremoinscher.fr", areaServed: "France" });
  
  const faqSchema = addFAQSchema([{ question: "Qu'est-ce qu'une mutuelle santé ?", answer: "Une mutuelle santé rembourse tout ou partie des dépenses de santé non couvertes par la Sécurité sociale." }, { question: "Comment choisir sa mutuelle santé ?", answer: "Choisissez selon vos besoins : niveau de remboursement optique/dentaire, délais de carence et votre budget." }, { question: "Combien coûte une mutuelle santé ?", answer: "Le prix varie selon votre âge, situation familiale et niveau de garanties. Comptez entre 45€ et 200€/mois." }]);
  const insuranceProductSchema = addInsuranceProductSchema({ name: "Mutuelle Santé", description: "Comparateur de mutuelles santé. Optique, dentaire, hospitalisation : comparez 25+ mutuelles partenaires.", category: "Complémentaire Santé", url: "https://www.jemassuremoinscher.fr/assurance-sante", ratingValue: 4.6, reviewCount: 1642 });

  const advantages = [
    { icon: Euro, title: t('santePage.adv1.title'), description: t('santePage.adv1.desc') },
    { icon: Clock, title: t('insPage.quoteIn2min'), description: t('insPage.quoteIn2minDesc') },
    { icon: Shield, title: t('santePage.adv2.title'), description: t('santePage.adv2.desc') }
  ];

  return (
    <div className="min-h-screen">
      <SEOOptimized title="Mutuelle Santé Moins Chère [Month] : -300€/an" description={`Comparez 50+ mutuelles en 2 min. Optique, dentaire, hospitalisation : trouvez la formule idéale. ${geoContent.trust.ratingValueLabel}/5 satisfaction client.`} keyword="mutuelle santé moins chère" keywords="complémentaire santé, comparateur mutuelle, mutuelle moins cher, mutuelle famille" canonical="https://www.jemassuremoinscher.fr/assurance-sante" jsonLd={[serviceSchema, faqSchema, insuranceProductSchema]} />
      <Header />
      <Breadcrumbs items={[{ label: "Mutuelle Santé" }]} />

      <main id="main-content">
      <section className="bg-gradient-to-br from-primary/5 to-primary/10 py-16 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center relative">
            <ArthurHero imageSrc={arthurSick} imageAlt="Arthur malade - mutuelle santé moins chère" speechText={t('santePage.subtitle')} />
            <h1 className="text-4xl md:text-5xl font-bold text-accent mb-6">{t('santePage.title')}</h1>
            <Button size="lg" onClick={scrollToForm} className="text-lg px-8 py-6" aria-label="Comparer les mutuelles santé maintenant">{t('insPage.compareNow')}</Button>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12" data-ai-description="Comparateur de mutuelle santé — jemassuremoinscher.fr compare 25+ mutuelles, devis gratuit en moins de 2 minutes">
        <DynamicUpdateDate />

        <section className="max-w-4xl mx-auto mb-12">
          <div className="grid md:grid-cols-3 gap-6">
            {advantages.map((item, index) => (
              <Card key={index} className="p-6 text-center">
                <div className="flex justify-center mb-4"><div className="p-3 rounded-full bg-primary/10"><item.icon className="h-8 w-8 text-primary" /></div></div>
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
          faqTitle={t('insPage.faqTitle')}
          faqs={[
            { question: t('santePage.faq1.q'), answer: t('santePage.faq1.a') },
            { question: t('santePage.faq2.q'), answer: t('santePage.faq2.a') },
            { question: t('santePage.faq3.q'), answer: t('santePage.faq3.a') },
            { question: t('santePage.faq4.q'), answer: t('santePage.faq4.a') },
          ]}
        />

        <InsuranceBottomHub
          currentPage="sante"
          expertiseSection={<ExpertiseSection insuranceType="mutuelle santé" />}
          enBref={
            <EnBref facts={[
              <><BrandName /> compare les offres de 25+ mutuelles santé partenaires.</>,
              "Mutuelle santé dès 20€/mois selon l'âge et les garanties choisies.",
              "Devis gratuit en moins de 2 minutes, sans engagement.",
              "Optique, dentaire, hospitalisation : comparez tous les niveaux de remboursement.",
            ]} />
          }
          ctaTitle={`${t('insPage.readyToSave')} ${t('santePage.readyToSave')} ?`}
          ctaDescription={t('insPage.compareFree')}
          ctaButtonLabel={t('insPage.compareNowBtn')}
          ctaMascotSrc={arthurFlying}
          ctaMascotAlt="Arthur en vol - économisez sur votre mutuelle santé"
          onCtaClick={scrollToForm}
        />
      </div>
      </main>
      <Footer />
    </div>
  );
};

export default AssuranceSante;
