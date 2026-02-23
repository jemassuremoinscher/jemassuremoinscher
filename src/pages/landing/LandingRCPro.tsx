import SEOOptimized from '@/components/SEOOptimized';
import { SimplifiedLeadForm } from '@/components/landing/SimplifiedLeadForm';
import { Shield, Briefcase, Scale, CheckCircle2, Star, Clock, Award, Building2 } from 'lucide-react';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useEffect } from 'react';

const LandingRCPro = () => {
  const { trackPageView } = useAnalytics();

  useEffect(() => {
    trackPageView('/landing/rc-pro', 'Landing Page Assurance RC Pro');
  }, [trackPageView]);

  return (
    <>
      <SEOOptimized
        title="Assurance RC Pro dès 12€/mois"
        description="Protégez votre activité. Couverture jusqu'à 5M€. Obligatoire. Devis en 2 min."
        keyword="assurance RC pro"
        keywords="responsabilité civile professionnelle, protection activité"
        noindex
      />

      <div className="min-h-screen bg-gradient-to-b from-background to-accent/5">
        <div className="bg-primary text-primary-foreground py-3 px-4 text-center font-semibold animate-pulse">
          <Clock className="inline h-4 w-4 mr-2" />
          ⚡ Offre Professionnels : 2 mois offerts + protection immédiate
        </div>

        <section className="container mx-auto px-4 py-12 md:py-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-accent px-4 py-2 rounded-full">
                <Award className="h-4 w-4" />
                <span className="text-sm font-semibold">Expert des professionnels depuis 2010</span>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                RC Pro dès{' '}
                <span className="text-primary">12€/mois</span>
              </h1>

              <p className="text-xl text-muted-foreground">
                Couverture jusqu'à <strong>5 millions d'euros</strong>.
                Protégez votre activité en cas de dommages causés aux tiers.
              </p>

              <div className="flex items-center gap-4 pt-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full bg-accent border-2 border-background flex items-center justify-center"
                    >
                      <Building2 className="h-5 w-5 text-primary" />
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
                    <strong>34 892</strong> professionnels assurés
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="text-sm font-medium">Effet immédiat</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="text-sm font-medium">Tous métiers</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="text-sm font-medium">Devis en 2min</span>
                </div>
              </div>
            </div>

            <div>
              <SimplifiedLeadForm
                insuranceType="rc-pro"
                insuranceLabel="RC Pro"
              />
            </div>
          </div>
        </section>

        <section className="bg-accent/10 py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Pourquoi la RC Pro est essentielle ?
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-card p-6 rounded-lg shadow-lg">
                <Scale className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-3">Obligation légale</h3>
                <p className="text-muted-foreground">
                  Obligatoire pour professions réglementées : artisans, consultants, santé, BTP...
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg shadow-lg">
                <Shield className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-3">Protection maximale</h3>
                <p className="text-muted-foreground">
                  Couvre les dommages corporels, matériels et immatériels causés aux tiers.
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg shadow-lg">
                <Briefcase className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-3">Pérennité activité</h3>
                <p className="text-muted-foreground">
                  Évitez la faillite en cas de réclamation ou procès coûteux.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Ils ont choisi notre RC Pro
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-card p-6 rounded-lg shadow-md">
                <div className="flex gap-0.5 mb-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "Ma RC Pro m'a sauvé d'une procédure à 200 000€. L'assurance a tout pris en charge."
                </p>
                <p className="font-semibold">Alexandre T., Architecte</p>
              </div>
              <div className="bg-card p-6 rounded-lg shadow-md">
                <div className="flex gap-0.5 mb-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "Tarif imbattable pour ma startup. Je peux enfin signer des contrats clients en toute sérénité."
                </p>
                <p className="font-semibold">Léa M., Consultante IT</p>
              </div>
              <div className="bg-card p-6 rounded-lg shadow-md">
                <div className="flex gap-0.5 mb-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "Souscription en ligne ultra rapide. Attestation envoyée en 10 minutes. Parfait !"
                </p>
                <p className="font-semibold">Julien R., Plombier</p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-primary text-primary-foreground py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Assurez votre activité professionnelle
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Devis sur mesure en 2 minutes • Attestation immédiate
            </p>
            <a
              href="#hero"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-block bg-background text-foreground px-8 py-4 rounded-lg font-bold text-lg hover:opacity-90 transition-opacity"
            >
              💼 Obtenir mon devis RC Pro
            </a>
          </div>
        </section>
      </div>
    </>
  );
};

export default LandingRCPro;
