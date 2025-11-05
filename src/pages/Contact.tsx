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
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';

const formSchema = z.object({
  fullName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Email invalide'),
  phone: z.string().regex(/^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/, 'Numéro de téléphone invalide'),
  subject: z.string().min(3, 'Le sujet doit contenir au moins 3 caractères'),
  message: z.string().min(10, 'Le message doit contenir au moins 10 caractères'),
  preferredTime: z.string().min(1, 'Veuillez sélectionner un créneau'),
});

const Contact = () => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
      preferredTime: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    
    try {
      const { error } = await supabase.from('contact_callbacks').insert({
        full_name: values.fullName,
        email: values.email,
        phone: values.phone,
        message: `${values.subject}\n\n${values.message}`,
        preferred_time: values.preferredTime,
        status: 'pending',
      });

      if (error) throw error;

      toast.success('Message envoyé avec succès ! Nous vous contacterons dans les plus brefs délais.');
      form.reset();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Erreur lors de l\'envoi du message');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <SEO 
        title="Contact - Le Comparateur Assurance"
        description="Contactez-nous pour toute question sur nos services de comparaison d'assurance"
      />
      
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main id="main-content" className="flex-grow bg-gray-50 py-12">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Contactez-nous</h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Une question ? Besoin d'aide ? Notre équipe est à votre écoute
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <Card>
                <CardHeader className="text-center">
                  <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">Téléphone</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground">Du lundi au vendredi</p>
                  <p className="text-muted-foreground">9h - 18h</p>
                  <p className="font-semibold text-lg mt-2">01 XX XX XX XX</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="text-center">
                  <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">Email</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground">Réponse sous 24h</p>
                  <p className="font-semibold mt-2">contact@lecomparateurassurance.fr</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="text-center">
                  <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">Adresse</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground">[Adresse à compléter]</p>
                  <p className="text-muted-foreground">[Code postal] [Ville]</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Formulaire de contact</CardTitle>
                  <CardDescription>
                    Remplissez ce formulaire et nous vous recontacterons rapidement
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nom complet *</FormLabel>
                            <FormControl>
                              <Input placeholder="Jean Dupont" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email *</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="jean.dupont@email.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Téléphone *</FormLabel>
                            <FormControl>
                              <Input type="tel" placeholder="06 12 34 56 78" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="subject"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Sujet *</FormLabel>
                            <FormControl>
                              <Input placeholder="Question sur un devis" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="preferredTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Créneau préféré *</FormLabel>
                            <FormControl>
                              <Input placeholder="Ex: Lundi matin, Mardi après-midi" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Message *</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Décrivez votre demande en détail..." 
                                className="min-h-[120px]"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                        <Send className="mr-2 h-5 w-5" />
                        {isLoading ? "Envoi en cours..." : "Envoyer le message"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-primary" />
                      Horaires d'ouverture
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">Lundi - Vendredi</span>
                        <span className="text-muted-foreground">9h00 - 18h00</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Samedi</span>
                        <span className="text-muted-foreground">9h00 - 12h00</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Dimanche</span>
                        <span className="text-muted-foreground">Fermé</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Questions fréquentes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <p className="font-semibold text-sm">Combien de temps pour obtenir une réponse ?</p>
                        <p className="text-sm text-muted-foreground">Nous répondons sous 24h maximum aux demandes par email.</p>
                      </div>
                      <div>
                        <p className="font-semibold text-sm">Le service est-il gratuit ?</p>
                        <p className="text-sm text-muted-foreground">Oui, notre service de comparaison est 100% gratuit et sans engagement.</p>
                      </div>
                      <div>
                        <p className="font-semibold text-sm">Puis-je modifier mon devis ?</p>
                        <p className="text-sm text-muted-foreground">Oui, vous pouvez faire une nouvelle demande à tout moment.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-primary text-primary-foreground">
                  <CardHeader>
                    <CardTitle>Besoin d'aide immédiate ?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">
                      Nos conseillers sont disponibles du lundi au vendredi de 9h à 18h
                    </p>
                    <Button variant="secondary" size="lg" className="w-full" asChild>
                      <a href="tel:+33XXXXXXXXX">
                        <Phone className="mr-2 h-5 w-5" />
                        Appeler maintenant
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Contact;
