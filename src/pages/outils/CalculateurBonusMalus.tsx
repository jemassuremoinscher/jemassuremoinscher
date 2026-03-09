import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Calculator, ArrowRight, TrendingDown, Shield, Info } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import arthurCoin from "@/assets/mascotte/arthur-sprint-coin.png";

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

const CalculateurBonusMalus = () => {
  const [currentCoef, setCurrentCoef] = useState(1.00);
  const [yearsWithout, setYearsWithout] = useState(3);

  const newCoef = useMemo(() => computeNewCoefficient(currentCoef, yearsWithout), [currentCoef, yearsWithout]);
  const gaugePercent = getGaugePercent(newCoef);
  const gaugeColor = getGaugeColor(newCoef);
  const reduction = Math.round((1 - newCoef / currentCoef) * 100);
  const savings = Math.round(300 * (currentCoef - newCoef));

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
        <nav aria-label="Fil d'Ariane" className="max-w-4xl mx-auto px-4 pt-6 pb-2">
          <ol className="flex items-center gap-2 text-sm text-muted-foreground">
            <li><Link to="/" className="hover:text-primary transition-colors">Accueil</Link></li>
            <li>/</li>
            <li>Outils</li>
            <li>/</li>
            <li className="text-foreground font-medium">Calculateur Bonus-Malus</li>
          </ol>
        </nav>

        {/* Hero */}
        <section className="max-w-4xl mx-auto px-4 pt-4 pb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-semibold mb-4">
              <Calculator className="w-4 h-4" />
              Outil gratuit
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-3">
              Calculateur <span className="text-primary">Bonus-Malus</span> Auto
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Estimez votre futur coefficient en quelques secondes et découvrez combien vous pouvez économiser.
            </p>
          </motion.div>
        </section>

        {/* Calculator */}
        <section className="max-w-4xl mx-auto px-4 pb-12">
          <Card className="p-6 md:p-8 shadow-[var(--shadow-card)] border-border">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Left — Inputs */}
              <div className="space-y-8">
                <div>
                  <label className="flex items-center justify-between mb-3">
                    <span className="font-semibold text-foreground">Votre coefficient actuel</span>
                    <span className="text-2xl font-extrabold text-primary">{currentCoef.toFixed(2)}</span>
                  </label>
                  <Slider
                    value={[currentCoef * 100]}
                    onValueChange={([v]) => setCurrentCoef(Math.round(v) / 100)}
                    min={50}
                    max={350}
                    step={1}
                    className="py-2"
                    aria-label="Coefficient actuel"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>0.50 (max bonus)</span>
                    <span>1.00</span>
                    <span>3.50 (max malus)</span>
                  </div>
                </div>

                <div>
                  <label className="flex items-center justify-between mb-3">
                    <span className="font-semibold text-foreground">Années sans accident</span>
                    <span className="text-2xl font-extrabold text-primary">{yearsWithout} an{yearsWithout > 1 ? "s" : ""}</span>
                  </label>
                  <Slider
                    value={[yearsWithout]}
                    onValueChange={([v]) => setYearsWithout(v)}
                    min={0}
                    max={13}
                    step={1}
                    className="py-2"
                    aria-label="Années sans accident"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>0 an</span>
                    <span>13 ans</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted rounded-lg p-3">
                  <Info className="w-4 h-4 flex-shrink-0" />
                  <span>Chaque année sans accident responsable réduit votre coefficient de 5%.</span>
                </div>
              </div>

              {/* Right — Gauge Result */}
              <div className="flex flex-col items-center justify-center">
                <motion.div
                  key={newCoef}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className="relative w-48 h-48 mb-4"
                >
                  {/* Gauge background */}
                  <svg viewBox="0 0 200 200" className="w-full h-full -rotate-90">
                    <circle
                      cx="100" cy="100" r="85"
                      fill="none"
                      stroke="hsl(var(--muted))"
                      strokeWidth="14"
                    />
                    <motion.circle
                      cx="100" cy="100" r="85"
                      fill="none"
                      stroke={gaugeColor}
                      strokeWidth="14"
                      strokeLinecap="round"
                      strokeDasharray={2 * Math.PI * 85}
                      initial={{ strokeDashoffset: 2 * Math.PI * 85 }}
                      animate={{ strokeDashoffset: 2 * Math.PI * 85 * (1 - gaugePercent / 100) }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-extrabold text-foreground">{newCoef.toFixed(2)}</span>
                    <span className="text-sm font-medium text-muted-foreground">Nouveau CRM</span>
                  </div>
                </motion.div>

                <span
                  className="inline-block px-3 py-1 rounded-full text-sm font-semibold mb-2"
                  style={{ backgroundColor: gaugeColor + "22", color: gaugeColor }}
                >
                  {getLabel(newCoef)}
                </span>

                {reduction > 0 && (
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <TrendingDown className="w-4 h-4" />
                    <span>Réduction de <strong className="text-foreground">{reduction}%</strong> sur votre coefficient</span>
                  </div>
                )}
              </div>
            </div>

            {/* CTA result */}
            {newCoef < currentCoef && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 bg-gradient-to-r from-primary/5 to-accent/10 border border-primary/20 rounded-xl p-5 flex flex-col sm:flex-row items-center gap-4"
              >
                <img src={arthurCoin} alt="Arthur avec pièce d'or - calculateur bonus malus assurance auto" width={64} height={80} className="flex-shrink-0" loading="lazy" />
                <div className="flex-1 text-center sm:text-left">
                  <p className="font-semibold text-foreground">
                    Félicitations ! Avec un bonus de <span className="text-primary">{newCoef.toFixed(2)}</span>, vous pouvez économiser
                    jusqu'à <span className="text-primary font-extrabold">{savings > 0 ? savings : 300}€</span> sur votre prime.
                  </p>
                </div>
                <Button asChild size="lg" className="flex-shrink-0">
                  <Link to="/comparateur">
                    Comparer les prix maintenant
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </Button>
              </motion.div>
            )}
          </Card>
        </section>

        {/* SEO Content */}
        <section className="max-w-4xl mx-auto px-4 pb-16">
          <Card className="p-6 md:p-8 border-border">
            <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
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
          </Card>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default CalculateurBonusMalus;
