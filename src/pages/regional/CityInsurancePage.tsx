import { useParams, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import RegionalDataWidget from "@/components/regional/RegionalDataWidget";
import { getCityBySlug } from "@/data/citiesData";
import ArthurCTABubble from "@/components/ArthurCTABubble";
import { lazy, Suspense } from "react";

const RelatedInsuranceLinks = lazy(() => import("@/components/insurance/RelatedInsuranceLinks"));
const SemanticFAQ = lazy(() => import("@/components/SemanticFAQ"));

export default function CityInsurancePage() {
  const { slug } = useParams<{ slug: string }>();
  const city = slug ? getCityBySlug(slug) : undefined;

  if (!city) return <Navigate to="/assurance-auto" replace />;

  const title = `Assurance Auto ${city.name} — Comparateur & Prix 2026`;
  const description = `Comparez les prix de l'assurance auto ${city.name}. Prix moyen : ${city.avgPriceAuto}€/an. Trouvez l'assureur le moins cher à ${city.name} avec notre comparateur gratuit.`;

  const faqItems = city.localFaq;

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={`https://www.jemassuremoinscher.fr/assurance-auto/ville/${city.slug}`} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta name="robots" content="index, follow" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqItems.map(f => ({
              "@type": "Question",
              name: f.question,
              acceptedAnswer: { "@type": "Answer", text: f.answer },
            })),
          })}
        </script>
      </Helmet>

      <Header />
      <main id="main-content" className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Breadcrumbs
            items={[
              { label: "Accueil", href: "/" },
              { label: "Assurance Auto", href: "/assurance-auto" },
              { label: city.name },
            ]}
          />

          <h1 className="text-2xl md:text-3xl font-extrabold text-foreground mt-6 mb-2">
            Assurance Auto à {city.name}
          </h1>
          <p className="text-muted-foreground mb-8 max-w-2xl">
            Trouvez l'assurance auto la moins chère à {city.name}. Comparez les tarifs de plusieurs assureurs et économisez sur votre prime.
          </p>

          {city.departmentSlug && (
            <RegionalDataWidget insuranceType="auto" initialDepartment={city.departmentSlug} />
          )}

          <section
            className="prose prose-lg max-w-none mt-12 prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground"
            dangerouslySetInnerHTML={{ __html: city.uniqueContent }}
          />

          {city.stats && city.stats.length > 0 && (
            <section className="mt-8" aria-label="Statistiques locales">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {city.stats.map((s, i) => (
                  <div key={i} className="rounded-xl border border-border bg-card p-4 shadow-sm">
                    <div className="text-xs uppercase tracking-wide text-muted-foreground">{s.label}</div>
                    <div className="mt-1 text-lg font-semibold text-foreground">{s.value}</div>
                  </div>
                ))}
              </div>
              {city.source && (
                <p className="mt-3 text-xs text-muted-foreground italic">{city.source}</p>
              )}
            </section>
          )}

          <div className="mt-12">
            <ArthurCTABubble />
          </div>

          <Suspense fallback={null}>
            <section className="mt-12">
              <SemanticFAQ items={faqItems} />
            </section>
          </Suspense>

          <Suspense fallback={null}>
            <div className="mt-12">
              <RelatedInsuranceLinks currentPage="auto" />
            </div>
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  );
}
