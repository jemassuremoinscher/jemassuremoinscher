import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Home, Shield, Euro, Clock, Flame, Droplets, Lock, Zap } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import InsuranceComparison from "@/components/InsuranceComparison";
import { homeInsurers, generateInsurerOffers } from "@/utils/insurerData";
import SEO from "@/components/SEO";
import InfoSection from "@/components/insurance/InfoSection";
import HowItWorks from "@/components/insurance/HowItWorks";
import InsuranceFAQ from "@/components/insurance/InsuranceFAQ";
import Testimonials from "@/components/Testimonials";
import { addServiceSchema, addFAQSchema, addBreadcrumbSchema, addAggregateRatingSchema } from "@/utils/seoUtils";

const formSchema = z.object({
  typeLogement: z.string().min(1, "Champ requis"),
  statut: z.string().min(1, "Champ requis"),
  surface: z.string().min(1, "Champ requis"),
  pieces: z.string().min(1, "Champ requis"),
  codePostal: z.string().length(5, "Code postal invalide"),
  valeur: z.string().min(1, "Champ requis"),
});

const AssuranceHabitation = () => {
  const { toast } = useToast();
  const [insurerOffers, setInsurerOffers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      typeLogement: "",
      statut: "",
      surface: "",
      pieces: "",
      codePostal: "",
      valeur: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const basePrice = 12; // Base pour appartement locataire
      const surface = parseInt(values.surface);
      const valeur = parseInt(values.valeur);
      const pieces = parseInt(values.pieces);
      let price = basePrice;
      
      // Type de logement (impact majeur)
      if (values.typeLogement === "maison") price += 12;
      
      // Statut
      if (values.statut === "proprietaire") price += 8;
      
      // Surface
      if (surface > 150) price += 10;
      else if (surface > 100) price += 6;
      else if (surface > 70) price += 3;
      
      // Nombre de pièces
      if (pieces >= 5) price += 5;
      else if (pieces >= 4) price += 3;
      
      // Valeur des biens
      if (valeur > 50000) price += 15;
      else if (valeur > 30000) price += 8;
      else if (valeur > 15000) price += 4;
      
      const randomVariation = Math.floor(Math.random() * 8) - 4;
      price += randomVariation;

      const { data, error } = await supabase.functions.invoke("send-quote-email", {
        body: {
          name: "Prospect Habitation",
          email: "prospect@habitation.fr",
          phone: "0000000000",
          type: "Assurance Habitation",
          details: {
            typeLogement: values.typeLogement,
            statut: values.statut,
            surface: values.surface,
            pieces: values.pieces,
            codePostal: values.codePostal,
            valeur: values.valeur,
          },
          estimatedPrice: price,
        },
      });

      if (error) throw error;

      const offers = generateInsurerOffers(price, homeInsurers);
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

  const breadcrumbSchema = addBreadcrumbSchema([
    { name: "Accueil", url: "https://www.assurmoinschere.fr/" },
    { name: "Assurance Habitation", url: "https://www.assurmoinschere.fr/assurance-habitation" }
  ]);

  const serviceSchema = addServiceSchema({
    name: "Comparateur Assurance Habitation",
    description: "Comparez les assurances habitation pour maison, appartement, locataire ou propriétaire. Devis gratuit et rapide. Protégez votre logement au meilleur prix.",
    provider: "Le Comparateur Assurance",
    areaServed: "France"
  });

  const ratingSchema = addAggregateRatingSchema(
    "Comparateur Assurance Habitation",
    4.7,
    1435
  );

  const faqSchema = addFAQSchema([
    {
      question: "Quelle assurance habitation choisir ?",
      answer: "Le choix dépend de votre statut (locataire ou propriétaire), type de logement (maison ou appartement) et valeur de vos biens. Comparez les garanties incendie, dégât des eaux, vol et responsabilité civile."
    },
    {
      question: "Combien coûte une assurance habitation ?",
      answer: "En moyenne, une assurance habitation coûte entre 120€ et 350€ par an selon la surface, localisation et niveau de garanties. Les locataires paient généralement moins cher que les propriétaires."
    },
    {
      question: "L'assurance habitation est-elle obligatoire ?",
      answer: "Oui pour les locataires (minimum responsabilité civile). Pour les propriétaires, elle est fortement recommandée mais pas obligatoire, sauf dans les copropriétés."
    }
  ]);

  return (
    <div className="min-h-screen">
      <SEO 
        title="Assurance Habitation - Comparez et Trouvez la Meilleure Offre"
        description="Comparez les assurances habitation en France. Devis gratuit pour maison, appartement, locataire ou propriétaire. Économisez jusqu'à 300€/an sur votre assurance habitation."
        keywords="assurance habitation, assurance maison, assurance appartement, assurance locataire, assurance propriétaire"
        canonical="https://www.assurmoinschere.fr/assurance-habitation"
        jsonLd={[breadcrumbSchema, serviceSchema, ratingSchema, faqSchema]}
      />
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 to-primary/10 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 rounded-full bg-primary/10">
                <Home className="h-12 w-12 text-primary" />
              </div>
            </div>
            <h1 className="text-5xl font-bold text-foreground mb-6">Assurance Habitation</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Protégez votre logement avec la meilleure assurance habitation. 
              Comparez les offres pour propriétaires et locataires et économisez jusqu'à 300€ par an.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <span>Protection complète</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                <span>Devis en 2 minutes</span>
              </div>
              <div className="flex items-center gap-2">
                <Euro className="h-5 w-5 text-primary" />
                <span>Tarifs compétitifs</span>
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
                    name="typeLogement"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type de logement</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="maison">Maison</SelectItem>
                            <SelectItem value="appartement">Appartement</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="statut"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vous êtes</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="proprietaire">Propriétaire</SelectItem>
                            <SelectItem value="locataire">Locataire</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="surface"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Surface (m²)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="75" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="pieces"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre de pièces</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="1">1 pièce</SelectItem>
                            <SelectItem value="2">2 pièces</SelectItem>
                            <SelectItem value="3">3 pièces</SelectItem>
                            <SelectItem value="4">4 pièces</SelectItem>
                            <SelectItem value="5">5 pièces et +</SelectItem>
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
                    name="valeur"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Valeur des biens à assurer (€)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="15000" {...field} />
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
          title="Les garanties essentielles de l'assurance habitation"
          description="Protégez votre logement et vos biens avec des garanties adaptées"
          items={[
            {
              icon: Flame,
              title: "Incendie et Explosion",
              description: "Prise en charge des dommages causés par un incendie, une explosion ou la foudre sur votre logement et vos biens.",
            },
            {
              icon: Droplets,
              title: "Dégâts des Eaux",
              description: "Couverture des dommages causés par fuites, infiltrations, ruptures de canalisations et gel des conduites.",
            },
            {
              icon: Lock,
              title: "Vol et Cambriolage",
              description: "Indemnisation en cas de vol par effraction, tentative de vol et vandalisme dans votre logement.",
            },
            {
              icon: Shield,
              title: "Responsabilité Civile",
              description: "Protection contre les dommages que vous pourriez causer à des tiers dans votre vie privée.",
            },
            {
              icon: Zap,
              title: "Catastrophes Naturelles",
              description: "Couverture obligatoire des dommages causés par inondations, sécheresse, tremblements de terre, tempêtes.",
            },
            {
              icon: Home,
              title: "Bris de Glace",
              description: "Remplacement des vitres, baies vitrées, portes vitrées, miroirs et plaques de cuisson en verre.",
            },
          ]}
        />

        {/* Comment ça marche */}
        <HowItWorks
          steps={[
            {
              number: "1",
              title: "Décrivez votre logement",
              description: "Type de bien, surface, statut (locataire/propriétaire) et valeur de vos biens.",
            },
            {
              number: "2",
              title: "Comparez les offres",
              description: "Recevez plusieurs devis adaptés à votre profil avec garanties détaillées.",
            },
            {
              number: "3",
              title: "Souscrivez en ligne",
              description: "Choisissez votre assurance et activez votre couverture immédiatement.",
            },
          ]}
        />

        {/* Conseils */}
        <section className="py-12 max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
            Nos conseils pour bien choisir
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-3">Évaluez vos besoins</h3>
              <p className="text-muted-foreground">
                Faites l'inventaire de vos biens pour déterminer le capital mobilier à assurer. 
                N'oubliez pas les objets de valeur, équipements électroniques et mobilier.
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-3">Locataire ou propriétaire ?</h3>
              <p className="text-muted-foreground">
                L'assurance habitation est obligatoire pour les locataires. Pour les propriétaires, 
                bien que non obligatoire, elle reste indispensable pour protéger votre patrimoine.
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-3">Les garanties optionnelles</h3>
              <p className="text-muted-foreground">
                Protection juridique, assistance à domicile, remplacement à neuf : ces options 
                peuvent être précieuses selon votre situation. Comparez-les attentivement.
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-3">Franchise et plafonds</h3>
              <p className="text-muted-foreground">
                Vérifiez les franchises applicables et les plafonds d'indemnisation pour chaque garantie. 
                Un tarif bas peut cacher des franchises élevées.
              </p>
            </Card>
          </div>
        </section>

        {/* FAQ */}
        <InsuranceFAQ
          title="Questions fréquentes sur l'assurance habitation"
          faqs={[
            {
              question: "L'assurance habitation est-elle obligatoire ?",
              answer: "Elle est obligatoire pour les locataires et fortement recommandée pour les propriétaires. En copropriété, elle est obligatoire même pour les propriétaires occupants."
            },
            {
              question: "Que couvre la responsabilité civile habitation ?",
              answer: "La RC habitation vous protège contre les dommages causés à des tiers (voisins, visiteurs) dans le cadre de votre vie privée. Elle est incluse dans toutes les assurances habitation."
            },
            {
              question: "Comment estimer la valeur de mes biens ?",
              answer: "Faites un inventaire détaillé de vos biens : mobilier, électroménager, vêtements, objets de valeur. Conservez les factures et photos. La plupart des assureurs proposent des grilles d'évaluation."
            },
            {
              question: "Qu'est-ce qu'une franchise en assurance habitation ?",
              answer: "La franchise est le montant qui reste à votre charge en cas de sinistre. Elle varie selon les garanties (souvent 150-300€ pour le vol, inexistante pour l'incendie)."
            },
            {
              question: "Mon assurance couvre-t-elle mes biens en voyage ?",
              answer: "Certains contrats incluent une garantie villégiature qui couvre vos biens lors de vos déplacements temporaires. Vérifiez les conditions et plafonds de votre contrat."
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

export default AssuranceHabitation;
