import { type ReactNode } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import RelatedInsuranceLinks from "@/components/insurance/RelatedInsuranceLinks";

interface InsuranceBottomHubProps {
  currentPage: string;
  /** EnBref component to render at bottom for GEO */
  enBref?: ReactNode;
  /** CTA section */
  ctaTitle: string;
  ctaDescription: string;
  ctaButtonLabel: string;
  ctaMascotSrc: string;
  ctaMascotAlt: string;
  onCtaClick: () => void;
  /** Optional ExpertiseSection to show above links */
  expertiseSection?: ReactNode;
}

/**
 * Unified bottom section for insurance pages.
 * Combines: ExpertiseSection (compact) + RelatedInsuranceLinks + EnBref (GEO) + CTA final
 */
const InsuranceBottomHub = ({
  currentPage,
  enBref,
  ctaTitle,
  ctaDescription,
  ctaButtonLabel,
  ctaMascotSrc,
  ctaMascotAlt,
  onCtaClick,
  expertiseSection,
}: InsuranceBottomHubProps) => {
  return (
    <div className="max-w-5xl mx-auto">
      {/* Expertise (E-E-A-T) — compact */}
      {expertiseSection}

      {/* Internal links hub */}
      <RelatedInsuranceLinks currentPage={currentPage} />

      {/* EnBref — GEO summary at bottom */}
      {enBref && (
        <div className="mb-10">
          {enBref}
        </div>
      )}

      <p className="-mt-4 mb-10 text-center text-xs text-muted-foreground">
        Calculé selon notre{" "}
        <Link to="/sources-et-methodologie" className="font-medium text-primary hover:underline underline-offset-4">
          méthodologie
        </Link>
        .
      </p>

      {/* CTA final */}
      <section className="max-w-2xl mx-auto text-center mb-16">
        <div className="p-6 md:p-8 rounded-2xl bg-primary/5 border border-primary/20 relative overflow-visible">
          <img
            src={ctaMascotSrc}
            alt={ctaMascotAlt}
            className="absolute -right-4 -top-8 w-16 h-auto hidden sm:block"
            width={64}
            height={80}
            loading="lazy"
            decoding="async"
          />
          <h2 className="text-xl md:text-2xl font-bold mb-3">{ctaTitle}</h2>
          <p className="text-muted-foreground text-sm mb-5">{ctaDescription}</p>
          <Button
            size="lg"
            onClick={onCtaClick}
            className="w-full max-w-md text-base md:text-lg py-5"
            aria-label={ctaButtonLabel}
          >
            {ctaButtonLabel}
          </Button>
        </div>
      </section>
    </div>
  );
};

export default InsuranceBottomHub;
