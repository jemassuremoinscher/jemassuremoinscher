import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart, Shield, Euro, Stethoscope, Eye, Pill, Baby, Clock } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { useState } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import InsuranceComparison from "@/components/InsuranceComparison";
import { healthInsurers, generateInsurerOffers } from "@/utils/insurerData";
import SEO from "@/components/SEO";
import InfoSection from "@/components/insurance/InfoSection";
import HowItWorks from "@/components/insurance/HowItWorks";
import InsuranceFAQ from "@/components/insurance/InsuranceFAQ";
import Testimonials from "@/components/Testimonials";
import { addServiceSchema, addFAQSchema, addBreadcrumbSchema, addAggregateRatingSchema, addHowToSchema } from "@/utils/seoUtils";

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

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const basePrice = 45; // Base célibataire formule économique
      const ageValue = parseInt(values.age);
      let price = basePrice;
      
      // Situation familiale (impact très important)
      if (values.situation === "famille") price += 150; // Famille beaucoup plus cher
      else if (values.situation === "couple") price += 80;
      
      // Âge (augmente progressivement)
      if (ageValue > 60) price += 40;
      else if (ageValue > 50) price += 25;
      else if (ageValue > 40) price += 15;
      else if (ageValue < 25) price -= 5; // Jeunes légèrement moins cher
      
      // Niveau de couverture (impact majeur)
      if (values.niveau === "premium") price += 80;
      else if (values.niveau === "confort") price += 50;
      else if (values.niveau === "equilibre") price += 25;
      // économique = prix de base
      
      const randomVariation = Math.floor(Math.random() * 20) - 10;
      price += randomVariation;

      const offers = generateInsurerOffers(price, healthInsurers);
      setInsurerOffers(offers);
    } catch (error: any) {
      console.error("Error:", error);
      toast.error("Erreur", {
        description: "Une erreur est survenue. Veuillez réessayer.",
      });
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
    description: "Comparez les meilleures mutuelles santé et complémentaires santé en France. Devis gratuit et personnalisé adapté à vos besoins.",
    provider: "jemassuremoinscher",
    areaServed: "France"
  });

  const ratingSchema = addAggregateRatingSchema(
    "Comparateur Mutuelle Santé",
    4.6,
    1642
  );

  const howToSchema = addHowToSchema({
    name: "Comment obtenir un devis de mutuelle santé en ligne",
    description: "Guide pratique pour comparer et souscrire une mutuelle santé adaptée à vos besoins en quelques minutes",
    totalTime: "PT3M",
    steps: [
      {
        name: "Définissez vos besoins en santé",
        text: "Identifiez vos besoins principaux : optique, dentaire, hospitalisation, médecines douces. Pensez à votre situation familiale et vos dépenses de santé habituelles pour choisir le bon niveau de couverture."
      },
      {
        name: "Renseignez votre profil",
        text: "Indiquez votre âge, situation familiale, régime de Sécurité sociale et les garanties souhaitées. Ces informations permettent de calculer une cotisation personnalisée."
      },
      {
        name: "Comparez les devis",
        text: "Analysez les offres reçues : comparez les remboursements pour l'optique, le dentaire, l'hospitalisation et les délais de carence. Vérifiez également les réseaux de soins partenaires."
      },
      {
        name: "Souscrivez votre mutuelle",
        text: "Choisissez l'offre qui correspond le mieux à vos besoins et budget. La souscription se fait en ligne en quelques clics et vos garanties prennent effet rapidement."
      }
    ]
  });

  const faqSchema = addFAQSchema([
    {
      question: "Qu'est-ce qu'une mutuelle santé ?",
      answer: "Une mutuelle santé est une complémentaire santé qui rembourse tout ou partie des dépenses de santé non couvertes par la Sécurité sociale (consultations, médicaments, hospitalisation, optique, dentaire)."
    },
    {
      question: "Comment choisir sa mutuelle santé ?",
      answer: "Choisissez selon vos besoins : niveau de remboursement optique/dentaire, délais de carence, réseau de professionnels partenaires, et votre budget mensuel."
    },
    {
      question: "Combien coûte une mutuelle santé ?",
      answer: "Le prix varie selon votre âge, situation familiale et niveau de garanties. Comptez entre 45€ et 200€/mois en moyenne."
    }
  ]);

  return (
    <div className="min-h-screen">
      <SEO 
        title="Mutuelle Santé - Comparez les Meilleures Offres | jemassuremoinscher"
        description="Comparez les mutuelles santé et complémentaires santé en France. Devis gratuit et personnalisé en 2 minutes. Trouvez la meilleure mutuelle adaptée à vos besoins."
        keywords="mutuelle santé, complémentaire santé, assurance santé, comparateur mutuelle, mutuelle pas cher"
        canonical="https://www.jemassuremoinscher.fr/assurance-sante"
        jsonLd={[breadcrumbSchema, serviceSchema, ratingSchema, howToSchema, faqSchema]}
      />
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 to-primary/10 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 rounded-full bg-primary/10">
                <Heart className="h-12 w-12 text-primary" />
              </div>
            </div>
            <h1 className="text-5xl font-bold text-foreground mb-6">Mutuelle Santé</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Trouvez la meilleure mutuelle santé adaptée à vos besoins et à votre budget. 
              Comparez gratuitement les offres de nos partenaires et économisez jusqu'à 300€ par an.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <span>Comparaison 100% gratuite</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                <span>Devis instantané</span>
              </div>
              <div className="flex items-center gap-2">
                <Euro className="h-5 w-5 text-primary" />
                <span>Meilleurs prix garantis</span>
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
                    name="situation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Situation familiale</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="celibataire">Célibataire</SelectItem>
                            <SelectItem value="couple">En couple</SelectItem>
                            <SelectItem value="famille">Famille</SelectItem>
                          </SelectContent>
                        </Select>
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
                          <Input type="number" placeholder="30" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="regime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Régime de sécurité sociale</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="general">Régime général</SelectItem>
                            <SelectItem value="alsace-moselle">Alsace-Moselle</SelectItem>
                            <SelectItem value="tns">TNS</SelectItem>
                            <SelectItem value="agricole">Agricole</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="niveau"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Niveau de couverture souhaité</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="economique">Économique</SelectItem>
                            <SelectItem value="equilibre">Équilibré</SelectItem>
                            <SelectItem value="confort">Confort</SelectItem>
                            <SelectItem value="premium">Premium</SelectItem>
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
          title="Les garanties essentielles d'une mutuelle santé"
          description="Découvrez les postes de remboursement importants pour votre protection santé"
          items={[
            {
              icon: Stethoscope,
              title: "Soins Courants",
              description: "Consultations chez le médecin généraliste et spécialistes, analyses médicales, radiologie. Remboursement jusqu'à 300% de la base Sécu.",
            },
            {
              icon: Eye,
              title: "Optique",
              description: "Lunettes, lentilles de contact et montures. Forfait annuel pouvant aller jusqu'à 500€ selon la formule choisie.",
            },
            {
              icon: Pill,
              title: "Pharmacie & Médicaments",
              description: "Remboursement des médicaments prescrits selon le taux de remboursement de la Sécurité sociale, jusqu'à 100%.",
            },
            {
              icon: Heart,
              title: "Hospitalisation",
              description: "Prise en charge des frais d'hospitalisation, chambre particulière, forfait journalier et dépassements d'honoraires.",
            },
            {
              icon: Baby,
              title: "Maternité",
              description: "Suivi de grossesse, accouchement et soins du nouveau-né. Forfait naissance pouvant atteindre 1000€.",
            },
            {
              icon: Shield,
              title: "Dentaire",
              description: "Soins dentaires, prothèses, orthodontie et implants. Remboursement jusqu'à 400% de la base Sécu selon les actes.",
            },
          ]}
        />

        {/* Comment ça marche */}
        <HowItWorks
          steps={[
            {
              number: "1",
              title: "Décrivez vos besoins",
              description: "Indiquez votre situation familiale, votre âge et le niveau de couverture souhaité.",
            },
            {
              number: "2",
              title: "Comparez les offres",
              description: "Recevez plusieurs devis adaptés à votre profil avec les garanties détaillées de chaque formule.",
            },
            {
              number: "3",
              title: "Souscrivez facilement",
              description: "Choisissez la mutuelle qui vous convient et finalisez votre adhésion en quelques clics.",
            },
          ]}
        />

        {/* Avantages */}
        <section className="py-12 max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
            Les avantages de comparer sa mutuelle santé
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <Euro className="h-5 w-5 text-primary" />
                Économies importantes
              </h3>
              <p className="text-muted-foreground">
                Économisez jusqu'à 300€ par an en comparant les offres. Trouvez la meilleure 
                couverture au meilleur prix selon vos besoins réels.
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Couverture adaptée
              </h3>
              <p className="text-muted-foreground">
                Choisissez une mutuelle qui correspond vraiment à vos besoins : famille, senior, 
                jeune actif, TNS... Chaque profil a sa solution.
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Service rapide
              </h3>
              <p className="text-muted-foreground">
                Obtenez vos devis en moins de 2 minutes et souscrivez directement en ligne. 
                Votre carte de tiers payant arrive sous 48h.
              </p>
            </Card>
          </div>
        </section>

        {/* FAQ */}
        <InsuranceFAQ
          title="Vos questions sur la mutuelle santé"
          faqs={[
            {
              question: "Quelle est la différence entre la Sécurité sociale et une mutuelle ?",
              answer: "La Sécurité sociale est le régime obligatoire qui rembourse une partie de vos frais de santé (environ 70% pour une consultation). La mutuelle, ou complémentaire santé, complète ce remboursement pour couvrir tout ou partie du reste à charge, notamment les dépassements d'honoraires.",
            },
            {
              question: "La mutuelle santé est-elle obligatoire ?",
              answer: "La mutuelle n'est pas obligatoire pour tous, mais elle l'est pour les salariés du secteur privé (mutuelle d'entreprise). Pour les autres (indépendants, fonctionnaires, retraités), elle est fortement recommandée pour limiter vos dépenses de santé.",
            },
            {
              question: "Quand commence ma couverture après souscription ?",
              answer: "La couverture démarre généralement le 1er jour du mois suivant votre souscription. Certaines mutuelles proposent une prise d'effet immédiate. Attention aux délais de carence qui peuvent s'appliquer sur certaines garanties (optique, dentaire, hospitalisation).",
            },
            {
              question: "Comment choisir entre les différents niveaux de garanties ?",
              answer: "Analysez vos besoins réels : portez-vous des lunettes ? Consultez-vous souvent des spécialistes ? Avez-vous besoin de soins dentaires importants ? Si vous êtes jeune et en bonne santé, une formule économique peut suffire. Pour une famille ou un senior, privilégiez une formule complète.",
            },
            {
              question: "Puis-je changer de mutuelle à tout moment ?",
              answer: "Oui, depuis la loi Chatel, vous pouvez résilier votre mutuelle à tout moment après la première année de contrat, sans frais ni pénalités. Il suffit d'envoyer une lettre de résiliation par courrier recommandé. Votre nouvelle mutuelle peut aussi s'en charger.",
            },
            {
              question: "Comment fonctionne le tiers payant ?",
              answer: "Le tiers payant vous dispense de l'avance des frais médicaux. Vous présentez votre carte Vitale et votre carte de mutuelle, et vous ne payez que ce qui reste à votre charge (ou rien si vous êtes entièrement couvert). Tous les praticiens ne l'acceptent pas.",
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

export default AssuranceSante;
