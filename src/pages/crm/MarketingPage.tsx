import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import {
  Mail, Newspaper, TrendingUp, Users, BarChart3, Search,
  Linkedin, Facebook, FileText, ExternalLink,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
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

function ChannelCard({
  icon: Icon,
  title,
  desc,
  href,
  external,
  stats,
  color,
}: {
  icon: any;
  title: string;
  desc: string;
  href: string;
  external?: boolean;
  stats?: string;
  color: string;
}) {
  const inner = (
    <div className="group h-full rounded-3xl border border-[#E9D5FF] bg-white p-5 transition hover:border-[#7C3AED] hover:shadow-md">
      <div className="flex items-center justify-between">
        <div className={`grid h-10 w-10 place-items-center rounded-2xl ${color}`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
        <ExternalLink className="h-4 w-4 text-slate-400 opacity-0 transition group-hover:opacity-100" />
      </div>
      <div className="mt-3 text-sm font-semibold text-slate-900">{title}</div>
      <div className="mt-1 text-xs text-slate-500">{desc}</div>
      {stats && <div className="mt-2 text-xs font-medium text-[#7C3AED]">{stats}</div>}
    </div>
  );
  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer">{inner}</a>
  ) : (
    <Link to={href}>{inner}</Link>
  );
}

const PIE = ["#7C3AED", "#4F46E5", "#0891B2", "#D97706", "#16A34A", "#DC2626", "#64748B", "#A78BFA"];

export default function MarketingPage() {
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
    const linkedin = posts.filter((p) => p.linkedin_status === "posted").length;
    const facebook = posts.filter((p) => p.facebook_status === "posted").length;
    return { total: posts.length, posted, failed, linkedin, facebook };
  }, [posts]);

  const articleStats = useMemo(() => {
    const approved = articles.filter((a) => a.status === "approved").length;
    const drafts = articles.filter((a) => a.status === "draft").length;
    const avgScore = articles.length
      ? Math.round(
          articles.reduce((s, a) => s + (a.quality_score || 0), 0) / articles.length
        )
      : 0;
    return { total: articles.length, approved, drafts, avgScore };
  }, [articles]);

  const lastPosts = posts.slice(0, 5);
  const lastArticles = articles.filter((a) => a.status === "approved").slice(0, 5);

  return (
    <div className="flex flex-1 flex-col overflow-y-auto px-6 py-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Marketing & Acquisition
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          {loading ? "Chargement…" : `${contacts.length} leads · ${subs.length} abonnés · ${articleStats.approved} articles publiés`}
        </p>
      </div>

      {/* Canaux externes */}
      <div className="mt-6">
        <h2 className="text-sm font-semibold text-slate-800">Canaux & Analytics</h2>
        <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          <ChannelCard
            icon={BarChart3}
            title="Google Analytics 4"
            desc="Trafic, conversions, funnels"
            href="https://analytics.google.com/"
            external
            color="bg-orange-500"
            stats="Voir GA4 →"
          />
          <ChannelCard
            icon={Search}
            title="Search Console"
            desc="Positions Google, indexation"
            href="https://search.google.com/search-console"
            external
            color="bg-blue-600"
            stats="Voir GSC →"
          />
          <ChannelCard
            icon={Facebook}
            title="Meta Ads"
            desc="Facebook · Instagram"
            href="https://business.facebook.com/"
            external
            color="bg-[#1877F2]"
            stats="Meta Business →"
          />
          <ChannelCard
            icon={Linkedin}
            title="LinkedIn"
            desc={`${postStats.linkedin} posts publiés`}
            href="https://www.linkedin.com/company/jemassuremoinscher"
            external
            color="bg-[#0A66C2]"
            stats={postStats.failed ? `${postStats.failed} échec(s)` : "Automatisé"}
          />
          <ChannelCard
            icon={TrendingUp}
            title="Ancien dashboard"
            desc="Google Ads · GA4 détaillé"
            href="/admin/legacy"
            color="bg-[#7C3AED]"
            stats="Ouvrir →"
          />
        </div>
      </div>

      {/* KPIs */}
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
          label="Posts sociaux"
          value={String(postStats.posted)}
          hint={`LinkedIn ${postStats.linkedin} · Facebook ${postStats.facebook}`}
        />
        <Kpi
          icon={FileText}
          label="Articles SEO"
          value={String(articleStats.approved)}
          hint={`${articleStats.drafts} brouillons · qualité moy. ${articleStats.avgScore}`}
        />
      </div>

      {/* Charts */}
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-3xl border border-[#E9D5FF] bg-white p-5">
          <h3 className="text-sm font-semibold text-slate-800">Répartition des sources</h3>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={bySource} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
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

      {/* Contenu SEO + Social */}
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
                <div className="flex gap-1">
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
    </div>
  );
}
