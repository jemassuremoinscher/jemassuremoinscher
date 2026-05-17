import { Zap } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface EssentielBoxProps {
  /** Short summary (~40 words) for AI/SGE Position Zero optimization */
  summary: string;
  title?: string;
}

/**
 * "L'Essentiel" box — optimized for Google AI Overviews / SGE / Position Zero.
 * Contains a direct, concise answer to the article's main question.
 */
const EssentielBox = ({ summary, title = "L'essentiel" }: EssentielBoxProps) => {
  const { t } = useLanguage();
  return (
    <aside
      aria-label={t("a11y.blog.essentielBox")}
      className="relative bg-primary/5 border-l-4 border-primary rounded-r-xl p-5 md:p-6"
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="p-1.5 rounded-full bg-primary/10">
          <Zap className="h-4 w-4 text-primary" aria-hidden="true" />
        </div>
        <span className="text-sm font-bold text-primary uppercase tracking-wide">
          {title}
        </span>
      </div>
      <p className="text-foreground leading-relaxed font-medium">
        {summary}
      </p>
    </aside>
  );
};

export default EssentielBox;
