import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOOptimized from "@/components/SEOOptimized";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Search } from "lucide-react";
import BlogArticleArthur from "@/components/blog/BlogArticleArthur";
import { blogArticles, blogCategories } from "@/data/blogArticles";
import { addBreadcrumbSchema } from "@/utils/seoUtils";
import { useLanguage } from "@/contexts/LanguageContext";
import arthurThinking from "@/assets/mascotte/arthur-thinking.webp";
import Breadcrumbs from "@/components/Breadcrumbs";
import DynamicUpdateDate from "@/components/DynamicUpdateDate";

const convertToISO = (frenchDate: string): string => {
  const months: Record<string, string> = {
    'janvier': '01', 'février': '02', 'mars': '03', 'avril': '04',
    'mai': '05', 'juin': '06', 'juillet': '07', 'août': '08',
    'septembre': '09', 'octobre': '10', 'novembre': '11', 'décembre': '12'
  };
  const parts = frenchDate.split(' ');
  if (parts.length === 3) {
    const day = parts[0].padStart(2, '0');
    const month = months[parts[1].toLowerCase()] || '01';
    const year = parts[2];
    return `${year}-${month}-${day}`;
  }
  return new Date().toISOString().split('T')[0];
};

const Blog = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredArticles = blogArticles.filter(article => {
    const matchesCategory = selectedCategory === "all" || article.category === selectedCategory;
    const matchesSearch = searchQuery === "" || 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  const breadcrumbSchema = addBreadcrumbSchema([
    { name: t('breadcrumb.home'), url: "https://www.jemassuremoinscher.fr/" },
    { name: "Blog", url: "https://www.jemassuremoinscher.fr/blog" }
  ]);

  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "Blog Assurance - jemassuremoinscher.fr",
    "description": "Conseils, guides pratiques et actualités sur les assurances en France",
    "url": "https://www.jemassuremoinscher.fr/blog",
    "publisher": {
      "@type": "Organization",
      "name": "jemassuremoinscher.fr"
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOOptimized 
        title={t('blogPage.seoTitle')}
        description={t('blogPage.seoDesc')}
        keyword="blog assurance"
        keywords="conseils assurance, loi lemoine, loi hamon, guide assurance"
        canonical="https://www.jemassuremoinscher.fr/blog"
        ogTitle="Blog Assurance [Month] : Conseils, Guides & Actualités par des Experts"
        ogDescription="Guides pratiques, actualités loi Lemoine & Hamon, comparatifs 2026 rédigés par nos courtiers ORIAS. Tout pour payer votre assurance moins cher."
        twitterDescription="Conseils assurance par des experts ORIAS : guides, lois, comparatifs 2026. Tout pour économiser sur vos contrats."
        jsonLd={[breadcrumbSchema, blogSchema]}
      />
      <Header />
      <Breadcrumbs items={[{ label: "Blog" }]} />
      
      <main>
        {/* Hero */}
        <section className="relative bg-gradient-to-br from-primary via-primary/90 to-primary/80 overflow-hidden">
          <div className="container mx-auto px-4 py-14 md:py-20">
            <div className="max-w-[65%] sm:max-w-[70%] md:max-w-2xl relative z-10">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                {t('blogPage.title')}
              </h1>
              <p className="text-base md:text-lg text-white/80 leading-relaxed">
                {t('blogPage.subtitle')}
              </p>
            </div>
            <img
              src={arthurThinking}
              alt="Arthur mascotte blog assurance - conseils et guides"
              width={224}
              height={224}
              className="absolute right-4 md:right-12 bottom-0 h-24 sm:h-32 md:h-48 lg:h-56 object-contain opacity-90 pointer-events-none select-none"
              loading="lazy"
            />
          </div>
        </section>

        <div className="container mx-auto px-4 py-10 md:py-14">
          <DynamicUpdateDate />
          <div className="max-w-7xl mx-auto space-y-10">

            {/* Search */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <label htmlFor="blog-search" className="sr-only">{t('blogPage.searchLabel')}</label>
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" aria-hidden="true" />
                <Input
                  id="blog-search"
                  type="search"
                  placeholder={t('blogPage.searchPlaceholder')}
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
                  title: t('blogPage.guidesTitle'),
                  links: [
                    { label: "Meilleure assurance auto 2026", slug: "meilleure-assurance-auto-2026" },
                    { label: "Top mutuelles santé 2026", slug: "top-mutuelles-sante-2026" },
                    { label: "Astuces jeune conducteur", slug: "assurance-auto-jeune-conducteur-astuces" },
                    { label: "Comparatif habitation 2026", slug: "comparatif-habitation-2026" },
                  ]
                },
                {
                  title: t('blogPage.specialProfiles'),
                  links: [
                    { label: "Résilié non-paiement", to: "/profil/resilie-non-paiement" },
                    { label: "Retrait de permis", to: "/profil/retrait-permis" },
                    { label: "Multi-sinistré (3+)", to: "/profil/frequence-sinistres" },
                    { label: "Jeune + voiture puissante", to: "/profil/jeune-conducteur-voiture-puissante" },
                    { label: "Métiers atypiques", to: "/assurance-metiers-atypiques" },
                    { label: "Primo-assuré", to: "/profil/sans-antecedents" },
                  ]
                },
                {
                  title: t('blogPage.insurerDuels'),
                  links: [
                    { label: "MAIF vs Macif", to: "/comparatif/maif-vs-macif" },
                    { label: "AXA vs Allianz", to: "/comparatif/axa-vs-allianz" },
                    { label: "Direct Assurance vs L'Olivier", to: "/comparatif/direct-assurance-vs-l-olivier" },
                    { label: "Luko vs Alan", to: "/comparatif/luko-vs-alan" },
                    { label: t('blogPage.allDuels'), to: "/comparatif" },
                  ]
                },
                {
                  title: t('blogPage.byTypeTitle'),
                  links: [
                    { label: "Auto & Moto", to: "/assurance-auto" },
                    { label: "Santé & Prévoyance", to: "/assurance-sante" },
                    { label: "Habitation & PNO", to: "/assurance-habitation" },
                    { label: "Vie & Emprunteur", to: "/assurance-pret" },
                    { label: "Calculateur Bonus-Malus", to: "/outils/calculateur-bonus-malus" },
                  ]
                },
              ].map((section) => (
                <div key={section.title} className="glass-card p-6 rounded-[2rem]">
                  <h2 className="text-lg font-bold text-primary mb-4">{section.title}</h2>
                  <ul className="space-y-2">
                    {section.links.map((link: any) => (
                      <li key={(link.slug || link.to) + link.label}>
                        <button
                          type="button"
                          onClick={() => navigate(link.to || `/blog/${link.slug}`)}
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
              <Button
                variant={selectedCategory === "all" ? "default" : "outline"}
                onClick={() => setSelectedCategory("all")}
                size="sm"
                className="rounded-full"
              >
                {t('blogPage.allArticles')}
              </Button>
              {blogCategories.filter(c => c !== "Tous les articles").map((category) => (
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
              {filteredArticles.length} article{filteredArticles.length > 1 ? 's' : ''} {filteredArticles.length > 1 ? t('blogPage.articlesFoundPlural') : t('blogPage.articlesFound')}
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
                      <CardTitle className="text-lg group-hover:text-primary transition-colors flex items-start gap-2">
                        <BlogArticleArthur category={article.category} />
                        <span className="flex-1">{article.title}</span>
                      </CardTitle>
                      <CardDescription className="text-muted-foreground line-clamp-3">
                        {article.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <time dateTime={convertToISO(article.date)}>{t('blogPage.updatedOn')} {article.date}</time>
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
                  {t('blogPage.noResults')}
                </p>
                <Button onClick={() => { setSearchQuery(""); setSelectedCategory("all"); }} className="rounded-full">
                  {t('blogPage.resetFilters')}
                </Button>
              </Card>
            )}

            {/* Newsletter CTA */}
            <div className="bg-gradient-to-r from-primary to-primary/80 rounded-[2rem] p-8 md:p-12 text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">{t('blogPage.stayInformed')}</h2>
              <p className="text-white/80 mb-6 max-w-xl mx-auto">
                {t('blogPage.newsletterDesc')}
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
