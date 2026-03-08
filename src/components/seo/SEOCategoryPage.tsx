import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs, { type BreadcrumbItem } from "@/components/Breadcrumbs";
import SEOOptimized from "@/components/SEOOptimized";
import SemanticFAQ, { type FAQItem } from "@/components/SemanticFAQ";
import { addBreadcrumbSchema, addFAQSchema, addServiceSchema } from "@/utils/seoUtils";
import { motion } from "framer-motion";

export interface SEOContentBlock {
  title: string;
  /** HTML string – rendered via dangerouslySetInnerHTML for rich formatting */
  content: string;
}

export interface SEOCategoryPageProps {
  metaTitle: string;
  metaDescription: string;
  canonicalPath: string;
  h1: string;
  subtitle: string;
  contentBlocks: SEOContentBlock[];
  faqItems: FAQItem[];
  ctaLabel?: string;
  ctaLink?: string;
  serviceName?: string;
  serviceDescription?: string;
  breadcrumbLabel?: string;
}

const CTAButton = ({ label, link }: { label: string; link: string }) => (
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
  breadcrumbLabel,
}: SEOCategoryPageProps) => {
  const baseUrl = "https://www.jemassuremoinscher.fr";

  const breadcrumbSchemaItems = [
    { name: "Accueil", url: baseUrl },
    { name: breadcrumbLabel || h1, url: `${baseUrl}${canonicalPath}` },
  ];

  // Collect all JSON-LD schemas as an array
  const jsonLdSchemas: object[] = [
    addBreadcrumbSchema(breadcrumbSchemaItems),
    addFAQSchema(faqItems),
  ];

  if (serviceName && serviceDescription) {
    jsonLdSchemas.push(
      addServiceSchema({
        name: serviceName,
        description: serviceDescription,
      })
    );
  }

  const breadcrumbs: BreadcrumbItem[] = [
    { label: breadcrumbLabel || h1 },
  ];

  return (
    <>
      <SEOOptimized
        title={metaTitle}
        description={metaDescription}
        canonical={`${baseUrl}${canonicalPath}`}
        jsonLd={jsonLdSchemas}
      />

      <Header />

      <main id="main-content" className="min-h-screen">
        <div className="container mx-auto px-4 pt-4">
          <Breadcrumbs items={breadcrumbs} />
        </div>

        {/* Hero */}
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

        {/* Content Blocks (300+ mots SEO) */}
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

        {/* Mid-page CTA */}
        <section className="py-8 bg-muted/20">
          <CTAButton label={ctaLabel} link={ctaLink} />
        </section>

        {/* FAQ */}
        <SemanticFAQ items={faqItems} />

        {/* Bottom CTA */}
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
