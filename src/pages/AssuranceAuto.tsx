import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Shield, Euro, Clock, Calculator, ArrowRight } from "lucide-react";
import { useRef } from "react";
import SEOOptimized from "@/components/SEOOptimized";
import InsuranceFAQ from "@/components/insurance/InsuranceFAQ";
import { addServiceSchema, addFAQSchema, addAggregateRatingSchema, addHowToSchema, addInsuranceProductSchema } from "@/utils/seoUtils";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import arthurCar from "@/assets/mascotte/arthur-car.webp";
import ArthurHero from "@/components/insurance/ArthurHero";
import ExpertiseSection from "@/components/insurance/ExpertiseSection";
import RelatedInsuranceLinks from "@/components/insurance/RelatedInsuranceLinks";
import EnBref from "@/components/seo/EnBref";
import BrandName from "@/components/BrandName";
import arthurFlying from "@/assets/mascotte/arthur-sprint-coin.webp";
import { useLanguage } from "@/contexts/LanguageContext";
import Breadcrumbs from "@/components/Breadcrumbs";
import DynamicUpdateDate from "@/components/DynamicUpdateDate";
import { MultiStepQuoteForm } from "@/components/forms/MultiStepQuoteForm";

const AssuranceAuto = () => {
  const { t } = useLanguage();
  const formRef = useRef<HTMLDivElement>(null);
  const scrollToForm = () => { formRef.current?.scrollIntoView({ behavior: 'smooth' }); };

  const serviceSchema = addServiceSchema({ name: "Comparateur Assurance Auto", description: "Comparez les meilleures offres d'assurance auto en France. Devis gratuit et personnalisé en 2 minutes. Économisez jusqu'à 400€ par an.", provider: "jemassuremoinscher.fr", areaServed: "France" });
  const ratingSchema = addAggregateRatingSchema("Comparateur Assurance Auto", 4.7, 1853);
  const howToSchema = addHowToSchema({ name: "Comment obtenir un devis d'assurance auto en ligne", description: "Guide étape par étape pour comparer et obtenir votre devis d'assurance auto en 2 minutes", totalTime: "PT2M", steps: [{ name: "Renseignez les informations de votre véhicule", text: "Indiquez la marque, le modèle, la date de mise en circulation et l'usage de votre véhicule." }, { name: "Précisez votre profil de conducteur", text: "Renseignez votre âge, votre ancienneté de permis et votre coefficient bonus-malus." }, { name: "Comparez les offres disponibles", text: "Recevez instantanément plusieurs devis d'assureurs partenaires." }, { name: "Faites-vous rappeler", text: "Sélectionnez l'offre qui vous convient et demandez à être rappelé par un conseiller." }] });
  const faqSchema = addFAQSchema([{ question: "Quelle assurance auto choisir ?", answer: "Le choix dépend de votre profil, votre véhicule et votre budget. Notre comparateur vous aide à trouver l'offre la mieux adaptée." }, { question: "Combien coûte une assurance auto ?", answer: "Le prix varie selon votre âge, votre véhicule, votre historique et votre lieu de résidence. En moyenne, entre 400€ et 800€ par an." }, { question: "Puis-je changer d'assurance auto à tout moment ?", answer: "Oui, grâce à la loi Hamon, vous pouvez résilier après un an sans frais ni justification." }]);
  const insuranceProductSchema = addInsuranceProductSchema({ name: "Assurance Auto", description: "Comparateur d'assurance auto. Comparez les offres de 25+ assureurs et économisez jusqu'à 320€/an.", category: "Assurance Automobile", url: "https://www.jemassuremoinscher.fr/assurance-auto", ratingValue: 4.7, reviewCount: 1853 });

  const advantages = [
    { icon: Euro, title: t('autoPage.adv1.title'), description: t('autoPage.adv1.desc') },
    { icon: Clock, title: t('insPage.quoteIn2min'), description: t('insPage.quoteIn2minDesc') },
    { icon: Shield, title: t('autoPage.adv2.title'), description: t('autoPage.adv2.desc') }
  ];

  return (
    <div className="min-h-screen">
      <SEOOptimized title="Assurance Auto Moins Chère : -40% en 2 min ⭐" description="50+ assureurs comparés gratuitement. Nos clients économisent 320€/an en moyenne. Devis auto instantané, sans engagement." keyword="assurance auto moins chère" keywords="assurance auto moins cher, comparateur assurance auto, devis assurance voiture, changer assurance auto" canonical="https://www.jemassuremoinscher.fr/assurance-auto" jsonLd={[serviceSchema, ratingSchema, howToSchema, faqSchema, insuranceProductSchema]} />
      <Header />
      <Breadcrumbs items={[{ label: "Assurance Auto" }]} />

      <main id="main-content">
      <section className="bg-gradient-to-br from-primary/5 to-primary/10 py-16 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center relative">
            <ArthurHero imageSrc={arthurCar} imageAlt="Arthur en voiture - assurance auto moins chère" speechText={t('autoPage.subtitle')} />
            <h1 className="text-4xl md:text-5xl font-bold text-accent mb-6">{t('autoPage.title')}</h1>
            <Button size="lg" onClick={scrollToForm} className="text-lg px-8 py-6" aria-label="Comparer les assurances auto maintenant">{t('insPage.compareNow')}</Button>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12" data-ai-description="Comparateur d'assurance auto — jemassuremoinscher.fr compare 25+ assureurs, devis gratuit en moins de 2 minutes, économie moyenne 320€/an">
        <DynamicUpdateDate />
        <EnBref facts={[<><BrandName /> compare les offres de 25+ assureurs auto partenaires.</>, "Tarif moyen constaté : dès 25€/mois selon le profil.", "Devis gratuit en moins de 2 minutes, sans engagement.", "Nos clients économisent en moyenne 320€/an sur leur assurance auto."]} />
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

        <div ref={formRef} className="mb-16">
          <MultiStepQuoteForm insuranceType="auto" />
        </div>

        <section className="max-w-4xl mx-auto mb-16">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="learn-more" className="border rounded-lg">
              <AccordionTrigger className="px-6 py-4 hover:no-underline">
                <span className="text-lg font-semibold flex items-center gap-2">{t('insPage.learnMore')} {t('autoPage.learnMore')}</span>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6">
                <div className="space-y-12">
                  <InsuranceFAQ title={t('insPage.faqTitle')} faqs={[
                    { question: t('autoPage.faq1.q'), answer: t('autoPage.faq1.a') },
                    { question: t('autoPage.faq2.q'), answer: t('autoPage.faq2.a') },
                    { question: t('autoPage.faq3.q'), answer: t('autoPage.faq3.a') },
                    { question: t('autoPage.faq4.q'), answer: t('autoPage.faq4.a') },
                  ]} />
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        {/* Bonus-Malus Calculator CTA */}
        <section className="max-w-4xl mx-auto mb-16">
          <Card className="p-6 md:p-8 border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5">
            <div className="flex flex-col sm:flex-row items-center gap-5">
              <div className="flex-shrink-0 p-3 rounded-full bg-primary/10">
                <Calculator className="h-8 w-8 text-primary" />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-lg font-bold text-foreground mb-1">Calculez votre bonus-malus auto</h3>
                <p className="text-sm text-muted-foreground">Estimez gratuitement votre coefficient et découvrez combien vous pouvez économiser sur votre prime.</p>
              </div>
              <Button asChild variant="outline" className="flex-shrink-0 border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                <Link to="/outils/calculateur-bonus-malus">
                  Calculer mon bonus
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            </div>
          </Card>
        </section>

        <ExpertiseSection insuranceType="assurance auto" />
        <RelatedInsuranceLinks currentPage="auto" />

        <section className="max-w-2xl mx-auto text-center mb-16">
          <Card className="p-8 bg-primary/5 border-primary/20 relative overflow-visible">
            <img src={arthurFlying} alt="Arthur en vol - économisez sur votre assurance auto" className="absolute -right-6 -top-10 w-20 h-auto hidden sm:block" width={80} height={100} loading="lazy" decoding="async" />
            <h2 className="text-2xl font-bold mb-4">{t('insPage.readyToSave')} {t('autoPage.readyToSave')} ?</h2>
            <p className="text-muted-foreground mb-6">{t('insPage.compareFree')}</p>
            <Button size="lg" onClick={scrollToForm} className="w-full max-w-md text-lg py-6">{t('insPage.compareNowBtn')}</Button>
          </Card>
        </section>
      </div>
      </main>
      <Footer />
    </div>
  );
};

export default AssuranceAuto;
