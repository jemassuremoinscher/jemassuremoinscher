import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, Euro, Clock } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { useState, useRef } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import InsuranceComparison from "@/components/InsuranceComparison";
import { loanInsurers, generateInsurerOffers } from "@/utils/insurerData";
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
  montantPret: z.string().min(1, "Champ requis"),
  dureePret: z.string().min(1, "Champ requis"),
  age: z.string().min(1, "Champ requis"),
  statut: z.string().min(1, "Champ requis"),
  fumeur: z.string().min(1, "Champ requis"),
  codePostal: z.string().length(5, "Code postal invalide"),
});

const AssurancePret = () => {
  const { t } = useLanguage();
  const [insurerOffers, setInsurerOffers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [submittedFormData, setSubmittedFormData] = useState<Record<string, any>>({});
  const formRef = useRef<HTMLDivElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { montantPret: "", dureePret: "", age: "", statut: "", fumeur: "", codePostal: "" },
  });

  const scrollToForm = () => { formRef.current?.scrollIntoView({ behavior: 'smooth' }); };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      setSubmittedFormData(values);
      const montant = parseInt(values.montantPret);
      const duree = parseInt(values.dureePret);
      const ageValue = parseInt(values.age);
      let price = (montant / 1000) * 0.35;

      if (duree > 25) price += 15; else if (duree > 20) price += 10; else if (duree > 15) price += 5;
      if (ageValue > 55) price += 35; else if (ageValue > 45) price += 20; else if (ageValue > 35) price += 10;
      if (values.fumeur === "oui") price += 15;
      if (values.statut === "profession-risque") price += 25;

      const randomVariation = Math.floor(Math.random() * 15) - 7;
      price += randomVariation;
      price = Math.round(price);

      const offers = generateInsurerOffers(price, loanInsurers);
      setInsurerOffers(offers);
      toast.success(t('insPage.toast.success'), { description: t('insPage.toast.successDesc') });
    } catch (error: any) {
      console.error("Error:", error);
      toast.error(t('insPage.toast.error'), { description: t('insPage.toast.errorDesc') });
    } finally { setIsLoading(false); }
  };

  const breadcrumbSchema = addBreadcrumbSchema([
    { name: "Accueil", url: "https://www.jemassuremoinscher.fr/" },
    { name: "Assurance Prêt", url: "https://www.jemassuremoinscher.fr/assurance-pret" }
  ]);
  const serviceSchema = addServiceSchema({ name: "Comparateur Assurance Prêt Immobilier", description: "Économisez des milliers d'euros sur votre crédit immobilier. Loi Lemoine.", provider: "jemassuremoinscher", areaServed: "France" });
  const faqSchema = addFAQSchema([
    { question: t('pretPage.faq1.q'), answer: t('pretPage.faq1.a') },
    { question: t('pretPage.faq2.q'), answer: t('pretPage.faq2.a') }
  ]);

  const advantages = [
    { icon: Euro, title: t('pretPage.adv1.title'), description: t('pretPage.adv1.desc') },
    { icon: Clock, title: t('pretPage.adv2.title'), description: t('pretPage.adv2.desc') },
    { icon: Shield, title: t('pretPage.adv3.title'), description: t('pretPage.adv3.desc') }
  ];

  return (
    <div className="min-h-screen">
      <SEO title="Assurance Prêt Immobilier - Économisez jusqu'à 50% | jemassuremoinscher" description="Comparez les assurances emprunteur. Économisez des milliers d'euros. Loi Lemoine." keywords="assurance prêt immobilier, assurance emprunteur, loi Lemoine" canonical="https://www.jemassuremoinscher.fr/assurance-pret" jsonLd={[breadcrumbSchema, serviceSchema, faqSchema]} />
      <Header />

      <section className="bg-gradient-to-br from-primary/5 to-primary/10 py-16 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center relative">
            <img src={arthurThumbsUp} alt="Arthur" className="hidden lg:block absolute -left-32 bottom-0 w-32 h-auto" />
            <div className="flex justify-center mb-6"><div className="p-4 rounded-full bg-primary/10"><Shield className="h-12 w-12 text-primary" /></div></div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">{t('pretPage.title')}</h1>
            <p className="text-xl text-muted-foreground mb-8">{t('pretPage.subtitle')}</p>
            <Button size="lg" onClick={scrollToForm} className="text-lg px-8 py-6">{t('insPage.compareNow')}</Button>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-12">
        <section className="max-w-4xl mx-auto mb-12">
          <div className="grid md:grid-cols-3 gap-6">
            {advantages.map((item, index) => (<Card key={index} className="p-6 text-center"><div className="flex justify-center mb-4"><div className="p-3 rounded-full bg-primary/10"><item.icon className="h-8 w-8 text-primary" /></div></div><h3 className="font-bold text-lg mb-2">{item.title}</h3><p className="text-muted-foreground text-sm">{item.description}</p></Card>))}
          </div>
        </section>

        <div ref={formRef} className="max-w-3xl mx-auto mb-16">
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-6 text-card-foreground">{t('insPage.getQuote')}</h2>
            {insurerOffers.length > 0 ? (
              <InsuranceComparison insurers={insurerOffers} onNewQuote={() => setInsurerOffers([])} formData={submittedFormData} insuranceType="Assurance Prêt Immobilier" />
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField control={form.control} name="montantPret" render={({ field }) => (<FormItem><FormLabel>{t('pretPage.form.amount')}</FormLabel><FormControl><Input type="number" placeholder="200000" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="dureePret" render={({ field }) => (<FormItem><FormLabel>{t('pretPage.form.duration')}</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder={t('insPage.select')} /></SelectTrigger></FormControl><SelectContent><SelectItem value="10">10 {t('common.perYear').split(' ')[1]}s</SelectItem><SelectItem value="15">15 {t('common.perYear').split(' ')[1]}s</SelectItem><SelectItem value="20">20 {t('common.perYear').split(' ')[1]}s</SelectItem><SelectItem value="25">25 {t('common.perYear').split(' ')[1]}s</SelectItem><SelectItem value="30">30 {t('common.perYear').split(' ')[1]}s</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="age" render={({ field }) => (<FormItem><FormLabel>{t('insPage.yourAge')}</FormLabel><FormControl><Input type="number" placeholder="35" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="statut" render={({ field }) => (<FormItem><FormLabel>{t('pretPage.form.status')}</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder={t('insPage.select')} /></SelectTrigger></FormControl><SelectContent><SelectItem value="salarie">{t('pretPage.form.salarie')}</SelectItem><SelectItem value="fonctionnaire">{t('pretPage.form.fonctionnaire')}</SelectItem><SelectItem value="independant">{t('pretPage.form.independant')}</SelectItem><SelectItem value="profession-risque">{t('pretPage.form.profRisk')}</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="fumeur" render={({ field }) => (<FormItem><FormLabel>{t('viePage.form.smoker')}</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder={t('insPage.select')} /></SelectTrigger></FormControl><SelectContent><SelectItem value="non">{t('viePage.form.no')}</SelectItem><SelectItem value="oui">{t('viePage.form.yes')}</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="codePostal" render={({ field }) => (<FormItem><FormLabel>{t('insPage.postalCode')}</FormLabel><FormControl><Input placeholder="75001" maxLength={5} {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <Button type="submit" className="w-full" size="lg" disabled={isLoading}>{isLoading ? t('insPage.loading') : t('insPage.compareOffers')}</Button>
                </form>
              </Form>
            )}
          </Card>
        </div>

        <section className="max-w-4xl mx-auto mb-16">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="learn-more" className="border rounded-lg">
              <AccordionTrigger className="px-6 py-4 hover:no-underline"><span className="text-lg font-semibold flex items-center gap-2">{t('insPage.learnMore')} {t('pretPage.learnMore')}</span></AccordionTrigger>
              <AccordionContent className="px-6 pb-6">
                <div className="space-y-12">
                  <InsuranceFAQ title={t('insPage.faqTitle')} faqs={[
                    { question: t('pretPage.faq1.q'), answer: t('pretPage.faq1.a') },
                    { question: t('pretPage.faq2.q'), answer: t('pretPage.faq2.a') },
                    { question: t('pretPage.faq3.q'), answer: t('pretPage.faq3.a') },
                    { question: t('pretPage.faq4.q'), answer: t('pretPage.faq4.a') },
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
            <h2 className="text-2xl font-bold mb-4">{t('pretPage.ctaTitle')}</h2>
            <p className="text-muted-foreground mb-6">{t('pretPage.ctaDesc')}</p>
            <Button size="lg" onClick={scrollToForm} className="w-full max-w-md text-lg py-6">{t('insPage.compareNowBtn')}</Button>
          </Card>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AssurancePret;
