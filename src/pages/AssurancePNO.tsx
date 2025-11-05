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
import { Shield, Home, Euro, FileCheck, TrendingUp, CheckCircle } from 'lucide-react';
import InsuranceFAQ from '@/components/insurance/InsuranceFAQ';

const formSchema = z.object({
  propertyType: z.enum(['apartment', 'house', 'studio', 'commercial'], {
    required_error: 'Veuillez sélectionner un type de bien',
  }),
  surface: z.string().min(1, 'Surface requise'),
  rooms: z.string().min(1, 'Nombre de pièces requis'),
  occupancyStatus: z.enum(['vacant', 'rental', 'secondary'], {
    required_error: 'Veuillez sélectionner un statut',
  }),
  postalCode: z.string().min(5, 'Code postal invalide').max(5, 'Code postal invalide'),
});

const AssurancePNO = () => {
  const [showComparison, setShowComparison] = useState(false);
  const [submittedFormData, setSubmittedFormData] = useState<any>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      propertyType: undefined,
      surface: '',
      rooms: '',
      occupancyStatus: undefined,
      postalCode: '',
    },
  });

  const calculatePrice = (values: z.infer<typeof formSchema>) => {
    let basePrice = 9; // Tarif minimum PNO à 9€/mois
    const surface = parseInt(values.surface);
    const rooms = parseInt(values.rooms);
    
    // Based on property type
    if (values.propertyType === 'house') basePrice += 8;
    if (values.propertyType === 'apartment') basePrice += 4;
    if (values.propertyType === 'commercial') basePrice += 18;
    
    // Based on surface
    if (surface > 50) basePrice += 6;
    if (surface > 100) basePrice += 12;
    
    // Based on rooms
    if (rooms > 2) basePrice += 4;
    if (rooms > 4) basePrice += 8;
    
    // Based on occupancy
    if (values.occupancyStatus === 'vacant') basePrice += 10;
    if (values.occupancyStatus === 'secondary') basePrice += 6;

    const basePriceRounded = Math.round(basePrice);
    
    // Generate insurers list
    const insurers = [
      {
        name: 'Luko',
        price: basePriceRounded,
        coverage: ['Protection bâtiment', 'Responsabilité civile', 'Dégâts des eaux', 'Incendie'],
        discount: '-20% en ligne'
      },
      {
        name: 'Direct Assurance',
        price: Math.round(basePriceRounded * 1.15),
        coverage: ['Garantie complète', 'Catastrophes naturelles', 'Protection juridique', 'Assistance 24/7']
      },
      {
        name: 'Allianz',
        price: Math.round(basePriceRounded * 1.25),
        coverage: ['Tous risques', 'Vol et vandalisme', 'Bris de glace', 'Dommages électriques']
      },
      {
        name: 'AXA',
        price: Math.round(basePriceRounded * 1.32),
        coverage: ['Protection maximale', 'Garantie loyers', 'Assistance propriétaire', 'Service premium']
      },
      {
        name: 'MAIF',
        price: Math.round(basePriceRounded * 1.40),
        coverage: ['Couverture étendue', 'Protection complète', 'Accompagnement personnalisé', 'Franchise réduite']
      },
      {
        name: 'Matmut',
        price: Math.round(basePriceRounded * 1.48),
        coverage: ['Offre complète', 'Tous dommages', 'Assistance juridique', 'Garantie rééquipement'],
        discount: '-10% 1er mois'
      },
      {
        name: 'GMF',
        price: Math.round(basePriceRounded * 1.55),
        coverage: ['Protection premium', 'Garantie étendue', 'Service client dédié', 'Indemnisation rapide']
      },
      {
        name: 'Groupama',
        price: Math.round(basePriceRounded * 1.10),
        coverage: ['Couverture standard', 'RC propriétaire', 'Protection incendie', 'Activation rapide']
      },
      {
        name: 'MACIF',
        price: Math.round(basePriceRounded * 1.20),
        coverage: ['Garantie complète', 'Protection bâtiment', 'Assistance 7j/7', 'Dommages couverts']
      },
      {
        name: 'MMA',
        price: Math.round(basePriceRounded * 1.18),
        coverage: ['Protection standard', 'Bâtiment couvert', 'Catastrophes incluses', 'Plateforme digitale']
      }
    ];

    return insurers;
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const insurers = calculatePrice(values);
      setSubmittedFormData({ ...values, insurers });
      
      const { error } = await supabase.from('insurance_quotes').insert({
        insurance_type: 'pno',
        full_name: 'Prospect PNO',
        email: 'prospect@example.com',
        phone: '0000000000',
        quote_data: values,
        status: 'pending',
      });

      if (error) throw error;

      setShowComparison(true);
      toast.success('Devis PNO généré avec succès !');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Erreur lors de la génération du devis');
    }
  };

  const benefits = [
    'Protection complète du bâtiment',
    'Responsabilité civile incluse',
    'Obligatoire en copropriété',
    'Garanties contre tous les risques majeurs',
    'Options personnalisables selon vos besoins',
    'Tarifs adaptés aux biens non occupés'
  ];

  const faqs = [
    {
      question: 'Qu\'est-ce que l\'assurance PNO ?',
      answer: 'L\'assurance Propriétaire Non Occupant (PNO) protège votre bien immobilier que vous ne louez pas contre les risques comme les dégâts des eaux, incendies, ou catastrophes naturelles.'
    },
    {
      question: 'Est-elle obligatoire ?',
      answer: 'L\'assurance PNO est obligatoire pour les copropriétaires, même si le bien est vide. Elle est fortement recommandée pour tous les propriétaires non occupants.'
    },
    {
      question: 'Que couvre une assurance PNO ?',
      answer: 'Elle couvre généralement les dommages au bâtiment (incendie, dégâts des eaux, catastrophes naturelles), votre responsabilité civile et peut inclure des garanties optionnelles comme le vol ou le vandalisme.'
    },
    {
      question: 'Quelle différence avec une assurance habitation classique ?',
      answer: 'La PNO est spécifiquement conçue pour les biens non occupés par le propriétaire. Elle est généralement moins chère qu\'une assurance habitation standard car elle ne couvre pas le contenu du logement.'
    }
  ];

  return (
    <>
      <SEO 
        title="Assurance PNO (Propriétaire Non Occupant) - Comparateur"
        description="Comparez les meilleures assurances PNO pour protéger votre bien immobilier. Devis gratuit et instantané pour propriétaires non occupants."
        keywords="assurance PNO, propriétaire non occupant, assurance logement vide, assurance copropriété"
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
                  Assurance Propriétaire Non Occupant (PNO)
                </h1>
                <p className="text-xl text-gray-600 mb-8">
                  Protégez votre patrimoine immobilier même lorsque vous n'y habitez pas
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card className="max-w-2xl mx-auto shadow-xl">
                  <CardHeader>
                    <CardTitle>Obtenez votre devis PNO</CardTitle>
                    <CardDescription>
                      Comparez gratuitement les offres adaptées à votre bien
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
                                    <SelectValue placeholder="Sélectionnez le type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="apartment">Appartement</SelectItem>
                                  <SelectItem value="house">Maison</SelectItem>
                                  <SelectItem value="studio">Studio</SelectItem>
                                  <SelectItem value="commercial">Local commercial</SelectItem>
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
                          name="rooms"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nombre de pièces</FormLabel>
                              <FormControl>
                                <Input type="number" placeholder="3" min="1" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="occupancyStatus"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Statut d'occupation</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Sélectionnez le statut" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="vacant">Bien vacant</SelectItem>
                                  <SelectItem value="rental">Bien loué</SelectItem>
                                  <SelectItem value="secondary">Résidence secondaire</SelectItem>
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
                          Comparer les offres PNO
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
              <h2 className="text-3xl font-bold text-center mb-12">Pourquoi choisir une assurance PNO ?</h2>
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

        {showComparison && submittedFormData?.insurers && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-background rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto p-6 relative">
              <Button
                variant="ghost"
                className="absolute top-4 right-4"
                onClick={() => setShowComparison(false)}
              >
                ✕
              </Button>
              
              <InsuranceComparison
                insurers={submittedFormData.insurers}
                onNewQuote={() => setShowComparison(false)}
                formData={submittedFormData}
                insuranceType="pno"
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AssurancePNO;
