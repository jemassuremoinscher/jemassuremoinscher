import { MapPin } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

/**
 * « Service réservé aux personnes résidant en France » (décision de Paul,
 * chantier i18n) : pied de page et au-dessus de chaque formulaire.
 * Affiché seulement en anglais et en italien : il s'adresse aux visiteurs
 * qui lisent le site dans une autre langue, et le rendu français reste
 * inchangé (règle de l'étape 1).
 */
const ResidencyNotice = ({ className, tone = "muted" }: { className?: string; tone?: "muted" | "onDark" }) => {
  const { language, t } = useLanguage();
  if (language === "fr") return null;
  return (
    <p
      data-i18n-notice="residency"
      className={cn(
        "flex items-center gap-1.5 text-xs",
        tone === "onDark" ? "text-white/70" : "text-muted-foreground",
        className,
      )}
    >
      <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      {t("i18n.notice.residency")}
    </p>
  );
};

export default ResidencyNotice;
