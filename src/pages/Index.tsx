import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Partners from "@/components/Partners";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import { NewsletterSection } from "@/components/NewsletterSection";
import SEO from "@/components/SEO";
import { CallbackForm } from "@/components/contact/CallbackForm";
import { TrustBadges } from "@/components/trust/TrustBadges";
import { SocialProof } from "@/components/trust/SocialProof";
import { ReviewsWidget } from "@/components/trust/ReviewsWidget";
import { InsuranceQuiz } from "@/components/quiz/InsuranceQuiz";

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
      <main id="main-content" role="main">
        <Hero />
        <TrustBadges />
        <Features />
        <InsuranceQuiz />
        <SocialProof />
        <Partners />
        <ReviewsWidget />
        <Testimonials />
        <CallbackForm />
        <FAQ />
        <NewsletterSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
