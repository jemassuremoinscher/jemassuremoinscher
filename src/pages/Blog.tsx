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
    <div className="min-h-screen">
      <SEO 
        title="Blog Assurance - Conseils, Guides et Actualités | jemassuremoinscher"
        description="Découvrez nos articles sur les assurances : guides pratiques, actualités légales (loi Lemoine, Hamon), conseils d'experts pour bien choisir et économiser."
        keywords="blog assurance, conseils assurance, loi lemoine, loi hamon, guide assurance, actualités assurance"
        canonical="https://www.jemassuremoinscher.fr/blog"
        jsonLd={[breadcrumbSchema, blogSchema]}
      />
      <Header />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Blog & Actualités Assurance
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Conseils d'experts, guides pratiques et actualités légales pour tout savoir sur les assurances. 
              Restez informé et économisez sur vos contrats.
            </p>
          </div>

          {/* Search bar */}
          <div className="mb-8 max-w-2xl mx-auto">
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

          {/* Quick Links Section */}
          <div className="mb-16">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Guides Pratiques */}
              <div className="glass-card p-6 rounded-[2rem]">
                <h2 className="text-xl font-bold text-primary mb-4">Guides Pratiques</h2>
                <ul className="space-y-2">
                  <li>
                    <button
                      type="button"
                      onClick={() => navigate('/blog/meilleure-assurance-auto-2025')}
                      className="text-muted-foreground hover:text-primary transition-colors text-left w-full cursor-pointer hover:underline bg-transparent border-0 p-0 text-sm"
                    >
                      • Meilleure assurance auto 2025
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => navigate('/blog/top-mutuelles-sante-2025')}
                      className="text-muted-foreground hover:text-primary transition-colors text-left w-full cursor-pointer hover:underline bg-transparent border-0 p-0 text-sm"
                    >
                      • Top mutuelles santé
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => navigate('/blog/assurance-auto-jeune-conducteur-astuces')}
                      className="text-muted-foreground hover:text-primary transition-colors text-left w-full cursor-pointer hover:underline bg-transparent border-0 p-0 text-sm"
                    >
                      • Assurance jeune conducteur
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => navigate('/blog/comparatif-habitation-2025')}
                      className="text-muted-foreground hover:text-primary transition-colors text-left w-full cursor-pointer hover:underline bg-transparent border-0 p-0 text-sm"
                    >
                      • Comparatif habitation
                    </button>
                  </li>
                </ul>
              </div>

              {/* Actualités Légales */}
              <div className="glass-card p-6 rounded-[2rem]">
                <h2 className="text-xl font-bold text-primary mb-4">Actualités Légales</h2>
                <ul className="space-y-2">
                  <li>
                    <button
                      type="button"
                      onClick={() => navigate('/blog/loi-lemoine-2025')}
                      className="text-muted-foreground hover:text-primary transition-colors text-left w-full cursor-pointer hover:underline bg-transparent border-0 p-0 text-sm"
                    >
                      • Loi Lemoine 2025
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => navigate('/blog/resiliation-assurance-droits-2024')}
                      className="text-muted-foreground hover:text-primary transition-colors text-left w-full cursor-pointer hover:underline bg-transparent border-0 p-0 text-sm"
                    >
                      • Loi Hamon résiliation
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => navigate('/blog/nouvelle-reglementation-assurance-2025')}
                      className="text-muted-foreground hover:text-primary transition-colors text-left w-full cursor-pointer hover:underline bg-transparent border-0 p-0 text-sm"
                    >
                      • Nouvelle réglementation
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => navigate('/blog/droits-des-assures-2025')}
                      className="text-muted-foreground hover:text-primary transition-colors text-left w-full cursor-pointer hover:underline bg-transparent border-0 p-0 text-sm"
                    >
                      • Droits des assurés
                    </button>
                  </li>
                </ul>
              </div>

              {/* Conseils Experts */}
              <div className="glass-card p-6 rounded-[2rem]">
                <h2 className="text-xl font-bold text-primary mb-4">Conseils Experts</h2>
                <ul className="space-y-2">
                  <li>
                    <button
                      type="button"
                      onClick={() => navigate('/blog/mutuelle-sante-reduire-frais-medicaux-2024')}
                      className="text-muted-foreground hover:text-primary transition-colors text-left w-full cursor-pointer hover:underline bg-transparent border-0 p-0 text-sm"
                    >
                      • Économiser sur ses contrats
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => navigate('/blog/assurance-auto-jeune-conducteur-astuces')}
                      className="text-muted-foreground hover:text-primary transition-colors text-left w-full cursor-pointer hover:underline bg-transparent border-0 p-0 text-sm"
                    >
                      • Choisir ses garanties
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => navigate('/blog/resiliation-assurance-droits-2024')}
                      className="text-muted-foreground hover:text-primary transition-colors text-left w-full cursor-pointer hover:underline bg-transparent border-0 p-0 text-sm"
                    >
                      • Éviter les pièges
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => navigate('/blog/mutuelle-sante-reduire-frais-medicaux-2024')}
                      className="text-muted-foreground hover:text-primary transition-colors text-left w-full cursor-pointer hover:underline bg-transparent border-0 p-0 text-sm"
                    >
                      • Optimiser sa couverture
                    </button>
                  </li>
                </ul>
              </div>

              {/* Par Type */}
              <div className="glass-card p-6 rounded-[2rem]">
                <h2 className="text-xl font-bold text-primary mb-4">Par Type</h2>
                <ul className="space-y-2">
                  <li>
                    <button
                      type="button"
                      onClick={() => navigate('/blog/meilleure-assurance-auto-2025')}
                      className="text-muted-foreground hover:text-primary transition-colors text-left w-full cursor-pointer hover:underline bg-transparent border-0 p-0 text-sm"
                    >
                      • Auto & Moto
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => navigate('/blog/top-mutuelles-sante-2025')}
                      className="text-muted-foreground hover:text-primary transition-colors text-left w-full cursor-pointer hover:underline bg-transparent border-0 p-0 text-sm"
                    >
                      • Santé & Prévoyance
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => navigate('/blog/comparatif-habitation-2025')}
                      className="text-muted-foreground hover:text-primary transition-colors text-left w-full cursor-pointer hover:underline bg-transparent border-0 p-0 text-sm"
                    >
                      • Habitation & PNO
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => navigate('/blog/loi-lemoine-2025')}
                      className="text-muted-foreground hover:text-primary transition-colors text-left w-full cursor-pointer hover:underline bg-transparent border-0 p-0 text-sm"
                    >
                      • Vie & Emprunteur
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="mb-8">
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
          </div>

          {/* Results count */}
          <div className="mb-6 text-center text-muted-foreground">
            {filteredArticles.length} article{filteredArticles.length > 1 ? 's' : ''} trouvé{filteredArticles.length > 1 ? 's' : ''}
          </div>

          {/* Articles grid */}
          {filteredArticles.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {filteredArticles.map((article) => (
                <Card 
                  key={article.id} 
                  className="hover:shadow-[var(--shadow-hover)] cursor-pointer group"
                  onClick={() => navigate(`/blog/${article.slug}`)}
                >
                  <CardHeader>
                    <Badge className="mb-3 w-fit rounded-full">{article.category}</Badge>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">
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
            <Card className="p-12 text-center">
              <p className="text-lg text-muted-foreground mb-4">
                Aucun article ne correspond à votre recherche
              </p>
              <Button onClick={() => { setSearchQuery(""); setSelectedCategory("Tous les articles"); }} className="rounded-full">
                Réinitialiser les filtres
              </Button>
            </Card>
          )}

          <div className="mt-16 hero-glass p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Restez informé</h2>
            <p className="text-muted-foreground mb-6">
              Abonnez-vous à notre newsletter pour recevoir nos derniers articles et conseils directement dans votre boîte mail.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Blog;
