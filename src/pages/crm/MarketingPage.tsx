import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Mail, Newspaper, TrendingUp, Users } from "lucide-react";
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

function Kpi({ icon: Icon, label, value, hint }: any) {
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

const PIE = ["#7C3AED", "#4F46E5", "#0891B2", "#D97706", "#16A34A", "#DC2626", "#64748B", "#A78BFA"];

export default function MarketingPage() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [subs, setSubs] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [c, n, p] = await Promise.all([
        supabase.from("contacts").select("source,created_at").limit(5000),
        supabase.from("newsletter_subscribers").select("status,source,created_at").limit(5000),
        supabase.from("linkedin_auto_posts").select("status,posted_at").limit(1000),
      ]);
      setContacts(c.data ?? []);
      setSubs(n.data ?? []);
      setPosts(p.data ?? []);
      setLoading(false);
    })();
  }, []);

  const bySource = useMemo(() => {
    const map = new Map<string, number>();
    contacts.forEach((c) => {
      const s = c.source ?? "inconnu";
      map.set(s, (map.get(s) ?? 0) + 1);
    });
    return Array.from(map, ([name, value]) => ({ name, value })).sort(
      (a, b) => b.value - a.value
    );
  }, [contacts]);

  const perMonth = useMemo(() => {
    const map = new Map<string, number>();
    contacts.forEach((c) => {
      const m = new Date(c.created_at).toISOString().slice(0, 7);
      map.set(m, (map.get(m) ?? 0) + 1);
    });
    return Array.from(map, ([month, leads]) => ({ month, leads })).sort((a, b) =>
      a.month.localeCompare(b.month)
    );
  }, [contacts]);

  const subStats = useMemo(() => {
    const confirmed = subs.filter((s) => s.status === "confirmed").length;
    const pending = subs.filter((s) => s.status === "pending").length;
    return { total: subs.length, confirmed, pending };
  }, [subs]);

  const postStats = useMemo(() => {
    const posted = posts.filter((p) => p.status === "posted").length;
    const failed = posts.filter((p) => p.status === "failed").length;
    return { total: posts.length, posted, failed };
  }, [posts]);

  return (
    <div className="flex flex-1 flex-col overflow-y-auto px-6 py-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Marketing & Acquisition
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          {loading ? "Chargement…" : `${contacts.length} leads · ${subs.length} abonnés newsletter`}
        </p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi icon={Users} label="Total leads" value={String(contacts.length)} />
        <Kpi
          icon={Mail}
          label="Newsletter confirmés"
          value={String(subStats.confirmed)}
          hint={`${subStats.pending} en attente`}
        />
        <Kpi
          icon={Newspaper}
          label="Posts LinkedIn"
          value={String(postStats.posted)}
          hint={postStats.failed ? `${postStats.failed} échec(s)` : "0 échec"}
        />
        <Kpi
          icon={TrendingUp}
          label="Sources actives"
          value={String(bySource.length)}
        />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-3xl border border-[#E9D5FF] bg-white p-5">
          <h3 className="text-sm font-semibold text-slate-800">
            Répartition des sources
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
                >
                  {bySource.map((_, i) => (
                    <Cell key={i} fill={PIE[i % PIE.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-3xl border border-[#E9D5FF] bg-white p-5">
          <h3 className="text-sm font-semibold text-slate-800">
            Leads acquis par mois
          </h3>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={perMonth}>
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="leads" fill="#7C3AED" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
