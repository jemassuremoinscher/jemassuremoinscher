import SEO from '@/components/SEO';
import { SimplifiedLeadForm } from '@/components/landing/SimplifiedLeadForm';
import { Shield, Home, Wrench, CheckCircle2, Star, Clock, Award, Building } from 'lucide-react';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useEffect } from 'react';

const LandingPNO = () => {
  const { trackPageView } = useAnalytics();

  useEffect(() => {
    trackPageView('/landing/pno', 'Landing Page Assurance PNO');
  }, [trackPageView]);

  return (
    <>
      <SEO
        title="Assurance PNO dès 80€/an | Protection Propriétaire Non Occupant 2025"
        description="Protégez votre bien locatif. Dégâts des eaux, incendie, RC. Obligatoire en copropriété. Devis en 2 minutes."
        keywords="assurance pno, propriétaire non occupant, bien locatif, copropriété"
        canonical="/landing/pno"
      />

      <div className="min-h-screen bg-gradient-to-b from-background to-accent/5">
        <div className="bg-primary text-primary-foreground py-3 px-4 text-center font-semibold animate-pulse">
          <Clock className="inline h-4 w-4 mr-2" />
          🏢 Offre Propriétaires : 20% de réduction immédiate pour toute souscription en ligne
        </div>

        <section className="container mx-auto px-4 py-12 md:py-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-accent px-4 py-2 rounded-full">
                <Award className="h-4 w-4" />
                <span className="text-sm font-semibold">Spécialiste des propriétaires bailleurs</span>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                PNO dès{' '}
                <span className="text-primary">80€/an</span>
              </h1>

              <p className="text-xl text-muted-foreground">
                Protection complète de votre bien locatif. <strong>Obligatoire en copropriété</strong>.
                Dégâts des eaux, incendie, responsabilité civile inclus.
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
                    <strong>22 543</strong> biens assurés
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="text-sm font-medium">Obligatoire</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="text-sm font-medium">Tarifs imbattables</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="text-sm font-medium">Effet immédiat</span>
                </div>
              </div>
            </div>

            <div>
              <SimplifiedLeadForm
                insuranceType="pno"
                insuranceLabel="PNO"
              />
            </div>
          </div>
        </section>

        <section className="bg-accent/10 py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Pourquoi l'assurance PNO est indispensable ?
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-card p-6 rounded-lg shadow-lg">
                <Shield className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-3">Obligation légale</h3>
                <p className="text-muted-foreground">
                  Obligatoire en copropriété même si votre locataire est assuré.
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg shadow-lg">
                <Home className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-3">Protection patrimoine</h3>
                <p className="text-muted-foreground">
                  Couvre votre bien entre deux locations et en cas de vacance locative.
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg shadow-lg">
                <Wrench className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-3">Dégâts garantis</h3>
                <p className="text-muted-foreground">
                  Incendie, dégâts des eaux, catastrophes naturelles : tout est couvert.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Ce que nos clients disent de nous
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-card p-6 rounded-lg shadow-md">
                <div className="flex gap-0.5 mb-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "Un dégât des eaux dans mon appartement loué. Remboursé intégralement en 15 jours !"
                </p>
                <p className="font-semibold">Patricia G., Propriétaire Nice</p>
              </div>
              <div className="bg-card p-6 rounded-lg shadow-md">
                <div className="flex gap-0.5 mb-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "Tarif 40% moins cher que mon ancienne assurance pour les mêmes garanties. Incroyable !"
                </p>
                <p className="font-semibold">Michel D., Propriétaire Bordeaux</p>
              </div>
              <div className="bg-card p-6 rounded-lg shadow-md">
                <div className="flex gap-0.5 mb-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "Attestation reçue en 5 minutes pour mon syndic. Service ultra rapide et efficace."
                </p>
                <p className="font-semibold">Sandra M., Propriétaire Toulouse</p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-primary text-primary-foreground py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Assurez votre bien locatif dès maintenant
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Devis gratuit en 2 minutes • Attestation immédiate
            </p>
            <a
              href="#hero"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-block bg-background text-foreground px-8 py-4 rounded-lg font-bold text-lg hover:opacity-90 transition-opacity"
            >
              🏢 Obtenir mon devis PNO
            </a>
          </div>
        </section>
      </div>
    </>
  );
};

export default LandingPNO;
