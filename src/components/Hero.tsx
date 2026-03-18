import { Card } from "@/components/ui/card";
import { Car, Heart, Home, PawPrint, Bike, HeartPulse, Sparkles, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useLanguage } from "@/contexts/LanguageContext";
import arthurThumbsUp from "@/assets/mascotte/arthur-wink-thumbsup.png";

const Hero = () => {
  const { trackEvent } = useAnalytics();
  const { t } = useLanguage();

  const categories = [
  { icon: Car, labelKey: "category.auto", link: "/assurance-auto" },
  { icon: Bike, labelKey: "category.moto", link: "/assurance-moto" },
  { icon: Home, labelKey: "category.home", link: "/assurance-habitation" },
  { icon: HeartPulse, labelKey: "category.health", link: "/assurance-sante" },
  { icon: PawPrint, labelKey: "category.pets", link: "/assurance-animaux" },
  { icon: Heart, labelKey: "category.life", link: "/assurance-vie" }];

  const handleCategoryClick = (category: string) => {
    trackEvent('insurance_type_click', {
      category: 'hero_category',
      label: category,
      insurance_type: category.toLowerCase()
    });
  };

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
                src={arthurThumbsUp}
                alt="Arthur mascotte jemassuremoinscher.fr - super-héros de l'assurance moins chère"
                className="w-28 md:w-36 lg:w-44 h-auto drop-shadow-2xl animate-hero-float"
                width={176}
                height={220}
                loading="eager"
                decoding="async"
              />
              
              {/* Speech bubble */}
              <div className="absolute -top-2 -right-16 md:-right-20 bg-white rounded-xl px-3 py-1.5 shadow-lg animate-fade-in-delay">
                <p className="text-primary font-bold text-xs md:text-sm whitespace-nowrap">
                  {t('hero.arthurSpeech')} 👋
                </p>
                <div className="absolute -bottom-1.5 left-3 w-3 h-3 bg-white transform rotate-45" />
              </div>
            </div>
          </div>

          {/* Main Title */}
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
          {/* SEO-optimized hidden H1 for search engines */}
          <span className="sr-only">Assurance moins chère : le comparateur d'assurances N°1 en France. Changez d'assurance facilement et économisez jusqu'à 40%. Alternative à LesFurets avec 50+ assureurs partenaires. Comparateur d'assurances auto, santé, habitation gratuit.</span>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-primary-foreground/90 mb-8 max-w-lg mx-auto font-[Inter] animate-fade-in-up-delay">
            {t('hero.subtitle')} <span className="font-bold">{t('hero.subtitleBold')}</span> {t('hero.subtitleEnd')}
            <br />
            <span className="text-primary-foreground/80">{t('hero.line2')}</span>
            <br />
            <span className="text-primary-foreground/80">{t('hero.line3')}</span>
          </p>
        </div>

        {/* Savings Badge */}
        <div className="flex justify-center mb-6 animate-fade-in-up-delay">
          <div className="inline-flex items-center gap-2 bg-accent/20 backdrop-blur-sm border border-accent/40 rounded-full px-4 py-2 md:px-6 md:py-3">
            <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-accent" />
            <span className="text-sm md:text-base font-bold text-primary-foreground text-center">
              {t('hero.savingsBadge')} <span className="text-accent">{t('hero.savingsPercent')}</span> {t('hero.savingsEnd')}
            </span>
          </div>
        </div>

        {/* CTA Button */}
        <div className="flex flex-col items-center mb-8 animate-fade-in-up-delay">
          <Link
            to="/comparateur"
            onClick={() => trackEvent('insurance_type_click', { category: 'hero_cta', label: 'voir_mon_prix' })}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[hsl(43_80%_65%)] to-[hsl(38_75%_58%)] hover:from-[hsl(43_80%_60%)] hover:to-[hsl(38_75%_53%)] text-foreground font-bold text-base md:text-lg px-8 py-3.5 md:px-10 md:py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
            aria-label="Voir mon prix en moins de deux minutes - comparaison gratuite">
            <Zap className="w-5 h-5" aria-hidden="true" />
            Voir mon prix en moins de 2 min
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
                  <div className="p-3 md:p-4 rounded-full bg-primary/10 group-hover:bg-accent/20 transition-all duration-300 group-hover:scale-110">
                    <category.icon className="h-6 w-6 md:h-8 md:w-8 text-primary group-hover:text-accent transition-colors" />
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
