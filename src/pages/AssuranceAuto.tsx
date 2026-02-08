import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Car, Shield, Euro, Clock, ChevronDown } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { useState, useRef } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import InsuranceComparison from "@/components/InsuranceComparison";
import { autoInsurers, generateInsurerOffers } from "@/utils/insurerData";
import SEO from "@/components/SEO";
import InsuranceFAQ from "@/components/insurance/InsuranceFAQ";
import Testimonials from "@/components/Testimonials";
import { SavingsCalculator } from "@/components/calculator/SavingsCalculator";
import { QuoteRequestForm } from "@/components/forms/QuoteRequestForm";
import { addServiceSchema, addFAQSchema, addBreadcrumbSchema, addAggregateRatingSchema, addHowToSchema } from "@/utils/seoUtils";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const formSchema = z.object({
  marque: z.string().min(1, "Champ requis"),
  modele: z.string().min(1, "Champ requis"),
  annee: z.string().min(1, "Champ requis"),
  carburant: z.string().min(1, "Champ requis"),
  codePostal: z.string().length(5, "Code postal invalide"),
  age: z.string().min(1, "Champ requis"),
  permis: z.string().min(1, "Champ requis"),
  bonusMalus: z.string().min(1, "Champ requis"),
});

const AssuranceAuto = () => {
  const { toast } = useToast();
  const [insurerOffers, setInsurerOffers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [submittedFormData, setSubmittedFormData] = useState<Record<string, any>>({});
  const formRef = useRef<HTMLDivElement>(null);

  const modelsByBrand: Record<string, string[]> = {
    "Peugeot": ["208", "308", "3008", "2008", "508", "5008", "Partner", "Expert", "Rifter"],
    "Renault": ["Clio", "Captur", "Megane", "Kadjar", "Scenic", "Espace", "Twingo", "Zoe", "Arkana"],
    "Citroën": ["C3", "C4", "C5 Aircross", "C3 Aircross", "Berlingo", "SpaceTourer", "Ami"],
    "Volkswagen": ["Golf", "Polo", "Tiguan", "T-Roc", "Passat", "Touran", "ID.3", "ID.4", "Arteon"],
    "BMW": ["Série 1", "Série 2", "Série 3", "Série 4", "Série 5", "X1", "X3", "X5", "iX3", "i4"],
    "Mercedes-Benz": ["Classe A", "Classe B", "Classe C", "Classe E", "GLA", "GLB", "GLC", "EQC"],
    "Audi": ["A1", "A3", "A4", "A6", "Q2", "Q3", "Q5", "Q7", "e-tron", "Q4 e-tron"],
    "Toyota": ["Yaris", "Corolla", "C-HR", "RAV4", "Aygo", "Prius", "Camry", "Highlander"],
    "Ford": ["Fiesta", "Focus", "Puma", "Kuga", "Mustang", "Ranger", "Transit"],
    "Opel": ["Corsa", "Astra", "Crossland", "Grandland", "Mokka", "Combo", "Vivaro"],
    "Fiat": ["500", "Panda", "Tipo", "500X", "500L", "Ducato"],
    "Nissan": ["Micra", "Juke", "Qashqai", "X-Trail", "Leaf", "Ariya"],
    "Kia": ["Picanto", "Rio", "Ceed", "XCeed", "Sportage", "Niro", "EV6"],
    "Hyundai": ["i10", "i20", "i30", "Tucson", "Kona", "Santa Fe", "Ioniq 5"],
    "Mazda": ["Mazda2", "Mazda3", "CX-3", "CX-30", "CX-5", "MX-5"],
    "Honda": ["Jazz", "Civic", "CR-V", "HR-V", "e"],
    "Seat": ["Ibiza", "Leon", "Arona", "Ateca", "Tarraco"],
    "Skoda": ["Fabia", "Octavia", "Scala", "Kamiq", "Karoq", "Kodiaq", "Enyaq"],
    "Dacia": ["Sandero", "Duster", "Logan", "Spring", "Jogger"],
    "Mini": ["Cooper", "Countryman", "Clubman"],
    "Volvo": ["XC40", "XC60", "XC90", "V60", "V90", "S60", "S90"],
    "Tesla": ["Model 3", "Model Y", "Model S", "Model X"],
    "DS": ["DS 3", "DS 4", "DS 7", "DS 9"],
    "Alfa Romeo": ["Giulia", "Stelvio", "Tonale"],
    "Jeep": ["Renegade", "Compass", "Cherokee", "Wrangler"],
    "Land Rover": ["Defender", "Discovery", "Range Rover", "Range Rover Evoque", "Range Rover Sport"],
    "Porsche": ["911", "Cayenne", "Macan", "Panamera", "Taycan"],
    "Lexus": ["CT", "IS", "NX", "RX", "UX"],
    "Jaguar": ["E-Pace", "F-Pace", "XE", "XF", "I-Pace"],
    "Smart": ["ForTwo", "ForFour"],
    "Suzuki": ["Ignis", "Swift", "Vitara", "S-Cross"],
    "Mitsubishi": ["Space Star", "ASX", "Eclipse Cross", "Outlander"],
    "Subaru": ["Impreza", "XV", "Forester", "Outback"],
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      marque: "",
      modele: "",
      annee: "",
      carburant: "",
      codePostal: "",
      age: "",
      permis: "",
      bonusMalus: "",
    },
  });

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      setSubmittedFormData(values);
      
      const basePrice = 65;
      const ageDriver = parseInt(values.age);
      const yearVehicle = parseInt(values.annee);
      const bonusMalusCoef = parseFloat(values.bonusMalus);
      let price = basePrice;
      
      if (ageDriver < 25) price += 80;
      else if (ageDriver < 30) price += 40;
      
      if (yearVehicle < 2010) price += 25;
      else if (yearVehicle < 2015) price += 15;
      else if (yearVehicle > 2020) price += 20;
      
      if (values.carburant === "electrique") price -= 15;
      else if (values.carburant === "hybride") price -= 8;
      
      price = price * bonusMalusCoef;
      
      const randomVariation = Math.floor(Math.random() * 30) - 15;
      price += randomVariation;

      const offers = generateInsurerOffers(price, autoInsurers);
      setInsurerOffers(offers);
      toast({
        title: "Offres générées !",
        description: "Consultez les meilleures offres pour votre profil.",
      });
    } catch (error: any) {
      console.error("Error:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const breadcrumbSchema = addBreadcrumbSchema([
    { name: "Accueil", url: "https://www.assurmoinschere.fr/" },
    { name: "Assurance Auto", url: "https://www.assurmoinschere.fr/assurance-auto" }
  ]);

  const serviceSchema = addServiceSchema({
    name: "Comparateur Assurance Auto",
    description: "Comparez les meilleures offres d'assurance auto en France. Devis gratuit et personnalisé en 2 minutes. Économisez jusqu'à 400€ par an.",
    provider: "jemassuremoinscher",
    areaServed: "France"
  });

  const ratingSchema = addAggregateRatingSchema(
    "Comparateur Assurance Auto",
    4.7,
    1853
  );

  const howToSchema = addHowToSchema({
    name: "Comment obtenir un devis d'assurance auto en ligne",
    description: "Guide étape par étape pour comparer et obtenir votre devis d'assurance auto en 2 minutes",
    totalTime: "PT2M",
    steps: [
      {
        name: "Renseignez les informations de votre véhicule",
        text: "Indiquez la marque, le modèle, la date de mise en circulation et l'usage de votre véhicule."
      },
      {
        name: "Précisez votre profil de conducteur",
        text: "Renseignez votre âge, votre ancienneté de permis et votre coefficient bonus-malus."
      },
      {
        name: "Comparez les offres disponibles",
        text: "Recevez instantanément plusieurs devis d'assureurs partenaires."
      },
      {
        name: "Souscrivez en ligne",
        text: "Sélectionnez l'offre qui vous convient et finalisez votre souscription."
      }
    ]
  });

  const faqSchema = addFAQSchema([
    {
      question: "Quelle assurance auto choisir ?",
      answer: "Le choix dépend de votre profil, votre véhicule et votre budget. Notre comparateur vous aide à trouver l'offre la mieux adaptée."
    },
    {
      question: "Combien coûte une assurance auto ?",
      answer: "Le prix varie selon votre âge, votre véhicule, votre historique et votre lieu de résidence. En moyenne, entre 400€ et 800€ par an."
    },
    {
      question: "Puis-je changer d'assurance auto à tout moment ?",
      answer: "Oui, grâce à la loi Hamon, vous pouvez résilier après un an sans frais ni justification."
    }
  ]);

  const advantages = [
    {
      icon: Euro,
      title: "Jusqu'à 400€ d'économies",
      description: "Comparez et économisez sur votre assurance auto."
    },
    {
      icon: Clock,
      title: "Devis en 2 minutes",
      description: "Simple, rapide et 100% gratuit."
    },
    {
      icon: Shield,
      title: "20+ assureurs comparés",
      description: "Les meilleures offres du marché."
    }
  ];

  return (
    <div className="min-h-screen">
      <SEO 
        title="Assurance Auto - Comparez et Économisez | jemassuremoinscher"
        description="Comparez les meilleures assurances auto en France. Devis gratuit en 2 minutes. Économisez jusqu'à 400€/an."
        keywords="assurance auto, devis assurance voiture, assurance auto pas cher, comparateur assurance auto"
        canonical="https://www.assurmoinschere.fr/assurance-auto"
        jsonLd={[breadcrumbSchema, serviceSchema, ratingSchema, howToSchema, faqSchema]}
      />
      <Header />
      
      {/* Hero Section with CTA */}
      <section className="bg-gradient-to-br from-primary/5 to-primary/10 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 rounded-full bg-primary/10">
                <Car className="h-12 w-12 text-primary" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Assurance Auto</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Comparez les meilleures offres et économisez jusqu'à 400€ par an.
            </p>
            <Button size="lg" onClick={scrollToForm} className="text-lg px-8 py-6">
              Comparer maintenant
            </Button>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-12">
        {/* 3 Avantages Cards */}
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

        {/* Formulaire de devis */}
        <div ref={formRef} className="max-w-3xl mx-auto mb-16">
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-6 text-card-foreground">Obtenez votre devis personnalisé</h2>
            
            {insurerOffers.length > 0 ? (
              <InsuranceComparison 
                insurers={insurerOffers} 
                onNewQuote={() => setInsurerOffers([])}
                formData={submittedFormData}
                insuranceType="Assurance Auto"
              />
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="marque"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Marque du véhicule</FormLabel>
                        <Select 
                          onValueChange={(value) => {
                            field.onChange(value);
                            setSelectedBrand(value);
                            form.setValue("modele", "");
                          }} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner une marque" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="max-h-[300px]">
                            {Object.keys(modelsByBrand).sort().map((brand) => (
                              <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                            ))}
                            <SelectItem value="Autre">Autre</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="modele"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Modèle</FormLabel>
                        {selectedBrand && modelsByBrand[selectedBrand] ? (
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionner un modèle" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="max-h-[300px]">
                              {modelsByBrand[selectedBrand].map((model) => (
                                <SelectItem key={model} value={model}>{model}</SelectItem>
                              ))}
                              <SelectItem value="Autre">Autre</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <FormControl>
                            <Input 
                              placeholder={selectedBrand ? "Entrez le modèle" : "Sélectionnez d'abord une marque"} 
                              {...field}
                              disabled={!selectedBrand}
                            />
                          </FormControl>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="annee"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Année</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionner" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="max-h-[300px]">
                              {Array.from({ length: 2025 - 1980 + 1 }, (_, i) => 2025 - i).map((year) => (
                                <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="carburant"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Carburant</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionner" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="essence">Essence</SelectItem>
                              <SelectItem value="diesel">Diesel</SelectItem>
                              <SelectItem value="electrique">Électrique</SelectItem>
                              <SelectItem value="hybride">Hybride</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="codePostal"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Code postal</FormLabel>
                        <FormControl>
                          <Input placeholder="75001" maxLength={5} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="age"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Votre âge</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="25" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="permis"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date d'obtention du permis</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="bonusMalus"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Coefficient Bonus-Malus</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner votre coefficient" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="max-h-[300px]">
                            <SelectItem value="0.50">0.50 (Bonus maximal)</SelectItem>
                            <SelectItem value="0.60">0.60 (9 ans sans sinistre)</SelectItem>
                            <SelectItem value="0.70">0.70 (6 ans sans sinistre)</SelectItem>
                            <SelectItem value="0.80">0.80 (3 ans sans sinistre)</SelectItem>
                            <SelectItem value="0.90">0.90 (1 an sans sinistre)</SelectItem>
                            <SelectItem value="1.00">1.00 (Coefficient de référence)</SelectItem>
                            <SelectItem value="1.25">1.25 (1 sinistre responsable)</SelectItem>
                            <SelectItem value="1.50">1.50 (2+ sinistres)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                    {isLoading ? "Envoi en cours..." : "Comparer les offres"}
                  </Button>
                </form>
              </Form>
            )}
          </Card>
        </div>

        {/* Accordéon "En savoir plus" pour le contenu SEO */}
        <section className="max-w-4xl mx-auto mb-16">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="learn-more" className="border rounded-lg">
              <AccordionTrigger className="px-6 py-4 hover:no-underline">
                <span className="text-lg font-semibold flex items-center gap-2">
                  En savoir plus sur l'assurance auto
                </span>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6">
                <div className="space-y-12">
                  {/* FAQ */}
                  <InsuranceFAQ
                    title="Questions fréquentes"
                    faqs={[
                      {
                        question: "Quelle est la différence entre une assurance au tiers et tous risques ?",
                        answer: "L'assurance au tiers couvre uniquement les dommages causés aux tiers. L'assurance tous risques offre une protection complète incluant les dommages à votre propre véhicule."
                      },
                      {
                        question: "Comment est calculé le prix de mon assurance auto ?",
                        answer: "Le tarif dépend de votre âge, ancienneté de permis, historique de sinistres, type de véhicule et lieu de résidence."
                      },
                      {
                        question: "Puis-je résilier mon assurance auto à tout moment ?",
                        answer: "Oui, depuis la loi Hamon, vous pouvez résilier après un an d'engagement, sans frais ni pénalités."
                      },
                      {
                        question: "Qu'est-ce que le bonus-malus ?",
                        answer: "C'est un coefficient qui fait varier votre prime selon votre historique de conduite. Sans accident, vous gagnez 5% de bonus par an."
                      },
                    ]}
                  />

                  {/* Savings Calculator */}
                  <SavingsCalculator />

                  {/* Quote Request Form */}
                  <QuoteRequestForm />

                  {/* Testimonials */}
                  <Testimonials />
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        {/* CTA Bottom - Centré et large */}
        <section className="max-w-2xl mx-auto text-center mb-16">
          <Card className="p-8 bg-primary/5 border-primary/20">
            <h2 className="text-2xl font-bold mb-4">Prêt à économiser sur votre assurance auto ?</h2>
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

export default AssuranceAuto;
