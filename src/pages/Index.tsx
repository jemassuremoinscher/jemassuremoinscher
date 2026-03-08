import { lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import SEOOptimized from "@/components/SEOOptimized";
import { addOrganizationSchema, addServiceSchema, addFAQSchema, addAggregateRatingSchema } from "@/utils/seoUtils";

// Lazy load below-the-fold sections
const QuickQuoteSection = lazy(() => import("@/components/quote/QuickQuoteSection"));
const PartnersSlider = lazy(() => import("@/components/trust/PartnersSlider"));
const WhyUsComparison = lazy(() => import("@/components/comparison/WhyUsComparison"));
const HowItWorks = lazy(() => import("@/components/sections/HowItWorks"));
const SEOFaq = lazy(() => import("@/components/sections/SEOFaq"));
const GuidesSection = lazy(() => import("@/components/sections/GuidesSection"));
const SEOContent = lazy(() => import("@/components/sections/SEOContent"));
const SimpleFooter = lazy(() => import("@/components/sections/SimpleFooter"));
const StickyCTA = lazy(() => import("@/components/StickyCTA"));

const Index = () => {
  const organizationSchema = addOrganizationSchema();
  const serviceSchema = addServiceSchema({
    name: "Comparateur d'Assurances Moins Chères en Ligne",
    description: "Comparateur d'assurances gratuit pour trouver une assurance moins chère. Comparez 50+ assureurs : auto, santé, habitation. Alternative à LesFurets. Changez d'assurance facilement.",
    provider: "jemassuremoinscher",
    areaServed: "France"
  });
  const ratingSchema = addAggregateRatingSchema("jemassuremoinscher", 4.8, 2547);
  const faqSchema = addFAQSchema([{
    question: "Comment trouver une assurance moins chère ?",
    answer: "Pour trouver une assurance moins chère, utilisez le comparateur d'assurances jemassuremoinscher. Comparez les offres de 50+ assureurs gratuitement en 2 minutes. Nos utilisateurs économisent en moyenne 320€ par an. C'est plus complet et personnalisé qu'un comparateur traditionnel comme LesFurets."
  }, {
    question: "Comment changer d'assurance facilement ?",
    answer: "Grâce à la loi Hamon, changer d'assurance est simple : après la première année de contrat, vous pouvez résilier à tout moment votre assurance auto, moto ou habitation. Utilisez notre comparateur d'assurances pour trouver une assurance moins chère, puis votre nouvel assureur s'occupe de la résiliation."
  }, {
    question: "Quelle est la meilleure alternative à LesFurets ?",
    answer: "jemassuremoinscher est la meilleure alternative à LesFurets car nous comparons 50+ assureurs (Allianz, AXA, Groupama, MAIF) avec un accompagnement personnalisé. Un conseiller dédié vous rappelle sous 2 heures pour vous aider à trouver l'assurance moins chère adaptée à vos besoins, contrairement aux comparateurs qui vous laissent seul."
  }, {
    question: "Combien peut-on économiser avec un comparateur d'assurances ?",
    answer: "Avec notre comparateur d'assurances, nos clients économisent en moyenne 320€ par an sur leur assurance auto et jusqu'à 40% sur tous types de contrats. En comparant régulièrement et en changeant d'assurance quand c'est avantageux, vous pouvez réduire significativement votre budget assurance."
  }, {
    question: "Quels types d'assurance moins chère peut-on comparer ?",
    answer: "Notre comparateur d'assurances couvre toutes les catégories : assurance auto moins chère, mutuelle santé, assurance habitation, moto, animaux, vie, emprunteur, prévoyance, RC Pro, MRP, GLI et PNO. Nous travaillons avec 50+ assureurs pour vous proposer l'assurance la moins chère du marché."
  }]);

  return (
    <div className="min-h-screen">
      <SEOOptimized
        title="Assurance Moins Chère : Comparer gratuitement en 2 minutes"
        description="Comparateur d'assurances gratuit. Comparez 50+ assureurs, trouvez l'assurance moins chère. Économisez 40%."
        keyword="assurance moins chère"
        keywords="comparateur d'assurances, changer d'assurance, lesfurets alternative"
        canonical="https://www.jemassuremoinscher.fr/"
        jsonLd={[organizationSchema, serviceSchema, ratingSchema, faqSchema]}
      />
      <Header />
      <main id="main-content" role="main">
        <Hero />
        <Suspense fallback={null}>
          <QuickQuoteSection />
          <PartnersSlider />
          <WhyUsComparison />
          <HowItWorks />
          <SEOFaq />
          <GuidesSection />
          <SEOContent />
        </Suspense>
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
          <li><Link to="/qui-sommes-nous">À propos de jemassuremoinscher - Comparateur d'assurances</Link></li>
          <li><Link to="/nos-partenaires">Nos 50+ partenaires assureurs</Link></li>
          <li><Link to="/avis-clients">Avis clients - Comparateur d'assurances moins chères</Link></li>
          <li><Link to="/contact">Contactez notre équipe</Link></li>
        </ul>
      </nav>
      <Suspense fallback={null}>
        <SimpleFooter />
        <StickyCTA />
      </Suspense>
    </div>
  );
};

export default Index;