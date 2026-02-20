import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PawPrint, Shield, Euro, Clock } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { useState, useRef } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import InsuranceComparison from "@/components/InsuranceComparison";
import { petInsurers, generateInsurerOffers } from "@/utils/insurerData";
import SEO from "@/components/SEO";
import InsuranceFAQ from "@/components/insurance/InsuranceFAQ";
import Testimonials from "@/components/Testimonials";
import { SavingsCalculator } from "@/components/calculator/SavingsCalculator";
import { QuoteRequestForm } from "@/components/forms/QuoteRequestForm";
import { addServiceSchema, addFAQSchema, addBreadcrumbSchema, addHowToSchema } from "@/utils/seoUtils";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import arthurThumbsUp from "@/assets/mascotte/arthur-thumbs-up.png";
import arthurFlying from "@/assets/mascotte/arthur-flying.png";

const formSchema = z.object({
  typeAnimal: z.string().min(1, "Champ requis"),
  race: z.string().min(1, "Champ requis"),
  ageAnimal: z.string().min(1, "Champ requis"),
  sexe: z.string().min(1, "Champ requis"),
  sterilise: z.string().min(1, "Champ requis"),
  codePostal: z.string().length(5, "Code postal invalide"),
});

const AssuranceAnimaux = () => {
  const [insurerOffers, setInsurerOffers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [submittedFormData, setSubmittedFormData] = useState<Record<string, any>>({});
  const formRef = useRef<HTMLDivElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { typeAnimal: "", race: "", ageAnimal: "", sexe: "", sterilise: "", codePostal: "" },
  });

  const scrollToForm = () => { formRef.current?.scrollIntoView({ behavior: 'smooth' }); };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      setSubmittedFormData(values);
      const basePrice = 25;
      const age = parseInt(values.ageAnimal);
      let price = basePrice;

      if (values.typeAnimal === "chien") price += 15;
      else if (values.typeAnimal === "chat") price += 5;
      if (age > 10) price += 25; else if (age > 8) price += 15; else if (age > 5) price += 8; else if (age < 1) price += 5;
      if (values.sterilise === "oui") price -= 3;

      const randomVariation = Math.floor(Math.random() * 12) - 6;
      price += randomVariation;

      const offers = generateInsurerOffers(price, petInsurers);
      setInsurerOffers(offers);
      toast.success("Offres générées !", { description: "Consultez les meilleures offres pour votre animal." });
    } catch (error: any) {
      console.error("Error:", error);
      toast.error("Erreur", { description: "Une erreur est survenue. Veuillez réessayer." });
    } finally { setIsLoading(false); }
  };

  const breadcrumbSchema = addBreadcrumbSchema([
    { name: "Accueil", url: "https://www.jemassuremoinscher.fr/" },
    { name: "Assurance Animaux", url: "https://www.jemassuremoinscher.fr/assurance-animaux" }
  ]);
  const serviceSchema = addServiceSchema({ name: "Comparateur Assurance Animaux", description: "Comparez les assurances pour chiens et chats. Remboursement des frais vétérinaires jusqu'à 100%.", provider: "jemassuremoinscher", areaServed: "France" });
  const faqSchema = addFAQSchema([
    { question: "Pourquoi assurer son animal ?", answer: "Pour couvrir les frais vétérinaires souvent élevés (accidents, maladies, chirurgie)." },
    { question: "Combien coûte une assurance animaux ?", answer: "De 10€ à 60€/mois selon l'espèce, l'âge, la race et le niveau de garanties." }
  ]);

  const advantages = [
    { icon: Euro, title: "Jusqu'à 100% remboursé", description: "Les meilleurs taux de remboursement vétérinaire." },
    { icon: Clock, title: "Devis en 2 minutes", description: "Simple, rapide et 100% gratuit." },
    { icon: Shield, title: "10+ assureurs comparés", description: "Les meilleures mutuelles animaux." }
  ];

  return (
    <div className="min-h-screen">
      <SEO title="Assurance Animaux - Protégez votre chien ou chat | jemassuremoinscher" description="Comparez les assurances pour chiens et chats. Remboursement des frais vétérinaires jusqu'à 100%." keywords="assurance chien, assurance chat, mutuelle animaux" canonical="https://www.jemassuremoinscher.fr/assurance-animaux" jsonLd={[breadcrumbSchema, serviceSchema, faqSchema]} />
      <Header />

      <section className="bg-gradient-to-br from-primary/5 to-primary/10 py-16 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center relative">
            <img src={arthurThumbsUp} alt="Arthur" className="hidden lg:block absolute -left-32 bottom-0 w-32 h-auto" />
            <div className="flex justify-center mb-6"><div className="p-4 rounded-full bg-primary/10"><PawPrint className="h-12 w-12 text-primary" /></div></div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Assurance Animaux</h1>
            <p className="text-xl text-muted-foreground mb-8">Protégez la santé de votre compagnon et maîtrisez vos dépenses vétérinaires.</p>
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
              <InsuranceComparison insurers={insurerOffers} onNewQuote={() => setInsurerOffers([])} formData={submittedFormData} insuranceType="Assurance Animaux" />
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField control={form.control} name="typeAnimal" render={({ field }) => (<FormItem><FormLabel>Type d'animal</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger></FormControl><SelectContent><SelectItem value="chien">Chien</SelectItem><SelectItem value="chat">Chat</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="race" render={({ field }) => (<FormItem><FormLabel>Race</FormLabel><FormControl><Input placeholder="Ex: Labrador, Siamois..." {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="ageAnimal" render={({ field }) => (<FormItem><FormLabel>Âge de l'animal</FormLabel><FormControl><Input type="number" placeholder="3" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="sexe" render={({ field }) => (<FormItem><FormLabel>Sexe</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger></FormControl><SelectContent><SelectItem value="male">Mâle</SelectItem><SelectItem value="femelle">Femelle</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="sterilise" render={({ field }) => (<FormItem><FormLabel>Stérilisé/Castré</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger></FormControl><SelectContent><SelectItem value="oui">Oui</SelectItem><SelectItem value="non">Non</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="codePostal" render={({ field }) => (<FormItem><FormLabel>Code postal</FormLabel><FormControl><Input placeholder="75001" maxLength={5} {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <Button type="submit" className="w-full" size="lg" disabled={isLoading}>{isLoading ? "Envoi en cours..." : "Comparer les offres"}</Button>
                </form>
              </Form>
            )}
          </Card>
        </div>

        <section className="max-w-4xl mx-auto mb-16">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="learn-more" className="border rounded-lg">
              <AccordionTrigger className="px-6 py-4 hover:no-underline"><span className="text-lg font-semibold flex items-center gap-2">En savoir plus sur l'assurance animaux</span></AccordionTrigger>
              <AccordionContent className="px-6 pb-6">
                <div className="space-y-12">
                  <InsuranceFAQ title="Questions fréquentes" faqs={[
                    { question: "À partir de quel âge peut-on assurer son animal ?", answer: "Dès 2-3 mois jusqu'à 8-10 ans pour une première souscription." },
                    { question: "Qu'est-ce que le délai de carence ?", answer: "Période après souscription pendant laquelle vous n'êtes pas couvert. Quelques jours pour les accidents, quelques mois pour les maladies." },
                    { question: "Les vaccins sont-ils remboursés ?", answer: "Oui, avec les formules incluant un forfait prévention (vaccins, vermifuges, antiparasitaires)." },
                    { question: "Que faire si mon animal a un problème de santé préexistant ?", answer: "Les affections préexistantes sont généralement exclues. Souscrivez le plus tôt possible." },
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
            <h2 className="text-2xl font-bold mb-4">Prêt à protéger votre compagnon ?</h2>
            <p className="text-muted-foreground mb-6">Comparez gratuitement les meilleures mutuelles animaux en 2 minutes.</p>
            <Button size="lg" onClick={scrollToForm} className="w-full max-w-md text-lg py-6">Comparer les offres maintenant</Button>
          </Card>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AssuranceAnimaux;
