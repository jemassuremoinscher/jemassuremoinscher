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
import { addServiceSchema, addFAQSchema, addBreadcrumbSchema, addAggregateRatingSchema, addHowToSchema } from "@/utils/seoUtils";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import arthurThumbsUp from "@/assets/mascotte/arthur-thumbs-up.png";
import arthurFlying from "@/assets/mascotte/arthur-flying.png";

const formSchema = z.object({
  situation: z.string().min(1, "Champ requis"),
  age: z.string().min(1, "Champ requis"),
  regime: z.string().min(1, "Champ requis"),
  niveau: z.string().min(1, "Champ requis"),
  codePostal: z.string().length(5, "Code postal invalide"),
});

const AssuranceSante = () => {
  const [insurerOffers, setInsurerOffers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [submittedFormData, setSubmittedFormData] = useState<Record<string, any>>({});
  const formRef = useRef<HTMLDivElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      situation: "",
      age: "",
      regime: "",
      niveau: "",
      codePostal: "",
    },
  });

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

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
      toast.success("Offres générées !", {
        description: "Consultez les meilleures offres pour votre profil.",
      });
    } catch (error: any) {
      console.error("Error:", error);
      toast.error("Erreur", { description: "Une erreur est survenue. Veuillez réessayer." });
    } finally {
      setIsLoading(false);
    }
  };

  const breadcrumbSchema = addBreadcrumbSchema([
    { name: "Accueil", url: "https://www.jemassuremoinscher.fr/" },
    { name: "Mutuelle Santé", url: "https://www.jemassuremoinscher.fr/assurance-sante" }
  ]);

  const serviceSchema = addServiceSchema({
    name: "Comparateur Mutuelle Santé",
    description: "Comparez les meilleures mutuelles santé en France. Devis gratuit et personnalisé en 2 minutes.",
    provider: "jemassuremoinscher",
    areaServed: "France"
  });

  const ratingSchema = addAggregateRatingSchema("Comparateur Mutuelle Santé", 4.6, 1642);

  const faqSchema = addFAQSchema([
    { question: "Qu'est-ce qu'une mutuelle santé ?", answer: "Une mutuelle santé rembourse tout ou partie des dépenses de santé non couvertes par la Sécurité sociale." },
    { question: "Comment choisir sa mutuelle santé ?", answer: "Choisissez selon vos besoins : niveau de remboursement optique/dentaire, délais de carence et votre budget." },
    { question: "Combien coûte une mutuelle santé ?", answer: "Le prix varie selon votre âge, situation familiale et niveau de garanties. Comptez entre 45€ et 200€/mois." }
  ]);

  const advantages = [
    { icon: Euro, title: "Jusqu'à 300€ d'économies", description: "Comparez et économisez sur votre mutuelle santé." },
    { icon: Clock, title: "Devis en 2 minutes", description: "Simple, rapide et 100% gratuit." },
    { icon: Shield, title: "20+ mutuelles comparées", description: "Les meilleures offres du marché." }
  ];

  return (
    <div className="min-h-screen">
      <SEO
        title="Mutuelle Santé - Comparez et Économisez | jemassuremoinscher"
        description="Comparez les mutuelles santé en France. Devis gratuit en 2 minutes. Économisez jusqu'à 300€/an."
        keywords="mutuelle santé, complémentaire santé, comparateur mutuelle, mutuelle pas cher"
        canonical="https://www.jemassuremoinscher.fr/assurance-sante"
        jsonLd={[breadcrumbSchema, serviceSchema, ratingSchema, faqSchema]}
      />
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 to-primary/10 py-16 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center relative">
            <img src={arthurThumbsUp} alt="Arthur" className="hidden lg:block absolute -left-32 bottom-0 w-32 h-auto" />
            <div className="flex justify-center mb-6">
              <div className="p-4 rounded-full bg-primary/10">
                <Heart className="h-12 w-12 text-primary" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Mutuelle Santé</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Comparez les meilleures mutuelles et économisez jusqu'à 300€ par an.
            </p>
            <Button size="lg" onClick={scrollToForm} className="text-lg px-8 py-6">
              Comparer maintenant
            </Button>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-12">
        {/* 3 Avantages */}
        <section className="max-w-4xl mx-auto mb-12">
          <div className="grid md:grid-cols-3 gap-6">
            {advantages.map((item, index) => (
              <Card key={index} className="p-6 text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 rounded-full bg-primary/10">
                    <item.icon className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.description}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Formulaire */}
        <div ref={formRef} className="max-w-3xl mx-auto mb-16">
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-6 text-card-foreground">Obtenez votre devis personnalisé</h2>
            {insurerOffers.length > 0 ? (
              <InsuranceComparison
                insurers={insurerOffers}
                onNewQuote={() => setInsurerOffers([])}
                formData={submittedFormData}
                insuranceType="Mutuelle Santé"
              />
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField control={form.control} name="situation" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Situation familiale</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger></FormControl>
                        <SelectContent>
                          <SelectItem value="celibataire">Célibataire</SelectItem>
                          <SelectItem value="couple">En couple</SelectItem>
                          <SelectItem value="famille">Famille</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="age" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Votre âge</FormLabel>
                      <FormControl><Input type="number" placeholder="30" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="regime" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Régime de sécurité sociale</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger></FormControl>
                        <SelectContent>
                          <SelectItem value="general">Régime général</SelectItem>
                          <SelectItem value="alsace-moselle">Alsace-Moselle</SelectItem>
                          <SelectItem value="tns">TNS</SelectItem>
                          <SelectItem value="agricole">Agricole</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="niveau" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Niveau de couverture souhaité</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger></FormControl>
                        <SelectContent>
                          <SelectItem value="economique">Économique</SelectItem>
                          <SelectItem value="equilibre">Équilibré</SelectItem>
                          <SelectItem value="confort">Confort</SelectItem>
                          <SelectItem value="premium">Premium</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="codePostal" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Code postal</FormLabel>
                      <FormControl><Input placeholder="75001" maxLength={5} {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                    {isLoading ? "Envoi en cours..." : "Comparer les offres"}
                  </Button>
                </form>
              </Form>
            )}
          </Card>
        </div>

        {/* Accordion En savoir plus */}
        <section className="max-w-4xl mx-auto mb-16">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="learn-more" className="border rounded-lg">
              <AccordionTrigger className="px-6 py-4 hover:no-underline">
                <span className="text-lg font-semibold flex items-center gap-2">
                  En savoir plus sur la mutuelle santé
                </span>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6">
                <div className="space-y-12">
                  <InsuranceFAQ
                    title="Questions fréquentes"
                    faqs={[
                      { question: "Quelle est la différence entre mutuelle et complémentaire santé ?", answer: "Les deux termes désignent la même chose : un contrat qui complète les remboursements de la Sécurité sociale pour vos frais de santé." },
                      { question: "Comment fonctionne le remboursement ?", answer: "Après prise en charge par la Sécu, votre mutuelle rembourse le reste à charge selon les garanties de votre contrat (100%, 200%, etc. de la base Sécu)." },
                      { question: "Puis-je changer de mutuelle à tout moment ?", answer: "Oui, après un an d'engagement, vous pouvez résilier sans frais ni justification grâce à la loi du 14 juillet 2019." },
                      { question: "Qu'est-ce que le 100% Santé ?", answer: "Le 100% Santé permet d'accéder à des lunettes, prothèses dentaires et aides auditives sans reste à charge, si votre mutuelle est responsable." },
                    ]}
                  />
                  <SavingsCalculator />
                  <QuoteRequestForm />
                  <Testimonials />
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        {/* CTA Bottom */}
        <section className="max-w-2xl mx-auto text-center mb-16">
          <Card className="p-8 bg-primary/5 border-primary/20 relative overflow-visible">
            <img src={arthurFlying} alt="Arthur" className="absolute -right-6 -top-10 w-20 h-auto hidden sm:block" />
            <h2 className="text-2xl font-bold mb-4">Prêt à économiser sur votre mutuelle santé ?</h2>
            <p className="text-muted-foreground mb-6">
              Comparez gratuitement les meilleures offres en 2 minutes.
            </p>
            <Button size="lg" onClick={scrollToForm} className="w-full max-w-md text-lg py-6">
              Comparer les offres maintenant
            </Button>
          </Card>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AssuranceSante;
