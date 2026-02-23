import { Link } from "react-router-dom";
import { Instagram, Linkedin, Facebook } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import arthurThumbsUp from "@/assets/mascotte/arthur-thumbs-up.png";

const SimpleFooter = () => {
  const { t } = useLanguage();

  const insuranceLinks = [
    { labelKey: "footer.autoInsurance", href: "/assurance-auto" },
    { labelKey: "footer.motoInsurance", href: "/assurance-moto" },
    { labelKey: "footer.homeInsurance", href: "/assurance-habitation" },
    { labelKey: "footer.healthInsurance", href: "/assurance-sante" },
    { labelKey: "footer.petInsurance", href: "/assurance-animaux" },
    { labelKey: "footer.lifeInsurance", href: "/assurance-vie" },
  ];
  const aboutLinks = [
    { labelKey: "footer.whoAreWe", href: "/qui-sommes-nous" },
    { labelKey: "footer.ourPartners", href: "/nos-partenaires" },
    { labelKey: "nav.blog", href: "/blog" },
    { labelKey: "footer.contact", href: "/contact" },
  ];
  const legalLinks = [
    { labelKey: "footer.legal", href: "/mentions-legales" },
    { labelKey: "footer.terms", href: "/cgu" },
    { labelKey: "footer.privacyPolicy", href: "/politique-confidentialite" },
    { labelKey: "footer.cookiePolicy", href: "/politique-cookies" },
  ];

  return (
    <footer className="bg-primary text-primary-foreground py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-10">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="inline-block mb-4">
              <img alt="Arthur - mascotte jemassuremoinscher" className="h-12 w-auto" src={arthurThumbsUp} loading="lazy" />
            </Link>
            <p className="text-primary-foreground/70 text-sm leading-relaxed mb-4">
              {t('footer.description')}
            </p>
            <div className="flex items-center gap-3">
              <a href="https://www.instagram.com/jemassuremoinscher/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-primary-foreground/60 hover:text-accent transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://www.linkedin.com/company/jemassuremoinscher" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-primary-foreground/60 hover:text-accent transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="https://www.facebook.com/jemassuremoinscher" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-primary-foreground/60 hover:text-accent transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-primary-foreground mb-4 text-sm uppercase tracking-wider">
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
          </div>

          <div>
            <h4 className="font-bold text-primary-foreground mb-4 text-sm uppercase tracking-wider">
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
          </div>

          <div>
            <h4 className="font-bold text-primary-foreground mb-4 text-sm uppercase tracking-wider">
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
          </div>
        </div>

        <div className="pt-8 border-t border-primary-foreground/20">
          <p className="text-center text-primary-foreground/60 text-sm">
            © {new Date().getFullYear()} Jemassuremoinscher.fr - {t('footer.rights')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default SimpleFooter;