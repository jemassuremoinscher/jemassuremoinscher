import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, BookOpen, ArrowRight } from "lucide-react";
import { glossaryTerms, glossaryCategories } from "@/data/glossaryTerms";
import { addBreadcrumbSchema } from "@/utils/seoUtils";
import { useLanguage } from "@/contexts/LanguageContext";

const Glossaire = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTerms = glossaryTerms.filter((term) => {
    const matchesCategory =
      selectedCategory === "Tous" || term.category === selectedCategory;
    const matchesSearch =
      searchQuery === "" ||
      term.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
      term.definition.toLowerCase().includes(searchQuery.toLowerCase()) ||
      term.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchesCategory && matchesSearch;
  });

  const sortedTerms = [...filteredTerms].sort((a, b) =>
    a.term.localeCompare(b.term, "fr")
  );

  const breadcrumbSchema = addBreadcrumbSchema([
    { name: "Accueil", url: "https://www.jemassuremoinscher.fr/" },
    { name: "Glossaire", url: "https://www.jemassuremoinscher.fr/glossaire" },
  ]);

  const glossarySchema = {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    name: "Glossaire de l'assurance",
    description:
      "Définitions complètes des termes d'assurance : franchise, bonus-malus, mutuelle, sinistre et plus encore.",
    url: "https://www.jemassuremoinscher.fr/glossaire",
    hasDefinedTerm: glossaryTerms.map((term) => ({
      "@type": "DefinedTerm",
      name: term.term,
      description: term.definition,
      url: `https://www.jemassuremoinscher.fr/glossaire/${term.slug}`,
    })),
  };

  return (
    <div className="min-h-screen">
      <SEO
        title="Glossaire Assurance - Définitions et Termes Clés | jemassuremoinscher"
        description="Comprendre les termes d'assurance : franchise, bonus-malus, mutuelle, sinistre, loi Hamon, loi Lemoine. Définitions claires et exemples concrets."
        keywords="glossaire assurance, définition franchise, bonus malus, mutuelle santé, loi hamon, loi lemoine, sinistre assurance, responsabilité civile"
        canonical="https://www.jemassuremoinscher.fr/glossaire"
        jsonLd={[breadcrumbSchema, glossarySchema]}
      />
      <Header />

      <main className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              {t('glossairePage.title')}
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              {t('glossairePage.subtitle')}
            </p>
          </div>

          <div className="mb-8 max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                type="text"
                placeholder={t('glossairePage.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 py-6 text-lg rounded-full"
              />
            </div>
          </div>

          <div className="mb-8">
            <div className="flex flex-wrap gap-2 justify-center">
              {glossaryCategories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  size="sm"
                  className="rounded-full"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          <div className="mb-6 text-center text-muted-foreground">
            {sortedTerms.length} {sortedTerms.length > 1 ? t('glossairePage.termsFoundPlural') : t('glossairePage.termsFound')}{" "}
            {t('blogPage.articlesFound')}
          </div>

          {sortedTerms.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-4 mb-12">
              {sortedTerms.map((term) => (
                <Card
                  key={term.id}
                  className="hover:shadow-[var(--shadow-hover)] cursor-pointer group"
                  onClick={() => navigate(`/glossaire/${term.slug}`)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <Badge variant="outline" className="mb-2 rounded-full text-xs">
                          {term.category}
                        </Badge>
                        <h2 className="text-xl font-semibold group-hover:text-primary transition-colors mb-2">
                          {term.term}
                        </h2>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {term.definition}
                        </p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors mt-8 shrink-0" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <p className="text-lg text-muted-foreground mb-4">
                {t('glossairePage.noResults')}
              </p>
              <Button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("Tous");
                }}
                className="rounded-full"
              >
                {t('blogPage.resetFilters')}
              </Button>
            </Card>
          )}

          <div className="mt-16 hero-glass p-8 text-center rounded-2xl">
            <h2 className="text-2xl font-bold mb-4">
              {t('glossairePage.ctaTitle')}
            </h2>
            <p className="text-muted-foreground mb-6">
              {t('glossairePage.ctaDesc')}
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

export default Glossaire;
