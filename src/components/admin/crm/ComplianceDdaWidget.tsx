import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { fetchAlertesConformiteDda } from "@/lib/portfolioApi";
import type { AlerteConformiteDdaRow } from "@/types/portfolio";

const DDA_ALERT_THRESHOLD_DAYS = 7;

export function ComplianceDdaWidget() {
  const [rows, setRows] = useState<AlerteConformiteDdaRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlertesConformiteDda()
      .then(setRows)
      .catch((e) => {
        toast.error("Erreur de chargement de la conformité DDA");
        console.error(e);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="rounded-3xl border border-[#E9D5FF] dark:border-[#362B54] bg-white dark:bg-[#1E1B2E] p-5">
      <div className="flex items-center gap-2">
        <ShieldAlert className="h-5 w-5 text-[#7C3AED] dark:text-[#C4B5FD]" />
        <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">Conformité DDA</h2>
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
          Aucune alerte — tous les deals ont un conseil documenté.
        </div>
      ) : (
        <ul className="mt-4 divide-y divide-slate-100 dark:divide-[#362B54]">
          {rows.map((r) => {
            const overdue = r.jours_sans_conseil > DDA_ALERT_THRESHOLD_DAYS;
            return (
              <li key={r.deal_id} className="flex items-center justify-between gap-3 py-2.5">
                <Link to={`/admin?deal=${r.deal_id}&tab=advice`} className="min-w-0 hover:opacity-80">
                  <p className="truncate text-sm font-medium text-slate-800 dark:text-slate-100">
                    {r.full_name || r.email || "Prospect"}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                    {r.insurance_type} · {r.stage}
                    {r.commercial && ` · ${r.commercial}`}
                  </p>
                </Link>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
                    overdue
                      ? "bg-[#FEE2E2] text-[#DC2626] dark:bg-red-950/40 dark:text-red-400"
                      : "bg-[#F3E8FF] text-[#5B21B6] dark:bg-[#262140] dark:text-[#D8B4FE]"
                  }`}
                  title={`Depuis le ${new Date(r.depuis).toLocaleDateString("fr-FR")}`}
                >
                  {r.jours_sans_conseil} j sans conseil
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
