import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  ArrowLeft,
  FileText,
  Download,
  ExternalLink,
  AlertTriangle,
  Clock,
  ShieldAlert,
  Wallet,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { fetchContractById } from "@/lib/portfolioApi";
import { CONTRACT_STATUS_META } from "@/types/portfolio";
import { fetchDocumentsForContract, fetchDocumentsManquantsForContract, getSignedDocumentUrl } from "@/lib/gedApi";
import { DOCUMENT_TYPE_LABELS, type DocumentRow, type DocumentType } from "@/types/ged";
import { fetchClaimsForContract, fetchSinistraliteForContract } from "@/lib/claimsApi";
import {
  CLAIM_RESPONSIBILITY_LABELS,
  CLAIM_STATUS_LABELS,
  RATIO_SINISTRES_PRIME_ALERT_THRESHOLD,
} from "@/types/claims";
import { fetchCommissionPaymentsForContract } from "@/lib/commissionsApi";
import { COMMISSION_PAYMENT_STATUS_LABELS } from "@/types/commissions";
import { UploadDocumentDialog } from "./UploadDocumentDialog";
import { DeclareClaimDialog } from "./DeclareClaimDialog";
import { MarkCommissionReceivedDialog } from "./MarkCommissionReceivedDialog";

const fmtEur = (n: number | null | undefined) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n ?? 0);

const fmtDate = (d: string | null | undefined) => (d ? new Date(d).toLocaleDateString("fr-FR") : "—");

const daysUntil = (d: string) => Math.ceil((new Date(d).getTime() - Date.now()) / 86400_000);

export default function ContractDetailPage() {
  const { contractId } = useParams<{ contractId: string }>();

  const { data: contract, isLoading: loadingContract } = useQuery({
    queryKey: ["contract", contractId],
    queryFn: () => fetchContractById(contractId!),
    enabled: !!contractId,
  });

  const {
    data: documents,
    isLoading: loadingDocuments,
    refetch: refetchDocuments,
  } = useQuery({
    queryKey: ["contract-documents", contractId],
    queryFn: () => fetchDocumentsForContract(contractId!),
    enabled: !!contractId,
  });

  const { data: missingDocs } = useQuery({
    queryKey: ["contract-documents-manquants", contractId],
    queryFn: () => fetchDocumentsManquantsForContract(contractId!),
    enabled: !!contractId,
  });

  const {
    data: claims,
    isLoading: loadingClaims,
    refetch: refetchClaims,
  } = useQuery({
    queryKey: ["contract-claims", contractId],
    queryFn: () => fetchClaimsForContract(contractId!),
    enabled: !!contractId,
  });

  const { data: sinistralite } = useQuery({
    queryKey: ["contract-sinistralite", contractId],
    queryFn: () => fetchSinistraliteForContract(contractId!),
    enabled: !!contractId,
  });

  const {
    data: commissionPayments,
    isLoading: loadingCommissions,
    refetch: refetchCommissions,
  } = useQuery({
    queryKey: ["contract-commission-payments", contractId],
    queryFn: () => fetchCommissionPaymentsForContract(contractId!),
    enabled: !!contractId,
  });

  const docsById = useMemo(() => new Map((documents ?? []).map((d) => [d.id, d])), [documents]);

  const missingTypeLabels = useMemo(
    () => new Set((missingDocs ?? []).map((m) => m.document_manquant)),
    [missingDocs]
  );

  const groupedDocs = useMemo(() => {
    const map = new Map<string, DocumentRow[]>();
    (documents ?? []).forEach((d) => {
      const key = d.document_type;
      map.set(key, [...(map.get(key) ?? []), d]);
    });
    // Ajoute les types 100% manquants (aucun document existant du tout) pour
    // que le badge "Obligatoire manquant" reste visible même sans ligne.
    missingTypeLabels.forEach((label) => {
      if (!map.has(label)) map.set(label, []);
    });
    return Array.from(map.entries());
  }, [documents, missingTypeLabels]);

  const openDocument = async (doc: DocumentRow) => {
    if (doc.file_path) {
      try {
        const url = await getSignedDocumentUrl(doc.file_path);
        window.open(url, "_blank");
      } catch (e) {
        toast.error("Erreur d'ouverture du document");
        console.error(e);
      }
    } else if (doc.drive_url) {
      window.open(doc.drive_url, "_blank");
    }
  };

  if (loadingContract) {
    return <div className="flex-1 px-6 py-6 text-sm text-slate-400 dark:text-slate-500">Chargement…</div>;
  }

  if (!contract) {
    return (
      <div className="flex-1 px-6 py-6">
        <p className="text-sm text-slate-500 dark:text-slate-400">Contrat introuvable.</p>
        <Link to="/admin/portefeuille" className="mt-2 inline-flex items-center gap-1.5 text-sm text-[#7C3AED] dark:text-[#C4B5FD] hover:underline">
          <ArrowLeft className="h-3.5 w-3.5" /> Retour au portefeuille
        </Link>
      </div>
    );
  }

  const contact = Array.isArray(contract.contacts) ? contract.contacts[0] : contract.contacts;
  const statusMeta = CONTRACT_STATUS_META[contract.status];
  const ratioAlert = (sinistralite?.ratio_sinistres_prime ?? 0) > RATIO_SINISTRES_PRIME_ALERT_THRESHOLD;

  return (
    <div className="flex flex-1 flex-col overflow-y-auto px-6 py-6">
      <Link to="/admin/portefeuille" className="inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-[#7C3AED] dark:hover:text-[#C4B5FD]">
        <ArrowLeft className="h-3.5 w-3.5" /> Portefeuille
      </Link>

      <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-wide text-[#7C3AED] dark:text-[#C4B5FD]">{contract.insurance_type}</div>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
            {contact?.full_name || contact?.email || "Client"}
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {contract.insurer_name}
            {contract.policy_number && ` · N° ${contract.policy_number}`}
          </p>
        </div>
        <Badge className="rounded-full border-0" style={{ background: statusMeta.tone, color: statusMeta.accent }}>
          {statusMeta.label}
        </Badge>
      </div>

      {ratioAlert && (
        <div className="mt-4 flex items-center gap-2 rounded-2xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/30 px-4 py-3 text-sm text-red-700 dark:text-red-400">
          <ShieldAlert className="h-4 w-4 shrink-0" />
          Ratio sinistres/prime élevé ({(sinistralite!.ratio_sinistres_prime * 100).toFixed(0)}%) — à surveiller.
        </div>
      )}

      <Tabs defaultValue="overview" className="mt-6 w-full">
        <TabsList className="rounded-full bg-[#F5F3FF] dark:bg-[#262140]">
          <TabsTrigger value="overview" className="rounded-full">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="documents" className="rounded-full">
            Documents
            {(missingDocs?.length ?? 0) > 0 && (
              <span className="ml-1.5 rounded-full bg-red-100 dark:bg-red-950/40 px-1.5 py-0.5 text-[10px] font-semibold text-red-600 dark:text-red-400">
                {missingDocs!.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="claims" className="rounded-full">Sinistres</TabsTrigger>
          <TabsTrigger value="commissions" className="rounded-full">Commissions</TabsTrigger>
        </TabsList>

        {/* ------------------------------------------------------------ */}
        <TabsContent value="overview" className="mt-4 space-y-4">
          <section className="rounded-3xl border border-[#E9D5FF] dark:border-[#362B54] bg-white dark:bg-[#1E1B2E] p-5">
            <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div><dt className="text-xs text-slate-500 dark:text-slate-400">Prime annuelle</dt><dd className="mt-0.5 text-sm font-medium text-slate-800 dark:text-slate-100">{fmtEur(contract.premium_annual)}</dd></div>
              <div><dt className="text-xs text-slate-500 dark:text-slate-400">Commission an 1</dt><dd className="mt-0.5 text-sm font-medium text-slate-800 dark:text-slate-100">{fmtEur(contract.commission_year_one)}</dd></div>
              <div><dt className="text-xs text-slate-500 dark:text-slate-400">Commission récurrente</dt><dd className="mt-0.5 text-sm font-medium text-slate-800 dark:text-slate-100">{fmtEur(contract.commission_recurring)}</dd></div>
              <div><dt className="text-xs text-slate-500 dark:text-slate-400">Date d'effet</dt><dd className="mt-0.5 text-sm font-medium text-slate-800 dark:text-slate-100">{fmtDate(contract.effective_date)}</dd></div>
              <div><dt className="text-xs text-slate-500 dark:text-slate-400">Échéance</dt><dd className="mt-0.5 text-sm font-medium text-slate-800 dark:text-slate-100">{fmtDate(contract.renewal_date)}</dd></div>
              {contact?.email && <div><dt className="text-xs text-slate-500 dark:text-slate-400">Email</dt><dd className="mt-0.5 text-sm font-medium text-slate-800 dark:text-slate-100">{contact.email}</dd></div>}
              {contact?.phone && <div><dt className="text-xs text-slate-500 dark:text-slate-400">Téléphone</dt><dd className="mt-0.5 text-sm font-medium text-slate-800 dark:text-slate-100">{contact.phone}</dd></div>}
            </dl>
            {contract.notes && (
              <p className="mt-4 whitespace-pre-wrap text-sm text-slate-600 dark:text-slate-300">{contract.notes}</p>
            )}
          </section>

          {sinistralite && (
            <section className="rounded-3xl border border-[#E9D5FF] dark:border-[#362B54] bg-white dark:bg-[#1E1B2E] p-5">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-100">
                <Wallet className="h-4 w-4 text-[#7C3AED] dark:text-[#C4B5FD]" />
                Sinistralité
              </h3>
              <dl className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div><dt className="text-xs text-slate-500 dark:text-slate-400">Sinistres</dt><dd className="mt-0.5 text-sm font-medium text-slate-800 dark:text-slate-100">{sinistralite.nb_sinistres}</dd></div>
                <div><dt className="text-xs text-slate-500 dark:text-slate-400">Total versé</dt><dd className="mt-0.5 text-sm font-medium text-slate-800 dark:text-slate-100">{fmtEur(sinistralite.total_verse)}</dd></div>
                <div>
                  <dt className="text-xs text-slate-500 dark:text-slate-400">Ratio S/P</dt>
                  <dd className={`mt-0.5 text-sm font-semibold ${ratioAlert ? "text-red-600 dark:text-red-400" : "text-slate-800 dark:text-slate-100"}`}>
                    {(sinistralite.ratio_sinistres_prime * 100).toFixed(0)}%
                  </dd>
                </div>
                <div><dt className="text-xs text-slate-500 dark:text-slate-400">Dernier sinistre</dt><dd className="mt-0.5 text-sm font-medium text-slate-800 dark:text-slate-100">{fmtDate(sinistralite.dernier_sinistre)}</dd></div>
              </dl>
            </section>
          )}
        </TabsContent>

        {/* ------------------------------------------------------------ */}
        <TabsContent value="documents" className="mt-4 space-y-4">
          <div className="flex justify-end">
            <UploadDocumentDialog contractId={contract.id} dealId={contract.deal_id} onUploaded={refetchDocuments} />
          </div>

          {loadingDocuments ? (
            <p className="text-xs text-slate-400 dark:text-slate-500">Chargement…</p>
          ) : groupedDocs.length === 0 ? (
            <div className="grid h-24 place-items-center rounded-2xl border border-dashed border-[#E9D5FF] dark:border-[#362B54] text-xs text-slate-400 dark:text-slate-500">
              Aucun document.
            </div>
          ) : (
            groupedDocs.map(([type, docs]) => {
              const isMissing = missingTypeLabels.has(type);
              return (
                <section key={type} className="rounded-3xl border border-[#E9D5FF] dark:border-[#362B54] bg-white dark:bg-[#1E1B2E] p-5">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-[#7C3AED] dark:text-[#C4B5FD]" />
                    <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                      {DOCUMENT_TYPE_LABELS[type as DocumentType] ?? type}
                    </h3>
                    {isMissing && (
                      <span className="rounded-full bg-red-100 dark:bg-red-950/40 px-2 py-0.5 text-[11px] font-semibold text-red-600 dark:text-red-400">
                        Obligatoire manquant
                      </span>
                    )}
                  </div>

                  {docs.length === 0 ? (
                    <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">Aucun document de ce type.</p>
                  ) : (
                    <ul className="mt-3 space-y-2">
                      {docs.map((d) => {
                        const superseding = d.superseded_by ? docsById.get(d.superseded_by) : null;
                        const isSuperseded = !!d.superseded_by;
                        const daysLeft = d.valid_until ? daysUntil(d.valid_until) : null;
                        return (
                          <li
                            key={d.id}
                            className={`flex flex-wrap items-center justify-between gap-2 rounded-2xl border px-4 py-2.5 ${
                              isSuperseded
                                ? "border-slate-100 dark:border-[#362B54] bg-slate-50/60 dark:bg-[#13111C]/40 opacity-60"
                                : "border-[#EEE6FF] dark:border-[#362B54] bg-[#FAF5FF]/60 dark:bg-[#13111C]/60"
                            }`}
                          >
                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium text-slate-800 dark:text-slate-100">{d.name}</p>
                              {isSuperseded ? (
                                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                                  Remplacé par{" "}
                                  {superseding ? (
                                    <button
                                      type="button"
                                      onClick={() => openDocument(superseding)}
                                      className="text-[#7C3AED] dark:text-[#C4B5FD] hover:underline"
                                    >
                                      {superseding.name}
                                    </button>
                                  ) : (
                                    "un document plus récent"
                                  )}
                                </p>
                              ) : (
                                d.valid_until && (
                                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                                    Valide jusqu'au {fmtDate(d.valid_until)}
                                  </p>
                                )
                              )}
                            </div>
                            <div className="flex shrink-0 items-center gap-2">
                              {!isSuperseded && daysLeft != null && daysLeft < 0 && (
                                <span className="rounded-full bg-red-100 dark:bg-red-950/40 px-2 py-0.5 text-[10px] font-semibold text-red-600 dark:text-red-400">
                                  Expiré
                                </span>
                              )}
                              {!isSuperseded && daysLeft != null && daysLeft >= 0 && daysLeft <= 30 && (
                                <span className="rounded-full bg-amber-100 dark:bg-amber-950/40 px-2 py-0.5 text-[10px] font-semibold text-amber-700 dark:text-amber-400">
                                  Expire bientôt
                                </span>
                              )}
                              {(d.file_path || d.drive_url) && (
                                <button
                                  type="button"
                                  onClick={() => openDocument(d)}
                                  className="grid h-8 w-8 place-items-center rounded-md text-[#7C3AED] dark:text-[#C4B5FD] hover:bg-[#F3E8FF] dark:hover:bg-[#262140]"
                                  title={d.file_path ? "Télécharger" : "Ouvrir"}
                                >
                                  {d.file_path ? <Download className="h-4 w-4" /> : <ExternalLink className="h-4 w-4" />}
                                </button>
                              )}
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </section>
              );
            })
          )}
        </TabsContent>

        {/* ------------------------------------------------------------ */}
        <TabsContent value="claims" className="mt-4 space-y-4">
          <div className="flex justify-end">
            <DeclareClaimDialog contractId={contract.id} onCreated={refetchClaims} />
          </div>

          {loadingClaims ? (
            <p className="text-xs text-slate-400 dark:text-slate-500">Chargement…</p>
          ) : !claims || claims.length === 0 ? (
            <div className="grid h-24 place-items-center rounded-2xl border border-dashed border-[#E9D5FF] dark:border-[#362B54] text-xs text-slate-400 dark:text-slate-500">
              Aucun sinistre déclaré.
            </div>
          ) : (
            <ul className="space-y-2">
              {claims.map((c) => (
                <li key={c.id} className="rounded-2xl border border-[#E9D5FF] dark:border-[#362B54] bg-white dark:bg-[#1E1B2E] p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-[#7C3AED] dark:text-[#C4B5FD]" />
                      <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">{c.claim_type}</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">{fmtDate(c.claim_date)}</span>
                    </div>
                    <span className="rounded-full bg-[#F3E8FF] dark:bg-[#262140] px-2.5 py-1 text-xs font-semibold text-[#5B21B6] dark:text-[#D8B4FE]">
                      {CLAIM_STATUS_LABELS[c.status]}
                    </span>
                  </div>
                  {c.description && <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{c.description}</p>}
                  <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-500 dark:text-slate-400">
                    {c.amount_claimed != null && <span>Réclamé : {fmtEur(c.amount_claimed)}</span>}
                    {c.amount_paid != null && <span>Versé : {fmtEur(c.amount_paid)}</span>}
                    <span>Responsabilité : {CLAIM_RESPONSIBILITY_LABELS[c.responsibility]}</span>
                    {c.impact_bonus_malus && <span className="text-amber-600 dark:text-amber-400">Impacte le bonus-malus</span>}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </TabsContent>

        {/* ------------------------------------------------------------ */}
        <TabsContent value="commissions" className="mt-4 space-y-4">
          {loadingCommissions ? (
            <p className="text-xs text-slate-400 dark:text-slate-500">Chargement…</p>
          ) : !commissionPayments || commissionPayments.length === 0 ? (
            <div className="grid h-24 place-items-center rounded-2xl border border-dashed border-[#E9D5FF] dark:border-[#362B54] text-xs text-slate-400 dark:text-slate-500">
              Aucune échéance de commission.
            </div>
          ) : (
            <ul className="space-y-2">
              {commissionPayments.map((p) => (
                <li key={p.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#E9D5FF] dark:border-[#362B54] bg-white dark:bg-[#1E1B2E] p-4">
                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-[#7C3AED] dark:text-[#C4B5FD]" />
                    <div>
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
                        {fmtDate(p.period_start)} — {fmtDate(p.period_end)}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Attendu {fmtEur(p.amount_expected)}
                        {p.amount_received != null && ` · Reçu ${fmtEur(p.amount_received)}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-[#F3E8FF] dark:bg-[#262140] px-2.5 py-1 text-xs font-semibold text-[#5B21B6] dark:text-[#D8B4FE]">
                      {COMMISSION_PAYMENT_STATUS_LABELS[p.status]}
                    </span>
                    {p.status !== "received" && (
                      <MarkCommissionReceivedDialog payment={p} onUpdated={refetchCommissions} />
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
