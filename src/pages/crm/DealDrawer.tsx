import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Mail, Phone, Send, FileText, ExternalLink, Plus, Trash2 } from "lucide-react";
import type { DealRow } from "./types";
import { STAGES } from "./types";
import { AuditTimeline } from "./AuditTimeline";
import { EditDealSection } from "./EditDealSection";
import { LeadTimeline } from "@/components/admin/crm/LeadTimeline";
import { ActivityComposer } from "@/components/admin/crm/ActivityComposer";
import { ScheduleTaskDialog } from "@/components/admin/crm/ScheduleTaskDialog";

const CHECKLISTS: Record<string, string[]> = {
  auto: ["Carte Grise", "Permis de conduire", "Relevé d'Information", "RIB"],
  moto: ["Carte Grise", "Permis (A/A2)", "Relevé d'Information", "RIB"],
  habitation: ["CNI", "Justificatif de domicile", "RIB"],
  sante: ["Attestation Vitale", "RIB", "Mandat SEPA"],
  mutuelle: ["Attestation Vitale", "RIB", "Mandat SEPA"],
};

// Extrait l'ID Google Drive depuis les formats d'URL courants
const extractDriveId = (url: string): string | null => {
  if (!url) return null;
  const patterns = [
    /\/file\/d\/([a-zA-Z0-9_-]+)/,
    /[?&]id=([a-zA-Z0-9_-]+)/,
    /\/folders\/([a-zA-Z0-9_-]+)/,
    /\/document\/d\/([a-zA-Z0-9_-]+)/,
    /\/spreadsheets\/d\/([a-zA-Z0-9_-]+)/,
    /\/presentation\/d\/([a-zA-Z0-9_-]+)/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
};

const drivePreviewUrl = (url: string): string | null => {
  const id = extractDriveId(url);
  if (!id) return null;
  if (/\/folders\//.test(url)) return null;
  return `https://drive.google.com/file/d/${id}/preview`;
};

const driveThumbUrl = (url: string): string | null => {
  const id = extractDriveId(url);
  if (!id) return null;
  return `https://drive.google.com/thumbnail?id=${id}&sz=w200`;
};

interface Doc {
  id: string;
  name: string;
  status: "manquant" | "attente" | "valide";
  file_path?: string | null;
  drive_url?: string | null;
  virtual?: boolean;
}

export function DealDrawer({
  deal,
  open,
  onOpenChange,
}: {
  deal: DealRow | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const queryClient = useQueryClient();
  const [docs, setDocs] = useState<Doc[]>([]);
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [newName, setNewName] = useState("");
  const [newUrl, setNewUrl] = useState("");

  const invalidateActivities = () => {
    if (deal) queryClient.invalidateQueries({ queryKey: ["deal-activities", deal.id] });
  };

  const refresh = async () => {
    if (!deal) return;
    setLoading(true);
    const { data } = await supabase
      .from("documents")
      .select("id,name,status,file_path,drive_url")
      .eq("deal_id", deal.id);
    const dbDocs = (data ?? []) as Doc[];
    const key = deal.insurance_type.toLowerCase();
    const expected = CHECKLISTS[key] ?? [];
    const merged: Doc[] = [
      ...dbDocs,
      ...expected
        .filter((n) => !dbDocs.some((x) => x.name === n))
        .map((n) => ({ id: `virt-${n}`, name: n, status: "manquant" as const, virtual: true })),
    ];
    setDocs(merged);
    setLoading(false);
  };

  useEffect(() => {
    if (!deal || !open) return;
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deal, open]);

  const upsertDoc = async (doc: Doc, patch: Partial<Doc>) => {
    if (!deal) return;
    if (doc.virtual) {
      const { error } = await supabase.from("documents").insert({
        deal_id: deal.id,
        name: patch.name ?? doc.name,
        status: patch.status ?? "attente",
        drive_url: patch.drive_url ?? null,
      });
      if (error) return toast.error("Erreur d'enregistrement");
    } else {
      const { error } = await supabase
        .from("documents")
        .update({
          ...(patch.name !== undefined ? { name: patch.name } : {}),
          ...(patch.status !== undefined ? { status: patch.status } : {}),
          ...(patch.drive_url !== undefined ? { drive_url: patch.drive_url } : {}),
        })
        .eq("id", doc.id);
      if (error) return toast.error("Erreur d'enregistrement");
    }
    await refresh();
  };

  const toggleValidated = async (doc: Doc, checked: boolean) => {
    await upsertDoc(doc, { status: checked ? "valide" : "attente" });
    if (checked) {
      await supabase.from("activities").insert({
        deal_id: deal!.id,
        action_type: "document_validated",
        description: doc.name,
      });
      invalidateActivities();
    }
  };

  const saveDriveUrl = async (doc: Doc, url: string) => {
    const clean = url.trim();
    if (clean && !extractDriveId(clean) && !/^https?:\/\//.test(clean)) {
      return toast.error("URL invalide (colle un lien Google Drive)");
    }
    await upsertDoc(doc, { drive_url: clean || null });
    if (clean) {
      await supabase.from("activities").insert({
        deal_id: deal!.id,
        action_type: "document_linked",
        description: `${doc.name} — Drive`,
      });
      invalidateActivities();
      toast.success("Lien Drive enregistré");
    }
  };

  const renameDoc = async (doc: Doc, name: string) => {
    const clean = name.trim();
    if (!clean || clean === doc.name) return;
    await upsertDoc(doc, { name: clean });
  };

  const removeDoc = async (doc: Doc) => {
    if (doc.virtual) {
      setDocs((prev) => prev.filter((x) => x.id !== doc.id));
      return;
    }
    const { error } = await supabase.from("documents").delete().eq("id", doc.id);
    if (error) return toast.error("Suppression impossible");
    await refresh();
  };

  const addCustomDoc = async () => {
    if (!deal || !newName.trim()) return;
    const { error } = await supabase.from("documents").insert({
      deal_id: deal.id,
      name: newName.trim(),
      status: newUrl.trim() ? "attente" : "manquant",
      drive_url: newUrl.trim() || null,
    });
    if (error) return toast.error("Ajout impossible");
    setNewName("");
    setNewUrl("");
    await refresh();
  };

  if (!deal) return null;
  const contact = deal.contacts;
  const stage = STAGES.find((s) => s.id === deal.stage);

  const validated = docs.filter((d) => d.status === "valide").length;
  const total = Math.max(docs.length, 1);
  const completion = Math.round((validated / total) * 100);


  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-xl overflow-y-auto p-0">
        <SheetHeader className="border-b border-[#E9D5FF] dark:border-[#362B54] bg-[#FAF5FF] dark:bg-[#13111C] px-6 py-5">
          <SheetTitle className="text-left">
            <div className="text-xs uppercase tracking-wide text-[#7C3AED] dark:text-[#C4B5FD]">
              {deal.insurance_type}
            </div>
            <div className="mt-1 text-xl font-semibold text-slate-900 dark:text-slate-50">
              {contact?.full_name ?? "Prospect"}
            </div>
          </SheetTitle>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <Badge
              className="rounded-full border-0"
              style={{
                background: stage?.tone,
                color: stage?.accent,
              }}
            >
              {stage?.label}
            </Badge>
            {deal.lead_score != null && (
              <Badge variant="outline" className="rounded-full border-[#E9D5FF] dark:border-[#362B54]">
                Score {deal.lead_score}
              </Badge>
            )}
            {contact?.source && (
              <Badge variant="outline" className="rounded-full border-[#E9D5FF] dark:border-[#362B54]">
                {contact.source}
              </Badge>
            )}
          </div>
        </SheetHeader>

        <div className="space-y-6 px-6 py-6">
          <section className="grid gap-3 sm:grid-cols-2">
            {contact?.email && (
              <a
                href={`mailto:${contact.email}`}
                className="flex items-center gap-3 rounded-2xl border border-[#E9D5FF] dark:border-[#362B54] bg-white dark:bg-[#1E1B2E] px-4 py-3 text-sm text-slate-700 dark:text-slate-200 hover:bg-[#FAF5FF] dark:hover:bg-[#262140]"
              >
                <Mail className="h-4 w-4 text-[#7C3AED] dark:text-[#C4B5FD]" />
                <span className="truncate">{contact.email}</span>
              </a>
            )}
            {contact?.phone && (
              <a
                href={`tel:${contact.phone}`}
                className="flex items-center gap-3 rounded-2xl border border-[#E9D5FF] dark:border-[#362B54] bg-white dark:bg-[#1E1B2E] px-4 py-3 text-sm text-slate-700 dark:text-slate-200 hover:bg-[#FAF5FF] dark:hover:bg-[#262140]"
              >
                <Phone className="h-4 w-4 text-[#7C3AED] dark:text-[#C4B5FD]" />
                {contact.phone}
              </a>
            )}
          </section>

          <EditDealSection deal={deal} onSaved={refresh} />

          {/* GED */}
          <section className="rounded-3xl border border-[#E9D5FF] dark:border-[#362B54] bg-white dark:bg-[#1E1B2E] p-5">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-100">
                <FileText className="h-4 w-4 text-[#7C3AED] dark:text-[#C4B5FD]" />
                Dossier documentaire
              </h3>
              <span className="text-xs font-semibold text-[#5B21B6] dark:text-[#D8B4FE]">
                {completion}%
              </span>
            </div>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-[#F3E8FF] dark:bg-[#262140]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#7C3AED] to-[#A78BFA]"
                style={{ width: `${completion}%` }}
              />
            </div>

            <ul className="mt-4 space-y-3">
              {loading && (
                <li className="text-xs text-slate-400 dark:text-slate-500">Chargement…</li>
              )}
              {!loading && docs.length === 0 && (
                <li className="text-xs text-slate-400 dark:text-slate-500">
                  Aucun document requis à ce stade.
                </li>
              )}
              {docs.map((d) => {
                const thumb = d.drive_url ? driveThumbUrl(d.drive_url) : null;
                const preview = d.drive_url ? drivePreviewUrl(d.drive_url) : null;
                return (
                  <li
                    key={d.id}
                    className="rounded-2xl border border-[#EEE6FF] dark:border-[#362B54] bg-[#FAF5FF]/60 dark:bg-[#13111C]/60 p-3"
                  >
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={d.status === "valide"}
                        onCheckedChange={(c) => toggleValidated(d, !!c)}
                        className="mt-1"
                        aria-label={`Valider ${d.name}`}
                      />
                      {thumb ? (
                        <button
                          type="button"
                          onClick={() => preview && setPreviewUrl(preview)}
                          className="h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-[#E9D5FF] dark:border-[#362B54] bg-white dark:bg-[#1E1B2E]"
                          title="Aperçu"
                        >
                          <img
                            src={thumb}
                            alt=""
                            className="h-full w-full object-cover"
                            referrerPolicy="no-referrer"
                            onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
                          />
                        </button>
                      ) : (
                        <div className="grid h-14 w-14 shrink-0 place-items-center rounded-lg border border-dashed border-[#E9D5FF] dark:border-[#362B54] bg-white dark:bg-[#1E1B2E] text-slate-300 dark:text-slate-600">
                          <FileText className="h-5 w-5" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0 space-y-2">
                        <Input
                          defaultValue={d.name}
                          onBlur={(e) => renameDoc(d, e.target.value)}
                          className="h-8 text-sm font-medium"
                          placeholder="Nom du document"
                        />
                        <div className="flex items-center gap-2">
                          <Input
                            defaultValue={d.drive_url ?? ""}
                            onBlur={(e) => {
                              if ((e.target.value || "") !== (d.drive_url ?? "")) {
                                saveDriveUrl(d, e.target.value);
                              }
                            }}
                            className="h-8 text-xs"
                            placeholder="Coller un lien Google Drive…"
                          />
                          {d.drive_url && (
                            <a
                              href={d.drive_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="grid h-8 w-8 shrink-0 place-items-center rounded-md text-[#7C3AED] dark:text-[#C4B5FD] hover:bg-[#F3E8FF] dark:hover:bg-[#262140]"
                              aria-label="Ouvrir dans Google Drive"
                              title="Ouvrir dans Google Drive"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          )}
                          <button
                            type="button"
                            onClick={() => removeDoc(d)}
                            className="grid h-8 w-8 shrink-0 place-items-center rounded-md text-slate-400 dark:text-slate-500 hover:bg-red-50 dark:hover:bg-red-950/40 hover:text-red-600 dark:hover:text-red-400"
                            aria-label="Supprimer"
                            title="Supprimer cette ligne"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            {/* Ajout d'un document personnalisé */}
            <div className="mt-4 rounded-2xl border border-dashed border-[#E9D5FF] dark:border-[#362B54] p-3">
              <p className="mb-2 text-xs font-medium text-slate-600 dark:text-slate-300">Ajouter un document</p>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Nom (ex. Devis signé)"
                  className="h-8 text-sm"
                />
                <Input
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="Lien Google Drive (facultatif)"
                  className="h-8 text-sm"
                />
                <Button
                  size="sm"
                  onClick={addCustomDoc}
                  disabled={!newName.trim()}
                  className="h-8 rounded-full bg-[#7C3AED] hover:bg-[#6D28D9]"
                >
                  <Plus className="mr-1 h-3.5 w-3.5" /> Ajouter
                </Button>
              </div>
            </div>


            <div className="mt-4 flex gap-2">
              <Button
                size="sm"
                className="rounded-full bg-[#7C3AED] hover:bg-[#6D28D9]"
                disabled
                title="Bientôt disponible"
              >
                <Send className="mr-1.5 h-3.5 w-3.5" />
                Relancer par email
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="rounded-full border-[#E9D5FF] dark:border-[#362B54]"
                disabled
              >
                Relancer par SMS
              </Button>
            </div>
          </section>

          {/* Timeline */}
          <section className="rounded-3xl border border-[#E9D5FF] dark:border-[#362B54] bg-white dark:bg-[#1E1B2E] p-5 space-y-4">
            <div className="flex items-center justify-end">
              <ScheduleTaskDialog
                dealId={deal.id}
                onCreated={() => {
                  queryClient.invalidateQueries({ queryKey: ["deal-tasks-open"] });
                  queryClient.invalidateQueries({ queryKey: ["deal-tasks-overdue"] });
                }}
              />
            </div>
            <ActivityComposer dealId={deal.id} onCreated={invalidateActivities} />
            <LeadTimeline dealId={deal.id} />
          </section>

          <AuditTimeline dealId={deal.id} />

          {deal.notes && (
            <section className="rounded-3xl border border-[#E9D5FF] dark:border-[#362B54] bg-white dark:bg-[#1E1B2E] p-5">
              <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">Notes</h3>
              <p className="mt-2 whitespace-pre-wrap text-sm text-slate-600 dark:text-slate-300">
                {deal.notes}
              </p>
            </section>
          )}
        </div>

        {previewUrl && (
          <div
            className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4"
            onClick={() => setPreviewUrl(null)}
          >
            <div
              className="relative h-[80vh] w-full max-w-4xl overflow-hidden rounded-2xl bg-white dark:bg-[#1E1B2E]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setPreviewUrl(null)}
                className="absolute right-3 top-3 z-10 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-slate-700 dark:text-slate-200 shadow hover:bg-white dark:hover:bg-[#1E1B2E]"
              >
                Fermer ✕
              </button>
              <iframe
                src={previewUrl}
                title="Aperçu Google Drive"
                className="h-full w-full"
                allow="autoplay"
              />
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

