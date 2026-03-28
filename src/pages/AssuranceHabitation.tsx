import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Euro, Clock } from "lucide-react";
import { useRef } from "react";
import SEOOptimized from "@/components/SEOOptimized";
import { addServiceSchema, addFAQSchema, addInsuranceProductSchema } from "@/utils/seoUtils";
import arthurHouse from "@/assets/mascotte/arthur-house.webp";
import ArthurHero from "@/components/insurance/ArthurHero";
import ExpertiseSection from "@/components/insurance/ExpertiseSection";
import InsuranceSEOTabs from "@/components/insurance/InsuranceSEOTabs";
import InsuranceBottomHub from "@/components/insurance/InsuranceBottomHub";
import EnBref from "@/components/seo/EnBref";
import BrandName from "@/components/BrandName";
import arthurFlying from "@/assets/mascotte/arthur-waving.webp";
import { useLanguage } from "@/contexts/LanguageContext";
import Breadcrumbs from "@/components/Breadcrumbs";
import DynamicUpdateDate from "@/components/DynamicUpdateDate";
import { MultiStepQuoteForm } from "@/components/forms/MultiStepQuoteForm";

const AssuranceHabitation = () => {
  const { t } = useLanguage();
  const formRef = useRef<HTMLDivElement>(null);
  const scrollToForm = () => { formRef.current?.scrollIntoView({ behavior: 'smooth' }); };

  const serviceSchema = addServiceSchema({ name: "Comparateur Assurance Habitation", description: "Comparez les assurances habitation. Devis gratuit et rapide.", provider: "jemassuremoinscher.fr", areaServed: "France" });
  
  const faqSchema = addFAQSchema([{ question: "L'assurance habitation est-elle obligatoire ?", answer: "Oui pour les locataires. Fortement recommandée pour les propriétaires." }, { question: "Combien coûte une assurance habitation ?", answer: "Entre 120€ et 350€ par an selon la surface et les garanties." }]);
  const insuranceProductSchema = addInsuranceProductSchema({ name: "Assurance Habitation", description: "Comparateur d'assurance habitation. Maison ou appartement, locataire ou propriétaire, trouvez la meilleure couverture.", category: "Assurance Habitation", url: "https://www.jemassuremoinscher.fr/assurance-habitation", ratingValue: 4.7, reviewCount: 1435 });

  const advantages = [
    { icon: Euro, title: t('habitationPage.adv1.title'), description: t('habitationPage.adv1.desc') },
    { icon: Clock, title: t('insPage.quoteIn2min'), description: t('insPage.quoteIn2minDesc') },
    { icon: Shield, title: t('habitationPage.adv2.title'), description: t('habitationPage.adv2.desc') }
  ];

  return (
    <div className="min-h-screen">
      <SEOOptimized title="Assurance Habitation Moins Chère [Month] dès 3€" description="Comparez 50+ assureurs habitation en 2 min. Maison ou appartement, locataire ou propriétaire. Économisez jusqu'à 40%." keyword="assurance habitation moins chère" keywords="assurance maison, assurance appartement, assurance logement, assurance locataire" canonical="https://www.jemassuremoinscher.fr/assurance-habitation" jsonLd={[serviceSchema, faqSchema, insuranceProductSchema]} />
      <Header />
      <Breadcrumbs items={[{ label: "Assurance Habitation" }]} />

      <main id="main-content">
      <section className="bg-gradient-to-br from-primary/5 to-primary/10 py-16 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center relative">
            <ArthurHero imageSrc={arthurHouse} imageAlt="Arthur devant une maison - assurance habitation moins chère" speechText={t('habitationPage.subtitle')} />
            <h1 className="text-4xl md:text-5xl font-bold text-accent mb-6">{t('habitationPage.title')}</h1>
            <Button size="lg" onClick={scrollToForm} className="text-lg px-8 py-6" aria-label="Comparer les assurances habitation maintenant">{t('insPage.compareNow')}</Button>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12" data-ai-description="Comparateur d'assurance habitation — jemassuremoinscher.fr compare 25+ assureurs, devis gratuit en moins de 2 minutes">
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
          <MultiStepQuoteForm insuranceType="habitation" />
        </div>

        <InsuranceSEOTabs
          faqTitle={t('insPage.faqTitle')}
          faqs={[
            { question: t('habitationPage.faq1.q'), answer: t('habitationPage.faq1.a') },
            { question: t('habitationPage.faq2.q'), answer: t('habitationPage.faq2.a') },
            { question: t('habitationPage.faq3.q'), answer: t('habitationPage.faq3.a') },
            { question: t('habitationPage.faq4.q'), answer: t('habitationPage.faq4.a') },
          ]}
        />

        <InsuranceBottomHub
          currentPage="habitation"
          expertiseSection={<ExpertiseSection insuranceType="assurance habitation" />}
          enBref={
            <EnBref facts={[
              <><BrandName /> compare les offres de 25+ assureurs habitation.</>,
              "Assurance habitation dès 3€/mois selon le logement et les garanties.",
              "Devis gratuit en moins de 2 minutes, sans engagement.",
              "Locataire ou propriétaire : trouvez la meilleure couverture au meilleur prix.",
            ]} />
          }
          ctaTitle={`${t('insPage.readyToSave')} ${t('habitationPage.readyToSave')} ?`}
          ctaDescription={t('insPage.compareFree')}
          ctaButtonLabel={t('insPage.compareNowBtn')}
          ctaMascotSrc={arthurFlying}
          ctaMascotAlt="Arthur en vol - économisez sur votre assurance habitation"
          onCtaClick={scrollToForm}
        />
      </div>
      </main>
      <Footer />
    </div>
  );
};

export default AssuranceHabitation;
