import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOOptimized from "@/components/SEOOptimized";
import Breadcrumbs from "@/components/Breadcrumbs";
import ArthurHero from "@/components/insurance/ArthurHero";
import AvisGoogle from "@/components/trust/AvisGoogle";
import { Star, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { addBreadcrumbSchema } from "@/utils/seoUtils";
import { useLanguage } from "@/contexts/LanguageContext";
import arthurThumbsUp from "@/assets/mascotte/arthur-thumbs-up.webp";
import arthurFlying from "@/assets/mascotte/arthur-flying.webp";
import { GOOGLE_REVIEWS_PUBLIC_URL } from "@/config/site";

// URL spéciale d'écriture (g.page/r/.../review)
const GOOGLE_REVIEW_WRITE_URL = "https://g.page/r/CQ4Z3ah_s8jLEBE/review";

const AvisClients = () => {
  const { t } = useLanguage();

  const breadcrumbSchema = addBreadcrumbSchema([
    { name: "Accueil", url: "https://www.jemassuremoinscher.fr/" },
    { name: "Avis Clients", url: "https://www.jemassuremoinscher.fr/avis-clients" },
  ]);

  return (
    <div className="min-h-screen bg-background">
      <SEOOptimized
        title={t("seo.reviews.title")}
        description={t("seo.reviews.description")}
        keyword="avis clients assurance"
        keywords="témoignages assurance, retour expérience, satisfaction"
        canonical="https://www.jemassuremoinscher.fr/avis-clients"
        jsonLd={[breadcrumbSchema]}
      />
      <Header />

      <main id="main-content">
        <div className="container mx-auto px-4 pt-4">
          <Breadcrumbs items={[{ label: t("reviewsPage.title") }]} />
        </div>

        {/* Hero */}
        <section className="relative pt-6 pb-10 md:pt-8 md:pb-14">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <ArthurHero
                imageSrc={arthurThumbsUp}
                imageAlt={t("a11y.avis.mascotAlt1")}
                title={t("reviewsPage.title")}
                subtitle={t("reviewsPage.subtitle")}
                ctaLabel={t("insPage.compareNowBtn")}
                onCtaClick={() => {
                  window.location.href = "/comparateur";
                }}
              />
            </div>
          </div>
        </section>

        {/* Real Google reviews — only renders if the API returns data */}
        <AvisGoogle injectJsonLd />

        <div className="container mx-auto px-4 py-10 md:py-14">
          <div className="max-w-5xl mx-auto space-y-10">
            {/* Share your review */}
            <div className="glass-card p-8 md:p-10 rounded-[2rem] bg-gradient-to-br from-primary/5 to-accent/5 text-center">
              <Quote className="w-10 h-10 text-primary/20 mx-auto mb-4" />
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
                {t("reviewsPage.shareTitle")}
              </h2>
              <p className="text-muted-foreground max-w-lg mx-auto mb-6">
                {t("reviewsPage.shareDesc")}
              </p>
              <Button asChild size="lg" className="rounded-full">
                <a href={GOOGLE_REVIEW_WRITE_URL} target="_blank" rel="noopener noreferrer">
                  Laisser un avis sur Google
                  <Star className="ml-2 h-4 w-4 fill-current" aria-hidden="true" />
                </a>
              </Button>
            </div>

            {/* CTA */}
            <div className="relative bg-gradient-to-r from-primary to-primary/80 rounded-[2rem] p-8 md:p-12 text-center overflow-visible">
              <div className="relative z-10">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  {t("reviewsPage.ctaTitle")}
                </h2>
                <p className="text-white/80 mb-6 max-w-xl mx-auto">
                  {t("reviewsPage.ctaDesc")}
                </p>
                <a
                  href="/comparateur"
                  className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold px-8 py-4 rounded-full text-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  {t("insPage.compareNowBtn")}
                </a>
              </div>
              <img
                src={arthurFlying}
                alt={t("a11y.avis.mascotAlt2")}
                width={144}
                height={144}
                loading="lazy"
                className="absolute -top-10 right-4 md:right-12 h-16 sm:h-24 md:h-36 object-contain pointer-events-none select-none"
              />
            </div>

            {/* Discreet pointer to public Google profile */}
            <p className="text-center text-sm text-muted-foreground">
              Tous nos avis sont publiés sur notre{" "}
              <a
                href={GOOGLE_REVIEWS_PUBLIC_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline font-medium"
              >
                fiche Google Business
              </a>
              .
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AvisClients;
