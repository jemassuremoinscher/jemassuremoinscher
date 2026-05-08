import { lazy, Suspense } from "react";
import { heroContent } from "@/config/heroContent";

const MultiStepQuoteForm = lazy(() =>
  import("@/components/forms/MultiStepQuoteForm").then((m) => ({ default: m.MultiStepQuoteForm }))
);

const arthurMascot = "/arthur-wink-thumbsup.webp";

const Hero = () => {
  const { slogan, arthurBubble, arthurImageAlt } = heroContent;

  return (
    <section
      className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-primary/90 py-10 md:py-14"
      aria-label="Section principale - Comparateur d'assurances"
    >
      <div className="absolute inset-0 opacity-10 pointer-events-none" aria-hidden="true">
        <div className="absolute top-20 left-10 w-32 h-32 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-32 right-10 w-48 h-48 bg-accent rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10 max-w-6xl">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-[3.5rem] font-black text-white text-center mb-10 md:mb-14 leading-tight font-[Inter] animate-fade-in-up">
          {slogan.line1Prefix}
          <span className="underline decoration-accent decoration-4 underline-offset-[6px] md:underline-offset-8">
            {slogan.line1Highlight}
          </span>
          {slogan.line1Suffix}
          <br />
          {slogan.line2}
          <br />
          <span className="relative inline-block">
            <span className="relative z-10" style={{ color: "#f5b80a" }}>{slogan.line3}</span>
            <svg
              aria-hidden="true"
              viewBox="0 0 200 14"
              preserveAspectRatio="none"
              className="absolute left-0 right-0 -bottom-1 md:-bottom-2 w-full h-3 md:h-4"
            >
              <path d="M3 8 L 197 6" stroke="#f5b80a" strokeWidth="9" strokeLinecap="round" fill="none" opacity="0.9" />
            </svg>
          </span>
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 items-center">
          {/* GAUCHE — Form (taille fixe + scroll interne) */}
          <div className="w-full animate-fade-in-up-delay">
            <Suspense
              fallback={
                <div aria-hidden="true" className="h-[600px] rounded-[2rem] bg-card/80 backdrop-blur-xl border border-border/50" />
              }
            >
              <MultiStepQuoteForm insuranceType="comparateur" className="!max-w-none" fixedHeight />
            </Suspense>
          </div>

          {/* DROITE — Arthur centré */}
          <div className="hidden md:flex justify-center items-center animate-fade-in">
            <div className="relative inline-block">
              <img
                src={arthurMascot}
                alt="Arthur mascotte jemassuremoinscher, guide pour comparer assurance auto, habitation et santé"
                className="w-56 lg:w-72 h-auto drop-shadow-2xl animate-hero-float"
                width={288}
                height={360}
                loading="eager"
                decoding="async"
                fetchPriority="high"
              />
              <div className="absolute -top-2 -right-2 lg:-top-4 lg:-right-4 bg-white rounded-2xl px-4 py-2 shadow-[0_8px_24px_-8px_rgba(0,0,0,0.25)] animate-fade-in-delay">
                <p className="text-primary font-bold text-sm whitespace-nowrap">
                  Hello, moi c'est Arthur 👋
                </p>
                <div className="absolute -bottom-1.5 left-4 w-3 h-3 bg-white transform rotate-45" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
