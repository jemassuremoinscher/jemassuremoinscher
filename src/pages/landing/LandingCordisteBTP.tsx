import SEOOptimized from '@/components/SEOOptimized';
import { SimplifiedLeadForm } from '@/components/landing/SimplifiedLeadForm';
import { HardHat, Shield, Wrench, CheckCircle2, Star, Clock, Award, ArrowUpToLine } from 'lucide-react';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useEffect } from 'react';

const LandingCordisteBTP = () => {
  const { trackPageView } = useAnalytics();

  useEffect(() => {
    trackPageView('/landing/cordiste-btp', 'Landing Page Assurance Cordiste & BTP Spécialisé');
  }, [trackPageView]);

  return (
    <>
      <SEOOptimized
        title="Assurance Cordiste & BTP Travaux en Hauteur"
        description="RC Pro & décennale pour cordistes, IRATA, travaux acrobatiques, désamiantage. 20 assureurs métiers à risques aggravés."
        keyword="assurance cordiste"
        keywords="assurance travaux en hauteur, RC pro cordiste IRATA, assurance désamiantage, BTP risques aggravés"
        noindex={true}
      />

      <div className="min-h-screen bg-gradient-to-b from-background to-accent/5">
        <div className="bg-primary text-primary-foreground py-3 px-4 text-center font-semibold">
          <Clock className="inline h-4 w-4 mr-2" />
          🪢 Spécialiste BTP risques aggravés : étude argumentée sous 30 minutes
        </div>

        <section className="container mx-auto px-4 py-12 md:py-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-accent px-4 py-2 rounded-full">
                <Award className="h-4 w-4" />
                <span className="text-sm font-semibold">Courtier expert BTP spécialisé</span>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Assurance{' '}
                <span className="text-primary">Cordiste & BTP Hauteur</span>
              </h1>

              <p className="text-xl text-muted-foreground">
                <strong>IRATA, travaux acrobatiques, désamiantage, élagage, démolition.</strong>{' '}
                RC Pro + décennale conformes pour les métiers refusés par les assureurs classiques.
              </p>

              <div className="flex items-center gap-4 pt-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full bg-accent border-2 border-background flex items-center justify-center"
                    >
                      <HardHat className="h-5 w-5 text-primary" />
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
                    <strong>410+</strong> entreprises BTP spécialisées assurées
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="text-sm font-medium">Décennale incl.</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="text-sm font-medium">IRATA / CQP</span>
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
                insuranceLabel="Cordiste & BTP Hauteur"
              />
            </div>
          </div>
        </section>

        <section className="bg-accent/10 py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Garanties pour les métiers à risques aggravés
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-card p-6 rounded-lg shadow-lg">
                <Shield className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-3">RC Pro hauteur</h3>
                <p className="text-muted-foreground">
                  Dommages causés aux tiers, copropriétés, ouvrages voisins lors d'interventions verticales.
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg shadow-lg">
                <ArrowUpToLine className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-3">Décennale spécifique</h3>
                <p className="text-muted-foreground">
                  Étanchéité, ravalement acrobatique, charpente : décennale conforme aux normes BTP avec mention hauteur.
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg shadow-lg">
                <Wrench className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-3">Matériel & EPI</h3>
                <p className="text-muted-foreground">
                  Cordes, harnais, descendeurs, bloqueurs, nacelles : couverture vol, dégradation, transport chantier.
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
                  <HardHat className="h-12 w-12 mx-auto mb-4" />
                  <div className="text-xl font-bold mb-2">20 assureurs</div>
                  <div className="text-sm opacity-90">Niche BTP risques aggravés</div>
                </div>
                <div>
                  <Award className="h-12 w-12 mx-auto mb-4" />
                  <div className="text-xl font-bold mb-2">Multi-activités</div>
                  <div className="text-sm opacity-90">Cordiste + élagage + démolition</div>
                </div>
                <div>
                  <Clock className="h-12 w-12 mx-auto mb-4" />
                  <div className="text-xl font-bold mb-2">Rappel 30 min</div>
                  <div className="text-sm opacity-90">Étude argumentée chiffrée</div>
                </div>
                <div>
                  <CheckCircle2 className="h-12 w-12 mx-auto mb-4" />
                  <div className="text-xl font-bold mb-2">0 refus</div>
                  <div className="text-sm opacity-90">Solution même après sinistre</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-accent/10">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Témoignages d'entreprises BTP
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-card p-6 rounded-lg shadow-md">
                <div className="flex gap-0.5 mb-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "Travaux acro IRATA niveau 3 : 4 assureurs avaient refusé. Solution complète RC + décennale en 4 jours."
                </p>
                <p className="font-semibold">Julien M., Acro Façade Lyon</p>
              </div>
              <div className="bg-card p-6 rounded-lg shadow-md">
                <div className="flex gap-0.5 mb-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "Désamiantage + démolition : tarif divisé par 1,4 vs ancien contrat, plafonds doublés."
                </p>
                <p className="font-semibold">Catherine D., Démol' Pro Marseille</p>
              </div>
              <div className="bg-card p-6 rounded-lg shadow-md">
                <div className="flex gap-0.5 mb-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "Élagage acro grands arbres : couverture spécifique tronçonneuse + dommages voisinage. Top."
                </p>
                <p className="font-semibold">Pierre G., Élagage 33 Bordeaux</p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-primary text-primary-foreground py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Sécurisez votre activité dès maintenant
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
              🪢 Demander mon étude personnalisée
            </a>
          </div>
        </section>
      </div>
    </>
  );
};

export default LandingCordisteBTP;
