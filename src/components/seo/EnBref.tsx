import { memo, type ReactNode } from "react";
import { Info } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface EnBrefProps {
  facts: ReactNode[];
}

const EnBref = memo(({ facts }: EnBrefProps) => {
  const { t } = useLanguage();
  const label = t("enBref.title");
  return (
    <div
      className="max-w-4xl mx-auto mb-8 bg-accent/5 border border-accent/20 rounded-xl px-5 py-4"
      role="region"
      aria-label={label}
    >
      <div className="flex items-center gap-2 mb-2">
        <Info className="w-4 h-4 text-accent flex-shrink-0" aria-hidden="true" />
        <span className="text-sm font-bold text-foreground">{label}</span>
      </div>
      <ul className="space-y-1">
        {facts.map((fact, i) => (
          <li key={i} className="text-sm text-muted-foreground leading-relaxed">
            • {fact}
          </li>
        ))}
      </ul>
    </div>
  );
});

EnBref.displayName = "EnBref";

export default EnBref;
