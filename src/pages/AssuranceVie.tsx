import { useState, useRef } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import InsuranceComparison from "@/components/InsuranceComparison";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, Shield, Euro, Clock } from "lucide-react";
import { getLifeInsuranceInsurers } from "@/utils/insurerData";
import InsuranceFAQ from "@/components/insurance/InsuranceFAQ";
import Testimonials from "@/components/Testimonials";
import { SavingsCalculator } from "@/components/calculator/SavingsCalculator";
import { QuoteRequestForm } from "@/components/forms/QuoteRequestForm";
import { toast } from "sonner";
import { addServiceSchema, addFAQSchema, addBreadcrumbSchema, addAggregateRatingSchema } from "@/utils/seoUtils";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import arthurThumbsUp from "@/assets/mascotte/arthur-thumbs-up.png";
import arthurFlying from "@/assets/mascotte/arthur-flying.png";

const formSchema = z.object({
  capital: z.string().min(1, "Le capital souhaité est requis"),
  age: z.string().min(1, "L'âge est requis"),
  duration: z.string().min(1, "La durée est requise"),
  type: z.string().min(1, "Le type d'assurance est requis"),
  health: z.string().min(1, "L'état de santé est requis"),
  smoker: z.string().min(1, "Cette information est requise"),
  postalCode: z.string().min(5, "Code postal invalide").max(5, "Code postal invalide"),
});

type FormValues = z.infer<typeof formSchema>;

const AssuranceVie = () => {
  const [showComparison, setShowComparison] = useState(false);
  const [insurers, setInsurers] = useState<Array<{ name: string; price: number; logo: string; coverage: string[]; discount?: string }>>([]);
  const formRef = useRef<HTMLDivElement>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { capital: "", age: "", duration: "", type: "", health: "", smoker: "", postalCode: "" },
  });

  const scrollToForm = () => { formRef.current?.scrollIntoView({ behavior: 'smooth' }); };

  const calculatePrice = (basePrice: number, variationFactor: number, capital: number, age: number, duration: number, type: string, health: string, isSmoker: boolean) => {
    let price = basePrice;
    price += (capital / 10000) * 15;
    if (age < 30) price *= 0.7; else if (age < 40) price *= 0.85; else if (age < 50) price *= 1.0; else if (age < 60) price *= 1.3; else price *= 1.7;
    if (duration <= 10) price *= 0.9; else if (duration <= 20) price *= 1.0; else price *= 1.1;
    if (type === "temporaire") price *= 0.7; else if (type === "epargne") price *= 1.2; else if (type === "mixte") price *= 1.0;
    if (health === "excellente") price *= 0.9; else if (health === "bonne") price *= 1.0; else if (health === "moyenne") price *= 1.2; else price *= 1.5;
    if (isSmoker) price *= 1.4;
    price *= variationFactor;
    return Math.round(price);
  };

  const onSubmit = (values: FormValues) => {
    const capital = parseInt(values.capital);
    const age = parseInt(values.age);
    const duration = parseInt(values.duration);
    const isSmoker = values.smoker === "oui";
    const lifeInsurers = getLifeInsuranceInsurers();
    const calculatedInsurers = lifeInsurers.map(insurer => ({
      name: insurer.name, logo: insurer.logo, coverage: insurer.coverageDetails || [], discount: insurer.discount,
      price: calculatePrice(insurer.basePrice || 50, insurer.variationFactor || 1.0, capital, age, duration, values.type, values.health, isSmoker),
    }));
    setInsurers(calculatedInsurers);
    setShowComparison(true);
    toast.success("Comparaison générée !", { description: "Voici les meilleures offres pour votre profil." });
  };

  const breadcrumbSchema = addBreadcrumbSchema([{ name: "Accueil", url: "https://www.jemassuremoinscher.fr/" }, { name: "Assurance Vie", url: "https://www.jemassuremoinscher.fr/assurance-vie" }]);
  const serviceSchema = addServiceSchema({ name: "Comparateur Assurance Vie", description: "Comparez les contrats d'assurance vie pour l'épargne et la protection.", provider: "jemassuremoinscher", areaServed: "France" });
  const ratingSchema = addAggregateRatingSchema("Comparateur Assurance Vie", 4.6, 1124);
  const faqSchema = addFAQSchema([
    { question: "Qu'est-ce qu'une assurance vie ?", answer: "Un contrat d'épargne qui permet de constituer un capital, protéger vos proches et transmettre votre patrimoine." },
    { question: "Quels sont les avantages fiscaux ?", answer: "Après 8 ans, abattement de 4 600€ (9 200€ couple) sur les gains. Transmission : 152 500€/bénéficiaire." }
  ]);

  const advantages = [
    { icon: Euro, title: "Avantages fiscaux", description: "Fiscalité attractive après 8 ans de détention." },
    { icon: Clock, title: "Comparaison en 2 minutes", description: "Simple, rapide et 100% gratuit." },
    { icon: Shield, title: "Capital protégé", description: "Fonds euros sécurisés disponibles." }
  ];

  return (
    <div className="min-h-screen">
      <SEO title="Assurance Vie - Épargne et Protection | jemassuremoinscher" description="Comparez les meilleures assurances vie : épargne, protection décès, transmission." keywords="assurance vie, épargne, placement, transmission patrimoine" canonical="https://www.jemassuremoinscher.fr/assurance-vie" jsonLd={[breadcrumbSchema, serviceSchema, ratingSchema, faqSchema]} />
      <Header />
      <section className="bg-gradient-to-br from-primary/5 to-primary/10 py-16 relative overflow-hidden">
        <div className="container mx-auto px-4"><div className="max-w-4xl mx-auto text-center relative">
          <img src={arthurThumbsUp} alt="Arthur" className="hidden lg:block absolute -left-32 bottom-0 w-32 h-auto" />
          <div className="flex justify-center mb-6"><div className="p-4 rounded-full bg-primary/10"><TrendingUp className="h-12 w-12 text-primary" /></div></div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Assurance Vie</h1>
          <p className="text-xl text-muted-foreground mb-8">Constituez une épargne, préparez votre retraite ou protégez vos proches.</p>
          <Button size="lg" onClick={scrollToForm} className="text-lg px-8 py-6">Comparer maintenant</Button>
        </div></div>
      </section>
      <main className="container mx-auto px-4 py-12">
        <section className="max-w-4xl mx-auto mb-12"><div className="grid md:grid-cols-3 gap-6">{advantages.map((item, index) => (<Card key={index} className="p-6 text-center"><div className="flex justify-center mb-4"><div className="p-3 rounded-full bg-primary/10"><item.icon className="h-8 w-8 text-primary" /></div></div><h3 className="font-bold text-lg mb-2">{item.title}</h3><p className="text-muted-foreground text-sm">{item.description}</p></Card>))}</div></section>
        <div ref={formRef} className="max-w-3xl mx-auto mb-16">
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-6 text-card-foreground">Obtenez votre comparatif personnalisé</h2>
            {showComparison ? (
              <InsuranceComparison insurers={insurers} onNewQuote={() => { setShowComparison(false); form.reset(); }} />
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField control={form.control} name="capital" render={({ field }) => (<FormItem><FormLabel>Capital souhaité (€)</FormLabel><FormControl><Input type="number" placeholder="50000" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="age" render={({ field }) => (<FormItem><FormLabel>Votre âge</FormLabel><FormControl><Input type="number" placeholder="35" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="duration" render={({ field }) => (<FormItem><FormLabel>Durée du contrat (années)</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger></FormControl><SelectContent><SelectItem value="5">5 ans</SelectItem><SelectItem value="10">10 ans</SelectItem><SelectItem value="15">15 ans</SelectItem><SelectItem value="20">20 ans</SelectItem><SelectItem value="25">25 ans</SelectItem><SelectItem value="30">30 ans</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="type" render={({ field }) => (<FormItem><FormLabel>Type d'assurance vie</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger></FormControl><SelectContent><SelectItem value="epargne">Assurance vie épargne</SelectItem><SelectItem value="temporaire">Temporaire décès</SelectItem><SelectItem value="mixte">Contrat mixte</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="health" render={({ field }) => (<FormItem><FormLabel>État de santé</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger></FormControl><SelectContent><SelectItem value="excellente">Excellente</SelectItem><SelectItem value="bonne">Bonne</SelectItem><SelectItem value="moyenne">Moyenne</SelectItem><SelectItem value="fragile">Fragile</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="smoker" render={({ field }) => (<FormItem><FormLabel>Êtes-vous fumeur ?</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger></FormControl><SelectContent><SelectItem value="non">Non</SelectItem><SelectItem value="oui">Oui</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="postalCode" render={({ field }) => (<FormItem><FormLabel>Code postal</FormLabel><FormControl><Input placeholder="75001" maxLength={5} {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <Button type="submit" className="w-full" size="lg">Comparer les offres</Button>
                </form>
              </Form>
            )}
          </Card>
        </div>
        <section className="max-w-4xl mx-auto mb-16"><Accordion type="single" collapsible className="w-full"><AccordionItem value="learn-more" className="border rounded-lg"><AccordionTrigger className="px-6 py-4 hover:no-underline"><span className="text-lg font-semibold">En savoir plus sur l'assurance vie</span></AccordionTrigger><AccordionContent className="px-6 pb-6"><div className="space-y-12"><InsuranceFAQ title="Questions fréquentes" faqs={[{ question: "Quelle différence entre fonds euros et unités de compte ?", answer: "Le fonds euros garantit votre capital. Les unités de compte offrent plus de rendement mais sans garantie." }, { question: "Peut-on retirer son argent à tout moment ?", answer: "Oui, les rachats sont possibles à tout moment, avec une fiscalité avantageuse après 8 ans." }, { question: "Comment désigner les bénéficiaires ?", answer: "Via la clause bénéficiaire du contrat. Elle peut être modifiée à tout moment." }]} /><SavingsCalculator /><QuoteRequestForm /><Testimonials /></div></AccordionContent></AccordionItem></Accordion></section>
        <section className="max-w-2xl mx-auto text-center mb-16">
          <Card className="p-8 bg-primary/5 border-primary/20 relative overflow-visible">
            <img src={arthurFlying} alt="Arthur" className="absolute -right-6 -top-10 w-20 h-auto hidden sm:block" />
            <h2 className="text-2xl font-bold mb-4">Prêt à faire fructifier votre épargne ?</h2>
            <p className="text-muted-foreground mb-6">Comparez gratuitement les meilleurs contrats d'assurance vie.</p>
            <Button size="lg" onClick={scrollToForm} className="w-full max-w-md text-lg py-6">Comparer les offres maintenant</Button>
          </Card>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AssuranceVie;
