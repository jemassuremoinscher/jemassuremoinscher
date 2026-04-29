import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useLanguage } from "@/contexts/LanguageContext";

import abeilleLogo from "@/assets/logos/abeille.webp";
import acheelLogo from "@/assets/logos/acheel.webp";
import agfLogo from "@/assets/logos/agf.webp";
import alanLogo from "@/assets/logos/alan-new.webp";
import allianzLogo from "@/assets/logos/allianz.webp";
import amaguizLogo from "@/assets/logos/amaguiz.webp";
import amvLogo from "@/assets/logos/amv.webp";
import aonLogo from "@/assets/logos/aon.webp";
import aprilLogo from "@/assets/logos/april-new.webp";
import axaLogo from "@/assets/logos/axa.webp";
import directAssuranceLogo from "@/assets/logos/direct-assurance-new.webp";
import ganLogo from "@/assets/logos/gan.svg";
import generaliLogo from "@/assets/logos/generali-new.webp";
import gmfLogo from "@/assets/logos/gmf-new.webp";
import leocareLogo from "@/assets/logos/leocare.webp";
import lolivierLogo from "@/assets/logos/lolivier.webp";
import maafLogo from "@/assets/logos/maaf.webp";
import macifLogo from "@/assets/logos/macif-new.webp";
import maifLogo from "@/assets/logos/maif.webp";
import matmutLogo from "@/assets/logos/matmut-new.webp";
import maxanceLogo from "@/assets/logos/maxance.webp";
import milaLogo from "@/assets/logos/mila.webp";
import mmaLogo from "@/assets/logos/mma-new.webp";
import mpaLogo from "@/assets/logos/mpa.webp";
import neoLogo from "@/assets/logos/neo.webp";
import ornikarLogo from "@/assets/logos/ornikar.webp";
import swissLifeLogo from "@/assets/logos/swisslife.webp";
import wilovLogo from "@/assets/logos/wilov.webp";

// Per-logo scale adjustments for readability (within the fixed block)
const logoScaleMap: Record<string, string> = {
  "Direct Assurance": "scale-110",
  "L'Olivier Assurance": "scale-110",
  "Mutuelle de Poitiers": "scale-110",
  "Matmut": "scale-110",
  "Amaguiz": "scale-105",
};

const partners = [
  { name: "Abeille Assurances", logo: abeilleLogo },
  { name: "Acheel", logo: acheelLogo },
  { name: "AGF", logo: agfLogo },
  { name: "Alan", logo: alanLogo },
  { name: "Allianz", logo: allianzLogo },
  { name: "Amaguiz", logo: amaguizLogo },
  { name: "AMV", logo: amvLogo },
  { name: "AON", logo: aonLogo },
  { name: "April", logo: aprilLogo },
  { name: "AXA", logo: axaLogo },
  { name: "Direct Assurance", logo: directAssuranceLogo },
  { name: "GAN", logo: ganLogo },
  { name: "Generali", logo: generaliLogo },
  { name: "GMF", logo: gmfLogo },
  { name: "Leocare", logo: leocareLogo },
  { name: "L'Olivier Assurance", logo: lolivierLogo },
  { name: "MAAF", logo: maafLogo },
  { name: "MACIF", logo: macifLogo },
  { name: "MAIF", logo: maifLogo },
  { name: "Matmut", logo: matmutLogo },
  { name: "Maxance", logo: maxanceLogo },
  { name: "Mila", logo: milaLogo },
  { name: "MMA", logo: mmaLogo },
  { name: "Mutuelle de Poitiers", logo: mpaLogo },
  { name: "Neo Assurances", logo: neoLogo },
  { name: "Ornikar", logo: ornikarLogo },
  { name: "SwissLife", logo: swissLifeLogo },
  { name: "Wilov", logo: wilovLogo },
];

const Partners = () => {
  const { t } = useLanguage();
  const { trackEvent } = useAnalytics();

  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/20 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.05),transparent_50%),radial-gradient(circle_at_70%_80%,hsl(var(--accent)/0.05),transparent_50%)]" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 animate-fade-in">
          <p className="text-accent font-semibold text-sm uppercase tracking-wide mb-3">{t('partnersComponent.badge')}</p>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            {t('partnersComponent.title')} <span className="text-primary">{t('partnersComponent.titleHighlight')}</span> {t('partnersComponent.titleEnd')}
          </h2>
          <p className="text-muted-foreground text-lg">{t('partnersComponent.subtitle')} <span className="font-semibold text-foreground">{t('partnersComponent.agencies')}</span></p>
          <div className="w-24 h-1 bg-accent mx-auto rounded-full mt-4" />
        </div>
        <Carousel opts={{ align: "start", loop: true }} plugins={[Autoplay({ delay: 2000, stopOnInteraction: false })]} className="w-full">
          <CarouselContent className="-ml-4">
            {partners.map((partner, index) => (
              <CarouselItem key={index} className="pl-4 basis-1/3 sm:basis-1/4 md:basis-1/5 lg:basis-1/6 xl:basis-[12.5%]">
                <button type="button" className="flex items-center justify-center p-3 bg-card rounded-xl border-2 border-border hover:border-primary/30 hover-lift transition-all duration-300 group h-20 w-full cursor-pointer" onClick={() => trackEvent('partner_click', { category: 'engagement', partner_name: partner.name, label: 'partner_logo' })} aria-label={`Voir le partenaire ${partner.name}`}>
                  <img src={partner.logo} alt={`Logo ${partner.name}`} className={`h-10 max-w-[80px] w-auto object-contain transition-transform ${logoScaleMap[partner.name] || ''}`} width={100} height={40} loading="lazy" decoding="async" />
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
