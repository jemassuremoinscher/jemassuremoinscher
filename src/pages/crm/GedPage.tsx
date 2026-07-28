import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useOutletContext } from "react-router-dom";
import { toast } from "sonner";
import { FileText, Download, Trash2, ExternalLink } from "lucide-react";

type Ctx = { query: string };

type DocRow = {
  id: string;
  name: string;
  file_path: string | null;
  drive_url: string | null;
  uploaded_at: string | null;
  deal_id: string;
  deals?: {
    insurance_type: string;
    contacts?: { full_name: string | null; email: string } | null;
  } | null;
};

export default function GedPage() {
  const { query } = useOutletContext<Ctx>();
  const [docs, setDocs] = useState<DocRow[]>([]);
  const [clientFilter, setClientFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const { data } = await supabase
      .from("documents")
      .select(
        "id,name,file_path,drive_url,uploaded_at,deal_id,deals(insurance_type,contacts(full_name,email))"
      )
      .order("uploaded_at", { ascending: false, nullsFirst: false })
      .limit(1000);
    setDocs((data ?? []) as unknown as DocRow[]);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const clients = useMemo(() => {
    const map = new Map<string, string>();
    docs.forEach((d) => {
      const email = d.deals?.contacts?.email;
      if (!email) return;
      const label = d.deals?.contacts?.full_name || email;
      map.set(email, label);
    });
    return Array.from(map, ([email, label]) => ({ email, label })).sort((a, b) =>
      a.label.localeCompare(b.label)
    );
  }, [docs]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return docs.filter((d) => {
      if (clientFilter !== "all" && d.deals?.contacts?.email !== clientFilter) return false;
      if (!q) return true;
      return (
        d.name.toLowerCase().includes(q) ||
        d.deals?.contacts?.email?.toLowerCase().includes(q) ||
        d.deals?.contacts?.full_name?.toLowerCase().includes(q)
      );
    });
  }, [docs, query, clientFilter]);

  const download = async (d: DocRow) => {
    if (!d.file_path) return;
    const { data, error } = await supabase.storage
      .from("crm-documents")
      .createSignedUrl(d.file_path, 300);
    if (error) return toast.error("Erreur téléchargement");
    window.open(data.signedUrl, "_blank");
  };

  const remove = async (d: DocRow) => {
    if (!confirm(`Supprimer définitivement « ${d.name} » ?`)) return;
    if (d.file_path) {
      await supabase.storage.from("crm-documents").remove([d.file_path]);
    }
    const { error } = await supabase.from("documents").delete().eq("id", d.id);
    if (error) return toast.error("Erreur suppression");
    toast.success("Document supprimé");
    load();
  };

  return (
    <div className="flex flex-1 flex-col overflow-y-auto px-6 py-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
            GED — Documents
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {loading ? "Chargement…" : `${filtered.length} documents`}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <select
            value={clientFilter}
            onChange={(e) => setClientFilter(e.target.value)}
            className="h-9 rounded-full border border-[#E9D5FF] dark:border-[#362B54] bg-white dark:bg-[#1E1B2E] px-3 text-sm"
          >
            <option value="all">Tous clients</option>
            {clients.map((c) => (
              <option key={c.email} value={c.email}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-3xl border border-[#E9D5FF] dark:border-[#362B54] bg-white dark:bg-[#1E1B2E]">
        <table className="w-full text-sm">
          <thead className="bg-[#FAF5FF] dark:bg-[#13111C] text-left text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
            <tr>
              <th className="px-4 py-3">Document</th>
              <th className="px-4 py-3">Client</th>
              <th className="px-4 py-3">Produit</th>
              <th className="px-4 py-3">Ajouté</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-[#362B54]">
            {filtered.map((d) => (
              <tr key={d.id} className="hover:bg-[#FAF5FF]/60 dark:hover:bg-[#262140]/60">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-[#7C3AED] dark:text-[#C4B5FD]" />
                    <span className="font-medium text-slate-900 dark:text-slate-50">{d.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-700 dark:text-slate-200">
                  {d.deals?.contacts?.full_name || d.deals?.contacts?.email || "—"}
                </td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                  {d.deals?.insurance_type ?? "—"}
                </td>
                <td className="px-4 py-3 text-xs text-slate-500 dark:text-slate-400">
                  {d.uploaded_at
                    ? new Date(d.uploaded_at).toLocaleDateString("fr-FR")
                    : "—"}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1">
                    {d.drive_url && (
                      <a
                        href={d.drive_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-full p-1.5 hover:bg-[#F5F3FF] dark:hover:bg-[#262140]"
                        title="Ouvrir dans Google Drive"
                      >
                        <ExternalLink className="h-4 w-4 text-[#7C3AED] dark:text-[#C4B5FD]" />
                      </a>
                    )}
                    {d.file_path && (
                      <button
                        onClick={() => download(d)}
                        className="rounded-full p-1.5 hover:bg-[#F5F3FF] dark:hover:bg-[#262140]"
                        title="Télécharger"
                      >
                        <Download className="h-4 w-4 text-[#7C3AED] dark:text-[#C4B5FD]" />
                      </button>
                    )}
                    <button
                      onClick={() => remove(d)}
                      className="rounded-full p-1.5 hover:bg-red-50 dark:hover:bg-red-950/40"
                      title="Supprimer"
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-slate-500 dark:text-slate-400">
                  Aucun document
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
