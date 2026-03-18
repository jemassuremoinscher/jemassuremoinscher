import { Link } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import arthurPointing from "@/assets/mascotte/arthur-pointing.png";

// ─── Config per category ────────────────────────────────────────────────────
interface WidgetConfig {
  title: string;
  subtitle: string;
  buttonText: string;
  deepLink: string;
  miniQuestion?: {
    label: string;
    options: { value: string; label: string }[];
    paramKey: string;
  };
  accentColor: string; // Tailwind bg class
}

const widgetConfigs: Record<string, WidgetConfig> = {
  malusse: {
    title: "Calculer ma surprime Malus",
    subtitle: "Vous avez un malus ? Découvrez en 30 secondes combien vous pouvez économiser.",
    buttonText: "Voir mon tarif malussé →",
    deepLink: "/comparateur?step=1&profile=malusse",
    miniQuestion: {
      label: "Votre coefficient actuel :",
      options: [
        { value: "1.25", label: "1.25" },
        { value: "1.50", label: "1.50" },
        { value: "2.00", label: "2.00+" },
      ],
      paramKey: "coef",
    },
    accentColor: "bg-destructive/10 border-destructive/30",
  },
  "jeune-conducteur": {
    title: "Économiser sur l'assurance permis probatoire",
    subtitle: "Jeune conducteur ? On compare 50+ assureurs pour vous trouver le meilleur prix.",
    buttonText: "Comparer les prix jeune conducteur →",
    deepLink: "/comparateur?step=1&profile=jeune-conducteur",
    miniQuestion: {
      label: "Depuis quand avez-vous le permis ?",
      options: [
        { value: "moins-1an", label: "< 1 an" },
        { value: "1-2ans", label: "1-2 ans" },
        { value: "2-3ans", label: "2-3 ans" },
      ],
      paramKey: "experience",
    },
    accentColor: "bg-primary/5 border-primary/30",
  },
  auto: {
    title: "Payez-vous trop cher votre assurance auto ?",
    subtitle: "Comparez en 2 min et économisez jusqu'à 40% sur votre contrat.",
    buttonText: "Comparer les prix auto →",
    deepLink: "/comparateur?step=1&profile=auto",
    accentColor: "bg-primary/5 border-primary/30",
  },
  sante: {
    title: "Votre mutuelle est-elle trop chère ?",
    subtitle: "Trouvez une mutuelle moins chère avec les mêmes garanties.",
    buttonText: "Comparer les mutuelles →",
    deepLink: "/comparateur?step=1&profile=sante",
    accentColor: "bg-primary/5 border-primary/30",
  },
  habitation: {
    title: "Assurance habitation : comparez les prix",
    subtitle: "Des assurances habitation à partir de 5€/mois. Comparez gratuitement.",
    buttonText: "Voir les tarifs habitation →",
    deepLink: "/comparateur?step=1&profile=habitation",
    accentColor: "bg-primary/5 border-primary/30",
  },
};

// Default fallback
const defaultConfig: WidgetConfig = {
  title: "Comparez et économisez sur votre assurance",
  subtitle: "50+ assureurs comparés gratuitement. Trouvez le meilleur prix en 2 minutes.",
  buttonText: "Comparer maintenant →",
  deepLink: "/comparateur",
  accentColor: "bg-accent/10 border-accent/30",
};

// ─── Category detection from blog article data ──────────────────────────────
export function detectCategory(articleCategory: string, tags: string[]): string {
  const allText = `${articleCategory} ${tags.join(" ")}`.toLowerCase();

  if (allText.includes("malus") || allText.includes("malusse") || allText.includes("surprime"))
    return "malusse";
  if (allText.includes("jeune conducteur") || allText.includes("permis probatoire") || allText.includes("nouveau permis"))
    return "jeune-conducteur";
  if (allText.includes("auto") || allText.includes("voiture"))
    return "auto";
  if (allText.includes("santé") || allText.includes("mutuelle"))
    return "sante";
  if (allText.includes("habitation") || allText.includes("logement"))
    return "habitation";

  return "default";
}

// ─── Component ──────────────────────────────────────────────────────────────
interface SmartConversionWidgetProps {
  category: string;
  variant?: "banner" | "compact";
}

const SmartConversionWidget = ({ category, variant = "banner" }: SmartConversionWidgetProps) => {
  const config = widgetConfigs[category] || defaultConfig;
  const [selectedOption, setSelectedOption] = useState<string>("");

  const finalLink = selectedOption && config.miniQuestion
    ? `${config.deepLink}&${config.miniQuestion.paramKey}=${selectedOption}`
    : config.deepLink;

  return (
    <div
      className={`
        relative overflow-hidden rounded-2xl border-2 ${config.accentColor}
        p-5 md:p-6 my-8
        transition-all duration-300
      `}
      role="complementary"
      aria-label={config.title}
    >
      <div className="flex items-start gap-4">
        {/* Arthur mascot */}
        <img
          src={arthurPointing}
          alt="Arthur vous conseille"
          className="hidden sm:block w-16 h-auto flex-shrink-0 -mt-1"
          width={64}
          height={80}
          loading="lazy"
        />

        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-foreground mb-1 leading-tight">
            {config.title}
          </h3>
          <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
            {config.subtitle}
          </p>

          {/* Mini question (if applicable) */}
          {config.miniQuestion && (
            <div className="mb-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                {config.miniQuestion.label}
              </p>
              <div className="flex flex-wrap gap-2">
                {config.miniQuestion.options.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setSelectedOption(opt.value)}
                    className={`
                      px-4 py-2 rounded-full text-sm font-semibold border-2 transition-all duration-200
                      ${selectedOption === opt.value
                        ? "border-primary bg-primary text-primary-foreground shadow-sm"
                        : "border-border/50 bg-background/80 text-foreground hover:border-primary/40"
                      }
                    `}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* CTA with pulse */}
          <Button
            asChild
            size="lg"
            className="rounded-full font-bold text-sm md:text-base h-11 px-6 animate-[pulse_2.5s_cubic-bezier(0.4,0,0.6,1)_infinite] hover:animate-none transition-all"
          >
            <Link to={finalLink}>
              {config.buttonText}
            </Link>
          </Button>
        </div>
      </div>

      {/* Subtle decorative gradient */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-2xl pointer-events-none" aria-hidden="true" />
    </div>
  );
};

export default SmartConversionWidget;
