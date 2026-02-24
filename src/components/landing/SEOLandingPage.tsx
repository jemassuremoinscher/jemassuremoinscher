import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";
import SEOOptimized from "@/components/SEOOptimized";
import InsuranceFAQ from "@/components/insurance/InsuranceFAQ";
import { addServiceSchema, addFAQSchema, addBreadcrumbSchema } from "@/utils/seoUtils";
import arthurThumbsUp from "@/assets/mascotte/arthur-thumbs-up.png";
import arthurFlying from "@/assets/mascotte/arthur-flying.png";

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
    provider: "jemassuremoinscher",
    areaServed: "France",
  });
  const faqSchema = addFAQSchema(faqs);

  return (
    <div className="min-h-screen">
      <SEOOptimized
        title={title}
        description={metaDescription}
        keyword={keyword}
        keywords={keywords}
        canonical={canonical}
        jsonLd={[breadcrumbSchema, serviceSchema, faqSchema]}
      />
      <Header />

      {/* Hero Banner */}
      <section className="bg-gradient-to-br from-primary/5 to-primary/10 py-16 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center relative">
            <img
              src={arthurThumbsUp}
              alt="Arthur mascotte"
              className="hidden lg:block absolute -left-32 bottom-0 w-32 h-auto"
              loading="eager"
              decoding="async"
            />
            <div className="flex justify-center mb-6">
              <div className="p-4 rounded-full bg-primary/10">
                <HeroIcon className="h-12 w-12 text-primary" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              {heroTitle}
            </h1>
            <p className="text-xl text-muted-foreground mb-8">{heroSubtitle}</p>
            <Button size="lg" className="text-lg px-8 py-6" asChild>
              <a href={ctaLink}>{ctaLabel}</a>
            </Button>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-12">
        {/* Advantages */}
        <section className="max-w-4xl mx-auto mb-12">
          <div className="grid md:grid-cols-3 gap-6">
            {advantages.map((item, index) => (
              <Card key={index} className="p-6 text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 rounded-full bg-primary/10">
                    <item.icon className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.description}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Rich SEO Content */}
        <section className="max-w-4xl mx-auto mb-16">
          <Card className="p-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">{contentTitle}</h2>
            <div
              className="prose prose-lg max-w-none text-muted-foreground leading-relaxed"
              dangerouslySetInnerHTML={{ __html: contentBody }}
            />
          </Card>
        </section>

        {/* FAQ */}
        <InsuranceFAQ title={faqTitle} faqs={faqs} />

        {/* Bottom CTA */}
        {bottomCtaTitle && (
          <section className="max-w-4xl mx-auto mt-16 mb-8">
            <Card className="p-8 bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20 text-center relative overflow-hidden">
              <img
                src={arthurFlying}
                alt="Arthur mascotte"
                className="hidden md:block absolute -right-8 -bottom-4 w-28 h-auto opacity-80"
                loading="lazy"
              />
              <h2 className="text-2xl font-bold text-foreground mb-4">
                {bottomCtaTitle}
              </h2>
              {bottomCtaDescription && (
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  {bottomCtaDescription}
                </p>
              )}
              <Button size="lg" className="text-lg px-8 py-6" asChild>
                <a href={bottomCtaLink || ctaLink}>
                  {bottomCtaLabel || ctaLabel}
                </a>
              </Button>
            </Card>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default SEOLandingPage;
