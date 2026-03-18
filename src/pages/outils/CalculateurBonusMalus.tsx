import { useState, useMemo, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import arthurCoin from "@/assets/mascotte/arthur-sprint-coin.webp";

const MIN_COEF = 0.50;
const MAX_COEF = 3.50;
const REDUCTION_RATE = 0.05;

function computeNewCoefficient(current: number, years: number): number {
  let coef = current;
  for (let i = 0; i < years; i++) {
    coef = Math.max(MIN_COEF, coef * (1 - REDUCTION_RATE));
  }
  return Math.round(coef * 100) / 100;
}

function getGaugeColor(coef: number): string {
  if (coef <= 0.60) return "hsl(142 76% 36%)";
  if (coef <= 0.80) return "hsl(142 60% 45%)";
  if (coef <= 1.00) return "hsl(45 100% 55%)";
  if (coef <= 1.50) return "hsl(25 95% 53%)";
  return "hsl(0 84% 60%)";
}

function getGaugePercent(coef: number): number {
  return Math.max(0, Math.min(100, ((MAX_COEF - coef) / (MAX_COEF - MIN_COEF)) * 100));
}

function getLabel(coef: number): string {
  if (coef <= 0.60) return "Excellent bonus";
  if (coef <= 0.80) return "Très bon bonus";
  if (coef <= 1.00) return "Bon bonus";
  if (coef <= 1.25) return "Coefficient neutre";
  return "Malus";
}

function getEmoji(coef: number): string {
  if (coef <= 0.60) return "🏆";
  if (coef <= 0.80) return "🎉";
  if (coef <= 1.00) return "👍";
  if (coef <= 1.25) return "😐";
  return "⚠️";
}

// Animated counter hook
function useAnimatedValue(target: number, duration = 600): number {
  const [display, setDisplay] = useState(target);
  const frameRef = useRef<number>();
  const startRef = useRef({ value: target, time: 0 });

  useEffect(() => {
    const start = startRef.current.value;
    const startTime = performance.now();
    startRef.current = { value: target, time: startTime };

    function animate(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const current = start + (target - start) * eased;
      setDisplay(Math.round(current * 100) / 100);
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    }

    frameRef.current = requestAnimationFrame(animate);
    return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current); };
  }, [target, duration]);

  return display;
}

const CalculateurBonusMalus = () => {
  const [currentCoef, setCurrentCoef] = useState(1.00);
  const [yearsWithout, setYearsWithout] = useState(3);

  const newCoef = useMemo(() => computeNewCoefficient(currentCoef, yearsWithout), [currentCoef, yearsWithout]);
  const gaugePercent = getGaugePercent(newCoef);
  const gaugeColor = getGaugeColor(newCoef);
  const reduction = Math.round((1 - newCoef / currentCoef) * 100);
  const basePrime = 600;
  const savings = Math.round(basePrime * (currentCoef - newCoef));
  const estimatedPrice = Math.round(basePrime * newCoef / 12);

  const animatedCoef = useAnimatedValue(newCoef);
  const animatedPrice = useAnimatedValue(estimatedPrice);
  const animatedSavings = useAnimatedValue(savings > 0 ? savings : 0);

  const circumference = 2 * Math.PI * 85;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Calculateur Bonus-Malus Auto",
    url: "https://jemassuremoinscher.fr/outils/calculateur-bonus-malus",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    description: "Calculez gratuitement votre coefficient bonus-malus auto et estimez vos économies.",
    offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: "https://jemassuremoinscher.fr/" },
      { "@type": "ListItem", position: 2, name: "Outils", item: "https://jemassuremoinscher.fr/outils" },
      { "@type": "ListItem", position: 3, name: "Calculateur Bonus-Malus", item: "https://jemassuremoinscher.fr/outils/calculateur-bonus-malus" },
    ],
  };

  return (
    <>
      <Helmet>
        <title>Calculateur Bonus-Malus Auto Gratuit | 2026</title>
        <meta name="description" content="Calculez votre coefficient bonus-malus auto en 2 clics. Estimez vos économies et comparez les assurances moins chères." />
        <link rel="canonical" href="https://jemassuremoinscher.fr/outils/calculateur-bonus-malus" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbLd)}</script>
      </Helmet>

      <Header />

      <main id="main-content" className="min-h-screen bg-background">
        {/* Breadcrumb */}
        <nav aria-label="Fil d'Ariane" className="max-w-5xl mx-auto px-4 pt-6 pb-2">
          <ol className="flex items-center gap-2 text-sm text-muted-foreground">
            <li><Link to="/" className="hover:text-primary transition-colors">Accueil</Link></li>
            <li>/</li>
            <li>Outils</li>
            <li>/</li>
            <li className="text-foreground font-medium">Calculateur Bonus-Malus</li>
          </ol>
        </nav>

        {/* Hero */}
        <section className="max-w-5xl mx-auto px-4 pt-4 pb-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-semibold mb-4">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="16" y1="14" x2="16" y2="18"/><path d="M16 10h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/><path d="M12 14h.01"/><path d="M8 14h.01"/><path d="M12 18h.01"/><path d="M8 18h.01"/></svg>
              Outil gratuit
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-3">
              Calculateur <span className="text-primary">Bonus-Malus</span> Auto
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Estimez votre futur coefficient en quelques secondes et découvrez combien vous pouvez économiser.
            </p>
          </div>
        </section>

        {/* Calculator — Premium Card Design */}
        <section className="max-w-5xl mx-auto px-4 pb-12">
          <div className="grid md:grid-cols-5 gap-6">
            {/* Left — Interactive Sliders (3 cols) */}
            <div className="md:col-span-3 bg-card rounded-3xl border border-border/50 p-6 md:p-8 shadow-[0_8px_40px_-12px_hsl(var(--primary)/0.12)]">
              <h2 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
                <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                Ajustez vos paramètres
              </h2>

              {/* Coefficient Slider */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-semibold text-foreground text-sm">Votre coefficient actuel</span>
                  <span className="text-3xl font-black text-primary tabular-nums tracking-tight">
                    {currentCoef.toFixed(2)}
                  </span>
                </div>
                <div className="relative">
                  <Slider
                    value={[currentCoef * 100]}
                    onValueChange={([v]) => setCurrentCoef(Math.round(v) / 100)}
                    min={50}
                    max={350}
                    step={1}
                    className="py-2"
                    aria-label="Coefficient actuel"
                  />
                  <div className="flex justify-between text-[11px] text-muted-foreground mt-2 px-0.5">
                    <span>0.50 <span className="text-primary/60">(max bonus)</span></span>
                    <span>1.00</span>
                    <span>3.50 <span className="text-destructive/60">(max malus)</span></span>
                  </div>
                </div>
              </div>

              {/* Years Slider */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-semibold text-foreground text-sm">Années sans accident</span>
                  <span className="text-3xl font-black text-primary tabular-nums tracking-tight">
                    {yearsWithout} <span className="text-base font-semibold text-muted-foreground">an{yearsWithout > 1 ? "s" : ""}</span>
                  </span>
                </div>
                <div className="relative">
                  <Slider
                    value={[yearsWithout]}
                    onValueChange={([v]) => setYearsWithout(v)}
                    min={0}
                    max={13}
                    step={1}
                    className="py-2"
                    aria-label="Années sans accident"
                  />
                  <div className="flex justify-between text-[11px] text-muted-foreground mt-2 px-0.5">
                    <span>0 an</span>
                    <span>13 ans</span>
                  </div>
                </div>
              </div>

              {/* Info tip */}
              <div className="flex items-start gap-2.5 text-sm text-muted-foreground bg-muted/50 rounded-2xl p-4 border border-border/30">
                <svg className="w-4 h-4 flex-shrink-0 mt-0.5 text-primary/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                <span>Chaque année sans accident responsable réduit votre coefficient de <strong className="text-foreground">5%</strong>. Le bonus maximum est atteint après 13 ans.</span>
              </div>
            </div>

            {/* Right — Result Cards (2 cols) */}
            <div className="md:col-span-2 flex flex-col gap-4">
              {/* Main coefficient card */}
              <div className="bg-card rounded-3xl border border-border/50 p-6 shadow-[0_8px_40px_-12px_hsl(var(--primary)/0.12)] flex flex-col items-center flex-1">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Votre futur coefficient</span>
                
                {/* Gauge */}
                <div className="relative w-40 h-40 mb-3">
                  <svg viewBox="0 0 200 200" className="w-full h-full -rotate-90">
                    <circle
                      cx="100" cy="100" r="85"
                      fill="none"
                      stroke="hsl(var(--muted))"
                      strokeWidth="12"
                    />
                    <circle
                      cx="100" cy="100" r="85"
                      fill="none"
                      stroke={gaugeColor}
                      strokeWidth="12"
                      strokeLinecap="round"
                      strokeDasharray={circumference}
                      strokeDashoffset={circumference * (1 - gaugePercent / 100)}
                      className="transition-all duration-700 ease-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-black text-foreground tabular-nums">{animatedCoef.toFixed(2)}</span>
                    <span className="text-[11px] font-medium text-muted-foreground">CRM</span>
                  </div>
                </div>

                <span
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold"
                  style={{ backgroundColor: gaugeColor + "18", color: gaugeColor }}
                >
                  {getEmoji(newCoef)} {getLabel(newCoef)}
                </span>

                {reduction > 0 && (
                  <p className="text-sm text-muted-foreground mt-2 flex items-center gap-1">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg>
                    Réduction de <strong className="text-foreground">{reduction}%</strong>
                  </p>
                )}
              </div>

              {/* Price estimate card */}
              <div className="bg-gradient-to-br from-primary/5 to-accent/10 rounded-3xl border border-primary/20 p-5 shadow-[0_4px_24px_-8px_hsl(var(--primary)/0.1)]">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Estimation mensuelle</span>
                  <span className="text-[10px] bg-accent/20 text-accent-foreground px-2 py-0.5 rounded-full font-bold">Indicatif</span>
                </div>
                <div className="text-center">
                  <span className="text-4xl font-black text-accent tabular-nums">{Math.round(animatedPrice)}€</span>
                  <span className="text-sm text-muted-foreground font-medium">/mois</span>
                </div>
                {animatedSavings > 0 && (
                  <p className="text-center text-sm text-primary font-semibold mt-2">
                    💰 Jusqu'à {Math.round(animatedSavings)}€ d'économies/an
                  </p>
                )}
              </div>

              {/* CTA */}
              {newCoef < currentCoef && (
                <div className="bg-card rounded-3xl border border-border/50 p-4 shadow-[0_4px_24px_-8px_hsl(var(--primary)/0.08)] flex items-center gap-3">
                  <img src={arthurCoin} alt="Arthur" width={48} height={60} className="flex-shrink-0" loading="lazy" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground leading-tight">
                      Profitez de votre bonus de <span className="text-primary">{newCoef.toFixed(2)}</span> !
                    </p>
                    <Button asChild size="sm" className="mt-2 rounded-full text-xs h-8 px-4">
                      <Link to="/comparateur">
                        Comparer les prix
                        <svg className="w-3.5 h-3.5 ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                      </Link>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* SEO Content */}
        <section className="max-w-5xl mx-auto px-4 pb-16">
          <div className="bg-card rounded-3xl border border-border/50 p-6 md:p-8 shadow-[0_4px_24px_-8px_hsl(var(--primary)/0.06)]">
            <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              Comment fonctionne le bonus-malus auto en France en 2026 ?
            </h2>
            <div className="prose prose-sm max-w-none text-muted-foreground space-y-4">
              <p>
                Le système de bonus-malus, officiellement appelé <strong>Coefficient de Réduction-Majoration (CRM)</strong>,
                est un mécanisme légal qui récompense les conducteurs prudents et pénalise ceux qui causent des accidents.
                Il est encadré par l'<strong>article A121-1 du Code des assurances</strong> et s'applique à tous les contrats
                d'assurance auto en France.
              </p>
              <p>
                <strong>Le principe est simple :</strong> chaque année sans accident responsable, votre coefficient
                diminue de 5 %. Il est multiplié par 0.95. Si vous partez d'un coefficient de 1.00 (celui attribué
                aux nouveaux conducteurs), après 13 années consécutives sans sinistre, vous atteignez le bonus
                maximum de <strong>0.50</strong>, soit une réduction de 50 % sur votre prime de référence.
              </p>
              <p>
                En cas d'accident responsable, votre coefficient est majoré de 25 % (multiplié par 1.25).
                Pour un accident partiellement responsable, la majoration est de 12,5 %. Le malus maximum
                est plafonné à <strong>3.50</strong>. En 2026, les règles restent inchangées, mais les assureurs
                intègrent de plus en plus de <strong>données télématiques</strong> et de critères comportementaux
                dans le calcul de la prime finale, en complément du CRM.
              </p>
              <p>
                Utiliser notre calculateur vous permet d'anticiper l'évolution de votre coefficient et de
                <strong> comparer les offres d'assurance auto</strong> en tenant compte de votre bonus réel.
                Plus votre coefficient est bas, plus vous avez de pouvoir de négociation auprès des assureurs.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default CalculateurBonusMalus;
