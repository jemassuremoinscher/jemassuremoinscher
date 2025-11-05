import SEO from '@/components/SEO';
import { SimplifiedLeadForm } from '@/components/landing/SimplifiedLeadForm';
import { Shield, Home, FileCheck, CheckCircle2, Star, Clock, Award, TrendingDown } from 'lucide-react';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useEffect } from 'react';

const LandingGLI = () => {
  const { trackPageView } = useAnalytics();

  useEffect(() => {
    trackPageView('/landing/gli', 'Landing Page Assurance GLI');
  }, [trackPageView]);

  return (
    <>
      <SEO
        title="Assurance GLI (Loyers Impayés) dès 2,5% | Protection Bailleurs 2025"
        description="Protégez vos revenus locatifs. Remboursement jusqu'à 100 000€. Prise en charge des loyers impayés + frais de contentieux. Devis gratuit."
        keywords="assurance gli, garantie loyers impayés, protection bailleur, loyers impayés"
        canonical="/landing/gli"
      />

      <div className="min-h-screen bg-gradient-to-b from-background to-accent/5">
        <div className="bg-primary text-primary-foreground py-3 px-4 text-center font-semibold animate-pulse">
          <Clock className="inline h-4 w-4 mr-2" />
          🏠 Offre Bailleurs : 3 mois de carence offerts pour toute souscription ce mois-ci
        </div>

        <section className="container mx-auto px-4 py-12 md:py-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-accent px-4 py-2 rounded-full">
                <Award className="h-4 w-4" />
                <span className="text-sm font-semibold">N°1 de la protection des bailleurs</span>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                GLI dès{' '}
                <span className="text-primary">2,5%</span> du loyer
              </h1>

              <p className="text-xl text-muted-foreground">
                Loyers garantis même en cas d'impayés. Jusqu'à <strong>100 000€ de couverture</strong>.
                Frais de contentieux inclus.
              </p>

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
                    <strong>14 267</strong> bailleurs protégés
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="text-sm font-medium">Protection immédiate</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="text-sm font-medium">Sans franchise</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="text-sm font-medium">Devis en 2min</span>
                </div>
              </div>
            </div>

            <div>
              <SimplifiedLeadForm
                insuranceType="gli"
                insuranceLabel="GLI"
              />
            </div>
          </div>
        </section>

        <section className="bg-accent/10 py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Pourquoi souscrire une GLI ?
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-card p-6 rounded-lg shadow-lg">
                <Shield className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-3">Revenus garantis</h3>
                <p className="text-muted-foreground">
                  Vos loyers versés chaque mois même en cas d'impayés du locataire.
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg shadow-lg">
                <FileCheck className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-3">Frais de procédure</h3>
                <p className="text-muted-foreground">
                  Avocat, huissier, expulsion : tous les frais juridiques pris en charge.
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg shadow-lg">
                <TrendingDown className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-3">Sérénité totale</h3>
                <p className="text-muted-foreground">
                  Louez sans risque et protégez votre investissement immobilier.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Témoignages de bailleurs satisfaits
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-card p-6 rounded-lg shadow-md">
                <div className="flex gap-0.5 mb-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "Mon locataire n'a pas payé pendant 6 mois. J'ai continué à percevoir mes loyers. Un vrai soulagement !"
                </p>
                <p className="font-semibold">François B., Propriétaire Paris</p>
              </div>
              <div className="bg-card p-6 rounded-lg shadow-md">
                <div className="flex gap-0.5 mb-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "La GLI m'a permis de louer sans caution familiale. Plus de flexibilité pour trouver des locataires."
                </p>
                <p className="font-semibold">Nathalie L., Propriétaire Lyon</p>
              </div>
              <div className="bg-card p-6 rounded-lg shadow-md">
                <div className="flex gap-0.5 mb-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "Tarif très compétitif et indemnisation rapide. Je recommande à tous les bailleurs !"
                </p>
                <p className="font-semibold">Ahmed K., Propriétaire Marseille</p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-primary text-primary-foreground py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Protégez vos revenus locatifs dès maintenant
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
              🏠 Obtenir mon devis GLI
            </a>
          </div>
        </section>
      </div>
    </>
  );
};

export default LandingGLI;
