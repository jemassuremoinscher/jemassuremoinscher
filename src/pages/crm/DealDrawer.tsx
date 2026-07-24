import { useEffect, useRef, useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Mail, Phone, Send, CheckCircle2, XCircle, Clock, FileText, Upload, Download } from "lucide-react";
import type { DealRow } from "./types";
import { STAGES } from "./types";

const CHECKLISTS: Record<string, string[]> = {
  auto: ["Carte Grise", "Permis de conduire", "Relevé d'Information", "RIB"],
  moto: ["Carte Grise", "Permis (A/A2)", "Relevé d'Information", "RIB"],
  habitation: ["CNI", "Justificatif de domicile", "RIB"],
  sante: ["Attestation Vitale", "RIB", "Mandat SEPA"],
  mutuelle: ["Attestation Vitale", "RIB", "Mandat SEPA"],
};

interface Doc {
  id: string;
  name: string;
  status: "manquant" | "attente" | "valide";
  file_path?: string | null;
  virtual?: boolean;
}
interface Activity {
  id: string;
  action_type: string;
  description: string | null;
  created_at: string;
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
  const [docs, setDocs] = useState<Doc[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!deal || !open) return;
    setLoading(true);
    Promise.all([
      supabase.from("documents").select("id,name,status").eq("deal_id", deal.id),
      supabase
        .from("activities")
        .select("id,action_type,description,created_at")
        .eq("deal_id", deal.id)
        .order("created_at", { ascending: false })
        .limit(20),
    ]).then(([d, a]) => {
      const dbDocs = (d.data ?? []) as Doc[];
      // Merge with expected checklist if the deal is at 'subscription'
      const key = deal.insurance_type.toLowerCase();
      const expected = CHECKLISTS[key] ?? [];
      const merged: Doc[] = [
        ...dbDocs,
        ...expected
          .filter((n) => !dbDocs.some((x) => x.name === n))
          .map((n) => ({ id: `virt-${n}`, name: n, status: "manquant" as const })),
      ];
      setDocs(merged);
      setActivities((a.data ?? []) as Activity[]);
      setLoading(false);
    });
  }, [deal, open]);

  if (!deal) return null;
  const contact = deal.contacts;
  const stage = STAGES.find((s) => s.id === deal.stage);

  const validated = docs.filter((d) => d.status === "valide").length;
  const total = Math.max(docs.length, 1);
  const completion = Math.round((validated / total) * 100);

  const statusIcon = (s: Doc["status"]) =>
    s === "valide" ? (
      <CheckCircle2 className="h-4 w-4 text-green-600" />
    ) : s === "attente" ? (
      <Clock className="h-4 w-4 text-amber-600" />
    ) : (
      <XCircle className="h-4 w-4 text-red-500" />
    );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-xl overflow-y-auto p-0">
        <SheetHeader className="border-b border-[#E9D5FF] bg-[#FAF5FF] px-6 py-5">
          <SheetTitle className="text-left">
            <div className="text-xs uppercase tracking-wide text-[#7C3AED]">
              {deal.insurance_type}
            </div>
            <div className="mt-1 text-xl font-semibold text-slate-900">
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
              <Badge variant="outline" className="rounded-full border-[#E9D5FF]">
                Score {deal.lead_score}
              </Badge>
            )}
            {contact?.source && (
              <Badge variant="outline" className="rounded-full border-[#E9D5FF]">
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
                className="flex items-center gap-3 rounded-2xl border border-[#E9D5FF] bg-white px-4 py-3 text-sm text-slate-700 hover:bg-[#FAF5FF]"
              >
                <Mail className="h-4 w-4 text-[#7C3AED]" />
                <span className="truncate">{contact.email}</span>
              </a>
            )}
            {contact?.phone && (
              <a
                href={`tel:${contact.phone}`}
                className="flex items-center gap-3 rounded-2xl border border-[#E9D5FF] bg-white px-4 py-3 text-sm text-slate-700 hover:bg-[#FAF5FF]"
              >
                <Phone className="h-4 w-4 text-[#7C3AED]" />
                {contact.phone}
              </a>
            )}
          </section>

          {/* GED */}
          <section className="rounded-3xl border border-[#E9D5FF] bg-white p-5">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                <FileText className="h-4 w-4 text-[#7C3AED]" />
                Dossier documentaire
              </h3>
              <span className="text-xs font-semibold text-[#5B21B6]">
                {completion}%
              </span>
            </div>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-[#F3E8FF]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#7C3AED] to-[#A78BFA]"
                style={{ width: `${completion}%` }}
              />
            </div>

            <ul className="mt-4 space-y-2">
              {loading && (
                <li className="text-xs text-slate-400">Chargement…</li>
              )}
              {!loading && docs.length === 0 && (
                <li className="text-xs text-slate-400">
                  Aucun document requis à ce stade.
                </li>
              )}
              {docs.map((d) => (
                <li
                  key={d.id}
                  className="flex items-center justify-between rounded-2xl bg-[#FAF5FF]/60 px-3 py-2 text-sm"
                >
                  <span className="flex items-center gap-2 text-slate-700">
                    {statusIcon(d.status)}
                    {d.name}
                  </span>
                  <span className="text-[11px] uppercase tracking-wide text-slate-400">
                    {d.status}
                  </span>
                </li>
              ))}
            </ul>

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
                className="rounded-full border-[#E9D5FF]"
                disabled
              >
                Relancer par SMS
              </Button>
            </div>
          </section>

          {/* Timeline */}
          <section className="rounded-3xl border border-[#E9D5FF] bg-white p-5">
            <h3 className="text-sm font-semibold text-slate-800">Timeline</h3>
            <ol className="mt-4 space-y-3">
              <li className="flex gap-3 text-sm">
                <span className="mt-1 h-2 w-2 rounded-full bg-[#7C3AED]" />
                <div>
                  <div className="text-slate-800">Lead créé</div>
                  <div className="text-[11px] text-slate-400">
                    {new Date(deal.created_at).toLocaleString("fr-FR")}
                  </div>
                </div>
              </li>
              {activities.map((a) => (
                <li key={a.id} className="flex gap-3 text-sm">
                  <span className="mt-1 h-2 w-2 rounded-full bg-[#C4B5FD]" />
                  <div>
                    <div className="text-slate-800">
                      {a.action_type}
                      {a.description ? ` — ${a.description}` : ""}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {new Date(a.created_at).toLocaleString("fr-FR")}
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {deal.notes && (
            <section className="rounded-3xl border border-[#E9D5FF] bg-white p-5">
              <h3 className="text-sm font-semibold text-slate-800">Notes</h3>
              <p className="mt-2 whitespace-pre-wrap text-sm text-slate-600">
                {deal.notes}
              </p>
            </section>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
