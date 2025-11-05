import { Shield } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Shield className="h-6 w-6" />
              <span className="font-bold text-lg">Le Comparateur Assurance</span>
            </div>
            <p className="text-primary-foreground/80 text-sm">
              Comparez et économisez sur toutes vos assurances
            </p>
          </div>

          <div>
            <h3 className="font-bold mb-4">Nos assurances</h3>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li><a href="/assurance-auto" className="hover:text-accent transition-colors">Assurance Auto</a></li>
              <li><a href="/assurance-sante" className="hover:text-accent transition-colors">Mutuelle Santé</a></li>
              <li><a href="/assurance-moto" className="hover:text-accent transition-colors">Assurance Moto</a></li>
              <li><a href="/assurance-habitation" className="hover:text-accent transition-colors">Assurance Habitation</a></li>
              <li><a href="/assurance-animaux" className="hover:text-accent transition-colors">Assurance Animaux</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4">À propos</h3>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li><a href="/qui-sommes-nous" className="hover:text-accent transition-colors">Qui sommes-nous ?</a></li>
              <li><a href="/nos-partenaires" className="hover:text-accent transition-colors">Nos partenaires</a></li>
              <li><a href="/avis-clients" className="hover:text-accent transition-colors">Avis clients</a></li>
              <li><a href="/blog" className="hover:text-accent transition-colors">Blog</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4">Informations</h3>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li><a href="/politique-cookies" className="hover:text-accent transition-colors">Politique de cookies</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Mentions légales</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">CGU</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Politique de confidentialité</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Gérer mon abonnement newsletter</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 pt-8 text-center">
          <p className="text-sm text-primary-foreground/60">
            © 2024 Le Comparateur Assurance. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
