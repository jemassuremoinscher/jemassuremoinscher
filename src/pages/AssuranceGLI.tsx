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
import arthurThumbsUp from '@/assets/mascotte/arthur-thumbs-up.png';
import arthurFlying from '@/assets/mascotte/arthur-flying.png';

const formSchema = z.object({
  propertyType: z.enum(['apartment', 'house', 'commercial'], { required_error: 'Veuillez sélectionner un type de bien' }),
  monthlyRent: z.string().min(1, 'Montant requis'),
  tenantType: z.enum(['individual', 'company', 'student'], { required_error: 'Veuillez sélectionner un type de locataire' }),
  postalCode: z.string().min(5, 'Code postal invalide').max(5, 'Code postal invalide'),
});

const AssuranceGLI = () => {
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
      toast.success("Offres générées !", { description: "Consultez les meilleures offres GLI." });
    } catch (error) {
      console.error('Error:', error);
      toast.error('Erreur lors de la génération du devis');
    }
  };

  const breadcrumbSchema = addBreadcrumbSchema([{ name: "Accueil", url: "https://www.jemassuremoinscher.fr/" }, { name: "Garantie Loyer Impayé", url: "https://www.jemassuremoinscher.fr/assurance-gli" }]);
  const serviceSchema = addServiceSchema({ name: "Comparateur GLI", description: "Protégez vos revenus locatifs avec une assurance GLI." });
  const faqSchema = addFAQSchema([
    { question: "Qu'est-ce que la GLI ?", answer: "La GLI protège les propriétaires bailleurs contre les loyers impayés et les dégradations." },
    { question: "Qui peut souscrire ?", answer: "Tous les propriétaires bailleurs louant un bien immobilier." }
  ]);

  const advantages = [
    { icon: Euro, title: "Revenus sécurisés", description: "Protégez vos loyers contre les impayés." },
    { icon: Clock, title: "Devis en 2 minutes", description: "Simple, rapide et 100% gratuit." },
    { icon: Shield, title: "Protection complète", description: "Loyers, dégradations, frais juridiques." }
  ];

  return (
    <div className="min-h-screen">
      <SEO title="Garantie Loyer Impayé (GLI) - Comparateur | jemassuremoinscher" description="Protégez vos revenus locatifs avec une assurance GLI. Comparateur en ligne gratuit." canonical="https://www.jemassuremoinscher.fr/assurance-gli" jsonLd={[breadcrumbSchema, serviceSchema, faqSchema]} keywords="assurance GLI, garantie loyer impayé, protection propriétaire" />
      <Header />
      <section className="bg-gradient-to-br from-primary/5 to-primary/10 py-16 relative overflow-hidden">
        <div className="container mx-auto px-4"><div className="max-w-4xl mx-auto text-center relative">
          <img src={arthurThumbsUp} alt="Arthur" className="hidden lg:block absolute -left-32 bottom-0 w-32 h-auto" />
          <div className="flex justify-center mb-6"><div className="p-4 rounded-full bg-primary/10"><Shield className="h-12 w-12 text-primary" /></div></div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Garantie Loyer Impayé</h1>
          <p className="text-xl text-muted-foreground mb-8">Protégez vos revenus locatifs et louez en toute sérénité.</p>
          <Button size="lg" onClick={scrollToForm} className="text-lg px-8 py-6">Comparer maintenant</Button>
        </div></div>
      </section>
      <main className="container mx-auto px-4 py-12">
        <section className="max-w-4xl mx-auto mb-12"><div className="grid md:grid-cols-3 gap-6">{advantages.map((item, index) => (<Card key={index} className="p-6 text-center"><div className="flex justify-center mb-4"><div className="p-3 rounded-full bg-primary/10"><item.icon className="h-8 w-8 text-primary" /></div></div><h3 className="font-bold text-lg mb-2">{item.title}</h3><p className="text-muted-foreground text-sm">{item.description}</p></Card>))}</div></section>
        <div ref={formRef} className="max-w-3xl mx-auto mb-16">
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-6 text-card-foreground">Obtenez votre devis personnalisé</h2>
            {insurerOffers.length > 0 ? (
              <InsuranceComparison insurers={insurerOffers} onNewQuote={() => setInsurerOffers([])} formData={submittedFormData} insuranceType="Garantie Loyer Impayé" />
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField control={form.control} name="propertyType" render={({ field }) => (<FormItem><FormLabel>Type de bien</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Sélectionnez" /></SelectTrigger></FormControl><SelectContent><SelectItem value="apartment">Appartement</SelectItem><SelectItem value="house">Maison</SelectItem><SelectItem value="commercial">Local commercial</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="monthlyRent" render={({ field }) => (<FormItem><FormLabel>Loyer mensuel (€)</FormLabel><FormControl><Input type="number" placeholder="1200" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="tenantType" render={({ field }) => (<FormItem><FormLabel>Type de locataire</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Sélectionnez" /></SelectTrigger></FormControl><SelectContent><SelectItem value="individual">Particulier</SelectItem><SelectItem value="company">Entreprise</SelectItem><SelectItem value="student">Étudiant</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="postalCode" render={({ field }) => (<FormItem><FormLabel>Code postal</FormLabel><FormControl><Input placeholder="75001" maxLength={5} {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <Button type="submit" className="w-full" size="lg">Comparer les offres</Button>
                </form>
              </Form>
            )}
          </Card>
        </div>
        <section className="max-w-4xl mx-auto mb-16"><Accordion type="single" collapsible className="w-full"><AccordionItem value="learn-more" className="border rounded-lg"><AccordionTrigger className="px-6 py-4 hover:no-underline"><span className="text-lg font-semibold">En savoir plus sur la GLI</span></AccordionTrigger><AccordionContent className="px-6 pb-6"><div className="space-y-12"><InsuranceFAQ title="Questions fréquentes" faqs={[{ question: "Quel est le coût moyen d'une GLI ?", answer: "Entre 2% et 4% du montant annuel des loyers charges comprises." }, { question: "Quelles sont les garanties couvertes ?", answer: "Loyers impayés, dégradations locatives, protection juridique et frais de relogement." }, { question: "La GLI est-elle cumulable avec un dépôt de garantie ?", answer: "Non, la loi interdit de cumuler GLI et caution solidaire (sauf étudiant ou apprenti)." }]} /><SavingsCalculator /><QuoteRequestForm /><Testimonials /></div></AccordionContent></AccordionItem></Accordion></section>
        <section className="max-w-2xl mx-auto text-center mb-16">
          <Card className="p-8 bg-primary/5 border-primary/20 relative overflow-visible">
            <img src={arthurFlying} alt="Arthur" className="absolute -right-6 -top-10 w-20 h-auto hidden sm:block" />
            <h2 className="text-2xl font-bold mb-4">Prêt à sécuriser vos revenus locatifs ?</h2>
            <p className="text-muted-foreground mb-6">Comparez gratuitement les meilleures offres GLI en 2 minutes.</p>
            <Button size="lg" onClick={scrollToForm} className="w-full max-w-md text-lg py-6">Comparer les offres maintenant</Button>
          </Card>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AssuranceGLI;
