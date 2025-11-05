import SEO from '@/components/SEO';
import { SimplifiedLeadForm } from '@/components/landing/SimplifiedLeadForm';
import { Shield, TrendingDown, FileCheck, CheckCircle2, Star, Clock, Award, Home } from 'lucide-react';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useEffect } from 'react';

const LandingPret = () => {
  const { trackPageView } = useAnalytics();

  useEffect(() => {
    trackPageView('/landing/pret', 'Landing Page Assurance Prêt');
  }, [trackPageView]);

  return (
    <>
      <SEO
        title="Assurance Prêt Immobilier -60% | Comparateur 2025"
        description="Économisez jusqu'à 60% sur votre assurance emprunteur. Délégation d'assurance simplifiée. Devis gratuit en 2 minutes."
        keywords="assurance prêt immobilier, assurance emprunteur, délégation assurance, ADI"
        canonical="/landing/pret"
      />

      <div className="min-h-screen bg-gradient-to-b from-background to-accent/5">
        {/* Urgency Bar */}
        <div className="bg-primary text-primary-foreground py-3 px-4 text-center font-semibold animate-pulse">
          <Clock className="inline h-4 w-4 mr-2" />
          🔥 Offre Spéciale : Économisez jusqu'à 15 000€ sur votre crédit • Simulez maintenant
        </div>

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-12 md:py-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-accent px-4 py-2 rounded-full">
                <Award className="h-4 w-4" />
                <span className="text-sm font-semibold">Expert en délégation d'assurance depuis 2015</span>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Divisez par 2 votre assurance emprunteur
              </h1>

              <p className="text-xl text-muted-foreground">
                Économisez jusqu'à <strong>15 000€</strong> sur la durée de votre prêt.
                Changez d'assurance en <strong>48h</strong> sans frais bancaires.
              </p>

              {/* Social Proof */}
              <div className="flex items-center gap-4 pt-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full bg-accent border-2 border-background flex items-center justify-center"
                    >
                      <Home className="h-5 w-5 text-primary" />
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
                    <strong>8 432</strong> emprunteurs ont économisé
                  </p>
                </div>
              </div>

              {/* Key Benefits */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="text-sm font-medium">Sans frais</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="text-sm font-medium">Sans engagement</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="text-sm font-medium">Réponse en 2h</span>
                </div>
              </div>
            </div>

            <div>
              <SimplifiedLeadForm
                insuranceType="pret"
                insuranceLabel="Prêt Immobilier"
              />
            </div>
          </div>
        </section>

        {/* Why Change Section */}
        <section className="bg-accent/10 py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Pourquoi changer votre assurance emprunteur ?
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-card p-6 rounded-lg shadow-lg">
                <TrendingDown className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-3">Économies massives</h3>
                <p className="text-muted-foreground">
                  Réduisez votre cotisation de 40% à 60% par rapport aux banques traditionnelles.
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg shadow-lg">
                <FileCheck className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-3">Loi Lemoine 2022</h3>
                <p className="text-muted-foreground">
                  Changez d'assurance à tout moment sans frais grâce à la nouvelle réglementation.
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg shadow-lg">
                <Shield className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-3">Mêmes garanties</h3>
                <p className="text-muted-foreground">
                  Des garanties équivalentes ou supérieures à celles de votre banque.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="bg-primary text-primary-foreground rounded-2xl p-12">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                Nos chiffres parlent d'eux-mêmes
              </h2>
              <div className="grid md:grid-cols-4 gap-8 text-center">
                <div>
                  <div className="text-5xl font-bold mb-2">60%</div>
                  <div className="text-lg opacity-90">d'économies moyennes</div>
                </div>
                <div>
                  <div className="text-5xl font-bold mb-2">48h</div>
                  <div className="text-lg opacity-90">pour changer</div>
                </div>
                <div>
                  <div className="text-5xl font-bold mb-2">15 000€</div>
                  <div className="text-lg opacity-90">économisés en moyenne</div>
                </div>
                <div>
                  <div className="text-5xl font-bold mb-2">98%</div>
                  <div className="text-lg opacity-90">de clients satisfaits</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 bg-accent/10">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Témoignages de nos clients
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-card p-6 rounded-lg shadow-md">
                <div className="flex gap-0.5 mb-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "J'ai économisé 8 500€ sur mon crédit de 200 000€. Changement effectué en 3 jours !"
                </p>
                <p className="font-semibold">Marc D., Toulouse</p>
              </div>
              <div className="bg-card p-6 rounded-lg shadow-md">
                <div className="flex gap-0.5 mb-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "Procédure ultra simple ! Ma banque a accepté la délégation sans problème."
                </p>
                <p className="font-semibold">Julie B., Nantes</p>
              </div>
              <div className="bg-card p-6 rounded-lg shadow-md">
                <div className="flex gap-0.5 mb-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "Des garanties meilleures que ma banque pour 50% moins cher. Incroyable !"
                </p>
                <p className="font-semibold">Pierre M., Marseille</p>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="bg-primary text-primary-foreground py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Calculez vos économies en 2 minutes
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Gratuit, sans engagement et 100% en ligne
            </p>
            <a
              href="#hero"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-block bg-background text-foreground px-8 py-4 rounded-lg font-bold text-lg hover:opacity-90 transition-opacity"
            >
              💰 Calculer mes économies
            </a>
          </div>
        </section>
      </div>
    </>
  );
};

export default LandingPret;
