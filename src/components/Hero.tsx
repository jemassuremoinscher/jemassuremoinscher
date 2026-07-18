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
      className="relative overflow-hidden bg-gradient-to-br from-[hsl(265,85%,20%)] via-primary to-[hsl(265,85%,35%)] py-10 md:py-14"
      aria-label={t("a11y.hero.section")}
    >
      {/* MD3 Expressive organic background shapes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute -top-24 -right-24 h-[28rem] w-[28rem] rounded-full bg-primary opacity-30 blur-3xl" />
        <div className="absolute top-1/3 -left-32 h-80 w-80 rounded-full bg-accent opacity-20 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10 max-w-6xl">
        {/* Top row: content + Arthur */}
        <div className="flex flex-col md:flex-row md:items-center md:gap-8 lg:gap-12 mb-10 md:mb-12">
          <div className="flex-1 min-w-0 text-center md:text-left">

            <h1 className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight text-white leading-[1.05] font-[Inter] animate-fade-in-up">
              {slogan.line1.replace(/280€\/an/, "")}
              <span className="text-accent"> 280€/an</span>
              <br className="hidden sm:block" />
              <span className="text-white/90 font-bold">
                {" "}{slogan.line2Prefix}
                <span>{slogan.line2Highlight}</span>
                {slogan.line2Suffix}
              </span>
            </h1>

            <p className="mt-5 md:mt-6 animate-fade-in-up-delay">
              <span className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-base md:text-lg font-bold text-primary shadow-[0_10px_30px_-8px_hsl(var(--accent)/0.6)]">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>
                </svg>
                {slogan.line3}
              </span>
            </p>
          </div>

          {/* Arthur — desktop & tablet */}
          <div className="hidden md:flex shrink-0 justify-center items-center animate-fade-in-delay">
            <div className="relative inline-block">
              <div aria-hidden="true" className="absolute inset-0 -m-8 rounded-full bg-gradient-to-tr from-accent/40 via-white/10 to-transparent blur-2xl" />
              <img
                src={arthurMascot}
                alt={arthurImageAlt}
                className="relative w-36 lg:w-52 h-auto drop-shadow-2xl animate-hero-float"
                width={208}
                height={260}
                loading="eager"
                decoding="async"
                fetchPriority="high"
              />
              <div className="hidden lg:block absolute -top-4 -right-4 bg-white rounded-2xl px-4 py-2 shadow-[0_8px_24px_-8px_rgba(0,0,0,0.25)] animate-fade-in-delay z-10">
                <p className="text-primary font-bold text-sm whitespace-nowrap">
                  {arthurBubble}
                </p>
                <div className="absolute -bottom-1.5 left-4 w-3 h-3 bg-white transform rotate-45" />
              </div>
            </div>
          </div>
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
