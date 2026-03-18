import { memo } from "react";
import { Info } from "lucide-react";

interface EnBrefProps {
  facts: string[];
}

const EnBref = memo(({ facts }: EnBrefProps) => (
  <div
    className="max-w-4xl mx-auto mb-8 bg-accent/5 border border-accent/20 rounded-xl px-5 py-4"
    data-ai-description="Résumé factuel du produit d'assurance"
    role="region"
    aria-label="En bref"
  >
    <div className="flex items-center gap-2 mb-2">
      <Info className="w-4 h-4 text-accent flex-shrink-0" aria-hidden="true" />
      <span className="text-sm font-bold text-foreground">En bref</span>
    </div>
    <ul className="space-y-1">
      {facts.map((fact, i) => (
        <li key={i} className="text-sm text-muted-foreground leading-relaxed">
          • {fact}
        </li>
      ))}
    </ul>
  </div>
));

EnBref.displayName = "EnBref";

export default EnBref;
