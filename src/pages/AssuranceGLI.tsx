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
import { Shield, Euro, Clock } from 'lucide-react';
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
  propertyType: z.enum(['apartment', 'house', 'commercial'], { required_error: 'Veuillez sélectionner un type de bien' }),
  monthlyRent: z.string().min(1, 'Montant requis'),
  tenantType: z.enum(['individual', 'company', 'student'], { required_error: 'Veuillez sélectionner un type de locataire' }),
  postalCode: z.string().min(5, 'Code postal invalide').max(5, 'Code postal invalide'),
});

const AssuranceGLI = () => {
  const { t } = useLanguage();
  const [insurerOffers, setInsurerOffers] = useState<any[]>([]);
  const [submittedFormData, setSubmittedFormData] = useState<Record<string, any>>({});
  const formRef = useRef<HTMLDivElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { propertyType: undefined, monthlyRent: '', tenantType: undefined, postalCode: '' },
  });

  const scrollToForm = () => { formRef.current?.scrollIntoView({ behavior: 'smooth' }); };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      let basePercentage = 2.5;
      const rent = parseInt(values.monthlyRent);
      if (values.propertyType === 'house') basePercentage += 0.3;
      if (values.propertyType === 'commercial') basePercentage += 0.5;
      if (rent > 1500) basePercentage += 0.2;
      if (rent > 2000) basePercentage += 0.3;
      if (values.tenantType === 'student') basePercentage += 0.4;
      if (values.tenantType === 'company') basePercentage -= 0.3;
      const baseMonthlyPrice = Math.round((rent * basePercentage) / 100);

      const insurers = [
        { name: 'Garantme', price: baseMonthlyPrice, coverage: ['Paiement en ligne', 'Activation en 24h', 'Sans franchise', 'Loyers impayés couverts'], discount: '-15% en ligne' },
        { name: 'SmartGarant', price: Math.round(baseMonthlyPrice * 1.12), coverage: ['Couverture dégradations', 'Assistance juridique', 'Protection juridique', 'Indemnisation rapide'] },
        { name: 'Locatme', price: Math.round(baseMonthlyPrice * 1.20), coverage: ['Garantie étendue', 'Frais de procédure inclus', 'Accompagnement personnalisé', 'Service client dédié'] },
        { name: 'Cautioneo', price: Math.round(baseMonthlyPrice * 1.28), coverage: ['Service premium', 'Gestion complète', 'Indemnisation rapide', 'Suivi en ligne'] },
        { name: 'Unkle', price: Math.round(baseMonthlyPrice * 1.36), coverage: ['Garantie maximale', 'Protection intégrale', 'Assistance 24/7', 'Couverture dégradations étendue'] },
        { name: 'Paytop', price: Math.round(baseMonthlyPrice * 1.10), coverage: ['Couverture standard', 'Loyers impayés', 'Protection juridique', 'Activation rapide'] },
      ];

      setSubmittedFormData(values);
      setInsurerOffers(insurers);
      toast.success(t('insPage.toast.success'), { description: t('insPage.toast.successDesc') });
    } catch (error) {
      console.error('Error:', error);
      toast.error(t('insPage.toast.error'), { description: t('insPage.toast.errorDesc') });
    }
  };

  const breadcrumbSchema = addBreadcrumbSchema([{ name: "Accueil", url: "https://www.jemassuremoinscher.fr/" }, { name: "Garantie Loyer Impayé", url: "https://www.jemassuremoinscher.fr/assurance-gli" }]);
  const serviceSchema = addServiceSchema({ name: "Comparateur GLI", description: "Protégez vos revenus locatifs avec une assurance GLI." });
  const faqSchema = addFAQSchema([
    { question: t('gliPage.faq1.q'), answer: t('gliPage.faq1.a') },
    { question: t('gliPage.faq2.q'), answer: t('gliPage.faq2.a') },
    { question: t('gliPage.faq3.q'), answer: t('gliPage.faq3.a') }
  ]);

  const advantages = [
    { icon: Euro, title: t('gliPage.adv1.title'), description: t('gliPage.adv1.desc') },
    { icon: Clock, title: t('insPage.quoteIn2min'), description: t('insPage.quoteIn2minDesc') },
    { icon: Shield, title: t('gliPage.adv2.title'), description: t('gliPage.adv2.desc') }
  ];

  return (
    <div className="min-h-screen">
      <SEO title="Garantie Loyer Impayé (GLI) - Comparateur | jemassuremoinscher" description="Protégez vos revenus locatifs avec une assurance GLI. Comparateur en ligne gratuit." canonical="https://www.jemassuremoinscher.fr/assurance-gli" jsonLd={[breadcrumbSchema, serviceSchema, faqSchema]} keywords="assurance GLI, garantie loyer impayé, protection propriétaire" />
      <Header />
      <section className="bg-gradient-to-br from-primary/5 to-primary/10 py-16 relative overflow-hidden">
        <div className="container mx-auto px-4"><div className="max-w-4xl mx-auto text-center relative">
          <img src={arthurThumbsUp} alt="Arthur" className="hidden lg:block absolute -left-32 bottom-0 w-32 h-auto" />
          <div className="flex justify-center mb-6"><div className="p-4 rounded-full bg-primary/10"><Shield className="h-12 w-12 text-primary" /></div></div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">{t('gliPage.title')}</h1>
          <p className="text-xl text-muted-foreground mb-8">{t('gliPage.subtitle')}</p>
          <Button size="lg" onClick={scrollToForm} className="text-lg px-8 py-6">{t('insPage.compareNow')}</Button>
        </div></div>
      </section>
      <main className="container mx-auto px-4 py-12">
        <section className="max-w-4xl mx-auto mb-12"><div className="grid md:grid-cols-3 gap-6">{advantages.map((item, index) => (<Card key={index} className="p-6 text-center"><div className="flex justify-center mb-4"><div className="p-3 rounded-full bg-primary/10"><item.icon className="h-8 w-8 text-primary" /></div></div><h3 className="font-bold text-lg mb-2">{item.title}</h3><p className="text-muted-foreground text-sm">{item.description}</p></Card>))}</div></section>
        <div ref={formRef} className="max-w-3xl mx-auto mb-16">
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-6 text-card-foreground">{t('insPage.getQuote')}</h2>
            {insurerOffers.length > 0 ? (
              <InsuranceComparison insurers={insurerOffers} onNewQuote={() => setInsurerOffers([])} formData={submittedFormData} insuranceType="Garantie Loyer Impayé" />
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField control={form.control} name="propertyType" render={({ field }) => (<FormItem><FormLabel>{t('gliPage.form.propertyType')}</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder={t('insPage.select')} /></SelectTrigger></FormControl><SelectContent><SelectItem value="apartment">{t('gliPage.form.apartment')}</SelectItem><SelectItem value="house">{t('gliPage.form.house')}</SelectItem><SelectItem value="commercial">{t('gliPage.form.commercial')}</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="monthlyRent" render={({ field }) => (<FormItem><FormLabel>{t('gliPage.form.rent')}</FormLabel><FormControl><Input type="number" placeholder="1200" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="tenantType" render={({ field }) => (<FormItem><FormLabel>{t('gliPage.form.tenantType')}</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder={t('insPage.select')} /></SelectTrigger></FormControl><SelectContent><SelectItem value="individual">{t('gliPage.form.individual')}</SelectItem><SelectItem value="company">{t('gliPage.form.company')}</SelectItem><SelectItem value="student">{t('gliPage.form.student')}</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="postalCode" render={({ field }) => (<FormItem><FormLabel>{t('insPage.postalCode')}</FormLabel><FormControl><Input placeholder="75001" maxLength={5} {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <Button type="submit" className="w-full" size="lg">{t('insPage.compareOffers')}</Button>
                </form>
              </Form>
            )}
          </Card>
        </div>
        <section className="max-w-4xl mx-auto mb-16"><Accordion type="single" collapsible className="w-full"><AccordionItem value="learn-more" className="border rounded-lg"><AccordionTrigger className="px-6 py-4 hover:no-underline"><span className="text-lg font-semibold">{t('insPage.learnMore')} {t('gliPage.learnMore')}</span></AccordionTrigger><AccordionContent className="px-6 pb-6"><div className="space-y-12"><InsuranceFAQ title={t('insPage.faqTitle')} faqs={[{ question: t('gliPage.faq1.q'), answer: t('gliPage.faq1.a') }, { question: t('gliPage.faq2.q'), answer: t('gliPage.faq2.a') }, { question: t('gliPage.faq3.q'), answer: t('gliPage.faq3.a') }]} /><SavingsCalculator /><QuoteRequestForm /><Testimonials /></div></AccordionContent></AccordionItem></Accordion></section>
        <section className="max-w-2xl mx-auto text-center mb-16">
          <Card className="p-8 bg-primary/5 border-primary/20 relative overflow-visible">
            <img src={arthurFlying} alt="Arthur" className="absolute -right-6 -top-10 w-20 h-auto hidden sm:block" />
            <h2 className="text-2xl font-bold mb-4">{t('gliPage.ctaTitle')}</h2>
            <p className="text-muted-foreground mb-6">{t('gliPage.ctaDesc')}</p>
            <Button size="lg" onClick={scrollToForm} className="w-full max-w-md text-lg py-6">{t('insPage.compareNowBtn')}</Button>
          </Card>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AssuranceGLI;
