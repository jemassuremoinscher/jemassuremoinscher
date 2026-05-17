import { useMemo } from "react";
import { Link } from "react-router-dom";
import type { DuelConfig } from "@/data/duelData";

interface Props {
  duel: DuelConfig;
}

function StarRating({ note }: { note: number }) {
  const full = Math.floor(note);
  const half = note - full >= 0.3;
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${note} sur 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill={i < full ? "currentColor" : half && i === full ? "url(#half)" : "none"} stroke="currentColor" strokeWidth="1.5" className={i < full ? "text-accent" : "text-muted-foreground/40"}>
          {half && i === full && (
            <defs><linearGradient id="half"><stop offset="50%" stopColor="currentColor"/><stop offset="50%" stopColor="transparent"/></linearGradient></defs>
          )}
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      ))}
      <span className="text-xs font-semibold text-foreground ml-1">{note}</span>
    </span>
  );
}

export default function InsuranceComparisonDuel({ duel }: Props) {
  const { insurerA: a, insurerB: b } = duel;

  const savings = Math.abs(a.prixMoyen - b.prixMoyen);
  const cheaperName = a.prixMoyen <= b.prixMoyen ? a.name : b.name;
  const moreExpensiveName = a.prixMoyen > b.prixMoyen ? a.name : b.name;

  // AI verdict
  const verdict = useMemo(() => {
    const prixWinner = a.prixMoyen <= b.prixMoyen ? a : b;
    const serviceWinner = a.avisNote >= b.avisNote ? a : b;
    const speedWinner = a.rapiditeJours <= b.rapiditeJours ? a : b;

    if (prixWinner.slug === serviceWinner.slug && prixWinner.slug === speedWinner.slug) {
      return `${prixWinner.name} domine clairement ce comparatif avec le meilleur prix (${prixWinner.prixMoyen}€/an), la meilleure note client (${prixWinner.avisNote}/5) et le remboursement le plus rapide (${prixWinner.rapiditeRemboursement}). C'est notre recommandation pour la plupart des profils.`;
    }
    return `${prixWinner.name} est le meilleur choix si le prix est votre priorité (${prixWinner.prixMoyen}€/an vs ${(prixWinner === a ? b : a).prixMoyen}€/an). En revanche, ${serviceWinner.name} se démarque par la qualité de service (${serviceWinner.avisNote}/5, ${serviceWinner.avisCount} avis). Pour la rapidité de remboursement, ${speedWinner.name} l'emporte avec un délai de ${speedWinner.rapiditeRemboursement}.`;
  }, [a, b]);

  const rows: { label: string; valueA: React.ReactNode; valueB: React.ReactNode; winnerA: boolean; winnerB: boolean }[] = [
    {
      label: "Prix moyen",
      valueA: <span className="font-bold">{a.prixMoyen}€<span className="text-xs font-normal text-muted-foreground">/an</span></span>,
      valueB: <span className="font-bold">{b.prixMoyen}€<span className="text-xs font-normal text-muted-foreground">/an</span></span>,
      winnerA: a.prixMoyen <= b.prixMoyen,
      winnerB: b.prixMoyen < a.prixMoyen,
    },
    {
      label: "Franchise",
      valueA: <span>{a.franchise}€</span>,
      valueB: <span>{b.franchise}€</span>,
      winnerA: a.franchise <= b.franchise,
      winnerB: b.franchise < a.franchise,
    },
    {
      label: "Assistance 0km",
      valueA: a.assistance0km
        ? <span className="text-primary font-medium">✓ Incluse</span>
        : <span className="text-muted-foreground">✗ En option</span>,
      valueB: b.assistance0km
        ? <span className="text-primary font-medium">✓ Incluse</span>
        : <span className="text-muted-foreground">✗ En option</span>,
      winnerA: a.assistance0km && !b.assistance0km,
      winnerB: b.assistance0km && !a.assistance0km,
    },
    {
      label: "Avis clients",
      valueA: <StarRating note={a.avisNote} />,
      valueB: <StarRating note={b.avisNote} />,
      winnerA: a.avisNote >= b.avisNote,
      winnerB: b.avisNote > a.avisNote,
    },
    {
      label: "Remboursement",
      valueA: <span>{a.rapiditeRemboursement}</span>,
      valueB: <span>{b.rapiditeRemboursement}</span>,
      winnerA: a.rapiditeJours <= b.rapiditeJours,
      winnerB: b.rapiditeJours < a.rapiditeJours,
    },
  ];

  return (
    <div className="space-y-8">
      {/* === VS Header === */}
      <div className="flex items-center justify-center gap-4 md:gap-8">
        <div className="flex flex-col items-center gap-2">
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-card border border-border shadow-[var(--shadow-card)] p-3 flex items-center justify-center">
            <img src={a.logo} alt={`Logo ${a.name}`} width={120} height={60} className="max-w-full max-h-full object-contain" loading="lazy" />
          </div>
          <span className="font-bold text-foreground text-sm md:text-base">{a.name}</span>
        </div>

        <div className="flex-shrink-0 relative">
          <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-primary flex items-center justify-center shadow-[var(--shadow-elegant)]">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary-foreground">
              <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>
            </svg>
          </div>
          <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-xs font-black text-primary tracking-wider">VS</span>
        </div>

        <div className="flex flex-col items-center gap-2">
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-card border border-border shadow-[var(--shadow-card)] p-3 flex items-center justify-center">
            <img src={b.logo} alt={`Logo ${b.name}`} width={120} height={60} className="max-w-full max-h-full object-contain" loading="lazy" />
          </div>
          <span className="font-bold text-foreground text-sm md:text-base">{b.name}</span>
        </div>
      </div>

      {/* === Desktop Table === */}
      <div className="hidden md:block rounded-2xl border border-border overflow-hidden bg-card shadow-[var(--shadow-card)]">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/50">
              <th className="text-left px-5 py-3 font-semibold text-muted-foreground">Critère</th>
              <th className="text-center px-5 py-3 font-semibold text-foreground">{a.name}</th>
              <th className="text-center px-5 py-3 font-semibold text-foreground">{b.name}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={row.label} className={i % 2 === 0 ? "bg-card" : "bg-muted/20"}>
                <td className="px-5 py-3.5 font-medium text-foreground">{row.label}</td>
                <td className={`px-5 py-3.5 text-center ${row.winnerA ? "bg-primary/5" : ""}`}>
                  <div className="flex items-center justify-center gap-1.5">
                    {row.valueA}
                    {row.winnerA && (
                      <span className="inline-flex w-5 h-5 rounded-full bg-primary/10 items-center justify-center flex-shrink-0">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-primary"><polyline points="20 6 9 17 4 12"/></svg>
                      </span>
                    )}
                  </div>
                </td>
                <td className={`px-5 py-3.5 text-center ${row.winnerB ? "bg-primary/5" : ""}`}>
                  <div className="flex items-center justify-center gap-1.5">
                    {row.valueB}
                    {row.winnerB && (
                      <span className="inline-flex w-5 h-5 rounded-full bg-primary/10 items-center justify-center flex-shrink-0">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-primary"><polyline points="20 6 9 17 4 12"/></svg>
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* === Mobile Cards === */}
      <div className="md:hidden space-y-3">
        {rows.map((row) => (
          <div key={row.label} className="rounded-xl border border-border bg-card p-4">
            <p className="text-xs font-semibold text-muted-foreground mb-2">{row.label}</p>
            <div className="grid grid-cols-2 gap-3">
              <div className={`text-center rounded-lg p-2 ${row.winnerA ? "bg-primary/5 ring-1 ring-primary/20" : "bg-muted/30"}`}>
                <p className="text-[10px] text-muted-foreground mb-1">{a.name}</p>
                <div className="text-sm">{row.valueA}</div>
              </div>
              <div className={`text-center rounded-lg p-2 ${row.winnerB ? "bg-primary/5 ring-1 ring-primary/20" : "bg-muted/30"}`}>
                <p className="text-[10px] text-muted-foreground mb-1">{b.name}</p>
                <div className="text-sm">{row.valueB}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* === Savings Calculator === */}
      {savings > 0 && (
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5 md:p-6 text-center">
          <p className="text-sm text-muted-foreground mb-1">Calculateur de gain</p>
          <p className="text-base md:text-lg font-bold text-foreground">
            Basculer de <span className="text-destructive">{moreExpensiveName}</span> à{" "}
            <span className="text-primary">{cheaperName}</span> pourrait vous faire économiser
          </p>
          <p className="text-3xl md:text-4xl font-extrabold text-primary mt-2">{savings}€<span className="text-base font-normal text-muted-foreground">/an</span></p>
          <Link
            to={`/comparateur?step=1&type=auto`}
            className="inline-flex items-center gap-2 mt-4 rounded-xl bg-primary text-primary-foreground px-6 py-2.5 font-semibold text-sm shadow-md hover:shadow-lg transition-all hover:opacity-90"
          >
            Comparer mon prix réel →
          </Link>
        </div>
      )}

      {/* === Expert Verdict === */}
      <div className="rounded-2xl border border-border bg-card p-5 md:p-6 shadow-[var(--shadow-card)]">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center flex-shrink-0">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
              <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/>
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-foreground">Notre avis d'expert</h3>
            <p className="text-xs text-muted-foreground">{a.name} vs {b.name} — Analyse objective</p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">{verdict}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
          {[a, b].map((insurer) => (
            <div key={insurer.slug} className="rounded-xl bg-muted/30 p-4">
              <p className="font-semibold text-foreground text-sm mb-2 flex items-center gap-2">
                <img src={insurer.logo} alt={`Logo ${insurer.name}`} width={20} height={20} className="w-5 h-5 object-contain" loading="lazy" />
                {insurer.name}
              </p>
              <div className="space-y-1">
                {insurer.pointsForts.map(p => (
                  <p key={p} className="text-xs text-primary flex items-center gap-1">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                    {p}
                  </p>
                ))}
                {insurer.pointsFaibles.map(p => (
                  <p key={p} className="text-xs text-muted-foreground flex items-center gap-1">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    {p}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
