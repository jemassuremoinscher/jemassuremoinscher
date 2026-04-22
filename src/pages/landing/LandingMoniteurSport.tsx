import SEOOptimized from '@/components/SEOOptimized';
import { SimplifiedLeadForm } from '@/components/landing/SimplifiedLeadForm';
import { Mountain, Shield, Users, CheckCircle2, Star, Clock, Award, Activity } from 'lucide-react';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useEffect } from 'react';

const LandingMoniteurSport = () => {
  const { trackPageView } = useAnalytics();

  useEffect(() => {
    trackPageView('/landing/moniteur-sport', 'Landing Page Assurance Moniteur Sports Outdoor');
  }, [trackPageView]);

  return (
    <>
      <SEOOptimized
        title="Assurance Moniteur Sports Outdoor"
        description="RC Pro pour moniteurs escalade, kayak, parapente, VTT. Carte pro & attestation annuelle. 20 assureurs spécialisés."
        keyword="assurance moniteur sport"
        keywords="RC pro moniteur, assurance guide montagne, encadrant sportif, BPJEPS DEJEPS"
        noindex={true}
      />

      <div className="min-h-screen bg-gradient-to-b from-background to-accent/5">
        <div className="bg-primary text-primary-foreground py-3 px-4 text-center font-semibold">
          <Clock className="inline h-4 w-4 mr-2" />
          🏔️ Spécialiste encadrants outdoor : devis & attestation sous 48h
        </div>

        <section className="container mx-auto px-4 py-12 md:py-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-accent px-4 py-2 rounded-full">
                <Award className="h-4 w-4" />
                <span className="text-sm font-semibold">Courtier expert sports outdoor</span>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Assurance{' '}
                <span className="text-primary">Moniteur Sport</span>
              </h1>

              <p className="text-xl text-muted-foreground">
                <strong>Escalade, canyoning, kayak, parapente, VTT enduro.</strong>{' '}
                RC Pro conforme Code du sport (L.321-1) — solo, structure ou multi-activités.
              </p>

              <div className="flex items-center gap-4 pt-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full bg-accent border-2 border-background flex items-center justify-center"
                    >
                      <Mountain className="h-5 w-5 text-primary" />
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
                    <strong>950+</strong> moniteurs assurés
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="text-sm font-medium">Toutes disciplines</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="text-sm font-medium">Carte pro OK</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="text-sm font-medium">Rappel 48h</span>
                </div>
              </div>
            </div>

            <div>
              <SimplifiedLeadForm
                insuranceType="metiers_atypiques"
                insuranceLabel="Moniteur Sport Outdoor"
              />
            </div>
          </div>
        </section>

        <section className="bg-accent/10 py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Couverture adaptée à votre discipline
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-card p-6 rounded-lg shadow-lg">
                <Mountain className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-3">Montagne & escalade</h3>
                <p className="text-muted-foreground">
                  Guides, BE escalade, encadrement SAE/SNE, via ferrata, alpinisme. Couverture territoire France + Europe.
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg shadow-lg">
                <Activity className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-3">Eau-vive & nautisme</h3>
                <p className="text-muted-foreground">
                  Canyoning, kayak, paddle, rafting. Garanties spécifiques pour matériel et participants.
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg shadow-lg">
                <Shield className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-3">Aérien & roulant</h3>
                <p className="text-muted-foreground">
                  Parapente biplace, VTT enduro/DH, trottinette tout-terrain. Disciplines à risque aggravé.
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
                  <Mountain className="h-12 w-12 mx-auto mb-4" />
                  <div className="text-xl font-bold mb-2">20 assureurs</div>
                  <div className="text-sm opacity-90">Spécialistes encadrement sportif</div>
                </div>
                <div>
                  <Award className="h-12 w-12 mx-auto mb-4" />
                  <div className="text-xl font-bold mb-2">Multi-diplômes</div>
                  <div className="text-sm opacity-90">BPJEPS, DEJEPS, BE, brevet d'État</div>
                </div>
                <div>
                  <Clock className="h-12 w-12 mx-auto mb-4" />
                  <div className="text-xl font-bold mb-2">Rappel 48h</div>
                  <div className="text-sm opacity-90">Attestation conforme L.321-1</div>
                </div>
                <div>
                  <CheckCircle2 className="h-12 w-12 mx-auto mb-4" />
                  <div className="text-xl font-bold mb-2">Saisonnier OK</div>
                  <div className="text-sm opacity-90">Contrats annuels ou périodes</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-accent/10">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Témoignages de moniteurs
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-card p-6 rounded-lg shadow-md">
                <div className="flex gap-0.5 mb-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "Refusé partout en multi-activités (escalade + canyon + VTT). Solution unique trouvée, économie de 420 €/an."
                </p>
                <p className="font-semibold">Lucas P., BE Escalade Chamonix</p>
              </div>
              <div className="bg-card p-6 rounded-lg shadow-md">
                <div className="flex gap-0.5 mb-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "Attestation reçue en 2 jours pour ma carte pro saisonnière. Service au top."
                </p>
                <p className="font-semibold">Marine T., Guide Canyon Verdon</p>
              </div>
              <div className="bg-card p-6 rounded-lg shadow-md">
                <div className="flex gap-0.5 mb-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "Pilote parapente biplace : tarif RC enfin raisonnable. Couverture territoriale Europe incluse."
                </p>
                <p className="font-semibold">Antoine F., Parapente Annecy</p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-primary text-primary-foreground py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Encadrez en toute sécurité juridique
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Étude gratuite — rappel d'un expert sous 48h
            </p>
            <a
              href="#hero"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-block bg-background text-foreground px-8 py-4 rounded-lg font-bold text-lg hover:opacity-90 transition-opacity"
            >
              🏔️ Demander mon étude personnalisée
            </a>
          </div>
        </section>
      </div>
    </>
  );
};

export default LandingMoniteurSport;
