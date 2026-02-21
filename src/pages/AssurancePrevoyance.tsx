import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, Heart, Euro, Clock } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { useState, useRef } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import InsuranceComparison from "@/components/InsuranceComparison";
import { generateInsurerOffers, InsurerConfig } from "@/utils/insurerData";
import SEO from "@/components/SEO";
import InsuranceFAQ from "@/components/insurance/InsuranceFAQ";
import Testimonials from "@/components/Testimonials";
import { SavingsCalculator } from "@/components/calculator/SavingsCalculator";
import { QuoteRequestForm } from "@/components/forms/QuoteRequestForm";
import { addServiceSchema, addFAQSchema, addBreadcrumbSchema } from "@/utils/seoUtils";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useLanguage } from "@/contexts/LanguageContext";
import arthurThumbsUp from "@/assets/mascotte/arthur-thumbs-up.png";
import arthurFlying from "@/assets/mascotte/arthur-flying.png";

const formSchema = z.object({
  typePrevoyance: z.string().min(1, "Champ requis"),
  situation: z.string().min(1, "Champ requis"),
  age: z.string().min(1, "Champ requis"),
  profession: z.string().min(1, "Champ requis"),
  codePostal: z.string().length(5, "Code postal invalide"),
});

const prevoyanceInsurers: InsurerConfig[] = [
  { name: "AXA", priceMultiplier: 1.05, coverage: ["Capital décès garanti", "Rente conjoint", "Rente éducation"] },
  { name: "Generali", priceMultiplier: 1.02, coverage: ["Protection famille", "Capital décès doublé accident", "Rente invalidité"], discount: "-10% en ligne" },
  { name: "Swiss Life", priceMultiplier: 1.10, coverage: ["Capital décès majoré", "Garantie dépendance incluse", "Assistance psychologique"] },
  { name: "AG2R La Mondiale", priceMultiplier: 0.98, coverage: ["Capital décès", "Rente éducation", "Garantie obsèques"], discount: "-12% nouveau client" },
  { name: "Malakoff Humanis", priceMultiplier: 1.00, coverage: ["Protection complète", "Capital invalidité", "Services d'assistance"] },
  { name: "MetLife", priceMultiplier: 0.95, coverage: ["Capital décès modulable", "Garantie ITT", "Frais d'obsèques"] },
];

const AssurancePrevoyance = () => {
  const { t } = useLanguage();
  const [insurerOffers, setInsurerOffers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [submittedFormData, setSubmittedFormData] = useState<Record<string, any>>({});
  const formRef = useRef<HTMLDivElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { typePrevoyance: "", situation: "", age: "", profession: "", codePostal: "" },
  });

  const scrollToForm = () => { formRef.current?.scrollIntoView({ behavior: 'smooth' }); };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      setSubmittedFormData(values);
      const basePrice = 30;
      let price = basePrice;
      const age = parseInt(values.age);
      if (age > 60) price += 45; else if (age > 50) price += 30; else if (age > 40) price += 18; else if (age > 30) price += 10;
      if (values.typePrevoyance === "deces") price += 25; else if (values.typePrevoyance === "obseques") price += 12; else if (values.typePrevoyance === "dependance") price += 40; else if (values.typePrevoyance === "complete") price += 50;
      if (values.situation === "marie-enfants") price += 15; else if (values.situation === "marie") price += 8;
      if (values.profession === "risque") price += 25;
      const randomVariation = Math.floor(Math.random() * 15) - 7;
      price += randomVariation;
      const offers = generateInsurerOffers(price, prevoyanceInsurers);
      setInsurerOffers(offers);
      toast.success(t('insPage.toast.success'), { description: t('insPage.toast.successDesc') });
    } catch (error: any) {
      console.error("Error:", error);
      toast.error(t('insPage.toast.error'), { description: t('insPage.toast.errorDesc') });
    } finally { setIsLoading(false); }
  };

  const breadcrumbSchema = addBreadcrumbSchema([{ name: "Accueil", url: "https://www.jemassuremoinscher.fr/" }, { name: "Assurance Prévoyance", url: "https://www.jemassuremoinscher.fr/assurance-prevoyance" }]);
  const serviceSchema = addServiceSchema({ name: "Comparateur Assurance Prévoyance", description: "Comparez les meilleures assurances prévoyance.", provider: "jemassuremoinscher", areaServed: "France" });
  const faqSchema = addFAQSchema([
    { question: t('prevoyancePage.faq1.q'), answer: t('prevoyancePage.faq1.a') },
    { question: t('prevoyancePage.faq2.q'), answer: t('prevoyancePage.faq2.a') }
  ]);

  const advantages = [
    { icon: Heart, title: t('prevoyancePage.adv1.title'), description: t('prevoyancePage.adv1.desc') },
    { icon: Clock, title: t('insPage.quoteIn2min'), description: t('insPage.quoteIn2minDesc') },
    { icon: Shield, title: t('prevoyancePage.adv2.title'), description: t('prevoyancePage.adv2.desc') }
  ];

  return (
    <div className="min-h-screen">
      <SEO title="Prévoyance - Protégez votre avenir | jemassuremoinscher" description="Comparez les meilleures assurances prévoyance : décès, obsèques, dépendance. Devis gratuit." keywords="assurance prévoyance, assurance décès, assurance obsèques, assurance dépendance" canonical="https://www.jemassuremoinscher.fr/assurance-prevoyance" jsonLd={[breadcrumbSchema, serviceSchema, faqSchema]} />
      <Header />
      <section className="bg-gradient-to-br from-primary/5 to-primary/10 py-16 relative overflow-hidden">
        <div className="container mx-auto px-4"><div className="max-w-4xl mx-auto text-center relative">
          <img src={arthurThumbsUp} alt="Arthur" className="hidden lg:block absolute -left-32 bottom-0 w-32 h-auto" />
          <div className="flex justify-center mb-6"><div className="p-4 rounded-full bg-primary/10"><Shield className="h-12 w-12 text-primary" /></div></div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">{t('prevoyancePage.title')}</h1>
          <p className="text-xl text-muted-foreground mb-8">{t('prevoyancePage.subtitle')}</p>
          <Button size="lg" onClick={scrollToForm} className="text-lg px-8 py-6">{t('insPage.compareNow')}</Button>
        </div></div>
      </section>
      <main className="container mx-auto px-4 py-12">
        <section className="max-w-4xl mx-auto mb-12"><div className="grid md:grid-cols-3 gap-6">{advantages.map((item, index) => (<Card key={index} className="p-6 text-center"><div className="flex justify-center mb-4"><div className="p-3 rounded-full bg-primary/10"><item.icon className="h-8 w-8 text-primary" /></div></div><h3 className="font-bold text-lg mb-2">{item.title}</h3><p className="text-muted-foreground text-sm">{item.description}</p></Card>))}</div></section>
        <div ref={formRef} className="max-w-3xl mx-auto mb-16">
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-6 text-card-foreground">{t('insPage.getQuote')}</h2>
            {insurerOffers.length > 0 ? (
              <InsuranceComparison insurers={insurerOffers} onNewQuote={() => setInsurerOffers([])} formData={submittedFormData} insuranceType="Prévoyance" />
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="typePrevoyance" render={({ field }) => (<FormItem><FormLabel>{t('prevoyancePage.form.type')}</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder={t('insPage.select')} /></SelectTrigger></FormControl><SelectContent><SelectItem value="deces">{t('prevoyancePage.form.deces')}</SelectItem><SelectItem value="obseques">{t('prevoyancePage.form.obseques')}</SelectItem><SelectItem value="dependance">{t('prevoyancePage.form.dependance')}</SelectItem><SelectItem value="incapacite">{t('prevoyancePage.form.incapacite')}</SelectItem><SelectItem value="invalidite">{t('prevoyancePage.form.invalidite')}</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="situation" render={({ field }) => (<FormItem><FormLabel>{t('prevoyancePage.form.situation')}</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder={t('insPage.select')} /></SelectTrigger></FormControl><SelectContent><SelectItem value="celibataire">{t('prevoyancePage.form.celibataire')}</SelectItem><SelectItem value="marie">{t('prevoyancePage.form.marie')}</SelectItem><SelectItem value="pacse">{t('prevoyancePage.form.pacse')}</SelectItem><SelectItem value="divorce">{t('prevoyancePage.form.divorce')}</SelectItem><SelectItem value="veuf">{t('prevoyancePage.form.veuf')}</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="age" render={({ field }) => (<FormItem><FormLabel>{t('insPage.yourAge')}</FormLabel><FormControl><Input type="number" placeholder="35" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="profession" render={({ field }) => (<FormItem><FormLabel>{t('prevoyancePage.form.profession')}</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder={t('insPage.select')} /></SelectTrigger></FormControl><SelectContent><SelectItem value="salarie">{t('pretPage.form.salarie')}</SelectItem><SelectItem value="independant">{t('pretPage.form.independant')}</SelectItem><SelectItem value="fonctionnaire">{t('pretPage.form.fonctionnaire')}</SelectItem><SelectItem value="retraite">{t('prevoyancePage.form.retraite')}</SelectItem><SelectItem value="risque">{t('prevoyancePage.form.risque')}</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="codePostal" render={({ field }) => (<FormItem><FormLabel>{t('insPage.postalCode')}</FormLabel><FormControl><Input placeholder="75001" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  </div>
                  <Button type="submit" className="w-full" size="lg" disabled={isLoading}>{isLoading ? t('insPage.loading') : t('insPage.compareOffers')}</Button>
                </form>
              </Form>
            )}
          </Card>
        </div>
        <section className="max-w-4xl mx-auto mb-16"><Accordion type="single" collapsible className="w-full"><AccordionItem value="learn-more" className="border rounded-lg"><AccordionTrigger className="px-6 py-4 hover:no-underline"><span className="text-lg font-semibold">{t('insPage.learnMore')} {t('prevoyancePage.learnMore')}</span></AccordionTrigger><AccordionContent className="px-6 pb-6"><div className="space-y-12"><InsuranceFAQ title={t('insPage.faqTitle')} faqs={[{ question: t('prevoyancePage.faq1.q'), answer: t('prevoyancePage.faq1.a') }, { question: t('prevoyancePage.faq2.q'), answer: t('prevoyancePage.faq2.a') }, { question: t('prevoyancePage.faq3.q'), answer: t('prevoyancePage.faq3.a') }]} /><SavingsCalculator /><QuoteRequestForm /><Testimonials /></div></AccordionContent></AccordionItem></Accordion></section>
        <section className="max-w-2xl mx-auto text-center mb-16">
          <Card className="p-8 bg-primary/5 border-primary/20 relative overflow-visible">
            <img src={arthurFlying} alt="Arthur" className="absolute -right-6 -top-10 w-20 h-auto hidden sm:block" />
            <h2 className="text-2xl font-bold mb-4">{t('prevoyancePage.ctaTitle')}</h2>
            <p className="text-muted-foreground mb-6">{t('prevoyancePage.ctaDesc')}</p>
            <Button size="lg" onClick={scrollToForm} className="w-full max-w-md text-lg py-6">{t('insPage.compareNowBtn')}</Button>
          </Card>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AssurancePrevoyance;
