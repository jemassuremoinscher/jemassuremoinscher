import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart, Shield, Euro, Clock } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { useState, useRef } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import InsuranceComparison from "@/components/InsuranceComparison";
import { healthInsurers, generateInsurerOffers } from "@/utils/insurerData";
import SEO from "@/components/SEO";
import InsuranceFAQ from "@/components/insurance/InsuranceFAQ";
import Testimonials from "@/components/Testimonials";
import { SavingsCalculator } from "@/components/calculator/SavingsCalculator";
import { QuoteRequestForm } from "@/components/forms/QuoteRequestForm";
import { addServiceSchema, addFAQSchema, addBreadcrumbSchema, addAggregateRatingSchema } from "@/utils/seoUtils";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import arthurThumbsUp from "@/assets/mascotte/arthur-thumbs-up.png";
import arthurFlying from "@/assets/mascotte/arthur-flying.png";
import { useLanguage } from "@/contexts/LanguageContext";

const formSchema = z.object({
  situation: z.string().min(1, "Champ requis"),
  age: z.string().min(1, "Champ requis"),
  regime: z.string().min(1, "Champ requis"),
  niveau: z.string().min(1, "Champ requis"),
  codePostal: z.string().length(5, "Code postal invalide"),
});

const AssuranceSante = () => {
  const { t } = useLanguage();
  const [insurerOffers, setInsurerOffers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [submittedFormData, setSubmittedFormData] = useState<Record<string, any>>({});
  const formRef = useRef<HTMLDivElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { situation: "", age: "", regime: "", niveau: "", codePostal: "" },
  });

  const scrollToForm = () => { formRef.current?.scrollIntoView({ behavior: 'smooth' }); };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      setSubmittedFormData(values);
      const basePrice = 45;
      const ageValue = parseInt(values.age);
      let price = basePrice;
      if (values.situation === "famille") price += 150;
      else if (values.situation === "couple") price += 80;
      if (ageValue > 60) price += 40;
      else if (ageValue > 50) price += 25;
      else if (ageValue > 40) price += 15;
      else if (ageValue < 25) price -= 5;
      if (values.niveau === "premium") price += 80;
      else if (values.niveau === "confort") price += 50;
      else if (values.niveau === "equilibre") price += 25;
      const randomVariation = Math.floor(Math.random() * 20) - 10;
      price += randomVariation;
      const offers = generateInsurerOffers(price, healthInsurers);
      setInsurerOffers(offers);
      toast.success(t('insPage.toast.success'), { description: t('insPage.toast.successDesc') });
    } catch (error: any) {
      console.error("Error:", error);
      toast.error(t('insPage.toast.error'), { description: t('insPage.toast.errorDesc') });
    } finally { setIsLoading(false); }
  };

  const breadcrumbSchema = addBreadcrumbSchema([{ name: "Accueil", url: "https://www.jemassuremoinscher.fr/" }, { name: "Mutuelle Santé", url: "https://www.jemassuremoinscher.fr/assurance-sante" }]);
  const serviceSchema = addServiceSchema({ name: "Comparateur Mutuelle Santé", description: "Comparez les meilleures mutuelles santé en France. Devis gratuit et personnalisé en 2 minutes.", provider: "jemassuremoinscher", areaServed: "France" });
  const ratingSchema = addAggregateRatingSchema("Comparateur Mutuelle Santé", 4.6, 1642);
  const faqSchema = addFAQSchema([{ question: "Qu'est-ce qu'une mutuelle santé ?", answer: "Une mutuelle santé rembourse tout ou partie des dépenses de santé non couvertes par la Sécurité sociale." }, { question: "Comment choisir sa mutuelle santé ?", answer: "Choisissez selon vos besoins : niveau de remboursement optique/dentaire, délais de carence et votre budget." }, { question: "Combien coûte une mutuelle santé ?", answer: "Le prix varie selon votre âge, situation familiale et niveau de garanties. Comptez entre 45€ et 200€/mois." }]);

  const advantages = [
    { icon: Euro, title: t('santePage.adv1.title'), description: t('santePage.adv1.desc') },
    { icon: Clock, title: t('insPage.quoteIn2min'), description: t('insPage.quoteIn2minDesc') },
    { icon: Shield, title: t('santePage.adv2.title'), description: t('santePage.adv2.desc') }
  ];

  return (
    <div className="min-h-screen">
      <SEO title="Mutuelle Santé - Comparez et Économisez | jemassuremoinscher" description="Comparez les mutuelles santé en France. Devis gratuit en 2 minutes. Économisez jusqu'à 300€/an." keywords="mutuelle santé, complémentaire santé, comparateur mutuelle, mutuelle pas cher" canonical="https://www.jemassuremoinscher.fr/assurance-sante" jsonLd={[breadcrumbSchema, serviceSchema, ratingSchema, faqSchema]} />
      <Header />

      <section className="bg-gradient-to-br from-primary/5 to-primary/10 py-16 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center relative">
            <img src={arthurThumbsUp} alt="Arthur" className="hidden lg:block absolute -left-32 bottom-0 w-32 h-auto" />
            <div className="flex justify-center mb-6"><div className="p-4 rounded-full bg-primary/10"><Heart className="h-12 w-12 text-primary" /></div></div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">{t('santePage.title')}</h1>
            <p className="text-xl text-muted-foreground mb-8">{t('santePage.subtitle')}</p>
            <Button size="lg" onClick={scrollToForm} className="text-lg px-8 py-6">{t('insPage.compareNow')}</Button>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-12">
        <section className="max-w-4xl mx-auto mb-12">
          <div className="grid md:grid-cols-3 gap-6">
            {advantages.map((item, index) => (
              <Card key={index} className="p-6 text-center">
                <div className="flex justify-center mb-4"><div className="p-3 rounded-full bg-primary/10"><item.icon className="h-8 w-8 text-primary" /></div></div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.description}</p>
              </Card>
            ))}
          </div>
        </section>

        <div ref={formRef} className="max-w-3xl mx-auto mb-16">
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-6 text-card-foreground">{t('insPage.getQuote')}</h2>
            {insurerOffers.length > 0 ? (
              <InsuranceComparison insurers={insurerOffers} onNewQuote={() => setInsurerOffers([])} formData={submittedFormData} insuranceType="Mutuelle Santé" />
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField control={form.control} name="situation" render={({ field }) => (
                    <FormItem><FormLabel>{t('santePage.form.situation')}</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder={t('insPage.select')} /></SelectTrigger></FormControl><SelectContent><SelectItem value="celibataire">{t('santePage.form.single')}</SelectItem><SelectItem value="couple">{t('santePage.form.couple')}</SelectItem><SelectItem value="famille">{t('santePage.form.family')}</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="age" render={({ field }) => (
                    <FormItem><FormLabel>{t('insPage.yourAge')}</FormLabel><FormControl><Input type="number" placeholder="30" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="regime" render={({ field }) => (
                    <FormItem><FormLabel>{t('santePage.form.regime')}</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder={t('insPage.select')} /></SelectTrigger></FormControl><SelectContent><SelectItem value="general">{t('santePage.form.regimeGeneral')}</SelectItem><SelectItem value="alsace-moselle">{t('santePage.form.alsace')}</SelectItem><SelectItem value="tns">{t('santePage.form.tns')}</SelectItem><SelectItem value="agricole">{t('santePage.form.agricole')}</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="niveau" render={({ field }) => (
                    <FormItem><FormLabel>{t('santePage.form.level')}</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder={t('insPage.select')} /></SelectTrigger></FormControl><SelectContent><SelectItem value="economique">{t('santePage.form.economique')}</SelectItem><SelectItem value="equilibre">{t('santePage.form.equilibre')}</SelectItem><SelectItem value="confort">{t('santePage.form.confort')}</SelectItem><SelectItem value="premium">{t('santePage.form.premium')}</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="codePostal" render={({ field }) => (
                    <FormItem><FormLabel>{t('insPage.postalCode')}</FormLabel><FormControl><Input placeholder="75001" maxLength={5} {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <Button type="submit" className="w-full" size="lg" disabled={isLoading}>{isLoading ? t('insPage.loading') : t('insPage.compareOffers')}</Button>
                </form>
              </Form>
            )}
          </Card>
        </div>

        <section className="max-w-4xl mx-auto mb-16">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="learn-more" className="border rounded-lg">
              <AccordionTrigger className="px-6 py-4 hover:no-underline"><span className="text-lg font-semibold flex items-center gap-2">{t('insPage.learnMore')} {t('santePage.learnMore')}</span></AccordionTrigger>
              <AccordionContent className="px-6 pb-6">
                <div className="space-y-12">
                  <InsuranceFAQ title={t('insPage.faqTitle')} faqs={[
                    { question: t('santePage.faq1.q'), answer: t('santePage.faq1.a') },
                    { question: t('santePage.faq2.q'), answer: t('santePage.faq2.a') },
                    { question: t('santePage.faq3.q'), answer: t('santePage.faq3.a') },
                    { question: t('santePage.faq4.q'), answer: t('santePage.faq4.a') },
                  ]} />
                  <SavingsCalculator />
                  <QuoteRequestForm />
                  <Testimonials />
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        <section className="max-w-2xl mx-auto text-center mb-16">
          <Card className="p-8 bg-primary/5 border-primary/20 relative overflow-visible">
            <img src={arthurFlying} alt="Arthur" className="absolute -right-6 -top-10 w-20 h-auto hidden sm:block" />
            <h2 className="text-2xl font-bold mb-4">{t('insPage.readyToSave')} {t('santePage.readyToSave')} ?</h2>
            <p className="text-muted-foreground mb-6">{t('insPage.compareFree')}</p>
            <Button size="lg" onClick={scrollToForm} className="w-full max-w-md text-lg py-6">{t('insPage.compareNowBtn')}</Button>
          </Card>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AssuranceSante;
