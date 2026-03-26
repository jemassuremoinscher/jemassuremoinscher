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
import arthurThinking from "@/assets/mascotte/arthur-thinking.webp";
import ArthurHero from "@/components/insurance/ArthurHero";
import arthurFlying from "@/assets/mascotte/arthur-idea.webp";
import RelatedInsuranceLinks from "@/components/insurance/RelatedInsuranceLinks";
import EnBref from "@/components/seo/EnBref";
import BrandName from "@/components/BrandName";
import { MultiStepQuoteForm } from "@/components/forms/MultiStepQuoteForm";

const AssurancePret = () => {
  const { t } = useLanguage();
  const formRef = useRef<HTMLDivElement>(null);
  const scrollToForm = () => { formRef.current?.scrollIntoView({ behavior: 'smooth' }); };

  const breadcrumbSchema = addBreadcrumbSchema([{ name: "Accueil", url: "https://www.jemassuremoinscher.fr/" }, { name: "Assurance Prêt", url: "https://www.jemassuremoinscher.fr/assurance-pret" }]);
  const serviceSchema = addServiceSchema({ name: "Comparateur Assurance Prêt Immobilier", description: "Économisez des milliers d'euros sur votre crédit immobilier. Loi Lemoine.", provider: "jemassuremoinscher.fr", areaServed: "France" });
  const faqSchema = addFAQSchema([{ question: t('pretPage.faq1.q'), answer: t('pretPage.faq1.a') }, { question: t('pretPage.faq2.q'), answer: t('pretPage.faq2.a') }]);
  const insuranceProductSchema = addInsuranceProductSchema({ name: "Assurance Emprunteur", description: "Comparateur d'assurance de prêt immobilier. Loi Lemoine : changez à tout moment. Économisez jusqu'à 15 000€.", category: "Assurance Emprunteur", url: "https://www.jemassuremoinscher.fr/assurance-pret" });
  const advantages = [
    { icon: Euro, title: t('pretPage.adv1.title'), description: t('pretPage.adv1.desc') },
    { icon: Clock, title: t('pretPage.adv2.title'), description: t('pretPage.adv2.desc') },
    { icon: Shield, title: t('pretPage.adv3.title'), description: t('pretPage.adv3.desc') }
  ];

  return (
    <div className="min-h-screen">
      <SEOOptimized title="Assurance Emprunteur : Économisez 15 000€ (Lemoine)" description="Loi Lemoine : changez d'assurance de prêt à tout moment. Comparez 50+ assureurs, économisez jusqu'à 50%. Devis gratuit en 2 min." keyword="assurance prêt immobilier moins chère" keywords="assurance emprunteur, loi Lemoine, délégation assurance, changer assurance prêt" canonical="https://www.jemassuremoinscher.fr/assurance-pret" jsonLd={[breadcrumbSchema, serviceSchema, faqSchema, insuranceProductSchema]} />
      <Header />
      <Breadcrumbs items={[{ label: "Assurance Prêt" }]} />
      <main id="main-content">
      <section className="bg-gradient-to-br from-primary/5 to-primary/10 py-16 relative overflow-hidden">
        <div className="container mx-auto px-4"><div className="max-w-4xl mx-auto text-center relative">
          <ArthurHero imageSrc={arthurThinking} imageAlt="Arthur réfléchit - assurance prêt moins chère" speechText={t('pretPage.subtitle')} />
          <h1 className="text-4xl md:text-5xl font-bold text-accent mb-6">{t('pretPage.title')}</h1>
          <Button size="lg" onClick={scrollToForm} className="text-lg px-8 py-6" aria-label="Comparer les assurances emprunteur maintenant">{t('insPage.compareNow')}</Button>
        </div></div>
      </section>
      <div className="container mx-auto px-4 py-12">
        <DynamicUpdateDate />
        <EnBref facts={[<><BrandName /> compare les assurances de prêt immobilier de 25+ assureurs.</>, "Loi Lemoine : changez d'assurance emprunteur à tout moment, sans frais.", "Économie moyenne constatée : jusqu'à 15 000€ sur la durée du prêt.", "Devis gratuit en moins de 2 minutes, sans engagement."]} />
        <section className="max-w-4xl mx-auto mb-12"><div className="grid md:grid-cols-3 gap-6">{advantages.map((item, index) => (<Card key={index} className="p-6 text-center"><div className="flex justify-center mb-4"><div className="p-3 rounded-full bg-primary/10"><item.icon className="h-8 w-8 text-primary" /></div></div><h2 className="font-bold text-lg mb-2">{item.title}</h2><p className="text-muted-foreground text-sm">{item.description}</p></Card>))}</div></section>
        <div ref={formRef} className="mb-16"><MultiStepQuoteForm insuranceType="pret" /></div>
        <section className="max-w-4xl mx-auto mb-16"><Accordion type="single" collapsible className="w-full"><AccordionItem value="learn-more" className="border rounded-lg"><AccordionTrigger className="px-6 py-4 hover:no-underline"><span className="text-lg font-semibold">{t('insPage.learnMore')} {t('pretPage.learnMore')}</span></AccordionTrigger><AccordionContent className="px-6 pb-6"><InsuranceFAQ title={t('insPage.faqTitle')} faqs={[{ question: t('pretPage.faq1.q'), answer: t('pretPage.faq1.a') }, { question: t('pretPage.faq2.q'), answer: t('pretPage.faq2.a') }, { question: t('pretPage.faq3.q'), answer: t('pretPage.faq3.a') }, { question: t('pretPage.faq4.q'), answer: t('pretPage.faq4.a') }]} /></AccordionContent></AccordionItem></Accordion></section>
        <section className="max-w-2xl mx-auto text-center mb-16"><Card className="p-8 bg-primary/5 border-primary/20 relative overflow-visible"><img src={arthurFlying} alt="Arthur - assurance prêt" className="absolute -right-6 -top-10 w-20 h-auto hidden sm:block" width={80} height={100} loading="lazy" /><h2 className="text-2xl font-bold mb-4">{t('pretPage.ctaTitle')}</h2><p className="text-muted-foreground mb-6">{t('pretPage.ctaDesc')}</p><Button size="lg" onClick={scrollToForm} className="w-full max-w-md text-lg py-6">{t('insPage.compareNowBtn')}</Button></Card></section>
        <RelatedInsuranceLinks currentPage="pret" />
      </div>
      </main>
      <Footer />
    </div>
  );
};

export default AssurancePret;
