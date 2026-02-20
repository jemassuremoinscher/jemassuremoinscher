import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Search } from "lucide-react";
import { blogArticles, blogCategories } from "@/data/blogArticles";
import { addBreadcrumbSchema } from "@/utils/seoUtils";
import arthurThinking from "@/assets/mascotte/arthur-thinking.png";

const Blog = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("Tous les articles");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredArticles = blogArticles.filter(article => {
    const matchesCategory = selectedCategory === "Tous les articles" || article.category === selectedCategory;
    const matchesSearch = searchQuery === "" || 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  const breadcrumbSchema = addBreadcrumbSchema([
    { name: "Accueil", url: "https://www.jemassuremoinscher.fr/" },
    { name: "Blog", url: "https://www.jemassuremoinscher.fr/blog" }
  ]);

  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "Blog Assurance - jemassuremoinscher",
    "description": "Conseils, guides pratiques et actualités sur les assurances en France",
    "url": "https://www.jemassuremoinscher.fr/blog",
    "publisher": {
      "@type": "Organization",
      "name": "jemassuremoinscher"
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Blog Assurance - Conseils, Guides et Actualités | jemassuremoinscher"
        description="Découvrez nos articles sur les assurances : guides pratiques, actualités légales (loi Lemoine, Hamon), conseils d'experts pour bien choisir et économiser."
        keywords="blog assurance, conseils assurance, loi lemoine, loi hamon, guide assurance, actualités assurance"
        canonical="https://www.jemassuremoinscher.fr/blog"
        jsonLd={[breadcrumbSchema, blogSchema]}
      />
      <Header />
      
      <main>
        {/* Hero */}
        <section className="relative bg-gradient-to-br from-primary via-primary/90 to-primary/80 overflow-hidden">
          <div className="container mx-auto px-4 py-14 md:py-20">
            <div className="max-w-[65%] sm:max-w-[70%] md:max-w-2xl relative z-10">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                Blog & Actualités Assurance
              </h1>
              <p className="text-base md:text-lg text-white/80 leading-relaxed">
                Conseils d'experts, guides pratiques et actualités légales pour tout savoir sur les assurances.
              </p>
            </div>
            <img
              src={arthurThinking}
              alt=""
              aria-hidden="true"
              className="absolute right-4 md:right-12 bottom-0 h-24 sm:h-32 md:h-48 lg:h-56 object-contain opacity-90 pointer-events-none select-none"
            />
          </div>
        </section>

        <div className="container mx-auto px-4 py-10 md:py-14">
          <div className="max-w-7xl mx-auto space-y-10">

            {/* Search */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Rechercher un article (ex: loi lemoine, assurance auto...)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 py-6 text-lg rounded-full"
                />
              </div>
            </div>

            {/* Quick Links */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  title: "Guides Pratiques",
                  links: [
                    { label: "Meilleure assurance auto 2025", slug: "meilleure-assurance-auto-2025" },
                    { label: "Top mutuelles santé", slug: "top-mutuelles-sante-2025" },
                    { label: "Assurance jeune conducteur", slug: "assurance-auto-jeune-conducteur-astuces" },
                    { label: "Comparatif habitation", slug: "comparatif-habitation-2025" },
                  ]
                },
                {
                  title: "Actualités Légales",
                  links: [
                    { label: "Loi Lemoine 2025", slug: "loi-lemoine-2025" },
                    { label: "Loi Hamon résiliation", slug: "resiliation-assurance-droits-2024" },
                    { label: "Nouvelle réglementation", slug: "nouvelle-reglementation-assurance-2025" },
                    { label: "Droits des assurés", slug: "droits-des-assures-2025" },
                  ]
                },
                {
                  title: "Conseils Experts",
                  links: [
                    { label: "Économiser sur ses contrats", slug: "mutuelle-sante-reduire-frais-medicaux-2024" },
                    { label: "Choisir ses garanties", slug: "assurance-auto-jeune-conducteur-astuces" },
                    { label: "Éviter les pièges", slug: "resiliation-assurance-droits-2024" },
                    { label: "Optimiser sa couverture", slug: "mutuelle-sante-reduire-frais-medicaux-2024" },
                  ]
                },
                {
                  title: "Par Type",
                  links: [
                    { label: "Auto & Moto", slug: "meilleure-assurance-auto-2025" },
                    { label: "Santé & Prévoyance", slug: "top-mutuelles-sante-2025" },
                    { label: "Habitation & PNO", slug: "comparatif-habitation-2025" },
                    { label: "Vie & Emprunteur", slug: "loi-lemoine-2025" },
                  ]
                },
              ].map((section) => (
                <div key={section.title} className="glass-card p-6 rounded-[2rem]">
                  <h2 className="text-lg font-bold text-primary mb-4">{section.title}</h2>
                  <ul className="space-y-2">
                    {section.links.map((link) => (
                      <li key={link.slug + link.label}>
                        <button
                          type="button"
                          onClick={() => navigate(`/blog/${link.slug}`)}
                          className="text-muted-foreground hover:text-primary transition-colors text-left w-full cursor-pointer hover:underline bg-transparent border-0 p-0 text-sm"
                        >
                          • {link.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-2 justify-center">
              {blogCategories.map((category) => (
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

            {/* Results count */}
            <div className="text-center text-muted-foreground text-sm">
              {filteredArticles.length} article{filteredArticles.length > 1 ? 's' : ''} trouvé{filteredArticles.length > 1 ? 's' : ''}
            </div>

            {/* Articles grid */}
            {filteredArticles.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredArticles.map((article) => (
                  <Card 
                    key={article.id} 
                    className="glass-card rounded-[2rem] hover:shadow-[var(--shadow-hover)] cursor-pointer group transition-all duration-300"
                    onClick={() => navigate(`/blog/${article.slug}`)}
                  >
                    <CardHeader>
                      <Badge className="mb-3 w-fit rounded-full">{article.category}</Badge>
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">
                        {article.title}
                      </CardTitle>
                      <CardDescription className="text-muted-foreground line-clamp-3">
                        {article.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{article.date}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{article.readTime}</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {article.tags.slice(0, 3).map((tag, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs rounded-full">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="glass-card p-12 text-center rounded-[2rem]">
                <p className="text-lg text-muted-foreground mb-4">
                  Aucun article ne correspond à votre recherche
                </p>
                <Button onClick={() => { setSearchQuery(""); setSelectedCategory("Tous les articles"); }} className="rounded-full">
                  Réinitialiser les filtres
                </Button>
              </Card>
            )}

            {/* Newsletter CTA */}
            <div className="bg-gradient-to-r from-primary to-primary/80 rounded-[2rem] p-8 md:p-12 text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Restez informé</h2>
              <p className="text-white/80 mb-6 max-w-xl mx-auto">
                Abonnez-vous à notre newsletter pour recevoir nos derniers articles et conseils directement dans votre boîte mail.
              </p>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Blog;
