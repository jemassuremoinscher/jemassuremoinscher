import { useParams, useNavigate, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOOptimized from "@/components/SEOOptimized";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, BookOpen, ExternalLink } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { glossaryTerms } from "@/data/glossaryTerms";
import { addBreadcrumbSchema } from "@/utils/seoUtils";
import { useLanguage } from "@/contexts/LanguageContext";

const normalizeGlossaryMarkdownHeadings = (markdown: string) => markdown.replace(/^#\s+/gm, "## ");

const glossarySeoMeta: Record<string, { title: string; description: string }> = {
  "franchise": { title: "Franchise Assurance : Définition & Guide [Month]", description: "Qu'est-ce que la franchise en assurance ? Absolue, relative, proportionnelle : tout comprendre pour mieux choisir. Guide [Month]." },
  "prime-assurance": { title: "Prime d'Assurance : Payer Moins Cher en [Month]", description: "Comprenez le calcul de votre prime d'assurance et économisez jusqu'à 40% en comparant les offres. Mis à jour [Month]." },
  "sinistre": { title: "Sinistre Assurance : Définition & Démarches [Month]", description: "Que faire en cas de sinistre ? Délais, preuves, déclaration : guide complet pour être indemnisé rapidement. [Month]." },
  "bonus-malus": { title: "Bonus-Malus Auto : Calcul & Barème [Month]", description: "Comment fonctionne le coefficient bonus-malus ? Calcul, barème et astuces pour retrouver votre bonus. Guide [Month]." },
  "indemnisation": { title: "Indemnisation Assurance : Modes & Délais [Month]", description: "Valeur à neuf, vénale, en nature : comprenez les modes d'indemnisation et les délais légaux. Guide [Month]." },
  "tiers": { title: "Assurance au Tiers : Définition & Garanties [Month]", description: "Assurance au tiers, tiers étendu ou tous risques ? Comparez les formules et trouvez la meilleure couverture. [Month]." },
  "tous-risques": { title: "Assurance Tous Risques : Garanties & Prix [Month]", description: "Quand choisir l'assurance tous risques ? Garanties incluses, prix moyen et comparatif des offres. [Month]." },
  "constat-amiable": { title: "Constat Amiable : Comment le Remplir [Month]", description: "Guide pas à pas pour remplir un constat amiable après un accident. Conseils et erreurs à éviter. [Month]." },
  "loi-hamon": { title: "Loi Hamon : Résilier son Assurance en [Month]", description: "La loi Hamon permet de résilier votre assurance auto, moto ou habitation à tout moment après 1 an. Guide [Month]." },
  "loi-lemoine": { title: "Loi Lemoine : Changer d'Assurance Prêt [Month]", description: "Résiliez votre assurance emprunteur à tout moment sans frais grâce à la loi Lemoine. Économisez jusqu'à 15 000€. [Month]." },
  "mutuelle-sante": { title: "Mutuelle Santé : Guide Complet [Month]", description: "Complémentaire santé, 100% Santé, remboursements : tout savoir pour choisir la meilleure mutuelle. [Month]." },
  "ticket-moderateur": { title: "Ticket Modérateur : Définition & Calcul [Month]", description: "Qu'est-ce que le ticket modérateur ? Exemples concrets, cas d'exonération et rôle de la mutuelle. [Month]." },
  "tiers-payant": { title: "Tiers Payant : Comment en Bénéficier [Month]", description: "Tiers payant partiel ou intégral : évitez d'avancer vos frais de santé. Guide pratique [Month]." },
  "responsabilite-civile": { title: "Responsabilité Civile : Définition & Guide [Month]", description: "RC vie privée, auto, professionnelle : comprenez vos obligations et choisissez la bonne couverture. [Month]." },
  "assurance-emprunteur": { title: "Assurance Emprunteur : Économisez en [Month]", description: "Changez d'assurance de prêt immobilier et économisez jusqu'à 15 000€. Comparatif et guide [Month]." },
  "pno": { title: "Assurance PNO dès 60€/an : Meilleurs Tarifs [Month]", description: "L'assurance PNO est-elle obligatoire ? Garanties, tarifs 2026 et devis gratuit en 2 min. Guide [Month]." },
  "gli": { title: "GLI : Protégez Vos Loyers dès 2,5% [Month]", description: "Garantie Loyers Impayés : couverture, conditions et coût. Sécurisez vos revenus locatifs. Guide [Month]." },
  "vetuste": { title: "Vétusté Assurance : Calcul & Impact [Month]", description: "Comment la vétusté affecte votre indemnisation ? Taux, calcul et astuces pour être mieux remboursé. [Month]." },
  "resiliation": { title: "Résiliation Assurance : Vos Droits en [Month]", description: "Loi Hamon, Chatel, infra-annuelle : tous les moyens pour résilier votre assurance facilement. Guide [Month]." },
  "devis": { title: "Devis Assurance Gratuit : Comparez en [Month]", description: "Obtenez un devis assurance gratuit en 2 minutes. Comparez 50+ assureurs et économisez. [Month]." },
};

const GlossaireTerme = () => {
  const { t } = useLanguage();
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const term = glossaryTerms.find((t) => t.slug === slug);

  if (!term) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">{t('glossaireTermPage.notFound')}</h1>
          <p className="text-muted-foreground mb-6">
            {t('glossaireTermPage.notFoundDesc')}
          </p>
          <Button onClick={() => navigate("/glossaire")} className="rounded-full">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('glossaireTermPage.backToGlossary')}
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  const relatedTerms = term.relatedTerms
    ?.map((id) => glossaryTerms.find((t) => t.id === id))
    .filter(Boolean) ?? [];

  const breadcrumbSchema = addBreadcrumbSchema([
    { name: "Accueil", url: "https://www.jemassuremoinscher.fr/" },
    { name: "Glossaire", url: "https://www.jemassuremoinscher.fr/glossaire" },
    {
      name: term.term,
      url: `https://www.jemassuremoinscher.fr/glossaire/${term.slug}`,
    },
  ]);

  const definitionSchema = {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    name: term.term,
    description: term.definition,
    url: `https://www.jemassuremoinscher.fr/glossaire/${term.slug}`,
    inDefinedTermSet: {
      "@type": "DefinedTermSet",
      name: "Glossaire de l'assurance",
      url: "https://www.jemassuremoinscher.fr/glossaire",
    },
  };

  return (
    <div className="min-h-screen">
      <SEOOptimized
        title={glossarySeoMeta[term.slug]?.title || `${term.term} : Définition & Guide [Month]`}
        description={glossarySeoMeta[term.slug]?.description || `${term.definition.substring(0, 120)} Guide mis à jour en [Month].`}
        keywords={term.tags.join(", ")}
        canonical={`https://www.jemassuremoinscher.fr/glossaire/${term.slug}`}
        jsonLd={[breadcrumbSchema, definitionSchema]}
      />
      <Header />

      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate("/glossaire")}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('glossaireTermPage.backToGlossary')}
          </Button>

          <article>
            <div className="mb-8">
              <Badge variant="outline" className="mb-3 rounded-full">
                {term.category}
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                {term.term}
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                {term.definition}
              </p>
            </div>

            <Card className="mb-8">
              <CardContent className="p-8 prose prose-lg max-w-none dark:prose-invert">
                <ReactMarkdown>{normalizeGlossaryMarkdownHeadings(term.content)}</ReactMarkdown>
              </CardContent>
            </Card>

            <div className="flex flex-wrap gap-2 mb-8">
              {term.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="rounded-full">
                  {tag}
                </Badge>
              ))}
            </div>
          </article>

          {term.relatedProducts && term.relatedProducts.length > 0 && (
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <ExternalLink className="h-6 w-6 text-primary" />
                Assurances liées
              </h2>
              <div className="flex flex-wrap gap-3">
                {term.relatedProducts.map((product) => (
                  <Link
                    key={product.url}
                    to={product.url}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium hover:bg-primary/20 transition-colors"
                  >
                    {product.label}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                ))}
              </div>
            </section>
          )}

          {relatedTerms.length > 0 && (
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <BookOpen className="h-6 w-6 text-primary" />
                {t('glossaireTermPage.relatedTerms')}
              </h2>
              <div className="grid md:grid-cols-3 gap-4">
                {relatedTerms.map(
                  (related) =>
                    related && (
                      <Card
                        key={related.id}
                        className="hover:shadow-[var(--shadow-hover)] cursor-pointer group"
                        onClick={() => navigate(`/glossaire/${related.slug}`)}
                      >
                        <CardContent className="p-4">
                          <h3 className="font-semibold group-hover:text-primary transition-colors mb-1">
                            {related.term}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {related.definition}
                          </p>
                        </CardContent>
                      </Card>
                    )
                )}
              </div>
            </section>
          )}

          <div className="hero-glass p-8 text-center rounded-2xl">
            <h2 className="text-2xl font-bold mb-4">
              {t('glossaireTermPage.ctaTitle')}
            </h2>
            <p className="text-muted-foreground mb-6">
              {t('glossaireTermPage.ctaDesc')}
            </p>
            <Button
              onClick={() => navigate("/comparateur")}
              size="lg"
              className="rounded-full"
            >
              {t('glossairePage.compareBtn')}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default GlossaireTerme;
