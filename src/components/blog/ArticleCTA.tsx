import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface ArticleCTAProps {
  title?: string;
  description?: string;
  buttonText?: string;
  href?: string;
  variant?: "primary" | "subtle";
}

/**
 * Contextual CTA component for mid-article or end-of-article conversion.
 */
const ArticleCTA = ({
  title = "Vérifiez si vous payez trop cher",
  description = "Comparez gratuitement les offres de 50+ assureurs et découvrez combien vous pourriez économiser.",
  buttonText = "Comparer gratuitement en 2 minutes",
  href = "/comparateur",
  variant = "primary",
}: ArticleCTAProps) => {
  const navigate = useNavigate();

  if (variant === "subtle") {
    return (
      <div className="bg-muted/50 border border-border/50 rounded-2xl p-6 md:p-8 my-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-1">
            <h4 className="text-lg font-bold text-foreground mb-1">{title}</h4>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          <Button
            onClick={() => navigate(href)}
            className="rounded-full shrink-0 gap-2"
            aria-label={buttonText}
          >
            {buttonText}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-6 md:p-8 my-8 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,hsl(var(--secondary)/0.15),transparent_60%)]" />
      <div className="relative z-10 text-center md:text-left md:flex md:items-center md:justify-between gap-6">
        <div className="flex-1 mb-4 md:mb-0">
          <h4 className="text-xl md:text-2xl font-bold text-white mb-2">{title}</h4>
          <p className="text-white/80 text-sm md:text-base">{description}</p>
        </div>
        <Button
          size="lg"
          onClick={() => navigate(href)}
          className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold rounded-full shrink-0 gap-2"
          aria-label={buttonText}
        >
          {buttonText}
          <ArrowRight className="h-5 w-5" aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
};

export default ArticleCTA;
