import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import QuickHelpSection from '@/components/contact/QuickHelpSection';
import { Mail } from 'lucide-react';

const Contact = () => {
  return (
    <>
      <SEO 
        title="Contact - jemassuremoinscher"
        description="Contactez-nous pour toute question sur nos services de comparaison d'assurance"
      />
      
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main id="main-content" className="flex-grow">
          {/* Hero section */}
          <section className="bg-muted/30 py-12 md:py-16">
            <div className="container mx-auto px-4 text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Contactez-nous
              </h1>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-6">
                Notre équipe est à votre écoute pour répondre à toutes vos questions
              </p>
              
              {/* Email */}
              <a 
                href="mailto:contact@jemassuremoinscher.fr"
                className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors"
              >
                <Mail className="h-5 w-5" />
                contact@jemassuremoinscher.fr
              </a>
            </div>
          </section>

          {/* Quick Help Section with mascot and form */}
          <QuickHelpSection />
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Contact;
