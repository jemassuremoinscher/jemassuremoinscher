import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useLanguage } from "@/contexts/LanguageContext";

import abeilleLogo from "@/assets/logos/abeille.webp";
import acheelLogo from "@/assets/logos/acheel.webp";
import agfLogo from "@/assets/logos/agf.webp";
import alanLogo from "@/assets/logos/alan-new.webp";
import allianzLogo from "@/assets/logos/allianz.webp";
import amaguizLogo from "@/assets/logos/amaguiz.png";
import aonLogo from "@/assets/logos/aon.webp";
import aprilLogo from "@/assets/logos/april-new.png";
import axaLogo from "@/assets/logos/axa.webp";
import directAssuranceLogo from "@/assets/logos/direct-assurance-new.webp";
import ganLogo from "@/assets/logos/gan.svg";
import generaliLogo from "@/assets/logos/generali-new.png";
import gmfLogo from "@/assets/logos/gmf-new.png";
import leocareLogo from "@/assets/logos/leocare.png";
import lolivierLogo from "@/assets/logos/lolivier.webp";
import maafLogo from "@/assets/logos/maaf.webp";
import macifLogo from "@/assets/logos/macif-new.png";
import maifLogo from "@/assets/logos/maif.webp";
import matmutLogo from "@/assets/logos/matmut-new.jpg";
import maxanceLogo from "@/assets/logos/maxance.png";
import milaLogo from "@/assets/logos/mila.jpg";
import mmaLogo from "@/assets/logos/mma-new.webp";
import mpaLogo from "@/assets/logos/mpa.webp";
import neoLogo from "@/assets/logos/neo.png";
import ornikarLogo from "@/assets/logos/ornikar.png";
import swissLifeLogo from "@/assets/logos/swisslife.webp";
import wilovLogo from "@/assets/logos/wilov.webp";

const partners = [
  { name: "Abeille Assurances", logo: abeilleLogo },
  { name: "Acheel", logo: acheelLogo },
  { name: "AGF", logo: agfLogo },
  { name: "Alan", logo: alanLogo },
  { name: "Allianz", logo: allianzLogo },
  { name: "Amaguiz", logo: amaguizLogo },
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
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.05),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(var(--accent)/0.05),transparent_50%)]" />
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
              <CarouselItem key={index} className="pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6">
                <div className="flex items-center justify-center p-4 bg-card rounded-xl border-2 border-border hover:border-primary/30 hover-lift transition-all duration-300 group h-24 w-full cursor-pointer" onClick={() => trackEvent('partner_click', { category: 'engagement', partner_name: partner.name, label: 'partner_logo' })}>
                  <img src={partner.logo} alt={`Logo ${partner.name}`} className="max-h-14 max-w-[90%] object-contain" width={120} height={56} loading="lazy" decoding="async" />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        <div className="mt-8 text-center"><p className="text-sm text-muted-foreground">{t('partnersComponent.autoScroll')}</p></div>
      </div>
    </section>
  );
};

export default Partners;
