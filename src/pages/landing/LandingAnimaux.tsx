import SEO from '@/components/SEO';
import { SimplifiedLeadForm } from '@/components/landing/SimplifiedLeadForm';
import { Shield, Heart, Stethoscope, CheckCircle2, Star, TrendingDown, Clock, Award } from 'lucide-react';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useEffect } from 'react';

const LandingAnimaux = () => {
  const { trackPageView } = useAnalytics();

  useEffect(() => {
    trackPageView('/landing/animaux', 'Landing Page Assurance Animaux');
  }, [trackPageView]);

  return (
    <>
      <SEO
        title="Assurance Animaux dès 8€/mois | Comparateur 2025"
        description="Comparez gratuitement les meilleures assurances pour chiens et chats. Remboursement jusqu'à 100% des frais vétérinaires. Devis en 30 secondes."
        keywords="assurance animaux, assurance chien, assurance chat, mutuelle animaux"
        canonical="/landing/animaux"
      />

      <div className="min-h-screen bg-gradient-to-b from-background to-accent/5">
        {/* Urgency Bar */}
        <div className="bg-primary text-primary-foreground py-3 px-4 text-center font-semibold animate-pulse">
          <Clock className="inline h-4 w-4 mr-2" />
          🔥 Offre Limitée : -30% sur votre première année • Encore 24h
        </div>

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-12 md:py-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-accent px-4 py-2 rounded-full">
                <Award className="h-4 w-4" />
                <span className="text-sm font-semibold">N°1 des comparateurs d'assurance animaux</span>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Protégez votre animal dès{' '}
                <span className="text-primary">8€/mois</span>
              </h1>

              <p className="text-xl text-muted-foreground">
                Remboursement jusqu'à <strong>100% des frais vétérinaires</strong>.
                Comparez gratuitement 15+ assureurs en 30 secondes.
              </p>

              {/* Social Proof */}
              <div className="flex items-center gap-4 pt-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full bg-accent border-2 border-background flex items-center justify-center"
                    >
                      <Heart className="h-5 w-5 text-primary" />
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    <strong>12 847</strong> propriétaires satisfaits
                  </p>
                </div>
              </div>

              {/* Key Benefits */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="text-sm font-medium">Sans engagement</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="text-sm font-medium">100% gratuit</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="text-sm font-medium">Réponse sous 2h</span>
                </div>
              </div>
            </div>

            <div>
              <SimplifiedLeadForm
                insuranceType="animaux"
                insuranceLabel="Animaux"
              />
            </div>
          </div>
        </section>

        {/* Why Choose Section */}
        <section className="bg-accent/10 py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Pourquoi assurer votre animal ?
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-card p-6 rounded-lg shadow-lg">
                <Shield className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-3">Couverture complète</h3>
                <p className="text-muted-foreground">
                  Accidents, maladies, chirurgie, hospitalisations. Votre animal protégé à 100%.
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg shadow-lg">
                <TrendingDown className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-3">Économies garanties</h3>
                <p className="text-muted-foreground">
                  Jusqu'à 400€ d'économies par an sur vos frais vétérinaires.
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg shadow-lg">
                <Stethoscope className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-3">Vétérinaire libre</h3>
                <p className="text-muted-foreground">
                  Consultez le vétérinaire de votre choix partout en France.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Ils nous font confiance
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-card p-6 rounded-lg shadow-md">
                <div className="flex gap-0.5 mb-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "Mon chien a eu un accident grave. J'ai été remboursée à 90% en 3 jours. Un vrai soulagement !"
                </p>
                <p className="font-semibold">Sophie M., Paris</p>
              </div>
              <div className="bg-card p-6 rounded-lg shadow-md">
                <div className="flex gap-0.5 mb-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "Avec le comparateur, j'ai trouvé une assurance 40% moins chère pour mon chat. Merci !"
                </p>
                <p className="font-semibold">Thomas D., Lyon</p>
              </div>
              <div className="bg-card p-6 rounded-lg shadow-md">
                <div className="flex gap-0.5 mb-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "Une souscription ultra simple et un service client hyper réactif. Je recommande à 100% !"
                </p>
                <p className="font-semibold">Marie L., Bordeaux</p>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="bg-primary text-primary-foreground py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Prêt à protéger votre compagnon ?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Obtenez votre devis gratuit en 30 secondes
            </p>
            <a
              href="#hero"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-block bg-background text-foreground px-8 py-4 rounded-lg font-bold text-lg hover:opacity-90 transition-opacity"
            >
              🎯 Obtenir mon devis gratuit
            </a>
          </div>
        </section>
      </div>
    </>
  );
};

export default LandingAnimaux;
