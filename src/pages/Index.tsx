import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Partners from "@/components/Partners";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import { NewsletterSection } from "@/components/NewsletterSection";
import SEO from "@/components/SEO";

const Index = () => {
  return (
    <div className="min-h-screen">
      <SEO 
        title="Le Comparateur Assurance - Économisez jusqu'à 947€/an"
        description="Comparez gratuitement les meilleures assurances auto, santé, habitation, animaux et prêt en France. Économisez en moyenne 947€ par an. Devis gratuit en 2 minutes avec nos partenaires Allianz, AXA, Groupama, MAIF."
        keywords="comparateur assurance france, devis assurance gratuit, économiser assurance, meilleure assurance, assurance pas cher"
        canonical="https://votre-domaine.fr/"
      />
      <Header />
      <Hero />
      <Features />
      <Partners />
      <Testimonials />
      <FAQ />
      <NewsletterSection />
      <Footer />
    </div>
  );
};

export default Index;
