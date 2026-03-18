import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { CheckCircle2, Star, Shield, Users, TrendingDown, Clock, Heart } from 'lucide-react';
import SEOOptimized from '@/components/SEOOptimized';
import { SimplifiedLeadForm } from '@/components/landing/SimplifiedLeadForm';
import { addOrganizationSchema, addServiceSchema, addAggregateRatingSchema } from '@/utils/seoUtils';

const LandingSante = () => {
  const jsonLd = [
    addOrganizationSchema(),
    addServiceSchema({
      name: 'Mutuelle Santé moins chère',
      description: 'Comparez les meilleures mutuelles santé et économisez jusqu\'à 40%. Devis gratuit en 2 minutes.',
      provider: 'jemassuremoinscher.fr',
      areaServed: 'France',
    }),
    addAggregateRatingSchema('Mutuelle Santé', 4.8, 2847),
  ];

  return (
    <>
      <SEOOptimized
        title="Mutuelle Santé Moins Chère | Devis Gratuit"
        description="Comparez les mutuelles santé en 2 min. Expert dédié, rappel sous 2h. Économisez jusqu'à 40%."
        keyword="mutuelle santé moins chère"
        keywords="devis mutuelle gratuit, comparateur mutuelle santé"
        jsonLd={jsonLd}
        noindex
      />

      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
        {/* Top Bar - Urgence */}
        <div className="bg-accent text-accent-foreground py-2 px-4 text-center font-semibold text-sm md:text-base animate-fade-in">
          <Heart className="inline h-4 w-4 mr-2" />
          🔥 Offre spéciale Santé : 2 mois offerts ! Valable jusqu'à dimanche
        </div>

        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-start max-w-7xl mx-auto">
            {/* Left Column - Social Proof & Benefits */}
            <div className="space-y-6 animate-fade-in">
              <div>
                <Badge className="mb-4 text-sm px-3 py-1">
                  <Star className="h-3 w-3 mr-1 fill-current" />
                  N°1 Mutuelle Santé en France
                </Badge>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-4">
                  Mutuelle Santé
                  <span className="text-primary block mt-2">jusqu'à -800€/an</span>
                  <span className="block text-2xl md:text-3xl mt-2 text-muted-foreground font-normal">
                    Comparez 30+ mutuelles
                  </span>
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground mb-6">
                  Économisez en moyenne <strong className="text-primary">800€ par an</strong> sur votre mutuelle santé en comparant gratuitement les meilleurs tarifs.
                  <span className="block mt-2 text-primary font-semibold">
                    ⚡ Expert dédié - Réponse sous 2h
                  </span>
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-card rounded-lg border hover-scale">
                  <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <div className="font-bold text-2xl">15k+</div>
                  <div className="text-xs text-muted-foreground">Assurés</div>
                </div>
                <div className="text-center p-4 bg-card rounded-lg border hover-scale">
                  <Star className="h-8 w-8 mx-auto mb-2 text-primary fill-current" />
                  <div className="font-bold text-2xl">4.8/5</div>
                  <div className="text-xs text-muted-foreground">2 847 avis</div>
                </div>
                <div className="text-center p-4 bg-card rounded-lg border hover-scale">
                  <TrendingDown className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <div className="font-bold text-2xl">-800€</div>
                  <div className="text-xs text-muted-foreground">Économie moy.</div>
                </div>
                <div className="text-center p-4 bg-card rounded-lg border hover-scale">
                  <Clock className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <div className="font-bold text-2xl">2 min</div>
                  <div className="text-xs text-muted-foreground">Pour le devis</div>
                </div>
              </div>

              {/* Benefits */}
              <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  Pourquoi nous choisir pour votre mutuelle santé ?
                </h3>
                <ul className="space-y-3">
                  {[
                    '✅ 100% gratuit et sans engagement',
                    '🏥 Comparaison de 30+ mutuelles (Alan, Harmonie, MGEN...)',
                    '⚡ Expert dédié qui vous rappelle sous 2h',
                    '💰 Économies garanties ou remboursé',
                    '📞 Service client 5⭐ disponible 7j/7',
                    '🩺 Toutes formules : optique, dentaire, hospitalisation',
                  ].map((benefit, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-sm">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              {/* Testimonials */}
              <div className="space-y-4">
                <h3 className="font-bold text-lg">🌟 Avis clients mutuelle santé :</h3>
                {[
                  {
                    name: 'Sophie M.',
                    location: 'Paris',
                    text: 'J\'ai économisé 720€ sur ma mutuelle famille ! Mêmes remboursements optique/dentaire mais beaucoup moins cher.',
                    rating: 5,
                  },
                  {
                    name: 'Jean L.',
                    location: 'Lyon',
                    text: 'Excellent accompagnement. Mon conseiller a trouvé une mutuelle senior 45% moins chère avec de meilleures garanties.',
                    rating: 5,
                  },
                  {
                    name: 'Marie D.',
                    location: 'Toulouse',
                    text: 'Rapide et efficace. En 1h j\'avais ma nouvelle mutuelle. Je recommande !',
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
                  SSL Sécurisé
                </Badge>
                <Badge variant="outline" className="gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  RGPD
                </Badge>
                <Badge variant="outline" className="gap-2">
                  <Star className="h-4 w-4" />
                  Service Premium
                </Badge>
              </div>
            </div>

            {/* Right Column - Lead Form */}
            <div className="lg:sticky lg:top-8">
              <SimplifiedLeadForm 
                insuranceType="sante"
                insuranceLabel="Mutuelle Santé"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LandingSante;
