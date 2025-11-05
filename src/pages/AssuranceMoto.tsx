import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bike, Shield, Euro, Clock, Wrench, MapPin, Users } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import InsuranceComparison from "@/components/InsuranceComparison";
import { motoInsurers, generateInsurerOffers } from "@/utils/insurerData";
import SEO from "@/components/SEO";
import InfoSection from "@/components/insurance/InfoSection";
import HowItWorks from "@/components/insurance/HowItWorks";
import InsuranceFAQ from "@/components/insurance/InsuranceFAQ";
import Testimonials from "@/components/Testimonials";

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
  const { toast } = useToast();
  const [insurerOffers, setInsurerOffers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      marque: "",
      modele: "",
      annee: "",
      typeMoto: "",
      cylindree: "",
      codePostal: "",
      age: "",
      permis: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const basePrice = 50; // Base formule intermédiaire
      const ageDriver = parseInt(values.age);
      const yearVehicle = parseInt(values.annee);
      const cylindreeValue = parseInt(values.cylindree);
      let price = basePrice;
      
      // Facteurs d'ajustement réalistes
      if (ageDriver < 25) price += 70; // Jeunes motards très pénalisés
      else if (ageDriver < 30) price += 35;
      
      if (yearVehicle < 2015) price += 20;
      else if (yearVehicle > 2020) price += 25; // Motos récentes
      
      // Impact majeur de la cylindrée
      if (cylindreeValue > 800) price += 60;
      else if (cylindreeValue > 600) price += 35;
      else if (cylindreeValue > 500) price += 20;
      else if (cylindreeValue <= 125) price -= 15; // Petit cube moins cher
      
      // Type de moto
      if (values.typeMoto === "sportive") price += 80; // Sportives très chères
      else if (values.typeMoto === "trail") price += 10;
      else if (values.typeMoto === "scooter") price -= 10;
      
      const randomVariation = Math.floor(Math.random() * 25) - 12;
      price += randomVariation;

      const { data, error } = await supabase.functions.invoke("send-quote-email", {
        body: {
          name: "Prospect Moto",
          email: "prospect@moto.fr",
          phone: "0000000000",
          type: "Assurance Moto",
          details: {
            marque: values.marque,
            modele: values.modele,
            annee: values.annee,
            typeMoto: values.typeMoto,
            cylindree: values.cylindree,
            codePostal: values.codePostal,
            age: values.age,
            permis: values.permis,
          },
          estimatedPrice: price,
        },
      });

      if (error) throw error;

      const offers = generateInsurerOffers(price, motoInsurers);
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
        title="Assurance Moto - Comparez les Meilleurs Tarifs | Le Comparateur Assurance"
        description="Comparez les assurances moto et scooter. Devis gratuit en ligne pour tous types de deux-roues. Économisez jusqu'à 35% avec nos partenaires assureurs."
        keywords="assurance moto, assurance scooter, assurance deux roues, comparateur assurance moto, assurance moto pas cher"
        canonical="https://votre-domaine.fr/assurance-moto"
      />
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 to-primary/10 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 rounded-full bg-primary/10">
                <Bike className="h-12 w-12 text-primary" />
              </div>
            </div>
            <h1 className="text-5xl font-bold text-foreground mb-6">Assurance Moto</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Comparez les meilleures offres d'assurance moto et scooter. 
              Protection optimale pour tous les types de deux-roues au meilleur prix.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <span>Comparaison gratuite</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                <span>Devis instantané</span>
              </div>
              <div className="flex items-center gap-2">
                <Euro className="h-5 w-5 text-primary" />
                <span>Jusqu'à 35% d'économies</span>
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
                    name="marque"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Marque de la moto</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Yamaha, Honda..." {...field} />
                        </FormControl>
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
                          <Input placeholder="Ex: MT-07, CBR..." {...field} />
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
                            <SelectContent>
                              <SelectItem value="2024">2024</SelectItem>
                              <SelectItem value="2023">2023</SelectItem>
                              <SelectItem value="2022">2022</SelectItem>
                              <SelectItem value="2021">2021</SelectItem>
                              <SelectItem value="2020">2020</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="typeMoto"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Type de moto</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionner" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="roadster">Roadster</SelectItem>
                              <SelectItem value="sportive">Sportive</SelectItem>
                              <SelectItem value="custom">Custom</SelectItem>
                              <SelectItem value="trail">Trail</SelectItem>
                              <SelectItem value="scooter">Scooter</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="cylindree"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cylindrée (cm³)</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="125">125 cm³</SelectItem>
                            <SelectItem value="300">300 cm³</SelectItem>
                            <SelectItem value="500">500 cm³</SelectItem>
                            <SelectItem value="600">600 cm³</SelectItem>
                            <SelectItem value="800">800 cm³</SelectItem>
                            <SelectItem value="1000">1000 cm³ et +</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

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
          title="Les garanties pour votre assurance moto"
          description="Protégez votre deux-roues avec les garanties adaptées à votre usage"
          items={[
            {
              icon: Shield,
              title: "Responsabilité Civile",
              description: "Garantie obligatoire couvrant les dommages causés aux tiers. Indispensable pour circuler légalement.",
            },
            {
              icon: Bike,
              title: "Dommages Tous Accidents",
              description: "Protection complète de votre moto en cas d'accident, même si vous êtes responsable. Idéal pour motos récentes.",
            },
            {
              icon: Wrench,
              title: "Vol et Incendie",
              description: "Remboursement en cas de vol ou destruction par incendie de votre deux-roues. Équipements et accessoires inclus.",
            },
            {
              icon: Users,
              title: "Garantie Conducteur",
              description: "Indemnisation de vos blessures corporelles quel que soit le responsable de l'accident. Jusqu'à 1 000 000€.",
            },
            {
              icon: MapPin,
              title: "Assistance 0 km",
              description: "Dépannage et remorquage dès le premier kilomètre, 24h/24. Prêt de véhicule et rapatriement inclus.",
            },
            {
              icon: Euro,
              title: "Valeur d'Achat",
              description: "Remboursement à la valeur d'achat pendant 24 mois pour votre moto neuve ou d'occasion récente.",
            },
          ]}
        />

        {/* Comment ça marche */}
        <HowItWorks
          steps={[
            {
              number: "1",
              title: "Décrivez votre moto",
              description: "Marque, modèle, cylindrée et année de votre deux-roues pour un devis précis.",
            },
            {
              number: "2",
              title: "Recevez vos devis",
              description: "Comparez instantanément les offres de nos assureurs partenaires spécialisés moto.",
            },
            {
              number: "3",
              title: "Souscrivez en ligne",
              description: "Choisissez votre formule et finalisez votre contrat en quelques minutes.",
            },
          ]}
        />

        {/* Conseils */}
        <section className="py-12 max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
            Nos conseils pour bien assurer votre moto
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-3">Choisir la bonne formule</h3>
              <p className="text-muted-foreground mb-3">
                Pour une moto neuve ou de moins de 5 ans, privilégiez une formule tous risques. 
                Pour un deux-roues plus ancien, une formule intermédiaire avec vol/incendie peut suffire.
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-3">La garantie conducteur</h3>
              <p className="text-muted-foreground mb-3">
                Souvent optionnelle mais essentielle : elle vous indemnise en cas de blessures graves. 
                Vérifiez les plafonds d'indemnisation et les exclusions.
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-3">Équipements et accessoires</h3>
              <p className="text-muted-foreground mb-3">
                Déclarez vos équipements (top case, GPS, antivol) pour qu'ils soient couverts. 
                Gardez les factures et photos comme preuves en cas de sinistre.
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-3">Réduire le coût</h3>
              <p className="text-muted-foreground mb-3">
                Garage fermé, faible kilométrage annuel, formation moto : plusieurs critères 
                peuvent réduire votre prime. Pensez aussi à regrouper vos contrats chez un même assureur.
              </p>
            </Card>
          </div>
        </section>

        {/* FAQ */}
        <InsuranceFAQ
          title="Questions fréquentes sur l'assurance moto"
          faqs={[
            {
              question: "Quelle assurance est obligatoire pour une moto ?",
              answer: "L'assurance au tiers (responsabilité civile) est la seule garantie obligatoire pour circuler en moto. Elle couvre les dommages que vous pourriez causer à autrui. Circuler sans assurance est passible d'une amende de 3 750€, d'une suspension de permis et de la confiscation du véhicule.",
            },
            {
              question: "Comment assurer une moto puissante ou sportive ?",
              answer: "Les motos sportives ou de grosse cylindrée (>600cc) sont considérées comme à risque et coûtent donc plus cher à assurer. Pour obtenir un bon tarif, privilégiez un garage fermé, une formation moto avancée et un historique sans sinistre. Comparez les offres spécialisées.",
            },
            {
              question: "Faut-il assurer une moto qui ne roule pas ?",
              answer: "Oui, même immobilisée, une moto immatriculée doit être assurée au minimum au tiers. Pour une moto qui ne circule plus, souscrivez une assurance hors circulation moins coûteuse qui couvre le vol et l'incendie si elle reste sur la voie publique.",
            },
            {
              question: "Puis-je assurer une moto sans le permis A ?",
              answer: "Non, pour assurer une moto de plus de 125cc, vous devez obligatoirement posséder le permis A, A2 ou A1 correspondant à la puissance du véhicule. Pour un scooter 125cc, le permis B + formation de 7h suffit.",
            },
            {
              question: "Comment est calculé le prix d'une assurance moto ?",
              answer: "Le tarif dépend de nombreux critères : type et puissance de la moto, votre âge et expérience, lieu de stationnement, kilométrage annuel, historique de sinistres (bonus-malus), et garanties choisies. Les motos sportives et les jeunes conducteurs paient généralement plus cher.",
            },
            {
              question: "Que couvre l'assistance 0 km ?",
              answer: "L'assistance 0 km intervient dès le 1er kilomètre de votre domicile en cas de panne, accident ou crevaison. Elle inclut le dépannage sur place, le remorquage vers un garage, le prêt d'un véhicule de remplacement et l'hébergement si nécessaire.",
            },
          ]}
        />

        {/* Testimonials */}
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
};

export default AssuranceMoto;