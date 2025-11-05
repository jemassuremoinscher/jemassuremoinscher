import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Partners from "@/components/Partners";
import Footer from "@/components/Footer";
import { InsuranceSampleData } from "@/components/InsuranceSampleData";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <Features />
      <Partners />
      <Footer />
      <InsuranceSampleData />
    </div>
  );
};

export default Index;
