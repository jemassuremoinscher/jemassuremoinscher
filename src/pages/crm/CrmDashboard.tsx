import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { STAGES, type StageId } from "./types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { TrendingUp, Users, Target, Euro } from "lucide-react";

type DealMini = {
  id: string;
  stage: StageId;
  insurance_type: string;
  estimated_commission: number | null;
  actual_commission: number | null;
  created_at: string;
  contacts?: { source: string | null } | null;
};

const STAGE_COLORS: Record<string, string> = Object.fromEntries(
  STAGES.map((s) => [s.id, s.accent])
);

function Kpi({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: any;
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="rounded-3xl border border-[#E9D5FF] bg-white p-5">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-[#F5F3FF] p-2.5">
          <Icon className="h-5 w-5 text-[#7C3AED]" />
        </div>
        <div className="text-xs uppercase tracking-wide text-slate-500">
          {label}
        </div>
      </div>
      <div className="mt-3 text-2xl font-semibold text-slate-900">{value}</div>
      {hint && <div className="mt-1 text-xs text-slate-500">{hint}</div>}
    </div>
  );
}

export default function CrmDashboard() {
  const [deals, setDeals] = useState<DealMini[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("deals")
        .select(
          "id,stage,insurance_type,estimated_commission,actual_commission,created_at,contacts(source)"
        )
        .is("deleted_at", null)
        .limit(2000);
      setDeals((data ?? []) as unknown as DealMini[]);
      setLoading(false);
    })();
  }, []);

  const stats = useMemo(() => {
    const total = deals.length;
    const won = deals.filter((d) => d.stage === "won").length;
    const lost = deals.filter((d) => d.stage === "lost").length;
    const active = total - won - lost;
    const conversionRate = total > 0 ? (won / total) * 100 : 0;
    const pipelineCa = deals
      .filter((d) => !["won", "lost"].includes(d.stage))
      .reduce((s, d) => s + (Number(d.estimated_commission) || 0), 0);
    const wonCa = deals
      .filter((d) => d.stage === "won")
      .reduce(
        (s, d) =>
          s + (Number(d.actual_commission) || Number(d.estimated_commission) || 0),
        0
      );
    return { total, won, lost, active, conversionRate, pipelineCa, wonCa };
  }, [deals]);

  const byStage = useMemo(
    () =>
      STAGES.map((s) => ({
        name: s.label,
        count: deals.filter((d) => d.stage === s.id).length,
        color: s.accent,
      })),
    [deals]
  );

  const bySource = useMemo(() => {
    const map = new Map<string, number>();
    deals.forEach((d) => {
      const src = d.contacts?.source ?? "inconnu";
      map.set(src, (map.get(src) ?? 0) + 1);
    });
    return Array.from(map, ([name, value]) => ({ name, value })).sort(
      (a, b) => b.value - a.value
    );
  }, [deals]);

  const byType = useMemo(() => {
    const map = new Map<string, number>();
    deals.forEach((d) =>
      map.set(d.insurance_type, (map.get(d.insurance_type) ?? 0) + 1)
    );
    return Array.from(map, ([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  }, [deals]);

  const PIE_COLORS = ["#7C3AED", "#4F46E5", "#0891B2", "#D97706", "#16A34A", "#DC2626", "#64748B", "#A78BFA"];

  const fmtEur = (n: number) =>
    new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(n);

  return (
    <div className="flex flex-1 flex-col overflow-y-auto px-6 py-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          {loading ? "Chargement…" : `Vue d'ensemble sur ${stats.total} deals`}
        </p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi
          icon={Users}
          label="Deals actifs"
          value={String(stats.active)}
          hint={`${stats.total} au total`}
        />
        <Kpi
          icon={Target}
          label="Taux de conversion"
          value={`${stats.conversionRate.toFixed(1)}%`}
          hint={`${stats.won} gagnés · ${stats.lost} perdus`}
        />
        <Kpi
          icon={TrendingUp}
          label="Pipeline (est.)"
          value={fmtEur(stats.pipelineCa)}
          hint="Commissions estimées"
        />
        <Kpi
          icon={Euro}
          label="CA signé"
          value={fmtEur(stats.wonCa)}
          hint="Commissions gagnées"
        />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-3xl border border-[#E9D5FF] bg-white p-5">
          <h3 className="text-sm font-semibold text-slate-800">
            Deals par étape
          </h3>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byStage}>
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {byStage.map((s, i) => (
                    <Cell key={i} fill={s.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-3xl border border-[#E9D5FF] bg-white p-5">
          <h3 className="text-sm font-semibold text-slate-800">
            Leads par source
          </h3>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={bySource}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={{ fontSize: 11 }}
                >
                  {bySource.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-3xl border border-[#E9D5FF] bg-white p-5">
        <h3 className="text-sm font-semibold text-slate-800">
          Top produits (nb de deals)
        </h3>
        <div className="mt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={byType} layout="vertical" margin={{ left: 40 }}>
              <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={110} />
              <Tooltip />
              <Bar dataKey="count" fill="#7C3AED" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
