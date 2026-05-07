import { lazy, Suspense } from "react";
import { Star, ShieldCheck, Lock, Sparkles } from "lucide-react";

const MultiStepQuoteForm = lazy(() =>
  import("@/components/forms/MultiStepQuoteForm").then((m) => ({ default: m.MultiStepQuoteForm }))
);

const arthurMascot = "/arthur-wink-thumbsup.webp";

const Hero = () => {
  return (
    <section
      className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-primary/90 py-10 md:py-14"
      aria-label="Section principale - Comparateur d'assurances"
    >
      {/* MD3 tonal background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" aria-hidden="true">
        <div className="absolute top-20 left-10 w-32 h-32 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-32 right-10 w-48 h-48 bg-accent rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10 max-w-6xl">
        {/* H1 — 3 lignes garanties */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-[3.5rem] font-black text-white text-center mb-10 md:mb-14 leading-tight font-[Inter] animate-fade-in-up">
          Comparez votre assurance,
          <br />
          payez moins cher,
          <br />
          <span className="relative inline-block">
            <span className="relative z-10" style={{ color: "#f5b80a" }}>sans compromis.</span>
            <svg
              aria-hidden="true"
              viewBox="0 0 200 14"
              preserveAspectRatio="none"
              className="absolute left-0 right-0 -bottom-1 md:-bottom-2 w-full h-3 md:h-4"
            >
              <path
                d="M3 8 L 197 6"
                stroke="#f5b80a"
                strokeWidth="9"
                strokeLinecap="round"
                fill="none"
                opacity="0.9"
              />
            </svg>
          </span>
        </h1>

        {/* Layout 2 col : form (gauche) + Arthur (centré dans sa colonne) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 items-start">
          {/* GAUCHE — Bulles flottantes EEAT + formulaire complet */}
          <div className="relative w-full animate-fade-in-up-delay">
            {/* Bulles flottantes au-dessus du formulaire */}
            <div className="hidden sm:flex absolute -top-6 left-2 right-2 z-20 justify-between gap-2 pointer-events-none">
              <FloatingBadge
                icon={<Star className="h-3.5 w-3.5 fill-[#f5b80a] text-[#f5b80a]" />}
                label="4,9/5 Google"
                delay="0s"
              />
              <FloatingBadge
                icon={<ShieldCheck className="h-3.5 w-3.5 text-primary" />}
                label="Orias certifié"
                delay="0.15s"
              />
              <FloatingBadge
                icon={<Sparkles className="h-3.5 w-3.5 text-[#f5b80a]" />}
                label="-40% en moyenne"
                delay="0.3s"
              />
            </div>

            {/* Mobile : badges en ligne au-dessus */}
            <div className="flex sm:hidden flex-wrap justify-center gap-1.5 mb-3">
              <MobileChip icon={<Star className="h-3 w-3 fill-[#f5b80a] text-[#f5b80a]" />} label="4,9/5" />
              <MobileChip icon={<ShieldCheck className="h-3 w-3 text-primary" />} label="Orias" />
              <MobileChip icon={<Sparkles className="h-3 w-3 text-[#f5b80a]" />} label="-40%" />
              <MobileChip icon={<Lock className="h-3 w-3 text-primary" />} label="Sécurisé" />
            </div>

            <Suspense
              fallback={
                <div
                  aria-hidden="true"
                  className="min-h-[520px] rounded-[2rem] bg-card/80 backdrop-blur-xl border border-border/50"
                />
              }
            >
              <MultiStepQuoteForm insuranceType="comparateur" className="!max-w-none" />
            </Suspense>
          </div>

          {/* DROITE — Arthur centré dans la colonne */}
          <div className="hidden md:flex justify-center items-center animate-fade-in pt-6">
            <div className="relative inline-block">
              <img
                src={arthurMascot}
                alt="Arthur mascotte jemassuremoinscher.fr"
                className="w-56 lg:w-72 h-auto drop-shadow-2xl animate-hero-float"
                width={288}
                height={360}
                loading="eager"
                decoding="async"
                fetchPriority="high"
              />
              <div className="absolute -top-2 -right-2 lg:-top-4 lg:-right-4 bg-white rounded-2xl px-4 py-2 shadow-[0_8px_24px_-8px_rgba(0,0,0,0.25)] animate-fade-in-delay">
                <p className="text-primary font-bold text-sm whitespace-nowrap">
                  Hello, moi c'est Arthur 👋
                </p>
                <div className="absolute -bottom-1.5 left-4 w-3 h-3 bg-white transform rotate-45" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

/* —— sous-composants —— */

const FloatingBadge = ({
  icon,
  label,
  delay,
}: {
  icon: React.ReactNode;
  label: string;
  delay: string;
}) => (
  <div
    className="pointer-events-auto bg-white/95 backdrop-blur-md rounded-full pl-2 pr-3 py-1.5 shadow-[0_8px_20px_-6px_rgba(0,0,0,0.25)] border border-white/60 flex items-center gap-1.5 animate-fade-in-up"
    style={{ animationDelay: delay }}
  >
    <span className="flex items-center justify-center h-5 w-5 rounded-full bg-primary/5">{icon}</span>
    <span className="text-[11px] md:text-xs font-bold text-foreground whitespace-nowrap">{label}</span>
  </div>
);

const MobileChip = ({ icon, label }: { icon: React.ReactNode; label: string }) => (
  <span className="inline-flex items-center gap-1 bg-white/95 rounded-full px-2 py-1 text-[10px] font-bold text-foreground shadow">
    {icon}
    {label}
  </span>
);

export default Hero;
