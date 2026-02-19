import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, BookOpen } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { glossaryTerms } from "@/data/glossaryTerms";
import { addBreadcrumbSchema } from "@/utils/seoUtils";

const GlossaireTerme = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const term = glossaryTerms.find((t) => t.slug === slug);

  if (!term) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Terme non trouvé</h1>
          <p className="text-muted-foreground mb-6">
            Ce terme n'existe pas dans notre glossaire.
          </p>
          <Button onClick={() => navigate("/glossaire")} className="rounded-full">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour au glossaire
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
      <SEO
        title={`${term.term} - Définition Assurance | jemassuremoinscher`}
        description={term.definition}
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
            Retour au glossaire
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
                <ReactMarkdown>{term.content}</ReactMarkdown>
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

          {relatedTerms.length > 0 && (
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <BookOpen className="h-6 w-6 text-primary" />
                Termes associés
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
              Comparez et économisez sur votre assurance
            </h2>
            <p className="text-muted-foreground mb-6">
              Trouvez la meilleure offre en quelques clics. Gratuit et sans
              engagement.
            </p>
            <Button
              onClick={() => navigate("/comparateur")}
              size="lg"
              className="rounded-full"
            >
              Comparer les assurances
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
