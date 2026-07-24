import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
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
import { TrendingUp, Users, Target, Euro, CheckSquare, Phone, Clock, Save, Trash2, ArrowRight } from "lucide-react";

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

function Kpi({ icon: Icon, label, value, hint, href }: any) {
  const body = (
    <div className="group rounded-3xl border border-[#E9D5FF] bg-white p-5 transition hover:border-[#C4B5FD] hover:shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-[#F5F3FF] p-2.5">
            <Icon className="h-5 w-5 text-[#7C3AED]" />
          </div>
          <div className="text-xs uppercase tracking-wide text-slate-500">{label}</div>
        </div>
        {href && <ArrowRight className="h-4 w-4 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-[#7C3AED]" />}
      </div>
      <div className="mt-3 text-2xl font-semibold text-slate-900">{value}</div>
      {hint && <div className="mt-1 text-xs text-slate-500">{hint}</div>}
    </div>
  );
  return href ? <Link to={href}>{body}</Link> : body;
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

type SavedView = { id: string; name: string; agentFilter: string; range: string };
const VIEWS_KEY = "crm.dashboard.views.v1";

export default function CrmDashboard() {
  const [deals, setDeals] = useState<DealMini[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [agentFilter, setAgentFilter] = useState<string>("all");
  const [range, setRange] = useState<(typeof RANGES)[number]["id"]>("all");
  const [views, setViews] = useState<SavedView[]>(() => {
    try { return JSON.parse(localStorage.getItem(VIEWS_KEY) || "[]"); } catch { return []; }
  });
  const [activeViewId, setActiveViewId] = useState<string>("");

  const persistViews = (next: SavedView[]) => {
    setViews(next);
    localStorage.setItem(VIEWS_KEY, JSON.stringify(next));
  };
  const saveCurrentView = () => {
    const name = prompt("Nom de la vue ?");
    if (!name) return;
    const v: SavedView = { id: crypto.randomUUID(), name, agentFilter, range };
    persistViews([...views, v]);
    setActiveViewId(v.id);
  };
  const applyView = (id: string) => {
    const v = views.find((x) => x.id === id);
    if (!v) return;
    setAgentFilter(v.agentFilter);
    setRange(v.range as any);
    setActiveViewId(id);
  };
  const deleteView = (id: string) => {
    persistViews(views.filter((v) => v.id !== id));
    if (activeViewId === id) setActiveViewId("");
  };

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
        <div className="flex flex-wrap gap-2">
          {views.length > 0 && (
            <div className="flex items-center gap-1 rounded-full border border-[#E9D5FF] bg-white pl-2">
              <select
                value={activeViewId}
                onChange={(e) => applyView(e.target.value)}
                className="h-9 rounded-full bg-transparent px-2 text-sm"
              >
                <option value="">Vue sauvegardée…</option>
                {views.map((v) => (
                  <option key={v.id} value={v.id}>{v.name}</option>
                ))}
              </select>
              {activeViewId && (
                <button
                  onClick={() => deleteView(activeViewId)}
                  className="mr-1 rounded-full p-1.5 hover:bg-red-50"
                  title="Supprimer cette vue"
                >
                  <Trash2 className="h-3.5 w-3.5 text-red-600" />
                </button>
              )}
            </div>
          )}
          <button
            onClick={saveCurrentView}
            className="inline-flex h-9 items-center gap-1.5 rounded-full border border-[#E9D5FF] bg-white px-3 text-sm text-[#7C3AED] hover:bg-[#F5F3FF]"
          >
            <Save className="h-3.5 w-3.5" /> Sauvegarder la vue
          </button>
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
        <Kpi
          icon={Users}
          label="Deals actifs"
          value={String(stats.active)}
          hint={`${stats.total} au total · voir le pipeline`}
          href={`/admin${agentFilter !== "all" ? `?agent=${agentFilter}` : ""}`}
        />
        <Kpi
          icon={Target}
          label="Taux de conversion"
          value={`${stats.conversionRate.toFixed(1)}%`}
          hint={`${stats.won} gagnés · ${stats.lost} perdus`}
          href="/admin?stage=won"
        />
        <Kpi
          icon={TrendingUp}
          label="Pipeline (est.)"
          value={fmtEur(stats.pipelineCa)}
          href="/admin?stage=quote_sent"
        />
        <Kpi
          icon={Euro}
          label="CA signé"
          value={fmtEur(stats.wonCa)}
          href="/admin/finance"
        />
      </div>

      {/* Tâches du jour */}
      <div className="mt-6 rounded-3xl border border-[#E9D5FF] bg-white p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckSquare className="h-5 w-5 text-[#7C3AED]" />
            <h2 className="text-sm font-semibold text-slate-800">
              Tâches du jour {agentFilter === "all" ? "(équipe)" : ""}
            </h2>
          </div>
          <Link to="/admin" className="text-xs font-medium text-[#7C3AED] hover:underline">
            Ouvrir le pipeline →
          </Link>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {dailyTasks.map((task) => {
            const stageLink =
              task.id === "new" ? "/admin?stage=lead"
              : task.id === "follow" ? "/admin?stage=qualified"
              : task.id === "incomplete" ? "/admin?stage=incomplete"
              : "/admin?stage=subscription";
            return (
              <div key={task.id} className="rounded-2xl border border-slate-100 bg-[#FAFAFF] p-4">
                <div className="flex items-center justify-between">
                  <Link to={stageLink} className="flex items-center gap-2 hover:opacity-80">
                    <div className={`rounded-xl p-1.5 ${task.color}`}>
                      <task.icon className="h-4 w-4" />
                    </div>
                    <div className="text-sm font-medium text-slate-800">{task.title}</div>
                  </Link>
                  <span className="rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-slate-700 shadow-sm">
                    {task.items.length}
                  </span>
                </div>
                <p className="mt-2 text-xs text-slate-500">{task.hint}</p>
                {task.items.length > 0 && (
                  <ul className="mt-2 space-y-1.5">
                    {task.items.slice(0, 3).map((d) => (
                      <li key={d.id} className="flex items-center gap-2 text-xs text-slate-600">
                        <Link to={stageLink} className="flex-1 truncate hover:text-[#7C3AED]">
                          • {d.contacts?.full_name || d.contacts?.email} — {d.insurance_type}
                        </Link>
                        <select
                          value={d.assigned_to ?? ""}
                          onChange={async (e) => {
                            const val = e.target.value || null;
                            const { error } = await supabase
                              .from("deals")
                              .update({ assigned_to: val })
                              .eq("id", d.id);
                            if (error) return toast.error("Assignation impossible");
                            setDeals((ds) => ds.map((x) => (x.id === d.id ? { ...x, assigned_to: val } : x)));
                            toast.success(val ? "Deal assigné" : "Assignation retirée");
                          }}
                          className="max-w-[110px] shrink-0 truncate rounded-full border border-[#E9D5FF] bg-white px-2 py-0.5 text-[10px] text-slate-600 focus:outline-none focus:ring-1 focus:ring-[#7C3AED]"
                        >
                          <option value="">Assigner…</option>
                          {agents.filter((a) => a.user_id).map((a) => (
                            <option key={a.id} value={a.user_id!}>{a.full_name}</option>
                          ))}
                        </select>
                      </li>
                    ))}
                    {task.items.length > 3 && (
                      <li className="pt-0.5">
                        <Link to={stageLink} className="text-xs text-[#7C3AED] hover:underline">
                          +{task.items.length - 3} de plus →
                        </Link>
                      </li>
                    )}
                  </ul>
                )}
              </div>
            );
          })}
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
