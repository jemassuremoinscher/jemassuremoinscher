import { useParams, Navigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import InsuranceComparisonDuel from "@/components/comparison/InsuranceComparisonDuel";
import { getDuelBySlug, getAllDuels } from "@/data/duelData";
import { lazy, Suspense, useEffect } from "react";
import { removeStaticHeadDuplicates } from "@/components/SEOOptimized";

const RelatedInsuranceLinks = lazy(() => import("@/components/insurance/RelatedInsuranceLinks"));

export default function DuelPage() {
  const { slug } = useParams<{ slug: string }>();
  const duel = slug ? getDuelBySlug(slug) : null;

  // Helmet seul ne retire pas la description, le canonical et les og:* de
  // index.html : sans ce nettoyage, deux meta description par page.
  useEffect(() => {
    removeStaticHeadDuplicates();
  }, [slug]);

  if (!duel) {
    // Show list of available duels
    const allDuels = getAllDuels();
    return (
      <>
        <Helmet>
          <title>Comparatif Assureurs — Duels Face à Face | jemassuremoinscher.fr</title>
          <meta name="description" content="Comparez les assureurs auto face à face : prix, franchise, avis clients. Trouvez le meilleur assureur pour votre profil." />
          <link rel="canonical" href="https://www.jemassuremoinscher.fr/comparatif" />
          <meta property="og:url" content="https://www.jemassuremoinscher.fr/comparatif" />
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
  // Sans prix d'assureur nommé dans la meta (pas de source datée).
  const description = `Comparatif ${a.name} vs ${b.name} : prix, franchise, assistance et délai de remboursement, à vérifier sur un devis à votre nom.`;

  // Pas de Product/Offer : aucun prix d'assureur nommé sans source datée
  // (décision du 3 octobre 2026).
  const canonical = `https://www.jemassuremoinscher.fr/comparatif/${duel.slug}`;

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonical} />
        <meta property="og:url" content={canonical} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta name="robots" content="index, follow" />
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
            Comparaison entre {a.name} et {b.name} sur la franchise, l'assistance et le délai de remboursement. Le prix dépend de votre profil : comparez-le sur un devis à votre nom.
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
