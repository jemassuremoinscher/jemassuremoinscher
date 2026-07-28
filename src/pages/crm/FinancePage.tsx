import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Euro, TrendingUp, Wallet, Users } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

type Row = {
  id: string;
  stage: string;
  insurance_type: string;
  estimated_commission: number | null;
  actual_commission: number | null;
  assigned_to: string | null;
  created_at: string;
  updated_at: string;
};

type Agent = { id: string; user_id: string | null; full_name: string };

const fmtEur = (n: number) =>
  new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(n);

function Kpi({ icon: Icon, label, value, hint }: any) {
  return (
    <div className="rounded-3xl border border-[#E9D5FF] dark:border-[#362B54] bg-white dark:bg-[#1E1B2E] p-5">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-[#F5F3FF] dark:bg-[#262140] p-2.5">
          <Icon className="h-5 w-5 text-[#7C3AED] dark:text-[#C4B5FD]" />
        </div>
        <div className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
          {label}
        </div>
      </div>
      <div className="mt-3 text-2xl font-semibold text-slate-900 dark:text-slate-50">{value}</div>
      {hint && <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">{hint}</div>}
    </div>
  );
}

export default function FinancePage() {
  const [deals, setDeals] = useState<Row[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [d, a] = await Promise.all([
        supabase
          .from("deals")
          .select(
            "id,stage,insurance_type,estimated_commission,actual_commission,assigned_to,created_at,updated_at"
          )
          .is("deleted_at", null)
          .limit(5000),
        supabase.from("sales_agents").select("id,user_id,full_name"),
      ]);
      setDeals((d.data ?? []) as Row[]);
      setAgents((a.data ?? []) as Agent[]);
      setLoading(false);
    })();
  }, []);

  const stats = useMemo(() => {
    const won = deals.filter((d) => d.stage === "won");
    const active = deals.filter((d) => !["won", "lost"].includes(d.stage));
    const wonCa = won.reduce(
      (s, d) => s + Number(d.actual_commission || d.estimated_commission || 0),
      0
    );
    const pipeline = active.reduce(
      (s, d) => s + Number(d.estimated_commission || 0),
      0
    );
    const avgTicket = won.length ? wonCa / won.length : 0;
    return { wonCa, pipeline, avgTicket, wonCount: won.length };
  }, [deals]);

  const byAgent = useMemo(() => {
    const map = new Map<string, number>();
    deals
      .filter((d) => d.stage === "won")
      .forEach((d) => {
        const key = d.assigned_to ?? "non-assigné";
        map.set(
          key,
          (map.get(key) ?? 0) +
            Number(d.actual_commission || d.estimated_commission || 0)
        );
      });
    return Array.from(map, ([id, ca]) => {
      const a = agents.find((x) => x.user_id === id || x.id === id);
      return { name: a?.full_name ?? "Non-assigné", ca };
    }).sort((a, b) => b.ca - a.ca);
  }, [deals, agents]);

  const byMonth = useMemo(() => {
    const map = new Map<string, number>();
    deals
      .filter((d) => d.stage === "won")
      .forEach((d) => {
        const m = new Date(d.updated_at).toISOString().slice(0, 7);
        map.set(
          m,
          (map.get(m) ?? 0) +
            Number(d.actual_commission || d.estimated_commission || 0)
        );
      });
    return Array.from(map, ([month, ca]) => ({ month, ca })).sort((a, b) =>
      a.month.localeCompare(b.month)
    );
  }, [deals]);

  return (
    <div className="flex flex-1 flex-col overflow-y-auto px-6 py-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
          Finance & Commissions
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {loading ? "Chargement…" : `${deals.length} deals analysés`}
        </p>
        <div className="mt-3 max-w-3xl rounded-2xl border border-[#E9D5FF] dark:border-[#362B54] bg-[#FAF5FF] dark:bg-[#13111C] p-3 text-xs text-slate-600 dark:text-slate-300">
          <strong className="text-[#5B21B6] dark:text-[#D8B4FE]">Automatisation :</strong> les
          commissions sont calculées automatiquement à partir des deals
          <em> passés en étape « Validé »</em>. Le CA signé = somme des{" "}
          <code>actual_commission</code> (sinon <code>estimated_commission</code>).
          Renseignez la commission sur chaque deal dans le drawer pour
          alimenter les KPIs et graphiques ci-dessous.
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi icon={Euro} label="CA signé" value={fmtEur(stats.wonCa)} hint={`${stats.wonCount} contrats`} />
        <Kpi icon={TrendingUp} label="Pipeline estimé" value={fmtEur(stats.pipeline)} />
        <Kpi icon={Wallet} label="Ticket moyen" value={fmtEur(stats.avgTicket)} />
        <Kpi icon={Users} label="Commerciaux actifs" value={String(agents.length)} />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-3xl border border-[#E9D5FF] dark:border-[#362B54] bg-white dark:bg-[#1E1B2E] p-5">
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
            Commissions par commercial
          </h3>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byAgent} layout="vertical" margin={{ left: 60 }}>
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={110} />
                <Tooltip formatter={(v: number) => fmtEur(v)} />
                <Bar dataKey="ca" fill="#7C3AED" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-3xl border border-[#E9D5FF] dark:border-[#362B54] bg-white dark:bg-[#1E1B2E] p-5">
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
            Évolution CA mensuel
          </h3>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byMonth}>
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v: number) => fmtEur(v)} />
                <Bar dataKey="ca" radius={[8, 8, 0, 0]}>
                  {byMonth.map((_, i) => (
                    <Cell key={i} fill="#7C3AED" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
