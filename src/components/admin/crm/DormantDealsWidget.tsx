import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Moon } from "lucide-react";
import { toast } from "sonner";
import { fetchDealsDormants } from "@/lib/portfolioApi";
import type { DealDormantRow } from "@/types/portfolio";

export function DormantDealsWidget() {
  const [rows, setRows] = useState<DealDormantRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDealsDormants()
      .then(setRows)
      .catch((e) => {
        toast.error("Erreur de chargement des deals dormants");
        console.error(e);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="rounded-3xl border border-[#E9D5FF] dark:border-[#362B54] bg-white dark:bg-[#1E1B2E] p-5">
      <div className="flex items-center gap-2">
        <Moon className="h-5 w-5 text-[#7C3AED] dark:text-[#C4B5FD]" />
        <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">Deals dormants</h2>
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
          Aucun deal dormant — bon signe.
        </div>
      ) : (
        <ul className="mt-4 divide-y divide-slate-100 dark:divide-[#362B54]">
          {rows.slice(0, 6).map((r) => (
            <li key={r.deal_id} className="flex items-center justify-between gap-3 py-2.5">
              <Link to={`/admin?deal=${r.deal_id}`} className="min-w-0 hover:opacity-80">
                <p className="truncate text-sm font-medium text-slate-800 dark:text-slate-100">
                  {r.full_name || r.email || "Prospect"}
                </p>
                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                  {r.insurance_type} · {r.stage}
                  {r.commercial && ` · ${r.commercial}`}
                </p>
              </Link>
              <span className="shrink-0 rounded-full bg-[#FEE2E2] dark:bg-red-950/40 px-2.5 py-1 text-xs font-semibold text-[#DC2626] dark:text-red-400">
                {r.jours_sans_activite} j
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
