import { useLanguage } from "@/contexts/LanguageContext";
import arthurStanding from "@/assets/mascotte/arthur-standing.webp";

// Scroll+focus vers le formulaire de devis du Hero — même comportement que le
// CTA "Arthur" de TrustRow.tsx (seul CTA de ce type existant sur le site).
const scrollToQuoteForm = () => {
  const target = document.getElementById('hero-quote-form') || document.getElementById('quote-form');
  if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    const firstInput = target.querySelector<HTMLElement>('input, select, textarea, button');
    firstInput?.focus({ preventScroll: true });
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

const CompareCTASection = () => {
  const { t } = useLanguage();

  return (
    <section
      className="relative bg-primary/10 pt-16 pb-32 md:pt-20 md:pb-40 text-center"
      aria-label="Comparer votre assurance"
    >
      <div className="container mx-auto px-4 max-w-2xl relative z-10">
        <h2 className="text-2xl md:text-4xl font-extrabold text-foreground mb-3">
          Toujours pas comparé votre assurance ?
        </h2>
        <p className="text-base md:text-lg text-muted-foreground mb-8">
          Arthur compare 70+ assureurs pour vous, en 2 minutes.
        </p>
        <button
          type="button"
          onClick={scrollToQuoteForm}
          className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-4 text-base font-bold text-primary-foreground shadow-lg hover:opacity-90 transition-opacity"
        >
          {t('nav.compareNow')}
        </button>
      </div>

      <div
        className="absolute left-1/2 -translate-x-1/2 -bottom-10 md:-bottom-14 z-10 pointer-events-none"
        aria-hidden="true"
      >
        <img
          src={arthurStanding}
          alt=""
          className="w-48 md:w-64 h-auto drop-shadow-2xl"
          width={240}
          height={259}
          loading="lazy"
          decoding="async"
        />
      </div>
    </section>
  );
};

export default CompareCTASection;
