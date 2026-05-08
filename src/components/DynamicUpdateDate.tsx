import { Calendar } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const DynamicUpdateDate = () => {
  const { language, t } = useLanguage();
  const today = new Date();
  const formatted = today.toLocaleDateString(language === "en" ? "en-GB" : "fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground py-3">
      <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
      <span>{t("updateDate.label", { date: formatted })}</span>
    </div>
  );
};

export default DynamicUpdateDate;
