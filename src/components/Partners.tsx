import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import axaLogo from "@/assets/logos/axa.png";
import allianzLogo from "@/assets/logos/allianz.png";
import groupamaLogo from "@/assets/logos/groupama.png";
import maifLogo from "@/assets/logos/maif.png";
import macifLogo from "@/assets/logos/macif.png";
import generaliLogo from "@/assets/logos/generali.png";
import mmaLogo from "@/assets/logos/mma.png";
import matmutLogo from "@/assets/logos/matmut.png";
import gmfLogo from "@/assets/logos/gmf.png";
import directAssuranceLogo from "@/assets/logos/direct-assurance.png";
import amaguizLogo from "@/assets/logos/amaguiz.png";
import aprilLogo from "@/assets/logos/april.png";
import lukoLogo from "@/assets/logos/luko.png";
import harmonieMutuelleLogo from "@/assets/logos/harmonie-mutuelle.png";
import mgenLogo from "@/assets/logos/mgen.png";
import ag2rLogo from "@/assets/logos/ag2r.png";
import assurpeopleLogo from "@/assets/logos/assurpeople.png";
import lclLogo from "@/assets/logos/lcl.png";
import swissLifeLogo from "@/assets/logos/swiss-life.png";
import mutuelleGeneraleLogo from "@/assets/logos/mutuelle-generale.png";
import cardifLogo from "@/assets/logos/cardif.png";
import metlifeLogo from "@/assets/logos/metlife.png";
import alanLogo from "@/assets/logos/alan.png";
import malakoffHumanisLogo from "@/assets/logos/malakoff-humanis.png";

const partners = [
  { name: "AXA", logo: axaLogo },
  { name: "Allianz", logo: allianzLogo },
  { name: "Groupama", logo: groupamaLogo },
  { name: "MAIF", logo: maifLogo },
  { name: "MACIF", logo: macifLogo },
  { name: "Generali", logo: generaliLogo },
  { name: "MMA", logo: mmaLogo },
  { name: "Matmut", logo: matmutLogo },
  { name: "GMF", logo: gmfLogo },
  { name: "Direct Assurance", logo: directAssuranceLogo },
  { name: "Amaguiz", logo: amaguizLogo },
  { name: "April", logo: aprilLogo },
  { name: "Luko", logo: lukoLogo },
  { name: "Harmonie Mutuelle", logo: harmonieMutuelleLogo },
  { name: "MGEN", logo: mgenLogo },
  { name: "AG2R La Mondiale", logo: ag2rLogo },
  { name: "Assurpeople", logo: assurpeopleLogo },
  { name: "LCL", logo: lclLogo },
  { name: "Swiss Life", logo: swissLifeLogo },
  { name: "Mutuelle Générale", logo: mutuelleGeneraleLogo },
  { name: "Cardif", logo: cardifLogo },
  { name: "MetLife", logo: metlifeLogo },
  { name: "Alan", logo: alanLogo },
  { name: "Malakoff Humanis", logo: malakoffHumanisLogo },
];

const Partners = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/20 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.05),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(var(--accent)/0.05),transparent_50%)]" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 animate-fade-in">
          <p className="text-accent font-semibold text-sm uppercase tracking-wide mb-3">Nos partenaires</p>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            Plus de <span className="text-primary">120 assureurs</span> comparés
          </h2>
          <p className="text-muted-foreground text-lg">
            Et près de <span className="font-semibold text-foreground">8000 agences locales</span>
          </p>
          <div className="w-24 h-1 bg-accent mx-auto rounded-full mt-4" />
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          plugins={[
            Autoplay({
              delay: 2000,
              stopOnInteraction: false,
            }),
          ]}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {partners.map((partner, index) => (
              <CarouselItem 
                key={index} 
                className="pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6"
              >
                <div className="flex items-center justify-center p-6 bg-card rounded-xl border-2 border-border hover:border-primary/30 hover-lift transition-all duration-300 group h-24">
                  {partner.logo ? (
                    <img 
                      src={partner.logo} 
                      alt={`Logo ${partner.name}`}
                      className="max-h-16 max-w-full object-contain"
                    />
                  ) : (
                    <span className="font-bold text-primary text-base text-center group-hover:text-accent transition-colors">
                      {partner.name}
                    </span>
                  )}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Le carrousel défile automatiquement. Passez la souris dessus pour mettre en pause.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Partners;
