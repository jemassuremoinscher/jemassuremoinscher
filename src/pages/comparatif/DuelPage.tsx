import { useParams, Navigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import InsuranceComparisonDuel from "@/components/comparison/InsuranceComparisonDuel";
import { getDuelBySlug, getAllDuels } from "@/data/duelData";
import { lazy, Suspense } from "react";

const RelatedInsuranceLinks = lazy(() => import("@/components/insurance/RelatedInsuranceLinks"));

export default function DuelPage() {
  const { slug } = useParams<{ slug: string }>();
  const duel = slug ? getDuelBySlug(slug) : null;

  if (!duel) {
    // Show list of available duels
    const allDuels = getAllDuels();
    return (
      <>
        <Helmet>
          <title>Comparatif Assureurs — Duels Face à Face | jemassuremoinscher.fr</title>
          <meta name="description" content="Comparez les assureurs auto face à face : prix, franchise, avis clients. Trouvez le meilleur assureur pour votre profil." />
          <link rel="canonical" href="https://jemassuremoinscher.fr/comparatif" />
        </Helmet>
        <Header />
        <main id="main-content" className="min-h-screen bg-background">
          <div className="max-w-4xl mx-auto px-4 py-8">
            <Breadcrumbs items={[{ label: "Accueil", href: "/" }, { label: "Comparatifs" }]} />
            <h1 className="text-2xl md:text-3xl font-extrabold text-foreground mt-6 mb-2">
              Comparatifs d'assureurs — Duels face à face
            </h1>
            <p className="text-muted-foreground mb-8">
              Choisissez un duel pour voir notre analyse complète : prix, service, avis clients et verdict expert.
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              {allDuels.map(d => (
                <Link
                  key={d.slug}
                  to={`/comparatif/${d.slug}`}
                  className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 shadow-sm hover:shadow-[var(--shadow-hover)] transition-all group"
                >
                  <img src={d.insurerA.logo} alt={d.insurerA.name} width={40} height={40} className="w-10 h-10 object-contain" loading="lazy" />
                  <span className="font-black text-primary text-lg">VS</span>
                  <img src={d.insurerB.logo} alt={d.insurerB.name} width={40} height={40} className="w-10 h-10 object-contain" loading="lazy" />
                  <span className="flex-1 font-semibold text-foreground text-sm group-hover:text-primary transition-colors">
                    {d.insurerA.name} vs {d.insurerB.name}
                  </span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-foreground group-hover:text-primary transition-colors"><polyline points="9 18 15 12 9 6"/></svg>
                </Link>
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const { insurerA: a, insurerB: b } = duel;
  const title = `${a.name} vs ${b.name} — Comparatif Assurance Auto 2026`;
  const description = `Comparatif ${a.name} vs ${b.name} : prix (${a.prixMoyen}€ vs ${b.prixMoyen}€), franchise, avis clients, rapidité de remboursement. Notre verdict d'expert.`;

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        name: `Assurance Auto ${a.name}`,
        image: a.logo,
        brand: { "@type": "Brand", name: a.name },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: a.avisNote,
          reviewCount: a.avisCount,
          bestRating: 5,
        },
        offers: {
          "@type": "Offer",
          price: a.prixMoyen,
          priceCurrency: "EUR",
          priceSpecification: { "@type": "UnitPriceSpecification", unitText: "an" },
        },
      },
      {
        "@type": "Product",
        name: `Assurance Auto ${b.name}`,
        image: b.logo,
        brand: { "@type": "Brand", name: b.name },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: b.avisNote,
          reviewCount: b.avisCount,
          bestRating: 5,
        },
        offers: {
          "@type": "Offer",
          price: b.prixMoyen,
          priceCurrency: "EUR",
          priceSpecification: { "@type": "UnitPriceSpecification", unitText: "an" },
        },
      },
    ],
  };

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={`https://jemassuremoinscher.fr/comparatif/${duel.slug}`} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta name="robots" content="index, follow" />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Helmet>

      <Header />
      <main id="main-content" className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Breadcrumbs
            items={[
              { label: "Accueil", href: "/" },
              { label: "Comparatifs", href: "/comparatif" },
              { label: `${a.name} vs ${b.name}` },
            ]}
          />

          <h1 className="text-2xl md:text-3xl font-extrabold text-foreground mt-6 mb-2">
            {a.name} vs {b.name} : quel assureur auto choisir en 2026 ?
          </h1>
          <p className="text-muted-foreground mb-8 max-w-2xl">
            Comparaison détaillée entre {a.name} et {b.name} sur 5 critères clés. Prix, franchise, avis clients — notre verdict objectif pour vous aider à choisir.
          </p>

          <InsuranceComparisonDuel duel={duel} />

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
