import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { TrendingDown, Users, Target, AlertTriangle } from "lucide-react";

type Event = {
  session_id: string;
  insurance_type: string | null;
  step_index: number;
  step_id: string | null;
  event_type: string;
  created_at: string;
};

const RANGES = {
  "24h": 1,
  "7j": 7,
  "30j": 30,
  "90j": 90,
} as const;

type RangeKey = keyof typeof RANGES;

export const FunnelAnalytics = () => {
  const [range, setRange] = useState<RangeKey>("7j");
  const [type, setType] = useState<string>("all");
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const since = new Date(Date.now() - RANGES[range] * 86400000).toISOString();
    supabase
      .from("quote_funnel_events")
      .select("session_id,insurance_type,step_index,step_id,event_type,created_at")
      .gte("created_at", since)
      .order("created_at", { ascending: true })
      .limit(50000)
      .then(({ data, error }) => {
        if (cancelled) return;
        if (!error && data) setEvents(data as Event[]);
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [range]);

  const filtered = useMemo(() => {
    if (type === "all") return events;
    return events.filter((e) => (e.insurance_type ?? "comparateur") === type);
  }, [events, type]);

  const types = useMemo(() => {
    const set = new Set<string>();
    events.forEach((e) => e.insurance_type && set.add(e.insurance_type));
    return Array.from(set).sort();
  }, [events]);

  // Build funnel: per session, max step_index reached
  const stats = useMemo(() => {
    const sessions = new Map<string, { maxStep: number; submitted: boolean; lastStepId: string | null }>();
    filtered.forEach((e) => {
      const cur = sessions.get(e.session_id) || { maxStep: -1, submitted: false, lastStepId: null };
      if (e.step_index > cur.maxStep) {
        cur.maxStep = e.step_index;
        cur.lastStepId = e.step_id;
      }
      if (e.event_type === "submit_success") cur.submitted = true;
      sessions.set(e.session_id, cur);
    });

    const total = sessions.size;
    const submitted = Array.from(sessions.values()).filter((s) => s.submitted).length;

    // Per-step reach
    const stepReach = new Map<number, { count: number; label: string }>();
    filtered.forEach((e) => {
      if (e.event_type !== "step_view") return;
      const k = e.step_index;
      const cur = stepReach.get(k) || { count: 0, label: e.step_id || `Étape ${k + 1}` };
      cur.label = e.step_id || cur.label;
      stepReach.set(k, cur);
    });
    // unique sessions per step
    const uniquePerStep = new Map<number, Set<string>>();
    filtered.forEach((e) => {
      if (e.event_type !== "step_view") return;
      if (!uniquePerStep.has(e.step_index)) uniquePerStep.set(e.step_index, new Set());
      uniquePerStep.get(e.step_index)!.add(e.session_id);
    });
    const steps = Array.from(uniquePerStep.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([idx, set]) => ({
        index: idx,
        label: stepReach.get(idx)?.label || `Étape ${idx + 1}`,
        sessions: set.size,
      }));

    // Drop-off step (the step with biggest drop in absolute sessions)
    let worstDropIdx = -1;
    let worstDropPct = 0;
    for (let i = 1; i < steps.length; i++) {
      const drop = steps[i - 1].sessions - steps[i].sessions;
      const pct = steps[i - 1].sessions ? drop / steps[i - 1].sessions : 0;
      if (pct > worstDropPct) {
        worstDropPct = pct;
        worstDropIdx = i;
      }
    }

    return {
      total,
      submitted,
      conversionRate: total ? (submitted / total) * 100 : 0,
      steps,
      worstDropIdx,
      worstDropPct: worstDropPct * 100,
    };
  }, [filtered]);

  const maxSessions = stats.steps[0]?.sessions || 1;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Funnel comparateur</h2>
          <p className="text-sm text-muted-foreground">
            Visualisez où les visiteurs s'arrêtent dans le tunnel de devis.
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={type} onValueChange={setType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les types</SelectItem>
              {types.map((t) => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={range} onValueChange={(v) => setRange(v as RangeKey)}>
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(RANGES).map((k) => (
                <SelectItem key={k} value={k}>{k}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard icon={Users} label="Sessions" value={stats.total.toLocaleString("fr-FR")} loading={loading} />
        <KpiCard icon={Target} label="Devis envoyés" value={stats.submitted.toLocaleString("fr-FR")} loading={loading} />
        <KpiCard
          icon={TrendingDown}
          label="Taux de conversion"
          value={`${stats.conversionRate.toFixed(1)}%`}
          loading={loading}
        />
        <KpiCard
          icon={AlertTriangle}
          label="Pire abandon"
          value={
            stats.worstDropIdx >= 0
              ? `${Math.round(stats.worstDropPct)}% à l'étape ${stats.worstDropIdx + 1}`
              : "—"
          }
          loading={loading}
          accent
        />
      </div>

      {/* Funnel bars */}
      <Card className="p-6">
        <h3 className="font-bold text-foreground mb-4">Progression par étape</h3>
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : stats.steps.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucune donnée pour cette période.</p>
        ) : (
          <ol className="space-y-2">
            {stats.steps.map((s, i) => {
              const pct = (s.sessions / maxSessions) * 100;
              const dropFromPrev =
                i > 0 ? stats.steps[i - 1].sessions - s.sessions : 0;
              const dropPct =
                i > 0 && stats.steps[i - 1].sessions
                  ? (dropFromPrev / stats.steps[i - 1].sessions) * 100
                  : 0;
              return (
                <li key={s.index} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-foreground">
                      {i + 1}. {s.label}
                    </span>
                    <span className="text-muted-foreground tabular-nums">
                      {s.sessions.toLocaleString("fr-FR")} sessions
                      {i > 0 && dropPct > 0 && (
                        <span className="ml-2 text-destructive">
                          −{Math.round(dropPct)}%
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </Card>
    </div>
  );
};

const KpiCard = ({
  icon: Icon,
  label,
  value,
  loading,
  accent,
}: {
  icon: any;
  label: string;
  value: string;
  loading: boolean;
  accent?: boolean;
}) => (
  <Card className="p-4">
    <div className="flex items-center gap-3">
      <div
        className={`p-2 rounded-xl ${
          accent ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"
        }`}
      >
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        {loading ? (
          <Skeleton className="h-6 w-20 mt-1" />
        ) : (
          <p className="font-bold text-lg text-foreground truncate">{value}</p>
        )}
      </div>
    </div>
  </Card>
);

export default FunnelAnalytics;
