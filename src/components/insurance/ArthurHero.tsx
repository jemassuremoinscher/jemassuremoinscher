import { Button } from "@/components/ui/button";
import { Zap, PiggyBank, Star } from "lucide-react";

interface ArthurHeroProps {
  imageSrc: string;
  imageAlt: string;
  /** Legacy speech bubble — used when title is not provided */
  speechText?: string;
  /** Main H1 text — e.g. "Assurance Auto Moins Chère" */
  title?: string;
  /** Subtitle paragraph */
  subtitle?: string;
  /** Highlighted savings string — e.g. "jusqu'à 400€/an" */
  savingsHighlight?: string;
  ctaLabel?: string;
  onCtaClick?: () => void;
  savingsValue?: string;
  savingsLabel?: string;
  reviewsValue?: string;
  reviewsLabel?: string;
}

const ArthurHero = ({
  imageSrc,
  imageAlt,
  speechText,
  title,
  subtitle,
  savingsHighlight,
  ctaLabel,
  onCtaClick,
  savingsValue = "400€/an",
  savingsLabel = "Économies moyennes",
  reviewsValue = "47K+",
  reviewsLabel = "Avis clients",
}: ArthurHeroProps) => {
  // Legacy fallback (landing templates) — keep simple speech bubble layout
  if (!title) {
    return (
      <div className="relative flex flex-col items-center mb-8 px-4 animate-fade-in">
        <div className="relative z-10 flex items-end gap-3">
          <img
            src={imageSrc}
            alt={imageAlt}
            className="w-24 sm:w-32 md:w-40 h-auto drop-shadow-2xl animate-hero-float"
            width={160}
            height={200}
            loading="eager"
            decoding="async"
          />
          {speechText && (
            <div className="relative mb-8 sm:mb-12 rounded-2xl bg-white/80 backdrop-blur-xl border border-primary/20 px-4 py-2.5 shadow-elevation-2">
              <p className="text-foreground font-medium text-xs sm:text-sm md:text-base leading-snug">
                {speechText} <span className="inline-block animate-pulse">✨</span>
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      {/* Hero card — violet background, asymmetric 70/30 */}
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-primary via-primary to-[hsl(265,85%,45%)] shadow-elevation-3">
        {/* Ambient blobs */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -left-16 w-72 h-72 rounded-full bg-white/10 blur-3xl animate-hero-float" />
          <div
            className="absolute -bottom-20 -right-10 w-80 h-80 rounded-full bg-accent/30 blur-3xl animate-hero-float"
            style={{ animationDelay: "1.2s" }}
          />
          <div
            className="absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage:
                "radial-gradient(white 1px, transparent 1px)",
              backgroundSize: "22px 22px",
            }}
          />
        </div>

        <div className="relative grid md:grid-cols-[7fr_3fr] gap-6 md:gap-4 items-center px-6 py-10 md:px-10 md:py-12 lg:py-14">
          {/* LEFT — text + CTA */}
          <div className="text-left animate-fade-in">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-bold text-white leading-tight tracking-tight text-balance">
              {title}
            </h1>
            <p className="mt-4 text-base md:text-lg text-white/85 max-w-xl leading-relaxed">
              {subtitle}
              {savingsHighlight && (
                <>
                  {" "}
                  <span className="text-accent font-semibold">{savingsHighlight}</span>.
                </>
              )}
            </p>

            <Button
              onClick={onCtaClick}
              aria-label={ctaLabel}
              className="mt-6 h-12 md:h-13 rounded-full bg-accent hover:bg-accent/90 text-primary font-bold text-base md:text-lg px-7 shadow-elevation-2 hover:shadow-elevation-3 hover:-translate-y-0.5 transition-all duration-250"
            >
              <Zap className="h-5 w-5 mr-2" aria-hidden="true" />
              {ctaLabel}
            </Button>
          </div>

          {/* RIGHT — Arthur */}
          <div className="relative flex justify-center md:justify-end items-end animate-fade-in-delay">
            <div className="relative">
              <div
                aria-hidden="true"
                className="absolute inset-0 -m-6 rounded-full bg-gradient-to-tr from-accent/40 via-white/20 to-transparent blur-2xl"
              />
              <img
                src={imageSrc}
                alt={imageAlt}
                className="relative w-44 sm:w-52 md:w-60 lg:w-72 h-auto drop-shadow-2xl animate-hero-float"
                width={288}
                height={360}
                loading="eager"
                decoding="async"
                fetchPriority="high"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Floating stats card */}
      <div className="relative -mt-6 mx-3 md:mx-10 z-10">
        <div className="grid grid-cols-2 gap-2 md:gap-4 rounded-2xl bg-card border border-border/40 shadow-elevation-3 p-4 md:px-6 md:py-4 hover:-translate-y-0.5 hover:shadow-[0_18px_36px_-12px_hsl(var(--primary)/0.35)] transition-all duration-250">
          <div className="flex items-center gap-3 px-2">
            <div className="hidden sm:flex h-10 w-10 rounded-full bg-accent/15 items-center justify-center flex-shrink-0">
              <PiggyBank className="h-5 w-5 text-accent" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <div className="text-lg md:text-xl font-bold text-accent leading-tight">{savingsValue}</div>
              <div className="text-[11px] md:text-xs text-muted-foreground leading-tight">{savingsLabel}</div>
            </div>
          </div>
          <div className="flex items-center gap-3 px-2 border-l border-border/40">
            <div className="hidden sm:flex h-10 w-10 rounded-full bg-primary/10 items-center justify-center flex-shrink-0">
              <Star className="h-5 w-5 text-primary fill-primary" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <div className="text-lg md:text-xl font-bold text-primary leading-tight">{reviewsValue}</div>
              <div className="text-[11px] md:text-xs text-muted-foreground leading-tight flex items-center gap-1">
                <span>{reviewsLabel}</span>
                <span className="text-accent" aria-hidden="true">★★★★★</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArthurHero;
