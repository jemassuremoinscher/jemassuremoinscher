import { type LucideIcon, CheckCircle2, Star, Shield, Award } from "lucide-react";
import { useEffect, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import SEOOptimized from "@/components/SEOOptimized";
import Header from "@/components/Header";
import SimpleFooter from "@/components/sections/SimpleFooter";
import BrandName from "@/components/BrandName";
import ArthurHero from "@/components/insurance/ArthurHero";
import { SimplifiedLeadForm } from "@/components/landing/SimplifiedLeadForm";
import { addOrganizationSchema, addServiceSchema, addFAQSchema, addBreadcrumbSchema, optimizeLandingFaqAnswer, optimizeLandingReassuranceDescription } from "@/utils/seoUtils";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useLanguage } from "@/contexts/LanguageContext";

export interface LandingAdvantage {
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface LandingTestimonial {
  name: string;
  location: string;
  text: string;
}

export interface LandingFAQ {
  question: string;
  answer: string;
}

export interface LandingStat {
  icon: LucideIcon;
  value: string;
  label: string;
}

export interface AdsLandingProps {
  // Routing / SEO
  slug: string;
  trackingTitle: string;
  seoTitle: string;
  seoDescription: string;
  seoKeyword: string;
  seoKeywords?: string;
  noindex?: boolean;
  // Hero
  topBarText: string;
  badgeText: string;
  heroTitle: React.ReactNode;
  heroHighlight: string;
  heroSubtitle: React.ReactNode;
  mascotSrc: string;
  mascotAlt: string;
  speechText: string;
  // Form
  insuranceType: string;
  insuranceLabel: string;
  // Content
  stats: LandingStat[];
  advantages: LandingAdvantage[];
  testimonials: LandingTestimonial[];
  faqs: LandingFAQ[];
  // Bottom CTA
  bottomCtaTitle: string;
  bottomCtaDescription: string;
}

/** Localized variant: pass { fr, en } and the right one is picked from context. */
export type LocalizedAdsLandingProps = { fr: AdsLandingProps; en: AdsLandingProps };

const isLocalized = (p: AdsLandingProps | LocalizedAdsLandingProps): p is LocalizedAdsLandingProps =>
  (p as LocalizedAdsLandingProps).fr !== undefined && (p as LocalizedAdsLandingProps).en !== undefined;

const AdsLandingTemplate = (props: AdsLandingProps | LocalizedAdsLandingProps) => {
  const { trackPageView } = useAnalytics();
  const { language, t } = useLanguage();

  const config = useMemo<AdsLandingProps>(
    () => (isLocalized(props) ? props[language] : props),
    [props, language]
  );

  const {
    slug, trackingTitle, seoTitle, seoDescription, seoKeyword, seoKeywords,
    noindex = false, topBarText, badgeText, heroTitle, heroHighlight, heroSubtitle,
    mascotSrc, mascotAlt, speechText, insuranceType, insuranceLabel,
    stats, advantages, testimonials, faqs, bottomCtaTitle, bottomCtaDescription,
  } = config;

  const optimizedAdvantages = advantages.map((item) => ({
    ...item,
    description: optimizeLandingReassuranceDescription(item.title, item.description),
  }));

  const optimizedFaqs = faqs.map((faq) => ({
    ...faq,
    answer: optimizeLandingFaqAnswer(faq.question, faq.answer),
  }));

  useEffect(() => {
    trackPageView(`/landing/${slug}`, trackingTitle);
  }, [slug, trackingTitle, trackPageView]);

  const canonical = `https://www.jemassuremoinscher.fr/landing/${slug}`;

  const jsonLd = [
    addOrganizationSchema(4.9, 2847),
    addServiceSchema({
      name: seoTitle,
      description: seoDescription,
      provider: "jemassuremoinscher.fr",
      areaServed: "France",
    }),
    addFAQSchema(optimizedFaqs),
    addBreadcrumbSchema([
      { name: language === "en" ? "Home" : "Accueil", url: "https://www.jemassuremoinscher.fr/" },
      { name: insuranceLabel, url: canonical },
    ]),
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <SEOOptimized
        title={seoTitle}
        description={seoDescription}
        keyword={seoKeyword}
        keywords={seoKeywords}
        canonical={canonical}
        noindex={noindex}
        jsonLd={jsonLd}
      />

      <Header />

      {/* Top info bar (factual, no fabricated promo) */}
      <div className="bg-accent text-accent-foreground py-2 px-4 text-center font-semibold text-sm md:text-base">
        {topBarText}
      </div>

      <main className="flex-1">
        {/* Hero with brand identity */}
        <section className="container mx-auto px-4 py-8 md:py-12">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-start max-w-7xl mx-auto">
            {/* Left column */}
            <div className="space-y-6 animate-fade-in">
              <Badge className="text-sm px-3 py-1 inline-flex items-center gap-1.5">
                <Award className="h-3 w-3" />
                {badgeText}
              </Badge>

              <ArthurHero imageSrc={mascotSrc} imageAlt={mascotAlt} speechText={speechText} />

              <div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-4">
                  {heroTitle}
                  <span className="text-primary block mt-2">{heroHighlight}</span>
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground mb-2">{heroSubtitle}</p>
                <p className="text-sm text-muted-foreground">
                  {t("landingTpl.serviceBy")} <BrandName variant="purple" /> — {t("landingTpl.broker")}
                </p>
              </div>

              {/* Stats — glassmorphism cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                  <div
                    key={i}
                    className="text-center p-4 rounded-2xl backdrop-blur-md bg-card/70 border border-border/60 shadow-sm hover:shadow-md hover-scale transition-all"
                  >
                    <stat.icon className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <div className="font-bold text-2xl">{stat.value}</div>
                    <div className="text-xs text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Advantages */}
              <Card className="p-6 rounded-3xl backdrop-blur-md bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20">
                <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  {t("landingTpl.whyChoose")} <BrandName variant="purple" /> ?
                </h2>
                <ul className="space-y-3">
                 {optimizedAdvantages.map((a, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <a.icon className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-sm">{a.title}</p>
                        <p className="text-sm text-muted-foreground">{a.description}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </Card>

              {/* Trust */}
              <div className="flex items-center justify-center gap-4 py-2 flex-wrap">
                <Badge variant="outline" className="gap-2">
                  <Shield className="h-4 w-4" /> {t("landingTpl.trust.ssl")}
                </Badge>
                <Badge variant="outline" className="gap-2">
                  <CheckCircle2 className="h-4 w-4" /> {t("landingTpl.trust.orias")}
                </Badge>
                <Badge variant="outline" className="gap-2">
                  <Star className="h-4 w-4 fill-current" /> {t("landingTpl.trust.reviews")}
                </Badge>
              </div>
            </div>

            {/* Right column — sticky form */}
            <div className="lg:sticky lg:top-24" id="hero">
              <SimplifiedLeadForm insuranceType={insuranceType} insuranceLabel={insuranceLabel} />
            </div>
          </div>
        </section>

        {/* Testimonials */}
        {testimonials.length > 0 && (
          <section className="bg-muted/30 py-12 md:py-16">
            <div className="container mx-auto px-4 max-w-6xl">
              <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
                {t("landingTpl.testimonials.title")}
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {testimonials.map((tm, i) => (
                  <Card key={i} className="p-6 rounded-3xl backdrop-blur-md bg-card/80 border border-border/60 hover-scale">
                    <div className="flex gap-0.5 mb-3">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Star key={j} className="h-4 w-4 fill-accent text-accent" />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground italic mb-4">"{tm.text}"</p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold">
                        {tm.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{tm.name}</p>
                        <p className="text-xs text-muted-foreground">{tm.location}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* FAQ */}
        {faqs.length > 0 && (
          <section className="container mx-auto px-4 py-12 md:py-16 max-w-4xl">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
              {t("landingTpl.faq.title")}
            </h2>
            <div className="space-y-4">
                 {optimizedFaqs.map((f, i) => (
                <Card key={i} className="p-6 rounded-2xl backdrop-blur-md bg-card/80 border border-border/60">
                  <h3 className="font-bold text-base mb-2 text-foreground">{f.question}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{f.answer}</p>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Bottom CTA */}
        <section className="bg-primary text-primary-foreground py-12 md:py-16">
          <div className="container mx-auto px-4 text-center max-w-3xl">
            <h2 className="text-2xl md:text-4xl font-bold mb-4">{bottomCtaTitle}</h2>
            <p className="text-lg opacity-90 mb-8">{bottomCtaDescription}</p>
            <a
              href="#hero"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="inline-block bg-accent text-accent-foreground px-8 py-4 rounded-lg font-bold text-lg hover:opacity-90 transition-opacity"
            >
              👉 {t("landingTpl.bottomCta.button")}
            </a>
          </div>
        </section>
      </main>

      <SimpleFooter />
    </div>
  );
};

export default AdsLandingTemplate;
