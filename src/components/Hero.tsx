import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useLanguage } from "@/contexts/LanguageContext";
import { useDynamicGreeting, getDefaultGreeting } from "@/components/hero/DynamicGreeting";
import arthurThumbsUp from "@/assets/mascotte/arthur-wink-thumbsup.webp";
import arthurCar from "@/assets/mascotte/arthur-car.webp";
import arthurMoto from "@/assets/mascotte/arthur-moto.webp";
import arthurHouse from "@/assets/mascotte/arthur-house.webp";
import arthurSick from "@/assets/mascotte/arthur-sick.webp";
import arthurAnimals from "@/assets/mascotte/arthur-animals.webp";
import arthurIdea from "@/assets/mascotte/arthur-idea.webp";

// Inline SVG icons — zero bundle cost
const SparklesIcon = () => <svg className="w-4 h-4 md:w-5 md:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/></svg>;
const ZapIcon = () => <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/></svg>;

const Hero = () => {
  const { trackEvent } = useAnalytics();
  const { t } = useLanguage();
  const greeting = useDynamicGreeting();

  const categories = [
  { mascot: arthurCar, labelKey: "category.auto", link: "/assurance-auto", alt: "Arthur auto" },
  { mascot: arthurMoto, labelKey: "category.moto", link: "/assurance-moto", alt: "Arthur moto" },
  { mascot: arthurHouse, labelKey: "category.home", link: "/assurance-habitation", alt: "Arthur habitation" },
  { mascot: arthurSick, labelKey: "category.health", link: "/assurance-sante", alt: "Arthur santé" },
  { mascot: arthurAnimals, labelKey: "category.pets", link: "/assurance-animaux", alt: "Arthur animaux" },
  { mascot: arthurIdea, labelKey: "category.life", link: "/assurance-vie", alt: "Arthur vie" }];

  const handleCategoryClick = (category: string) => {
    trackEvent('insurance_type_click', {
      category: 'hero_category',
      label: category,
      insurance_type: category.toLowerCase()
    });
  };

  // Dynamic vs default content
  const mascotSrc = greeting?.mascotSrc || arthurThumbsUp;
  const mascotAlt = greeting?.mascotAlt || "Arthur mascotte jemassuremoinscher.fr - super-héros de l'assurance moins chère";
  const speechText = greeting?.arthurSpeech || t('hero.arthurSpeech') + " 👋";
  const ctaLink = greeting?.ctaLink || "/comparateur";
  const ctaText = greeting?.ctaText || "Voir mon prix en 2 min";

  return (
    <section
      className="relative min-h-[90vh] flex flex-col justify-center overflow-hidden bg-gradient-to-br from-primary via-primary to-primary/90"
      aria-label="Section principale - Comparateur d'assurances">
      
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-32 right-10 w-48 h-48 bg-accent rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10 py-8 md:py-12">
        {/* Arthur + Title Section */}
        <div className="text-center mb-8">
          {/* Arthur Mascot */}
          <div className="flex justify-center mb-6 animate-fade-in">
            <div className="relative">
              <img
                src={mascotSrc}
                alt={mascotAlt}
                className="w-28 md:w-36 lg:w-44 h-auto drop-shadow-2xl animate-hero-float"
                width={176}
                height={220}
                loading="eager"
                decoding="async"
                fetchPriority="high"
              />
              
              {/* Speech bubble */}
              <div className="absolute -top-2 -right-16 md:-right-20 bg-white rounded-xl px-3 py-1.5 shadow-lg animate-fade-in-delay">
                <p className="text-primary font-bold text-xs md:text-sm whitespace-nowrap">
                  {speechText}
                </p>
                <div className="absolute -bottom-1.5 left-3 w-3 h-3 bg-white transform rotate-45" />
              </div>
            </div>
          </div>

          {/* Main Title */}
          {greeting ? (
            <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-primary-foreground mb-4 leading-tight font-[Inter] animate-fade-in-up">
              {greeting.title}
            </h1>
          ) : (
            <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-primary-foreground mb-4 leading-tight font-[Inter] animate-fade-in-up">
              <span className="relative inline-block">
                <span className="relative z-10">{t('hero.titleAccent')}</span>
                <span
                  className="absolute left-0 right-0 bottom-[-0.05em] h-[0.18em] md:h-[0.16em] bg-accent/80 rounded-full -rotate-[0.5deg] z-0"
                  aria-hidden="true" />
              </span>
              {t('hero.titleAccentSuffix')}{t('hero.title')} <br />
              <span className="text-accent">{t('hero.titleHighlight')}</span>
            </h1>
          )}
          <span className="sr-only">Assurance moins chère : le comparateur d'assurances N°1 en France. Changez d'assurance facilement et économisez jusqu'à 40%. Alternative à LesFurets avec 50+ assureurs partenaires. Comparateur d'assurances auto, santé, habitation gratuit.</span>

          {/* Subtitle */}
          {greeting ? (
            <p className="text-lg md:text-xl text-primary-foreground/90 mb-8 max-w-lg mx-auto font-[Inter] animate-fade-in-up-delay">
              {greeting.subtitle}
            </p>
          ) : (
            <p className="text-lg md:text-xl text-primary-foreground/90 mb-8 max-w-lg mx-auto font-[Inter] animate-fade-in-up-delay">
              {t('hero.subtitle')} <span className="font-bold">{t('hero.subtitleBold')}</span> {t('hero.subtitleEnd')}
              <br />
              <span className="text-primary-foreground/80">{t('hero.line2')}</span>
              <br />
              <span className="text-primary-foreground/80">{t('hero.line3')}</span>
            </p>
          )}
        </div>

        {/* Savings Badge */}
        <div className="flex justify-center mb-6 animate-fade-in-up-delay">
          <div className="inline-flex items-center gap-2 bg-accent/20 backdrop-blur-sm border border-accent/40 rounded-full px-4 py-2 md:px-6 md:py-3">
            <span className="text-accent"><SparklesIcon /></span>
            <span className="text-sm md:text-base font-bold text-primary-foreground text-center">
              {greeting ? greeting.badgeText : (
                <>{t('hero.savingsBadge')} <span className="text-accent">{t('hero.savingsPercent')}</span> {t('hero.savingsEnd')}</>
              )}
            </span>
          </div>
        </div>

        {/* CTA Button */}
        <div className="flex flex-col items-center mb-8 animate-fade-in-up-delay">
          <Link
            to={ctaLink}
            onClick={() => trackEvent('insurance_type_click', { category: 'hero_cta', label: greeting ? 'dynamic_cta' : 'voir_mon_prix', ref: greeting ? 'personalized' : 'default' })}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[hsl(43_80%_65%)] to-[hsl(38_75%_58%)] hover:from-[hsl(43_80%_60%)] hover:to-[hsl(38_75%_53%)] text-foreground font-bold text-base md:text-lg px-8 py-3.5 md:px-10 md:py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
            aria-label={ctaText}>
            <ZapIcon />
            {ctaText}
          </Link>
        </div>

        {/* Category Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4 max-w-4xl mx-auto animate-fade-in-up-delay-2">
          {categories.map((category) =>
            <Link
              key={category.labelKey}
              to={category.link}
              onClick={() => handleCategoryClick(t(category.labelKey))}
              className="block">
              <Card className="p-4 md:p-6 bg-white/95 backdrop-blur-sm border-2 border-transparent hover:border-accent transition-all duration-300 cursor-pointer group card-hover active:scale-95">
                <div className="flex flex-col items-center gap-2 md:gap-3">
                  <div className="group-hover:scale-110 transition-transform duration-300">
                    <img
                      src={category.mascot}
                      alt={category.alt}
                      className="h-12 w-12 md:h-16 md:w-16 object-contain"
                      width={64}
                      height={64}
                      loading="eager"
                    />
                  </div>
                  <span className="font-bold text-sm md:text-base text-foreground group-hover:text-primary transition-colors font-[Inter]">
                    {t(category.labelKey)}
                  </span>
                </div>
              </Card>
            </Link>
          )}
        </div>

        {/* Link to all insurance types */}
        <div className="text-center mt-4 animate-fade-in-up-delay-2">
          <Link
            to="/comparateur"
            className="text-sm text-primary-foreground/70 hover:text-accent transition-colors underline underline-offset-4 decoration-primary-foreground/30 hover:decoration-accent">
            Voir tous les types d'assurance →
          </Link>
        </div>
      </div>
    </section>);
};

export default Hero;
