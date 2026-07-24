import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useOutletContext } from "react-router-dom";
import { toast } from "sonner";
import { FileText, Download, Trash2 } from "lucide-react";

type Ctx = { query: string };

type DocRow = {
  id: string;
  name: string;
  status: "manquant" | "attente" | "valide";
  file_path: string | null;
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
  const [status, setStatus] = useState<string>("all");
  const [clientFilter, setClientFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const { data } = await supabase
      .from("documents")
      .select(
        "id,name,status,file_path,uploaded_at,deal_id,deals(insurance_type,contacts(full_name,email))"
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
      if (status !== "all" && d.status !== status) return false;
      if (clientFilter !== "all" && d.deals?.contacts?.email !== clientFilter) return false;
      if (!q) return true;
      return (
        d.name.toLowerCase().includes(q) ||
        d.deals?.contacts?.email?.toLowerCase().includes(q) ||
        d.deals?.contacts?.full_name?.toLowerCase().includes(q)
      );
    });
  }, [docs, query, status, clientFilter]);

  const download = async (d: DocRow) => {
    if (!d.file_path) return;
    const { data, error } = await supabase.storage
      .from("crm-documents")
      .createSignedUrl(d.file_path, 300);
    if (error) return toast.error("Erreur téléchargement");
    window.open(data.signedUrl, "_blank");
  };

  const validate = async (d: DocRow) => {
    const { error } = await supabase
      .from("documents")
      .update({ status: "valide" })
      .eq("id", d.id);
    if (error) return toast.error("Erreur");
    toast.success("Validé");
    load();
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

  const statusPill = (s: DocRow["status"]) => {
    if (s === "valide")
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs text-emerald-700">
          <Check className="h-3 w-3" /> Validé
        </span>
      );
    if (s === "attente")
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs text-amber-700">
          <Clock className="h-3 w-3" /> En attente
        </span>
      );
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-xs text-red-700">
        <AlertCircle className="h-3 w-3" /> Manquant
      </span>
    );
  };

  return (
    <div className="flex flex-1 flex-col overflow-y-auto px-6 py-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            GED — Documents
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {loading ? "Chargement…" : `${filtered.length} documents`}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <select
            value={clientFilter}
            onChange={(e) => setClientFilter(e.target.value)}
            className="h-9 rounded-full border border-[#E9D5FF] bg-white px-3 text-sm"
          >
            <option value="all">Tous clients</option>
            {clients.map((c) => (
              <option key={c.email} value={c.email}>
                {c.label}
              </option>
            ))}
          </select>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="h-9 rounded-full border border-[#E9D5FF] bg-white px-3 text-sm"
          >
            <option value="all">Tous statuts</option>
            <option value="attente">En attente</option>
            <option value="valide">Validés</option>
            <option value="manquant">Manquants</option>
          </select>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-3xl border border-[#E9D5FF] bg-white">
        <table className="w-full text-sm">
          <thead className="bg-[#FAF5FF] text-left text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Document</th>
              <th className="px-4 py-3">Client</th>
              <th className="px-4 py-3">Produit</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3">Uploadé</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((d) => (
              <tr key={d.id} className="hover:bg-[#FAF5FF]/60">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-[#7C3AED]" />
                    <span className="font-medium text-slate-900">{d.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-700">
                  {d.deals?.contacts?.full_name || d.deals?.contacts?.email || "—"}
                </td>
                <td className="px-4 py-3 text-slate-600">
                  {d.deals?.insurance_type ?? "—"}
                </td>
                <td className="px-4 py-3">{statusPill(d.status)}</td>
                <td className="px-4 py-3 text-xs text-slate-500">
                  {d.uploaded_at
                    ? new Date(d.uploaded_at).toLocaleDateString("fr-FR")
                    : "—"}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1">
                    {d.file_path && (
                      <button
                        onClick={() => download(d)}
                        className="rounded-full p-1.5 hover:bg-[#F5F3FF]"
                        title="Télécharger"
                      >
                        <Download className="h-4 w-4 text-[#7C3AED]" />
                      </button>
                    )}
                    {d.status === "attente" && (
                      <button
                        onClick={() => validate(d)}
                        className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-medium text-white hover:bg-emerald-700"
                      >
                        Valider
                      </button>
                    )}
                    <button
                      onClick={() => remove(d)}
                      className="rounded-full p-1.5 hover:bg-red-50"
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
                <td colSpan={6} className="px-4 py-10 text-center text-slate-500">
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
