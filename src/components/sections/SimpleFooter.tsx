import { Link } from "react-router-dom";
import { Instagram, Linkedin, Facebook, MapIcon } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import arthurThumbsUp from "@/assets/mascotte/arthur-sprint-coin.png";

const SimpleFooter = () => {
  const { t } = useLanguage();

  const insuranceLinks = [
    { labelKey: "footer.autoInsurance", href: "/assurance-auto" },
    { labelKey: "footer.motoInsurance", href: "/assurance-moto" },
    { labelKey: "footer.homeInsurance", href: "/assurance-habitation" },
    { labelKey: "footer.healthInsurance", href: "/assurance-sante" },
    { labelKey: "footer.petInsurance", href: "/assurance-animaux" },
    { labelKey: "footer.lifeInsurance", href: "/assurance-vie" },
    { labelKey: "footer.loanInsurance", href: "/assurance-pret" },
    { labelKey: "footer.prevoyanceInsurance", href: "/assurance-prevoyance" },
    { labelKey: "footer.rcProInsurance", href: "/assurance-rc-pro" },
    { labelKey: "footer.mrpInsurance", href: "/assurance-mrp" },
    { labelKey: "footer.gliInsurance", href: "/assurance-gli" },
    { labelKey: "footer.pnoInsurance", href: "/assurance-pno" },
  ];

  const resourceLinks = [
    { labelKey: "footer.comparator", href: "/comparateur" },
    { labelKey: "nav.blog", href: "/blog" },
    { labelKey: "footer.glossary", href: "/glossaire" },
    { labelKey: "footer.reviews", href: "/avis-clients" },
    { labelKey: "footer.gestionLocative", href: "/gestion-locative" },
  ];

  const aboutLinks = [
    { labelKey: "footer.whoAreWe", href: "/qui-sommes-nous" },
    { labelKey: "footer.ourPartners", href: "/nos-partenaires" },
    { labelKey: "footer.contact", href: "/contact" },
  ];

  const legalLinks = [
    { labelKey: "footer.legal", href: "/mentions-legales" },
    { labelKey: "footer.terms", href: "/cgu" },
    { labelKey: "footer.privacyPolicy", href: "/politique-confidentialite" },
    { labelKey: "footer.cookiePolicy", href: "/politique-cookies" },
    { labelKey: "footer.sitemap", href: "/plan-du-site" },
  ];

  return (
    <footer className="bg-primary text-primary-foreground py-12 md:py-16" role="contentinfo">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-10 mb-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="inline-block mb-4" aria-label="Accueil jemassuremoinscher">
              <img alt="Arthur - mascotte jemassuremoinscher" className="h-12 w-auto" src={arthurThumbsUp} loading="lazy" width={48} height={48} />
            </Link>
            <p className="text-primary-foreground/70 text-sm leading-relaxed mb-4">
              {t('footer.description')}
            </p>
            <nav aria-label="Réseaux sociaux" className="flex items-center gap-3">
              <a href="https://www.instagram.com/jemassuremoinscher/" target="_blank" rel="noopener noreferrer" aria-label="Suivez-nous sur Instagram" className="text-primary-foreground/60 hover:text-accent transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://www.linkedin.com/company/jemassuremoinscher" target="_blank" rel="noopener noreferrer" aria-label="Suivez-nous sur LinkedIn" className="text-primary-foreground/60 hover:text-accent transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="https://www.facebook.com/jemassuremoinscher" target="_blank" rel="noopener noreferrer" aria-label="Suivez-nous sur Facebook" className="text-primary-foreground/60 hover:text-accent transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
            </nav>
          </div>

          {/* Nos Assurances */}
          <nav aria-label="Nos assurances">
            <h4 className="font-bold text-accent mb-4 text-sm uppercase tracking-wider">
              {t('footer.insurances')}
            </h4>
            <ul className="space-y-2">
              {insuranceLinks.map(link => (
                <li key={link.href}>
                  <Link to={link.href} className="text-primary-foreground/70 hover:text-accent transition-colors text-sm">
                    {t(link.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Ressources */}
          <nav aria-label="Ressources">
            <h4 className="font-bold text-accent mb-4 text-sm uppercase tracking-wider">
              {t('footer.resources')}
            </h4>
            <ul className="space-y-2">
              {resourceLinks.map(link => (
                <li key={link.href}>
                  <Link to={link.href} className="text-primary-foreground/70 hover:text-accent transition-colors text-sm">
                    {t(link.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* À propos */}
          <nav aria-label="À propos">
            <h4 className="font-bold text-accent mb-4 text-sm uppercase tracking-wider">
              {t('footer.about')}
            </h4>
            <ul className="space-y-2">
              {aboutLinks.map(link => (
                <li key={link.href}>
                  <Link to={link.href} className="text-primary-foreground/70 hover:text-accent transition-colors text-sm">
                    {t(link.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Légal */}
          <nav aria-label="Informations légales">
            <h4 className="font-bold text-accent mb-4 text-sm uppercase tracking-wider">
              {t('footer.legalSection')}
            </h4>
            <ul className="space-y-2">
              {legalLinks.map(link => (
                <li key={link.href}>
                  <Link to={link.href} className="text-primary-foreground/70 hover:text-accent transition-colors text-sm">
                    {t(link.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-primary-foreground/20 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-primary-foreground/60 text-sm">
            © {new Date().getFullYear()} Jemassuremoinscher.fr - {t('footer.rights')}
          </p>
          <p className="text-primary-foreground/50 text-xs max-w-xl text-center md:text-right">
            {t('footer.disclaimer')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default SimpleFooter;
