import { useState, useMemo, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { departments, DepartmentData, NATIONAL_AVG_AUTO } from "@/data/departmentsData";
import { useLanguage } from "@/contexts/LanguageContext";

interface AnimatedCounterProps {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
}

function AnimatedCounter({ value, suffix = "", prefix = "", duration = 600 }: AnimatedCounterProps) {
  const [display, setDisplay] = useState(value);
  const ref = useRef<number | null>(null);

  useEffect(() => {
    const start = display;
    const diff = value - start;
    if (diff === 0) return;
    const startTime = performance.now();
    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(start + diff * eased));
      if (progress < 1) ref.current = requestAnimationFrame(animate);
    };
    ref.current = requestAnimationFrame(animate);
    return () => { if (ref.current) cancelAnimationFrame(ref.current); };
  }, [value]);

  return <span>{prefix}{display}{suffix}</span>;
}

interface RegionalDataWidgetProps {
  insuranceType?: "auto" | "sante" | "habitation";
  initialDepartment?: string; // slug
  compact?: boolean;
}

export default function RegionalDataWidget({
  insuranceType = "auto",
  initialDepartment,
  compact = false,
}: RegionalDataWidgetProps) {
  const navigate = useNavigate();
  const [selectedCode, setSelectedCode] = useState<string>(
    initialDepartment
      ? departments.find(d => d.slug === initialDepartment)?.code || ""
      : ""
  );

  const dept = useMemo(
    () => departments.find(d => d.code === selectedCode),
    [selectedCode]
  );

  const avgPrice = dept
    ? insuranceType === "sante" ? dept.avgPriceSante
    : insuranceType === "habitation" ? dept.avgPriceHabitation
    : dept.avgPriceAuto
    : 0;

  const nationalAvg = NATIONAL_AVG_AUTO;
  const progressPercent = nationalAvg > 0 ? Math.min((avgPrice / (nationalAvg * 1.4)) * 100, 100) : 0;
  const nationalPercent = (nationalAvg / (nationalAvg * 1.4)) * 100;
  const isCheaper = avgPrice < nationalAvg;

  const handleDeptChange = (code: string) => {
    setSelectedCode(code);
    const d = departments.find(dep => dep.code === code);
    if (d) {
      navigate(`/assurance-auto/${d.slug}`, { replace: true });
    }
  };

  const typeLabels: Record<string, string> = {
    auto: "l'assurance auto",
    sante: "la mutuelle santé",
    habitation: "l'assurance habitation",
  };

  return (
    <section
      className={`rounded-2xl border border-border bg-card shadow-lg ${compact ? "p-4" : "p-6 md:p-8"}`}
      aria-label={t("a11y.regional.data")}
      data-ai-description={`Widget de comparaison des prix d'assurance par département français`}
    >
      {/* Titre */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
        </div>
        <div>
          <h2 className="text-lg font-bold text-foreground">
            Prix {typeLabels[insuranceType]} par département
          </h2>
          <p className="text-sm text-muted-foreground">Comparez les tarifs près de chez vous</p>
        </div>
      </div>

      {/* Sélecteur de département */}
      <div className="mb-6">
        <label htmlFor="dept-select" className="block text-sm font-medium text-muted-foreground mb-2">
          Choisissez votre département
        </label>
        <select
          id="dept-select"
          value={selectedCode}
          onChange={(e) => handleDeptChange(e.target.value)}
          className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground shadow-sm focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-base"
        >
          <option value="">— Sélectionnez un département —</option>
          {departments.map(d => (
            <option key={d.code} value={d.code}>
              {d.code} — {d.name}
            </option>
          ))}
        </select>
      </div>

      {/* Résultat */}
      {dept && (
        <div className="space-y-6 animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
          {/* Prix moyen + barre comparative */}
          <div className="rounded-xl bg-muted/40 p-5">
            <p className="text-sm text-muted-foreground mb-1">
              Prix moyen de {typeLabels[insuranceType]} en <strong className="text-foreground">{dept.name}</strong>
            </p>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-3xl font-extrabold text-foreground">
                <AnimatedCounter value={avgPrice} suffix="€" />
              </span>
              <span className="text-sm text-muted-foreground">/an</span>
              {isCheaper ? (
                <span className="ml-2 inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                  Sous la moyenne
                </span>
              ) : (
                <span className="ml-2 inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-accent text-accent-foreground">
                  Au-dessus de la moyenne
                </span>
              )}
            </div>

            {/* Barre de progression comparative */}
            <div className="relative">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>0€</span>
                <span>Moy. nationale : {nationalAvg}€</span>
              </div>
              <div className="relative h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className={`absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out ${
                    isCheaper ? "bg-primary" : "bg-destructive"
                  }`}
                  style={{ width: `${progressPercent}%` }}
                />
                {/* Marqueur moyenne nationale */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-foreground/60"
                  style={{ left: `${nationalPercent}%` }}
                  aria-label="Moyenne nationale"
                />
              </div>
            </div>
          </div>

          {/* Top 3 assureurs */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
              Top 3 des assureurs les moins chers en {dept.name}
            </h3>
            <div className="grid gap-3">
              {dept.topInsurers.map((insurer, i) => (
                <div
                  key={insurer.name}
                  className={`flex items-center gap-4 rounded-xl border p-4 transition-all hover:shadow-md ${
                    i === 0
                      ? "border-primary/30 bg-primary/5 shadow-sm"
                      : "border-border bg-card"
                  }`}
                >
                  {/* Rang */}
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    i === 0 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}>
                    {i + 1}
                  </div>

                  {/* Logo */}
                  <img
                    src={insurer.logo}
                    alt={`Logo ${insurer.name}`}
                    className="w-10 h-10 object-contain rounded-lg bg-white p-1 flex-shrink-0"
                    loading="lazy"
                    width={40}
                    height={40}
                  />

                  {/* Nom */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground text-sm truncate">{insurer.name}</p>
                    {i === 0 && (
                      <p className="text-xs text-primary font-medium">Meilleur prix</p>
                    )}
                  </div>

                  {/* Prix */}
                  <div className="text-right flex-shrink-0">
                    <p className="text-lg font-extrabold text-foreground">
                      <AnimatedCounter value={insurer.price} suffix="€" />
                    </p>
                    <p className="text-xs text-muted-foreground">/an</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <a
            href={`/comparateur?step=1&dept=${dept.code}`}
            className="block w-full text-center rounded-xl bg-primary text-primary-foreground py-3.5 font-semibold text-base shadow-md hover:shadow-lg transition-all hover:opacity-90 animate-pulse-subtle"
          >
            Comparer les offres en {dept.name} →
          </a>

          {/* Micro-données SEO */}
          <p className="text-xs text-muted-foreground/60 mt-2">
            Données indicatives pour {dept.name} ({dept.code}) — mises à jour en mars 2026.
          </p>
        </div>
      )}
    </section>
  );
}
