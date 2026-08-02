import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, Plus } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { fetchOpportunitesMultiEquipement } from "@/lib/portfolioApi";
import type { OpportuniteMultiEquipementRow } from "@/types/portfolio";

const fmtEur = (n: number) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);

export function OpportunitiesWidget() {
  const navigate = useNavigate();
  const [rows, setRows] = useState<OpportuniteMultiEquipementRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [creatingFor, setCreatingFor] = useState<string | null>(null);

  useEffect(() => {
    fetchOpportunitesMultiEquipement()
      .then(setRows)
      .catch((e) => {
        toast.error("Erreur de chargement des opportunités");
        console.error(e);
      })
      .finally(() => setLoading(false));
  }, []);

  const createDeal = async (row: OpportuniteMultiEquipementRow) => {
    setCreatingFor(row.contact_id);
    try {
      const { data: userRes } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from("deals")
        .insert({
          contact_id: row.contact_id,
          insurance_type: row.produit_suggere,
          stage: "lead",
          lead_score: 60,
          assigned_to: userRes.user?.id ?? null,
          source_type: "opportunite_multi_equipement",
        })
        .select("id")
        .single();
      if (error) throw error;
      toast.success("Deal créé");
      setRows((prev) => prev.filter((r) => r.contact_id !== row.contact_id));
      if (data?.id) navigate(`/admin?deal=${data.id}`);
    } catch (e) {
      toast.error("Impossible de créer le deal");
      console.error(e);
    } finally {
      setCreatingFor(null);
    }
  };

  return (
    <div className="rounded-3xl border border-[#E9D5FF] dark:border-[#362B54] bg-white dark:bg-[#1E1B2E] p-5">
      <div className="flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-[#7C3AED] dark:text-[#C4B5FD]" />
        <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
          Opportunités multi-équipement
        </h2>
        {!loading && (
          <span className="rounded-full bg-[#F3E8FF] dark:bg-[#262140] px-2 py-0.5 text-[11px] font-semibold text-[#5B21B6] dark:text-[#D8B4FE]">
            {rows.length}
          </span>
        )}
      </div>

      {loading ? (
        <p className="mt-4 text-xs text-slate-400 dark:text-slate-500">Chargement…</p>
      ) : rows.length === 0 ? (
        <div className="mt-4 grid h-20 place-items-center rounded-2xl border border-dashed border-[#E9D5FF] dark:border-[#362B54] text-xs text-slate-400 dark:text-slate-500">
          Aucune opportunité identifiée pour l'instant.
        </div>
      ) : (
        <ul className="mt-4 divide-y divide-slate-100 dark:divide-[#362B54]">
          {rows.slice(0, 6).map((r) => (
            <li key={r.contact_id} className="flex items-center justify-between gap-3 py-2.5">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-slate-800 dark:text-slate-100">
                  {r.full_name || r.email || "Client"}
                </p>
                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                  Suggestion : <span className="font-medium text-[#7C3AED] dark:text-[#C4B5FD]">{r.produit_suggere}</span>
                  {" · "}
                  {r.nb_contrats_actifs} contrat{r.nb_contrats_actifs > 1 ? "s" : ""} actif{r.nb_contrats_actifs > 1 ? "s" : ""}
                  {r.prime_totale > 0 && ` · ${fmtEur(r.prime_totale)}`}
                </p>
              </div>
              <button
                type="button"
                onClick={() => createDeal(r)}
                disabled={creatingFor === r.contact_id}
                className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#7C3AED] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#6D28D9] disabled:opacity-50"
              >
                <Plus className="h-3 w-3" />
                {creatingFor === r.contact_id ? "…" : "Créer le deal"}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
