import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShieldCheck, Shield, Euro, Clock } from "lucide-react";
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
import arthurThumbsUp from "@/assets/mascotte/arthur-thumbs-up.png";
import arthurFlying from "@/assets/mascotte/arthur-flying.png";

const formSchema = z.object({
  entreprise: z.string().min(1, "Champ requis"),
  secteur: z.string().min(1, "Champ requis"),
  effectif: z.string().min(1, "Champ requis"),
  chiffreAffaires: z.string().min(1, "Champ requis"),
  sinistresAnnee: z.string().min(1, "Champ requis"),
  codePostal: z.string().length(5, "Code postal invalide"),
});

const rcProInsurers: InsurerConfig[] = [
  { name: "AXA", priceMultiplier: 1.00, coverage: ["Dommages corporels", "Dommages matériels", "Dommages immatériels", "Protection juridique"] },
  { name: "Allianz", priceMultiplier: 1.05, coverage: ["RC après livraison", "Atteinte à l'environnement", "Défense pénale", "Assistance juridique"], discount: "-12% en ligne" },
  { name: "MMA", priceMultiplier: 0.95, coverage: ["Garantie décennale incluse", "Faute inexcusable", "Sous-traitants", "Extension géographique"], discount: "-15% nouveau client" },
  { name: "Generali", priceMultiplier: 1.08, coverage: ["Responsabilité civile générale", "Produits livrés", "Mise en cause personnelle", "Recours clients"] },
  { name: "Groupama", priceMultiplier: 1.02, coverage: ["RC exploitation", "RC après travaux", "Protection locaux", "Défense et recours"] },
  { name: "MAIF", priceMultiplier: 0.98, coverage: ["Dommages tous accidents", "Garantie financière", "Assistance sinistre", "Experts dédiés"] },
];

const AssuranceRCPro = () => {
  const [insurerOffers, setInsurerOffers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [submittedFormData, setSubmittedFormData] = useState<Record<string, any>>({});
  const formRef = useRef<HTMLDivElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { entreprise: "", secteur: "", effectif: "", chiffreAffaires: "", sinistresAnnee: "", codePostal: "" },
  });

  const scrollToForm = () => { formRef.current?.scrollIntoView({ behavior: 'smooth' }); };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      setSubmittedFormData(values);
      const basePrice = 60;
      let price = basePrice;
      const effectif = parseInt(values.effectif);
      if (effectif > 50) price += 90; else if (effectif > 20) price += 55; else if (effectif > 10) price += 30; else if (effectif > 5) price += 15;
      if (values.secteur === "batiment") price += 70; else if (values.secteur === "sante") price += 80; else if (values.secteur === "conseil") price += 50; else if (values.secteur === "transport") price += 60;
      const ca = parseInt(values.chiffreAffaires);
      if (ca > 1000000) price += 80; else if (ca > 500000) price += 50; else if (ca > 250000) price += 25;
      const sinistres = parseInt(values.sinistresAnnee);
      if (sinistres > 2) price += 60; else if (sinistres > 0) price += 30;
      const randomVariation = Math.floor(Math.random() * 20) - 10;
      price += randomVariation;
      const offers = generateInsurerOffers(price, rcProInsurers);
      setInsurerOffers(offers);
      toast.success("Offres générées !", { description: "Consultez les meilleures offres RC Pro." });
    } catch (error: any) {
      console.error("Error:", error);
      toast.error("Erreur", { description: "Une erreur est survenue. Veuillez réessayer." });
    } finally { setIsLoading(false); }
  };

  const breadcrumbSchema = addBreadcrumbSchema([{ name: "Accueil", url: "https://www.jemassuremoinscher.fr/" }, { name: "RC Pro", url: "https://www.jemassuremoinscher.fr/assurance-rc-pro" }]);
  const serviceSchema = addServiceSchema({ name: "Comparateur Assurance RC Pro", description: "Comparez les assurances RC Professionnelle.", provider: "jemassuremoinscher", areaServed: "France" });
  const faqSchema = addFAQSchema([
    { question: "Qu'est-ce que la RC Pro ?", answer: "Elle couvre les dommages causés à des tiers dans le cadre de votre activité professionnelle." },
    { question: "Est-elle obligatoire ?", answer: "Obligatoire pour certaines professions réglementées, recommandée pour toutes." }
  ]);

  const advantages = [
    { icon: Euro, title: "Tarifs compétitifs", description: "Comparez et économisez sur votre RC Pro." },
    { icon: Clock, title: "Devis en 2 minutes", description: "Simple, rapide et 100% gratuit." },
    { icon: Shield, title: "15+ assureurs comparés", description: "Les meilleures offres pro du marché." }
  ];

  return (
    <div className="min-h-screen">
      <SEO title="RC Pro - Responsabilité Civile Professionnelle | Comparateur" description="Comparez les assurances RC Pro. Devis gratuit pour tous secteurs." keywords="RC Pro, responsabilité civile professionnelle, assurance RC" canonical="https://www.jemassuremoinscher.fr/assurance-rc-pro" jsonLd={[breadcrumbSchema, serviceSchema, faqSchema]} />
      <Header />
      <section className="bg-gradient-to-br from-primary/5 to-primary/10 py-16 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center relative">
            <img src={arthurThumbsUp} alt="Arthur" className="hidden lg:block absolute -left-32 bottom-0 w-32 h-auto" />
            <div className="flex justify-center mb-6"><div className="p-4 rounded-full bg-primary/10"><ShieldCheck className="h-12 w-12 text-primary" /></div></div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">RC Professionnelle</h1>
            <p className="text-xl text-muted-foreground mb-8">Protégez votre activité contre les dommages causés à vos clients et tiers.</p>
            <Button size="lg" onClick={scrollToForm} className="text-lg px-8 py-6">Comparer maintenant</Button>
          </div>
        </div>
      </section>
      <main className="container mx-auto px-4 py-12">
        <section className="max-w-4xl mx-auto mb-12"><div className="grid md:grid-cols-3 gap-6">{advantages.map((item, index) => (<Card key={index} className="p-6 text-center"><div className="flex justify-center mb-4"><div className="p-3 rounded-full bg-primary/10"><item.icon className="h-8 w-8 text-primary" /></div></div><h3 className="font-bold text-lg mb-2">{item.title}</h3><p className="text-muted-foreground text-sm">{item.description}</p></Card>))}</div></section>
        <div ref={formRef} className="max-w-3xl mx-auto mb-16">
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-6 text-card-foreground">Obtenez votre devis personnalisé</h2>
            {insurerOffers.length > 0 ? (
              <InsuranceComparison insurers={insurerOffers} onNewQuote={() => setInsurerOffers([])} formData={submittedFormData} insuranceType="RC Professionnelle" />
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="entreprise" render={({ field }) => (<FormItem><FormLabel>Nom de l'entreprise</FormLabel><FormControl><Input placeholder="Votre entreprise" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="secteur" render={({ field }) => (<FormItem><FormLabel>Secteur d'activité</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Choisissez" /></SelectTrigger></FormControl><SelectContent><SelectItem value="commerce">Commerce</SelectItem><SelectItem value="services">Services</SelectItem><SelectItem value="batiment">Bâtiment</SelectItem><SelectItem value="conseil">Conseil</SelectItem><SelectItem value="sante">Santé</SelectItem><SelectItem value="artisanat">Artisanat</SelectItem><SelectItem value="informatique">Informatique</SelectItem><SelectItem value="autre">Autre</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="effectif" render={({ field }) => (<FormItem><FormLabel>Nombre de salariés</FormLabel><FormControl><Input type="number" placeholder="0" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="chiffreAffaires" render={({ field }) => (<FormItem><FormLabel>Chiffre d'affaires annuel (€)</FormLabel><FormControl><Input type="number" placeholder="100000" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="sinistresAnnee" render={({ field }) => (<FormItem><FormLabel>Sinistres sur 3 ans</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Choisissez" /></SelectTrigger></FormControl><SelectContent><SelectItem value="0">Aucun</SelectItem><SelectItem value="1">1 sinistre</SelectItem><SelectItem value="2">2 sinistres</SelectItem><SelectItem value="3">3 sinistres ou plus</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="codePostal" render={({ field }) => (<FormItem><FormLabel>Code postal</FormLabel><FormControl><Input placeholder="75001" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  </div>
                  <Button type="submit" className="w-full" size="lg" disabled={isLoading}>{isLoading ? "Envoi en cours..." : "Comparer les offres"}</Button>
                </form>
              </Form>
            )}
          </Card>
        </div>
        <section className="max-w-4xl mx-auto mb-16">
          <Accordion type="single" collapsible className="w-full"><AccordionItem value="learn-more" className="border rounded-lg"><AccordionTrigger className="px-6 py-4 hover:no-underline"><span className="text-lg font-semibold">En savoir plus sur la RC Pro</span></AccordionTrigger><AccordionContent className="px-6 pb-6"><div className="space-y-12">
            <InsuranceFAQ title="Questions fréquentes" faqs={[
              { question: "Quels dommages sont couverts ?", answer: "Dommages corporels, matériels et immatériels causés à des tiers dans le cadre de votre activité." },
              { question: "La RC Pro couvre-t-elle mes salariés ?", answer: "Non, les salariés sont couverts par les accidents du travail. La RC Pro protège contre les dommages aux clients et tiers." },
              { question: "Quel est le délai de mise en place ?", answer: "Généralement immédiat ou sous 24-48h après la souscription." },
            ]} />
            <SavingsCalculator /><QuoteRequestForm /><Testimonials />
          </div></AccordionContent></AccordionItem></Accordion>
        </section>
        <section className="max-w-2xl mx-auto text-center mb-16">
          <Card className="p-8 bg-primary/5 border-primary/20 relative overflow-visible">
            <img src={arthurFlying} alt="Arthur" className="absolute -right-6 -top-10 w-20 h-auto hidden sm:block" />
            <h2 className="text-2xl font-bold mb-4">Prêt à protéger votre activité ?</h2>
            <p className="text-muted-foreground mb-6">Comparez gratuitement les meilleures offres RC Pro en 2 minutes.</p>
            <Button size="lg" onClick={scrollToForm} className="w-full max-w-md text-lg py-6">Comparer les offres maintenant</Button>
          </Card>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AssuranceRCPro;
