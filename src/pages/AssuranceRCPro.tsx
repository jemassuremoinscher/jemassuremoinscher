import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Euro, Clock } from "lucide-react";
import { useRef } from "react";
import SEOOptimized from "@/components/SEOOptimized";
import { addServiceSchema, addFAQSchema, addBreadcrumbSchema, addInsuranceProductSchema } from "@/utils/seoUtils";
import arthurBusiness from "@/assets/mascotte/arthur-business.webp";
import ArthurHero from "@/components/insurance/ArthurHero";
import InsuranceSEOTabs from "@/components/insurance/InsuranceSEOTabs";
import InsuranceBottomHub from "@/components/insurance/InsuranceBottomHub";
import arthurFlying from "@/assets/mascotte/arthur-wink-thumbsup.webp";
import { useLanguage } from "@/contexts/LanguageContext";
import Breadcrumbs from "@/components/Breadcrumbs";
import DynamicUpdateDate from "@/components/DynamicUpdateDate";
import { MultiStepQuoteForm } from "@/components/forms/MultiStepQuoteForm";

const AssuranceRCPro = () => {
  const { t } = useLanguage();
  const formRef = useRef<HTMLDivElement>(null);
  const scrollToForm = () => { formRef.current?.scrollIntoView({ behavior: 'smooth' }); };

  const breadcrumbSchema = addBreadcrumbSchema([{ name: "Accueil", url: "https://www.jemassuremoinscher.fr/" }, { name: "RC Pro", url: "https://www.jemassuremoinscher.fr/assurance-rc-pro" }]);
  const serviceSchema = addServiceSchema({ name: "Comparateur Assurance RC Pro", description: "Comparez les assurances RC Professionnelle.", provider: "jemassuremoinscher.fr", areaServed: "France" });
  const faqSchema = addFAQSchema([{ question: t('rcProPage.faq1.q'), answer: t('rcProPage.faq1.a') }, { question: t('rcProPage.faq2.q'), answer: t('rcProPage.faq2.a') }, { question: t('rcProPage.faq3.q'), answer: t('rcProPage.faq3.a') }]);
  const insuranceProductSchema = addInsuranceProductSchema({ name: "RC Professionnelle", description: "Comparateur d'assurance responsabilité civile professionnelle. Tous secteurs : BTP, conseil, IT, commerce. Dès 15€/mois.", category: "Responsabilité Civile Professionnelle", url: "https://www.jemassuremoinscher.fr/assurance-rc-pro" });
  const advantages = [
    { icon: Euro, title: t('rcProPage.adv1.title'), description: t('rcProPage.adv1.desc') },
    { icon: Clock, title: t('insPage.quoteIn2min'), description: t('insPage.quoteIn2minDesc') },
    { icon: Shield, title: t('rcProPage.adv2.title'), description: t('rcProPage.adv2.desc') }
  ];

  return (
    <div className="min-h-screen">
      <SEOOptimized title="RC Pro dès 15€/mois [Month] : Devis Gratuit" description="Responsabilité civile professionnelle : comparez 50+ assureurs. Tous secteurs : BTP, conseil, IT, commerce. Attestation immédiate." keyword="RC Pro moins chère" keywords="responsabilité civile professionnelle, assurance RC Pro, RC pro auto-entrepreneur" canonical="https://www.jemassuremoinscher.fr/assurance-rc-pro" jsonLd={[breadcrumbSchema, serviceSchema, faqSchema, insuranceProductSchema]} />
      <Header />
      <Breadcrumbs items={[{ label: "RC Professionnelle" }]} />
      <main id="main-content">
      <section className="bg-gradient-to-br from-primary/5 to-primary/10 py-16 relative overflow-hidden">
        <div className="container mx-auto px-4"><div className="max-w-4xl mx-auto text-center relative">
          <ArthurHero imageSrc={arthurBusiness} imageAlt="Arthur en costume - RC Pro" speechText={t('rcProPage.subtitle')} />
          <h1 className="text-4xl md:text-5xl font-bold text-accent mb-6">{t('rcProPage.title')}</h1>
          <Button size="lg" onClick={scrollToForm} className="text-lg px-8 py-6" aria-label="Comparer les assurances RC Pro maintenant">{t('insPage.compareNow')}</Button>
        </div></div>
      </section>
      <div className="container mx-auto px-4 py-12">
        <DynamicUpdateDate />

        <section className="max-w-4xl mx-auto mb-12"><div className="grid md:grid-cols-3 gap-6">{advantages.map((item, index) => (<Card key={index} className="p-6 text-center"><div className="flex justify-center mb-4"><div className="p-3 rounded-full bg-primary/10"><item.icon className="h-8 w-8 text-primary" /></div></div><h2 className="font-bold text-lg mb-2">{item.title}</h2><p className="text-muted-foreground text-sm">{item.description}</p></Card>))}</div></section>
        <div ref={formRef} className="mb-16 min-h-[480px]"><MultiStepQuoteForm insuranceType="rc_pro" /></div>

        <InsuranceSEOTabs
          faqTitle={t('insPage.faqTitle')}
          faqs={[
            { question: t('rcProPage.faq1.q'), answer: t('rcProPage.faq1.a') },
            { question: t('rcProPage.faq2.q'), answer: t('rcProPage.faq2.a') },
            { question: t('rcProPage.faq3.q'), answer: t('rcProPage.faq3.a') },
          ]}
        />

        <InsuranceBottomHub
          currentPage="rcpro"
          ctaTitle={t('rcProPage.ctaTitle')}
          ctaDescription={t('rcProPage.ctaDesc')}
          ctaButtonLabel={t('insPage.compareNowBtn')}
          ctaMascotSrc={arthurFlying}
          ctaMascotAlt="Arthur - RC Pro"
          onCtaClick={scrollToForm}
        />
      </div>
      </main>
      <Footer />
    </div>
  );
};

export default AssuranceRCPro;
