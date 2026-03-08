import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import SEOOptimized from "@/components/SEOOptimized";
import SemanticFAQ, { type FAQItem } from "@/components/SemanticFAQ";
import { addBreadcrumbSchema, addFAQSchema, addServiceSchema } from "@/utils/seoUtils";
import { motion } from "framer-motion";

export interface SEOContentBlock {
  title: string;
  /** HTML or plain text – rendered via dangerouslySetInnerHTML for rich formatting */
  content: string;
}

export interface SEOCategoryPageProps {
  /* ---- SEO metadata ---- */
  metaTitle: string;
  metaDescription: string;
  canonicalPath: string;

  /* ---- Hero ---- */
  h1: string;
  subtitle: string;

  /* ---- Content blocks (min 3 recommended) ---- */
  contentBlocks: SEOContentBlock[];

  /* ---- FAQ ---- */
  faqItems: FAQItem[];

  /* ---- CTA ---- */
  ctaLabel?: string;
  ctaLink?: string;

  /* ---- Optional JSON-LD extras ---- */
  serviceName?: string;
  serviceDescription?: string;
}

const CTAButton = ({
  label,
  link,
}: {
  label: string;
  link: string;
}) => (
  <div className="flex justify-center">
    <Button asChild size="lg" className="gap-2 text-base font-bold px-8">
      <Link to={link}>
        {label}
        <ArrowRight className="h-5 w-5" />
      </Link>
    </Button>
  </div>
);

const SEOCategoryPage = ({
  metaTitle,
  metaDescription,
  canonicalPath,
  h1,
  subtitle,
  contentBlocks,
  faqItems,
  ctaLabel = "Lancer le comparateur",
  ctaLink = "/comparateur",
  serviceName,
  serviceDescription,
}: SEOCategoryPageProps) => {
  const baseUrl = "https://jemassuremoinscher.fr";

  // Build JSON-LD schemas
  let jsonLd = addBreadcrumbSchema(
    {},
    [
      { name: "Accueil", url: baseUrl },
      { name: h1, url: `${baseUrl}${canonicalPath}` },
    ]
  );

  jsonLd = addFAQSchema(jsonLd, faqItems);

  if (serviceName && serviceDescription) {
    jsonLd = addServiceSchema(jsonLd, {
      name: serviceName,
      description: serviceDescription,
      url: `${baseUrl}${canonicalPath}`,
    });
  }

  return (
    <>
      <SEOOptimized
        title={metaTitle}
        description={metaDescription}
        canonicalUrl={`${baseUrl}${canonicalPath}`}
        jsonLd={jsonLd}
      />

      <Header />

      <main id="main-content" className="min-h-screen">
        {/* ─── Breadcrumbs ─── */}
        <div className="container mx-auto px-4 pt-4">
          <Breadcrumbs />
        </div>

        {/* ─── Hero Section ─── */}
        <section className="py-12 md:py-20 bg-gradient-to-b from-muted/40 to-background">
          <div className="container mx-auto px-4 text-center max-w-3xl">
            <motion.h1
              className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground leading-tight mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {h1}
            </motion.h1>
            <motion.p
              className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-8"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              {subtitle}
            </motion.p>

            <CTAButton label={ctaLabel} link={ctaLink} />
          </div>
        </section>

        {/* ─── Content Blocks (300+ mots SEO) ─── */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4 max-w-3xl space-y-10">
            {contentBlocks.map((block, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4">
                  {block.title}
                </h2>
                <div
                  className="prose prose-sm md:prose-base text-muted-foreground leading-relaxed [&_strong]:text-foreground [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-1"
                  dangerouslySetInnerHTML={{ __html: block.content }}
                />
              </motion.div>
            ))}
          </div>
        </section>

        {/* ─── Mid-page CTA ─── */}
        <section className="py-8 bg-muted/20">
          <CTAButton label={ctaLabel} link={ctaLink} />
        </section>

        {/* ─── FAQ Section ─── */}
        <SemanticFAQ
          items={faqItems}
          title="Questions fréquentes"
          subtitle="Retrouvez les réponses aux questions les plus posées."
        />

        {/* ─── Bottom CTA ─── */}
        <section className="py-10 md:py-14 bg-gradient-to-b from-background to-muted/30">
          <div className="container mx-auto px-4 text-center max-w-2xl">
            <h2 className="text-xl md:text-2xl font-bold text-foreground mb-3">
              Prêt à économiser sur votre assurance ?
            </h2>
            <p className="text-muted-foreground text-sm mb-6">
              Comparez gratuitement en 2 minutes et trouvez l'offre la moins chère.
            </p>
            <CTAButton label={ctaLabel} link={ctaLink} />
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default SEOCategoryPage;
