import { useState, useRef } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import InsuranceComparison from '@/components/InsuranceComparison';
import { toast } from 'sonner';
import { Shield, Home, Euro, Clock } from 'lucide-react';
import InsuranceFAQ from '@/components/insurance/InsuranceFAQ';
import Testimonials from '@/components/Testimonials';
import { SavingsCalculator } from '@/components/calculator/SavingsCalculator';
import { QuoteRequestForm } from '@/components/forms/QuoteRequestForm';
import { addServiceSchema, addFAQSchema, addBreadcrumbSchema } from '@/utils/seoUtils';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useLanguage } from '@/contexts/LanguageContext';
import arthurThumbsUp from '@/assets/mascotte/arthur-thumbs-up.png';
import arthurFlying from '@/assets/mascotte/arthur-flying.png';

const formSchema = z.object({
  propertyType: z.enum(['apartment', 'house', 'studio', 'commercial'], { required_error: 'Veuillez sélectionner un type de bien' }),
  surface: z.string().min(1, 'Surface requise'),
  rooms: z.string().min(1, 'Nombre de pièces requis'),
  occupancyStatus: z.enum(['vacant', 'rental', 'secondary'], { required_error: 'Veuillez sélectionner un statut' }),
  postalCode: z.string().min(5, 'Code postal invalide').max(5, 'Code postal invalide'),
});

const AssurancePNO = () => {
  const { t } = useLanguage();
  const [insurerOffers, setInsurerOffers] = useState<any[]>([]);
  const [submittedFormData, setSubmittedFormData] = useState<Record<string, any>>({});
  const formRef = useRef<HTMLDivElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { propertyType: undefined, surface: '', rooms: '', occupancyStatus: undefined, postalCode: '' },
  });

  const scrollToForm = () => { formRef.current?.scrollIntoView({ behavior: 'smooth' }); };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      let basePrice = 9;
      const surface = parseInt(values.surface);
      const rooms = parseInt(values.rooms);
      if (values.propertyType === 'house') basePrice += 8;
      if (values.propertyType === 'apartment') basePrice += 4;
      if (values.propertyType === 'commercial') basePrice += 18;
      if (surface > 50) basePrice += 6;
      if (surface > 100) basePrice += 12;
      if (rooms > 2) basePrice += 4;
      if (rooms > 4) basePrice += 8;
      if (values.occupancyStatus === 'vacant') basePrice += 10;
      if (values.occupancyStatus === 'secondary') basePrice += 6;
      const basePriceRounded = Math.round(basePrice);

      const insurers = [
        { name: 'Luko', price: basePriceRounded, coverage: ['Protection bâtiment', 'Responsabilité civile', 'Dégâts des eaux', 'Incendie'], discount: '-20% en ligne' },
        { name: 'Direct Assurance', price: Math.round(basePriceRounded * 1.15), coverage: ['Garantie complète', 'Catastrophes naturelles', 'Protection juridique', 'Assistance 24/7'] },
        { name: 'Allianz', price: Math.round(basePriceRounded * 1.25), coverage: ['Tous risques', 'Vol et vandalisme', 'Bris de glace', 'Dommages électriques'] },
        { name: 'AXA', price: Math.round(basePriceRounded * 1.32), coverage: ['Protection maximale', 'Garantie loyers', 'Assistance propriétaire', 'Service premium'] },
        { name: 'Groupama', price: Math.round(basePriceRounded * 1.10), coverage: ['Couverture standard', 'RC propriétaire', 'Protection incendie', 'Activation rapide'] },
        { name: 'MMA', price: Math.round(basePriceRounded * 1.18), coverage: ['Protection standard', 'Bâtiment couvert', 'Catastrophes incluses', 'Plateforme digitale'] },
      ];

      setSubmittedFormData(values);
      setInsurerOffers(insurers);
      toast.success(t('insPage.toast.success'), { description: t('insPage.toast.successDescHome') });
    } catch (error) {
      console.error('Error:', error);
      toast.error(t('insPage.toast.error'), { description: t('insPage.toast.errorDesc') });
    }
  };

  const breadcrumbSchema = addBreadcrumbSchema([{ name: "Accueil", url: "https://www.jemassuremoinscher.fr/" }, { name: "Assurance PNO", url: "https://www.jemassuremoinscher.fr/assurance-pno" }]);
  const serviceSchema = addServiceSchema({ name: "Comparateur Assurance PNO", description: "Comparez les assurances PNO pour protéger votre bien immobilier.", provider: "jemassuremoinscher", areaServed: "France" });
  const faqSchema = addFAQSchema([
    { question: t('pnoPage.faq1.q'), answer: t('pnoPage.faq1.a') },
    { question: t('pnoPage.faq2.q'), answer: t('pnoPage.faq2.a') },
    { question: t('pnoPage.faq3.q'), answer: t('pnoPage.faq3.a') }
  ]);

  const advantages = [
    { icon: Home, title: t('pnoPage.adv1.title'), description: t('pnoPage.adv1.desc') },
    { icon: Clock, title: t('insPage.quoteIn2min'), description: t('insPage.quoteIn2minDesc') },
    { icon: Shield, title: t('pnoPage.adv2.title'), description: t('pnoPage.adv2.desc') }
  ];

  return (
    <div className="min-h-screen">
      <SEO title="Assurance PNO - Propriétaire Non Occupant | jemassuremoinscher" description="Comparez les meilleures assurances PNO. Devis gratuit pour propriétaires non occupants." keywords="assurance PNO, propriétaire non occupant, assurance logement vide" canonical="https://www.jemassuremoinscher.fr/assurance-pno" jsonLd={[breadcrumbSchema, serviceSchema, faqSchema]} />
      <Header />
      <section className="bg-gradient-to-br from-primary/5 to-primary/10 py-16 relative overflow-hidden">
        <div className="container mx-auto px-4"><div className="max-w-4xl mx-auto text-center relative">
          <img src={arthurThumbsUp} alt="Arthur" className="hidden lg:block absolute -left-32 bottom-0 w-32 h-auto" />
          <div className="flex justify-center mb-6"><div className="p-4 rounded-full bg-primary/10"><Home className="h-12 w-12 text-primary" /></div></div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">{t('pnoPage.title')}</h1>
          <p className="text-xl text-muted-foreground mb-8">{t('pnoPage.subtitle')}</p>
          <Button size="lg" onClick={scrollToForm} className="text-lg px-8 py-6">{t('insPage.compareNow')}</Button>
        </div></div>
      </section>
      <main className="container mx-auto px-4 py-12">
        <section className="max-w-4xl mx-auto mb-12"><div className="grid md:grid-cols-3 gap-6">{advantages.map((item, index) => (<Card key={index} className="p-6 text-center"><div className="flex justify-center mb-4"><div className="p-3 rounded-full bg-primary/10"><item.icon className="h-8 w-8 text-primary" /></div></div><h3 className="font-bold text-lg mb-2">{item.title}</h3><p className="text-muted-foreground text-sm">{item.description}</p></Card>))}</div></section>
        <div ref={formRef} className="max-w-3xl mx-auto mb-16">
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-6 text-card-foreground">{t('insPage.getQuote')}</h2>
            {insurerOffers.length > 0 ? (
              <InsuranceComparison insurers={insurerOffers} onNewQuote={() => setInsurerOffers([])} formData={submittedFormData} insuranceType="Assurance PNO" />
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField control={form.control} name="propertyType" render={({ field }) => (<FormItem><FormLabel>{t('habitationPage.form.type')}</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder={t('insPage.select')} /></SelectTrigger></FormControl><SelectContent><SelectItem value="apartment">{t('habitationPage.form.apartment')}</SelectItem><SelectItem value="house">{t('habitationPage.form.house')}</SelectItem><SelectItem value="studio">{t('pnoPage.form.studio')}</SelectItem><SelectItem value="commercial">{t('gliPage.form.commercial')}</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="surface" render={({ field }) => (<FormItem><FormLabel>{t('pnoPage.form.surface')}</FormLabel><FormControl><Input type="number" placeholder="75" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="rooms" render={({ field }) => (<FormItem><FormLabel>{t('pnoPage.form.rooms')}</FormLabel><FormControl><Input type="number" placeholder="3" min="1" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="occupancyStatus" render={({ field }) => (<FormItem><FormLabel>{t('pnoPage.form.occupancy')}</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder={t('insPage.select')} /></SelectTrigger></FormControl><SelectContent><SelectItem value="vacant">{t('pnoPage.form.vacant')}</SelectItem><SelectItem value="rental">{t('pnoPage.form.rental')}</SelectItem><SelectItem value="secondary">{t('pnoPage.form.secondary')}</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="postalCode" render={({ field }) => (<FormItem><FormLabel>{t('insPage.postalCode')}</FormLabel><FormControl><Input placeholder="75001" maxLength={5} {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <Button type="submit" className="w-full" size="lg">{t('insPage.compareOffers')}</Button>
                </form>
              </Form>
            )}
          </Card>
        </div>
        <section className="max-w-4xl mx-auto mb-16"><Accordion type="single" collapsible className="w-full"><AccordionItem value="learn-more" className="border rounded-lg"><AccordionTrigger className="px-6 py-4 hover:no-underline"><span className="text-lg font-semibold">{t('insPage.learnMore')} {t('pnoPage.learnMore')}</span></AccordionTrigger><AccordionContent className="px-6 pb-6"><div className="space-y-12"><InsuranceFAQ title={t('insPage.faqTitle')} faqs={[{ question: t('pnoPage.faq1.q'), answer: t('pnoPage.faq1.a') }, { question: t('pnoPage.faq2.q'), answer: t('pnoPage.faq2.a') }, { question: t('pnoPage.faq3.q'), answer: t('pnoPage.faq3.a') }]} /><SavingsCalculator /><QuoteRequestForm /><Testimonials /></div></AccordionContent></AccordionItem></Accordion></section>
        <section className="max-w-2xl mx-auto text-center mb-16">
          <Card className="p-8 bg-primary/5 border-primary/20 relative overflow-visible">
            <img src={arthurFlying} alt="Arthur" className="absolute -right-6 -top-10 w-20 h-auto hidden sm:block" />
            <h2 className="text-2xl font-bold mb-4">{t('pnoPage.ctaTitle')}</h2>
            <p className="text-muted-foreground mb-6">{t('pnoPage.ctaDesc')}</p>
            <Button size="lg" onClick={scrollToForm} className="w-full max-w-md text-lg py-6">{t('insPage.compareNowBtn')}</Button>
          </Card>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AssurancePNO;
