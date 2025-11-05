import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Car, Shield, Euro, Clock, FileCheck, TrendingDown, Users } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import InsuranceComparison from "@/components/InsuranceComparison";
import { autoInsurers, generateInsurerOffers } from "@/utils/insurerData";
import SEO from "@/components/SEO";
import InfoSection from "@/components/insurance/InfoSection";
import HowItWorks from "@/components/insurance/HowItWorks";
import InsuranceFAQ from "@/components/insurance/InsuranceFAQ";
import Testimonials from "@/components/Testimonials";
import { InsuranceComparisonTool } from "@/components/comparison/InsuranceComparisonTool";
import { SavingsCalculator } from "@/components/calculator/SavingsCalculator";
import { QuoteRequestForm } from "@/components/forms/QuoteRequestForm";

const formSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères").max(100),
  email: z.string().email("Email invalide").max(255),
  phone: z.string().min(10, "Numéro de téléphone invalide").max(15),
  marque: z.string().min(1, "Champ requis"),
  modele: z.string().min(1, "Champ requis"),
  annee: z.string().min(1, "Champ requis"),
  carburant: z.string().min(1, "Champ requis"),
  codePostal: z.string().length(5, "Code postal invalide"),
  age: z.string().min(1, "Champ requis"),
  permis: z.string().min(1, "Champ requis"),
});

const AssuranceAuto = () => {
  const { toast } = useToast();
  const [insurerOffers, setInsurerOffers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      marque: "",
      modele: "",
      annee: "",
      carburant: "",
      codePostal: "",
      age: "",
      permis: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      // Calcul d'un prix estimé (simulation)
      const basePrice = 45;
      const ageDriver = parseInt(values.age);
      const yearVehicle = parseInt(values.annee);
      let price = basePrice;
      
      if (ageDriver < 25) price += 15;
      if (yearVehicle < 2015) price += 10;
      if (values.carburant === "electrique") price -= 5;
      
      const randomVariation = Math.floor(Math.random() * 20) - 10;
      price += randomVariation;

      const { data, error } = await supabase.functions.invoke("send-quote-email", {
        body: {
          name: values.name,
          email: values.email,
          phone: values.phone,
          type: "Assurance Auto",
          details: {
            marque: values.marque,
            modele: values.modele,
            annee: values.annee,
            carburant: values.carburant,
            codePostal: values.codePostal,
            age: values.age,
            permis: values.permis,
          },
          estimatedPrice: price,
        },
      });

      if (error) throw error;

      const offers = generateInsurerOffers(price, autoInsurers);
      setInsurerOffers(offers);
      toast({
        title: "Demande envoyée !",
        description: "Vous allez recevoir votre devis par email.",
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

  return (
    <div className="min-h-screen">
      <SEO 
        title="Assurance Auto - Comparez et Économisez | Le Comparateur Assurance"
        description="Comparez les meilleures assurances auto en France. Devis gratuit en 2 minutes. Économisez jusqu'à 400€/an avec nos partenaires Allianz, AXA, Direct Assurance, Groupama."
        keywords="assurance auto, devis assurance voiture, assurance auto pas cher, comparateur assurance auto, assurance tous risques"
        canonical="https://votre-domaine.fr/assurance-auto"
      />
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 to-primary/10 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 rounded-full bg-primary/10">
                <Car className="h-12 w-12 text-primary" />
              </div>
            </div>
            <h1 className="text-5xl font-bold text-foreground mb-6">Assurance Auto</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Comparez les meilleures offres d'assurance auto en quelques clics. 
              Économisez jusqu'à 400€ par an avec notre comparateur gratuit et sans engagement.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <span>Comparaison 100% gratuite</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                <span>Devis en 2 minutes</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <span>+50 000 clients satisfaits</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-12">
        {/* Formulaire de devis */}
        <div className="max-w-3xl mx-auto mb-16">
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-6 text-card-foreground">Obtenez votre devis personnalisé</h2>
            
            {insurerOffers.length > 0 ? (
              <InsuranceComparison 
                insurers={insurerOffers} 
                onNewQuote={() => setInsurerOffers([])} 
              />
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom complet</FormLabel>
                        <FormControl>
                          <Input placeholder="Jean Dupont" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="jean@exemple.fr" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Téléphone</FormLabel>
                        <FormControl>
                          <Input placeholder="0612345678" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="marque"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Marque du véhicule</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner une marque" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="max-h-[300px]">
                            <SelectItem value="Abarth">Abarth</SelectItem>
                            <SelectItem value="Alfa Romeo">Alfa Romeo</SelectItem>
                            <SelectItem value="Aston Martin">Aston Martin</SelectItem>
                            <SelectItem value="Audi">Audi</SelectItem>
                            <SelectItem value="Bentley">Bentley</SelectItem>
                            <SelectItem value="BMW">BMW</SelectItem>
                            <SelectItem value="Bugatti">Bugatti</SelectItem>
                            <SelectItem value="Cadillac">Cadillac</SelectItem>
                            <SelectItem value="Chevrolet">Chevrolet</SelectItem>
                            <SelectItem value="Chrysler">Chrysler</SelectItem>
                            <SelectItem value="Citroën">Citroën</SelectItem>
                            <SelectItem value="Cupra">Cupra</SelectItem>
                            <SelectItem value="Dacia">Dacia</SelectItem>
                            <SelectItem value="Daewoo">Daewoo</SelectItem>
                            <SelectItem value="Daihatsu">Daihatsu</SelectItem>
                            <SelectItem value="Dodge">Dodge</SelectItem>
                            <SelectItem value="DS">DS</SelectItem>
                            <SelectItem value="Ferrari">Ferrari</SelectItem>
                            <SelectItem value="Fiat">Fiat</SelectItem>
                            <SelectItem value="Ford">Ford</SelectItem>
                            <SelectItem value="Honda">Honda</SelectItem>
                            <SelectItem value="Hummer">Hummer</SelectItem>
                            <SelectItem value="Hyundai">Hyundai</SelectItem>
                            <SelectItem value="Infiniti">Infiniti</SelectItem>
                            <SelectItem value="Isuzu">Isuzu</SelectItem>
                            <SelectItem value="Jaguar">Jaguar</SelectItem>
                            <SelectItem value="Jeep">Jeep</SelectItem>
                            <SelectItem value="Kia">Kia</SelectItem>
                            <SelectItem value="Lada">Lada</SelectItem>
                            <SelectItem value="Lamborghini">Lamborghini</SelectItem>
                            <SelectItem value="Lancia">Lancia</SelectItem>
                            <SelectItem value="Land Rover">Land Rover</SelectItem>
                            <SelectItem value="Lexus">Lexus</SelectItem>
                            <SelectItem value="Lotus">Lotus</SelectItem>
                            <SelectItem value="Maserati">Maserati</SelectItem>
                            <SelectItem value="Mazda">Mazda</SelectItem>
                            <SelectItem value="McLaren">McLaren</SelectItem>
                            <SelectItem value="Mercedes-Benz">Mercedes-Benz</SelectItem>
                            <SelectItem value="MG">MG</SelectItem>
                            <SelectItem value="Mini">Mini</SelectItem>
                            <SelectItem value="Mitsubishi">Mitsubishi</SelectItem>
                            <SelectItem value="Nissan">Nissan</SelectItem>
                            <SelectItem value="Opel">Opel</SelectItem>
                            <SelectItem value="Peugeot">Peugeot</SelectItem>
                            <SelectItem value="Porsche">Porsche</SelectItem>
                            <SelectItem value="Renault">Renault</SelectItem>
                            <SelectItem value="Rolls-Royce">Rolls-Royce</SelectItem>
                            <SelectItem value="Rover">Rover</SelectItem>
                            <SelectItem value="Saab">Saab</SelectItem>
                            <SelectItem value="Seat">Seat</SelectItem>
                            <SelectItem value="Skoda">Skoda</SelectItem>
                            <SelectItem value="Smart">Smart</SelectItem>
                            <SelectItem value="SsangYong">SsangYong</SelectItem>
                            <SelectItem value="Subaru">Subaru</SelectItem>
                            <SelectItem value="Suzuki">Suzuki</SelectItem>
                            <SelectItem value="Tesla">Tesla</SelectItem>
                            <SelectItem value="Toyota">Toyota</SelectItem>
                            <SelectItem value="Volkswagen">Volkswagen</SelectItem>
                            <SelectItem value="Volvo">Volvo</SelectItem>
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
                        <FormControl>
                          <Input placeholder="Ex: Clio, 308..." {...field} />
                        </FormControl>
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
                                <SelectItem key={year} value={year.toString()}>
                                  {year}
                                </SelectItem>
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

                  <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                    {isLoading ? "Envoi en cours..." : "Comparer les offres"}
                  </Button>
                </form>
              </Form>
            )}
          </Card>
        </div>

        {/* Garanties Section */}
        <InfoSection
          title="Nos garanties d'assurance auto"
          description="Choisissez la formule qui correspond le mieux à vos besoins"
          items={[
            {
              icon: Shield,
              title: "Responsabilité Civile",
              description: "Obligatoire. Couvre les dommages causés aux tiers en cas d'accident responsable. Protection minimale requise par la loi.",
            },
            {
              icon: Car,
              title: "Tous Risques",
              description: "Protection complète incluant les dommages à votre véhicule, vol, incendie, bris de glace et catastrophes naturelles.",
            },
            {
              icon: Euro,
              title: "Tiers Plus",
              description: "Formule intermédiaire ajoutant au tiers de base le vol, l'incendie, le bris de glace et l'assistance 0 km.",
            },
            {
              icon: FileCheck,
              title: "Protection Juridique",
              description: "Assistance et prise en charge des frais de justice en cas de litige lié à votre véhicule.",
            },
            {
              icon: Users,
              title: "Garantie du Conducteur",
              description: "Indemnisation de vos propres blessures en cas d'accident, quelle que soit votre responsabilité.",
            },
            {
              icon: TrendingDown,
              title: "Valeur à Neuf",
              description: "Remboursement à la valeur d'achat pendant 2 ans en cas de vol ou destruction totale de votre véhicule neuf.",
            },
          ]}
        />

        {/* Comment ça marche */}
        <HowItWorks
          steps={[
            {
              number: "1",
              title: "Remplissez le formulaire",
              description: "Indiquez vos informations et les caractéristiques de votre véhicule en 2 minutes.",
            },
            {
              number: "2",
              title: "Comparez les offres",
              description: "Recevez instantanément plusieurs devis d'assureurs partenaires adaptés à votre profil.",
            },
            {
              number: "3",
              title: "Souscrivez en ligne",
              description: "Choisissez la meilleure offre et finalisez votre souscription directement en ligne.",
            },
          ]}
        />

        {/* Avantages */}
        <section className="py-12 max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
            Pourquoi choisir notre comparateur ?
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <Euro className="h-5 w-5 text-primary" />
                Économies garanties
              </h3>
              <p className="text-muted-foreground">
                Nos clients économisent en moyenne 350€ par an en comparant leur assurance auto. 
                Notre service gratuit vous permet d'accéder aux meilleurs tarifs du marché.
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Comparaison impartiale
              </h3>
              <p className="text-muted-foreground">
                Nous comparons les offres de plus de 20 assureurs partenaires pour vous présenter 
                les meilleures options selon vos critères, en toute transparence.
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Rapidité et simplicité
              </h3>
              <p className="text-muted-foreground">
                Obtenez vos devis en moins de 2 minutes. Notre formulaire simplifié vous fait 
                gagner du temps tout en vous assurant d'obtenir les offres les plus pertinentes.
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <FileCheck className="h-5 w-5 text-primary" />
                Sans engagement
              </h3>
              <p className="text-muted-foreground">
                La comparaison est totalement gratuite et sans engagement. Vous êtes libre de 
                souscrire ou non, et de choisir l'offre qui vous convient le mieux.
              </p>
            </Card>
          </div>
        </section>

        {/* FAQ */}
        <InsuranceFAQ
          title="Questions fréquentes sur l'assurance auto"
          faqs={[
            {
              question: "Quelle est la différence entre une assurance au tiers et tous risques ?",
              answer: "L'assurance au tiers est la formule minimale obligatoire qui couvre uniquement les dommages causés aux tiers. L'assurance tous risques offre une protection complète incluant les dommages à votre propre véhicule, même en cas d'accident responsable."
            },
            {
              question: "Comment est calculé le prix de mon assurance auto ?",
              answer: "Le tarif dépend de plusieurs critères : votre âge, votre ancienneté de permis, votre historique de sinistres (bonus-malus), le type de véhicule, son usage et votre lieu de résidence."
            },
            {
              question: "Puis-je résilier mon assurance auto à tout moment ?",
              answer: "Oui, depuis la loi Hamon de 2015, vous pouvez résilier votre contrat à tout moment après un an d'engagement, sans frais ni pénalités. Votre nouvel assureur se charge des démarches."
            },
            {
              question: "Qu'est-ce que le bonus-malus ?",
              answer: "C'est un coefficient qui fait varier votre prime d'assurance selon votre historique de conduite. Sans accident responsable, vous gagnez 5% de bonus par an. En cas d'accident responsable, vous subissez un malus de 25%."
            },
            {
              question: "Mon assurance couvre-t-elle la conduite à l'étranger ?",
              answer: "Oui, votre assurance auto française vous couvre dans tous les pays de l'Union Européenne et certains autres pays. Pour voyager hors UE, vérifiez votre contrat et demandez une carte verte si nécessaire."
            },
          ]}
        />

        {/* Comparison Tool */}
        <InsuranceComparisonTool />

        {/* Savings Calculator */}
        <SavingsCalculator />

        {/* Quote Request Form */}
        <QuoteRequestForm />

        {/* Testimonials */}
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
};

export default AssuranceAuto;
