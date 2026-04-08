import { useParams, useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, Share2 } from "lucide-react";
import { blogArticles } from "@/data/blogArticles";
import SEOOptimized from "@/components/SEOOptimized";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import AuthorExpertise from "@/components/blog/AuthorExpertise";
import { getAuthor, getAuthorJsonLd } from "@/data/authors";
import TableOfContents, { type TocItem } from "@/components/blog/TableOfContents";
import EssentielBox from "@/components/blog/EssentielBox";
import ArticleCTA from "@/components/blog/ArticleCTA";
import SemanticFAQ from "@/components/SemanticFAQ";
import type { FAQItem } from "@/components/SemanticFAQ";
import { addArticleSchema, addBreadcrumbSchema, addFAQSchema } from "@/utils/seoUtils";
import { useLanguage } from "@/contexts/LanguageContext";
import Breadcrumbs from "@/components/Breadcrumbs";
import SuggestedKeywords from "@/components/blog/SuggestedKeywords";
import PopularArticles from "@/components/blog/PopularArticles";
import RelatedProductLinks from "@/components/blog/RelatedProductLinks";
import DynamicUpdateDate from "@/components/DynamicUpdateDate";
import BlogArticleArthur from "@/components/blog/BlogArticleArthur";
import SmartConversionWidget, { detectCategory } from "@/components/blog/SmartConversionWidget";

const BlogArticle = () => {
  const { t } = useLanguage();
  const { slug } = useParams();
  const navigate = useNavigate();

  const article = blogArticles.find(a => a.slug === slug);

  if (!article) {
    toast.error(t('blogArticlePage.articleNotFound'), {
      description: t('blogArticlePage.articleNotFoundDesc'),
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

  const essentielSummary = article.description.split(' ').slice(0, 40).join(' ') + (article.description.split(' ').length > 40 ? '...' : '');

  const breadcrumbSchema = addBreadcrumbSchema([
    { name: t('breadcrumb.home'), url: "https://www.jemassuremoinscher.fr/" },
    { name: "Blog", url: "https://www.jemassuremoinscher.fr/blog" },
    { name: article.title, url: `https://www.jemassuremoinscher.fr/blog/${article.slug}` }
  ]);

  const blogFaqItems: FAQItem[] = [
    { question: t('blogArticlePage.faq1Q'), answer: t('blogArticlePage.faq1A') },
    { question: t('blogArticlePage.faq2Q'), answer: t('blogArticlePage.faq2A') },
    { question: t('blogArticlePage.faq3Q'), answer: t('blogArticlePage.faq3A') },
    { question: t('blogArticlePage.faq4Q'), answer: t('blogArticlePage.faq4A') },
  ];

  const blogFaqSchema = addFAQSchema(blogFaqItems.map(f => ({ question: f.question, answer: f.answer })));

  const authorProfile = getAuthor(article.author);
  const authorJsonLd = getAuthorJsonLd(authorProfile);

  const articleSchema = addArticleSchema({
    headline: article.title,
    description: article.description,
    author: article.author,
    datePublished: convertToISO(article.date),
    image: "https://www.jemassuremoinscher.fr/opengraph-image.png"
  });

  let headingIndex = 0;
  let paragraphIndex = 0;
  const widgetCategory = detectCategory(article.category, article.tags);

  return (
    <div className="min-h-screen bg-background">
      <SEOOptimized 
        title={`${article.title.substring(0, 50)} | Blog`}
        description={article.description.substring(0, 150)}
        keywords={article.tags.join(", ")}
        canonical={`https://www.jemassuremoinscher.fr/blog/${article.slug}`}
        ogType="article"
        articlePublishedTime={convertToISO(article.date)}
        articleModifiedTime={convertToISO(article.date)}
        jsonLd={[breadcrumbSchema, articleSchema, blogFaqSchema, authorJsonLd]}
        noindex={article.noindex}
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
                aria-label={t('blogArticlePage.backToBlogAria')}
              >
                ← {t('blogArticlePage.backToBlog')}
              </Button>
              <Badge className="mb-4 bg-white/20 text-white border-white/30 rounded-full">{article.category}</Badge>
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight flex items-center gap-3 md:gap-4">
                <BlogArticleArthur category={article.category} className="h-14 w-14 sm:h-16 sm:w-16 md:h-20 md:w-20" />
                <span className="flex-1">{article.title}</span>
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-white/80">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" aria-hidden="true" />
                  <span>{article.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" aria-hidden="true" />
                  <time dateTime={convertToISO(article.date)}>{t('blogArticlePage.lastUpdated')} {article.date}</time>
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
          <DynamicUpdateDate />
          <div className="flex gap-8 max-w-6xl mx-auto">
            {/* Article */}
            <article className="flex-1 min-w-0">
              
              {/* Author E-E-A-T */}
              <div className="mb-8">
                <AuthorExpertise authorName={article.author} />
              </div>

              {/* ToC — mobile only (desktop in sidebar) */}
              {tocItems.length > 0 && (
                <div className="mb-8 lg:hidden">
                  <TableOfContents items={tocItems} />
                </div>
              )}

              {/* L'Essentiel */}
              <div className="mb-10">
                <EssentielBox summary={essentielSummary} />
              </div>

              {/* Article Content */}
              <div className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-muted-foreground">
                <ReactMarkdown
                  components={{
                    h1: ({node, ...props}) => <h2 className="text-3xl font-bold mt-12 mb-6 text-foreground" {...props} />,
                    h2: ({node, children, ...props}) => {
                      const id = `section-${headingIndex++}`;
                      return (
                        <h2 
                          id={id} 
                          className="text-2xl font-bold mt-14 mb-5 pt-6 text-foreground scroll-mt-24 border-t border-border/40" 
                          {...props}
                        >
                          {children}
                        </h2>
                      );
                    },
                    h3: ({node, ...props}) => <h3 className="text-xl font-semibold mt-8 mb-3 text-foreground" {...props} />,
                    p: ({node, ...props}) => {
                      paragraphIndex++;
                      const showWidget = paragraphIndex === 2 || paragraphIndex === 5;
                      return (
                        <>
                          <p className="mb-6 leading-relaxed text-muted-foreground text-base md:text-[1.0625rem]" {...props} />
                          {showWidget && <SmartConversionWidget category={widgetCategory} />}
                        </>
                      );
                    },
                    ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-6 space-y-2.5" {...props} />,
                    ol: ({node, ...props}) => <ol className="list-decimal pl-6 mb-6 space-y-2.5" {...props} />,
                    li: ({node, ...props}) => <li className="text-muted-foreground leading-relaxed" {...props} />,
                    strong: ({node, ...props}) => <strong className="font-semibold text-foreground" {...props} />,
                    blockquote: ({node, ...props}) => (
                      <aside className="border-l-4 border-primary/40 bg-primary/5 pl-5 pr-4 py-4 my-8 rounded-r-xl">
                        <blockquote className="text-foreground italic leading-relaxed not-italic" {...props} />
                      </aside>
                    ),
                    code: ({node, ...props}) => (
                      <code className="bg-muted px-2 py-1 rounded text-sm" {...props} />
                    ),
                    table: ({node, ...props}) => (
                      <div className="overflow-x-auto my-8 rounded-xl border border-border shadow-sm">
                        <table className="w-full border-collapse text-sm" {...props} />
                      </div>
                    ),
                    thead: ({node, ...props}) => (
                      <thead className="bg-primary/10" {...props} />
                    ),
                    th: ({node, ...props}) => (
                      <th className="px-4 py-3 text-left font-semibold text-foreground text-sm border-b border-border" {...props} />
                    ),
                    tr: ({node, ...props}) => (
                      <tr className="even:bg-muted/30 hover:bg-muted/50 transition-colors" {...props} />
                    ),
                    td: ({node, ...props}) => (
                      <td className="px-4 py-3 text-muted-foreground border-b border-border/50" {...props} />
                    ),
                  }}
                >
                  {article.content}
                </ReactMarkdown>
              </div>

              {/* CTA */}
              <div className="mt-12">
                <ArticleCTA 
                  variant="subtle"
                  title={t('blogArticlePage.fairPrice')}
                  description={t('blogArticlePage.fairPriceDesc')}
                  buttonText={t('blogArticlePage.compareOffers')}
                />
              </div>

              {/* FAQ */}
              <div className="mt-14">
                <SemanticFAQ
                  items={blogFaqItems}
                  title={t('blogArticlePage.faqTitle')}
                  subtitle={t('blogArticlePage.faqSubtitle')}
                />
              </div>

              {/* Related product links */}
              <RelatedProductLinks category={article.category} tags={article.tags} />

              {/* Keywords */}
              <SuggestedKeywords tags={article.tags} />

            </article>

            {/* Sidebar — desktop */}
            <aside className="hidden lg:flex flex-col w-72 flex-shrink-0 gap-6 mt-8 sticky top-24 self-start">
              {tocItems.length > 0 && (
                <TableOfContents items={tocItems} />
              )}
              <PopularArticles currentSlug={article.slug} />
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BlogArticle;
