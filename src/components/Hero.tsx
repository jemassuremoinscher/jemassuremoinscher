import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Car, Heart, Home, CreditCard, Users, TrendingDown, Shield, CheckCircle, Bike } from "lucide-react";
import heroImage from "@/assets/hero-insurance.jpg";
import { Link } from "react-router-dom";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useLanguage } from "@/contexts/LanguageContext";

const Hero = () => {
  const { trackEvent } = useAnalytics();
  const { t } = useLanguage();

  const categories = [
    { icon: Car, label: t('category.auto'), color: "text-primary", link: "/assurance-auto" },
    { icon: Heart, label: t('category.health'), color: "text-primary", link: "/assurance-sante" },
    { icon: Users, label: t('category.pets'), color: "text-primary", link: "/assurance-animaux" },
    { icon: Home, label: t('category.home'), color: "text-primary", link: "/assurance-habitation" },
    { icon: CreditCard, label: t('category.loan'), color: "text-primary", link: "/assurance-pret" },
    { icon: Bike, label: t('category.moto'), color: "text-primary", link: "/assurance-moto" },
  ];

  const handleCTAClick = () => {
    trackEvent('insurance_type_click', {
      category: 'hero_cta',
      label: 'primary_cta_button',
      insurance_type: 'auto',
    });
  };

  const handleCategoryClick = (category: string) => {
    trackEvent('insurance_type_click', {
      category: 'hero_category',
      label: category,
      insurance_type: category.toLowerCase(),
    });
  };

  return (
    <section className="relative min-h-[700px] flex items-center overflow-hidden" aria-label="Section principale - Comparateur d'assurances">
      {/* Background Image */}
      <img 
        src={heroImage}
        alt="Famille heureuse avec assurance"
        className="absolute inset-0 w-full h-full object-cover"
        loading="eager"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/85 to-primary/40" />

      {/* Animated Geometric Shapes */}
      <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-accent/20 transform skew-x-[-8deg] translate-x-1/4 animate-pulse" />
      <div className="absolute left-1/4 top-20 w-32 h-32 bg-accent/10 rounded-full blur-3xl animate-float" />
      <div className="absolute right-1/4 bottom-20 w-48 h-48 bg-secondary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl py-20">
          <p className="text-primary-foreground/90 text-lg font-semibold mb-4 uppercase tracking-wider animate-fade-in flex items-center gap-2">
            <Shield className="h-5 w-5" aria-hidden="true" />
            {t('hero.badge')}
          </p>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-primary-foreground mb-6 leading-tight animate-fade-in" style={{ animationDelay: '0.1s' }}>
            {t('hero.title')} <span className="text-gradient bg-gradient-to-r from-accent via-secondary to-accent bg-clip-text text-transparent">{t('hero.titleHighlight')}</span> {t('hero.titleEnd')}
          </h1>
          
          <h2 className="text-xl md:text-2xl text-primary-foreground/90 mb-8 animate-fade-in" style={{ animationDelay: '0.15s' }}>
            {t('hero.subtitle')}
          </h2>

          <div className="inline-block mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <p className="text-2xl md:text-3xl font-bold text-primary-foreground">
              {t('hero.savings')} <span className="text-accent border-b-4 border-accent px-2 inline-block transform hover:scale-110 transition-transform">{t('hero.savingsAmount')}</span> {t('hero.savingsPerYear')}
            </p>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-3 gap-4 mb-10 animate-fade-in" style={{ animationDelay: '0.25s' }}>
            <div className="bg-card/20 backdrop-blur-md rounded-lg p-4 border border-primary-foreground/20">
              <div className="flex items-center gap-2 text-accent mb-1">
                <TrendingDown className="h-5 w-5" />
                <span className="text-2xl md:text-3xl font-bold">-35%</span>
              </div>
              <p className="text-primary-foreground/80 text-xs md:text-sm">{t('hero.avgSavings')}</p>
            </div>
            <div className="bg-card/20 backdrop-blur-md rounded-lg p-4 border border-primary-foreground/20">
              <div className="flex items-center gap-2 text-accent mb-1">
                <CheckCircle className="h-5 w-5" />
                <span className="text-2xl md:text-3xl font-bold">2min</span>
              </div>
              <p className="text-primary-foreground/80 text-xs md:text-sm">{t('hero.compareTime')}</p>
            </div>
            <div className="bg-card/20 backdrop-blur-md rounded-lg p-4 border border-primary-foreground/20">
              <div className="flex items-center gap-2 text-accent mb-1">
                <Shield className="h-5 w-5" />
                <span className="text-2xl md:text-3xl font-bold">100%</span>
              </div>
              <p className="text-primary-foreground/80 text-xs md:text-sm">{t('hero.freeNoObligation')}</p>
            </div>
          </div>

          {/* CTA Button */}
          <div className="mb-12 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <Button 
              size="lg" 
              className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-lg px-8 py-6 h-auto rounded-full shadow-2xl hover:shadow-accent/50 transition-all duration-300 hover:scale-105"
              asChild
              onClick={handleCTAClick}
            >
              <Link to="/assurance-auto">
                {t('hero.cta')}
              </Link>
            </Button>
            <p className="text-primary-foreground/70 text-sm mt-3">
              {t('hero.ctaDetails')}
            </p>
          </div>

          {/* Category Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 animate-fade-in" style={{ animationDelay: '0.35s' }}>
            {categories.map((category, index) => (
              <Link key={index} to={category.link} onClick={() => handleCategoryClick(category.label)}>
                <Card className="p-6 hover-lift cursor-pointer group bg-card/95 backdrop-blur-sm border-2 border-transparent hover:border-accent/50">
                  <div className="flex flex-col items-center gap-3">
                    <div className="p-3 rounded-full bg-primary/5 group-hover:bg-accent/20 transition-all duration-300 group-hover:scale-110">
                      <category.icon className={`h-8 w-8 ${category.color} group-hover:text-accent transition-colors`} />
                    </div>
                    <span className="font-bold text-sm text-card-foreground group-hover:text-accent transition-colors">{category.label}</span>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
