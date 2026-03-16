import { memo, useMemo } from "react";
import { Building2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const partners = [
  { id: 1, name: "Allianz" },
  { id: 2, name: "AXA" },
  { id: 3, name: "MAIF" },
  { id: 4, name: "MAAF" },
  { id: 5, name: "Groupama" },
  { id: 6, name: "Generali" },
  { id: 7, name: "GMF" },
  { id: 8, name: "Direct Assurance" },
  { id: 9, name: "SwissLife" },
  { id: 10, name: "MMA" },
  { id: 11, name: "Abeille" },
  { id: 12, name: "Alan" },
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
              <Building2 className="w-4 h-4 text-primary" aria-hidden="true" />
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