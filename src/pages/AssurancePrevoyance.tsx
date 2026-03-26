import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Heart, Clock } from "lucide-react";
import { useRef } from "react";
import SEOOptimized from "@/components/SEOOptimized";
import InsuranceFAQ from "@/components/insurance/InsuranceFAQ";
import { addServiceSchema, addFAQSchema, addBreadcrumbSchema, addInsuranceProductSchema } from "@/utils/seoUtils";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useLanguage } from "@/contexts/LanguageContext";
import Breadcrumbs from "@/components/Breadcrumbs";
import DynamicUpdateDate from "@/components/DynamicUpdateDate";
import arthurInjured from "@/assets/mascotte/arthur-injured.webp";
import ArthurHero from "@/components/insurance/ArthurHero";
import arthurFlying from "@/assets/mascotte/arthur-confident.webp";
import RelatedInsuranceLinks from "@/components/insurance/RelatedInsuranceLinks";
import EnBref from "@/components/seo/EnBref";
import BrandName from "@/components/BrandName";
import { MultiStepQuoteForm } from "@/components/forms/MultiStepQuoteForm";

const AssurancePrevoyance = () => {
  const { t } = useLanguage();
  const formRef = useRef<HTMLDivElement>(null);
  const scrollToForm = () => { formRef.current?.scrollIntoView({ behavior: 'smooth' }); };

  const breadcrumbSchema = addBreadcrumbSchema([{ name: "Accueil", url: "https://www.jemassuremoinscher.fr/" }, { name: "Assurance Prévoyance", url: "https://www.jemassuremoinscher.fr/assurance-prevoyance" }]);
  const serviceSchema = addServiceSchema({ name: "Comparateur Assurance Prévoyance", description: "Comparez les meilleures assurances prévoyance.", provider: "jemassuremoinscher.fr", areaServed: "France" });
  const faqSchema = addFAQSchema([{ question: t('prevoyancePage.faq1.q'), answer: t('prevoyancePage.faq1.a') }, { question: t('prevoyancePage.faq2.q'), answer: t('prevoyancePage.faq2.a') }]);
  const insuranceProductSchema = addInsuranceProductSchema({ name: "Assurance Prévoyance", description: "Comparateur d'assurance prévoyance. Décès, invalidité, obsèques : protégez votre famille dès 9€/mois.", category: "Assurance Prévoyance", url: "https://www.jemassuremoinscher.fr/assurance-prevoyance" });
  const advantages = [
    { icon: Heart, title: t('prevoyancePage.adv1.title'), description: t('prevoyancePage.adv1.desc') },
    { icon: Clock, title: t('insPage.quoteIn2min'), description: t('insPage.quoteIn2minDesc') },
    { icon: Shield, title: t('prevoyancePage.adv2.title'), description: t('prevoyancePage.adv2.desc') }
  ];

  return (
    <div className="min-h-screen">
      <SEOOptimized title="Prévoyance : Protégez Votre Famille dès 9€/mois" description="Décès, invalidité, obsèques : comparez les garanties prévoyance de 50+ assureurs. Devis personnalisé gratuit en 2 min." keyword="assurance prévoyance" keywords="assurance décès, assurance obsèques, dépendance, prévoyance TNS" canonical="https://www.jemassuremoinscher.fr/assurance-prevoyance" jsonLd={[breadcrumbSchema, serviceSchema, faqSchema, insuranceProductSchema]} />
      <Header />
      <Breadcrumbs items={[{ label: "Assurance Prévoyance" }]} />
      <main id="main-content">
      <section className="bg-gradient-to-br from-primary/5 to-primary/10 py-16 relative overflow-hidden">
        <div className="container mx-auto px-4"><div className="max-w-4xl mx-auto text-center relative">
          <ArthurHero imageSrc={arthurInjured} imageAlt="Arthur blessé - prévoyance" speechText={t('prevoyancePage.subtitle')} />
          <h1 className="text-4xl md:text-5xl font-bold text-accent mb-6">{t('prevoyancePage.title')}</h1>
          <Button size="lg" onClick={scrollToForm} className="text-lg px-8 py-6" aria-label="Comparer les assurances prévoyance maintenant">{t('insPage.compareNow')}</Button>
        </div></div>
      </section>
      <div className="container mx-auto px-4 py-12">
        <DynamicUpdateDate />
        <EnBref facts={[<><BrandName /> compare les assurances prévoyance de 25+ assureurs.</>, "Prévoyance dès 9€/mois : décès, invalidité, incapacité, obsèques.", "Protégez votre famille avec un contrat adapté à votre situation.", "Devis gratuit en moins de 2 minutes, sans engagement."]} />
        <section className="max-w-4xl mx-auto mb-12"><div className="grid md:grid-cols-3 gap-6">{advantages.map((item, index) => (<Card key={index} className="p-6 text-center"><div className="flex justify-center mb-4"><div className="p-3 rounded-full bg-primary/10"><item.icon className="h-8 w-8 text-primary" /></div></div><h2 className="font-bold text-lg mb-2">{item.title}</h2><p className="text-muted-foreground text-sm">{item.description}</p></Card>))}</div></section>
        <div ref={formRef} className="mb-16"><MultiStepQuoteForm insuranceType="prevoyance" /></div>
        <section className="max-w-4xl mx-auto mb-16"><Accordion type="single" collapsible className="w-full"><AccordionItem value="learn-more" className="border rounded-lg"><AccordionTrigger className="px-6 py-4 hover:no-underline"><span className="text-lg font-semibold">{t('insPage.learnMore')} {t('prevoyancePage.learnMore')}</span></AccordionTrigger><AccordionContent className="px-6 pb-6"><InsuranceFAQ title={t('insPage.faqTitle')} faqs={[{ question: t('prevoyancePage.faq1.q'), answer: t('prevoyancePage.faq1.a') }, { question: t('prevoyancePage.faq2.q'), answer: t('prevoyancePage.faq2.a') }, { question: t('prevoyancePage.faq3.q'), answer: t('prevoyancePage.faq3.a') }]} /></AccordionContent></AccordionItem></Accordion></section>
        <section className="max-w-2xl mx-auto text-center mb-16"><Card className="p-8 bg-primary/5 border-primary/20 relative overflow-visible"><img src={arthurFlying} alt="Arthur - prévoyance" className="absolute -right-6 -top-10 w-20 h-auto hidden sm:block" width={80} height={100} loading="lazy" /><h2 className="text-2xl font-bold mb-4">{t('prevoyancePage.ctaTitle')}</h2><p className="text-muted-foreground mb-6">{t('prevoyancePage.ctaDesc')}</p><Button size="lg" onClick={scrollToForm} className="w-full max-w-md text-lg py-6">{t('insPage.compareNowBtn')}</Button></Card></section>
        <RelatedInsuranceLinks currentPage="prevoyance" />
      </div>
      </main>
      <Footer />
    </div>
  );
};

export default AssurancePrevoyance;
