import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useOutletContext } from "react-router-dom";
import { toast } from "sonner";
import { Trash2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

type Ctx = { query: string };

type Row = {
  id: string;
  insurance_type: string;
  stage: string;
  source_type: string | null;
  deleted_at: string | null;
  created_at: string;
  contacts?: {
    full_name: string | null;
    email: string;
    phone: string | null;
  } | null;
};

export default function TrashPage() {
  const { query } = useOutletContext<Ctx>();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const { data } = await supabase
      .from("deals")
      .select(
        "id,insurance_type,stage,source_type,deleted_at,created_at,contacts(full_name,email,phone)"
      )
      .not("deleted_at", "is", null)
      .order("deleted_at", { ascending: false })
      .limit(1000);
    setRows((data ?? []) as unknown as Row[]);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (r) =>
        r.contacts?.email?.toLowerCase().includes(q) ||
        r.contacts?.full_name?.toLowerCase().includes(q) ||
        r.insurance_type.toLowerCase().includes(q)
    );
  }, [rows, query]);

  const restore = async (id: string) => {
    const { error } = await supabase
      .from("deals")
      .update({ deleted_at: null })
      .eq("id", id);
    if (error) return toast.error("Erreur");
    toast.success("Restauré");
    load();
  };

  const purge = async (id: string) => {
    if (!confirm("Supprimer définitivement ce deal ?")) return;
    const { error } = await supabase.from("deals").delete().eq("id", id);
    if (error) return toast.error("Erreur");
    toast.success("Supprimé");
    load();
  };

  return (
    <div className="flex flex-1 flex-col overflow-y-auto px-6 py-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
          Corbeille
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {loading ? "Chargement…" : `${filtered.length} deals supprimés`}
        </p>
        <p className="mt-2 inline-flex rounded-full bg-amber-50 px-3 py-1 text-xs text-amber-800">
          🕒 Purge automatique après 180 jours
        </p>
      </div>

      <div className="mt-6 overflow-hidden rounded-3xl border border-[#E9D5FF] dark:border-[#362B54] bg-white dark:bg-[#1E1B2E]">
        <table className="w-full text-sm">
          <thead className="bg-[#FAF5FF] dark:bg-[#13111C] text-left text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
            <tr>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3">Produit</th>
              <th className="px-4 py-3">Source</th>
              <th className="px-4 py-3">Supprimé</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-[#362B54]">
            {filtered.map((r) => (
              <tr key={r.id} className="hover:bg-[#FAF5FF]/60 dark:hover:bg-[#262140]/60">
                <td className="px-4 py-3">
                  <div className="font-medium text-slate-900 dark:text-slate-50">
                    {r.contacts?.full_name || "—"}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {r.contacts?.email}
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{r.insurance_type}</td>
                <td className="px-4 py-3 text-xs text-slate-500 dark:text-slate-400">
                  {r.source_type ?? "—"}
                </td>
                <td className="px-4 py-3 text-xs text-slate-500 dark:text-slate-400">
                  {r.deleted_at
                    ? new Date(r.deleted_at).toLocaleDateString("fr-FR")
                    : "—"}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => restore(r.id)}
                      className="rounded-full"
                    >
                      <RotateCcw className="mr-1 h-3.5 w-3.5" />
                      Restaurer
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => purge(r.id)}
                      className="rounded-full border-red-200 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
                    >
                      <Trash2 className="mr-1 h-3.5 w-3.5" />
                      Purger
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-slate-500 dark:text-slate-400">
                  Corbeille vide
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
