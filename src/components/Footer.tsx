import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Shield, Lock, FileCheck } from "lucide-react";
import logoNew from "@/assets/logo-new.png";

const Footer = () => {
  const { language } = useLanguage();

  const insuranceLinks = [
    { to: "/assurance-auto", label: "Assurance Auto" },
    { to: "/assurance-moto", label: "Assurance Moto" },
    { to: "/assurance-habitation", label: "Assurance Habitation" },
    { to: "/assurance-sante", label: "Mutuelle Santé" },
    { to: "/assurance-auto", label: "Assurance Jeune Conducteur" },
    { to: "/assurance-auto", label: "Assurance Malus" },
    { to: "/assurance-animaux", label: "Assurance Animaux" },
    { to: "/assurance-pret", label: "Assurance Prêt" },
    { to: "/assurance-vie", label: "Assurance Vie" },
    { to: "/assurance-prevoyance", label: "Prévoyance" },
    { to: "/assurance-rc-pro", label: "RC Professionnelle" },
    { to: "/assurance-pno", label: "Assurance PNO" },
  ];

  const trustBadges = [
    { icon: Lock, label: "Paiement Sécurisé" },
    { icon: Shield, label: "Données Protégées RGPD" },
    { icon: FileCheck, label: "Site Vérifié" },
  ];

  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Zone 1: SEO Links */}
      <div className="border-b border-primary-foreground/10">
        <div className="container mx-auto px-4 py-10">
          <h3 className="text-lg font-bold mb-6 text-center">
            {language === 'fr' ? 'Nos Assurances' : 'Our Insurance Products'}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {insuranceLinks.map((link, index) => (
              <Link
                key={index}
                to={link.to}
                className="text-sm text-primary-foreground/70 hover:text-accent transition-colors py-2 px-3 rounded-lg hover:bg-primary-foreground/5 text-center"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Zone 2: Trust Badges */}
      <div className="border-b border-primary-foreground/10">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10">
            {trustBadges.map((badge, index) => (
              <div key={index} className="flex items-center gap-2 text-primary-foreground/80">
                <badge.icon className="h-5 w-5 text-accent" />
                <span className="text-sm font-medium">{badge.label}</span>
              </div>
            ))}
            <Link
              to="/politique-confidentialite"
              className="text-sm text-accent hover:underline font-medium"
            >
              {language === 'fr' ? 'Charte de Confidentialité' : 'Privacy Policy'}
            </Link>
          </div>
        </div>
      </div>

      {/* Zone 3: Brand Identity */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center text-center gap-4">
          <img
            src={logoNew}
            alt="Jemassuremoinscher.fr - Comparateur assurance moins chère avec Arthur"
            className="h-10 w-auto brightness-0 invert"
          />
          <p className="text-xs text-primary-foreground/50 max-w-2xl leading-relaxed">
            Jemassuremoinscher.fr est un comparateur indépendant. Les tarifs affichés sont indicatifs et peuvent varier selon votre profil. 
            Ce site ne se substitue pas aux conseils d'un professionnel de l'assurance. 
            Comparez, économisez, mais lisez toujours les conditions générales avant de souscrire.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-xs text-primary-foreground/40 mt-2">
            <Link to="/mentions-legales" className="hover:text-accent transition-colors">
              Mentions Légales
            </Link>
            <span>•</span>
            <Link to="/cgu" className="hover:text-accent transition-colors">
              CGU
            </Link>
            <span>•</span>
            <Link to="/politique-cookies" className="hover:text-accent transition-colors">
              Cookies
            </Link>
            <span>•</span>
            <Link to="/contact" className="hover:text-accent transition-colors">
              Contact
            </Link>
            <span>•</span>
            <Link to="/plan-du-site" className="hover:text-accent transition-colors">
              Plan du site
            </Link>
          </div>
          <p className="text-xs text-primary-foreground/40 mt-4">
            © {new Date().getFullYear()} Jemassuremoinscher.fr - Tous droits réservés
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
