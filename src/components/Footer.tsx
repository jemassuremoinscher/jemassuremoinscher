import { Shield } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Shield className="h-6 w-6" />
              <span className="font-bold text-lg">jemassurmoinscher</span>
            </div>
            <p className="text-primary-foreground/80 text-sm">
              Comparez et économisez sur toutes vos assurances
            </p>
          </div>

          <div>
            <h3 className="font-bold mb-4">Nos assurances</h3>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li><Link to="/assurance-auto" className="hover:text-accent transition-colors">Assurance Auto</Link></li>
              <li><Link to="/assurance-sante" className="hover:text-accent transition-colors">Mutuelle Santé</Link></li>
              <li><Link to="/assurance-moto" className="hover:text-accent transition-colors">Assurance Moto</Link></li>
              <li><Link to="/assurance-habitation" className="hover:text-accent transition-colors">Assurance Habitation</Link></li>
              <li><Link to="/assurance-animaux" className="hover:text-accent transition-colors">Assurance Animaux</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4">À propos</h3>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li><Link to="/qui-sommes-nous" className="hover:text-accent transition-colors">Qui sommes-nous ?</Link></li>
              <li><Link to="/nos-partenaires" className="hover:text-accent transition-colors">Nos partenaires</Link></li>
              <li><Link to="/avis-clients" className="hover:text-accent transition-colors">Avis clients</Link></li>
              <li><Link to="/blog" className="hover:text-accent transition-colors">Blog</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4">Informations</h3>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li><Link to="/politique-cookies" className="hover:text-accent transition-colors">Politique de cookies</Link></li>
              <li><Link to="/mentions-legales" className="hover:text-accent transition-colors">Mentions légales</Link></li>
              <li><Link to="/cgu" className="hover:text-accent transition-colors">CGU</Link></li>
              <li><Link to="/politique-confidentialite" className="hover:text-accent transition-colors">Politique de confidentialité</Link></li>
              <li><Link to="/contact" className="hover:text-accent transition-colors">Contact</Link></li>
              <li><Link to="/plan-du-site" className="hover:text-accent transition-colors">Plan du site</Link></li>
              <li><Link to="/newsletter-gestion" className="hover:text-accent transition-colors">Gérer mon abonnement newsletter</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 pt-8 text-center">
          <p className="text-sm text-primary-foreground/60">
            © 2024 jemassurmoinscher. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
