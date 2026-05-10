import { lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import SEOOptimized from "@/components/SEOOptimized";
import DeferredRender from "@/components/performance/DeferredRender";
import MdReveal from "@/components/motion/MdReveal";
import { addOrganizationSchema, addServiceSchema, addFAQSchema, addBreadcrumbSchema } from "@/utils/seoUtils";
import geoContent from "@/data/geo-content.json";

// Lazy load below-the-fold sections

const Partners = lazy(() => import("@/components/Partners"));
const TrustRow = lazy(() => import("@/components/sections/TrustRow"));
const WhyUsComparison = lazy(() => import("@/components/comparison/WhyUsComparison"));
const HowItWorks = lazy(() => import("@/components/sections/HowItWorks"));
const SEOFaq = lazy(() => import("@/components/sections/SEOFaq"));
const ClientCases = lazy(() => import("@/components/sections/ClientCases"));
const GuidesSection = lazy(() => import("@/components/sections/GuidesSection"));
const SEOContent = lazy(() => import("@/components/sections/SEOContent"));
const ContextualHelp = lazy(() => import("@/components/sections/ContextualHelp"));
const SimpleFooter = lazy(() => import("@/components/sections/SimpleFooter"));


const Index = () => {
  const breadcrumbSchema = addBreadcrumbSchema([{ name: "Accueil", url: "https://www.jemassuremoinscher.fr/" }]);
  const organizationSchema = addOrganizationSchema(geoContent.trust.ratingValue, geoContent.trust.reviewCount);
  const serviceSchema = addServiceSchema({
    name: "Comparateur d'Assurances Moins Chères en Ligne",
    description: "Comparateur d'assurances gratuit pour trouver une assurance moins chère. Comparez 70+ assureurs : auto, santé, habitation. Alternative à LesFurets. Changez d'assurance facilement.",
    provider: "jemassuremoinscher.fr",
    areaServed: "France"
  });

  const financialServiceSchema = {
    "@context": "https://schema.org",
    "@type": "FinancialService",
    "name": "jemassuremoinscher.fr",
    "url": "https://www.jemassuremoinscher.fr",
    "logo": "https://www.jemassuremoinscher.fr/logo.png",
    "description": "Courtier en assurances en ligne. Comparez gratuitement les offres de 70 assureurs partenaires et économisez en moyenne 40% sur votre contrat.",
    "areaServed": {
      "@type": "Country",
      "name": "France"
    },
    "serviceType": "Courtage en assurances",
    "priceRange": "Gratuit"
  };

  const webSiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "jemassuremoinscher.fr",
    "alternateName": "Je M'Assure Moins Cher",
    "url": "https://www.jemassuremoinscher.fr",
    "description": "Comparateur d'assurances gratuit. Comparez 70+ assureurs et trouvez l'assurance moins chère en 2 minutes.",
    "inLanguage": ["fr", "en"],
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://www.jemassuremoinscher.fr/blog?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Le service est-il vraiment gratuit?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Oui, 100% gratuit. Nous sommes rémunérés par les assureurs partenaires."
        }
      },
      {
        "@type": "Question",
        "name": "Combien puis-je économiser?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "En moyenne 280€ par an, soit jusqu'à 40% d'économies."
        }
      },
      {
        "@type": "Question",
        "name": "Combien de temps pour obtenir un devis?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Moins de 2 minutes pour remplir le formulaire. Un conseiller vous rappelle sous 2h."
        }
      },
      {
        "@type": "Question",
        "name": "Comment changer d'assurance?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Grâce à la loi Hamon et la loi Infra-annuelle, c'est simple et gratuit. Nos conseillers gèrent la résiliation."
        }
      },
      {
        "@type": "Question",
        "name": "Quels assureurs comparez-vous?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Plus de 70 assureurs partenaires: AXA, Allianz, MAIF, Generali, MMA, Matmut, Groupama, Gan, MACIF et autres."
        }
      },
      {
        "@type": "Question",
        "name": "Mes données personnelles sont-elles protégées?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Absolument. Nous respectons le RGPD et ne partageons vos informations qu'avec les assureurs sélectionnés pour votre devis."
        }
      }
    ]
  };

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "jemassuremoinscher.fr",
    "url": "https://www.jemassuremoinscher.fr",
    "description": "Comparateur d'assurances gratuit. Comparez 70+ assureurs (auto, habitation, santé, animaux). Économisez jusqu'à 40%.",
    "areaServed": "FR",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "247"
    },
    "sameAs": "https://www.instagram.com/jemassuremoinscher"
  };

  return (
    <div className="min-h-screen">
      <SEOOptimized
        title="Comparateur Assurance Moins Chère | Devis Gratuit"
        description="Comparateur d'assurances gratuit. Comparez 70 assureurs et économisez en moyenne 40%. Devis en 2 min, sans engagement."
        ogTitle="Comparateur Assurance Moins Chère"
        ogDescription="Comparez 70 assureurs gratuitement. Économisez en moyenne 40%."
        twitterDescription="Trouvez l'assurance la moins chère en 2 minutes avec notre comparateur gratuit. Comparez 70 assureurs partenaires (AXA, Allianz, MAIF, Groupama…) et économisez en moyenne 40% sur votre contrat. Sans engagement."
        keyword="assurance moins chère"
        keywords="comparateur d'assurances, changer d'assurance, lesfurets alternative"
        canonical="https://www.jemassuremoinscher.fr"
        ogImage="https://www.jemassuremoinscher.fr/opengraph-image.png"
        jsonLd={[webSiteSchema, organizationSchema, financialServiceSchema, serviceSchema, breadcrumbSchema, faqSchema]}
      />
      <Header />
      <main id="main-content" role="main">
        <Hero />
        <MdReveal variant="up"><TrustRow /></MdReveal>

        <DeferredRender minHeight={300}>
          <Suspense fallback={<div aria-hidden="true" className="min-h-[300px]" />}>
            <MdReveal variant="fade"><Partners /></MdReveal>
          </Suspense>
        </DeferredRender>

        <DeferredRender minHeight={1200}>
          <Suspense fallback={<div aria-hidden="true" className="min-h-[1200px]" />}>
            <MdReveal variant="up"><WhyUsComparison /></MdReveal>
          </Suspense>
        </DeferredRender>

        <DeferredRender minHeight={760}>
          <Suspense fallback={<div aria-hidden="true" className="min-h-[760px]" />}>
            <MdReveal variant="up"><HowItWorks /></MdReveal>
          </Suspense>
        </DeferredRender>

        <DeferredRender minHeight={560}>
          <Suspense fallback={<div aria-hidden="true" className="min-h-[560px]" />}>
            <MdReveal variant="up"><SEOFaq /></MdReveal>
          </Suspense>
        </DeferredRender>

        <DeferredRender minHeight={400}>
          <Suspense fallback={<div aria-hidden="true" className="min-h-[400px]" />}>
            <MdReveal variant="scale"><ClientCases /></MdReveal>
          </Suspense>
        </DeferredRender>

        <DeferredRender minHeight={880}>
          <Suspense fallback={<div aria-hidden="true" className="min-h-[880px]" />}>
            <MdReveal variant="up"><GuidesSection /></MdReveal>
          </Suspense>
        </DeferredRender>

        <DeferredRender minHeight={720}>
          <Suspense fallback={<div aria-hidden="true" className="min-h-[720px]" />}>
            <MdReveal variant="fade"><SEOContent /></MdReveal>
          </Suspense>
        </DeferredRender>

        <DeferredRender minHeight={280}>
          <Suspense fallback={<div aria-hidden="true" className="min-h-[280px]" />}>
            <MdReveal variant="up"><ContextualHelp /></MdReveal>
          </Suspense>
        </DeferredRender>

      </main>
      {/* Hidden internal links for SEO - crawlable but not visible */}
      <nav aria-label="Liens internes" className="sr-only">
        <h2>Assurance moins chère - Nos comparateurs</h2>
        <ul>
          <li><Link to="/assurance-auto">Assurance auto moins chère - Comparateur</Link></li>
          <li><Link to="/assurance-moto">Assurance moto moins chère</Link></li>
          <li><Link to="/assurance-habitation">Assurance habitation moins chère</Link></li>
          <li><Link to="/assurance-sante">Mutuelle santé moins chère - Comparateur</Link></li>
          <li><Link to="/assurance-animaux">Assurance animaux moins chère</Link></li>
          <li><Link to="/assurance-vie">Assurance vie - Meilleur comparateur</Link></li>
          <li><Link to="/assurance-pret">Assurance emprunteur moins chère</Link></li>
          <li><Link to="/assurance-prevoyance">Assurance prévoyance - Comparer les prix</Link></li>
          <li><Link to="/assurance-rc-pro">Assurance RC Pro moins chère</Link></li>
          <li><Link to="/assurance-mrp">Assurance multirisque professionnelle</Link></li>
          <li><Link to="/assurance-gli">Garantie loyers impayés moins chère</Link></li>
          <li><Link to="/assurance-pno">Assurance propriétaire non occupant</Link></li>
        </ul>
        <h2>Changer d'assurance - Informations utiles</h2>
        <ul>
          <li><Link to="/comparateur">Comparateur d'assurances en ligne gratuit - Alternative à LesFurets</Link></li>
          <li><Link to="/blog">Blog assurance - Conseils pour changer d'assurance</Link></li>
          <li><Link to="/glossaire">Glossaire de l'assurance</Link></li>
          <li><Link to="/qui-sommes-nous">À propos de jemassuremoinscher.fr - Comparateur d'assurances</Link></li>
          <li><Link to="/nos-partenaires">Nos 50+ partenaires assureurs</Link></li>
          <li><Link to="/avis-clients">Avis clients - Comparateur d'assurances moins chères</Link></li>
          <li><Link to="/contact">Contactez notre équipe</Link></li>
        </ul>
        <h2>Articles populaires</h2>
        <ul>
          <li><Link to="/blog/loi-hamon-2026-resilier-assurance-3-clics">Loi Hamon 2026 : résilier son assurance en 3 clics</Link></li>
          <li><Link to="/blog/loi-lemoine-2026">Loi Lemoine 2026 : changer d'assurance emprunteur</Link></li>
          <li><Link to="/blog/guide-choisir-assurance-auto-2026">Guide complet assurance auto 2026</Link></li>
          <li><Link to="/blog/top-10-meilleures-mutuelles-sante-2026">Top 10 mutuelles santé 2026</Link></li>
          <li><Link to="/blog/comparatif-habitation-2026">Comparatif assurance habitation 2026</Link></li>
          <li><Link to="/blog/meilleure-assurance-auto-2026-comparatif">Meilleure assurance auto 2026</Link></li>
          <li><Link to="/blog/assurance-jeune-conducteur-2026-moins-cher">Assurance jeune conducteur moins cher</Link></li>
          <li><Link to="/blog/resiliation-assurance-droits-2026">Résiliation assurance : vos droits 2026</Link></li>
          <li><Link to="/blog/mutuelle-sante-reduire-frais-medicaux-2026">Réduire ses frais médicaux avec une mutuelle</Link></li>
          <li><Link to="/blog/nouvelle-reglementation-assurance-2026">Nouvelle réglementation assurance 2026</Link></li>
        </ul>
        <h2>Glossaire assurance</h2>
        <ul>
          <li><Link to="/glossaire/responsabilite-civile">Responsabilité civile</Link></li>
          <li><Link to="/glossaire/sinistre">Sinistre</Link></li>
          <li><Link to="/glossaire/tous-risques">Tous risques</Link></li>
          <li><Link to="/glossaire/tiers">Tiers</Link></li>
          <li><Link to="/glossaire/vetuste">Vétusté</Link></li>
          <li><Link to="/glossaire/ticket-moderateur">Ticket modérateur</Link></li>
        </ul>
      </nav>
      <DeferredRender minHeight={460}>
        <Suspense fallback={<div aria-hidden="true" className="min-h-[460px]" />}>
          <SimpleFooter />
        </Suspense>
      </DeferredRender>
    </div>
  );
};

export default Index;