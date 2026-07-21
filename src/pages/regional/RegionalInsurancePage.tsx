import { useParams, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import RegionalDataWidget from "@/components/regional/RegionalDataWidget";
import { getDepartmentBySlug } from "@/data/departmentsData";
import ArthurCTABubble from "@/components/ArthurCTABubble";
import { lazy, Suspense } from "react";

const RelatedInsuranceLinks = lazy(() => import("@/components/insurance/RelatedInsuranceLinks"));
const SemanticFAQ = lazy(() => import("@/components/SemanticFAQ"));

export default function RegionalInsurancePage() {
  const { department } = useParams<{ department: string }>();
  const dept = department ? getDepartmentBySlug(department) : undefined;

  if (!dept) return <Navigate to="/assurance-auto" replace />;

  const title = `Assurance Auto ${dept.name} (${dept.code}) — Comparateur & Prix 2026`;
  const description = `Comparez les prix de l'assurance auto en ${dept.name}. Prix moyen : ${dept.avgPriceAuto}€/an. Trouvez l'assureur le moins cher dans le ${dept.code} avec notre comparateur gratuit.`;

  const genericFaq = [
    {
      question: `Quel est le prix moyen de l'assurance auto en ${dept.name} ?`,
      answer: `Le prix moyen de l'assurance auto en ${dept.name} (${dept.code}) est de ${dept.avgPriceAuto}€ par an en 2026. Ce tarif varie selon votre profil, votre véhicule et vos garanties.`,
    },
    {
      question: `Quel est l'assureur le moins cher en ${dept.name} ?`,
      answer: `En ${dept.name}, l'assureur le moins cher ce mois-ci est ${dept.topInsurers[0]?.name} avec un tarif à partir de ${dept.topInsurers[0]?.price}€/an. Comparez gratuitement pour trouver la meilleure offre.`,
    },
    {
      question: `Comment réduire le prix de son assurance auto dans le ${dept.code} ?`,
      answer: `Pour réduire votre prime en ${dept.name}, comparez les offres de plusieurs assureurs, optez pour un paiement annuel, augmentez votre franchise et profitez des réductions en ligne.`,
    },
  ];

  const faqItems = dept.localFaq && dept.localFaq.length > 0 ? dept.localFaq : genericFaq;

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={`https://www.jemassuremoinscher.fr/assurance-auto/${dept.slug}`} />
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
              { label: dept.name },
            ]}
          />

          <h1 className="text-2xl md:text-3xl font-extrabold text-foreground mt-6 mb-2">
            Assurance Auto en {dept.name} ({dept.code})
          </h1>
          <p className="text-muted-foreground mb-8 max-w-2xl">
            Trouvez l'assurance auto la moins chère en {dept.name}. Comparez les tarifs de {dept.topInsurers.length}+ assureurs et économisez jusqu'à 40% sur votre prime.
          </p>

          <RegionalDataWidget
            insuranceType="auto"
            initialDepartment={dept.slug}
          />

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
