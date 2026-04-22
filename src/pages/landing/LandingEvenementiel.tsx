import SEOOptimized from '@/components/SEOOptimized';
import { SimplifiedLeadForm } from '@/components/landing/SimplifiedLeadForm';
import { PartyPopper, Shield, Music, CheckCircle2, Star, Clock, Award, Umbrella } from 'lucide-react';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useEffect } from 'react';

const LandingEvenementiel = () => {
  const { trackPageView } = useAnalytics();

  useEffect(() => {
    trackPageView('/landing/evenementiel', 'Landing Page Assurance Organisateur Événementiel');
  }, [trackPageView]);

  return (
    <>
      <SEOOptimized
        title="Assurance Organisateur d'Événement & Festival"
        description="RC organisateur, annulation événement, dommages matériel scénique. Festivals, concerts, courses, salons. 20 assureurs."
        keyword="assurance organisateur événement"
        keywords="assurance festival, RC organisateur, assurance annulation concert, assurance course pédestre"
        noindex={true}
      />

      <div className="min-h-screen bg-gradient-to-b from-background to-accent/5">
        <div className="bg-primary text-primary-foreground py-3 px-4 text-center font-semibold">
          <Clock className="inline h-4 w-4 mr-2" />
          🎉 Spécialiste événementiel : étude complète sous 30 minutes
        </div>

        <section className="container mx-auto px-4 py-12 md:py-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-accent px-4 py-2 rounded-full">
                <Award className="h-4 w-4" />
                <span className="text-sm font-semibold">Courtier expert événementiel</span>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Assurance{' '}
                <span className="text-primary">Organisateur d'Événement</span>
              </h1>

              <p className="text-xl text-muted-foreground">
                <strong>Festivals, concerts, courses, salons pro, événements sportifs.</strong>{' '}
                RC organisateur + annulation intempéries/force majeure. Couverture ponctuelle ou annuelle.
              </p>

              <div className="flex items-center gap-4 pt-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full bg-accent border-2 border-background flex items-center justify-center"
                    >
                      <PartyPopper className="h-5 w-5 text-primary" />
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
                    <strong>320+</strong> événements assurés en 2025
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="text-sm font-medium">Annulation incluse</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="text-sm font-medium">5K à 100K pers.</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="text-sm font-medium">Rappel 30 min</span>
                </div>
              </div>
            </div>

            <div>
              <SimplifiedLeadForm
                insuranceType="metiers_atypiques"
                insuranceLabel="Organisateur d'Événement"
              />
            </div>
          </div>
        </section>

        <section className="bg-accent/10 py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Garanties clés pour votre événement
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-card p-6 rounded-lg shadow-lg">
                <Shield className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-3">RC organisateur</h3>
                <p className="text-muted-foreground">
                  Dommages aux spectateurs, riverains, prestataires. Obligation légale dès 1 entrée payante.
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg shadow-lg">
                <Umbrella className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-3">Annulation événement</h3>
                <p className="text-muted-foreground">
                  Intempéries, défaillance artiste, force majeure : remboursement des engagements et perte de billetterie.
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg shadow-lg">
                <Music className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-3">Matériel scénique</h3>
                <p className="text-muted-foreground">
                  Son, lumière, structures, chapiteaux, vidéo : couverture vol, casse, transport.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="bg-primary text-primary-foreground rounded-2xl p-12">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                Pourquoi nous choisir ?
              </h2>
              <div className="grid md:grid-cols-4 gap-8 text-center">
                <div>
                  <PartyPopper className="h-12 w-12 mx-auto mb-4" />
                  <div className="text-xl font-bold mb-2">20 assureurs</div>
                  <div className="text-sm opacity-90">Albingia, Hiscox, Circles…</div>
                </div>
                <div>
                  <Award className="h-12 w-12 mx-auto mb-4" />
                  <div className="text-xl font-bold mb-2">Tous formats</div>
                  <div className="text-sm opacity-90">Festival, course, salon, gala</div>
                </div>
                <div>
                  <Clock className="h-12 w-12 mx-auto mb-4" />
                  <div className="text-xl font-bold mb-2">Rappel 30 min</div>
                  <div className="text-sm opacity-90">Étude complète chiffrée</div>
                </div>
                <div>
                  <CheckCircle2 className="h-12 w-12 mx-auto mb-4" />
                  <div className="text-xl font-bold mb-2">Bénévoles OK</div>
                  <div className="text-sm opacity-90">Individuelle accident incluse</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-accent/10">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Témoignages d'organisateurs
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-card p-6 rounded-lg shadow-md">
                <div className="flex gap-0.5 mb-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "Festival annulé pour vigilance orange : 280 K€ remboursés grâce à la garantie annulation. Vital."
                </p>
                <p className="font-semibold">Élise V., Festival Bretagne</p>
              </div>
              <div className="bg-card p-6 rounded-lg shadow-md">
                <div className="flex gap-0.5 mb-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "Trail montagne 4 000 coureurs : RC + bénévoles + matériel signalétique. Tout en un seul contrat clair."
                </p>
                <p className="font-semibold">Romain L., Trail des Pyrénées</p>
              </div>
              <div className="bg-card p-6 rounded-lg shadow-md">
                <div className="flex gap-0.5 mb-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "Salon pro 12 000 visiteurs Porte de Versailles : couverture montée/démontée + exposants. Impeccable."
                </p>
                <p className="font-semibold">Nadia B., Salon Innovation Paris</p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-primary text-primary-foreground py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Sécurisez votre événement maintenant
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Étude gratuite — rappel d'un expert sous 30 minutes
            </p>
            <a
              href="#hero"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-block bg-background text-foreground px-8 py-4 rounded-lg font-bold text-lg hover:opacity-90 transition-opacity"
            >
              🎉 Demander mon étude personnalisée
            </a>
          </div>
        </section>
      </div>
    </>
  );
};

export default LandingEvenementiel;
