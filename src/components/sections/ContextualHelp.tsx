import { Link } from "react-router-dom";
import { BookOpen, Calculator, Users, Scale, MessageSquare } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const ContextualHelp = () => {
  const { t } = useLanguage();

  const helpLinks = [
    { icon: Calculator, key: "calc", href: "/outils/calculateur-bonus-malus" },
    { icon: Users, key: "profile", href: "/profil" },
    { icon: Scale, key: "duel", href: "/comparatif" },
    { icon: BookOpen, key: "hamon", href: "/blog" },
    { icon: MessageSquare, key: "contact", href: "/contact" },
  ] as const;

  return (
    <aside
      className="py-12 md:py-14 bg-muted/20 border-y border-border/20 section-lazy"
      aria-labelledby="contextual-help-title"
    >
      <div className="container mx-auto px-4 max-w-4xl">
        <h2
          id="contextual-help-title"
          className="text-xl md:text-2xl font-bold text-foreground mb-6"
        >
          {t("contextualHelp.title")}
        </h2>
        <ul className="space-y-3">
          {helpLinks.map((link) => (
            <li key={link.href} className="flex items-start gap-3">
              <link.icon
                className="w-5 h-5 text-primary flex-shrink-0 mt-0.5"
                aria-hidden="true"
              />
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                {t(`contextualHelp.${link.key}.text`)}{" "}
                <Link
                  to={link.href}
                  className="text-primary font-semibold hover:underline underline-offset-2"
                >
                  {t(`contextualHelp.${link.key}.anchor`)}
                </Link>{" "}
                {t(`contextualHelp.${link.key}.context`)}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default ContextualHelp;
