import SEOOptimized from '@/components/SEOOptimized';
import { SimplifiedLeadForm } from '@/components/landing/SimplifiedLeadForm';
import { Trees, Shield, Users, CheckCircle2, Star, Clock, Award, AlertTriangle } from 'lucide-react';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useEffect } from 'react';

const LandingAccrobranche = () => {
  const { trackPageView } = useAnalytics();

  useEffect(() => {
    trackPageView('/landing/accrobranche', 'Landing Page Assurance Parc Accrobranche');
  }, [trackPageView]);

  return (
    <>
      <SEOOptimized
        title="Assurance Parc Accrobranche & Loisirs Aventure"
        description="Couverture sur-mesure pour parcs accrobranche, tyroliennes et loisirs aventure. 20 assureurs spécialisés. Rappel sous 30 minutes."
        keyword="assurance parc accrobranche"
        keywords="assurance tyrolienne, assurance loisirs aventure, RC parc aventure, norme EN 15567"
        noindex={true}
      />

      <div className="min-h-screen bg-gradient-to-b from-background to-accent/5">
        <div className="bg-primary text-primary-foreground py-3 px-4 text-center font-semibold">
          <Clock className="inline h-4 w-4 mr-2" />
          🌲 Spécialiste loisirs aventure : 20 assureurs de niche mobilisés sous 30 minutes
        </div>

        <section className="container mx-auto px-4 py-12 md:py-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-accent px-4 py-2 rounded-full">
                <Award className="h-4 w-4" />
                <span className="text-sm font-semibold">Courtier expert métiers atypiques</span>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Assurance{' '}
                <span className="text-primary">Parc Accrobranche</span>
              </h1>

              <p className="text-xl text-muted-foreground">
                <strong>RC exploitant, individuelle accident participants, matériel & EPI.</strong>{' '}
                Étude personnalisée auprès de nos 20 assureurs spécialisés activités à risques.
              </p>

              <div className="flex items-center gap-4 pt-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full bg-accent border-2 border-background flex items-center justify-center"
                    >
                      <Trees className="h-5 w-5 text-primary" />
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
                    <strong>180+</strong> exploitants accompagnés
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="text-sm font-medium">Norme EN 15567</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="text-sm font-medium">20 assureurs</span>
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
                insuranceLabel="Parc Accrobranche"
              />
            </div>
          </div>
        </section>

        <section className="bg-accent/10 py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Garanties indispensables pour un parc aventure
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-card p-6 rounded-lg shadow-lg">
                <Shield className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-3">RC exploitant</h3>
                <p className="text-muted-foreground">
                  Dommages corporels et matériels causés aux grimpeurs (chutes, blocages tyrolienne, défaut d'équipement).
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg shadow-lg">
                <Users className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-3">Individuelle accident</h3>
                <p className="text-muted-foreground">
                  Indemnisation directe des participants même sans tiers responsable. Argument commercial fort.
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg shadow-lg">
                <AlertTriangle className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-3">Matériel & EPI</h3>
                <p className="text-muted-foreground">
                  Plateformes, lignes de vie, baudriers, mousquetons : remplacement et contrôles ECP couverts.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="bg-primary text-primary-foreground rounded-2xl p-12">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                Pourquoi un courtier spécialisé ?
              </h2>
              <div className="grid md:grid-cols-4 gap-8 text-center">
                <div>
                  <Trees className="h-12 w-12 mx-auto mb-4" />
                  <div className="text-xl font-bold mb-2">20 assureurs</div>
                  <div className="text-sm opacity-90">Niche aventure & risques aggravés</div>
                </div>
                <div>
                  <Award className="h-12 w-12 mx-auto mb-4" />
                  <div className="text-xl font-bold mb-2">Sur-mesure</div>
                  <div className="text-sm opacity-90">Selon tyroliennes, parcours, fréquentation</div>
                </div>
                <div>
                  <Clock className="h-12 w-12 mx-auto mb-4" />
                  <div className="text-xl font-bold mb-2">Rappel 30 min</div>
                  <div className="text-sm opacity-90">Étude argumentée par un expert</div>
                </div>
                <div>
                  <CheckCircle2 className="h-12 w-12 mx-auto mb-4" />
                  <div className="text-xl font-bold mb-2">0 refus</div>
                  <div className="text-sm opacity-90">Solution même pour gros parcs</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-accent/10">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Témoignages d'exploitants
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-card p-6 rounded-lg shadow-md">
                <div className="flex gap-0.5 mb-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "Mon assureur historique a refusé de renouveler après un sinistre. Solution trouvée en 3 jours, prime même légèrement baissée."
                </p>
                <p className="font-semibold">Thierry M., Parc Aventure Ardèche</p>
              </div>
              <div className="bg-card p-6 rounded-lg shadow-md">
                <div className="flex gap-0.5 mb-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "Ouverture de mon 2ᵉ parc : montage du contrat avant l'inauguration. Conformité norme EN 15567 vérifiée."
                </p>
                <p className="font-semibold">Sophie R., Cimes & Forêts Vosges</p>
              </div>
              <div className="bg-card p-6 rounded-lg shadow-md">
                <div className="flex gap-0.5 mb-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "Tarif divisé par 1,8 vs mon contrat précédent, garanties élargies aux animations team-building."
                </p>
                <p className="font-semibold">Karim D., Aventure Pyrénées</p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-primary text-primary-foreground py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Sécurisez votre parc dès aujourd'hui
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Étude gratuite et personnalisée — rappel sous 30 minutes
            </p>
            <a
              href="#hero"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-block bg-background text-foreground px-8 py-4 rounded-lg font-bold text-lg hover:opacity-90 transition-opacity"
            >
              🌲 Demander mon étude personnalisée
            </a>
          </div>
        </section>
      </div>
    </>
  );
};

export default LandingAccrobranche;
