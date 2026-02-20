import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Home, Shield, Euro, Clock } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { useState, useRef } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import InsuranceComparison from "@/components/InsuranceComparison";
import { homeInsurers, generateInsurerOffers } from "@/utils/insurerData";
import SEO from "@/components/SEO";
import InsuranceFAQ from "@/components/insurance/InsuranceFAQ";
import Testimonials from "@/components/Testimonials";
import { SavingsCalculator } from "@/components/calculator/SavingsCalculator";
import { QuoteRequestForm } from "@/components/forms/QuoteRequestForm";
import { addServiceSchema, addFAQSchema, addBreadcrumbSchema, addAggregateRatingSchema, addHowToSchema } from "@/utils/seoUtils";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import arthurThumbsUp from "@/assets/mascotte/arthur-thumbs-up.png";
import arthurFlying from "@/assets/mascotte/arthur-flying.png";

const formSchema = z.object({
  typeLogement: z.string().min(1, "Champ requis"),
  statut: z.string().min(1, "Champ requis"),
  surface: z.string().min(1, "Champ requis"),
  pieces: z.string().min(1, "Champ requis"),
  codePostal: z.string().length(5, "Code postal invalide"),
  valeur: z.string().min(1, "Champ requis"),
});

const AssuranceHabitation = () => {
  const [insurerOffers, setInsurerOffers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [submittedFormData, setSubmittedFormData] = useState<Record<string, any>>({});
  const formRef = useRef<HTMLDivElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { typeLogement: "", statut: "", surface: "", pieces: "", codePostal: "", valeur: "" },
  });

  const scrollToForm = () => { formRef.current?.scrollIntoView({ behavior: 'smooth' }); };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      setSubmittedFormData(values);
      const basePrice = 12;
      const surface = parseInt(values.surface);
      const valeur = parseInt(values.valeur);
      const pieces = parseInt(values.pieces);
      let price = basePrice;

      if (values.typeLogement === "maison") price += 12;
      if (values.statut === "proprietaire") price += 8;
      if (surface > 150) price += 10; else if (surface > 100) price += 6; else if (surface > 70) price += 3;
      if (pieces >= 5) price += 5; else if (pieces >= 4) price += 3;
      if (valeur > 50000) price += 15; else if (valeur > 30000) price += 8; else if (valeur > 15000) price += 4;

      const randomVariation = Math.floor(Math.random() * 8) - 4;
      price += randomVariation;

      const offers = generateInsurerOffers(price, homeInsurers);
      setInsurerOffers(offers);
      toast.success("Offres générées !", { description: "Consultez les meilleures offres pour votre logement." });
    } catch (error: any) {
      console.error("Error:", error);
      toast.error("Erreur", { description: "Une erreur est survenue. Veuillez réessayer." });
    } finally { setIsLoading(false); }
  };

  const breadcrumbSchema = addBreadcrumbSchema([
    { name: "Accueil", url: "https://www.jemassuremoinscher.fr/" },
    { name: "Assurance Habitation", url: "https://www.jemassuremoinscher.fr/assurance-habitation" }
  ]);
  const serviceSchema = addServiceSchema({ name: "Comparateur Assurance Habitation", description: "Comparez les assurances habitation. Devis gratuit et rapide.", provider: "jemassuremoinscher", areaServed: "France" });
  const ratingSchema = addAggregateRatingSchema("Comparateur Assurance Habitation", 4.7, 1435);
  const faqSchema = addFAQSchema([
    { question: "L'assurance habitation est-elle obligatoire ?", answer: "Oui pour les locataires. Fortement recommandée pour les propriétaires." },
    { question: "Combien coûte une assurance habitation ?", answer: "Entre 120€ et 350€ par an selon la surface et les garanties." }
  ]);

  const advantages = [
    { icon: Euro, title: "Jusqu'à 300€ d'économies", description: "Comparez et économisez sur votre assurance habitation." },
    { icon: Clock, title: "Devis en 2 minutes", description: "Simple, rapide et 100% gratuit." },
    { icon: Shield, title: "20+ assureurs comparés", description: "Les meilleures offres du marché." }
  ];

  return (
    <div className="min-h-screen">
      <SEO title="Assurance Habitation - Comparez et Économisez | jemassuremoinscher" description="Comparez les assurances habitation en France. Devis gratuit. Économisez jusqu'à 300€/an." keywords="assurance habitation, assurance maison, assurance appartement" canonical="https://www.jemassuremoinscher.fr/assurance-habitation" jsonLd={[breadcrumbSchema, serviceSchema, ratingSchema, faqSchema]} />
      <Header />

      <section className="bg-gradient-to-br from-primary/5 to-primary/10 py-16 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center relative">
            <img src={arthurThumbsUp} alt="Arthur" className="hidden lg:block absolute -left-32 bottom-0 w-32 h-auto" />
            <div className="flex justify-center mb-6"><div className="p-4 rounded-full bg-primary/10"><Home className="h-12 w-12 text-primary" /></div></div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Assurance Habitation</h1>
            <p className="text-xl text-muted-foreground mb-8">Comparez les meilleures offres et économisez jusqu'à 300€ par an.</p>
            <Button size="lg" onClick={scrollToForm} className="text-lg px-8 py-6">Comparer maintenant</Button>
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
            <h2 className="text-2xl font-bold mb-6 text-card-foreground">Obtenez votre devis personnalisé</h2>
            {insurerOffers.length > 0 ? (
              <InsuranceComparison insurers={insurerOffers} onNewQuote={() => setInsurerOffers([])} formData={submittedFormData} insuranceType="Assurance Habitation" />
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField control={form.control} name="typeLogement" render={({ field }) => (<FormItem><FormLabel>Type de logement</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger></FormControl><SelectContent><SelectItem value="maison">Maison</SelectItem><SelectItem value="appartement">Appartement</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="statut" render={({ field }) => (<FormItem><FormLabel>Vous êtes</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger></FormControl><SelectContent><SelectItem value="proprietaire">Propriétaire</SelectItem><SelectItem value="locataire">Locataire</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="surface" render={({ field }) => (<FormItem><FormLabel>Surface (m²)</FormLabel><FormControl><Input type="number" placeholder="75" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="pieces" render={({ field }) => (<FormItem><FormLabel>Nombre de pièces</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger></FormControl><SelectContent><SelectItem value="1">1 pièce</SelectItem><SelectItem value="2">2 pièces</SelectItem><SelectItem value="3">3 pièces</SelectItem><SelectItem value="4">4 pièces</SelectItem><SelectItem value="5">5 pièces et +</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="codePostal" render={({ field }) => (<FormItem><FormLabel>Code postal</FormLabel><FormControl><Input placeholder="75001" maxLength={5} {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="valeur" render={({ field }) => (<FormItem><FormLabel>Valeur des biens à assurer (€)</FormLabel><FormControl><Input type="number" placeholder="15000" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <Button type="submit" className="w-full" size="lg" disabled={isLoading}>{isLoading ? "Envoi en cours..." : "Comparer les offres"}</Button>
                </form>
              </Form>
            )}
          </Card>
        </div>

        <section className="max-w-4xl mx-auto mb-16">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="learn-more" className="border rounded-lg">
              <AccordionTrigger className="px-6 py-4 hover:no-underline"><span className="text-lg font-semibold flex items-center gap-2">En savoir plus sur l'assurance habitation</span></AccordionTrigger>
              <AccordionContent className="px-6 pb-6">
                <div className="space-y-12">
                  <InsuranceFAQ title="Questions fréquentes" faqs={[
                    { question: "Quelles sont les garanties essentielles ?", answer: "Incendie, dégâts des eaux, vol, responsabilité civile et catastrophes naturelles sont les garanties de base." },
                    { question: "Dois-je assurer ma résidence secondaire ?", answer: "Ce n'est pas obligatoire sauf en copropriété, mais c'est fortement recommandé pour protéger votre patrimoine." },
                    { question: "Que faire en cas de sinistre ?", answer: "Déclarez le sinistre dans les 5 jours (2 jours pour un vol) auprès de votre assureur par courrier recommandé." },
                    { question: "La franchise, c'est quoi ?", answer: "C'est le montant restant à votre charge après indemnisation. Plus la franchise est élevée, plus la prime est basse." },
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
            <h2 className="text-2xl font-bold mb-4">Prêt à économiser sur votre assurance habitation ?</h2>
            <p className="text-muted-foreground mb-6">Comparez gratuitement les meilleures offres en 2 minutes.</p>
            <Button size="lg" onClick={scrollToForm} className="w-full max-w-md text-lg py-6">Comparer les offres maintenant</Button>
          </Card>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AssuranceHabitation;
