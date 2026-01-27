import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import logoNew from "@/assets/logo-new.png";

const Footer = () => {
  const { t, language } = useLanguage();
  
  return (
    <footer className="bg-primary text-primary-foreground py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="mb-4">
              <img 
                src={logoNew} 
                alt="jemassuremoinscher.fr" 
                className="h-12 w-auto brightness-0 invert"
              />
            </div>
            <p className="text-primary-foreground/80 text-sm">
              {t('footer.tagline')}
            </p>
          </div>

          <div>
            <h3 className="font-bold mb-4">{t('footer.insurances')}</h3>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li><Link to="/assurance-auto" className="hover:text-accent transition-colors">{language === 'fr' ? 'Assurance Auto' : 'Auto Insurance'}</Link></li>
              <li><Link to="/assurance-sante" className="hover:text-accent transition-colors">{language === 'fr' ? 'Mutuelle Santé' : 'Health Insurance'}</Link></li>
              <li><Link to="/assurance-moto" className="hover:text-accent transition-colors">{language === 'fr' ? 'Assurance Moto' : 'Motorcycle Insurance'}</Link></li>
              <li><Link to="/assurance-habitation" className="hover:text-accent transition-colors">{language === 'fr' ? 'Assurance Habitation' : 'Home Insurance'}</Link></li>
              <li><Link to="/assurance-animaux" className="hover:text-accent transition-colors">{language === 'fr' ? 'Assurance Animaux' : 'Pet Insurance'}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4">{t('footer.about')}</h3>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li><Link to="/qui-sommes-nous" className="hover:text-accent transition-colors">{t('nav.aboutUs')}</Link></li>
              <li><Link to="/nos-partenaires" className="hover:text-accent transition-colors">{language === 'fr' ? 'Nos partenaires' : 'Our partners'}</Link></li>
              <li><Link to="/avis-clients" className="hover:text-accent transition-colors">{language === 'fr' ? 'Avis clients' : 'Customer reviews'}</Link></li>
              <li><Link to="/blog" className="hover:text-accent transition-colors">{t('nav.blog')}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4">{t('footer.info')}</h3>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li><Link to="/politique-cookies" className="hover:text-accent transition-colors">{language === 'fr' ? 'Politique de cookies' : 'Cookie Policy'}</Link></li>
              <li><Link to="/mentions-legales" className="hover:text-accent transition-colors">{t('footer.legal')}</Link></li>
              <li><Link to="/cgu" className="hover:text-accent transition-colors">{t('footer.terms')}</Link></li>
              <li><Link to="/politique-confidentialite" className="hover:text-accent transition-colors">{language === 'fr' ? 'Politique de confidentialité' : 'Privacy Policy'}</Link></li>
              <li><Link to="/contact" className="hover:text-accent transition-colors">{t('footer.contact')}</Link></li>
              <li><Link to="/plan-du-site" className="hover:text-accent transition-colors">{t('footer.sitemap')}</Link></li>
              <li><Link to="/newsletter-gestion" className="hover:text-accent transition-colors">{language === 'fr' ? 'Gérer mon abonnement newsletter' : 'Manage newsletter subscription'}</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 pt-8 text-center">
          <p className="text-sm text-primary-foreground/60">
            © 2024 jemassuremoinscher. {t('footer.rights')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
