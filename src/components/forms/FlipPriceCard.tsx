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
    <div className="relative h-[200px] [perspective:1000px]">
      <button
        type="button"
        onClick={onClick}
        onKeyDown={onKey}
        aria-pressed={flipped}
        aria-label={`Formule ${name} — ${flipped ? "voir le prix" : "voir les garanties incluses"}`}
        className="absolute inset-0 w-full h-full rounded-xl [transform-style:preserve-3d] transition-transform duration-500 ease-out touch-manipulation select-none cursor-pointer [-webkit-tap-highlight-color:transparent] [will-change:transform] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        style={{ transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
      >
        {/* Front */}
        <div
          className={`absolute inset-0 rounded-xl border-2 p-2.5 text-center flex flex-col items-center justify-between [backface-visibility:hidden] ${
            highlight
              ? "border-primary bg-primary/5 shadow-[var(--shadow-card)]"
              : "border-border/40 bg-background/60"
          }`}
        >
          {highlight && (
            <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap shadow-md">
              Meilleur prix
            </span>
          )}
          <div className="flex flex-col items-center gap-0.5 mt-1">
            <img src={logo} alt={name} className="h-6 max-w-[60px] object-contain" loading="lazy" />
            <p className="text-[11px] font-semibold text-foreground leading-tight">{name}</p>
          </div>

          {/* Price bubble — violet bg + gold text for contrast */}
          <div className="bg-gradient-to-br from-primary to-[hsl(265,85%,45%)] rounded-full px-3 py-1.5 shadow-md flex items-baseline gap-0.5">
            {badge && (
              <span className="text-[9px] text-white/80 font-medium uppercase mr-0.5">{badge}</span>
            )}
            <span className="text-lg md:text-xl font-extrabold text-[#fcd34d] leading-none tabular-nums">{price}</span>
            <span className="text-[9px] text-white/85 font-medium">
              {isPercent ? "loyers" : "/mois"}
            </span>
          </div>

          <p className="text-[10px] text-primary font-semibold flex items-center gap-1">
            Voir les garanties <span aria-hidden="true">→</span>
          </p>
        </div>

        {/* Back */}
        <div
          className={`absolute inset-0 rounded-xl border-2 p-2.5 text-left [backface-visibility:hidden] [transform:rotateY(180deg)] overflow-hidden flex flex-col ${
            highlight
              ? "border-primary bg-primary/5 shadow-[var(--shadow-card)]"
              : "border-border/40 bg-background"
          }`}
        >
          <div className="flex items-center justify-between mb-1.5 pb-1 border-b border-border/40">
            <span className="text-[11px] font-bold text-foreground truncate">{name}</span>
            <RotateCcw className="h-3 w-3 text-primary shrink-0" aria-hidden="true" />
          </div>
          <ul className="space-y-1 flex-1 overflow-y-auto">
            {features.map((f) => (
              <li key={f} className="flex items-start gap-1 text-[10px] text-foreground/85 leading-snug">
                <Check className="h-2.5 w-2.5 text-primary shrink-0 mt-0.5" aria-hidden="true" />
                <span>{f}</span>
              </li>
            ))}
          </ul>
          <p className="text-[9px] text-primary/70 italic text-center mt-1 pt-1 border-t border-border/40">
            Cliquez pour revenir au prix
          </p>
        </div>
      </button>
    </div>
  );
};

export default FlipPriceCard;
