import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, Share2 } from "lucide-react";
import { blogArticles } from "@/data/blogArticles";
import SEOOptimized from "@/components/SEOOptimized";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import { CommentsSection } from "@/components/blog/CommentsSection";
import AuthorExpertise from "@/components/blog/AuthorExpertise";
import TableOfContents, { type TocItem } from "@/components/blog/TableOfContents";
import EssentielBox from "@/components/blog/EssentielBox";
import ArticleCTA from "@/components/blog/ArticleCTA";
import SemanticFAQ from "@/components/SemanticFAQ";
import type { FAQItem } from "@/components/SemanticFAQ";
import { addArticleSchema, addBreadcrumbSchema, addFAQSchema } from "@/utils/seoUtils";
import { useLanguage } from "@/contexts/LanguageContext";
import arthurFlying from "@/assets/mascotte/arthur-flying.png";
import Breadcrumbs from "@/components/Breadcrumbs";

const BlogArticle = () => {
  const { t } = useLanguage();
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
      toast.success(t('blogArticlePage.linkCopied'), {
        description: t('blogArticlePage.linkCopiedDesc'),
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

  // Generate ToC from article content (extract h2 headings)
  const generateTocItems = (content: string): TocItem[] => {
    const headingRegex = /^##\s+(.+)$/gm;
    const items: TocItem[] = [];
    let match;
    let index = 0;
    while ((match = headingRegex.exec(content)) !== null) {
      const title = match[1].trim();
      const id = `section-${index}`;
      items.push({ id, title, level: 2 });
      index++;
    }
    return items;
  };

  const tocItems = generateTocItems(article.content);

  // Essentiel summary - first ~40 words of description or custom
  const essentielSummary = article.description.split(' ').slice(0, 40).join(' ') + (article.description.split(' ').length > 40 ? '...' : '');

  const breadcrumbSchema = addBreadcrumbSchema([
    { name: "Accueil", url: "https://www.jemassuremoinscher.fr/" },
    { name: "Blog", url: "https://www.jemassuremoinscher.fr/blog" },
    { name: article.title, url: `https://www.jemassuremoinscher.fr/blog/${article.slug}` }
  ]);

  const blogFaqItems: FAQItem[] = [
    { question: "Comment fonctionne un comparateur d'assurances ?", answer: "Un comparateur d'assurances analyse votre profil et vos besoins pour vous proposer les offres les plus adaptées parmi des dizaines d'assureurs partenaires, en quelques minutes seulement." },
    { question: "Est-ce gratuit de comparer les assurances ?", answer: "Oui, la comparaison est 100% gratuite et sans engagement. Le service est financé par les assureurs partenaires, pas par les utilisateurs." },
    { question: "Peut-on changer d'assurance à tout moment ?", answer: "Grâce à la loi Hamon, après la première année de contrat, vous pouvez résilier votre assurance auto, moto ou habitation à tout moment, sans frais ni justification." },
    { question: "Combien de temps faut-il pour obtenir un devis ?", answer: "Avec notre comparateur, vous obtenez des devis personnalisés en moins de 2 minutes. Un conseiller peut ensuite vous rappeler pour finaliser votre choix." },
  ];

  const blogFaqSchema = addFAQSchema(blogFaqItems.map(f => ({ question: f.question, answer: f.answer })));

  const articleSchema = addArticleSchema({
    headline: article.title,
    description: article.description,
    author: article.author,
    datePublished: convertToISO(article.date),
    image: "https://www.jemassuremoinscher.fr/opengraph-image.png"
  });

  // Custom renderer to add IDs to h2 for anchor links
  let headingIndex = 0;

  return (
    <div className="min-h-screen bg-background">
      <SEOOptimized 
        title={`${article.title.substring(0, 50)} | Blog`}
        description={article.description.substring(0, 150)}
        keywords={article.tags.join(", ")}
        canonical={`https://www.jemassuremoinscher.fr/blog/${article.slug}`}
        jsonLd={[breadcrumbSchema, articleSchema, blogFaqSchema]}
      />
      <Header />
      <Breadcrumbs items={[{ label: "Blog", href: "/blog" }, { label: article.title }]} />
      
      <main>
        {/* Hero Header */}
        <section className="bg-gradient-to-br from-primary via-primary/90 to-primary/80">
          <div className="container mx-auto px-4 py-10 md:py-16">
            <div className="max-w-4xl mx-auto">
              <Button 
                variant="ghost" 
                onClick={() => navigate("/blog")}
                className="mb-4 text-white/80 hover:text-white hover:bg-white/10 rounded-full"
                aria-label="Retourner à la liste des articles du blog"
              >
                ← {t('blogArticlePage.backToBlog')}
              </Button>
              <Badge className="mb-4 bg-white/20 text-white border-white/30 rounded-full">{article.category}</Badge>
              
              {/* Semantic H1 */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                {article.title}
              </h1>
              
              {/* Author & Date Meta */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-white/80">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" aria-hidden="true" />
                  <span>{article.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" aria-hidden="true" />
                  <time dateTime={convertToISO(article.date)}>Dernière mise à jour le {article.date}</time>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" aria-hidden="true" />
                  <span>{article.readTime}</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleShare} 
                  className="text-white/80 hover:text-white hover:bg-white/10 rounded-full gap-2"
                  aria-label="Partager cet article"
                >
                  <Share2 className="h-4 w-4" aria-hidden="true" />
                  {t('blogArticlePage.share')}
                </Button>
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-10 md:py-14">
          {/* Semantic Article Wrapper */}
          <article className="max-w-4xl mx-auto">
            
            {/* Author E-E-A-T Badge */}
            <div className="mb-8">
              <AuthorExpertise />
            </div>

            {/* Table of Contents */}
            {tocItems.length > 0 && (
              <div className="mb-8">
                <TableOfContents items={tocItems} />
              </div>
            )}

            {/* L'Essentiel Box - SGE/AI Optimization */}
            <div className="mb-10">
              <EssentielBox summary={essentielSummary} />
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-10">
              {article.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="rounded-full">
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Article Content with proper semantic structure */}
            <div className="prose prose-lg max-w-none">
              <ReactMarkdown
                components={{
                  h1: ({node, ...props}) => <h1 className="text-3xl font-bold mt-12 mb-6 text-foreground" {...props} />,
                  h2: ({node, children, ...props}) => {
                    const id = `section-${headingIndex++}`;
                    return (
                      <h2 
                        id={id} 
                        className="text-2xl font-bold mt-12 mb-4 pt-4 text-foreground scroll-mt-24 border-t border-border/30" 
                        {...props}
                      >
                        {children}
                      </h2>
                    );
                  },
                  h3: ({node, ...props}) => <h3 className="text-xl font-semibold mt-8 mb-3 text-foreground" {...props} />,
                  p: ({node, ...props}) => <p className="mb-5 leading-relaxed text-muted-foreground text-base md:text-lg" {...props} />,
                  ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-5 space-y-2" {...props} />,
                  ol: ({node, ...props}) => <ol className="list-decimal pl-6 mb-5 space-y-2" {...props} />,
                  li: ({node, ...props}) => <li className="text-muted-foreground leading-relaxed" {...props} />,
                  strong: ({node, ...props}) => <strong className="font-semibold text-foreground" {...props} />,
                  blockquote: ({node, ...props}) => (
                    <aside className="border-l-4 border-secondary bg-secondary/10 pl-5 pr-4 py-4 my-6 rounded-r-xl">
                      <blockquote className="text-foreground italic leading-relaxed" {...props} />
                    </aside>
                  ),
                  code: ({node, ...props}) => (
                    <code className="bg-muted px-2 py-1 rounded text-sm" {...props} />
                  ),
                  table: ({node, ...props}) => (
                    <div className="overflow-x-auto my-8">
                      <table className="w-full border-collapse" {...props} />
                    </div>
                  ),
                  th: ({node, ...props}) => (
                    <th className="border border-border bg-muted px-4 py-3 text-left font-semibold text-foreground" {...props} />
                  ),
                  td: ({node, ...props}) => (
                    <td className="border border-border px-4 py-3 text-muted-foreground" {...props} />
                  ),
                }}
              >
                {article.content}
              </ReactMarkdown>
            </div>

            {/* Mid-article CTA (subtle) */}
            <ArticleCTA 
              variant="subtle"
              title="Payez-vous le juste prix ?"
              description="Vérifiez en 2 minutes si vous pouvez économiser sur votre assurance."
              buttonText="Comparer mes offres"
            />

            {/* FAQ Section */}
            <div className="mt-12">
              <SemanticFAQ
                items={blogFaqItems}
                title="Questions fréquentes sur l'assurance"
                subtitle="Les réponses aux questions que vous vous posez le plus souvent."
              />
            </div>

            {/* Final CTA */}
            <div className="relative bg-gradient-to-r from-primary to-primary/80 rounded-[2rem] p-8 md:p-12 text-center overflow-visible mt-12">
              <div className="relative z-10">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  {t('blogArticlePage.ctaTitle')}
                </h3>
                <p className="text-white/80 mb-6 max-w-xl mx-auto">
                  {t('blogArticlePage.ctaDesc')}
                </p>
                <Button 
                  size="lg" 
                  onClick={() => navigate("/comparateur")}
                  className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold px-8 rounded-full text-lg"
                  aria-label="Comparer les assurances gratuitement"
                >
                  {t('blogArticlePage.compareBtn')}
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
            <div className="mt-12">
              <CommentsSection articleSlug={article.slug} />
            </div>

            {/* Related articles */}
            {relatedArticles.length > 0 && (
              <div className="mt-12">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">{t('blogArticlePage.relatedArticles')}</h2>
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
                          <Clock className="h-3 w-3" aria-hidden="true" />
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
