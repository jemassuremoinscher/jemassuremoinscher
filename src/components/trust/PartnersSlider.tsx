import { memo, useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import logoAbeille from "@/assets/logos/abeille.webp";
import logoAlan from "@/assets/logos/alan-new.webp";
import logoAllianz from "@/assets/logos/allianz.webp";
import logoAmv from "@/assets/logos/amv.webp";
import logoAxa from "@/assets/logos/axa.webp";
import logoDirectAssurance from "@/assets/logos/direct-assurance-new.webp";
import logoGenerali from "@/assets/logos/generali-new.webp";
import logoGmf from "@/assets/logos/gmf-new.webp";
import logoGroupama from "@/assets/logos/groupama.png";
import logoMaaf from "@/assets/logos/maaf.webp";
import logoMaif from "@/assets/logos/maif.webp";
import logoMma from "@/assets/logos/mma-new.webp";
import logoSwissLife from "@/assets/logos/swisslife.webp";

const partners = [
  { id: 1, name: "Abeille", logo: logoAbeille },
  { id: 2, name: "Alan", logo: logoAlan },
  { id: 3, name: "Allianz", logo: logoAllianz },
  { id: 4, name: "AMV", logo: logoAmv },
  { id: 5, name: "AXA", logo: logoAxa },
  { id: 6, name: "Direct Assurance", logo: logoDirectAssurance },
  { id: 7, name: "Generali", logo: logoGenerali },
  { id: 8, name: "GMF", logo: logoGmf },
  { id: 9, name: "Groupama", logo: logoGroupama },
  { id: 10, name: "MAAF", logo: logoMaaf },
  { id: 11, name: "MAIF", logo: logoMaif },
  { id: 12, name: "MMA", logo: logoMma },
  { id: 13, name: "Swiss Life", logo: logoSwissLife },
] as const;

const PartnersSlider = memo(() => {
  const { t } = useLanguage();
  const duplicatedPartners = useMemo(() => [...partners, ...partners], []);

  return (
    <section className="py-8 md:py-12 bg-muted/50 overflow-hidden">
      <div className="container mx-auto px-4 mb-6">
        <h2 className="text-center text-primary font-bold md:text-4xl text-2xl">
          {t("partners.title")}
        </h2>
      </div>

      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-r from-muted/50 to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-l from-muted/50 to-transparent z-10" />

        <div className="flex gap-4 md:gap-5 partners-scroll" style={{ width: "max-content" }}>
          {duplicatedPartners.map((partner, index) => (
            <div
              key={`${partner.id}-${index}`}
              className="flex-shrink-0 flex items-center gap-2 h-12 md:h-14 rounded-full bg-card border border-border/60 px-4 md:px-5"
              aria-label={`${partner.name} - assureur partenaire assurance moins chère`}
            >
              <img src={partner.logo} alt="" className="h-6 w-14 object-contain" width={56} height={24} loading="lazy" decoding="async" aria-hidden="true" />
              <span className="text-sm md:text-base font-semibold text-foreground whitespace-nowrap">
                {partner.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

PartnersSlider.displayName = "PartnersSlider";

export default PartnersSlider;