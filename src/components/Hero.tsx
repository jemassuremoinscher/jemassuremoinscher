import { useEffect, useRef, useState } from "react";
import HeroQuoteForm from "@/components/hero/HeroQuoteForm";

const arthurMascot = "/arthur-wink-thumbsup.webp";

/** Animated counter that grows slowly over the year */
function useDevisCounter() {
  const [count, setCount] = useState(0);
  const animFrame = useRef<number | null>(null);

  useEffect(() => {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const dayOfYear = Math.floor((now.getTime() - startOfYear.getTime()) / 86400000);
    const target = 1200 + Math.floor(dayOfYear * 4);

    const duration = 1800;
    const start = performance.now();

    const tick = (timestamp: number) => {
      const elapsed = timestamp - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(target * eased));
      if (progress < 1) {
        animFrame.current = requestAnimationFrame(tick);
      }
    };

    animFrame.current = requestAnimationFrame(tick);
    return () => {
      if (animFrame.current) cancelAnimationFrame(animFrame.current);
    };
  }, []);

  return count;
}

const GOLD = "hsl(43_80%_65%)";

const Hero = () => {
  const devisCount = useDevisCounter();

  return (
    <section
      className="relative flex flex-col justify-center overflow-hidden bg-gradient-to-br from-primary via-primary to-primary/90 py-10 md:py-16"
      aria-label="Section principale - Comparateur d'assurances"
    >
      {/* MD3 background tonal layers */}
      <div className="absolute inset-0 opacity-10" aria-hidden="true">
        <div className="absolute top-20 left-10 w-32 h-32 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-32 right-10 w-48 h-48 bg-accent rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* H1 — toujours 3 lignes (mobile, tablet, desktop) */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-white text-center mb-8 md:mb-12 leading-tight font-[Inter] animate-fade-in-up max-w-5xl mx-auto">
          <span className="underline decoration-[hsl(43_80%_65%)] decoration-[3px] md:decoration-4 underline-offset-4">LE</span>{" "}
          site pour comparer son assurance
          <br />
          et la payer moins cher,
          <br />
          <span className="text-[hsl(43_80%_65%)]">sans compromis.</span>
        </h1>

        {/* 2 colonnes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 items-center max-w-6xl mx-auto">
          {/* GAUCHE : formulaire */}
          <div className="animate-fade-in-up-delay">
            <HeroQuoteForm />
          </div>

          {/* DROITE : Arthur */}
          <div className="flex justify-center md:justify-start animate-fade-in">
            <div className="relative inline-block">
              <img
                src={arthurMascot}
                alt="Arthur mascotte jemassuremoinscher.fr"
                className="w-44 md:w-64 lg:w-80 h-auto drop-shadow-2xl animate-hero-float"
                width={320}
                height={400}
                loading="eager"
                decoding="async"
                fetchPriority="high"
              />
              <div className="absolute -top-2 -right-2 md:-top-4 md:right-0 bg-white rounded-2xl px-3 py-1.5 md:px-4 md:py-2 shadow-[0_8px_24px_-8px_rgba(0,0,0,0.25)] animate-fade-in-delay">
                <p className="text-primary font-bold text-xs md:text-sm whitespace-nowrap">
                  Hello, moi c'est Arthur 👋
                </p>
                <div className="absolute -bottom-1.5 left-4 w-3 h-3 bg-white transform rotate-45" />
              </div>
            </div>
          </div>
        </div>

        {/* STATS — alignées sur la largeur du H1 (max-w-5xl), MD3 cards */}
        <div className="mt-10 md:mt-14 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 max-w-5xl mx-auto animate-fade-in-up-delay-2">
          <div className="bg-white rounded-3xl shadow-[0_4px_16px_-4px_rgba(0,0,0,0.15)] hover:shadow-[0_12px_28px_-8px_rgba(0,0,0,0.25)] p-5 md:p-6 flex flex-col items-center justify-center gap-2 transition-shadow text-center">
            <span className="text-3xl md:text-4xl" aria-hidden="true">💰</span>
            <p className="text-xs md:text-sm text-muted-foreground font-medium">Économie moyenne</p>
            <p className="text-2xl md:text-3xl font-black text-primary">40%</p>
          </div>
          <div className="bg-white rounded-3xl shadow-[0_4px_16px_-4px_rgba(0,0,0,0.15)] hover:shadow-[0_12px_28px_-8px_rgba(0,0,0,0.25)] p-5 md:p-6 flex flex-col items-center justify-center gap-2 transition-shadow text-center">
            <span className="text-3xl md:text-4xl" aria-hidden="true">🎯</span>
            <p className="text-xs md:text-sm text-muted-foreground font-medium">Devis réalisés</p>
            <p className="text-2xl md:text-3xl font-black text-primary tabular-nums">
              {devisCount.toLocaleString("fr-FR")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
