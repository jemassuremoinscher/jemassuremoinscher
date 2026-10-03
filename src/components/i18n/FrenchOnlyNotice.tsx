import { Info } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

const KEYS = {
  article: "i18n.notice.frenchOnlyArticle",
  blog: "i18n.notice.frenchOnlyBlog",
  glossary: "i18n.notice.frenchOnlyGlossary",
} as const;

/**
 * Bandeau des contenus hors périmètre de traduction (blog, glossaire) :
 * affiché en anglais et en italien seulement, le contenu reste en français.
 */
const FrenchOnlyNotice = ({ variant = "article", className }: { variant?: keyof typeof KEYS; className?: string }) => {
  const { language, t } = useLanguage();
  if (language === "fr") return null;
  return (
    <div
      role="note"
      data-i18n-notice="french-only"
      className={cn("flex items-start gap-2 rounded-xl border border-primary/30 bg-primary/5 px-4 py-3 text-sm text-foreground", className)}
    >
      <Info className="h-4 w-4 mt-0.5 shrink-0 text-primary" aria-hidden="true" />
      <span>{t(KEYS[variant])}</span>
    </div>
  );
};

export default FrenchOnlyNotice;
