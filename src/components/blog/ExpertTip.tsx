import { Lightbulb } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface ExpertTipProps {
  children: React.ReactNode;
  title?: string;
}

/**
 * "Conseil de l'Expert" — styled aside for tips and quotes.
 * Uses semantic <aside> with brand-colored left border.
 */
const ExpertTip = ({ children, title = "Conseil de l'expert" }: ExpertTipProps) => {
  const { t } = useLanguage();
  return (
    <aside
      aria-label={t("a11y.blog.expertTip")}
      className="relative bg-secondary/10 border-l-4 border-secondary rounded-r-xl p-5 md:p-6 my-6"
    >
      <div className="flex items-center gap-2 mb-3">
        <Lightbulb className="h-5 w-5 text-secondary" aria-hidden="true" />
        <span className="text-sm font-bold text-secondary uppercase tracking-wide">
          {title}
        </span>
      </div>
      <div className="text-foreground leading-relaxed">
        {children}
      </div>
    </aside>
  );
};

export default ExpertTip;
