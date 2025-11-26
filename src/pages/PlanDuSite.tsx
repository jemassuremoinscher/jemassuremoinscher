import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { addBreadcrumbSchema } from "@/utils/seoUtils";
import { Shield } from "lucide-react";

const PlanDuSite = () => {
  const breadcrumbSchema = addBreadcrumbSchema([
    { name: "Accueil", url: "https://www.assurmoinschere.fr" },
    { name: "Plan du site", url: "https://www.assurmoinschere.fr/plan-du-site" }
  ]);

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Plan du site - jemassuremoinscher",
    "description": "Plan du site complet avec tous les liens vers nos pages d'assurances, outils, blog et pages légales.",
    "url": "https://www.assurmoinschere.fr/plan-du-site"
  };

  const sections = [
    {
      title: "Assurances",
      icon: Shield,
      links: [
        { name: "Assurance Auto", path: "/assurance-auto" },
        { name: "Assurance Moto", path: "/assurance-moto" },
        { name: "Assurance Habitation", path: "/assurance-habitation" },
        { name: "Assurance Santé", path: "/assurance-sante" },
        { name: "Assurance Vie", path: "/assurance-vie" },
        { name: "Assurance Animaux", path: "/assurance-animaux" },
        { name: "Assurance Prêt", path: "/assurance-pret" },
        { name: "Assurance Prévoyance", path: "/assurance-prevoyance" },
        { name: "Assurance RC Pro", path: "/assurance-rc-pro" },
        { name: "Assurance GLI", path: "/assurance-gli" },
        { name: "Assurance MRP", path: "/assurance-mrp" },
        { name: "Assurance PNO", path: "/assurance-pno" },
      ]
    },
    {
      title: "Outils & Services",
      links: [
        { name: "Comparateur d'assurances", path: "/comparateur" },
        { name: "Comparateur de garanties", path: "/comparateur-garanties" },
        { name: "Gestion locative", path: "/gestion-locative" },
        { name: "Nos partenaires assureurs", path: "/nos-partenaires" },
        { name: "Avis clients", path: "/avis-clients" },
        { name: "Qui sommes-nous", path: "/qui-sommes-nous" },
        { name: "Contact", path: "/contact" },
      ]
    },
    {
      title: "Blog & Actualités",
      links: [
        { name: "Tous les articles", path: "/blog" },
      ]
    },
    {
      title: "Informations Légales",
      links: [
        { name: "Mentions légales", path: "/mentions-legales" },
        { name: "Conditions générales d'utilisation", path: "/cgu" },
        { name: "Politique de confidentialité", path: "/politique-confidentialite" },
        { name: "Politique des cookies", path: "/politique-cookies" },
      ]
    }
  ];

  return (
    <>
      <SEO 
        title="Plan du site - jemassuremoinscher"
        description="Plan du site complet avec tous les liens vers nos pages d'assurances, outils, blog et pages légales. Navigation simplifiée pour trouver rapidement l'information."
        canonical="https://www.assurmoinschere.fr/plan-du-site"
        jsonLd={[breadcrumbSchema, webPageSchema]}
      />
      <Header />
      
      <main id="main-content" className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4 py-16">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
              Plan du site
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Retrouvez facilement toutes les pages de notre site pour comparer et trouver la meilleure assurance
            </p>
          </div>

          {/* Sitemap Grid */}
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {sections.map((section, index) => (
              <div 
                key={index}
                className="bg-card rounded-xl shadow-lg p-8 border border-border hover:shadow-xl transition-shadow"
              >
                <div className="flex items-center gap-3 mb-6">
                  {section.icon && <section.icon className="h-6 w-6 text-primary" />}
                  <h2 className="text-2xl font-bold text-foreground">
                    {section.title}
                  </h2>
                </div>
                <nav aria-label={section.title}>
                  <ul className="space-y-3">
                    {section.links.map((link, linkIndex) => (
                      <li key={linkIndex}>
                        <Link 
                          to={link.path}
                          className="text-muted-foreground hover:text-primary hover:underline transition-colors inline-flex items-center gap-2 group"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-primary/40 group-hover:bg-primary transition-colors"></span>
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="text-center mt-16 p-8 bg-primary/5 rounded-xl border border-primary/20">
            <h2 className="text-2xl font-bold mb-4">Besoin d'aide pour trouver votre assurance ?</h2>
            <p className="text-muted-foreground mb-6">
              Notre équipe d'experts est là pour vous accompagner dans votre recherche
            </p>
            <Link 
              to="/contact"
              className="inline-flex items-center justify-center px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold"
            >
              Contactez-nous
            </Link>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default PlanDuSite;
