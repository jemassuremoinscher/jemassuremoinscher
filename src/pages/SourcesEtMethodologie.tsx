import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import SEOOptimized from "@/components/SEOOptimized";
import { addBreadcrumbSchema } from "@/utils/seoUtils";
import { ShieldCheck, BookOpen, Database, RefreshCw, Users, Scale } from "lucide-react";
import BrandName from "@/components/BrandName";
import { useLanguage } from "@/contexts/LanguageContext";

const SourcesEtMethodologie = () => {
  const { t } = useLanguage();
  const breadcrumbSchema = addBreadcrumbSchema([
    { name: "Accueil", url: "https://www.jemassuremoinscher.fr/" },
    { name: "Sources & Méthodologie", url: "https://www.jemassuremoinscher.fr/sources-et-methodologie" },
  ]);

  const sections = [
    {
      icon: Scale,
      title: "Sources légales et réglementaires",
      items: [
        { label: "Legifrance", desc: "Lois Hamon (2014), Lemoine (2022), Alur (2014), Code des assurances" },
        { label: "ACPR (Autorité de Contrôle Prudentiel et de Résolution)", desc: "Régulateur officiel des assureurs et courtiers en France" },
        { label: "ORIAS", desc: "Registre unique des intermédiaires en assurance, banque et finance" },
        { label: "France Assureurs", desc: "Fédération Française de l'Assurance, statistiques sectorielles" },
      ],
    },
    {
      icon: Database,
      title: "Données tarifaires",
      items: [
        { label: "Source", desc: "Devis 2025-2026 collectés auprès de nos 25+ assureurs partenaires" },
        { label: "Méthode", desc: "Moyennes pondérées par profil (âge, zone, véhicule, garanties)" },
        { label: "Mise à jour", desc: "Mensuelle pour les tarifs indicatifs, en temps réel pour les devis personnalisés" },
        { label: "Limites", desc: "Tarifs indicatifs uniquement — le devis final dépend de l'évaluation de chaque assureur" },
      ],
    },
    {
      icon: RefreshCw,
      title: "Économies annoncées",
      items: [
        { label: "Calcul", desc: "Différence entre la prime du contrat précédent du client et la meilleure offre que nous lui proposons" },
        { label: "Économie moyenne", desc: "280€/an tous produits confondus, jusqu'à 320€/an sur l'assurance auto" },
        { label: "Échantillon", desc: "Calcul basé sur les souscriptions effectives 2024-2025" },
      ],
    },
    {
      icon: Users,
      title: "Avis clients",
      items: [
        { label: "Collecte", desc: "Formulaire envoyé par e-mail 30 jours après la souscription" },
        { label: "Vérification", desc: "Email obligatoire, modération anti-fraude, publication intégrale (positive ou négative)" },
        { label: "Note actuelle", desc: "Note Google Reviews mise à jour mensuellement" },
      ],
    },
    {
      icon: BookOpen,
      title: "Contenu éditorial",
      items: [
        { label: "Auteurs", desc: "Conseillers certifiés ORIAS, juristes spécialisés, experts produits" },
        { label: "Vérification", desc: "Chaque article réglementaire est revu à chaque évolution législative" },
        { label: "Sources citées", desc: "Liens directs vers Legifrance, sites ministériels et publications officielles" },
        { label: "Glossaire", desc: "Définitions vérifiées, mises à jour selon le Code des assurances" },
      ],
    },
    {
      icon: ShieldCheck,
      title: "Indépendance et transparence",
      items: [
        { label: "Statut", desc: "Courtier indépendant enregistré ORIAS — aucun lien capitalistique avec les assureurs" },
        { label: "Rémunération", desc: "Commissions versées par les assureurs après souscription, jamais par le client" },
        { label: "Comparatif", desc: "Tous les partenaires sont présentés, classement basé sur le rapport prix/garanties pour le profil saisi" },
      ],
    },
  ];

  return (
    <div className="min-h-screen">
      <SEOOptimized
        title={t("seo.sources.title")}
        description={t("seo.sources.description")}
        keyword="méthodologie comparateur assurance"
        keywords="sources comparateur assurance, méthodologie courtier, transparence assurance, ORIAS"
        canonical="https://www.jemassuremoinscher.fr/sources-et-methodologie"
        jsonLd={[breadcrumbSchema]}
      />
      <Header />
      <Breadcrumbs items={[{ label: "Sources & Méthodologie" }]} />

      <main id="main-content">
        <section className="bg-gradient-to-br from-primary/5 to-primary/10 py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-accent mb-4">
                Sources & Méthodologie
              </h1>
              <p className="text-base text-muted-foreground">
                Transparence totale sur les sources, données et méthodes utilisées par <BrandName /> pour comparer les assurances.
              </p>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto grid gap-6 md:grid-cols-2">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <article
                  key={section.title}
                  className="rounded-xl border border-border bg-card p-6"
                >
                  <header className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
                    </div>
                    <h2 className="text-lg font-bold text-foreground">{section.title}</h2>
                  </header>
                  <ul className="space-y-3">
                    {section.items.map((item) => (
                      <li key={item.label} className="text-sm">
                        <span className="font-semibold text-foreground">{item.label}</span>
                        <span className="block text-muted-foreground mt-0.5">{item.desc}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </div>

          <div className="max-w-3xl mx-auto mt-10 text-sm text-muted-foreground text-center">
            <p>
              Une question sur notre méthodologie ?{" "}
              <a href="/contact" className="text-primary hover:underline font-medium">
                Contactez-nous
              </a>
              . Dernière mise à jour : avril 2026.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SourcesEtMethodologie;
