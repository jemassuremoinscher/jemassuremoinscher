import { useEffect, useMemo, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Bell, CheckCheck, Download, Search, Trash2 } from "lucide-react";
import { NOTIF_TYPES } from "@/lib/notificationPrefs";
import { exportToCSV } from "@/utils/exportCSV";
import { toast } from "sonner";

interface Row {
  id: string;
  user_id: string;
  type: string;
  entity_type: string | null;
  entity_id: string | null;
  title: string;
  body: string | null;
  url: string | null;
  read_at: string | null;
  created_at: string;
}

export default function NotificationsCenter() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [showRead, setShowRead] = useState<"all" | "unread">("all");

  const load = useCallback(async () => {
    setLoading(true);
    let q = supabase.from("notification_log").select("*").order("created_at", { ascending: false }).limit(500);
    if (!isAdmin && user?.id) q = q.eq("user_id", user.id);
    const { data, error } = await q;
    if (error) toast.error("Impossible de charger les notifications");
    setRows((data as Row[]) ?? []);
    setLoading(false);
  }, [isAdmin, user?.id]);

  useEffect(() => {
    load();
    const onChange = () => load();
    window.addEventListener("notif-log-changed", onChange);
    const channel = supabase
      .channel("notif-log-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "notification_log" }, () => load())
      .subscribe();
    return () => {
      window.removeEventListener("notif-log-changed", onChange);
      supabase.removeChannel(channel);
    };
  }, [load]);

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (showRead === "unread" && r.read_at) return false;
      if (typeFilter !== "all" && r.type !== typeFilter) return false;
      if (search) {
        const s = search.toLowerCase();
        if (
          !r.title.toLowerCase().includes(s) &&
          !(r.body ?? "").toLowerCase().includes(s) &&
          !r.type.toLowerCase().includes(s)
        )
          return false;
      }
      return true;
    });
  }, [rows, search, typeFilter, showRead]);

  const unreadCount = rows.filter((r) => !r.read_at).length;

  const markRead = async (id: string) => {
    await supabase.from("notification_log").update({ read_at: new Date().toISOString() }).eq("id", id);
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, read_at: new Date().toISOString() } : r)));
  };

  const markAllRead = async () => {
    const ids = rows.filter((r) => !r.read_at).map((r) => r.id);
    if (!ids.length) return;
    await supabase.from("notification_log").update({ read_at: new Date().toISOString() }).in("id", ids);
    load();
    toast.success(`${ids.length} notification(s) marquée(s) comme lues`);
  };

  const remove = async (id: string) => {
    await supabase.from("notification_log").delete().eq("id", id);
    setRows((prev) => prev.filter((r) => r.id !== id));
  };

  const handleClick = (r: Row) => {
    if (!r.read_at) markRead(r.id);
    if (r.url) navigate(r.url);
  };

  const doExport = () => {
    exportToCSV(
      filtered.map((r) => ({
        Date: new Date(r.created_at).toLocaleString("fr-FR"),
        Type: r.type,
        Entité: r.entity_type ?? "",
        "Entité ID": r.entity_id ?? "",
        Titre: r.title,
        Message: r.body ?? "",
        URL: r.url ?? "",
        "Lue le": r.read_at ? new Date(r.read_at).toLocaleString("fr-FR") : "",
      })),
      "notifications",
    );
  };

  return (
    <div className="mx-auto max-w-5xl space-y-4 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-900">
            <Bell className="h-6 w-6 text-[#7C3AED]" /> Centre de notifications
          </h1>
          <p className="text-sm text-slate-500">
            {rows.length} notification(s) • {unreadCount} non lue(s)
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={markAllRead}
            disabled={!unreadCount}
            className="inline-flex items-center gap-2 rounded-full border border-[#E9D5FF] px-4 py-2 text-sm text-slate-700 hover:bg-[#FAF5FF] disabled:opacity-50"
          >
            <CheckCheck className="h-4 w-4" /> Tout marquer lu
          </button>
          <button
            type="button"
            onClick={doExport}
            className="inline-flex items-center gap-2 rounded-full bg-[#7C3AED] px-4 py-2 text-sm text-white hover:bg-[#6D28D9]"
          >
            <Download className="h-4 w-4" /> Export CSV
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 rounded-3xl border border-[#E9D5FF] bg-white p-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher…"
            className="w-full rounded-full border border-[#E9D5FF] bg-[#FAF5FF]/40 py-2 pl-9 pr-3 text-sm"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="rounded-full border border-[#E9D5FF] bg-white px-3 py-2 text-sm"
        >
          <option value="all">Tous les types</option>
          {Object.entries(NOTIF_TYPES).map(([k, v]) => (
            <option key={k} value={k}>
              {v.label}
            </option>
          ))}
        </select>
        <select
          value={showRead}
          onChange={(e) => setShowRead(e.target.value as any)}
          className="rounded-full border border-[#E9D5FF] bg-white px-3 py-2 text-sm"
        >
          <option value="all">Toutes</option>
          <option value="unread">Non lues</option>
        </select>
      </div>

      <div className="rounded-3xl border border-[#E9D5FF] bg-white">
        {loading ? (
          <div className="p-8 text-center text-sm text-slate-500">Chargement…</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-500">Aucune notification.</div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {filtered.map((r) => (
              <li
                key={r.id}
                className={`flex items-start gap-3 p-4 transition ${
                  r.read_at ? "bg-white" : "bg-[#FAF5FF]/60"
                }`}
              >
                <div className={`mt-1 h-2 w-2 shrink-0 rounded-full ${r.read_at ? "bg-slate-300" : "bg-[#7C3AED]"}`} />
                <button
                  type="button"
                  onClick={() => handleClick(r)}
                  className="flex-1 text-left"
                >
                  <div className="text-sm font-semibold text-slate-800">{r.title}</div>
                  {r.body && <div className="text-xs text-slate-600">{r.body}</div>}
                  <div className="mt-1 text-[11px] uppercase tracking-wide text-slate-400">
                    {new Date(r.created_at).toLocaleString("fr-FR")} · {r.type}
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => remove(r.id)}
                  className="rounded-full p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
                  aria-label="Supprimer"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
