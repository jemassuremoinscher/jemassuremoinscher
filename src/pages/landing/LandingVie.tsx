import SEO from '@/components/SEO';
import { SimplifiedLeadForm } from '@/components/landing/SimplifiedLeadForm';
import { Shield, TrendingUp, Users, CheckCircle2, Star, Clock, Award, PiggyBank } from 'lucide-react';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useEffect } from 'react';

const LandingVie = () => {
  const { trackPageView } = useAnalytics();

  useEffect(() => {
    trackPageView('/landing/vie', 'Landing Page Assurance Vie');
  }, [trackPageView]);

  return (
    <>
      <SEO
        title="Assurance Vie 2025 | Placements dès 50€/mois"
        description="Comparez les meilleures assurances vie. Jusqu'à 3% de rendement garanti. Fiscalité avantageuse. Devis personnalisé gratuit en 2 minutes."
        keywords="assurance vie, placement, épargne, succession, fiscalité"
        canonical="/landing/vie"
      />

      <div className="min-h-screen bg-gradient-to-b from-background to-accent/5">
        <div className="bg-primary text-primary-foreground py-3 px-4 text-center font-semibold animate-pulse">
          <Clock className="inline h-4 w-4 mr-2" />
          🎁 Offre de Bienvenue : 150€ offerts pour toute ouverture avant fin du mois
        </div>

        <section className="container mx-auto px-4 py-12 md:py-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-accent px-4 py-2 rounded-full">
                <Award className="h-4 w-4" />
                <span className="text-sm font-semibold">Meilleurs rendements 2025 certifiés</span>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Faites fructifier votre épargne dès{' '}
                <span className="text-primary">50€/mois</span>
              </h1>

              <p className="text-xl text-muted-foreground">
                Jusqu'à <strong>3% de rendement garanti</strong> + fiscalité avantageuse.
                Comparez 20+ contrats d'assurance vie en 2 minutes.
              </p>

              <div className="flex items-center gap-4 pt-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full bg-accent border-2 border-background flex items-center justify-center"
                    >
                      <PiggyBank className="h-5 w-5 text-primary" />
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
                    <strong>24 156</strong> épargnants nous font confiance
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="text-sm font-medium">100% gratuit</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="text-sm font-medium">Sans engagement</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="text-sm font-medium">Expert dédié</span>
                </div>
              </div>
            </div>

            <div>
              <SimplifiedLeadForm
                insuranceType="vie"
                insuranceLabel="Vie"
              />
            </div>
          </div>
        </section>

        <section className="bg-accent/10 py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Pourquoi choisir l'assurance vie ?
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-card p-6 rounded-lg shadow-lg">
                <TrendingUp className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-3">Meilleurs rendements</h3>
                <p className="text-muted-foreground">
                  Jusqu'à 3% de rendement garanti + performance des marchés financiers.
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg shadow-lg">
                <Shield className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-3">Fiscalité avantageuse</h3>
                <p className="text-muted-foreground">
                  Abattement fiscal après 8 ans. Optimisez votre succession facilement.
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg shadow-lg">
                <Users className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-3">Protection famille</h3>
                <p className="text-muted-foreground">
                  Protégez vos proches et transmettez votre patrimoine en toute sérénité.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Ils ont fait confiance à nos experts
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-card p-6 rounded-lg shadow-md">
                <div className="flex gap-0.5 mb-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "J'ai doublé mon épargne en 5 ans. Le conseiller m'a trouvé le meilleur contrat adapté à mon profil."
                </p>
                <p className="font-semibold">Antoine R., Paris</p>
              </div>
              <div className="bg-card p-6 rounded-lg shadow-md">
                <div className="flex gap-0.5 mb-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "Grâce à l'assurance vie, j'ai pu financer les études de mes enfants tout en optimisant mes impôts."
                </p>
                <p className="font-semibold">Claire M., Lyon</p>
              </div>
              <div className="bg-card p-6 rounded-lg shadow-md">
                <div className="flex gap-0.5 mb-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "Processus ultra simple et accompagnement personnalisé. Je recommande à 100% !"
                </p>
                <p className="font-semibold">David L., Marseille</p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-primary text-primary-foreground py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Prêt à faire fructifier votre épargne ?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Obtenez votre simulation personnalisée en 2 minutes
            </p>
            <a
              href="#hero"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-block bg-background text-foreground px-8 py-4 rounded-lg font-bold text-lg hover:opacity-90 transition-opacity"
            >
              💰 Simuler mon placement
            </a>
          </div>
        </section>
      </div>
    </>
  );
};

export default LandingVie;
