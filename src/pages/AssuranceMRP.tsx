import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2, Shield, Euro, Clock } from "lucide-react";
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
  entreprise: z.string().min(1, "Champ requis"),
  secteur: z.string().min(1, "Champ requis"),
  effectif: z.string().min(1, "Champ requis"),
  chiffreAffaires: z.string().min(1, "Champ requis"),
  local: z.string().min(1, "Champ requis"),
  codePostal: z.string().length(5, "Code postal invalide"),
});

const mrpInsurers: InsurerConfig[] = [
  { name: "AXA", priceMultiplier: 1.05, coverage: ["Locaux professionnels", "Matériel et stock", "Perte d'exploitation", "Responsabilité civile"] },
  { name: "Allianz", priceMultiplier: 1.08, coverage: ["Bâtiment professionnel", "Matériel informatique", "Vol et vandalisme", "Dommages électriques"], discount: "-15% en ligne" },
  { name: "Groupama", priceMultiplier: 1.00, coverage: ["Locaux et contenu", "Bris de machine", "Protection juridique", "Cyber-risques"] },
  { name: "MMA", priceMultiplier: 0.95, coverage: ["Multirisque complète", "Marchandises transportées", "Garantie valeur à neuf", "Assistance"], discount: "-10% nouveau client" },
  { name: "Generali", priceMultiplier: 1.02, coverage: ["Incendie et dégâts des eaux", "Vol et vandalisme", "Bris de glace", "RC exploitation"] },
  { name: "Swiss Life", priceMultiplier: 1.12, coverage: ["Protection premium", "Tous dommages matériels", "Perte de valeur vénale", "Garantie loyers impayés"] },
];

const AssuranceMRP = () => {
  const { t } = useLanguage();
  const [insurerOffers, setInsurerOffers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [submittedFormData, setSubmittedFormData] = useState<Record<string, any>>({});
  const formRef = useRef<HTMLDivElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { entreprise: "", secteur: "", effectif: "", chiffreAffaires: "", local: "", codePostal: "" },
  });

  const scrollToForm = () => { formRef.current?.scrollIntoView({ behavior: 'smooth' }); };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      setSubmittedFormData(values);
      const basePrice = 120;
      let price = basePrice;
      const effectif = parseInt(values.effectif);
      if (effectif > 50) price += 150; else if (effectif > 20) price += 90; else if (effectif > 10) price += 50;
      if (values.secteur === "batiment" || values.secteur === "restauration") price += 80;
      if (values.local === "propriete") price += 35;
      const ca = parseInt(values.chiffreAffaires);
      if (ca > 1000000) price += 100; else if (ca > 500000) price += 60;
      const randomVariation = Math.floor(Math.random() * 25) - 12;
      price += randomVariation;
      const offers = generateInsurerOffers(price, mrpInsurers);
      setInsurerOffers(offers);
      toast.success(t('insPage.toast.success'), { description: t('insPage.toast.successDesc') });
    } catch (error: any) {
      console.error("Error:", error);
      toast.error(t('insPage.toast.error'), { description: t('insPage.toast.errorDesc') });
    } finally { setIsLoading(false); }
  };

  const breadcrumbSchema = addBreadcrumbSchema([{ name: "Accueil", url: "https://www.jemassuremoinscher.fr/" }, { name: "Assurance MRP", url: "https://www.jemassuremoinscher.fr/assurance-mrp" }]);
  const serviceSchema = addServiceSchema({ name: "Comparateur Assurance MRP", description: "Comparez les assurances multirisque professionnelle.", provider: "jemassuremoinscher", areaServed: "France" });
  const faqSchema = addFAQSchema([
    { question: t('mrpPage.faq1.q'), answer: t('mrpPage.faq1.a') },
    { question: t('mrpPage.faq2.q'), answer: t('mrpPage.faq2.a') }
  ]);

  const advantages = [
    { icon: Euro, title: t('mrpPage.adv1.title'), description: t('mrpPage.adv1.desc') },
    { icon: Clock, title: t('insPage.quoteIn2min'), description: t('insPage.quoteIn2minDesc') },
    { icon: Shield, title: t('mrpPage.adv2.title'), description: t('mrpPage.adv2.desc') }
  ];

  return (
    <div className="min-h-screen">
      <SEO title="Assurance Multirisque Professionnelle | jemassuremoinscher" description="Comparez les meilleures assurances MRP. Protégez vos locaux et activité. Devis gratuit." keywords="assurance multirisque professionnelle, MRP, assurance entreprise" canonical="https://www.jemassuremoinscher.fr/assurance-mrp" jsonLd={[breadcrumbSchema, serviceSchema, faqSchema]} />
      <Header />
      <section className="bg-gradient-to-br from-primary/5 to-primary/10 py-16 relative overflow-hidden">
        <div className="container mx-auto px-4"><div className="max-w-4xl mx-auto text-center relative">
          <img src={arthurThumbsUp} alt="Arthur" className="hidden lg:block absolute -left-32 bottom-0 w-32 h-auto" />
          <div className="flex justify-center mb-6"><div className="p-4 rounded-full bg-primary/10"><Building2 className="h-12 w-12 text-primary" /></div></div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">{t('mrpPage.title')}</h1>
          <p className="text-xl text-muted-foreground mb-8">{t('mrpPage.subtitle')}</p>
          <Button size="lg" onClick={scrollToForm} className="text-lg px-8 py-6">{t('insPage.compareNow')}</Button>
        </div></div>
      </section>
      <main className="container mx-auto px-4 py-12">
        <section className="max-w-4xl mx-auto mb-12"><div className="grid md:grid-cols-3 gap-6">{advantages.map((item, index) => (<Card key={index} className="p-6 text-center"><div className="flex justify-center mb-4"><div className="p-3 rounded-full bg-primary/10"><item.icon className="h-8 w-8 text-primary" /></div></div><h3 className="font-bold text-lg mb-2">{item.title}</h3><p className="text-muted-foreground text-sm">{item.description}</p></Card>))}</div></section>
        <div ref={formRef} className="max-w-3xl mx-auto mb-16">
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-6 text-card-foreground">{t('insPage.getQuote')}</h2>
            {insurerOffers.length > 0 ? (
              <InsuranceComparison insurers={insurerOffers} onNewQuote={() => setInsurerOffers([])} formData={submittedFormData} insuranceType="Multirisque Professionnelle" />
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="entreprise" render={({ field }) => (<FormItem><FormLabel>{t('rcProPage.form.company')}</FormLabel><FormControl><Input placeholder={t('rcProPage.form.companyPlaceholder')} {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="secteur" render={({ field }) => (<FormItem><FormLabel>{t('rcProPage.form.sector')}</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder={t('insPage.select')} /></SelectTrigger></FormControl><SelectContent><SelectItem value="commerce">{t('rcProPage.form.commerce')}</SelectItem><SelectItem value="services">{t('rcProPage.form.services')}</SelectItem><SelectItem value="batiment">{t('rcProPage.form.batiment')}</SelectItem><SelectItem value="restauration">{t('mrpPage.form.restauration')}</SelectItem><SelectItem value="artisanat">{t('rcProPage.form.artisanat')}</SelectItem><SelectItem value="industrie">{t('mrpPage.form.industrie')}</SelectItem><SelectItem value="sante">{t('rcProPage.form.sante')}</SelectItem><SelectItem value="autre">{t('rcProPage.form.autre')}</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="effectif" render={({ field }) => (<FormItem><FormLabel>{t('rcProPage.form.employees')}</FormLabel><FormControl><Input type="number" placeholder="0" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="chiffreAffaires" render={({ field }) => (<FormItem><FormLabel>{t('rcProPage.form.revenue')}</FormLabel><FormControl><Input type="number" placeholder="100000" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="local" render={({ field }) => (<FormItem><FormLabel>{t('mrpPage.form.local')}</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder={t('insPage.select')} /></SelectTrigger></FormControl><SelectContent><SelectItem value="propriete">{t('mrpPage.form.propriete')}</SelectItem><SelectItem value="location">{t('mrpPage.form.location')}</SelectItem><SelectItem value="bail">{t('mrpPage.form.bail')}</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="codePostal" render={({ field }) => (<FormItem><FormLabel>{t('insPage.postalCode')}</FormLabel><FormControl><Input placeholder="75001" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  </div>
                  <Button type="submit" className="w-full" size="lg" disabled={isLoading}>{isLoading ? t('insPage.loading') : t('insPage.compareOffers')}</Button>
                </form>
              </Form>
            )}
          </Card>
        </div>
        <section className="max-w-4xl mx-auto mb-16"><Accordion type="single" collapsible className="w-full"><AccordionItem value="learn-more" className="border rounded-lg"><AccordionTrigger className="px-6 py-4 hover:no-underline"><span className="text-lg font-semibold">{t('insPage.learnMore')} {t('mrpPage.learnMore')}</span></AccordionTrigger><AccordionContent className="px-6 pb-6"><div className="space-y-12"><InsuranceFAQ title={t('insPage.faqTitle')} faqs={[{ question: t('mrpPage.faq1.q'), answer: t('mrpPage.faq1.a') }, { question: t('mrpPage.faq2.q'), answer: t('mrpPage.faq2.a') }]} /><SavingsCalculator /><QuoteRequestForm /><Testimonials /></div></AccordionContent></AccordionItem></Accordion></section>
        <section className="max-w-2xl mx-auto text-center mb-16">
          <Card className="p-8 bg-primary/5 border-primary/20 relative overflow-visible">
            <img src={arthurFlying} alt="Arthur" className="absolute -right-6 -top-10 w-20 h-auto hidden sm:block" />
            <h2 className="text-2xl font-bold mb-4">{t('mrpPage.ctaTitle')}</h2>
            <p className="text-muted-foreground mb-6">{t('mrpPage.ctaDesc')}</p>
            <Button size="lg" onClick={scrollToForm} className="w-full max-w-md text-lg py-6">{t('insPage.compareNowBtn')}</Button>
          </Card>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AssuranceMRP;
