import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, User, Eye, Linkedin, Facebook, Instagram } from "lucide-react";
import { blogArticleDrafts } from "@/data/blogArticles";
import SEOOptimized from "@/components/SEOOptimized";
import Breadcrumbs from "@/components/Breadcrumbs";
import { useLanguage } from "@/contexts/LanguageContext";

const BlogPreview = () => {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-background">
      <SEOOptimized
        title={t("seo.blogPreview.title")}
        description={t("seo.blogPreview.description")}
        canonical="https://www.jemassuremoinscher.fr/blog-preview"
        noindex
      />
      <Header />
      <Breadcrumbs items={[{ label: "Blog", href: "/blog" }, { label: "Aperçu brouillons" }]} />

      <main className="container mx-auto px-4 py-10 md:py-14 max-w-5xl">
        <div className="mb-8">
          <Badge variant="secondary" className="mb-3">Interne · Non indexé</Badge>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Aperçu des articles en brouillon</h1>
          <p className="text-muted-foreground">
            {blogArticleDrafts.length} article{blogArticleDrafts.length > 1 ? "s" : ""} prêt
            {blogArticleDrafts.length > 1 ? "s" : ""} à être publié{blogArticleDrafts.length > 1 ? "s" : ""}.
            Cliquez sur « Aperçu » pour visualiser l'article tel qu'il apparaîtra une fois publié.
          </p>
        </div>

        <div className="grid gap-6">
          {blogArticleDrafts.map((article) => (
            <Card key={article.id} className="overflow-hidden">
              <div className="md:flex">
                {article.image && (
                  <div className="md:w-64 flex-shrink-0">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-48 md:h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <CardHeader>
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <Badge>{article.category}</Badge>
                      <Badge variant="outline">Brouillon</Badge>
                    </div>
                    <CardTitle className="text-xl">{article.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{article.description}</CardDescription>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-2">
                      <span className="flex items-center gap-1"><User className="h-3 w-3" />{article.author}</span>
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{article.date}</span>
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{article.readTime}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-xs space-y-1">
                      <div><span className="font-mono text-muted-foreground">slug :</span> <code className="bg-muted px-1.5 py-0.5 rounded">{article.slug}</code></div>
                      <div><span className="font-mono text-muted-foreground">tags :</span> {article.tags.join(", ")}</div>
                    </div>

                    {article.socialHeadlines && (
                      <div className="border-t pt-3 space-y-2 text-sm">
                        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Headlines réseaux sociaux</div>
                        {article.socialHeadlines.linkedin && (
                          <p className="flex gap-2"><Linkedin className="h-4 w-4 flex-shrink-0 text-primary mt-0.5" /><span>{article.socialHeadlines.linkedin}</span></p>
                        )}
                        {article.socialHeadlines.facebook && (
                          <p className="flex gap-2"><Facebook className="h-4 w-4 flex-shrink-0 text-primary mt-0.5" /><span>{article.socialHeadlines.facebook}</span></p>
                        )}
                        {article.socialHeadlines.instagram && (
                          <p className="flex gap-2"><Instagram className="h-4 w-4 flex-shrink-0 text-primary mt-0.5" /><span>{article.socialHeadlines.instagram}</span></p>
                        )}
                      </div>
                    )}

                    <Link
                      to={`/blog-preview/${article.slug}`}
                      className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                    >
                      <Eye className="h-4 w-4" /> Aperçu de l'article
                    </Link>
                  </CardContent>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {blogArticleDrafts.length === 0 && (
          <p className="text-muted-foreground text-center py-12">Aucun article en brouillon.</p>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default BlogPreview;
