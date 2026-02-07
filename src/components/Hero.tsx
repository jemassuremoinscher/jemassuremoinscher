import { Card } from "@/components/ui/card";
import { Car, Heart, Home, PawPrint, Bike, HeartPulse, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import arthurThumbsUp from "@/assets/mascotte/arthur-thumbs-up.png";

const Hero = () => {
  const { trackEvent } = useAnalytics();
  const { t } = useLanguage();

  const categories = [
    { icon: Car, labelKey: "category.auto", link: "/assurance-auto" },
    { icon: Bike, labelKey: "category.moto", link: "/assurance-moto" },
    { icon: Home, labelKey: "category.home", link: "/assurance-habitation" },
    { icon: HeartPulse, labelKey: "category.health", link: "/assurance-sante" },
    { icon: PawPrint, labelKey: "category.pets", link: "/assurance-animaux" },
    { icon: Heart, labelKey: "category.life", link: "/assurance-vie" },
  ];

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
      aria-label="Section principale - Comparateur d'assurances"
    >
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
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, y: 20 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }} 
            transition={{ duration: 0.5 }} 
            className="flex justify-center mb-6"
          >
            <motion.div className="relative">
              <motion.img 
                src={arthurThumbsUp} 
                alt="Arthur mascotte jemassuremoinscher - super-héros de l'assurance moins chère" 
                className="w-28 h-auto md:w-36 lg:w-44 drop-shadow-2xl" 
                loading="eager" 
                decoding="async" 
                fetchPriority="high" 
                animate={{ y: [0, -8, 0] }} 
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }} 
              />
              {/* Speech bubble */}
              <motion.div 
                initial={{ opacity: 0, scale: 0, x: 20 }} 
                animate={{ opacity: 1, scale: 1, x: 0 }} 
                transition={{ duration: 0.4, delay: 0.6 }} 
                className="absolute -top-2 -right-16 md:-right-20 bg-white rounded-xl px-3 py-1.5 shadow-lg"
              >
                <p className="text-primary font-bold text-xs md:text-sm whitespace-nowrap">
                  {t('hero.arthurSpeech')} 👋
                </p>
                <div className="absolute -bottom-1.5 left-3 w-3 h-3 bg-white transform rotate-45" />
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Main Title */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5, delay: 0.2 }} 
            className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-primary-foreground mb-4 leading-tight font-[Inter]"
          >
            {t('hero.title')} <br />
            <span className="text-accent">{t('hero.titleHighlight')}</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5, delay: 0.3 }} 
            className="text-lg md:text-xl text-primary-foreground/90 mb-8 max-w-lg mx-auto font-[Inter]"
          >
            {t('hero.subtitle')} <span className="font-bold">{t('hero.subtitleBold')}</span> {t('hero.subtitleEnd')}
            <br className="hidden md:block" />
            <span className="text-primary-foreground/80">{t('hero.subtitleSecondary')}</span>
          </motion.p>
        </div>

        {/* Savings Badge */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ duration: 0.4, delay: 0.4 }} 
          className="flex justify-center mb-6"
        >
          <div className="inline-flex items-center gap-2 bg-accent/20 backdrop-blur-sm border border-accent/40 rounded-full px-4 py-2 md:px-6 md:py-3">
            <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-accent" />
            <span className="text-sm md:text-base font-bold text-primary-foreground">
              {t('hero.savingsBadge')} <span className="text-accent">{t('hero.savingsPercent')}</span> {t('hero.savingsEnd')}
            </span>
          </div>
        </motion.div>

        {/* Category Cards Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5, delay: 0.5 }} 
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4 max-w-4xl mx-auto"
        >
          {categories.map((category, index) => (
            <motion.div 
              key={category.labelKey} 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
            >
              <Link 
                to={category.link} 
                onClick={() => handleCategoryClick(t(category.labelKey))} 
                className="block"
              >
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
            </motion.div>
          ))}
        </motion.div>

        {/* Trust Indicators */}
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ duration: 0.5, delay: 0.8 }} 
          className="flex flex-wrap justify-center items-center gap-4 md:gap-8 mt-8 md:mt-12 text-primary-foreground/70"
        >
          <div className="flex items-center gap-2">
            <span className="text-2xl md:text-3xl font-black text-accent">50+</span>
            <span className="text-xs md:text-sm">{t('hero.partnersCount').split(' ').slice(0, 1).join(' ')}<br />{t('hero.partnersCount').split(' ').slice(1).join(' ')}</span>
          </div>
          <div className="w-px h-8 bg-primary-foreground/20 hidden md:block" />
          <div className="flex items-center gap-2">
            <span className="text-2xl md:text-3xl font-black text-accent">2min</span>
            <span className="text-xs md:text-sm">{t('hero.compareTime').split(' ').slice(0, 1).join(' ')}<br />{t('hero.compareTime').split(' ').slice(1).join(' ')}</span>
          </div>
          <div className="w-px h-8 bg-primary-foreground/20 hidden md:block" />
          <div className="flex items-center gap-2">
            <span className="text-2xl md:text-3xl font-black text-accent">100%</span>
            <span className="text-xs md:text-sm">{t('hero.freeLabel').split(' & ').slice(0, 1).join(' ')}<br />{t('hero.freeLabel').includes('&') ? t('hero.freeLabel').split(' & ').slice(1).join(' ') : ''}</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
