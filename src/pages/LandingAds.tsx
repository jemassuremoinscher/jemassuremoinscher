import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Star, Shield, Clock, Users, TrendingDown, Phone, Loader2, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAnalytics } from '@/hooks/useAnalytics';
import SEO from '@/components/SEO';

const leadFormSchema = z.object({
  insuranceType: z.string().min(1, 'Sélectionnez un type'),
  fullName: z.string().trim().min(2, 'Nom requis').max(100),
  email: z.string().trim().email('Email invalide').max(255),
  phone: z.string().trim().regex(/^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/, 'Téléphone invalide'),
});

type LeadFormData = z.infer<typeof leadFormSchema>;

const LandingAds = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { trackEvent, trackConversion } = useAnalytics();

  const form = useForm<LeadFormData>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      insuranceType: '',
      fullName: '',
      email: '',
      phone: '',
    },
  });

  const onSubmit = async (data: LeadFormData) => {
    setIsSubmitting(true);

    try {
      const { error } = await supabase.from('insurance_quotes').insert({
        insurance_type: data.insuranceType,
        full_name: data.fullName,
        email: data.email,
        phone: data.phone,
        quote_data: {
          source: 'google_ads_landing',
          utm_source: new URLSearchParams(window.location.search).get('utm_source'),
          utm_medium: new URLSearchParams(window.location.search).get('utm_medium'),
          utm_campaign: new URLSearchParams(window.location.search).get('utm_campaign'),
        },
        status: 'pending',
      });

      if (error) throw error;

      // Track conversion
      trackConversion('ads_lead_form', 150);
      trackEvent('quote_request', {
        category: 'lead_generation',
        label: 'google_ads_landing',
        insurance_type: data.insuranceType,
        value: 150,
      });

      setIsSuccess(true);
      toast.success('Demande envoyée ! Nous vous contactons sous 2h.');
    } catch (error) {
      toast.error('Erreur. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full p-8 md:p-12 text-center animate-scale-in">
          <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/20 mx-auto mb-6 flex items-center justify-center">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            🎉 Demande envoyée avec succès !
          </h1>
          <p className="text-lg text-muted-foreground mb-6">
            Un de nos experts vous contacte dans les <span className="font-bold text-primary">2 heures</span> pour vous proposer les meilleures offres adaptées à votre profil.
          </p>
          <div className="bg-accent/10 border border-accent/20 rounded-lg p-6 mb-6">
            <p className="font-semibold mb-2">Pendant ce temps :</p>
            <ul className="text-left space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span>Nous comparons plus de <strong>30 assureurs</strong> pour vous</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span>Nous préparons votre <strong>devis personnalisé gratuit</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span>Vérifiez votre <strong>téléphone et email</strong></span>
              </li>
            </ul>
          </div>
          <p className="text-sm text-muted-foreground">
            Référence de votre demande : <span className="font-mono bg-muted px-2 py-1 rounded">
              {new Date().getTime().toString(36).toUpperCase()}
            </span>
          </p>
        </Card>
      </div>
    );
  }

  return (
    <>
      <SEO
        title="Économisez jusqu'à 947€/an sur votre Assurance - Devis Gratuit en 2 min"
        description="Comparez gratuitement les meilleures assurances. Nos experts vous rappellent sous 2h avec votre devis personnalisé. +15 000 clients satisfaits. Sans engagement."
        keywords="assurance pas cher, devis assurance gratuit, économiser assurance, comparateur assurance"
        canonical={`https://votre-domaine.fr${window.location.pathname}`}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
        {/* Top Bar - Urgence */}
        <div className="bg-accent text-accent-foreground py-2 px-4 text-center font-semibold text-sm md:text-base animate-fade-in">
          <Sparkles className="inline h-4 w-4 mr-2" />
          🔥 Offre limitée : -30% sur votre première année ! Plus que 7 places disponibles
        </div>

        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-start max-w-7xl mx-auto">
            {/* Left Column - Social Proof & Benefits */}
            <div className="space-y-6 animate-fade-in">
              {/* Hero */}
              <div>
                <Badge className="mb-4 text-sm px-3 py-1">
                  <Star className="h-3 w-3 mr-1 fill-current" />
                  N°1 en France
                </Badge>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-4">
                  Économisez jusqu'à
                  <span className="text-primary block mt-2">947€ par an</span>
                  <span className="block text-2xl md:text-3xl mt-2 text-muted-foreground font-normal">
                    sur votre assurance
                  </span>
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground mb-6">
                  Nos experts comparent <strong>30+ assureurs</strong> pour trouver la meilleure offre adaptée à votre profil.
                  <span className="block mt-2 text-primary font-semibold">
                    ⚡ Réponse garantie en moins de 2 heures
                  </span>
                </p>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-card rounded-lg border hover-scale">
                  <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <div className="font-bold text-2xl">15 000+</div>
                  <div className="text-xs text-muted-foreground">Clients satisfaits</div>
                </div>
                <div className="text-center p-4 bg-card rounded-lg border hover-scale">
                  <Star className="h-8 w-8 mx-auto mb-2 text-primary fill-current" />
                  <div className="font-bold text-2xl">4.8/5</div>
                  <div className="text-xs text-muted-foreground">Sur 2 847 avis</div>
                </div>
                <div className="text-center p-4 bg-card rounded-lg border hover-scale">
                  <TrendingDown className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <div className="font-bold text-2xl">947€</div>
                  <div className="text-xs text-muted-foreground">Économie moyenne</div>
                </div>
                <div className="text-center p-4 bg-card rounded-lg border hover-scale">
                  <Clock className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <div className="font-bold text-2xl">2 min</div>
                  <div className="text-xs text-muted-foreground">Pour votre devis</div>
                </div>
              </div>

              {/* Benefits */}
              <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  Pourquoi nous choisir ?
                </h3>
                <ul className="space-y-3">
                  {[
                    '100% gratuit et sans engagement',
                    'Comparaison de 30+ assureurs en temps réel',
                    'Expert dédié qui vous rappelle sous 2h',
                    'Économies garanties ou remboursé',
                    'Service client 5 étoiles disponible 7j/7',
                    'Démarches simplifiées, on s\'occupe de tout',
                  ].map((benefit, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              {/* Testimonials */}
              <div className="space-y-4">
                <h3 className="font-bold text-lg">Ce que disent nos clients :</h3>
                {[
                  {
                    name: 'Sophie M.',
                    location: 'Paris',
                    text: 'J\'ai économisé 420€ sur mon assurance auto ! Service rapide et efficace.',
                    rating: 5,
                  },
                  {
                    name: 'Thomas L.',
                    location: 'Lyon',
                    text: 'Excellent accompagnement. Mon conseiller a trouvé une mutuelle 40% moins chère.',
                    rating: 5,
                  },
                  {
                    name: 'Marie D.',
                    location: 'Marseille',
                    text: 'Rapide, simple et vraiment gratuit. Je recommande à 100% !',
                    rating: 5,
                  },
                ].map((testimonial, i) => (
                  <Card key={i} className="p-4 hover-scale">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        {testimonial.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-sm">{testimonial.name}</span>
                          <span className="text-xs text-muted-foreground">• {testimonial.location}</span>
                        </div>
                        <div className="flex gap-0.5 mb-2">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                        <p className="text-sm text-muted-foreground italic">"{testimonial.text}"</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Trust Badges */}
              <div className="flex items-center justify-center gap-4 py-4 flex-wrap">
                <Badge variant="outline" className="gap-2">
                  <Shield className="h-4 w-4" />
                  Données sécurisées SSL
                </Badge>
                <Badge variant="outline" className="gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  Certifié RGPD
                </Badge>
                <Badge variant="outline" className="gap-2">
                  <Star className="h-4 w-4" />
                  Service Premium
                </Badge>
              </div>
            </div>

            {/* Right Column - Lead Form */}
            <div className="lg:sticky lg:top-8 animate-scale-in">
              <Card className="p-6 md:p-8 shadow-2xl border-2 border-primary/20">
                {/* Form Header */}
                <div className="text-center mb-6">
                  <div className="inline-flex items-center gap-2 bg-accent/20 px-4 py-2 rounded-full mb-4">
                    <Phone className="h-4 w-4 text-accent-foreground" />
                    <span className="text-sm font-semibold">Rappel garanti sous 2h</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-2">
                    Obtenez votre devis gratuit
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Remplissez ce formulaire en 30 secondes
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  {/* Insurance Type */}
                  <div>
                    <Label htmlFor="insuranceType" className="text-base font-semibold mb-2 block">
                      Type d'assurance *
                    </Label>
                    <Select
                      value={form.watch('insuranceType')}
                      onValueChange={(value) => form.setValue('insuranceType', value)}
                    >
                      <SelectTrigger className="h-12 text-base">
                        <SelectValue placeholder="Sélectionnez un type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="auto">🚗 Assurance Auto</SelectItem>
                        <SelectItem value="moto">🏍️ Assurance Moto</SelectItem>
                        <SelectItem value="habitation">🏠 Assurance Habitation</SelectItem>
                        <SelectItem value="sante">💊 Mutuelle Santé</SelectItem>
                        <SelectItem value="pret">🏦 Assurance Prêt</SelectItem>
                        <SelectItem value="animaux">🐕 Assurance Animaux</SelectItem>
                      </SelectContent>
                    </Select>
                    {form.formState.errors.insuranceType && (
                      <p className="text-sm text-red-600 mt-1">
                        {form.formState.errors.insuranceType.message}
                      </p>
                    )}
                  </div>

                  {/* Name */}
                  <div>
                    <Label htmlFor="fullName" className="text-base font-semibold mb-2 block">
                      Nom complet *
                    </Label>
                    <Input
                      {...form.register('fullName')}
                      id="fullName"
                      placeholder="Jean Dupont"
                      className="h-12 text-base"
                      disabled={isSubmitting}
                    />
                    {form.formState.errors.fullName && (
                      <p className="text-sm text-red-600 mt-1">
                        {form.formState.errors.fullName.message}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <Label htmlFor="email" className="text-base font-semibold mb-2 block">
                      Email *
                    </Label>
                    <Input
                      {...form.register('email')}
                      id="email"
                      type="email"
                      placeholder="jean.dupont@email.com"
                      className="h-12 text-base"
                      disabled={isSubmitting}
                    />
                    {form.formState.errors.email && (
                      <p className="text-sm text-red-600 mt-1">
                        {form.formState.errors.email.message}
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <Label htmlFor="phone" className="text-base font-semibold mb-2 block">
                      Téléphone *
                    </Label>
                    <Input
                      {...form.register('phone')}
                      id="phone"
                      type="tel"
                      placeholder="06 12 34 56 78"
                      className="h-12 text-base"
                      disabled={isSubmitting}
                    />
                    {form.formState.errors.phone && (
                      <p className="text-sm text-red-600 mt-1">
                        {form.formState.errors.phone.message}
                      </p>
                    )}
                  </div>

                  {/* CTA Button */}
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full h-14 text-lg font-bold shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        <Phone className="mr-2 h-5 w-5" />
                        Être rappelé gratuitement
                      </>
                    )}
                  </Button>

                  {/* Trust footer */}
                  <div className="text-center space-y-2 pt-2">
                    <p className="text-xs text-muted-foreground flex items-center justify-center gap-2">
                      <Shield className="h-3 w-3" />
                      Vos données sont 100% sécurisées et confidentielles
                    </p>
                    <p className="text-xs text-muted-foreground">
                      ✓ Sans engagement • ✓ Gratuit • ✓ Réponse en 2h
                    </p>
                  </div>
                </form>
              </Card>

              {/* Live activity indicator */}
              <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <div className="flex items-center gap-2 text-sm">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse" />
                    <span className="font-semibold text-green-800 dark:text-green-200">
                      12 personnes
                    </span>
                  </div>
                  <span className="text-green-700 dark:text-green-300">
                    sont en train de comparer leur assurance
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Trust Section */}
        <div className="border-t bg-muted/30 py-8">
          <div className="container mx-auto px-4">
            <p className="text-center text-sm text-muted-foreground mb-4">
              Nos partenaires de confiance
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8 opacity-60 grayscale hover:grayscale-0 transition-all">
              {['AXA', 'Allianz', 'Groupama', 'MAIF', 'MACIF', 'MMA'].map((partner) => (
                <span key={partner} className="font-bold text-lg">{partner}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LandingAds;
