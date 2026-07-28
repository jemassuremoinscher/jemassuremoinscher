import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Shield, Download, Trash2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Row = {
  id: string;
  email: string;
  full_name: string | null;
  rgpd_consent: boolean;
  source: string | null;
  created_at: string;
};

export default function RgpdPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const { data } = await supabase
      .from("contacts")
      .select("id,email,full_name,rgpd_consent,source,created_at")
      .order("created_at", { ascending: false })
      .limit(2000);
    setRows((data ?? []) as Row[]);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return rows;
    return rows.filter(
      (r) =>
        r.email?.toLowerCase().includes(s) ||
        r.full_name?.toLowerCase().includes(s)
    );
  }, [rows, q]);

  const stats = useMemo(
    () => ({
      total: rows.length,
      withConsent: rows.filter((r) => r.rgpd_consent).length,
      withoutConsent: rows.filter((r) => !r.rgpd_consent).length,
    }),
    [rows]
  );

  const exportData = async (email: string) => {
    const { data: contact } = await supabase
      .from("contacts")
      .select("*, deals(*), documents:deals(documents(*))")
      .eq("email", email)
      .maybeSingle();
    const blob = new Blob([JSON.stringify(contact, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `rgpd-${email}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Export téléchargé");
  };

  const forget = async (id: string, email: string) => {
    if (!confirm(`Supprimer définitivement toutes les données de ${email} ?`))
      return;
    const { error } = await supabase.from("contacts").delete().eq("id", id);
    if (error) return toast.error("Erreur");
    toast.success("Données supprimées");
    load();
  };

  return (
    <div className="flex flex-1 flex-col overflow-y-auto px-6 py-6">
      <div className="flex items-start gap-3">
        <div className="rounded-2xl bg-[#F5F3FF] dark:bg-[#262140] p-2.5">
          <Shield className="h-5 w-5 text-[#7C3AED] dark:text-[#C4B5FD]" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
            RGPD & Conformité
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Droit d'accès et droit à l'oubli des contacts
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-3xl border border-[#E9D5FF] dark:border-[#362B54] bg-white dark:bg-[#1E1B2E] p-5">
          <div className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Total contacts
          </div>
          <div className="mt-2 text-2xl font-semibold">{stats.total}</div>
        </div>
        <div className="rounded-3xl border border-emerald-200 bg-white dark:bg-[#1E1B2E] p-5">
          <div className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Consentement RGPD
          </div>
          <div className="mt-2 text-2xl font-semibold text-emerald-700">
            {stats.withConsent}
          </div>
        </div>
        <div className="rounded-3xl border border-amber-200 bg-white dark:bg-[#1E1B2E] p-5">
          <div className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Sans consentement
          </div>
          <div className="mt-2 text-2xl font-semibold text-amber-700">
            {stats.withoutConsent}
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center gap-2">
        <div className="relative flex-1 max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Rechercher un email ou un nom"
            className="rounded-full pl-9"
          />
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-3xl border border-[#E9D5FF] dark:border-[#362B54] bg-white dark:bg-[#1E1B2E]">
        <table className="w-full text-sm">
          <thead className="bg-[#FAF5FF] dark:bg-[#13111C] text-left text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
            <tr>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3">Source</th>
              <th className="px-4 py-3">Consentement</th>
              <th className="px-4 py-3">Créé</th>
              <th className="px-4 py-3 text-right">Actions RGPD</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-[#362B54]">
            {filtered.slice(0, 200).map((r) => (
              <tr key={r.id} className="hover:bg-[#FAF5FF]/60 dark:hover:bg-[#262140]/60">
                <td className="px-4 py-3">
                  <div className="font-medium text-slate-900 dark:text-slate-50">
                    {r.full_name || "—"}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">{r.email}</div>
                </td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{r.source ?? "—"}</td>
                <td className="px-4 py-3">
                  {r.rgpd_consent ? (
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs text-emerald-700">
                      Oui
                    </span>
                  ) : (
                    <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs text-amber-700">
                      Non
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-xs text-slate-500 dark:text-slate-400">
                  {new Date(r.created_at).toLocaleDateString("fr-FR")}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => exportData(r.email)}
                      className="rounded-full"
                    >
                      <Download className="mr-1 h-3.5 w-3.5" />
                      Export
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => forget(r.id, r.email)}
                      className="rounded-full border-red-200 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
                    >
                      <Trash2 className="mr-1 h-3.5 w-3.5" />
                      Oublier
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-slate-500 dark:text-slate-400">
                  Aucun contact
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {filtered.length > 200 && (
          <div className="border-t border-slate-100 dark:border-[#362B54] px-4 py-2 text-center text-xs text-slate-500 dark:text-slate-400">
            200 premiers affichés sur {filtered.length} — affinez votre recherche
          </div>
        )}
      </div>
    </div>
  );
}
