import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { addBreadcrumbSchema } from "@/utils/seoUtils";
import { Shield } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const PlanDuSite = () => {
  const { t } = useLanguage();

  const breadcrumbSchema = addBreadcrumbSchema([
    { name: "Accueil", url: "https://www.jemassuremoinscher.fr" },
    { name: "Plan du site", url: "https://www.jemassuremoinscher.fr/plan-du-site" }
  ]);

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Plan du site - jemassuremoinscher",
    "description": "Plan du site complet avec tous les liens vers nos pages d'assurances, outils, blog et pages légales.",
    "url": "https://www.jemassuremoinscher.fr/plan-du-site"
  };

  const sections = [
    {
      title: t('sitemapPage.insurances'),
      icon: Shield,
      links: [
        { name: t('insurance.auto'), path: "/assurance-auto" },
        { name: t('insurance.moto'), path: "/assurance-moto" },
        { name: t('insurance.home'), path: "/assurance-habitation" },
        { name: t('insurance.health'), path: "/assurance-sante" },
        { name: t('insurance.life'), path: "/assurance-vie" },
        { name: t('insurance.pets'), path: "/assurance-animaux" },
        { name: t('insurance.loan'), path: "/assurance-pret" },
        { name: t('insurance.provident'), path: "/assurance-prevoyance" },
        { name: t('insurance.rcPro'), path: "/assurance-rc-pro" },
        { name: t('insurance.gli'), path: "/assurance-gli" },
        { name: t('insurance.mrp'), path: "/assurance-mrp" },
        { name: t('insurance.pno'), path: "/assurance-pno" },
      ]
    },
    {
      title: t('sitemapPage.toolsServices'),
      links: [
        { name: t('comparator.badge'), path: "/comparateur" },
        { name: t('insurance.rentalManagement'), path: "/gestion-locative" },
        { name: t('nav.partners'), path: "/nos-partenaires" },
        { name: t('nav.reviews'), path: "/avis-clients" },
        { name: t('nav.aboutUs'), path: "/qui-sommes-nous" },
        { name: t('footer.contact'), path: "/contact" },
      ]
    },
    {
      title: t('sitemapPage.blogResources'),
      links: [
        { name: t('blogHighlights.viewAll'), path: "/blog" },
        { name: t('glossairePage.title'), path: "/glossaire" },
      ]
    },
    {
      title: t('sitemapPage.legalInfo'),
      links: [
        { name: t('footer.legal'), path: "/mentions-legales" },
        { name: t('footer.terms'), path: "/cgu" },
        { name: t('footer.privacy'), path: "/politique-confidentialite" },
        { name: t('footer.cookies'), path: "/politique-cookies" },
      ]
    }
  ];

  return (
    <>
      <SEO 
        title="Plan du site - jemassuremoinscher"
        description="Plan du site complet avec tous les liens vers nos pages d'assurances, outils, blog et pages légales. Navigation simplifiée pour trouver rapidement l'information."
        canonical="https://www.jemassuremoinscher.fr/plan-du-site"
        jsonLd={[breadcrumbSchema, webPageSchema]}
      />
      <Header />
      
      <main id="main-content" className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4 py-16">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
              {t('sitemapPage.title')}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t('sitemapPage.subtitle')}
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
            <h2 className="text-2xl font-bold mb-4">{t('sitemapPage.needHelp')}</h2>
            <p className="text-muted-foreground mb-6">
              {t('sitemapPage.helpDesc')}
            </p>
            <Link 
              to="/contact"
              className="inline-flex items-center justify-center px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold"
            >
              {t('contactPage.title')}
            </Link>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default PlanDuSite;
