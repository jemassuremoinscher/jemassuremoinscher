import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import InsuranceComparison from "@/components/InsuranceComparison";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { TrendingUp, Shield, Users, Heart } from "lucide-react";
import { getLifeInsuranceInsurers } from "@/utils/insurerData";

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

  const onSubmit = (data: FormValues) => {
    const capital = parseInt(data.capital);
    const age = parseInt(data.age);
    const duration = parseInt(data.duration);
    const isSmoker = data.smoker === "oui";

    const lifeInsurers = getLifeInsuranceInsurers();
    
    const calculatedInsurers = lifeInsurers.map((config) => {
      const monthlyPrice = calculatePrice(
        config.basePrice!,
        config.variationFactor!,
        capital,
        age,
        duration,
        data.type,
        data.health,
        isSmoker
      );

      return {
        name: config.name,
        logo: config.logo!,
        price: monthlyPrice,
        coverage: [
          `Capital garanti: ${capital.toLocaleString('fr-FR')}€`,
          `Durée: ${duration} ans`,
          config.coverageDetails![0],
          config.coverageDetails![1],
        ],
        discount: config.discount,
      };
    });

    // Trier par prix
    calculatedInsurers.sort((a, b) => a.price - b.price);
    
    setInsurers(calculatedInsurers);
    setShowComparison(true);
  };

  const handleNewQuote = () => {
    setShowComparison(false);
    form.reset();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="Assurance Vie - Comparateur et Devis Gratuit"
        description="Comparez les meilleures offres d'assurance vie : épargne, temporaire décès, assurance mixte. Obtenez votre devis personnalisé en 2 minutes."
      />
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/10 via-blue-50 to-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Assurance Vie
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Protégez votre avenir et celui de vos proches avec une assurance vie adaptée à vos besoins
              </p>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Épargne fiscale</h3>
                <p className="text-sm text-gray-600">Avantages fiscaux attractifs</p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Protection</h3>
                <p className="text-sm text-gray-600">Capital garanti pour vos proches</p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Transmission</h3>
                <p className="text-sm text-gray-600">Préparez votre succession</p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Flexibilité</h3>
                <p className="text-sm text-gray-600">Adaptable à votre situation</p>
              </div>
            </div>
          </div>
        </section>

        {/* Form or Comparison Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            {!showComparison ? (
              <Card className="max-w-3xl mx-auto">
                <CardHeader>
                  <CardTitle className="text-2xl">Obtenez votre devis gratuit</CardTitle>
                  <CardDescription>
                    Remplissez ce formulaire pour comparer les meilleures offres d'assurance vie
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="capital"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Capital souhaité (€)</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="100000"
                                  {...field}
                                />
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
                                <Input
                                  type="number"
                                  placeholder="35"
                                  {...field}
                                />
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
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Sélectionnez" />
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
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Sélectionnez" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="epargne">Assurance vie épargne</SelectItem>
                                  <SelectItem value="temporaire">Temporaire décès</SelectItem>
                                  <SelectItem value="mixte">Assurance mixte</SelectItem>
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
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Sélectionnez" />
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
                          name="postalCode"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Code postal</FormLabel>
                              <FormControl>
                                <Input
                                  type="text"
                                  placeholder="75001"
                                  maxLength={5}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="smoker"
                        render={({ field }) => (
                          <FormItem className="space-y-3">
                            <FormLabel>Êtes-vous fumeur ?</FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                value={field.value}
                                className="flex gap-4"
                              >
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="non" id="non" />
                                  <Label htmlFor="non">Non</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="oui" id="oui" />
                                  <Label htmlFor="oui">Oui</Label>
                                </div>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button type="submit" className="w-full bg-primary hover:bg-primary/90" size="lg">
                        Comparer les offres
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            ) : (
              <InsuranceComparison insurers={insurers} onNewQuote={handleNewQuote} />
            )}
          </div>
        </section>

        {/* Info Section */}
        {!showComparison && (
          <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                  Tout savoir sur l'assurance vie
                </h2>

                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      Qu'est-ce qu'une assurance vie ?
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      L'assurance vie est un contrat d'épargne et de prévoyance qui permet de se constituer un capital ou de protéger ses proches en cas de décès. C'est un placement flexible qui offre des avantages fiscaux intéressants.
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      Les différents types d'assurance vie
                    </h3>
                    <ul className="space-y-2 text-gray-600">
                      <li><strong>Assurance vie épargne :</strong> Pour se constituer un capital sur le long terme</li>
                      <li><strong>Temporaire décès :</strong> Protection de vos proches en cas de décès pendant la durée du contrat</li>
                      <li><strong>Assurance mixte :</strong> Combine épargne et garantie décès</li>
                    </ul>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      Avantages fiscaux de l'assurance vie
                    </h3>
                    <ul className="space-y-2 text-gray-600">
                      <li>• Exonération d'impôt sur les gains après 8 ans (jusqu'à 4 600€/an pour une personne seule)</li>
                      <li>• Transmission facilitée avec abattement de 152 500€ par bénéficiaire</li>
                      <li>• Fiscalité avantageuse sur les rachats</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default AssuranceVie;
