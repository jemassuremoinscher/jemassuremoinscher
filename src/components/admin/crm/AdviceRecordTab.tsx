import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { FileText, Plus, Trash2, Printer, AlertTriangle, ShieldCheck } from "lucide-react";
import {
  fetchAdviceRecordsForDeal,
  createAdviceRecord,
  fetchClient360ForContact,
} from "@/lib/portfolioApi";
import { resolveAuthorNames } from "@/lib/crmApi";
import type { AdviceRecord, SolutionStudied } from "@/types/portfolio";
import type { DealRow } from "@/pages/crm/types";

const emptySolution = (): SolutionStudied => ({ insurer: "", formula: "", premium: null, selected: false });

const printAdviceRecord = (record: AdviceRecord, dealLabel: string) => {
  const win = window.open("", "_blank", "width=800,height=900");
  if (!win) {
    toast.error("Autorise les pop-ups pour imprimer ce document");
    return;
  }
  const rows = record.solutions_studied
    .map(
      (s) =>
        `<tr><td>${s.insurer || "—"}</td><td>${s.formula || "—"}</td><td>${
          s.premium != null ? `${s.premium} €/an` : "—"
        }</td><td>${s.selected ? "Retenu" : ""}</td></tr>`,
    )
    .join("");
  win.document.write(`
    <html>
      <head>
        <title>Document de conseil — ${dealLabel}</title>
        <meta charset="utf-8" />
        <style>
          body { font-family: system-ui, sans-serif; color: #1e293b; padding: 32px; max-width: 720px; margin: 0 auto; }
          h1 { font-size: 20px; margin-bottom: 4px; }
          .meta { color: #64748b; font-size: 13px; margin-bottom: 24px; }
          h2 { font-size: 14px; text-transform: uppercase; letter-spacing: .03em; color: #7C3AED; margin-top: 24px; }
          p { white-space: pre-wrap; line-height: 1.5; }
          table { width: 100%; border-collapse: collapse; margin-top: 8px; }
          th, td { border: 1px solid #e2e8f0; padding: 6px 10px; text-align: left; font-size: 13px; }
          th { background: #FAF5FF; }
        </style>
      </head>
      <body>
        <h1>Document de conseil DDA</h1>
        <div class="meta">${dealLabel} · délivré le ${
          record.delivered_at ? new Date(record.delivered_at).toLocaleDateString("fr-FR") : "—"
        } · ${record.advisor_name || "Conseiller"}</div>

        <h2>Besoin exprimé</h2>
        <p>${record.client_needs}</p>

        <h2>Situation du client</h2>
        <p>${record.client_situation}</p>

        <h2>Solutions étudiées</h2>
        <table>
          <thead><tr><th>Assureur</th><th>Formule</th><th>Prime</th><th></th></tr></thead>
          <tbody>${rows}</tbody>
        </table>

        <h2>Recommandation</h2>
        <p>${record.recommendation}</p>

        <h2>Justification</h2>
        <p>${record.recommendation_reason}</p>

        ${record.client_decision ? `<h2>Décision du client</h2><p>${record.client_decision}</p>` : ""}
      </body>
    </html>
  `);
  win.document.close();
  win.focus();
  win.print();
};

export function AdviceRecordTab({ deal }: { deal: DealRow }) {
  const [records, setRecords] = useState<AdviceRecord[]>([]);
  const [advisorNames, setAdvisorNames] = useState<Map<string, string>>(new Map());
  const [hasAnyAdvice, setHasAnyAdvice] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [clientNeeds, setClientNeeds] = useState("");
  const [clientSituation, setClientSituation] = useState("");
  const [solutions, setSolutions] = useState<SolutionStudied[]>([emptySolution()]);
  const [recommendation, setRecommendation] = useState("");
  const [recommendationReason, setRecommendationReason] = useState("");
  const [clientDecision, setClientDecision] = useState("");

  const load = async () => {
    if (!deal.contact_id) return;
    setLoading(true);
    try {
      const [recs, client360] = await Promise.all([
        fetchAdviceRecordsForDeal(deal.id),
        fetchClient360ForContact(deal.contact_id),
      ]);
      setRecords(recs);
      setHasAnyAdvice(client360?.a_document_conseil ?? recs.length > 0);

      const authorIds = Array.from(new Set(recs.map((r) => r.advisor_id).filter((id): id is string => !!id)));
      if (authorIds.length) setAdvisorNames(await resolveAuthorNames(authorIds));
    } catch (e) {
      toast.error("Erreur de chargement des conseils");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deal.id]);

  const resetForm = () => {
    setClientNeeds("");
    setClientSituation("");
    setSolutions([emptySolution()]);
    setRecommendation("");
    setRecommendationReason("");
    setClientDecision("");
  };

  const updateSolution = (idx: number, patch: Partial<SolutionStudied>) =>
    setSolutions((prev) => prev.map((s, i) => (i === idx ? { ...s, ...patch } : s)));

  const submit = async () => {
    if (!deal.contact_id) {
      toast.error("Ce deal n'a pas de contact associé");
      return;
    }
    if (!clientNeeds.trim() || !clientSituation.trim() || !recommendation.trim() || !recommendationReason.trim()) {
      toast.error("Les 4 piliers (besoin, situation, recommandation, justification) sont requis");
      return;
    }
    const cleanSolutions = solutions.filter((s) => s.insurer.trim() || s.formula.trim());
    setSaving(true);
    try {
      const { data: userRes } = await supabase.auth.getUser();
      let advisorName = userRes.user?.email ?? null;
      if (userRes.user) {
        const names = await resolveAuthorNames([userRes.user.id]);
        advisorName = names.get(userRes.user.id) ?? advisorName;
      }
      await createAdviceRecord({
        contact_id: deal.contact_id,
        deal_id: deal.id,
        client_needs: clientNeeds.trim(),
        client_situation: clientSituation.trim(),
        solutions_studied: cleanSolutions,
        recommendation: recommendation.trim(),
        recommendation_reason: recommendationReason.trim(),
        client_decision: clientDecision.trim() || null,
        advisor_id: userRes.user?.id ?? null,
        advisor_name: advisorName,
        delivered_at: new Date().toISOString(),
      });
      toast.success("Document de conseil enregistré — définitif, non modifiable");
      resetForm();
      setFormOpen(false);
      await load();
    } catch (e) {
      toast.error("Impossible d'enregistrer le document de conseil");
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const dealLabel = deal.contacts?.full_name || deal.contacts?.email || "Deal";

  if (loading) {
    return <p className="text-xs text-slate-400 dark:text-slate-500">Chargement…</p>;
  }

  return (
    <div className="space-y-4">
      {hasAnyAdvice === false && (
        <div className="flex items-center gap-2 rounded-2xl border border-[#FEE2E2] dark:border-red-900/40 bg-[#FEE2E2] dark:bg-red-950/40 px-4 py-3 text-sm text-[#DC2626] dark:text-red-400">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          Aucun document de conseil pour ce client — obligation DDA non couverte.
        </div>
      )}

      {!formOpen && (
        <Button onClick={() => setFormOpen(true)} className="rounded-full bg-[#7C3AED] hover:bg-[#6D28D9]">
          <Plus className="mr-1.5 h-3.5 w-3.5" />
          Rédiger le document de conseil
        </Button>
      )}

      {formOpen && (
        <div className="space-y-4 rounded-2xl border border-[#E9D5FF] dark:border-[#362B54] bg-[#FAF5FF] dark:bg-[#13111C] p-4">
          <div>
            <label className="text-xs font-medium text-slate-600 dark:text-slate-300">Besoin exprimé par le client</label>
            <Textarea rows={2} value={clientNeeds} onChange={(e) => setClientNeeds(e.target.value)} className="mt-1" />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 dark:text-slate-300">Situation du client</label>
            <Textarea rows={2} value={clientSituation} onChange={(e) => setClientSituation(e.target.value)} className="mt-1" />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-slate-600 dark:text-slate-300">Solutions étudiées</label>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="h-7 rounded-full border-[#E9D5FF] dark:border-[#362B54] text-xs"
                onClick={() => setSolutions((prev) => [...prev, emptySolution()])}
              >
                <Plus className="mr-1 h-3 w-3" /> Ajouter
              </Button>
            </div>
            <div className="mt-2 space-y-2">
              {solutions.map((s, idx) => (
                <div key={idx} className="flex flex-wrap items-center gap-2 rounded-xl border border-[#E9D5FF] dark:border-[#362B54] bg-white dark:bg-[#1E1B2E] p-2">
                  <Input
                    placeholder="Assureur"
                    value={s.insurer}
                    onChange={(e) => updateSolution(idx, { insurer: e.target.value })}
                    className="h-8 w-32 text-xs"
                  />
                  <Input
                    placeholder="Formule"
                    value={s.formula}
                    onChange={(e) => updateSolution(idx, { formula: e.target.value })}
                    className="h-8 w-32 text-xs"
                  />
                  <Input
                    placeholder="Prime €/an"
                    type="number"
                    min="0"
                    value={s.premium ?? ""}
                    onChange={(e) => updateSolution(idx, { premium: e.target.value ? Number(e.target.value) : null })}
                    className="h-8 w-24 text-xs"
                  />
                  <label className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
                    <Checkbox checked={s.selected} onCheckedChange={(c) => updateSolution(idx, { selected: !!c })} />
                    Retenu
                  </label>
                  {solutions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setSolutions((prev) => prev.filter((_, i) => i !== idx))}
                      className="ml-auto grid h-7 w-7 place-items-center rounded-md text-slate-400 hover:bg-red-50 dark:hover:bg-red-950/40 hover:text-red-600"
                      aria-label="Retirer cette solution"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-600 dark:text-slate-300">Recommandation</label>
            <Textarea rows={2} value={recommendation} onChange={(e) => setRecommendation(e.target.value)} className="mt-1" />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 dark:text-slate-300">Justification de la recommandation</label>
            <Textarea rows={2} value={recommendationReason} onChange={(e) => setRecommendationReason(e.target.value)} className="mt-1" />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 dark:text-slate-300">Décision du client (facultatif)</label>
            <Textarea rows={1} value={clientDecision} onChange={(e) => setClientDecision(e.target.value)} className="mt-1" />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => { setFormOpen(false); resetForm(); }}>
              Annuler
            </Button>
            <Button size="sm" onClick={submit} disabled={saving} className="bg-[#7C3AED] hover:bg-[#6D28D9]">
              {saving ? "Enregistrement…" : "Enregistrer (définitif)"}
            </Button>
          </div>
        </div>
      )}

      {records.length === 0 ? (
        <p className="text-xs text-slate-400 dark:text-slate-500">Aucun document de conseil rédigé pour ce deal.</p>
      ) : (
        <ul className="space-y-3">
          {records.map((r) => (
            <li key={r.id} className="rounded-2xl border border-[#E9D5FF] dark:border-[#362B54] bg-white dark:bg-[#1E1B2E] p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#16A34A]" />
                  {r.delivered_at ? new Date(r.delivered_at).toLocaleDateString("fr-FR") : "—"}
                  {" · "}
                  {advisorNames.get(r.advisor_id ?? "") || r.advisor_name || "Conseiller"}
                </div>
                <button
                  type="button"
                  onClick={() => printAdviceRecord(r, dealLabel)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#E9D5FF] dark:border-[#362B54] px-2.5 py-1 text-xs text-slate-600 dark:text-slate-300 hover:bg-[#F5F3FF] dark:hover:bg-[#262140]"
                >
                  <Printer className="h-3 w-3" /> Exporter
                </button>
              </div>

              <div className="mt-3 space-y-2 text-sm text-slate-700 dark:text-slate-200">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wide text-[#7C3AED] dark:text-[#C4B5FD]">Besoin</span>
                  <p className="whitespace-pre-wrap">{r.client_needs}</p>
                </div>
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wide text-[#7C3AED] dark:text-[#C4B5FD]">Situation</span>
                  <p className="whitespace-pre-wrap">{r.client_situation}</p>
                </div>
                {r.solutions_studied.length > 0 && (
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wide text-[#7C3AED] dark:text-[#C4B5FD]">Solutions étudiées</span>
                    <ul className="mt-1 space-y-1">
                      {r.solutions_studied.map((s, i) => (
                        <li key={i} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                          <FileText className="h-3 w-3 shrink-0" />
                          {s.insurer} — {s.formula} {s.premium != null && `· ${s.premium} €/an`}
                          {s.selected && (
                            <span className="rounded-full bg-[#DCFCE7] px-2 py-0.5 text-[10px] font-semibold text-[#16A34A]">
                              Retenu
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wide text-[#7C3AED] dark:text-[#C4B5FD]">Recommandation</span>
                  <p className="whitespace-pre-wrap">{r.recommendation}</p>
                </div>
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wide text-[#7C3AED] dark:text-[#C4B5FD]">Justification</span>
                  <p className="whitespace-pre-wrap">{r.recommendation_reason}</p>
                </div>
                {r.client_decision && (
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wide text-[#7C3AED] dark:text-[#C4B5FD]">Décision du client</span>
                    <p className="whitespace-pre-wrap">{r.client_decision}</p>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
