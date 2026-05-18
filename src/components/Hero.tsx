import { lazy, Suspense } from "react";
import { heroContent } from "@/config/heroContent";
import { useLanguage } from "@/contexts/LanguageContext";

const MultiStepQuoteForm = lazy(() =>
  import("@/components/forms/MultiStepQuoteForm").then((m) => ({ default: m.MultiStepQuoteForm }))
);

const arthurMascot = "/arthur-wink-thumbsup.webp";

const Hero = () => {
  const { language, t } = useLanguage();
  const slogan = language === "en"
    ? {
        line1: t("hero.slogan.line1"),
        line2Prefix: t("hero.slogan.line2Prefix"),
        line2Highlight: t("hero.slogan.line2Highlight"),
        line2Suffix: t("hero.slogan.line2Suffix"),
        line3: t("hero.slogan.line3"),
      }
    : heroContent.slogan;
  const arthurBubble = language === "en" ? t("hero.arthurBubble") : heroContent.arthurBubble;
  const arthurImageAlt = language === "en" ? t("hero.arthurImageAlt") : heroContent.arthurImageAlt;

  return (
    <section
      className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-primary/90 py-10 md:py-14"
      aria-label={t("a11y.hero.section")}
    >
      <div className="absolute inset-0 opacity-10 pointer-events-none" aria-hidden="true">
        <div className="absolute top-20 left-10 w-32 h-32 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-32 right-10 w-48 h-48 bg-accent rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10 max-w-6xl">
        {/* Top row: Arthur (md+) à gauche du H1 */}
        <div className="flex flex-col md:flex-row md:items-center md:gap-6 lg:gap-10 mb-10 md:mb-12">
          {/* Arthur + bulle — desktop & tablet uniquement */}
          <div className="hidden md:flex shrink-0 justify-center items-center animate-fade-in">
            <div className="relative inline-block">
              <img
                src={arthurMascot}
                alt={arthurImageAlt}
                className="w-32 lg:w-48 h-auto drop-shadow-2xl animate-hero-float"
                width={192}
                height={240}
                loading="eager"
                decoding="async"
                fetchPriority="high"
              />
              <div className="absolute -top-2 -right-2 lg:-top-4 lg:-right-4 bg-white rounded-2xl px-3 py-1.5 lg:px-4 lg:py-2 shadow-[0_8px_24px_-8px_rgba(0,0,0,0.25)] animate-fade-in-delay">
                <p className="text-primary font-bold text-xs lg:text-sm whitespace-nowrap">
                  {arthurBubble}
                </p>
                <div className="absolute -bottom-1.5 left-4 w-3 h-3 bg-white transform rotate-45" />
              </div>
            </div>
          </div>

          <h1 className="flex-1 min-w-0 text-2xl sm:text-3xl md:text-[1.75rem] lg:text-5xl xl:text-[3.5rem] font-black text-white text-center md:text-left leading-tight font-[Inter] animate-fade-in-up">
            {slogan.line1}
            <br />
            {slogan.line2Prefix}
            <span className="underline decoration-white decoration-[6px] md:decoration-8 underline-offset-[6px] md:underline-offset-8">
              {slogan.line2Highlight}
            </span>
            {slogan.line2Suffix}
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
        </div>

        {/* Form — élargi et centré sur md+ */}
        <div className="w-full md:max-w-4xl lg:max-w-5xl md:mx-auto animate-fade-in-up-delay">
          <Suspense
            fallback={
              <div aria-hidden="true" className="h-[600px] rounded-[2rem] bg-card/80 backdrop-blur-xl border border-border/50" />
            }
          >
            <MultiStepQuoteForm insuranceType="comparateur" className="!max-w-none" fixedHeight />
          </Suspense>
        </div>
      </div>
    </section>
  );
};

export default Hero;
