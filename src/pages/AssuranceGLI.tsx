import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Euro, Clock } from "lucide-react";
import { useRef } from "react";
import SEOOptimized from "@/components/SEOOptimized";
import InsuranceFAQ from "@/components/insurance/InsuranceFAQ";
import { addServiceSchema, addFAQSchema, addBreadcrumbSchema, addInsuranceProductSchema } from "@/utils/seoUtils";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useLanguage } from "@/contexts/LanguageContext";
import Breadcrumbs from "@/components/Breadcrumbs";
import DynamicUpdateDate from "@/components/DynamicUpdateDate";
import arthurDetective from "@/assets/mascotte/arthur-detective.webp";
import ArthurHero from "@/components/insurance/ArthurHero";
import arthurFlying from "@/assets/mascotte/arthur-question.webp";
import RelatedInsuranceLinks from "@/components/insurance/RelatedInsuranceLinks";
import { MultiStepQuoteForm } from "@/components/forms/MultiStepQuoteForm";

const AssuranceGLI = () => {
  const { t } = useLanguage();
  const formRef = useRef<HTMLDivElement>(null);
  const scrollToForm = () => { formRef.current?.scrollIntoView({ behavior: 'smooth' }); };

  const breadcrumbSchema = addBreadcrumbSchema([{ name: "Accueil", url: "https://www.jemassuremoinscher.fr/" }, { name: "Garantie Loyer Impayé", url: "https://www.jemassuremoinscher.fr/assurance-gli" }]);
  const serviceSchema = addServiceSchema({ name: "Comparateur GLI", description: "Protégez vos revenus locatifs avec une assurance GLI." });
  const faqSchema = addFAQSchema([{ question: t('gliPage.faq1.q'), answer: t('gliPage.faq1.a') }, { question: t('gliPage.faq2.q'), answer: t('gliPage.faq2.a') }, { question: t('gliPage.faq3.q'), answer: t('gliPage.faq3.a') }]);
  const advantages = [
    { icon: Euro, title: t('gliPage.adv1.title'), description: t('gliPage.adv1.desc') },
    { icon: Clock, title: t('insPage.quoteIn2min'), description: t('insPage.quoteIn2minDesc') },
    { icon: Shield, title: t('gliPage.adv2.title'), description: t('gliPage.adv2.desc') }
  ];

  return (
    <div className="min-h-screen">
      <SEOOptimized title="GLI : Garantie Loyer Impayé dès 2,5% du Loyer" description="Loyers impayés, dégradations, frais juridiques : sécurisez vos revenus locatifs. Comparez les GLI de 50+ assureurs. Devis gratuit." keyword="garantie loyer impayé" keywords="assurance GLI, protection bailleur, assurance loyer impayé, GLI comparateur" canonical="https://www.jemassuremoinscher.fr/assurance-gli" jsonLd={[breadcrumbSchema, serviceSchema, faqSchema]} />
      <Header />
      <Breadcrumbs items={[{ label: "Garantie Loyer Impayé" }]} />
      <main id="main-content">
      <section className="bg-gradient-to-br from-primary/5 to-primary/10 py-16 relative overflow-hidden">
        <div className="container mx-auto px-4"><div className="max-w-4xl mx-auto text-center relative">
          <ArthurHero imageSrc={arthurDetective} imageAlt="Arthur détective - GLI" speechText={t('gliPage.subtitle')} />
          <h1 className="text-4xl md:text-5xl font-bold text-accent mb-6">{t('gliPage.title')}</h1>
          <Button size="lg" onClick={scrollToForm} className="text-lg px-8 py-6">{t('insPage.compareNow')}</Button>
        </div></div>
      </section>
      <div className="container mx-auto px-4 py-12">
        <DynamicUpdateDate />
        <section className="max-w-4xl mx-auto mb-12"><div className="grid md:grid-cols-3 gap-6">{advantages.map((item, index) => (<Card key={index} className="p-6 text-center"><div className="flex justify-center mb-4"><div className="p-3 rounded-full bg-primary/10"><item.icon className="h-8 w-8 text-primary" /></div></div><h2 className="font-bold text-lg mb-2">{item.title}</h2><p className="text-muted-foreground text-sm">{item.description}</p></Card>))}</div></section>
        <div ref={formRef} className="mb-16"><MultiStepQuoteForm insuranceType="gli" /></div>
        <section className="max-w-4xl mx-auto mb-16"><Accordion type="single" collapsible className="w-full"><AccordionItem value="learn-more" className="border rounded-lg"><AccordionTrigger className="px-6 py-4 hover:no-underline"><span className="text-lg font-semibold">{t('insPage.learnMore')} {t('gliPage.learnMore')}</span></AccordionTrigger><AccordionContent className="px-6 pb-6"><InsuranceFAQ title={t('insPage.faqTitle')} faqs={[{ question: t('gliPage.faq1.q'), answer: t('gliPage.faq1.a') }, { question: t('gliPage.faq2.q'), answer: t('gliPage.faq2.a') }, { question: t('gliPage.faq3.q'), answer: t('gliPage.faq3.a') }]} /></AccordionContent></AccordionItem></Accordion></section>
        <section className="max-w-2xl mx-auto text-center mb-16"><Card className="p-8 bg-primary/5 border-primary/20 relative overflow-visible"><img src={arthurFlying} alt="Arthur - GLI" className="absolute -right-6 -top-10 w-20 h-auto hidden sm:block" width={80} height={100} loading="lazy" /><h2 className="text-2xl font-bold mb-4">{t('gliPage.ctaTitle')}</h2><p className="text-muted-foreground mb-6">{t('gliPage.ctaDesc')}</p><Button size="lg" onClick={scrollToForm} className="w-full max-w-md text-lg py-6">{t('insPage.compareNowBtn')}</Button></Card></section>
        <RelatedInsuranceLinks currentPage="gli" />
      </div>
      </main>
      <Footer />
    </div>
  );
};

export default AssuranceGLI;
