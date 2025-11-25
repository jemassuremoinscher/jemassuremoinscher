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
import InsuranceComparison from '@/components/InsuranceComparison';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Building2, Home, Euro, Users, TrendingUp, Star, CheckCircle } from 'lucide-react';
import InsuranceFAQ from '@/components/insurance/InsuranceFAQ';
import { addServiceSchema, addFAQSchema, addBreadcrumbSchema } from '@/utils/seoUtils';

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

    const basePrice = Math.round(rent * percentage);
    
    // Generate insurers list for management services
    const insurers = [
      {
        name: 'Loc Online',
        price: basePrice,
        coverage: ['Gestion 100% digitale', 'Suivi en temps réel', 'Support 7j/7', 'Encaissement automatique'],
        discount: 'Partenaire recommandé'
      },
      {
        name: 'Foncia',
        price: Math.round(basePrice * 1.15),
        coverage: ['Réseau national', 'Expertise reconnue', 'Services complets', 'Agence de proximité']
      },
      {
        name: 'Orpi Gestion',
        price: Math.round(basePrice * 1.10),
        coverage: ['Proximité locale', 'Accompagnement personnalisé', 'Assurance loyers', 'Suivi travaux']
      },
      {
        name: 'Century 21 Gestion',
        price: Math.round(basePrice * 1.22),
        coverage: ['Réseau international', 'Gestion premium', 'Assistance juridique', 'Plateforme propriétaire']
      },
      {
        name: 'Nexity',
        price: Math.round(basePrice * 1.18),
        coverage: ['Leader national', 'Services intégrés', 'Gestion patrimoine', 'Solutions digitales']
      },
      {
        name: 'Laforêt Gestion',
        price: Math.round(basePrice * 1.25),
        coverage: ['Expertise locale', 'Accompagnement sur-mesure', 'Garantie loyers', 'Suivi personnalisé']
      },
      {
        name: 'Guy Hoquet',
        price: Math.round(basePrice * 1.30),
        coverage: ['Réseau reconnu', 'Gestion complète', 'Protection juridique', 'Conseiller dédié']
      },
      {
        name: 'Citya Immobilier',
        price: Math.round(basePrice * 1.12),
        coverage: ['Gestion professionnelle', 'Outils digitaux', 'Suivi transparent', 'Accompagnement fiscal']
      },
      {
        name: 'Square Habitat',
        price: Math.round(basePrice * 1.28),
        coverage: ['Groupe Crédit Agricole', 'Services bancaires', 'Gestion patrimoniale', 'Expertise locale']
      },
      {
        name: 'Gestion Privée',
        price: Math.round(basePrice * 1.20),
        coverage: ['Service personnalisé', 'Gestion sur-mesure', 'Accompagnement premium', 'Reporting détaillé']
      }
    ];

    return insurers;
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const insurers = calculatePrice(values);
      setSubmittedFormData({ ...values, insurers });
      
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

  const breadcrumbSchema = addBreadcrumbSchema([
    { name: "Accueil", url: "https://www.assurmoinschere.fr/" },
    { name: "Gestion Locative", url: "https://www.assurmoinschere.fr/gestion-locative" }
  ]);

  const serviceSchema = addServiceSchema({
    name: "Comparateur Gestion Locative",
    description: "Trouvez le meilleur gestionnaire pour vos biens locatifs. Services de gestion complète, partielle ou déclarative. Honoraires compétitifs.",
    provider: "jemassurmoinscher",
    areaServed: "France"
  });

  const faqSchema = addFAQSchema([
    {
      question: "Qu'est-ce que la gestion locative ?",
      answer: "La gestion locative consiste à confier la gestion quotidienne de votre bien immobilier à un professionnel : recherche de locataires, état des lieux, encaissement des loyers, gestion des travaux, etc."
    },
    {
      question: "Quels sont les types de gestion proposés ?",
      answer: "Il existe trois types principaux : la gestion complète (tout inclus), la gestion partielle (seulement certaines tâches) et la gestion déclarative (simple suivi administratif)."
    },
    {
      question: "Combien coûte la gestion locative ?",
      answer: "Les honoraires varient généralement entre 5% et 10% des loyers perçus, selon le niveau de service choisi et le nombre de biens gérés."
    }
  ]);

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

  return (
    <>
      <SEO 
        title="Gestion Locative - Comparez les Meilleurs Gestionnaires Immobiliers"
        description="Comparez les offres de gestion locative pour vos biens immobiliers. Gestion complète, partielle ou déclarative. Honoraires de 5% à 10%. Trouvez le meilleur gestionnaire."
        keywords="gestion locative, gestion immobilière, loc online, administrateur de biens, gestionnaire immobilier, honoraires gestion"
        canonical="https://www.assurmoinschere.fr/gestion-locative"
        jsonLd={[breadcrumbSchema, serviceSchema, faqSchema]}
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

        {showResults && submittedFormData?.insurers && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-background rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto p-6 relative">
              <Button
                variant="ghost"
                className="absolute top-4 right-4"
                onClick={() => setShowResults(false)}
              >
                ✕
              </Button>
              
              <InsuranceComparison
                insurers={submittedFormData.insurers}
                onNewQuote={() => setShowResults(false)}
                formData={submittedFormData}
                insuranceType="gestion_locative"
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default GestionLocative;
