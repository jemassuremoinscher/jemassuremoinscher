import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Building2, Home, Euro, Users, TrendingUp, Star, CheckCircle } from 'lucide-react';
import InsuranceFAQ from '@/components/insurance/InsuranceFAQ';

const formSchema = z.object({
  propertyCount: z.enum(['1', '2-5', '5+'], {
    required_error: 'Veuillez sélectionner le nombre de biens',
  }),
  propertyType: z.enum(['apartment', 'house', 'mixed'], {
    required_error: 'Veuillez sélectionner un type',
  }),
  totalRent: z.string().min(1, 'Montant requis'),
  managementType: z.enum(['full', 'partial', 'declaration'], {
    required_error: 'Veuillez sélectionner un type de gestion',
  }),
  postalCode: z.string().min(5, 'Code postal invalide').max(5, 'Code postal invalide'),
});

const GestionLocative = () => {
  const [showResults, setShowResults] = useState(false);
  const [estimatedPrice, setEstimatedPrice] = useState(0);
  const [submittedFormData, setSubmittedFormData] = useState<any>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      propertyCount: undefined,
      propertyType: undefined,
      totalRent: '',
      managementType: undefined,
      postalCode: '',
    },
  });

  const calculatePrice = (values: z.infer<typeof formSchema>) => {
    const rent = parseInt(values.totalRent);
    let percentage = 0.08; // 8% base
    
    // Management type
    if (values.managementType === 'full') percentage = 0.10;
    if (values.managementType === 'partial') percentage = 0.07;
    if (values.managementType === 'declaration') percentage = 0.05;
    
    // Property count discount
    if (values.propertyCount === '2-5') percentage -= 0.01;
    if (values.propertyCount === '5+') percentage -= 0.02;

    return Math.round(rent * percentage);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const price = calculatePrice(values);
      setEstimatedPrice(price);
      setSubmittedFormData(values);
      
      const { error } = await supabase.from('insurance_quotes').insert({
        insurance_type: 'gestion_locative',
        full_name: 'Prospect Gestion',
        email: 'prospect@example.com',
        phone: '0000000000',
        quote_data: values,
        status: 'pending',
      });

      if (error) throw error;

      setShowResults(true);
      toast.success('Devis de gestion locative généré !');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Erreur lors de la génération du devis');
    }
  };

  const benefits = [
    'Gain de temps considérable',
    'Expertise juridique et fiscale',
    'Recherche et sélection des locataires',
    'Gestion des impayés et contentieux',
    'Suivi des travaux et entretien',
    'Déclarations fiscales simplifiées'
  ];

  const faqs = [
    {
      question: 'Qu\'est-ce que la gestion locative ?',
      answer: 'La gestion locative consiste à confier la gestion quotidienne de votre bien immobilier à un professionnel : recherche de locataires, état des lieux, encaissement des loyers, gestion des travaux, etc.'
    },
    {
      question: 'Quels sont les types de gestion proposés ?',
      answer: 'Il existe trois types principaux : la gestion complète (tout inclus), la gestion partielle (seulement certaines tâches) et la gestion déclarative (simple suivi administratif).'
    },
    {
      question: 'Combien coûte la gestion locative ?',
      answer: 'Les honoraires varient généralement entre 5% et 10% des loyers perçus, selon le niveau de service choisi et le nombre de biens gérés.'
    },
    {
      question: 'Pourquoi choisir Loc Online ?',
      answer: 'Loc Online est notre partenaire premium, offrant une gestion 100% digitale, des tarifs compétitifs et un service client disponible 7j/7. Leurs outils en ligne permettent un suivi en temps réel de vos biens.'
    }
  ];

  // Providers avec Loc Online toujours en premier
  const providers = [
    {
      name: 'Loc Online',
      logo: '🏆',
      rating: 4.8,
      price: estimatedPrice,
      features: ['Gestion 100% digitale', 'Suivi en temps réel', 'Support 7j/7'],
      recommended: true
    },
    {
      name: 'Foncia',
      logo: '🏢',
      rating: 4.5,
      price: Math.round(estimatedPrice * 1.15),
      features: ['Réseau national', 'Expertise reconnue', 'Services complets']
    },
    {
      name: 'Orpi Gestion',
      logo: '🏠',
      rating: 4.3,
      price: Math.round(estimatedPrice * 1.10),
      features: ['Proximité locale', 'Accompagnement personnalisé', 'Assurance loyers']
    }
  ];

  return (
    <>
      <SEO 
        title="Gestion Locative - Comparez les meilleurs services"
        description="Confiez la gestion de votre bien immobilier à des experts. Comparez les offres de gestion locative et trouvez le service adapté à vos besoins."
        keywords="gestion locative, gestion immobilière, loc online, administrateur de biens"
      />
      
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main id="main-content" className="flex-grow">
          {/* Hero Section */}
          <section className="relative bg-gradient-to-br from-primary/5 via-white to-secondary/5 py-16">
            <div className="container mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-4xl mx-auto text-center mb-12"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
                  <Building2 className="h-8 w-8 text-primary" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  Gestion Locative en Ligne
                </h1>
                <p className="text-xl text-gray-600 mb-8">
                  Confiez vos biens à des professionnels et profitez de revenus sereins
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card className="max-w-2xl mx-auto shadow-xl">
                  <CardHeader>
                    <CardTitle>Obtenez vos devis de gestion</CardTitle>
                    <CardDescription>
                      Comparez les meilleures offres pour votre patrimoine
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                          control={form.control}
                          name="propertyCount"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nombre de biens à gérer</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Sélectionnez" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="1">1 bien</SelectItem>
                                  <SelectItem value="2-5">2 à 5 biens</SelectItem>
                                  <SelectItem value="5+">Plus de 5 biens</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="propertyType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Type de bien(s)</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Sélectionnez le type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="apartment">Appartement(s)</SelectItem>
                                  <SelectItem value="house">Maison(s)</SelectItem>
                                  <SelectItem value="mixed">Mixte</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="totalRent"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Loyers mensuels totaux (€)</FormLabel>
                              <FormControl>
                                <Input type="number" placeholder="2500" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="managementType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Type de gestion</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Sélectionnez" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="full">Gestion complète</SelectItem>
                                  <SelectItem value="partial">Gestion partielle</SelectItem>
                                  <SelectItem value="declaration">Gestion déclarative</SelectItem>
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
                              <FormLabel>Code postal du bien</FormLabel>
                              <FormControl>
                                <Input placeholder="75001" maxLength={5} {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Button type="submit" className="w-full" size="lg">
                          <Euro className="mr-2 h-5 w-5" />
                          Comparer les gestionnaires
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Results */}
              {showResults && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="max-w-4xl mx-auto mt-12"
                >
                  <h2 className="text-3xl font-bold text-center mb-8">
                    Nos partenaires de gestion locative
                  </h2>
                  <div className="grid gap-6">
                    {providers.map((provider, index) => (
                      <Card key={index} className={provider.recommended ? 'border-2 border-primary shadow-xl' : ''}>
                        {provider.recommended && (
                          <div className="bg-primary text-white text-center py-2 rounded-t-lg font-semibold flex items-center justify-center gap-2">
                            <Star className="h-4 w-4" />
                            Partenaire Recommandé
                          </div>
                        )}
                        <CardContent className="p-6">
                          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                              <div className="text-4xl">{provider.logo}</div>
                              <div>
                                <h3 className="text-xl font-bold">{provider.name}</h3>
                                <div className="flex items-center gap-2 mt-1">
                                  <div className="flex">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`h-4 w-4 ${
                                          i < Math.floor(provider.rating)
                                            ? 'fill-yellow-400 text-yellow-400'
                                            : 'text-gray-300'
                                        }`}
                                      />
                                    ))}
                                  </div>
                                  <span className="text-sm text-muted-foreground">
                                    {provider.rating}/5
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-3xl font-bold text-primary">
                                {provider.price}€
                                <span className="text-sm text-muted-foreground">/mois</span>
                              </div>
                              <Button 
                                variant={provider.recommended ? "subscribe-best" : "subscribe"}
                                className="mt-2"
                              >
                                Choisir cette offre
                              </Button>
                            </div>
                          </div>
                          <div className="mt-4 flex flex-wrap gap-2">
                            {provider.features.map((feature, i) => (
                              <Badge key={i} variant="outline">
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </section>

          {/* Benefits Section */}
          <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-12">Avantages de la gestion locative</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3 bg-white p-4 rounded-lg shadow-sm">
                    <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <InsuranceFAQ faqs={faqs} />
        </main>

        <Footer />
      </div>
    </>
  );
};

export default GestionLocative;
