import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useLanguage } from "@/contexts/LanguageContext";
import { partners } from "@/data/partners";

// Per-logo scale adjustments for readability (within the fixed block)
const logoScaleMap: Record<string, string> = {
  "Direct Assurance": "scale-110",
  "L'Olivier Assurance": "scale-110",
  "Mutuelle de Poitiers": "scale-110",
  "Matmut": "scale-110",
  "Amaguiz": "scale-105",
};

const Partners = () => {
  const { t } = useLanguage();
  const { trackEvent } = useAnalytics();

  return (
    <section className="py-10 md:py-12 bg-gradient-to-b from-background to-muted/20 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.05),transparent_50%),radial-gradient(circle_at_70%_80%,hsl(var(--accent)/0.05),transparent_50%)]" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-8 md:mb-10 animate-fade-in">
          <p className="text-accent font-semibold text-sm uppercase tracking-wide mb-3">{t('partnersComponent.badge')}</p>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
            {t('partnersComponent.title')} <span className="text-primary">{t('partnersComponent.titleHighlight')}</span> {t('partnersComponent.titleEnd')}
          </h2>
          <div className="w-24 h-1 bg-accent mx-auto rounded-full mt-4" />
        </div>
        <Carousel opts={{ align: "start", loop: true }} plugins={[Autoplay({ delay: 2000, stopOnInteraction: false })]} className="w-full">
          <CarouselContent className="-ml-4">
            {partners.map((partner, index) => (
              <CarouselItem key={index} className="pl-4 basis-1/3 sm:basis-1/4 md:basis-1/5 lg:basis-1/6 xl:basis-[12.5%]">
                <button type="button" className="flex flex-col items-center justify-center gap-0.5 p-3 bg-card rounded-xl border-2 border-border hover:border-primary/30 hover-lift transition-all duration-300 group h-20 w-full cursor-pointer" onClick={() => trackEvent('partner_click', { category: 'engagement', partner_name: partner.name, label: 'partner_logo' })} aria-label={partner.publicRestreint ? `Voir le partenaire ${partner.name} (réservé : ${partner.publicRestreint})` : `Voir le partenaire ${partner.name}`}>
                  {partner.logo && partner.autorisationLogo ? (
                    <img src={partner.logo} alt={`Logo ${partner.name}`} className={`h-10 max-w-[80px] w-auto object-contain transition-transform ${logoScaleMap[partner.name] || ''}`} width={100} height={40} loading="lazy" decoding="async" />
                  ) : (
                    <span className="text-xs font-semibold text-foreground text-center leading-tight px-1">{partner.name}</span>
                  )}
                  {partner.publicRestreint && (
                    <span className="text-[10px] text-muted-foreground text-center leading-tight px-1">Réservé : {partner.publicRestreint}</span>
                  )}
                </button>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        
      </div>
    </section>
  );
};

export default Partners;
