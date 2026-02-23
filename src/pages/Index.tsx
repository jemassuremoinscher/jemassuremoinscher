import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import SEO from "@/components/SEO";
import QuickQuoteSection from "@/components/quote/QuickQuoteSection";
import PartnersSlider from "@/components/trust/PartnersSlider";
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

  return (
    <div className="min-h-screen">
      <SEO
        title="Jemassuremoinscher - Comparez et Économisez jusqu'à 40%/an"
        description="Comparez gratuitement les meilleures assurances auto, santé, habitation, animaux et prêt en France. Économisez jusqu'à 40% par an. Devis gratuit en 2 minutes avec nos partenaires Allianz, AXA, Groupama, MAIF et autre."
        keywords="comparateur assurance france, devis assurance gratuit, économiser assurance, meilleure assurance, assurance pas cher"
        canonical="https://www.jemassuremoinscher.fr/"
        jsonLd={[organizationSchema, serviceSchema, ratingSchema, faqSchema]}
      />
      <Header />
      <main id="main-content" role="main">
        <Hero />
        <QuickQuoteSection />
        <PartnersSlider />
        <WhyUsComparison />
        <HowItWorks />
        <SEOFaq />
        <GuidesSection />
      </main>
      {/* Hidden internal links for SEO - crawlable but not visible */}
      <nav aria-label="Liens internes" className="sr-only">
        <h2>Nos assurances</h2>
        <ul>
          <li><Link to="/assurance-auto">Assurance auto pas chère</Link></li>
          <li><Link to="/assurance-moto">Assurance moto</Link></li>
          <li><Link to="/assurance-habitation">Assurance habitation</Link></li>
          <li><Link to="/assurance-sante">Mutuelle santé</Link></li>
          <li><Link to="/assurance-animaux">Assurance animaux</Link></li>
          <li><Link to="/assurance-vie">Assurance vie</Link></li>
          <li><Link to="/assurance-pret">Assurance emprunteur</Link></li>
          <li><Link to="/assurance-prevoyance">Assurance prévoyance</Link></li>
          <li><Link to="/assurance-rc-pro">Assurance RC Pro</Link></li>
          <li><Link to="/assurance-mrp">Assurance multirisque professionnelle</Link></li>
          <li><Link to="/assurance-gli">Garantie loyers impayés</Link></li>
          <li><Link to="/assurance-pno">Assurance propriétaire non occupant</Link></li>
        </ul>
        <h2>Informations utiles</h2>
        <ul>
          <li><Link to="/comparateur">Comparateur d'assurances en ligne</Link></li>
          <li><Link to="/blog">Blog assurance - conseils et actualités</Link></li>
          <li><Link to="/glossaire">Glossaire de l'assurance</Link></li>
          <li><Link to="/qui-sommes-nous">À propos de jemassuremoinscher</Link></li>
          <li><Link to="/nos-partenaires">Nos partenaires assureurs</Link></li>
          <li><Link to="/avis-clients">Avis clients</Link></li>
          <li><Link to="/contact">Contactez-nous</Link></li>
        </ul>
      </nav>
      <SimpleFooter />
      <StickyCTA />
    </div>
  );
};

export default Index;