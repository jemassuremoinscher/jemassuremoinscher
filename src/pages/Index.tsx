import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Partners from "@/components/Partners";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import { NewsletterSection } from "@/components/NewsletterSection";

const Index = () => {
  return (
    <div className="min-h-screen">
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
