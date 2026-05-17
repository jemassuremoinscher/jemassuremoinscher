import { Link } from "react-router-dom";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useDynamicGreeting } from "@/components/hero/DynamicGreeting";
import { useLanguage } from "@/contexts/LanguageContext";

const SparklesIcon = () => <svg className="w-4 h-4 md:w-5 md:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/></svg>;
const ZapIcon = () => <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/></svg>;

interface Props {
  t: (key: string) => string;
  trackEvent: (name: string, data: Record<string, string>) => void;
}

const DynamicHeroContent = ({ t, trackEvent }: Props) => {
  const { t } = useLanguage();
  const greeting = useDynamicGreeting();

  if (!greeting) {
    // Fallback — shouldn't happen since we only load this when ref is present
    return null;
  }

  return (
    <>
      <div className="text-center mb-8">
        <div className="flex justify-center mb-6 animate-fade-in">
          <div className="relative">
            <img
              src={greeting.mascotSrc}
              alt={greeting.mascotAlt}
              className="w-28 md:w-36 lg:w-44 h-auto drop-shadow-2xl animate-hero-float"
              width={176}
              height={220}
              loading="eager"
              decoding="async"
              fetchPriority="high"
            />
            <div className="absolute -top-2 -right-16 md:-right-20 bg-white rounded-xl px-3 py-1.5 shadow-lg animate-fade-in-delay">
              <p className="text-primary font-bold text-xs md:text-sm whitespace-nowrap">
                {greeting.arthurSpeech}
              </p>
              <div className="absolute -bottom-1.5 left-3 w-3 h-3 bg-white transform rotate-45" />
            </div>
          </div>
        </div>

        <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-primary-foreground mb-4 leading-tight font-[Inter] animate-fade-in-up">
          {greeting.title}
        </h1>
        <p className="text-lg md:text-xl text-primary-foreground/90 mb-8 max-w-lg mx-auto font-[Inter] animate-fade-in-up-delay">
          {greeting.subtitle}
        </p>
      </div>

      <div className="flex justify-center mb-6 animate-fade-in-up-delay">
        <Link
          to="/avis-clients"
          className="inline-flex items-center gap-2 bg-accent/20 backdrop-blur-sm border border-accent/40 rounded-full px-4 py-2 md:px-6 md:py-3 hover:bg-accent/30 transition-colors duration-200"
          aria-label={t("a11y.hero.viewReviews")}
        >
          <span className="text-accent"><SparklesIcon /></span>
          <span className="text-sm md:text-base font-bold text-primary-foreground text-center">
            {greeting.badgeText}
          </span>
        </Link>
      </div>

      <div className="flex flex-col items-center mb-8 animate-fade-in-up-delay">
        <Link
          to={greeting.ctaLink}
          onClick={() => trackEvent('insurance_type_click', { category: 'hero_cta', label: 'dynamic_cta', ref: 'personalized' })}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-[hsl(43_80%_65%)] to-[hsl(38_75%_58%)] hover:from-[hsl(43_80%_60%)] hover:to-[hsl(38_75%_53%)] text-foreground font-bold text-base md:text-lg px-8 py-3.5 md:px-10 md:py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
          aria-label={greeting.ctaText}>
          <ZapIcon />
          {greeting.ctaText}
        </Link>
      </div>
    </>
  );
};

export default DynamicHeroContent;
