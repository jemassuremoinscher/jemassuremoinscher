import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import {
  Mail, Newspaper, Users, FileText, Linkedin, Facebook, BarChart3,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import { GoogleAnalyticsDashboard } from "@/components/admin/GoogleAnalyticsDashboard";
import { GoogleAdsDashboard } from "@/components/admin/GoogleAdsDashboard";
import SERPPreview from "@/components/admin/SERPPreview";

function Kpi({ icon: Icon, label, value, hint, to }: any) {
  const body = (
    <div className="group h-full rounded-3xl border border-[#E9D5FF] bg-white p-5 transition hover:border-[#C4B5FD] hover:shadow-md">
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
  return to ? <Link to={to}>{body}</Link> : body;
}

const PIE = ["#7C3AED", "#4F46E5", "#0891B2", "#D97706", "#16A34A", "#DC2626", "#64748B", "#A78BFA"];

type Tab = "overview" | "ga4" | "ads" | "content" | "serp";

const SERP_KEY = "crm.marketing.serp.v1";
const DEFAULT_SERP = [
  "assurance auto",
  "assurance moto",
  "assurance habitation",
  "mutuelle santé",
  "assurance emprunteur",
  "assurance trottinette électrique",
];

export default function MarketingPage() {
  const [tab, setTab] = useState<Tab>("overview");
  const [contacts, setContacts] = useState<any[]>([]);
  const [subs, setSubs] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [c, n, p, a] = await Promise.all([
        supabase.from("contacts").select("source,created_at").limit(5000),
        supabase.from("newsletter_subscribers").select("status,source,created_at").limit(5000),
        supabase.from("linkedin_auto_posts")
          .select("status,linkedin_status,facebook_status,article_title,article_url,posted_at")
          .order("posted_at", { ascending: false, nullsFirst: false })
          .limit(1000),
        supabase.from("seo_article_suggestions")
          .select("title,slug,status,quality_score,published_at,created_at")
          .order("created_at", { ascending: false })
          .limit(500),
      ]);
      setContacts(c.data ?? []);
      setSubs(n.data ?? []);
      setPosts(p.data ?? []);
      setArticles(a.data ?? []);
      setLoading(false);
    })();
  }, []);

  const bySource = useMemo(() => {
    const map = new Map<string, number>();
    contacts.forEach((c) => {
      const s = c.source ?? "inconnu";
      map.set(s, (map.get(s) ?? 0) + 1);
    });
    return Array.from(map, ([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [contacts]);

  const perMonth = useMemo(() => {
    const map = new Map<string, number>();
    contacts.forEach((c) => {
      const m = new Date(c.created_at).toISOString().slice(0, 7);
      map.set(m, (map.get(m) ?? 0) + 1);
    });
    return Array.from(map, ([month, leads]) => ({ month, leads })).sort((a, b) => a.month.localeCompare(b.month));
  }, [contacts]);

  const subStats = useMemo(() => {
    const confirmed = subs.filter((s) => s.status === "confirmed").length;
    const pending = subs.filter((s) => s.status === "pending").length;
    return { total: subs.length, confirmed, pending };
  }, [subs]);

  const postStats = useMemo(() => {
    const posted = posts.filter((p) => p.status === "posted").length;
    const failed = posts.filter((p) => p.status === "failed").length;
    const linkedin = posts.filter((p) => p.linkedin_status === "posted").length;
    const facebook = posts.filter((p) => p.facebook_status === "posted").length;
    return { total: posts.length, posted, failed, linkedin, facebook };
  }, [posts]);

  const articleStats = useMemo(() => {
    const approved = articles.filter((a) => a.status === "approved").length;
    const drafts = articles.filter((a) => a.status === "draft").length;
    const avgScore = articles.length
      ? Math.round(articles.reduce((s, a) => s + (a.quality_score || 0), 0) / articles.length)
      : 0;
    return { total: articles.length, approved, drafts, avgScore };
  }, [articles]);

  const lastPosts = posts.slice(0, 8);
  const lastArticles = articles.filter((a) => a.status === "approved").slice(0, 8);

  const [serpKeywords, setSerpKeywords] = useState<string[]>(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(SERP_KEY) || "null");
      return Array.isArray(stored) && stored.length ? stored : DEFAULT_SERP;
    } catch { return DEFAULT_SERP; }
  });
  const [serpInput, setSerpInput] = useState("");
  const saveSerp = (next: string[]) => {
    setSerpKeywords(next);
    localStorage.setItem(SERP_KEY, JSON.stringify(next));
  };

  const TABS: { id: Tab; label: string }[] = [
    { id: "overview", label: "Vue d'ensemble" },
    { id: "ga4", label: "Google Analytics" },
    { id: "ads", label: "Google Ads" },
    { id: "serp", label: "SERP" },
    { id: "content", label: "Contenu & Social" },
  ];

  return (
    <div className="flex flex-1 flex-col overflow-y-auto px-6 py-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Marketing & Acquisition</h1>
          <p className="mt-1 text-sm text-slate-500">
            {loading ? "Chargement…" : `${contacts.length} leads · ${subs.length} abonnés · ${articleStats.approved} articles publiés`}
          </p>
        </div>
        <div className="flex gap-2 text-xs">
          <Link to="/admin" className="rounded-full border border-[#E9D5FF] bg-white px-3 py-1.5 text-[#7C3AED] hover:bg-[#F5F3FF]">
            → Pipeline
          </Link>
          <Link to="/admin/dashboard" className="rounded-full border border-[#E9D5FF] bg-white px-3 py-1.5 text-[#7C3AED] hover:bg-[#F5F3FF]">
            → Dashboard
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-5 flex gap-1 rounded-full border border-[#E9D5FF] bg-white p-1 self-start">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`rounded-full px-4 py-1.5 text-xs font-medium transition ${
              tab === t.id ? "bg-[#7C3AED] text-white" : "text-slate-600 hover:bg-[#F5F3FF]"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Kpi icon={Users} label="Total leads" value={String(contacts.length)} to="/admin/contacts" />
            <Kpi icon={Mail} label="Newsletter confirmés" value={String(subStats.confirmed)} hint={`${subStats.pending} en attente`} />
            <Kpi icon={Newspaper} label="Posts sociaux" value={String(postStats.posted)} hint={`LinkedIn ${postStats.linkedin} · Facebook ${postStats.facebook}`} />
            <Kpi icon={FileText} label="Articles SEO" value={String(articleStats.approved)} hint={`${articleStats.drafts} brouillons · qualité moy. ${articleStats.avgScore}`} />
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <div className="rounded-3xl border border-[#E9D5FF] bg-white p-5">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-800">Répartition des sources</h3>
                <Link to="/admin" className="text-xs text-[#7C3AED] hover:underline">Voir dans le pipeline →</Link>
              </div>
              <div className="mt-4 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={bySource} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
                      {bySource.map((_, i) => <Cell key={i} fill={PIE[i % PIE.length]} />)}
                    </Pie>
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="rounded-3xl border border-[#E9D5FF] bg-white p-5">
              <h3 className="text-sm font-semibold text-slate-800">Leads par mois</h3>
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

          <div className="mt-6 rounded-3xl border border-[#E9D5FF] bg-gradient-to-br from-white to-[#F5F3FF] p-5">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-[#7C3AED]" />
              <span className="text-sm font-medium text-slate-700">
                Passe sur les onglets pour voir en direct <strong>Google Analytics</strong> et <strong>Google Ads</strong>, ou l'onglet <strong>Contenu &amp; Social</strong> pour les articles SEO et les posts LinkedIn/Facebook.
              </span>
            </div>
          </div>
        </>
      )}

      {tab === "ga4" && (
        <div className="mt-6">
          <GoogleAnalyticsDashboard />
        </div>
      )}

      {tab === "ads" && (
        <div className="mt-6">
          <GoogleAdsDashboard />
        </div>
      )}

      {tab === "serp" && (
        <div className="mt-6 space-y-4">
          <div className="rounded-3xl border border-[#E9D5FF] bg-white p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold text-slate-800">SERP tracker</h3>
                <p className="mt-1 text-xs text-slate-500">
                  Mots-clés suivis pour surveiller vos positions Google et la concurrence. Ouvre la SERP live ou l'analyse Semrush en un clic.
                </p>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const k = serpInput.trim().toLowerCase();
                  if (!k || serpKeywords.includes(k)) return;
                  saveSerp([...serpKeywords, k]);
                  setSerpInput("");
                }}
                className="flex items-center gap-2"
              >
                <input
                  value={serpInput}
                  onChange={(e) => setSerpInput(e.target.value)}
                  placeholder="Ajouter un mot-clé…"
                  className="h-9 w-64 rounded-full border border-[#E9D5FF] bg-white px-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#7C3AED]"
                />
                <button className="h-9 rounded-full bg-[#7C3AED] px-3 text-xs font-medium text-white hover:bg-[#6D28D9]">
                  Ajouter
                </button>
              </form>
            </div>
            <div className="mt-4 overflow-hidden rounded-2xl border border-slate-100">
              <table className="w-full text-sm">
                <thead className="bg-[#FAFAFF] text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="py-2 px-3 text-left font-medium">Mot-clé</th>
                    <th className="py-2 px-3 text-left font-medium">Actions</th>
                    <th className="py-2 px-3 text-right font-medium">Retirer</th>
                  </tr>
                </thead>
                <tbody>
                  {serpKeywords.map((kw) => {
                    const q = encodeURIComponent(kw);
                    return (
                      <tr key={kw} className="border-t border-slate-100 hover:bg-[#FAFAFF]">
                        <td className="py-2 px-3 font-medium text-slate-800">{kw}</td>
                        <td className="py-2 px-3">
                          <div className="flex flex-wrap gap-2 text-xs">
                            <a
                              href={`https://www.google.fr/search?q=${q}&gl=fr&hl=fr`}
                              target="_blank" rel="noopener noreferrer"
                              className="rounded-full border border-[#E9D5FF] px-3 py-1 text-[#7C3AED] hover:bg-[#F5F3FF]"
                            >Google SERP ↗</a>
                            <a
                              href={`https://www.semrush.com/analytics/keywordoverview/?q=${q}&db=fr`}
                              target="_blank" rel="noopener noreferrer"
                              className="rounded-full border border-[#E9D5FF] px-3 py-1 text-[#7C3AED] hover:bg-[#F5F3FF]"
                            >Semrush ↗</a>
                            <a
                              href={`https://search.google.com/search-console/performance/search-analytics?resource_id=sc-domain%3Ajemassuremoinscher.fr&query=${q}`}
                              target="_blank" rel="noopener noreferrer"
                              className="rounded-full border border-[#E9D5FF] px-3 py-1 text-[#7C3AED] hover:bg-[#F5F3FF]"
                            >Search Console ↗</a>
                          </div>
                        </td>
                        <td className="py-2 px-3 text-right">
                          <button
                            onClick={() => saveSerp(serpKeywords.filter((k) => k !== kw))}
                            className="rounded-full p-1 text-slate-400 hover:bg-red-50 hover:text-red-600"
                            title="Retirer"
                          >✕</button>
                        </td>
                      </tr>
                    );
                  })}
                  {serpKeywords.length === 0 && (
                    <tr><td colSpan={3} className="py-6 text-center text-xs text-slate-500">Aucun mot-clé suivi.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-3xl border border-[#E9D5FF] bg-gradient-to-br from-[#F5F3FF] to-white p-5 text-sm text-slate-700">
            <p className="font-medium text-slate-800">Positions Google en temps réel dans le CRM ?</p>
            <p className="mt-1 text-xs text-slate-600">
              Semrush (service SEO intégré à la plateforme) peut brancher les positions, la difficulté et les concurrents directement dans cette page —
              tracking quotidien, alertes, historique long, données paid-search. Dis-le-moi si tu veux qu'on connecte ton compte Semrush pour l'activer.
            </p>
          </div>
        </div>
      )}

      {tab === "content" && (
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <div className="rounded-3xl border border-[#E9D5FF] bg-white p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-800">Derniers articles SEO/GEO</h3>
              <a href="/blog" target="_blank" rel="noopener noreferrer" className="text-xs text-[#7C3AED] hover:underline">
                Voir le blog →
              </a>
            </div>
            <ul className="mt-3 divide-y divide-slate-100">
              {lastArticles.map((a) => (
                <li key={a.slug} className="flex items-center justify-between py-2 text-sm">
                  <a
                    href={`/blog/${a.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="line-clamp-1 flex-1 pr-2 text-slate-800 hover:text-[#7C3AED]"
                  >
                    {a.title}
                  </a>
                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                    {a.quality_score ?? "-"}/100
                  </span>
                </li>
              ))}
              {lastArticles.length === 0 && (
                <li className="py-4 text-center text-xs text-slate-500">Aucun article publié</li>
              )}
            </ul>
          </div>

          <div className="rounded-3xl border border-[#E9D5FF] bg-white p-5">
            <h3 className="text-sm font-semibold text-slate-800">Derniers posts sociaux</h3>
            <ul className="mt-3 divide-y divide-slate-100">
              {lastPosts.map((p, i) => (
                <li key={i} className="flex items-center justify-between py-2 text-sm">
                  <a
                    href={p.article_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="line-clamp-1 flex-1 pr-2 text-slate-800 hover:text-[#7C3AED]"
                  >
                    {p.article_title}
                  </a>
                  <div className="flex items-center gap-1">
                    {p.linkedin_status === "posted" && <Linkedin className="h-3.5 w-3.5 text-[#0A66C2]" />}
                    {p.facebook_status === "posted" && <Facebook className="h-3.5 w-3.5 text-[#1877F2]" />}
                    {p.status === "failed" && <span className="text-xs text-red-600">échec</span>}
                  </div>
                </li>
              ))}
              {lastPosts.length === 0 && (
                <li className="py-4 text-center text-xs text-slate-500">Aucun post</li>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
