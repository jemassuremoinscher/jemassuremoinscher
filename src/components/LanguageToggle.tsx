import { useLanguage, type Language } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe } from "lucide-react";

// tone « onDark » : en-tête violet (texte blanc) ; « onLight » : menu mobile
// (fond clair, texte blanc illisible auparavant).
const TONES = {
  onDark: {
    button: "flex items-center gap-1.5 px-2 py-1 h-8 text-sm font-medium text-white hover:text-white/80 hover:bg-white/10 rounded-lg transition-all",
    icon: "h-4 w-4 text-white/70",
    label: "uppercase font-bold text-white",
  },
  onLight: {
    button: "flex items-center gap-1.5 px-2 py-1 h-8 text-sm font-medium text-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all",
    icon: "h-4 w-4 text-primary",
    label: "uppercase font-bold text-foreground",
  },
} as const;

// Libellés d'accessibilité écrits dans la langue cible (invariants).
const SWITCH_TO: Record<Language, string> = {
  fr: "Passer en Français",
  en: "Switch to English",
  it: "Passa all'italiano",
};

/**
 * Bouton de langue (en-tête et menu mobile). N'affiche que les langues
 * activées (app_settings 'languages_enabled', voir LanguageContext).
 * - Deux langues : bascule directe, rendu inchangé (« EN » en français).
 * - Trois langues : menu FR / EN / IT.
 */
const LanguageToggle = ({ tone = "onDark" }: { tone?: keyof typeof TONES }) => {
  const { language, setLanguage, languagesEnabled, t } = useLanguage();
  const cls = TONES[tone];

  if (languagesEnabled.length <= 2) {
    const target: Language = languagesEnabled.find((l) => l !== language) ?? "fr";
    return (
      <Button variant="ghost" size="sm" onClick={() => setLanguage(target)} className={cls.button} aria-label={SWITCH_TO[target]}>
        <Globe className={cls.icon} />
        <span className={cls.label}>{target.toUpperCase()}</span>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className={cls.button} aria-label={t("i18n.switcher.label")}>
          <Globe className={cls.icon} />
          <span className={cls.label}>{language.toUpperCase()}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languagesEnabled.map((l) => (
          <DropdownMenuItem
            key={l}
            onSelect={() => setLanguage(l)}
            lang={l}
            aria-current={l === language ? "true" : undefined}
            className={l === language ? "font-bold" : undefined}
          >
            <span className="uppercase w-6">{l}</span>
            {t(`i18n.switcher.${l}`)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageToggle;
