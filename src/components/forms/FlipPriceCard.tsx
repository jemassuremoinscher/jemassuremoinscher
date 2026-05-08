import { useRef, useState, type KeyboardEvent } from "react";
import { Check, RotateCcw } from "lucide-react";
import { useAnalytics } from "@/hooks/useAnalytics";

export interface FlipPriceCardProps {
  name: string;
  price: string;
  badge?: string;
  logo: string;
  features: string[];
  highlight?: boolean;
  insuranceType?: string;
  position?: number;
}

/**
 * Click/tap to flip the card and reveal the formula's main coverages.
 * Pure CSS 3D flip — no external lib. Keyboard accessible (Enter/Space).
 * Tracks flips and detail-views per insurance category for engagement analytics.
 */
const FlipPriceCard = ({ name, price, badge, logo, features, highlight, insuranceType, position }: FlipPriceCardProps) => {
  const [flipped, setFlipped] = useState(false);
  const isPercent = price.includes("%");
  const { trackEvent } = useAnalytics();
  const detailsTrackedRef = useRef(false);
  // Guard against double-firing: pointerup + click can both trigger on some browsers.
  const lastFlipAtRef = useRef(0);

  const toggleFlip = (fromPointer = false) => {
    const now = Date.now();
    if (now - lastFlipAtRef.current < 300) return;
    lastFlipAtRef.current = now;

    // Light haptic feedback (Android Chrome supports it; iOS Safari ignores silently).
    if (fromPointer && typeof navigator !== "undefined" && typeof navigator.vibrate === "function") {
      try { navigator.vibrate(10); } catch { /* noop */ }
    }

    setFlipped((f) => {
      const next = !f;
      trackEvent("pricing_card_flip", {
        category: "pricing_engagement",
        label: `${insuranceType || "unknown"}:${name}`,
        insurance_type: insuranceType,
        formula_name: name,
        formula_price: price,
        position,
        highlight: !!highlight,
        action: next ? "show_details" : "show_price",
      });
      if (next && !detailsTrackedRef.current) {
        detailsTrackedRef.current = true;
        trackEvent("pricing_card_view_details", {
          category: "pricing_engagement",
          label: `${insuranceType || "unknown"}:${name}`,
          insurance_type: insuranceType,
          formula_name: name,
          formula_price: price,
          position,
          highlight: !!highlight,
        });
      }
      return next;
    });
  };

  // Use onClick (more reliable across browsers/iframes than pointerup with preventDefault).
  const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFlip(true);
  };

  const onKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleFlip(false);
    }
  };

  return (
    <div className="relative h-[220px]">
      <button
        type="button"
        onClick={onClick}
        onKeyDown={onKey}
        aria-pressed={flipped}
        aria-expanded={flipped}
        aria-label={`Formule ${name} — ${flipped ? "voir le prix" : "voir les garanties incluses"}`}
        className={`absolute inset-0 w-full h-full rounded-xl border-2 p-3 touch-manipulation select-none cursor-pointer [-webkit-tap-highlight-color:transparent] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-all duration-300 hover:-translate-y-0.5 ${
          highlight
            ? "border-primary bg-primary/5 shadow-[var(--shadow-card)]"
            : "border-border/40 bg-background/80 hover:border-primary/40"
        }`}
      >
        {!flipped ? (
          <div className="h-full text-center flex flex-col items-center justify-between">
            {highlight && (
              <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap shadow-md">
                Meilleur prix
              </span>
            )}
            <div className="flex flex-col items-center gap-1 mt-1">
              <img src={logo} alt={name} className="h-7 max-w-[68px] object-contain" loading="lazy" />
              <p className="text-xs font-bold text-foreground leading-tight">{name}</p>
            </div>

            {/* Price bubble — violet bg + gold text for contrast */}
            <div className="bg-gradient-to-br from-primary to-[hsl(265,85%,45%)] rounded-full px-4 py-2 shadow-md flex items-baseline gap-1">
              {badge && (
                <span className="text-[9px] text-white/80 font-medium uppercase mr-0.5">{badge}</span>
              )}
              <span className="text-xl md:text-2xl font-extrabold text-[#fcd34d] leading-none tabular-nums">{price}</span>
              <span className="text-[10px] text-white/85 font-medium">
                {isPercent ? "loyers" : "/mois"}
              </span>
            </div>

            <p className="text-[11px] text-primary font-bold flex items-center gap-1">
              Voir les garanties <span aria-hidden="true">→</span>
            </p>
          </div>
        ) : (
          <div className="h-full text-left flex flex-col">
            <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-border/50">
              <span className="text-xs font-extrabold text-foreground truncate">Garanties {name}</span>
              <RotateCcw className="h-3.5 w-3.5 text-primary shrink-0" aria-hidden="true" />
            </div>
            <ul className="space-y-1.5 flex-1 overflow-y-auto pr-1">
              {features.map((feature) => (
                <li key={feature} className="flex items-start gap-1.5 text-[11px] text-foreground leading-snug">
                  <Check className="h-3 w-3 text-primary shrink-0 mt-0.5" aria-hidden="true" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <p className="text-[10px] text-primary/75 font-semibold text-center mt-2 pt-1.5 border-t border-border/50">
              Cliquez pour revenir au prix
            </p>
          </div>
        )}
      </button>
    </div>
  );
};

export default FlipPriceCard;
