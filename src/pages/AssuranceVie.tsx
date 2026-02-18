import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import InsuranceComparison from "@/components/InsuranceComparison";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, Shield, Users, Heart, Euro, Clock, PiggyBank, LineChart } from "lucide-react";
import { getLifeInsuranceInsurers } from "@/utils/insurerData";
import InfoSection from "@/components/insurance/InfoSection";
import HowItWorks from "@/components/insurance/HowItWorks";
import InsuranceFAQ from "@/components/insurance/InsuranceFAQ";
import Testimonials from "@/components/Testimonials";
import { useToast } from "@/hooks/use-toast";
import { addServiceSchema, addFAQSchema, addBreadcrumbSchema, addAggregateRatingSchema } from "@/utils/seoUtils";

const formSchema = z.object({
  capital: z.string().min(1, "Le capital souhaité est requis"),
  age: z.string().min(1, "L'âge est requis"),
  duration: z.string().min(1, "La durée est requise"),
  type: z.string().min(1, "Le type d'assurance est requis"),
  health: z.string().min(1, "L'état de santé est requis"),
  smoker: z.string().min(1, "Cette information est requise"),
  postalCode: z.string().min(5, "Code postal invalide").max(5, "Code postal invalide"),
});

type FormValues = z.infer<typeof formSchema>;

const AssuranceVie = () => {
  const { toast } = useToast();
  const [showComparison, setShowComparison] = useState(false);
  const [insurers, setInsurers] = useState<Array<{
    name: string;
    price: number;
    logo: string;
    coverage: string[];
    discount?: string;
  }>>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      capital: "",
      age: "",
      duration: "",
      type: "",
      health: "",
      smoker: "",
      postalCode: "",
    },
  });

  const calculatePrice = (
    basePrice: number,
    variationFactor: number,
    capital: number,
    age: number,
    duration: number,
    type: string,
    health: string,
    isSmoker: boolean
  ) => {
    let price = basePrice;

    // Calcul basé sur le capital (par tranche de 10 000€)
    price += (capital / 10000) * 15;

    // Ajustement selon l'âge
    if (age < 30) price *= 0.7;
    else if (age < 40) price *= 0.85;
    else if (age < 50) price *= 1.0;
    else if (age < 60) price *= 1.3;
    else price *= 1.7;

    // Ajustement selon la durée
    if (duration <= 10) price *= 0.9;
    else if (duration <= 20) price *= 1.0;
    else price *= 1.1;

    // Ajustement selon le type
    if (type === "temporaire") price *= 0.7;
    else if (type === "epargne") price *= 1.2;
    else if (type === "mixte") price *= 1.0;

    // Ajustement selon la santé
    if (health === "excellente") price *= 0.9;
    else if (health === "bonne") price *= 1.0;
    else if (health === "moyenne") price *= 1.2;
    else price *= 1.5;

    // Majoration fumeur
    if (isSmoker) price *= 1.4;

    // Variation aléatoire spécifique à l'assureur
    price *= variationFactor;

    return Math.round(price);
  };

  const onSubmit = (values: FormValues) => {
    const capital = parseInt(values.capital);
    const age = parseInt(values.age);
    const duration = parseInt(values.duration);
    const isSmoker = values.smoker === "oui";

    const lifeInsurers = getLifeInsuranceInsurers();
    
    const calculatedInsurers = lifeInsurers.map(insurer => ({
      name: insurer.name,
      logo: insurer.logo,
      coverage: insurer.coverageDetails || [],
      discount: insurer.discount,
      price: calculatePrice(
        insurer.basePrice || 50,
        insurer.variationFactor || 1.0,
        capital,
        age,
        duration,
        values.type,
        values.health,
        isSmoker
      ),
    }));

    setInsurers(calculatedInsurers);
    setShowComparison(true);
    
    toast({
      title: "Comparaison générée !",
      description: "Voici les meilleures offres pour votre profil.",
    });
  };

  const breadcrumbSchema = addBreadcrumbSchema([
    { name: "Accueil", url: "https://www.jemassuremoinscher.fr/" },
    { name: "Assurance Vie", url: "https://www.jemassuremoinscher.fr/assurance-vie" }
  ]);

  const serviceSchema = addServiceSchema({
    name: "Comparateur Assurance Vie",
    description: "Comparez les contrats d'assurance vie pour l'épargne, la protection décès et la transmission de patrimoine. Solutions adaptées à vos objectifs financiers.",
    provider: "jemassuremoinscher",
    areaServed: "France"
  });

  const ratingSchema = addAggregateRatingSchema(
    "Comparateur Assurance Vie",
    4.6,
    1124
  );

  const faqSchema = addFAQSchema([
    {
      question: "Qu'est-ce qu'une assurance vie ?",
      answer: "L'assurance vie est un contrat d'épargne qui permet de constituer un capital, protéger vos proches en cas de décès, et transmettre votre patrimoine avec une fiscalité avantageuse."
    },
    {
      question: "Quels sont les avantages fiscaux de l'assurance vie ?",
      answer: "Après 8 ans, vous bénéficiez d'un abattement annuel de 4 600€ (9 200€ pour un couple) sur les gains. La transmission est avantageuse avec un abattement de 152 500€ par bénéficiaire."
    },
    {
      question: "Quelle est la différence entre fonds euros et unités de compte ?",
      answer: "Le fonds euros garantit votre capital avec un rendement sécurisé mais modeste. Les unités de compte offrent un potentiel de rendement supérieur mais sans garantie du capital investi."
    }
  ]);

  return (
    <div className="min-h-screen">
      <SEO 
        title="Assurance Vie - Épargne et Protection | jemassuremoinscher"
        description="Comparez les meilleures assurances vie : épargne, protection décès, transmission de patrimoine. Trouvez le contrat adapté à vos objectifs financiers."
        keywords="assurance vie, épargne, placement, transmission patrimoine, contrat assurance vie, fiscalité assurance vie"
        canonical="https://www.jemassuremoinscher.fr/assurance-vie"
        jsonLd={[breadcrumbSchema, serviceSchema, ratingSchema, faqSchema]}
      />
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 to-primary/10 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 rounded-full bg-primary/10">
                <TrendingUp className="h-12 w-12 text-primary" />
              </div>
            </div>
            <h1 className="text-5xl font-bold text-foreground mb-6">Assurance Vie</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Constituez une épargne, préparez votre retraite ou protégez vos proches. 
              Comparez les meilleurs contrats d'assurance vie du marché.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <PiggyBank className="h-5 w-5 text-primary" />
                <span>Placement sécurisé</span>
              </div>
              <div className="flex items-center gap-2">
                <Euro className="h-5 w-5 text-primary" />
                <span>Avantages fiscaux</span>
              </div>
              <div className="flex items-center gap-2">
                <LineChart className="h-5 w-5 text-primary" />
                <span>Rendement attractif</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-12">
        {/* Formulaire de devis */}
        <div className="max-w-3xl mx-auto mb-16">
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-6 text-card-foreground">
              {showComparison ? "Votre comparaison" : "Obtenez votre comparatif personnalisé"}
            </h2>

            {showComparison ? (
              <div>
                <InsuranceComparison 
                  insurers={insurers} 
                  onNewQuote={() => {
                    setShowComparison(false);
                    form.reset();
                  }} 
                />
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="capital"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Capital souhaité (€)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="50000" {...field} />
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
                          <Input type="number" placeholder="35" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Durée du contrat (années)</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="5">5 ans</SelectItem>
                            <SelectItem value="10">10 ans</SelectItem>
                            <SelectItem value="15">15 ans</SelectItem>
                            <SelectItem value="20">20 ans</SelectItem>
                            <SelectItem value="25">25 ans</SelectItem>
                            <SelectItem value="30">30 ans</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type d'assurance vie</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="epargne">Assurance vie épargne</SelectItem>
                            <SelectItem value="temporaire">Temporaire décès</SelectItem>
                            <SelectItem value="mixte">Contrat mixte</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="health"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>État de santé</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="excellente">Excellente</SelectItem>
                            <SelectItem value="bonne">Bonne</SelectItem>
                            <SelectItem value="moyenne">Moyenne</SelectItem>
                            <SelectItem value="fragile">Fragile</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="smoker"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Êtes-vous fumeur ?</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="non">Non</SelectItem>
                            <SelectItem value="oui">Oui</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="postalCode"
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

                  <Button type="submit" className="w-full" size="lg">
                    Comparer les offres
                  </Button>
                </form>
              </Form>
            )}
          </Card>
        </div>

        {/* Garanties Section */}
        <InfoSection
          title="Les différents types d'assurance vie"
          description="Choisissez le contrat adapté à vos objectifs patrimoniaux"
          items={[
            {
              icon: PiggyBank,
              title: "Assurance Vie Épargne",
              description: "Constituez un capital à long terme avec une fiscalité avantageuse. Supports euros sécurisés et unités de compte dynamiques.",
            },
            {
              icon: Shield,
              title: "Temporaire Décès",
              description: "Protection pure de vos proches avec versement d'un capital en cas de décès. Idéal pour couvrir un prêt immobilier.",
            },
            {
              icon: LineChart,
              title: "Contrat Multisupport",
              description: "Diversifiez vos placements entre fonds euros garantis et unités de compte pour optimiser performance et sécurité.",
            },
            {
              icon: Heart,
              title: "Transmission de Patrimoine",
              description: "Transmettez votre capital à vos bénéficiaires avec une fiscalité réduite. Abattement de 152 500€ par bénéficiaire.",
            },
            {
              icon: Users,
              title: "Plan Épargne Retraite",
              description: "Préparez votre retraite avec des versements déductibles fiscalement et un capital disponible à la retraite.",
            },
            {
              icon: Euro,
              title: "Contrat Luxembourg",
              description: "Protection renforcée de votre épargne avec la réglementation luxembourgeoise. Sécurité du super-privilège.",
            },
          ]}
        />

        {/* Comment ça marche */}
        <HowItWorks
          steps={[
            {
              number: "1",
              title: "Définissez vos objectifs",
              description: "Épargne, retraite, transmission ou protection : identifiez vos priorités patrimoniales.",
            },
            {
              number: "2",
              title: "Comparez les contrats",
              description: "Analysez les rendements, frais de gestion, options de gestion et qualité des supports proposés.",
            },
            {
              number: "3",
              title: "Souscrivez et investissez",
              description: "Ouvrez votre contrat en ligne et commencez à construire votre patrimoine dès aujourd'hui.",
            },
          ]}
        />

        {/* Avantages Fiscaux */}
        <section className="py-12 max-w-4xl mx-auto">
          <Card className="p-8 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <h2 className="text-3xl font-bold text-foreground mb-6 text-center">Avantages fiscaux de l'assurance vie</h2>
            <div className="space-y-4">
              <div className="flex gap-3">
                <Euro className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Fiscalité avantageuse après 8 ans</h3>
                  <p className="text-muted-foreground">Abattement annuel de 4 600€ (9 200€ pour un couple) sur les gains. Au-delà, imposition à 7,5% seulement.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Heart className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Transmission optimisée</h3>
                  <p className="text-muted-foreground">152 500€ par bénéficiaire exonérés de droits de succession pour les versements avant 70 ans.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Shield className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Disponibilité du capital</h3>
                  <p className="text-muted-foreground">Votre épargne reste disponible à tout moment avec une fiscalité dégressive selon l'ancienneté du contrat.</p>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* FAQ */}
        <InsuranceFAQ
          title="Questions fréquentes sur l'assurance vie"
          faqs={[
            {
              question: "Quelle est la différence entre fonds euros et unités de compte ?",
              answer: "Le fonds euros est un support garanti en capital avec un rendement annuel définitif (environ 2-3% actuellement). Les unités de compte sont des supports non garantis investis en actions, obligations ou immobilier, offrant un potentiel de rendement plus élevé (5-8% en moyenne) mais avec un risque de perte en capital. Un bon contrat propose les deux.",
            },
            {
              question: "Puis-je retirer mon argent à tout moment ?",
              answer: "Oui, l'assurance vie est un placement disponible. Vous pouvez effectuer des rachats partiels ou totaux quand vous le souhaitez. Attention toutefois : avant 8 ans, la fiscalité sur les gains est moins avantageuse (12,8% ou barème IR selon votre choix). Après 8 ans, vous bénéficiez d'un abattement annuel de 4 600€.",
            },
            {
              question: "Combien rapporte une assurance vie ?",
              answer: "Le rendement dépend des supports choisis. Un fonds euros sécurisé rapporte actuellement 2% à 3,5% nets de frais de gestion. Les unités de compte peuvent rapporter 5% à 8% en moyenne à long terme selon l'allocation (actions, immobilier, obligations). Un contrat diversifié 50% euros / 50% UC peut viser 4% à 5% annuels.",
            },
            {
              question: "Quels sont les frais d'une assurance vie ?",
              answer: "Les frais principaux sont : frais d'entrée (0% à 5% des versements, souvent offerts en ligne), frais de gestion annuels (0,5% à 1% sur les fonds euros, 0,6% à 1,5% sur les unités de compte), frais d'arbitrage (0% à 1% quand vous changez de supports). Comparez ces frais, ils impactent fortement votre rendement sur le long terme.",
            },
            {
              question: "Comment désigner les bénéficiaires de mon assurance vie ?",
              answer: "Vous pouvez désigner librement vos bénéficiaires lors de la souscription ou les modifier à tout moment : conjoint, enfants, concubin, association... La clause peut être nominative (noms précis) ou à ordre (« mon conjoint, à défaut mes enfants »). Cette désignation peut être faite dans le contrat ou dans votre testament. Elle est révocable sauf acceptation du bénéficiaire.",
            },
            {
              question: "L'assurance vie est-elle vraiment sans risque ?",
              answer: "Le fonds euros est garanti en capital par l'assureur et très sécurisé. Les unités de compte ne sont pas garanties : leur valeur peut fluctuer à la hausse ou à la baisse selon les marchés financiers. Pour limiter le risque, diversifiez vos supports et adaptez votre allocation à votre profil (prudent, équilibré, dynamique) et à votre horizon de placement.",
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

export default AssuranceVie;
