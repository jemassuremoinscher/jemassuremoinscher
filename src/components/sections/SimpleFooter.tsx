import { Link } from "react-router-dom";
import { Instagram, Linkedin, Facebook, Lock, ShieldCheck, Shield, BadgeCheck } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import arthurThumbsUp from "@/assets/mascotte/arthur-sprint-coin.webp";

const SimpleFooter = () => {
  const { t } = useLanguage();

  const insuranceLinks = [
    { label: "Assurance Auto", href: "/assurance-auto" },
    { label: "Assurance Moto", href: "/assurance-moto" },
    { label: "Assurance Habitation", href: "/assurance-habitation" },
    { label: "Mutuelle Santé", href: "/assurance-sante" },
    { label: "Assurance Animaux", href: "/assurance-animaux" },
    { label: "Assurance Vie", href: "/assurance-vie" },
    { label: "Assurance Emprunteur", href: "/assurance-pret" },
    { label: "Prévoyance", href: "/assurance-prevoyance" },
    { label: "RC Professionnelle", href: "/assurance-rc-pro" },
    { label: "Assurance MRP", href: "/assurance-mrp" },
    { label: "Assurance GLI", href: "/assurance-gli" },
    { label: "Assurance PNO", href: "/assurance-pno" },
  ];

  const resourcesLinks = [
    { label: "Comparateur", href: "/comparateur" },
    { label: "Blog & Guides", href: "/blog" },
    { label: "Glossaire Assurance", href: "/glossaire" },
    { label: "Calculateur Bonus-Malus", href: "/outils/calculateur-bonus-malus" },
    { label: "Avis clients", href: "/avis-clients" },
    { label: "Nos partenaires", href: "/nos-partenaires" },
    { label: "Plan du site", href: "/plan-du-site" },
  ];

  const aboutLinks = [
    { label: "Qui sommes-nous ?", href: "/qui-sommes-nous" },
    { label: "Contact", href: "/contact" },
    { label: "Mentions légales", href: "/mentions-legales" },
    { label: "Politique de confidentialité", href: "/politique-confidentialite" },
    { label: "Politique cookies", href: "/politique-cookies" },
    { label: "CGU", href: "/cgu" },
  ];

  return (
    <footer className="bg-primary text-primary-foreground py-12 md:py-16" role="contentinfo">
      <div className="container mx-auto px-4">
        {/* 4 Columns Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 mb-10">
          {/* Col 1: Nos Assurances */}
          <nav aria-label="Nos assurances">
            <h4 className="font-bold text-accent mb-4 text-xs uppercase tracking-wider">
              Nos Assurances
            </h4>
            <ul className="space-y-2">
              {insuranceLinks.map(link => (
                <li key={link.href}>
                  <Link to={link.href} className="text-primary-foreground/60 hover:text-accent transition-colors text-xs">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Col 2: Ressources */}
          <nav aria-label="Ressources et outils">
            <h4 className="font-bold text-accent mb-4 text-xs uppercase tracking-wider">
              Ressources
            </h4>
            <ul className="space-y-2">
              {resourcesLinks.map(link => (
                <li key={link.href}>
                  <Link to={link.href} className="text-primary-foreground/60 hover:text-accent transition-colors text-xs">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Col 3: À propos */}
          <nav aria-label="À propos">
            <h4 className="font-bold text-accent mb-4 text-xs uppercase tracking-wider">
              À propos
            </h4>
            <ul className="space-y-2">
              {aboutLinks.map(link => (
                <li key={link.href}>
                  <Link to={link.href} className="text-primary-foreground/60 hover:text-accent transition-colors text-xs">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Col 4: Informations Légales */}
          <div>
            <h4 className="font-bold text-accent mb-4 text-xs uppercase tracking-wider">
              Informations Légales
            </h4>
            <div className="space-y-3">
              <p className="text-[11px] text-primary-foreground/50 leading-relaxed">
                Jemassuremoinscher.fr est un comparateur d'assurances indépendant, immatriculé à l'ORIAS sous le N° 24 XXX XXX en qualité de courtier en assurances. Nous sommes rémunérés par nos partenaires assureurs lors de la mise en relation.
              </p>
              <p className="text-[11px] text-primary-foreground/50 leading-relaxed">
                Conformément à la réglementation, nous vous rappelons que l'utilisation de notre comparateur est gratuite et sans engagement. Les tarifs affichés sont indicatifs.
              </p>
            </div>
          </div>
        </div>

        {/* Brand + Social */}
        <div className="border-t border-primary-foreground/10 pt-8 mb-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link to="/" aria-label="Accueil jemassuremoinscher.fr">
                <img alt="Arthur - mascotte jemassuremoinscher.fr assurance moins chère" className="h-10 w-auto" src={arthurThumbsUp} loading="lazy" width={40} height={40} />
              </Link>
              <p className="text-primary-foreground/50 text-[11px] max-w-xs leading-relaxed">
                {t('footer.description')}
              </p>
            </div>
            <nav aria-label="Réseaux sociaux" className="flex items-center gap-3">
              <a href="https://www.instagram.com/jemassuremoinscher/" target="_blank" rel="noopener noreferrer" aria-label="Suivez-nous sur Instagram" className="text-primary-foreground/50 hover:text-accent transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="https://www.linkedin.com/company/jemassuremoinscher" target="_blank" rel="noopener noreferrer" aria-label="Suivez-nous sur LinkedIn" className="text-primary-foreground/50 hover:text-accent transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="https://www.facebook.com/jemassuremoinscher" target="_blank" rel="noopener noreferrer" aria-label="Suivez-nous sur Facebook" className="text-primary-foreground/50 hover:text-accent transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
            </nav>
          </div>
        </div>

        {/* Trust bar — SSL + paiement sécurisé */}
        <div className="border-t border-primary-foreground/10 pt-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Trust badges */}
            <div className="flex flex-wrap items-center justify-center gap-4">
              <div className="flex items-center gap-1.5 text-primary-foreground/50">
                <Lock className="h-3 w-3 text-accent" aria-hidden="true" />
                <span className="text-[10px] font-medium">Paiement sécurisé</span>
              </div>
              <div className="flex items-center gap-1.5 text-primary-foreground/50">
                <ShieldCheck className="h-3 w-3 text-accent" aria-hidden="true" />
                <span className="text-[10px] font-medium">Site sécurisé SSL</span>
              </div>
              <div className="flex items-center gap-1.5 text-primary-foreground/50">
                <Shield className="h-3 w-3 text-accent" aria-hidden="true" />
                <span className="text-[10px] font-medium">RGPD conforme</span>
              </div>
              <div className="flex items-center gap-1.5 text-primary-foreground/50">
                <BadgeCheck className="h-3 w-3 text-accent" aria-hidden="true" />
                <span className="text-[10px] font-medium">ORIAS vérifié</span>
              </div>
            </div>

          </div>

          {/* Copyright */}
          <p className="text-[10px] text-primary-foreground/30 text-center mt-4">
            © {new Date().getFullYear()} Jemassuremoinscher.fr — Tous droits réservés
          </p>
        </div>
      </div>
    </footer>
  );
};

export default SimpleFooter;
