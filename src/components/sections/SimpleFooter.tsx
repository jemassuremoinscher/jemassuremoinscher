import { Link } from "react-router-dom";
import logo from "@/assets/logo-new.png";
const SimpleFooter = () => {
  const insuranceLinks = [{
    label: "Assurance Auto",
    href: "/assurance-auto"
  }, {
    label: "Assurance Moto",
    href: "/assurance-moto"
  }, {
    label: "Assurance Habitation",
    href: "/assurance-habitation"
  }, {
    label: "Assurance Santé",
    href: "/assurance-sante"
  }, {
    label: "Assurance Animaux",
    href: "/assurance-animaux"
  }, {
    label: "Assurance Vie",
    href: "/assurance-vie"
  }];
  const aboutLinks = [{
    label: "Qui sommes-nous ?",
    href: "/qui-sommes-nous"
  }, {
    label: "Nos partenaires",
    href: "/nos-partenaires"
  }, {
    label: "Blog",
    href: "/blog"
  }, {
    label: "Contact",
    href: "/contact"
  }];
  const legalLinks = [{
    label: "Mentions légales",
    href: "/mentions-legales"
  }, {
    label: "CGU",
    href: "/cgu"
  }, {
    label: "Politique de confidentialité",
    href: "/politique-confidentialite"
  }, {
    label: "Politique cookies",
    href: "/politique-cookies"
  }];
  return <footer className="bg-foreground text-background py-12 md:py-16">
      <div className="container mx-auto px-4">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-10">
          {/* Logo & Description */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="inline-block mb-4">
              <img alt="jemassuremoinscher" className="h-10 w-auto brightness-0 invert object-scale-down" src="/lovable-uploads/d9230a8f-d98f-418c-b010-885629846552.png" />
            </Link>
            <p className="text-background/70 text-sm leading-relaxed">
              Comparez les meilleures assurances en France. Gratuit, rapide et sans engagement.
            </p>
          </div>

          {/* Assurances */}
          <div>
            <h4 className="font-bold text-background mb-4 text-sm uppercase tracking-wider">
              Assurances
            </h4>
            <ul className="space-y-2">
              {insuranceLinks.map(link => <li key={link.href}>
                  <Link to={link.href} className="text-background/70 hover:text-accent transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>)}
            </ul>
          </div>

          {/* À propos */}
          <div>
            <h4 className="font-bold text-background mb-4 text-sm uppercase tracking-wider">
              À propos
            </h4>
            <ul className="space-y-2">
              {aboutLinks.map(link => <li key={link.href}>
                  <Link to={link.href} className="text-background/70 hover:text-accent transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>)}
            </ul>
          </div>

          {/* Légal */}
          <div>
            <h4 className="font-bold text-background mb-4 text-sm uppercase tracking-wider">
              Légal
            </h4>
            <ul className="space-y-2">
              {legalLinks.map(link => <li key={link.href}>
                  <Link to={link.href} className="text-background/70 hover:text-accent transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>)}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-background/20">
          <p className="text-center text-background/60 text-sm">
            © {new Date().getFullYear()} Jemassuremoinscher.fr - Tous droits réservés
          </p>
        </div>
      </div>
    </footer>;
};
export default SimpleFooter;