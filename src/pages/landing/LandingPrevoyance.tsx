import SEOOptimized from '@/components/SEOOptimized';
import { SimplifiedLeadForm } from '@/components/landing/SimplifiedLeadForm';
import { Shield, Heart, Umbrella, CheckCircle2, Star, Clock, Award, Users } from 'lucide-react';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useEffect } from 'react';

const LandingPrevoyance = () => {
  const { trackPageView } = useAnalytics();

  useEffect(() => {
    trackPageView('/landing/prevoyance', 'Landing Page Assurance Prévoyance');
  }, [trackPageView]);

  return (
    <>
      <SEOOptimized
        title="Assurance Prévoyance dès 15€/mois"
        description="Protégez votre famille. Jusqu'à 3 000€/mois d'indemnités. Devis gratuit en 2 min."
        keyword="assurance prévoyance"
        keywords="protection famille, invalidité, décès, incapacité"
        noindex
      />

      <div className="min-h-screen bg-gradient-to-b from-background to-accent/5">
        <div className="bg-primary text-primary-foreground py-3 px-4 text-center font-semibold animate-pulse">
          <Clock className="inline h-4 w-4 mr-2" />
          🛡️ Offre Familiale : 1 mois offert + protection immédiate dès validation
        </div>

        <section className="container mx-auto px-4 py-12 md:py-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-accent px-4 py-2 rounded-full">
                <Award className="h-4 w-4" />
                <span className="text-sm font-semibold">N°1 de la protection familiale</span>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Protégez vos proches dès{' '}
                <span className="text-primary">15€/mois</span>
              </h1>

              <p className="text-xl text-muted-foreground">
                Jusqu'à <strong>3 000€/mois d'indemnités</strong> en cas d'accident ou maladie.
                Sécurisez l'avenir de votre famille en 2 minutes.
              </p>

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
                    <strong>18 724</strong> familles protégées
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="text-sm font-medium">Sans engagement</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="text-sm font-medium">Protection immédiate</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="text-sm font-medium">Réponse sous 2h</span>
                </div>
              </div>
            </div>

            <div>
              <SimplifiedLeadForm
                insuranceType="prevoyance"
                insuranceLabel="Prévoyance"
              />
            </div>
          </div>
        </section>

        <section className="bg-accent/10 py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Pourquoi choisir une prévoyance ?
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-card p-6 rounded-lg shadow-lg">
                <Shield className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-3">Protection complète</h3>
                <p className="text-muted-foreground">
                  Invalidité, incapacité, décès : votre famille protégée dans toutes les situations.
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg shadow-lg">
                <Umbrella className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-3">Maintien des revenus</h3>
                <p className="text-muted-foreground">
                  Jusqu'à 80% de votre salaire maintenu en cas d'arrêt de travail prolongé.
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg shadow-lg">
                <Users className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-3">Sérénité familiale</h3>
                <p className="text-muted-foreground">
                  Capital décès pour préserver le niveau de vie de votre famille.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Témoignages de nos assurés
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-card p-6 rounded-lg shadow-md">
                <div className="flex gap-0.5 mb-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "Suite à mon accident, j'ai touché 2 500€/mois pendant 8 mois. Sans cette prévoyance, on était ruiné."
                </p>
                <p className="font-semibold">Laurent P., Nice</p>
              </div>
              <div className="bg-card p-6 rounded-lg shadow-md">
                <div className="flex gap-0.5 mb-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "Ma famille a pu garder notre maison grâce au capital décès. Un investissement vital."
                </p>
                <p className="font-semibold">Sophie D., Toulouse</p>
              </div>
              <div className="bg-card p-6 rounded-lg shadow-md">
                <div className="flex gap-0.5 mb-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "Souscription en 5 minutes et indemnisation rapide. Je dors tranquille maintenant."
                </p>
                <p className="font-semibold">Karim B., Lille</p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-primary text-primary-foreground py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Protégez votre famille dès maintenant
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
              🛡️ Protéger ma famille
            </a>
          </div>
        </section>
      </div>
    </>
  );
};

export default LandingPrevoyance;
