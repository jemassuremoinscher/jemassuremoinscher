import Header from "@/components/Header";
import Hero from "@/components/Hero";
import SEO from "@/components/SEO";
import QuickQuoteSection from "@/components/quote/QuickQuoteSection";
import PartnersSlider from "@/components/trust/PartnersSlider";
import BentoSocialProof from "@/components/trust/BentoSocialProof";
import WhyUsComparison from "@/components/comparison/WhyUsComparison";
import HowItWorks from "@/components/sections/HowItWorks";
import SEOFaq from "@/components/sections/SEOFaq";
import GuidesSection from "@/components/sections/GuidesSection";
import SimpleFooter from "@/components/sections/SimpleFooter";
import StickyCTA from "@/components/StickyCTA";
import { addOrganizationSchema, addServiceSchema, addFAQSchema, addAggregateRatingSchema } from "@/utils/seoUtils";
const Index = () => {
  const organizationSchema = addOrganizationSchema();
  const serviceSchema = addServiceSchema({
    name: "Comparateur d'Assurances en Ligne",
    description: "Comparez gratuitement les meilleures offres d'assurance auto, santé, habitation, vie et animaux en France. Devis en 2 minutes.",
    provider: "jemassuremoinscher",
    areaServed: "France"
  });
  const ratingSchema = addAggregateRatingSchema("jemassuremoinscher", 4.8, 2547);
  const faqSchema = addFAQSchema([{
    question: "Comment économiser sur mon assurance auto ?",
    answer: "Pour économiser sur votre assurance auto, comparez les offres de plusieurs assureurs grâce à notre comparateur gratuit. En moyenne, nos utilisateurs économisent 320€ par an."
  }, {
    question: "Est-ce vraiment gratuit ?",
    answer: "Oui, notre service de comparaison est 100% gratuit et sans engagement. Vous ne payez jamais de frais supplémentaires."
  }, {
    question: "Puis-je changer d'assurance n'importe quand ?",
    answer: "Depuis la loi Hamon de 2015, vous pouvez résilier votre contrat d'assurance auto, moto ou habitation à tout moment après la première année."
  }]);
  return <div className="min-h-screen">
      <SEO title="jemassuremoinscher - Économisez jusqu'à 40% sur votre assurance" description="Comparez gratuitement les meilleures assurances auto, santé, habitation, animaux et vie en France. 50+ assureurs comparés en 2 minutes. Service 100% gratuit." keywords="comparateur assurance france, devis assurance gratuit, économiser assurance, meilleure assurance, assurance pas cher" canonical="https://www.jemassuremoinscher.fr/" jsonLd={[organizationSchema, serviceSchema, ratingSchema, faqSchema]} />
      <Header />
      <main id="main-content" role="main">
        <Hero />
        <QuickQuoteSection />
        <PartnersSlider />
        <BentoSocialProof />
        <WhyUsComparison />
        <HowItWorks />
        <SEOFaq />
        <GuidesSection />
      </main>
      <SimpleFooter />
      <StickyCTA />
    </div>;
};
export default Index;