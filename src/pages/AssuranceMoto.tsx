import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bike, Shield, Euro, Clock } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { useState, useRef } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import InsuranceComparison from "@/components/InsuranceComparison";
import { motoInsurers, generateInsurerOffers } from "@/utils/insurerData";
import SEO from "@/components/SEO";
import InsuranceFAQ from "@/components/insurance/InsuranceFAQ";
import Testimonials from "@/components/Testimonials";
import { SavingsCalculator } from "@/components/calculator/SavingsCalculator";
import { QuoteRequestForm } from "@/components/forms/QuoteRequestForm";
import { addServiceSchema, addFAQSchema, addBreadcrumbSchema, addAggregateRatingSchema } from "@/utils/seoUtils";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import arthurThumbsUp from "@/assets/mascotte/arthur-thumbs-up.png";
import arthurFlying from "@/assets/mascotte/arthur-flying.png";

const formSchema = z.object({
  marque: z.string().min(1, "Champ requis"),
  modele: z.string().min(1, "Champ requis"),
  annee: z.string().min(1, "Champ requis"),
  typeMoto: z.string().min(1, "Champ requis"),
  cylindree: z.string().min(1, "Champ requis"),
  codePostal: z.string().length(5, "Code postal invalide"),
  age: z.string().min(1, "Champ requis"),
  permis: z.string().min(1, "Champ requis"),
});

const AssuranceMoto = () => {
  const [insurerOffers, setInsurerOffers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [submittedFormData, setSubmittedFormData] = useState<Record<string, any>>({});
  const formRef = useRef<HTMLDivElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { marque: "", modele: "", annee: "", typeMoto: "", cylindree: "", codePostal: "", age: "", permis: "" },
  });

  const scrollToForm = () => { formRef.current?.scrollIntoView({ behavior: 'smooth' }); };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      setSubmittedFormData(values);
      const basePrice = 50;
      const ageDriver = parseInt(values.age);
      const yearVehicle = parseInt(values.annee);
      const cylindreeValue = parseInt(values.cylindree);
      let price = basePrice;

      if (ageDriver < 25) price += 70;
      else if (ageDriver < 30) price += 35;
      if (yearVehicle < 2015) price += 20;
      else if (yearVehicle > 2020) price += 25;
      if (cylindreeValue > 800) price += 60;
      else if (cylindreeValue > 600) price += 35;
      else if (cylindreeValue > 500) price += 20;
      else if (cylindreeValue <= 125) price -= 15;
      if (values.typeMoto === "sportive") price += 80;
      else if (values.typeMoto === "trail") price += 10;
      else if (values.typeMoto === "scooter") price -= 10;

      const randomVariation = Math.floor(Math.random() * 25) - 12;
      price += randomVariation;

      const offers = generateInsurerOffers(price, motoInsurers);
      setInsurerOffers(offers);
      toast.success("Offres générées !", { description: "Consultez les meilleures offres pour votre moto." });
    } catch (error: any) {
      console.error("Error:", error);
      toast.error("Erreur", { description: "Une erreur est survenue. Veuillez réessayer." });
    } finally { setIsLoading(false); }
  };

  const breadcrumbSchema = addBreadcrumbSchema([
    { name: "Accueil", url: "https://www.jemassuremoinscher.fr/" },
    { name: "Assurance Moto", url: "https://www.jemassuremoinscher.fr/assurance-moto" }
  ]);
  const serviceSchema = addServiceSchema({ name: "Comparateur Assurance Moto", description: "Comparez les assurances moto et scooter. Devis gratuit et rapide.", provider: "jemassuremoinscher", areaServed: "France" });
  const ratingSchema = addAggregateRatingSchema("Comparateur Assurance Moto", 4.5, 987);
  const faqSchema = addFAQSchema([
    { question: "Quelle assurance moto choisir ?", answer: "Le choix dépend de votre moto, votre profil et usage. Comparez les formules au tiers, intermédiaire et tous risques." },
    { question: "L'assurance moto est-elle obligatoire ?", answer: "Oui, au minimum une assurance au tiers est obligatoire pour circuler." }
  ]);

  const advantages = [
    { icon: Euro, title: "Jusqu'à 35% d'économies", description: "Comparez et économisez sur votre assurance moto." },
    { icon: Clock, title: "Devis en 2 minutes", description: "Simple, rapide et 100% gratuit." },
    { icon: Shield, title: "15+ assureurs comparés", description: "Les meilleures offres du marché." }
  ];

  return (
    <div className="min-h-screen">
      <SEO title="Assurance Moto - Comparez les Meilleurs Tarifs | jemassuremoinscher" description="Comparez les assurances moto et scooter. Devis gratuit. Économisez jusqu'à 35%." keywords="assurance moto, assurance scooter, comparateur assurance moto" canonical="https://www.jemassuremoinscher.fr/assurance-moto" jsonLd={[breadcrumbSchema, serviceSchema, ratingSchema, faqSchema]} />
      <Header />

      <section className="bg-gradient-to-br from-primary/5 to-primary/10 py-16 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center relative">
            <img src={arthurThumbsUp} alt="Arthur" className="hidden lg:block absolute -left-32 bottom-0 w-32 h-auto" />
            <div className="flex justify-center mb-6"><div className="p-4 rounded-full bg-primary/10"><Bike className="h-12 w-12 text-primary" /></div></div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Assurance Moto</h1>
            <p className="text-xl text-muted-foreground mb-8">Comparez les meilleures offres et économisez jusqu'à 35% sur votre assurance moto.</p>
            <Button size="lg" onClick={scrollToForm} className="text-lg px-8 py-6">Comparer maintenant</Button>
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
            <h2 className="text-2xl font-bold mb-6 text-card-foreground">Obtenez votre devis personnalisé</h2>
            {insurerOffers.length > 0 ? (
              <InsuranceComparison insurers={insurerOffers} onNewQuote={() => setInsurerOffers([])} formData={submittedFormData} insuranceType="Assurance Moto" />
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField control={form.control} name="marque" render={({ field }) => (<FormItem><FormLabel>Marque de la moto</FormLabel><FormControl><Input placeholder="Ex: Yamaha, Honda..." {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="modele" render={({ field }) => (<FormItem><FormLabel>Modèle</FormLabel><FormControl><Input placeholder="Ex: MT-07, CBR..." {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="annee" render={({ field }) => (<FormItem><FormLabel>Année</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger></FormControl><SelectContent>{Array.from({ length: 2025 - 2000 + 1 }, (_, i) => 2025 - i).map((year) => (<SelectItem key={year} value={year.toString()}>{year}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="typeMoto" render={({ field }) => (<FormItem><FormLabel>Type de moto</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger></FormControl><SelectContent><SelectItem value="roadster">Roadster</SelectItem><SelectItem value="sportive">Sportive</SelectItem><SelectItem value="custom">Custom</SelectItem><SelectItem value="trail">Trail</SelectItem><SelectItem value="scooter">Scooter</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                  </div>
                  <FormField control={form.control} name="cylindree" render={({ field }) => (<FormItem><FormLabel>Cylindrée (cm³)</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger></FormControl><SelectContent><SelectItem value="125">125 cm³</SelectItem><SelectItem value="300">300 cm³</SelectItem><SelectItem value="500">500 cm³</SelectItem><SelectItem value="600">600 cm³</SelectItem><SelectItem value="800">800 cm³</SelectItem><SelectItem value="1000">1000 cm³ et +</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="codePostal" render={({ field }) => (<FormItem><FormLabel>Code postal</FormLabel><FormControl><Input placeholder="75001" maxLength={5} {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="age" render={({ field }) => (<FormItem><FormLabel>Votre âge</FormLabel><FormControl><Input type="number" placeholder="25" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="permis" render={({ field }) => (<FormItem><FormLabel>Date d'obtention du permis</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <Button type="submit" className="w-full" size="lg" disabled={isLoading}>{isLoading ? "Envoi en cours..." : "Comparer les offres"}</Button>
                </form>
              </Form>
            )}
          </Card>
        </div>

        <section className="max-w-4xl mx-auto mb-16">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="learn-more" className="border rounded-lg">
              <AccordionTrigger className="px-6 py-4 hover:no-underline"><span className="text-lg font-semibold flex items-center gap-2">En savoir plus sur l'assurance moto</span></AccordionTrigger>
              <AccordionContent className="px-6 pb-6">
                <div className="space-y-12">
                  <InsuranceFAQ title="Questions fréquentes" faqs={[
                    { question: "Quelle est la différence entre assurance au tiers et tous risques ?", answer: "L'assurance au tiers couvre les dommages causés aux tiers. Le tous risques inclut aussi les dommages à votre propre moto." },
                    { question: "La garantie conducteur est-elle importante ?", answer: "Oui, elle vous indemnise en cas de blessures, même si vous êtes responsable de l'accident." },
                    { question: "Mon équipement est-il couvert ?", answer: "Certaines formules couvrent casque, blouson et gants. Vérifiez les plafonds de remboursement." },
                    { question: "Puis-je assurer un scooter 50cc ?", answer: "Oui, l'assurance est obligatoire pour tout véhicule à moteur, y compris les scooters 50cc." },
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
            <h2 className="text-2xl font-bold mb-4">Prêt à économiser sur votre assurance moto ?</h2>
            <p className="text-muted-foreground mb-6">Comparez gratuitement les meilleures offres en 2 minutes.</p>
            <Button size="lg" onClick={scrollToForm} className="w-full max-w-md text-lg py-6">Comparer les offres maintenant</Button>
          </Card>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AssuranceMoto;
