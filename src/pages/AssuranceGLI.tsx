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
import { Shield, Home, Euro, Users, TrendingUp, CheckCircle, Star } from 'lucide-react';
import InsuranceFAQ from '@/components/insurance/InsuranceFAQ';

const formSchema = z.object({
  propertyType: z.enum(['apartment', 'house', 'commercial'], {
    required_error: 'Veuillez sélectionner un type de bien',
  }),
  monthlyRent: z.string().min(1, 'Montant requis'),
  tenantType: z.enum(['individual', 'company', 'student'], {
    required_error: 'Veuillez sélectionner un type de locataire',
  }),
  postalCode: z.string().min(5, 'Code postal invalide').max(5, 'Code postal invalide'),
});

const AssuranceGLI = () => {
  const [showComparison, setShowComparison] = useState(false);
  const [estimatedPrice, setEstimatedPrice] = useState(0);
  const [submittedFormData, setSubmittedFormData] = useState<any>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      propertyType: undefined,
      monthlyRent: '',
      tenantType: undefined,
      postalCode: '',
    },
  });

  const calculatePrice = (values: z.infer<typeof formSchema>) => {
    let basePercentage = 2.5; // 2.5% base
    const rent = parseInt(values.monthlyRent);
    
    // Based on property type
    if (values.propertyType === 'house') basePercentage += 0.3;
    if (values.propertyType === 'commercial') basePercentage += 0.5;
    
    // Based on rent amount
    if (rent > 1500) basePercentage += 0.2;
    if (rent > 2000) basePercentage += 0.3;
    
    // Based on tenant type
    if (values.tenantType === 'student') basePercentage += 0.4;
    if (values.tenantType === 'company') basePercentage -= 0.3;

    return parseFloat(basePercentage.toFixed(2));
  };

  const generateOffers = (basePercentage: number, monthlyRent: number) => {
    return [
      {
        name: 'Garantme',
        percentage: basePercentage,
        monthlyPrice: Math.round((monthlyRent * basePercentage) / 100),
        features: ['Paiement en ligne', 'Activation en 24h', 'Sans franchise'],
        rating: 4.8,
        recommended: true
      },
      {
        name: 'SmartGarant',
        percentage: basePercentage + 0.3,
        monthlyPrice: Math.round((monthlyRent * (basePercentage + 0.3)) / 100),
        features: ['Couverture dégradations', 'Assistance juridique', 'Protection juridique'],
        rating: 4.6
      },
      {
        name: 'Locatme',
        percentage: basePercentage + 0.5,
        monthlyPrice: Math.round((monthlyRent * (basePercentage + 0.5)) / 100),
        features: ['Garantie étendue', 'Frais de procédure inclus', 'Accompagnement personnalisé'],
        rating: 4.5
      },
      {
        name: 'Cautioneo',
        percentage: basePercentage + 0.7,
        monthlyPrice: Math.round((monthlyRent * (basePercentage + 0.7)) / 100),
        features: ['Service premium', 'Gestion complète', 'Indemnisation rapide'],
        rating: 4.4
      },
      {
        name: 'Unkle',
        percentage: basePercentage + 0.9,
        monthlyPrice: Math.round((monthlyRent * (basePercentage + 0.9)) / 100),
        features: ['Garantie maximale', 'Protection intégrale', 'Assistance 24/7'],
        rating: 4.3
      },
      {
        name: 'Wemind',
        percentage: basePercentage + 1.2,
        monthlyPrice: Math.round((monthlyRent * (basePercentage + 1.2)) / 100),
        features: ['Offre complète', 'Tous risques', 'Service VIP'],
        rating: 4.2
      }
    ];
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const percentage = calculatePrice(values);
      const rent = parseInt(values.monthlyRent);
      setEstimatedPrice(percentage);
      setSubmittedFormData({ ...values, offers: generateOffers(percentage, rent) });
      
      const { error } = await supabase.from('insurance_quotes').insert({
        insurance_type: 'gli',
        full_name: 'Prospect GLI',
        email: 'prospect@example.com',
        phone: '0000000000',
        quote_data: values,
        status: 'pending',
      });

      if (error) throw error;

      setShowComparison(true);
      toast.success('Devis GLI généré avec succès !');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Erreur lors de la génération du devis');
    }
  };

  const benefits = [
    'Protection contre les loyers impayés',
    'Couverture des dégradations locatives',
    'Prise en charge des frais de procédure',
    'Assistance juridique incluse',
    'Garantie de relogement si nécessaire',
    'Sérénité pour votre investissement locatif'
  ];

  const faqs = [
    {
      question: 'Qu\'est-ce que la Garantie Loyer Impayé (GLI) ?',
      answer: 'La GLI est une assurance qui protège les propriétaires bailleurs contre les loyers impayés, les dégradations et les frais de procédure en cas de litige avec le locataire.'
    },
    {
      question: 'Qui peut souscrire une GLI ?',
      answer: 'Tous les propriétaires bailleurs qui louent un bien immobilier à usage d\'habitation ou commercial peuvent souscrire une GLI.'
    },
    {
      question: 'Quelles sont les garanties couvertes ?',
      answer: 'La GLI couvre généralement les loyers et charges impayés, les dégradations locatives, la protection juridique et les frais de relogement en cas de dégradations importantes.'
    },
    {
      question: 'Quel est le coût moyen d\'une GLI ?',
      answer: 'Le coût varie entre 2% et 4% du montant annuel des loyers charges comprises, selon les garanties choisies et le profil du locataire.'
    }
  ];

  return (
    <>
      <SEO 
        title="Garantie Loyer Impayé (GLI) - Comparez les meilleures offres"
        description="Protégez vos revenus locatifs avec une assurance GLI. Comparateur en ligne gratuit pour trouver la meilleure garantie loyer impayé au meilleur prix."
        keywords="assurance GLI, garantie loyer impayé, protection propriétaire, loyers impayés, assurance bailleur"
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
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  Assurance Garantie Loyer Impayé
                </h1>
                <p className="text-xl text-gray-600 mb-8">
                  Protégez vos revenus locatifs et louez en toute sérénité
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card className="max-w-2xl mx-auto shadow-xl">
                  <CardHeader>
                    <CardTitle>Obtenez votre devis GLI</CardTitle>
                    <CardDescription>
                      Remplissez le formulaire pour recevoir les meilleures offres
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                          control={form.control}
                          name="propertyType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Type de bien</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Sélectionnez le type de bien" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="apartment">Appartement</SelectItem>
                                  <SelectItem value="house">Maison</SelectItem>
                                  <SelectItem value="commercial">Local commercial</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="monthlyRent"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Loyer mensuel (€)</FormLabel>
                              <FormControl>
                                <Input type="number" placeholder="1200" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="tenantType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Type de locataire</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Sélectionnez le type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="individual">Particulier</SelectItem>
                                  <SelectItem value="company">Entreprise</SelectItem>
                                  <SelectItem value="student">Étudiant</SelectItem>
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
                          <Euro className="mr-2 h-5 w-5" />
                          Comparer les offres GLI
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
              <h2 className="text-3xl font-bold text-center mb-12">Pourquoi souscrire une GLI ?</h2>
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

        {showComparison && submittedFormData?.offers && (
          <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl mx-auto"
              >
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold mb-4">Meilleures offres GLI</h2>
                  <p className="text-muted-foreground">
                    Tarifs en pourcentage du loyer mensuel ({submittedFormData.monthlyRent}€)
                  </p>
                </div>

                <div className="space-y-4">
                  {submittedFormData.offers.map((offer: any, index: number) => (
                    <Card 
                      key={index} 
                      className={`p-6 transition-all hover:shadow-lg ${
                        offer.recommended ? 'border-2 border-primary shadow-md' : ''
                      }`}
                    >
                      {offer.recommended && (
                        <div className="bg-primary text-white text-sm font-semibold px-3 py-1 rounded-full inline-block mb-4">
                          ⭐ Recommandé
                        </div>
                      )}
                      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold">{offer.name}</h3>
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm text-muted-foreground">{offer.rating}/5</span>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2 mt-3">
                            {offer.features.map((feature: string, i: number) => (
                              <Badge key={i} variant="outline" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-3xl font-bold text-primary mb-1">
                            {offer.percentage}%
                          </div>
                          <div className="text-sm text-muted-foreground mb-3">
                            soit {offer.monthlyPrice}€/mois
                          </div>
                          <Button 
                            variant={offer.recommended ? "subscribe-best" : "subscribe"}
                            size="lg"
                          >
                            Souscrire
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                <div className="text-center mt-8">
                  <Button variant="outline" onClick={() => setShowComparison(false)}>
                    Nouvelle recherche
                  </Button>
                </div>
              </motion.div>
            </div>
          </section>
        )}
      </div>
    </>
  );
};

export default AssuranceGLI;
