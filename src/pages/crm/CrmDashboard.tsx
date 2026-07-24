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
import { TrendingUp, Users, Target, Euro, CheckSquare, Phone, Clock } from "lucide-react";

type DealMini = {
  id: string;
  stage: StageId;
  insurance_type: string;
  estimated_commission: number | null;
  actual_commission: number | null;
  assigned_to: string | null;
  created_at: string;
  updated_at: string;
  contacts?: { source: string | null; full_name: string | null; email: string; phone: string | null } | null;
};

type Agent = { id: string; user_id: string | null; full_name: string };

function Kpi({ icon: Icon, label, value, hint }: any) {
  return (
    <div className="rounded-3xl border border-[#E9D5FF] bg-white p-5">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-[#F5F3FF] p-2.5">
          <Icon className="h-5 w-5 text-[#7C3AED]" />
        </div>
        <div className="text-xs uppercase tracking-wide text-slate-500">{label}</div>
      </div>
      <div className="mt-3 text-2xl font-semibold text-slate-900">{value}</div>
      {hint && <div className="mt-1 text-xs text-slate-500">{hint}</div>}
    </div>
  );
}

const fmtEur = (n: number) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);

const PIE_COLORS = ["#7C3AED", "#4F46E5", "#0891B2", "#D97706", "#16A34A", "#DC2626", "#64748B", "#A78BFA"];

const RANGES = [
  { id: "today", label: "Aujourd'hui", days: 1 },
  { id: "7d", label: "7 jours", days: 7 },
  { id: "30d", label: "30 jours", days: 30 },
  { id: "90d", label: "90 jours", days: 90 },
  { id: "all", label: "Tout", days: 3650 },
] as const;

export default function CrmDashboard() {
  const [deals, setDeals] = useState<DealMini[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [agentFilter, setAgentFilter] = useState<string>("all");
  const [range, setRange] = useState<(typeof RANGES)[number]["id"]>("30d");

  useEffect(() => {
    (async () => {
      const [d, a] = await Promise.all([
        supabase
          .from("deals")
          .select(
            "id,stage,insurance_type,estimated_commission,actual_commission,assigned_to,created_at,updated_at,contacts(source,full_name,email,phone)"
          )
          .is("deleted_at", null)
          .limit(5000),
        supabase.from("sales_agents").select("id,user_id,full_name").eq("is_active", true),
      ]);
      setDeals((d.data ?? []) as unknown as DealMini[]);
      setAgents((a.data ?? []) as Agent[]);
      setLoading(false);
    })();
  }, []);

  const filtered = useMemo(() => {
    const days = RANGES.find((r) => r.id === range)?.days ?? 30;
    const cutoff = Date.now() - days * 86400_000;
    return deals.filter((d) => {
      if (agentFilter !== "all") {
        const agentUser = agents.find((a) => a.id === agentFilter)?.user_id;
        if (d.assigned_to !== agentUser && d.assigned_to !== agentFilter) return false;
      }
      return new Date(d.created_at).getTime() >= cutoff;
    });
  }, [deals, range, agentFilter, agents]);

  const stats = useMemo(() => {
    const total = filtered.length;
    const won = filtered.filter((d) => d.stage === "won").length;
    const lost = filtered.filter((d) => d.stage === "lost").length;
    const active = total - won - lost;
    const conversionRate = total > 0 ? (won / total) * 100 : 0;
    const pipelineCa = filtered
      .filter((d) => !["won", "lost"].includes(d.stage))
      .reduce((s, d) => s + Number(d.estimated_commission || 0), 0);
    const wonCa = filtered
      .filter((d) => d.stage === "won")
      .reduce((s, d) => s + Number(d.actual_commission || d.estimated_commission || 0), 0);
    return { total, won, lost, active, conversionRate, pipelineCa, wonCa };
  }, [filtered]);

  const byStage = useMemo(
    () => STAGES.map((s) => ({ name: s.label, count: filtered.filter((d) => d.stage === s.id).length, color: s.accent })),
    [filtered]
  );

  const bySource = useMemo(() => {
    const map = new Map<string, number>();
    filtered.forEach((d) => {
      const src = d.contacts?.source ?? "inconnu";
      map.set(src, (map.get(src) ?? 0) + 1);
    });
    return Array.from(map, ([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [filtered]);

  // Tâches du jour (standard secteur Salesforce)
  const dailyTasks = useMemo(() => {
    const today = new Date().toDateString();
    const isToday = (d: string) => new Date(d).toDateString() === today;
    const olderThan = (d: string, hours: number) =>
      Date.now() - new Date(d).getTime() > hours * 3600_000;

    const newLeads = filtered.filter((d) => d.stage === "lead" && isToday(d.created_at));
    const followUp = filtered.filter(
      (d) => ["qualified", "quote_sent"].includes(d.stage) && olderThan(d.updated_at, 48)
    );
    const staleIncomplete = filtered.filter(
      (d) => d.stage === "incomplete" && olderThan(d.updated_at, 24)
    );
    const closing = filtered.filter((d) => d.stage === "subscription");

    return [
      {
        id: "new",
        icon: Phone,
        color: "text-emerald-700 bg-emerald-50",
        title: "Nouveaux leads à appeler",
        hint: "Sous 5 minutes = 9× plus de conversion (Harvard Business Review)",
        items: newLeads,
      },
      {
        id: "follow",
        icon: Clock,
        color: "text-amber-700 bg-amber-50",
        title: "Relances à faire (>48h sans contact)",
        hint: "Norme Salesforce : cadence J+2, J+5, J+10",
        items: followUp,
      },
      {
        id: "incomplete",
        icon: CheckSquare,
        color: "text-red-700 bg-red-50",
        title: "Dossiers incomplets à débloquer",
        hint: "Documents manquants depuis >24h",
        items: staleIncomplete,
      },
      {
        id: "closing",
        icon: Target,
        color: "text-[#6D28D9] bg-[#F5F3FF]",
        title: "Signatures à finaliser",
        hint: "Deals en souscription active",
        items: closing,
      },
    ];
  }, [filtered]);

  return (
    <div className="flex flex-1 flex-col overflow-y-auto px-6 py-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">
            {loading ? "Chargement…" : `${stats.total} deals sur la période`}
          </p>
        </div>
        <div className="flex gap-2">
          <select
            value={agentFilter}
            onChange={(e) => setAgentFilter(e.target.value)}
            className="h-9 rounded-full border border-[#E9D5FF] bg-white px-3 text-sm"
          >
            <option value="all">Tous commerciaux</option>
            {agents.map((a) => (
              <option key={a.id} value={a.id}>
                {a.full_name}
              </option>
            ))}
          </select>
          <div className="flex rounded-full border border-[#E9D5FF] bg-white p-0.5">
            {RANGES.map((r) => (
              <button
                key={r.id}
                onClick={() => setRange(r.id)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                  range === r.id ? "bg-[#7C3AED] text-white" : "text-slate-600 hover:bg-[#F5F3FF]"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi icon={Users} label="Deals actifs" value={String(stats.active)} hint={`${stats.total} au total`} />
        <Kpi
          icon={Target}
          label="Taux de conversion"
          value={`${stats.conversionRate.toFixed(1)}%`}
          hint={`${stats.won} gagnés · ${stats.lost} perdus`}
        />
        <Kpi icon={TrendingUp} label="Pipeline (est.)" value={fmtEur(stats.pipelineCa)} />
        <Kpi icon={Euro} label="CA signé" value={fmtEur(stats.wonCa)} />
      </div>

      {/* Tâches du jour */}
      <div className="mt-6 rounded-3xl border border-[#E9D5FF] bg-white p-5">
        <div className="flex items-center gap-2">
          <CheckSquare className="h-5 w-5 text-[#7C3AED]" />
          <h2 className="text-sm font-semibold text-slate-800">
            Tâches du jour {agentFilter === "all" ? "(équipe)" : ""}
          </h2>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {dailyTasks.map((task) => (
            <div
              key={task.id}
              className="rounded-2xl border border-slate-100 bg-[#FAFAFF] p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`rounded-xl p-1.5 ${task.color}`}>
                    <task.icon className="h-4 w-4" />
                  </div>
                  <div className="text-sm font-medium text-slate-800">{task.title}</div>
                </div>
                <span className="rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-slate-700 shadow-sm">
                  {task.items.length}
                </span>
              </div>
              <p className="mt-2 text-xs text-slate-500">{task.hint}</p>
              {task.items.length > 0 && (
                <ul className="mt-2 space-y-1">
                  {task.items.slice(0, 3).map((d) => (
                    <li key={d.id} className="truncate text-xs text-slate-600">
                      • {d.contacts?.full_name || d.contacts?.email} — {d.insurance_type}
                    </li>
                  ))}
                  {task.items.length > 3 && (
                    <li className="text-xs text-slate-400">
                      +{task.items.length - 3} de plus
                    </li>
                  )}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-3xl border border-[#E9D5FF] bg-white p-5">
          <h3 className="text-sm font-semibold text-slate-800">Deals par étape</h3>
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
          <h3 className="text-sm font-semibold text-slate-800">Leads par source</h3>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={bySource} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
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
    </div>
  );
}
