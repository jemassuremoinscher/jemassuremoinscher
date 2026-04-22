import Header from "@/components/Header";
import SimpleFooter from "@/components/sections/SimpleFooter";
import BrandName from "@/components/BrandName";
import ArthurHero from "@/components/insurance/ArthurHero";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LucideIcon, Award, CheckCircle2, Shield, Star } from "lucide-react";
import SEOOptimized from "@/components/SEOOptimized";
import InsuranceFAQ from "@/components/insurance/InsuranceFAQ";
import { addServiceSchema, addFAQSchema, addBreadcrumbSchema } from "@/utils/seoUtils";
import arthurThumbsUp from "@/assets/mascotte/arthur-thumbs-up.webp";

interface Advantage {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface FAQItem {
  question: string;
  answer: string;
}

interface SEOLandingPageProps {
  // SEO
  title: string;
  metaDescription: string;
  keyword: string;
  keywords?: string;
  canonical: string;
  // Hero
  heroIcon: LucideIcon;
  heroTitle: string;
  heroSubtitle: string;
  ctaLabel: string;
  ctaLink: string;
  // Content
  contentTitle: string;
  contentBody: string;
  // Advantages
  advantages: Advantage[];
  // FAQ
  faqTitle?: string;
  faqs: FAQItem[];
  // Breadcrumb
  breadcrumbs: { name: string; url: string }[];
  // Bottom CTA
  bottomCtaTitle?: string;
  bottomCtaDescription?: string;
  bottomCtaLabel?: string;
  bottomCtaLink?: string;
}

const SEOLandingPage = ({
  title,
  metaDescription,
  keyword,
  keywords,
  canonical,
  heroIcon: HeroIcon,
  heroTitle,
  heroSubtitle,
  ctaLabel,
  ctaLink,
  contentTitle,
  contentBody,
  advantages,
  faqTitle = "Questions fréquentes",
  faqs,
  breadcrumbs,
  bottomCtaTitle,
  bottomCtaDescription,
  bottomCtaLabel,
  bottomCtaLink,
}: SEOLandingPageProps) => {
  const breadcrumbSchema = addBreadcrumbSchema(breadcrumbs);
  const serviceSchema = addServiceSchema({
    name: title,
    description: metaDescription,
    provider: "jemassuremoinscher.fr",
    areaServed: "France",
  });
  const faqSchema = addFAQSchema(faqs);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <SEOOptimized
        title={title}
        description={metaDescription}
        keyword={keyword}
        keywords={keywords}
        canonical={canonical}
        jsonLd={[breadcrumbSchema, serviceSchema, faqSchema]}
      />
      <Header />

      <main className="flex-1">
        <section className="container mx-auto px-4 py-8 md:py-12">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-start max-w-7xl mx-auto">
            <div className="space-y-6 animate-fade-in">
              <Badge className="text-sm px-3 py-1 inline-flex items-center gap-1.5">
                <Award className="h-3 w-3" />
                Guide SEO expert
              </Badge>

              <ArthurHero
                imageSrc={arthurThumbsUp}
                imageAlt="Arthur pouce levé - guide assurance jemassuremoinscher.fr"
                speechText="Je vous simplifie les garanties et je vous aide à comparer les meilleures offres."
              />

              <div>
                <div className="inline-flex items-center justify-center rounded-full bg-primary/10 p-4 mb-4">
                  <HeroIcon className="h-10 w-10 text-primary" />
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-4">
                  {heroTitle}
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground mb-2">{heroSubtitle}</p>
                <p className="text-sm text-muted-foreground">
                  Guide proposé par <BrandName variant="purple" /> — courtier indépendant ORIAS.
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {advantages.slice(0, 4).map((item, index) => (
                  <div key={index} className="text-center p-4 bg-card rounded-lg border hover-scale">
                    <item.icon className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <div className="font-semibold text-sm">{item.title}</div>
                    <div className="text-xs text-muted-foreground mt-1">{item.description}</div>
                  </div>
                ))}
              </div>

              <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20">
                <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  Pourquoi choisir <BrandName variant="purple" /> ?
                </h2>
                <ul className="space-y-3">
                  {advantages.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <item.icon className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-sm">{item.title}</p>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </Card>

              <div className="flex items-center justify-center gap-4 py-2 flex-wrap">
                <Badge variant="outline" className="gap-2">
                  <Shield className="h-4 w-4" /> SSL / RGPD
                </Badge>
                <Badge variant="outline" className="gap-2">
                  <CheckCircle2 className="h-4 w-4" /> ORIAS vérifié
                </Badge>
                <Badge variant="outline" className="gap-2">
                  <Star className="h-4 w-4 fill-current" /> 4,8/5 — 2847 avis
                </Badge>
              </div>
            </div>

            <div className="lg:sticky lg:top-24" id="hero">
              <Card className="p-6 md:p-8 shadow-2xl border-2 border-primary/20 bg-card">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center gap-2 bg-accent px-4 py-2 rounded-full mb-4">
                    <HeroIcon className="h-4 w-4 text-accent-foreground" />
                    <span className="text-sm font-semibold text-accent-foreground">Comparatif personnalisé</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-2">{ctaLabel}</h2>
                  <p className="text-sm text-muted-foreground">Accès direct à nos experts et à nos comparatifs dédiés.</p>
                </div>
                <div className="space-y-3 mb-6">
                  {advantages.slice(0, 3).map((item, index) => (
                    <div key={index} className="flex items-start gap-3 rounded-lg border bg-muted/30 p-3">
                      <item.icon className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-sm">{item.title}</p>
                        <p className="text-xs text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button size="lg" className="w-full h-14 text-lg font-bold" asChild>
                  <a href={ctaLink}>{ctaLabel}</a>
                </Button>
                <p className="text-xs text-center text-muted-foreground mt-4">
                  Gratuit • Sans engagement • Réponse rapide
                </p>
              </Card>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-12 md:py-16 max-w-4xl">
          <Card className="p-6 md:p-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">{contentTitle}</h2>
            <div
              className="prose prose-lg max-w-none text-muted-foreground leading-relaxed"
              dangerouslySetInnerHTML={{ __html: contentBody }}
            />
          </Card>
        </section>

        <section className="container mx-auto px-4 py-12 md:py-16 max-w-4xl">
          <InsuranceFAQ title={faqTitle} faqs={faqs} />
        </section>

        {bottomCtaTitle && (
          <section className="bg-primary text-primary-foreground py-12 md:py-16">
            <div className="container mx-auto px-4 text-center max-w-3xl">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                {bottomCtaTitle}
              </h2>
              {bottomCtaDescription && (
                <p className="text-lg opacity-90 mb-8">
                  {bottomCtaDescription}
                </p>
              )}
              <Button size="lg" className="text-lg px-8 py-6 bg-accent text-accent-foreground hover:opacity-90" asChild>
                <a href={bottomCtaLink || ctaLink}>
                  {bottomCtaLabel || ctaLabel}
                </a>
              </Button>
            </div>
          </section>
        )}
      </main>

      <SimpleFooter />
    </div>
  );
};

export default SEOLandingPage;
