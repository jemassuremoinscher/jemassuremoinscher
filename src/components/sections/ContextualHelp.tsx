import { Link } from "react-router-dom";
import { BookOpen, Calculator, Users, Scale, MessageSquare } from "lucide-react";

const helpLinks = [
  {
    icon: Calculator,
    text: "Estimez votre coefficient avec notre",
    anchor: "calculateur de bonus-malus gratuit",
    href: "/outils/calculateur-bonus-malus",
    context: "avant de comparer vos offres auto.",
  },
  {
    icon: Users,
    text: "Résilié, malussé ou sans antécédents ?",
    anchor: "Nos solutions pour profils atypiques",
    href: "/profil",
    context: "vous trouvent une assurance adaptée.",
  },
  {
    icon: Scale,
    text: "Hésitez entre deux assureurs ?",
    anchor: "Comparez-les face à face",
    href: "/comparatif",
    context: "dans nos duels détaillés (MAIF vs Macif, AXA vs Allianz…).",
  },
  {
    icon: BookOpen,
    text: "Découvrez comment",
    anchor: "changer d'assurance grâce à la loi Hamon",
    href: "/blog",
    context: "et économiser sans effort.",
  },
  {
    icon: MessageSquare,
    text: "Une question sur votre contrat ?",
    anchor: "Parlez à un conseiller",
    href: "/contact",
    context: "qui vous rappelle sous 5 minutes.",
  },
] as const;

const ContextualHelp = () => {
  return (
    <aside
      className="py-12 md:py-14 bg-muted/20 border-y border-border/20 section-lazy"
      aria-labelledby="contextual-help-title"
      data-ai-description="Section d'aide contextuelle avec liens vers les outils, guides et ressources du comparateur jemassuremoinscher.fr pour accompagner les utilisateurs dans leur choix d'assurance."
    >
      <div className="container mx-auto px-4 max-w-4xl">
        <h2
          id="contextual-help-title"
          className="text-xl md:text-2xl font-bold text-foreground mb-6"
        >
          Besoin d'aide pour choisir ?
        </h2>
        <ul className="space-y-3">
          {helpLinks.map((link) => (
            <li key={link.href} className="flex items-start gap-3">
              <link.icon
                className="w-5 h-5 text-primary flex-shrink-0 mt-0.5"
                aria-hidden="true"
              />
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                {link.text}{" "}
                <Link
                  to={link.href}
                  className="text-primary font-semibold hover:underline underline-offset-2"
                >
                  {link.anchor}
                </Link>{" "}
                {link.context}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default ContextualHelp;
