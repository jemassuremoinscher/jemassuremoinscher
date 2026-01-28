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
import { BlogHighlights } from "@/components/blog/BlogHighlights";
import PartnersSlider from "@/components/trust/PartnersSlider";
import BentoSocialProof from "@/components/trust/BentoSocialProof";
import { addOrganizationSchema, addServiceSchema, addFAQSchema, addAggregateRatingSchema } from "@/utils/seoUtils";

const Index = () => {
  const organizationSchema = addOrganizationSchema();
  
  const serviceSchema = addServiceSchema({
    name: "Comparateur d'Assurances en Ligne",
    description: "Comparez gratuitement les meilleures offres d'assurance auto, santé, habitation, vie et animaux en France. Devis en 2 minutes.",
    provider: "jemassuremoinscher",
    areaServed: "France"
  });

  const ratingSchema = addAggregateRatingSchema(
    "jemassuremoinscher",
    4.8,
    2547
  );

  const faqSchema = addFAQSchema([
    {
      question: "Comment fonctionne le comparateur d'assurance ?",
      answer: "Notre comparateur analyse votre profil et vos besoins pour vous présenter les meilleures offres d'assurance adaptées. Gratuit, rapide et sans engagement."
    },
    {
      question: "Combien puis-je économiser avec un comparateur ?",
      answer: "Nos utilisateurs économisent en moyenne 947€ par an en comparant leurs assurances. L'économie varie selon le type d'assurance et votre profil."
    },
    {
      question: "Est-ce vraiment gratuit ?",
      answer: "Oui, notre service de comparaison est 100% gratuit et sans engagement. Vous ne payez que si vous souscrivez à une assurance."
    }
  ]);

  return (
    <div className="min-h-screen">
      <SEO 
        title="jemassuremoinscher - Économisez jusqu'à 947€/an"
        description="Comparez gratuitement les meilleures assurances auto, santé, habitation, animaux et prêt en France. Économisez en moyenne 947€ par an. Devis gratuit en 2 minutes avec nos partenaires Allianz, AXA, Groupama, MAIF."
        keywords="comparateur assurance france, devis assurance gratuit, économiser assurance, meilleure assurance, assurance pas cher"
        canonical="https://www.assurmoinschere.fr/"
        jsonLd={[organizationSchema, serviceSchema, ratingSchema, faqSchema]}
      />
      <Header />
      <main id="main-content" role="main">
        <Hero />
        <PartnersSlider />
        <BentoSocialProof />
        <TrustBadges />
        <Features />
        <Partners />
        <ReviewsWidget />
        <Testimonials />
        <CallbackForm />
        <BlogHighlights />
        <FAQ />
        <NewsletterSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
