import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Wallet, TrendingUp, RefreshCw, AlertTriangle, Users, Moon, ArrowUpDown, FileWarning, Clock, PhoneOff } from "lucide-react";
import { fetchContracts, fetchTableauBordPortefeuille } from "@/lib/portfolioApi";
import { CONTRACT_STATUS_META as STATUS_META } from "@/types/portfolio";
import type { Contract, ContractStatus, TableauBordPortefeuilleRow } from "@/types/portfolio";

const fmtEur = (n: number | null) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n ?? 0);

const fmtDate = (d: string | null) => (d ? new Date(d).toLocaleDateString("fr-FR") : "—");

// Jointure contacts(...) potentiellement typée en tableau par supabase-js même
// en 1:1 (même pattern que CrmKanban.tsx / DealDrawer.tsx / crmApi.ts).
const contactOf = (c: Contract) => (Array.isArray(c.contacts) ? c.contacts[0] : c.contacts);

function Kpi({ icon: Icon, label, value, hint }: { icon: any; label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-3xl border border-[#E9D5FF] dark:border-[#362B54] bg-white dark:bg-[#1E1B2E] p-5">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-[#F5F3FF] dark:bg-[#262140] p-2.5">
          <Icon className="h-5 w-5 text-[#7C3AED] dark:text-[#C4B5FD]" />
        </div>
        <div className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</div>
      </div>
      <div className="mt-3 text-2xl font-semibold text-slate-900 dark:text-slate-50">{value}</div>
      {hint && <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">{hint}</div>}
    </div>
  );
}

export default function PortfolioPage() {
  const navigate = useNavigate();
  const [board, setBoard] = useState<TableauBordPortefeuilleRow | null>(null);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<ContractStatus | "all">("all");
  const [sortAsc, setSortAsc] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const [b, c] = await Promise.all([fetchTableauBordPortefeuille(), fetchContracts()]);
      setBoard(b);
      setContracts(c);
    } catch (e) {
      toast.error("Erreur de chargement du portefeuille");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const rows = statusFilter === "all" ? contracts : contracts.filter((c) => c.status === statusFilter);
    return [...rows].sort((a, b) => {
      // Échéances non renseignées toujours en fin de liste, quel que soit le sens.
      if (!a.renewal_date && !b.renewal_date) return 0;
      if (!a.renewal_date) return 1;
      if (!b.renewal_date) return -1;
      const diff = new Date(a.renewal_date).getTime() - new Date(b.renewal_date).getTime();
      return sortAsc ? diff : -diff;
    });
  }, [contracts, statusFilter, sortAsc]);

  return (
    <div className="flex flex-1 flex-col overflow-y-auto px-6 py-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">Portefeuille</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {loading ? "Chargement…" : `${contracts.length} contrat${contracts.length > 1 ? "s" : ""}`}
        </p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi icon={Wallet} label="Contrats actifs" value={String(board?.contrats_actifs ?? 0)} />
        <Kpi icon={TrendingUp} label="Primes sous gestion" value={fmtEur(board?.primes_sous_gestion ?? 0)} />
        <Kpi icon={RefreshCw} label="Commissions récurrentes" value={fmtEur(board?.commissions_recurrentes ?? 0)} hint="par an" />
        <Kpi icon={AlertTriangle} label="Échéances à 60 j" value={String(board?.echeances_60j ?? 0)} />
        <Kpi icon={AlertTriangle} label="Résiliations (12 mois)" value={String(board?.resiliations_12m ?? 0)} />
        <Kpi icon={Users} label="Clients mono-produit" value={String(board?.clients_mono_produit ?? 0)} hint="opportunité multi-équipement" />
        <Kpi icon={AlertTriangle} label="Sans conseil DDA" value={String(board?.clients_sans_conseil_dda ?? 0)} />
        <Kpi icon={Moon} label="Deals dormants" value={String(board?.deals_dormants ?? 0)} />
        <Kpi icon={AlertTriangle} label="Sinistres en cours" value={String(board?.sinistres_en_cours ?? 0)} />
        <Kpi icon={Clock} label="Commissions en attente" value={String(board?.commissions_en_attente ?? 0)} />
        <Kpi icon={FileWarning} label="Documents manquants" value={String(board?.documents_manquants ?? 0)} />
        <Kpi icon={PhoneOff} label="Coordonnées erronées" value={String(board?.coordonnees_erronees ?? 0)} />
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">Contrats</h2>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as ContractStatus | "all")}
            className="h-9 rounded-full border border-[#E9D5FF] dark:border-[#362B54] bg-white dark:bg-[#1E1B2E] px-3 text-sm"
          >
            <option value="all">Tous statuts</option>
            {(Object.keys(STATUS_META) as ContractStatus[]).map((s) => (
              <option key={s} value={s}>
                {STATUS_META[s].label}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => setSortAsc((v) => !v)}
            className="inline-flex h-9 items-center gap-1.5 rounded-full border border-[#E9D5FF] dark:border-[#362B54] bg-white dark:bg-[#1E1B2E] px-3 text-sm text-slate-600 dark:text-slate-300 hover:bg-[#F5F3FF] dark:hover:bg-[#262140]"
            title="Inverser le tri par échéance"
          >
            <ArrowUpDown className="h-3.5 w-3.5" />
            Échéance {sortAsc ? "la plus proche" : "la plus lointaine"}
          </button>
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-3xl border border-[#E9D5FF] dark:border-[#362B54] bg-white dark:bg-[#1E1B2E]">
        {loading ? (
          <div className="p-6 text-sm text-slate-400 dark:text-slate-500">Chargement…</div>
        ) : filtered.length === 0 ? (
          <div className="p-6 text-sm text-slate-400 dark:text-slate-500">Aucun contrat pour ce filtre.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-[#FAFAFF] dark:bg-[#13111C] text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
              <tr>
                <th className="py-3 px-4 text-left font-medium">Client</th>
                <th className="py-3 px-4 text-left font-medium">Produit</th>
                <th className="py-3 px-4 text-left font-medium">Assureur</th>
                <th className="py-3 px-4 text-left font-medium">Prime annuelle</th>
                <th className="py-3 px-4 text-left font-medium">Échéance</th>
                <th className="py-3 px-4 text-left font-medium">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-[#362B54]">
              {filtered.map((c) => {
                const contact = contactOf(c);
                const meta = STATUS_META[c.status];
                return (
                  <tr
                    key={c.id}
                    onClick={() => navigate(`/admin/portefeuille/${c.id}`)}
                    className="cursor-pointer hover:bg-[#FAF5FF] dark:hover:bg-[#262140]"
                  >
                    <td className="py-3 px-4 font-medium text-slate-800 dark:text-slate-100">
                      <Link to={`/admin/portefeuille/${c.id}`} className="hover:text-[#7C3AED] dark:hover:text-[#C4B5FD]" onClick={(e) => e.stopPropagation()}>
                        {contact?.full_name || contact?.email || "—"}
                      </Link>
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{c.insurance_type}</td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{c.insurer_name}</td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{fmtEur(c.premium_annual)}</td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{fmtDate(c.renewal_date)}</td>
                    <td className="py-3 px-4">
                      <span
                        className="rounded-full px-2.5 py-1 text-xs font-semibold"
                        style={{ background: meta.tone, color: meta.accent }}
                      >
                        {meta.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <p className="mt-4 text-xs text-slate-400 dark:text-slate-500">
        Pour créer un contrat, ouvrez un deal validé et utilisez « Créer le contrat » dans sa fiche —{" "}
        <Link to="/admin?stage=won" className="text-[#7C3AED] dark:text-[#C4B5FD] hover:underline">
          voir les deals validés
        </Link>
        .
      </p>
    </div>
  );
}
