import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, Share2 } from "lucide-react";
import { blogArticles } from "@/data/blogArticles";
import SEO from "@/components/SEO";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import { CommentsSection } from "@/components/blog/CommentsSection";
import { addArticleSchema, addBreadcrumbSchema } from "@/utils/seoUtils";
import arthurFlying from "@/assets/mascotte/arthur-flying.png";

const BlogArticle = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const article = blogArticles.find(a => a.slug === slug);

  if (!article) {
    toast.error("Article introuvable", {
      description: "L'article demandé n'existe pas ou a été déplacé. Vous allez être redirigé vers le blog.",
    });
    setTimeout(() => navigate("/blog"), 2000);
    return null;
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.description,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Lien copié !", {
        description: "Le lien de l'article a été copié dans le presse-papier.",
      });
    }
  };

  const relatedArticles = blogArticles
    .filter(a => a.id !== article.id && (a.category === article.category || a.tags.some(tag => article.tags.includes(tag))))
    .slice(0, 3);

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

  const breadcrumbSchema = addBreadcrumbSchema([
    { name: "Accueil", url: "https://www.jemassuremoinscher.fr/" },
    { name: "Blog", url: "https://www.jemassuremoinscher.fr/blog" },
    { name: article.title, url: `https://www.jemassuremoinscher.fr/blog/${article.slug}` }
  ]);

  const articleSchema = addArticleSchema({
    headline: article.title,
    description: article.description,
    author: article.author,
    datePublished: convertToISO(article.date),
    image: "https://www.jemassuremoinscher.fr/opengraph-image.png"
  });

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title={`${article.title} | Blog jemassuremoinscher`}
        description={article.description}
        keywords={article.tags.join(", ")}
        canonical={`https://www.jemassuremoinscher.fr/blog/${article.slug}`}
        jsonLd={[breadcrumbSchema, articleSchema]}
      />
      <Header />
      
      <main>
        {/* Hero */}
        <section className="bg-gradient-to-br from-primary via-primary/90 to-primary/80">
          <div className="container mx-auto px-4 py-10 md:py-16">
            <div className="max-w-4xl mx-auto">
              <Button 
                variant="ghost" 
                onClick={() => navigate("/blog")}
                className="mb-4 text-white/80 hover:text-white hover:bg-white/10 rounded-full"
              >
                ← Retour au blog
              </Button>
              <Badge className="mb-4 bg-white/20 text-white border-white/30 rounded-full">{article.category}</Badge>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                {article.title}
              </h1>
              <p className="text-base md:text-lg text-white/80 mb-6 leading-relaxed">
                {article.description}
              </p>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-white/70">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{article.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{article.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{article.readTime}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={handleShare} className="text-white/80 hover:text-white hover:bg-white/10 rounded-full gap-2">
                  <Share2 className="h-4 w-4" />
                  Partager
                </Button>
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-10 md:py-14">
          <article className="max-w-4xl mx-auto space-y-12">

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="rounded-full">
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Article content */}
            <div className="prose prose-lg max-w-none">
              <ReactMarkdown
                components={{
                  h1: ({node, ...props}) => <h1 className="text-3xl font-bold mt-8 mb-4 text-foreground" {...props} />,
                  h2: ({node, ...props}) => <h2 className="text-2xl font-bold mt-6 mb-3 text-foreground" {...props} />,
                  h3: ({node, ...props}) => <h3 className="text-xl font-semibold mt-4 mb-2 text-foreground" {...props} />,
                  p: ({node, ...props}) => <p className="mb-4 leading-relaxed text-muted-foreground" {...props} />,
                  ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-4 space-y-2" {...props} />,
                  ol: ({node, ...props}) => <ol className="list-decimal pl-6 mb-4 space-y-2" {...props} />,
                  li: ({node, ...props}) => <li className="text-muted-foreground" {...props} />,
                  strong: ({node, ...props}) => <strong className="font-semibold text-foreground" {...props} />,
                  blockquote: ({node, ...props}) => (
                    <blockquote className="border-l-4 border-primary pl-4 py-2 my-4 italic bg-primary/5 rounded-r-2xl" {...props} />
                  ),
                  code: ({node, ...props}) => (
                    <code className="bg-muted px-2 py-1 rounded text-sm" {...props} />
                  ),
                  table: ({node, ...props}) => (
                    <div className="overflow-x-auto my-6">
                      <table className="w-full border-collapse" {...props} />
                    </div>
                  ),
                  th: ({node, ...props}) => (
                    <th className="border border-border bg-muted px-4 py-2 text-left font-semibold text-foreground" {...props} />
                  ),
                  td: ({node, ...props}) => (
                    <td className="border border-border px-4 py-2 text-muted-foreground" {...props} />
                  ),
                }}
              >
                {article.content}
              </ReactMarkdown>
            </div>

            {/* CTA */}
            <div className="relative bg-gradient-to-r from-primary to-primary/80 rounded-[2rem] p-8 md:p-12 text-center overflow-visible">
              <div className="relative z-10">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  Prêt à économiser sur vos assurances ?
                </h3>
                <p className="text-white/80 mb-6 max-w-xl mx-auto">
                  Comparez gratuitement les meilleures offres et trouvez l'assurance idéale en quelques clics
                </p>
                <Button 
                  size="lg" 
                  onClick={() => navigate("/comparateur")}
                  className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold px-8 rounded-full text-lg"
                >
                  Comparer les assurances
                </Button>
              </div>
              <img
                src={arthurFlying}
                alt=""
                aria-hidden="true"
                className="absolute -top-10 right-4 md:right-12 h-16 sm:h-24 md:h-36 object-contain pointer-events-none select-none"
              />
            </div>

            {/* Comments */}
            <CommentsSection articleSlug={article.slug} />

            {/* Related articles */}
            {relatedArticles.length > 0 && (
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">Articles similaires</h2>
                <div className="grid md:grid-cols-3 gap-4">
                  {relatedArticles.map((relArticle) => (
                    <Card 
                      key={relArticle.id}
                      className="glass-card rounded-[2rem] hover:shadow-[var(--shadow-hover)] transition-all duration-300 cursor-pointer group"
                      onClick={() => navigate(`/blog/${relArticle.slug}`)}
                    >
                      <div className="p-6">
                        <Badge className="mb-3 rounded-full">{relArticle.category}</Badge>
                        <h3 className="font-semibold mb-2 line-clamp-2 text-foreground group-hover:text-primary transition-colors">
                          {relArticle.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                          {relArticle.description}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>{relArticle.readTime}</span>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BlogArticle;
