import SEO from '@/components/SEO';
import { SimplifiedLeadForm } from '@/components/landing/SimplifiedLeadForm';
import { Shield, Briefcase, Building, CheckCircle2, Star, Clock, Award, Zap } from 'lucide-react';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useEffect } from 'react';

const LandingMRP = () => {
  const { trackPageView } = useAnalytics();

  useEffect(() => {
    trackPageView('/landing/mrp', 'Landing Page Assurance MRP');
  }, [trackPageView]);

  return (
    <>
      <SEO
        title="Assurance MRP (Multirisque Pro) dès 25€/mois | Protection Entreprise 2025"
        description="Protégez votre local, matériel et activité professionnelle. Couverture complète tous risques. Devis gratuit en 2 minutes."
        keywords="assurance mrp, multirisque professionnelle, protection entreprise, local professionnel"
        canonical="/landing/mrp"
      />

      <div className="min-h-screen bg-gradient-to-b from-background to-accent/5">
        <div className="bg-primary text-primary-foreground py-3 px-4 text-center font-semibold animate-pulse">
          <Clock className="inline h-4 w-4 mr-2" />
          💼 Offre Entreprises : 3 mois offerts + audit sécurité gratuit
        </div>

        <section className="container mx-auto px-4 py-12 md:py-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-accent px-4 py-2 rounded-full">
                <Award className="h-4 w-4" />
                <span className="text-sm font-semibold">Expert en assurance professionnelle</span>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                MRP dès{' '}
                <span className="text-primary">25€/mois</span>
              </h1>

              <p className="text-xl text-muted-foreground">
                <strong>Protection complète tous risques</strong> : local, matériel, stocks, pertes d'exploitation.
                Formules sur-mesure pour votre activité.
              </p>

              <div className="flex items-center gap-4 pt-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full bg-accent border-2 border-background flex items-center justify-center"
                    >
                      <Building className="h-5 w-5 text-primary" />
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
                    <strong>12 847</strong> entreprises protégées
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="text-sm font-medium">Tous secteurs</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="text-sm font-medium">Sur-mesure</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="text-sm font-medium">Devis en 2min</span>
                </div>
              </div>
            </div>

            <div>
              <SimplifiedLeadForm
                insuranceType="mrp"
                insuranceLabel="Multirisque Professionnelle"
              />
            </div>
          </div>
        </section>

        <section className="bg-accent/10 py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Ce que couvre l'assurance MRP
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-card p-6 rounded-lg shadow-lg">
                <Building className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-3">Local professionnel</h3>
                <p className="text-muted-foreground">
                  Incendie, dégâts des eaux, vol, vandalisme. Votre local 100% protégé.
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg shadow-lg">
                <Briefcase className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-3">Matériel & stocks</h3>
                <p className="text-muted-foreground">
                  Équipements, machines, marchandises : tout votre matériel couvert.
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg shadow-lg">
                <Zap className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-3">Pertes d'exploitation</h3>
                <p className="text-muted-foreground">
                  Maintien des revenus en cas de sinistre et fermeture forcée.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="bg-primary text-primary-foreground rounded-2xl p-12">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                Pourquoi choisir notre MRP ?
              </h2>
              <div className="grid md:grid-cols-4 gap-8 text-center">
                <div>
                  <Shield className="h-12 w-12 mx-auto mb-4" />
                  <div className="text-xl font-bold mb-2">Protection complète</div>
                  <div className="text-sm opacity-90">Tous risques couverts</div>
                </div>
                <div>
                  <Star className="h-12 w-12 mx-auto mb-4" />
                  <div className="text-xl font-bold mb-2">Sur-mesure</div>
                  <div className="text-sm opacity-90">Adapté à votre activité</div>
                </div>
                <div>
                  <Clock className="h-12 w-12 mx-auto mb-4" />
                  <div className="text-xl font-bold mb-2">Effet immédiat</div>
                  <div className="text-sm opacity-90">Protection dès validation</div>
                </div>
                <div>
                  <CheckCircle2 className="h-12 w-12 mx-auto mb-4" />
                  <div className="text-xl font-bold mb-2">Indemnisation rapide</div>
                  <div className="text-sm opacity-90">Sous 48h en moyenne</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-accent/10">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Témoignages d'entrepreneurs
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-card p-6 rounded-lg shadow-md">
                <div className="flex gap-0.5 mb-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "Un incendie a détruit mon local. Grâce à la MRP, j'ai pu rouvrir en 2 semaines. Indemnisation impeccable."
                </p>
                <p className="font-semibold">Karim B., Restaurant Lyon</p>
              </div>
              <div className="bg-card p-6 rounded-lg shadow-md">
                <div className="flex gap-0.5 mb-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "Tarif 30% moins cher que mon ancienne assurance avec de meilleures garanties. Je recommande !"
                </p>
                <p className="font-semibold">Isabelle T., Salon de coiffure Paris</p>
              </div>
              <div className="bg-card p-6 rounded-lg shadow-md">
                <div className="flex gap-0.5 mb-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "Souscription ultra rapide en ligne. L'assurance s'adapte parfaitement à mon activité de consultant."
                </p>
                <p className="font-semibold">Thomas R., Consultant Bordeaux</p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-primary text-primary-foreground py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Protégez votre entreprise dès maintenant
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Devis personnalisé gratuit en 2 minutes
            </p>
            <a
              href="#hero"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-block bg-background text-foreground px-8 py-4 rounded-lg font-bold text-lg hover:opacity-90 transition-opacity"
            >
              💼 Obtenir mon devis MRP
            </a>
          </div>
        </section>
      </div>
    </>
  );
};

export default LandingMRP;
