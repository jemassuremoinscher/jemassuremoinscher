import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, ArrowLeft, Share2 } from "lucide-react";
import { blogArticles } from "@/data/blogArticles";
import SEO from "@/components/SEO";
import ReactMarkdown from "react-markdown";
import { useToast } from "@/hooks/use-toast";
import { CommentsSection } from "@/components/blog/CommentsSection";
import { addArticleSchema, addBreadcrumbSchema } from "@/utils/seoUtils";

const BlogArticle = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const article = blogArticles.find(a => a.slug === slug);

  if (!article) {
    navigate("/blog");
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
      // Fallback: copier l'URL
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Lien copié !",
        description: "Le lien de l'article a été copié dans le presse-papier.",
      });
    }
  };

  const relatedArticles = blogArticles
    .filter(a => a.id !== article.id && (a.category === article.category || a.tags.some(tag => article.tags.includes(tag))))
    .slice(0, 3);

  // Convertir la date française en format ISO
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
    { name: "Accueil", url: "https://www.assurmoinschere.fr/" },
    { name: "Blog", url: "https://www.assurmoinschere.fr/blog" },
    { name: article.title, url: `https://www.assurmoinschere.fr/blog/${article.slug}` }
  ]);

  const articleSchema = addArticleSchema({
    headline: article.title,
    description: article.description,
    author: article.author,
    datePublished: convertToISO(article.date),
    image: "https://www.assurmoinschere.fr/opengraph-image.png"
  });

  return (
    <div className="min-h-screen">
      <SEO 
        title={`${article.title} | Blog jemassuremoinscher`}
        description={article.description}
        keywords={article.tags.join(", ")}
        canonical={`https://www.assurmoinschere.fr/blog/${article.slug}`}
        jsonLd={[breadcrumbSchema, articleSchema]}
      />
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Back button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate("/blog")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour au blog
        </Button>

        {/* Article header */}
        <article className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Badge className="mb-4">{article.category}</Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              {article.title}
            </h1>
            <p className="text-xl text-muted-foreground mb-6">
              {article.description}
            </p>
            
            {/* Meta info */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
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
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {article.tags.map((tag, index) => (
                <Badge key={index} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Share button */}
            <Button variant="outline" onClick={handleShare} className="mb-8">
              <Share2 className="mr-2 h-4 w-4" />
              Partager l'article
            </Button>
          </div>

          {/* Article content */}
          <div className="prose prose-lg max-w-none mb-12">
            <ReactMarkdown
              components={{
                h1: ({node, ...props}) => <h1 className="text-3xl font-bold mt-8 mb-4" {...props} />,
                h2: ({node, ...props}) => <h2 className="text-2xl font-bold mt-6 mb-3" {...props} />,
                h3: ({node, ...props}) => <h3 className="text-xl font-semibold mt-4 mb-2" {...props} />,
                p: ({node, ...props}) => <p className="mb-4 leading-relaxed text-muted-foreground" {...props} />,
                ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-4 space-y-2" {...props} />,
                ol: ({node, ...props}) => <ol className="list-decimal pl-6 mb-4 space-y-2" {...props} />,
                li: ({node, ...props}) => <li className="text-muted-foreground" {...props} />,
                strong: ({node, ...props}) => <strong className="font-semibold text-foreground" {...props} />,
                blockquote: ({node, ...props}) => (
                  <blockquote className="border-l-4 border-primary pl-4 py-2 my-4 italic bg-muted/30" {...props} />
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
                  <th className="border border-border bg-muted px-4 py-2 text-left font-semibold" {...props} />
                ),
                td: ({node, ...props}) => (
                  <td className="border border-border px-4 py-2" {...props} />
                ),
              }}
            >
              {article.content}
            </ReactMarkdown>
          </div>

          {/* CTA section */}
          <Card className="p-8 bg-gradient-to-br from-primary/10 to-accent/10 mb-12">
            <h3 className="text-2xl font-bold mb-4 text-center">
              Prêt à économiser sur vos assurances ?
            </h3>
            <p className="text-center text-muted-foreground mb-6">
              Comparez gratuitement les meilleures offres et trouvez l'assurance idéale en quelques clics
            </p>
            <div className="flex justify-center">
              <Button size="lg" onClick={() => navigate("/")}>
                Comparer les assurances
              </Button>
            </div>
          </Card>

          {/* Comments Section */}
          <CommentsSection articleSlug={article.slug} />

          {/* Related articles */}
          {relatedArticles.length > 0 && (
            <div className="mt-16">
              <h2 className="text-3xl font-bold mb-6">Articles similaires</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {relatedArticles.map((relArticle) => (
                  <Card 
                    key={relArticle.id}
                    className="hover:shadow-lg transition-all cursor-pointer"
                    onClick={() => navigate(`/blog/${relArticle.slug}`)}
                  >
                    <div className="p-6">
                      <Badge className="mb-3">{relArticle.category}</Badge>
                      <h3 className="font-semibold mb-2 line-clamp-2">
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
      </main>

      <Footer />
    </div>
  );
};

export default BlogArticle;
