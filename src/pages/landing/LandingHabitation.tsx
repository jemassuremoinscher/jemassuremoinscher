import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { CheckCircle2, Star, Shield, Users, TrendingDown, Clock, Home } from 'lucide-react';
import SEO from '@/components/SEO';
import { SimplifiedLeadForm } from '@/components/landing/SimplifiedLeadForm';
import { addOrganizationSchema, addServiceSchema, addAggregateRatingSchema } from '@/utils/seoUtils';

const LandingHabitation = () => {
  const jsonLd = [
    addOrganizationSchema(),
    addServiceSchema({
      name: 'Assurance Habitation pas chère',
      description: 'Comparez les meilleures assurances habitation et économisez jusqu\'à 350€/an. Devis gratuit en 2 minutes.',
      provider: 'jemassuremoinscher',
      areaServed: 'France',
    }),
    addAggregateRatingSchema('Assurance Habitation', 4.8, 2847),
  ];

  return (
    <>
      <SEO
        title="Assurance Habitation Pas Chère - Économisez jusqu'à 350€/an | Devis Gratuit"
        description="Comparez gratuitement les meilleures assurances habitation en 2 minutes. Expert dédié, rappel sous 2h. +15 000 clients ont économisé en moyenne 350€/an."
        keywords="assurance habitation pas cher, devis assurance logement gratuit, comparateur assurance habitation, économiser assurance maison"
        jsonLd={jsonLd}
      />

      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
        {/* Top Bar - Urgence */}
        <div className="bg-accent text-accent-foreground py-2 px-4 text-center font-semibold text-sm md:text-base animate-fade-in">
          <Home className="inline h-4 w-4 mr-2" />
          🔥 Offre spéciale Habitation : -25% la 1ère année ! Offre limitée
        </div>

        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-start max-w-7xl mx-auto">
            {/* Left Column - Social Proof & Benefits */}
            <div className="space-y-6 animate-fade-in">
              <div>
                <Badge className="mb-4 text-sm px-3 py-1">
                  <Star className="h-3 w-3 mr-1 fill-current" />
                  N°1 Assurance Habitation en France
                </Badge>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-4">
                  Assurance Habitation
                  <span className="text-primary block mt-2">jusqu'à -350€/an</span>
                  <span className="block text-2xl md:text-3xl mt-2 text-muted-foreground font-normal">
                    Comparez 30+ assureurs
                  </span>
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground mb-6">
                  Économisez en moyenne <strong className="text-primary">350€ par an</strong> sur votre assurance habitation en comparant gratuitement les meilleurs tarifs.
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
                  <div className="text-xs text-muted-foreground">Foyers protégés</div>
                </div>
                <div className="text-center p-4 bg-card rounded-lg border hover-scale">
                  <Star className="h-8 w-8 mx-auto mb-2 text-primary fill-current" />
                  <div className="font-bold text-2xl">4.8/5</div>
                  <div className="text-xs text-muted-foreground">2 847 avis</div>
                </div>
                <div className="text-center p-4 bg-card rounded-lg border hover-scale">
                  <TrendingDown className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <div className="font-bold text-2xl">-350€</div>
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
                  Pourquoi nous choisir pour votre assurance habitation ?
                </h3>
                <ul className="space-y-3">
                  {[
                    '✅ 100% gratuit et sans engagement',
                    '🏠 Comparaison de 30+ assureurs (Macif, Maif, GMF...)',
                    '⚡ Expert dédié qui vous rappelle sous 2h',
                    '💰 Économies garanties ou remboursé',
                    '📞 Service client 5⭐ disponible 7j/7',
                    '🔒 Appartement, maison, locataire ou propriétaire',
                  ].map((benefit, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-sm">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              {/* Testimonials */}
              <div className="space-y-4">
                <h3 className="font-bold text-lg">🌟 Avis clients assurance habitation :</h3>
                {[
                  {
                    name: 'Thomas P.',
                    location: 'Bordeaux',
                    text: 'J\'ai économisé 280€ sur mon assurance habitation ! Mêmes garanties mais beaucoup moins cher.',
                    rating: 5,
                  },
                  {
                    name: 'Isabelle M.',
                    location: 'Nantes',
                    text: 'Service rapide et efficace. Mon conseiller a trouvé une assurance propriétaire 30% moins chère.',
                    rating: 5,
                  },
                  {
                    name: 'Pierre D.',
                    location: 'Lille',
                    text: 'Simple, rapide et vraiment gratuit. Je recommande pour tous les locataires !',
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
                insuranceType="habitation"
                insuranceLabel="Assurance Habitation"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LandingHabitation;
