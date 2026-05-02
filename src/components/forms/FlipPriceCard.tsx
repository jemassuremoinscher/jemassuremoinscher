import { useState, type KeyboardEvent } from "react";
import { Check, RotateCcw } from "lucide-react";

export interface FlipPriceCardProps {
  name: string;
  price: string;
  badge?: string;
  logo: string;
  features: string[];
  highlight?: boolean;
}

/**
 * Click/tap to flip the card and reveal the formula's main coverages.
 * Pure CSS 3D flip — no external lib. Keyboard accessible (Enter/Space).
 */
const FlipPriceCard = ({ name, price, badge, logo, features, highlight }: FlipPriceCardProps) => {
  const [flipped, setFlipped] = useState(false);
  const isPercent = price.includes("%");

  const onKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setFlipped((f) => !f);
    }
  };

  return (
    <div className="relative h-[170px] [perspective:1000px]">
      <button
        type="button"
        onClick={() => setFlipped((f) => !f)}
        onKeyDown={onKey}
        aria-pressed={flipped}
        aria-label={`Formule ${name} — ${flipped ? "voir le prix" : "voir les garanties incluses"}`}
        className="absolute inset-0 w-full h-full rounded-xl [transform-style:preserve-3d] transition-transform duration-500 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        style={{ transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
      >
        {/* Front */}
        <div
          className={`absolute inset-0 rounded-xl border-2 p-3 text-center [backface-visibility:hidden] ${
            highlight
              ? "border-primary bg-primary/5 shadow-[var(--shadow-card)]"
              : "border-border/40 bg-background/50"
          }`}
        >
          {highlight && (
            <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
              Meilleur prix
            </span>
          )}
          <div className="flex justify-center mb-1.5 mt-1">
            <img src={logo} alt={name} className="h-6 max-w-[60px] object-contain" loading="lazy" />
          </div>
          {badge && (
            <span className="text-[10px] text-muted-foreground font-medium uppercase">{badge}</span>
          )}
          <div className="text-xl md:text-2xl font-extrabold text-accent mt-0.5">{price}</div>
          <span className="text-[11px] text-muted-foreground">
            {isPercent ? " des loyers" : "/mois"}
          </span>
          <p className="text-xs font-medium text-foreground mt-1">{name}</p>
          <p className="text-[10px] text-primary/70 mt-1.5 font-medium">Détails →</p>
        </div>

        {/* Back */}
        <div
          className={`absolute inset-0 rounded-xl border-2 p-3 text-left [backface-visibility:hidden] [transform:rotateY(180deg)] overflow-hidden ${
            highlight
              ? "border-primary bg-primary/5 shadow-[var(--shadow-card)]"
              : "border-border/40 bg-background"
          }`}
        >
          <p className="text-[11px] font-bold text-foreground mb-1.5 flex items-center justify-between">
            <span className="truncate">{name}</span>
            <RotateCcw className="h-3 w-3 text-primary shrink-0" aria-hidden="true" />
          </p>
          <ul className="space-y-1">
            {features.slice(0, 4).map((f) => (
              <li key={f} className="flex items-start gap-1 text-[10px] text-muted-foreground leading-tight">
                <Check className="h-2.5 w-2.5 text-primary shrink-0 mt-0.5" aria-hidden="true" />
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>
      </button>
    </div>
  );
};

export default FlipPriceCard;
