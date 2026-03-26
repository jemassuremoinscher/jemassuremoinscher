import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Euro, Clock } from "lucide-react";
import { useRef } from "react";
import SEOOptimized from "@/components/SEOOptimized";
import InsuranceFAQ from "@/components/insurance/InsuranceFAQ";
import { addServiceSchema, addFAQSchema, addBreadcrumbSchema, addAggregateRatingSchema, addInsuranceProductSchema } from "@/utils/seoUtils";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useLanguage } from "@/contexts/LanguageContext";
import Breadcrumbs from "@/components/Breadcrumbs";
import DynamicUpdateDate from "@/components/DynamicUpdateDate";
import arthurIdea from "@/assets/mascotte/arthur-idea.webp";
import ArthurHero from "@/components/insurance/ArthurHero";
import arthurFlying from "@/assets/mascotte/arthur-pointing.webp";
import RelatedInsuranceLinks from "@/components/insurance/RelatedInsuranceLinks";
import EnBref from "@/components/seo/EnBref";
import BrandName from "@/components/BrandName";
import { MultiStepQuoteForm } from "@/components/forms/MultiStepQuoteForm";

const AssuranceVie = () => {
  const { t } = useLanguage();
  const formRef = useRef<HTMLDivElement>(null);
  const scrollToForm = () => { formRef.current?.scrollIntoView({ behavior: 'smooth' }); };

  const breadcrumbSchema = addBreadcrumbSchema([{ name: "Accueil", url: "https://www.jemassuremoinscher.fr/" }, { name: "Assurance Vie", url: "https://www.jemassuremoinscher.fr/assurance-vie" }]);
  const serviceSchema = addServiceSchema({ name: "Comparateur Assurance Vie", description: "Comparez les contrats d'assurance vie pour l'épargne et la protection.", provider: "jemassuremoinscher.fr", areaServed: "France" });
  const ratingSchema = addAggregateRatingSchema("Comparateur Assurance Vie", 4.6, 1124);
  const faqSchema = addFAQSchema([{ question: t('viePage.faq1.q'), answer: t('viePage.faq1.a') }, { question: t('viePage.faq2.q'), answer: t('viePage.faq2.a') }]);
  const advantages = [
    { icon: Euro, title: t('viePage.adv1.title'), description: t('viePage.adv1.desc') },
    { icon: Clock, title: t('insPage.quoteIn2min'), description: t('insPage.quoteIn2minDesc') },
    { icon: Shield, title: t('viePage.adv2.title'), description: t('viePage.adv2.desc') }
  ];

  return (
    <div className="min-h-screen">
      <SEOOptimized title="Assurance Vie 2026 : Meilleurs Rendements Comparés" description="Fonds euros, unités de compte, PER : comparez les meilleures assurances vie. Fiscalité avantageuse après 8 ans. Devis gratuit." keyword="assurance vie meilleur rendement" keywords="assurance vie 2026, épargne, placement, transmission patrimoine, PER" canonical="https://www.jemassuremoinscher.fr/assurance-vie" jsonLd={[breadcrumbSchema, serviceSchema, ratingSchema, faqSchema]} />
      <Header />
      <Breadcrumbs items={[{ label: "Assurance Vie" }]} />
      <main id="main-content">
      <section className="bg-gradient-to-br from-primary/5 to-primary/10 py-16 relative overflow-hidden">
        <div className="container mx-auto px-4"><div className="max-w-4xl mx-auto text-center relative">
          <ArthurHero imageSrc={arthurIdea} imageAlt="Arthur réfléchit - assurance vie" speechText={t('viePage.subtitle')} />
          <h1 className="text-4xl md:text-5xl font-bold text-accent mb-6">{t('viePage.title')}</h1>
          <Button size="lg" onClick={scrollToForm} className="text-lg px-8 py-6">{t('insPage.compareNow')}</Button>
        </div></div>
      </section>
      <div className="container mx-auto px-4 py-12">
        <DynamicUpdateDate />
        <EnBref facts={[<><BrandName /> compare les contrats d'assurance vie des meilleurs assureurs.</>, "Fonds euros, unités de compte, PER : toutes les options comparées.", "Fiscalité avantageuse après 8 ans de détention.", "Devis gratuit et personnalisé, sans engagement."]} />
        <section className="max-w-4xl mx-auto mb-12"><div className="grid md:grid-cols-3 gap-6">{advantages.map((item, index) => (<Card key={index} className="p-6 text-center"><div className="flex justify-center mb-4"><div className="p-3 rounded-full bg-primary/10"><item.icon className="h-8 w-8 text-primary" /></div></div><h2 className="font-bold text-lg mb-2">{item.title}</h2><p className="text-muted-foreground text-sm">{item.description}</p></Card>))}</div></section>
        <div ref={formRef} className="mb-16"><MultiStepQuoteForm insuranceType="vie" /></div>
        <section className="max-w-4xl mx-auto mb-16"><Accordion type="single" collapsible className="w-full"><AccordionItem value="learn-more" className="border rounded-lg"><AccordionTrigger className="px-6 py-4 hover:no-underline"><span className="text-lg font-semibold">{t('insPage.learnMore')} {t('viePage.learnMore')}</span></AccordionTrigger><AccordionContent className="px-6 pb-6"><InsuranceFAQ title={t('insPage.faqTitle')} faqs={[{ question: t('viePage.faq1.q'), answer: t('viePage.faq1.a') }, { question: t('viePage.faq2.q'), answer: t('viePage.faq2.a') }, { question: t('viePage.faq3.q'), answer: t('viePage.faq3.a') }]} /></AccordionContent></AccordionItem></Accordion></section>
        <section className="max-w-2xl mx-auto text-center mb-16"><Card className="p-8 bg-primary/5 border-primary/20 relative overflow-visible"><img src={arthurFlying} alt="Arthur - assurance vie" className="absolute -right-6 -top-10 w-20 h-auto hidden sm:block" width={80} height={100} loading="lazy" /><h2 className="text-2xl font-bold mb-4">{t('viePage.ctaTitle')}</h2><p className="text-muted-foreground mb-6">{t('viePage.ctaDesc')}</p><Button size="lg" onClick={scrollToForm} className="w-full max-w-md text-lg py-6">{t('insPage.compareNowBtn')}</Button></Card></section>
        <RelatedInsuranceLinks currentPage="vie" />
      </div>
      </main>
      <Footer />
    </div>
  );
};

export default AssuranceVie;
