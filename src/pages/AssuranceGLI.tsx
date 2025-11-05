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
import InsuranceComparison from '@/components/InsuranceComparison';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Shield, Home, Euro, Users, TrendingUp, CheckCircle } from 'lucide-react';
import InsuranceFAQ from '@/components/insurance/InsuranceFAQ';

const formSchema = z.object({
  propertyType: z.enum(['apartment', 'house', 'commercial'], {
    required_error: 'Veuillez sélectionner un type de bien',
  }),
  monthlyRent: z.string().min(1, 'Montant requis'),
  propertyValue: z.string().min(1, 'Valeur requise'),
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
      propertyValue: '',
      tenantType: undefined,
      postalCode: '',
    },
  });

  const calculatePrice = (values: z.infer<typeof formSchema>) => {
    let basePrice = 25;
    const rent = parseInt(values.monthlyRent);
    
    // Based on property type
    if (values.propertyType === 'house') basePrice += 8;
    if (values.propertyType === 'commercial') basePrice += 15;
    
    // Based on rent amount
    if (rent > 1500) basePrice += 15;
    if (rent > 2000) basePrice += 25;
    
    // Based on tenant type
    if (values.tenantType === 'student') basePrice += 5;
    if (values.tenantType === 'company') basePrice -= 5;

    return Math.round(basePrice + (rent * 0.025));
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const price = calculatePrice(values);
      setEstimatedPrice(price);
      setSubmittedFormData(values);
      
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
                          name="propertyValue"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Valeur du bien (€)</FormLabel>
                              <FormControl>
                                <Input type="number" placeholder="250000" {...field} />
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

{showComparison && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-2xl font-bold mb-4">Devis GLI</h3>
              <p className="text-3xl font-bold text-primary mb-4">{estimatedPrice}€/mois</p>
              <p className="text-gray-600 mb-6">
                Votre devis a été généré. Nos conseillers vous contacteront sous 24h.
              </p>
              <Button onClick={() => setShowComparison(false)} className="w-full">
                Fermer
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AssuranceGLI;
