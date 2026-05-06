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

      <div className="container mx-auto px-4 relative z-10 max-w-6xl">
        {/* H1 — toujours 3 lignes (mobile, tablet, desktop) */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-white text-center mb-8 md:mb-12 leading-tight font-[Inter] animate-fade-in-up">
          <span className="relative inline-block">
            <span className="relative z-10">LE site</span>
            <svg
              aria-hidden="true"
              viewBox="0 0 200 14"
              preserveAspectRatio="none"
              className="absolute left-0 right-0 -bottom-2 md:-bottom-3 w-full h-2.5 md:h-3.5"
            >
              <path
                d="M2 8 Q 50 2, 100 7 T 198 6"
                stroke="#f5b80a"
                strokeWidth="5"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
          </span>{" "}
          pour comparer son assurance
          <br />
          et la payer moins cher,
          <br />
          <span style={{ color: "#f5b80a" }}>sans compromis.</span>
        </h1>

        {/* 2 colonnes — alignées en haut */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 items-start">
          {/* GAUCHE : formulaire */}
          <div className="animate-fade-in-up-delay w-full">
            <HeroQuoteForm />
          </div>

          {/* DROITE : Arthur — aligné à droite (même axe que la carte stat de droite) */}
          <div className="flex justify-center md:justify-end animate-fade-in">
            <div className="relative inline-block">
              <img
                src={arthurMascot}
                alt="Arthur mascotte jemassuremoinscher.fr"
                className="w-44 md:w-56 lg:w-72 h-auto drop-shadow-2xl animate-hero-float"
                width={288}
                height={360}
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

        {/* STATS — même grille 2 col que la rangée du dessus pour alignement parfait */}
        <div className="mt-10 md:mt-14 grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-10 animate-fade-in-up-delay-2">
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
