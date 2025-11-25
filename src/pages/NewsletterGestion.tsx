import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Mail, Trash2, CheckCircle2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const formSchema = z.object({
  email: z.string().email('Email invalide'),
});

const NewsletterGestion = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    
    try {
      // Mettre à jour le statut à 'unsubscribed'
      const { error } = await supabase
        .from('newsletter_subscribers')
        .update({ 
          status: 'unsubscribed',
          unsubscribed_at: new Date().toISOString()
        })
        .eq('email', values.email)
        .eq('status', 'active');

      if (error) {
        // Si aucune ligne n'a été mise à jour, l'email n'existe pas
        toast.error('Aucun abonnement trouvé avec cet email ou déjà désinscrit');
      } else {
        setIsSuccess(true);
        toast.success('Vous avez été désinscrit(e) avec succès de notre newsletter');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Erreur lors de la désinscription');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <SEO 
        title="Gestion Newsletter - jemassurmoinscher"
        description="Gérez votre abonnement à la newsletter de jemassurmoinscher"
      />
      
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main id="main-content" className="flex-grow bg-gray-50 py-12">
          <div className="container mx-auto px-4 max-w-2xl">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <Mail className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Gestion de votre abonnement</h1>
              <p className="text-xl text-muted-foreground">
                Gérez vos préférences d'abonnement à notre newsletter
              </p>
            </div>

            {isSuccess ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <CheckCircle2 className="h-16 w-16 text-green-600 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold mb-2">Désinscription confirmée</h2>
                  <p className="text-muted-foreground mb-6">
                    Vous avez été désinscrit(e) avec succès de notre newsletter.
                  </p>
                  <p className="text-sm text-muted-foreground mb-6">
                    Vous ne recevrez plus d'emails promotionnels de notre part. 
                    Nous conservons votre adresse uniquement pour respecter votre choix.
                  </p>
                  <Button onClick={() => setIsSuccess(false)} variant="outline">
                    Faire une nouvelle demande
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Trash2 className="h-5 w-5 text-destructive" />
                      Se désinscrire de la newsletter
                    </CardTitle>
                    <CardDescription>
                      Entrez votre adresse email pour vous désabonner de nos communications
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Adresse email *</FormLabel>
                              <FormControl>
                                <Input 
                                  type="email" 
                                  placeholder="votre.email@exemple.com" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Button 
                          type="submit" 
                          variant="destructive" 
                          className="w-full" 
                          size="lg" 
                          disabled={isLoading}
                        >
                          <Trash2 className="mr-2 h-5 w-5" />
                          {isLoading ? "Traitement en cours..." : "Me désinscrire"}
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>

                <Alert>
                  <AlertDescription>
                    <p className="font-semibold mb-2">Informations importantes :</p>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Vous ne recevrez plus nos newsletters et offres promotionnelles</li>
                      <li>Les emails de service (confirmations de devis) seront toujours envoyés</li>
                      <li>Vous pourrez vous réabonner à tout moment</li>
                      <li>Votre désinscription sera effective sous 24 à 48 heures</li>
                    </ul>
                  </AlertDescription>
                </Alert>

                <Card>
                  <CardHeader>
                    <CardTitle>Vous changez d'avis ?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Si vous souhaitez modifier la fréquence de nos emails plutôt que de vous désabonner complètement, 
                      contactez-nous et nous ajusterons vos préférences.
                    </p>
                    <Button variant="outline" asChild>
                      <a href="/contact">Nous contacter</a>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-primary/5 border-primary/20">
                  <CardHeader>
                    <CardTitle className="text-lg">Que recevez-vous dans notre newsletter ?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary mt-0.5" />
                        <span>Conseils pour économiser sur vos assurances</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary mt-0.5" />
                        <span>Nouvelles offres et promotions exclusives</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary mt-0.5" />
                        <span>Actualités du secteur de l'assurance</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary mt-0.5" />
                        <span>Guides pratiques et comparatifs</span>
                      </li>
                    </ul>
                    <p className="text-sm text-muted-foreground mt-4">
                      Fréquence : maximum 2 emails par semaine
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default NewsletterGestion;
