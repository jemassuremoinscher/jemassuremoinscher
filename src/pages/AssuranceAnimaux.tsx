import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Euro, Clock } from "lucide-react";
import { useRef } from "react";
import SEOOptimized from "@/components/SEOOptimized";
import { addServiceSchema, addFAQSchema, addBreadcrumbSchema, addInsuranceProductSchema } from "@/utils/seoUtils";
import arthurAnimals from "@/assets/mascotte/arthur-animals.webp";
import ArthurHero from "@/components/insurance/ArthurHero";
import InsuranceSEOTabs from "@/components/insurance/InsuranceSEOTabs";
import InsuranceBottomHub from "@/components/insurance/InsuranceBottomHub";
import EnBref from "@/components/seo/EnBref";
import BrandName from "@/components/BrandName";
import arthurFlying from "@/assets/mascotte/arthur-walking.webp";
import { useLanguage } from "@/contexts/LanguageContext";
import Breadcrumbs from "@/components/Breadcrumbs";
import DynamicUpdateDate from "@/components/DynamicUpdateDate";
import { MultiStepQuoteForm } from "@/components/forms/MultiStepQuoteForm";

const AssuranceAnimaux = () => {
  const { t } = useLanguage();
  const formRef = useRef<HTMLDivElement>(null);
  const scrollToForm = () => { formRef.current?.scrollIntoView({ behavior: 'smooth' }); };

  const breadcrumbSchema = addBreadcrumbSchema([{ name: "Accueil", url: "https://www.jemassuremoinscher.fr/" }, { name: "Assurance Animaux", url: "https://www.jemassuremoinscher.fr/assurance-animaux" }]);
  const serviceSchema = addServiceSchema({ name: "Comparateur Assurance Animaux", description: "Comparez les assurances pour chiens et chats. Remboursement des frais vétérinaires jusqu'à 100%.", provider: "jemassuremoinscher.fr", areaServed: "France" });
  const faqSchema = addFAQSchema([{ question: "Pourquoi assurer son animal ?", answer: "Pour couvrir les frais vétérinaires souvent élevés (accidents, maladies, chirurgie)." }, { question: "Combien coûte une assurance animaux ?", answer: "De 10€ à 60€/mois selon l'espèce, l'âge, la race et le niveau de garanties." }]);
  const insuranceProductSchema = addInsuranceProductSchema({ name: "Assurance Animaux", description: "Comparateur d'assurance chien, chat et NAC. Remboursement vétérinaire jusqu'à 100%. Dès 8€/mois.", category: "Assurance Animaux", url: "https://www.jemassuremoinscher.fr/assurance-animaux" });
  const advantages = [
    { icon: Euro, title: t('animauxPage.adv1.title'), description: t('animauxPage.adv1.desc') },
    { icon: Clock, title: t('insPage.quoteIn2min'), description: t('insPage.quoteIn2minDesc') },
    { icon: Shield, title: t('animauxPage.adv2.title'), description: t('animauxPage.adv2.desc') }
  ];

  return (
    <div className="min-h-screen">
      <SEOOptimized title="Assurance Chien Chat dès 8€/mois [Month]" description="Mutuelle animaux : remboursement vétérinaire jusqu'à 100%. Comparez les offres chien et chat en 2 min. Sans délai de carence." keyword="assurance animaux moins chère" keywords="assurance chien, assurance chat, mutuelle animaux, assurance NAC" canonical="https://www.jemassuremoinscher.fr/assurance-animaux" jsonLd={[breadcrumbSchema, serviceSchema, faqSchema, insuranceProductSchema]} />
      <Header />
      <Breadcrumbs items={[{ label: "Assurance Animaux" }]} />
      <main id="main-content">
      <section className="bg-gradient-to-br from-primary/5 to-primary/10 py-16 relative overflow-hidden">
        <div className="container mx-auto px-4"><div className="max-w-4xl mx-auto text-center relative">
          <ArthurHero imageSrc={arthurAnimals} imageAlt="Arthur avec des animaux" speechText={t('animauxPage.subtitle')} />
          <h1 className="text-4xl md:text-5xl font-bold text-accent mb-6">{t('animauxPage.title')}</h1>
          <Button size="lg" onClick={scrollToForm} className="text-lg px-8 py-6" aria-label="Comparer les assurances animaux maintenant">{t('insPage.compareNow')}</Button>
        </div></div>
      </section>
      <div className="container mx-auto px-4 py-12">
        <DynamicUpdateDate />

        <section className="max-w-4xl mx-auto mb-12"><div className="grid md:grid-cols-3 gap-6">{advantages.map((item, index) => (<Card key={index} className="p-6 text-center"><div className="flex justify-center mb-4"><div className="p-3 rounded-full bg-primary/10"><item.icon className="h-8 w-8 text-primary" /></div></div><h2 className="font-bold text-lg mb-2">{item.title}</h2><p className="text-muted-foreground text-sm">{item.description}</p></Card>))}</div></section>
        <div ref={formRef} className="mb-16 min-h-[480px]"><MultiStepQuoteForm insuranceType="animaux" /></div>

        <InsuranceSEOTabs
          faqTitle={t('insPage.faqTitle')}
          faqs={[
            { question: t('animauxPage.faq1.q'), answer: t('animauxPage.faq1.a') },
            { question: t('animauxPage.faq2.q'), answer: t('animauxPage.faq2.a') },
            { question: t('animauxPage.faq3.q'), answer: t('animauxPage.faq3.a') },
            { question: t('animauxPage.faq4.q'), answer: t('animauxPage.faq4.a') },
          ]}
        />

        <InsuranceBottomHub
          currentPage="animaux"
          enBref={
            <EnBref facts={[
              <><BrandName /> compare les assurances chien, chat et NAC.</>,
              "Assurance animaux dès 8€/mois selon l'espèce et les garanties.",
              "Remboursement des frais vétérinaires jusqu'à 100%.",
              "Devis gratuit en moins de 2 minutes, sans engagement.",
            ]} />
          }
          ctaTitle={t('animauxPage.readyTitle')}
          ctaDescription={t('animauxPage.readyDesc')}
          ctaButtonLabel={t('insPage.compareNowBtn')}
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
