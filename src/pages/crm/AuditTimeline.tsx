import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { History, ArrowRight, User, Plus, Trash2, RotateCcw, Pencil } from "lucide-react";

interface AuditEntry {
  id: string;
  action: string;
  field_name: string | null;
  old_value: string | null;
  new_value: string | null;
  actor_email: string | null;
  created_at: string;
}

const STAGE_LABELS: Record<string, string> = {
  lead: "Lead",
  qualified: "Qualifié",
  quote_sent: "Devis envoyé",
  negotiation: "Négociation",
  won: "Gagné",
  lost: "Perdu",
};

const FIELD_LABELS: Record<string, string> = {
  stage: "Étape",
  assigned_to: "Responsable",
  notes: "Notes",
  estimated_commission: "Commission estimée",
  actual_commission: "Commission réelle",
  insurance_type: "Type d'assurance",
  lead_score: "Score",
  deleted_at: "Suppression",
};

function actionIcon(action: string) {
  const cls = "h-3.5 w-3.5";
  switch (action) {
    case "created": return <Plus className={cls + " text-green-600"} />;
    case "stage_changed": return <ArrowRight className={cls + " text-[#7C3AED]"} />;
    case "assigned": return <User className={cls + " text-blue-600"} />;
    case "deleted": return <Trash2 className={cls + " text-red-500"} />;
    case "restored": return <RotateCcw className={cls + " text-amber-600"} />;
    default: return <Pencil className={cls + " text-slate-500"} />;
  }
}

function formatValue(field: string | null, value: string | null): string {
  if (!value) return "—";
  if (field === "stage") return STAGE_LABELS[value] ?? value;
  if (field === "assigned_to") return value.slice(0, 8) + "…";
  if (field === "notes" && value.length > 80) return value.slice(0, 80) + "…";
  return value;
}

function describe(e: AuditEntry): string {
  if (e.action === "created") return "Deal créé";
  if (e.action === "stage_changed")
    return `Étape : ${formatValue("stage", e.old_value)} → ${formatValue("stage", e.new_value)}`;
  if (e.action === "assigned")
    return e.new_value ? "Assigné à un commercial" : "Désassigné";
  if (e.action === "deleted") return "Envoyé en corbeille";
  if (e.action === "restored") return "Restauré depuis la corbeille";
  const label = FIELD_LABELS[e.field_name ?? ""] ?? e.field_name ?? "champ";
  return `${label} modifié`;
}

export function AuditTimeline({ dealId }: { dealId: string }) {
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const { data } = await supabase
        .from("deal_audit_log")
        .select("id,action,field_name,old_value,new_value,actor_email,created_at")
        .eq("deal_id", dealId)
        .order("created_at", { ascending: false })
        .limit(100);
      if (!cancelled) {
        setEntries((data ?? []) as AuditEntry[]);
        setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [dealId]);

  return (
    <section className="rounded-3xl border border-[#E9D5FF] bg-white p-5">
      <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-800">
        <History className="h-4 w-4 text-[#7C3AED]" />
        Historique d'audit
        <span className="ml-auto text-xs font-normal text-slate-400">
          {loading ? "…" : `${entries.length} évènement${entries.length > 1 ? "s" : ""}`}
        </span>
      </h3>

      {!loading && entries.length === 0 && (
        <p className="mt-3 text-xs text-slate-400">Aucun historique disponible.</p>
      )}

      <ol className="mt-4 space-y-3">
        {entries.map((e) => {
          const showDiff =
            e.action === "updated" &&
            (e.old_value || e.new_value) &&
            e.field_name !== "notes";
          return (
            <li key={e.id} className="flex gap-3 text-sm">
              <span className="mt-1 grid h-6 w-6 flex-shrink-0 place-items-center rounded-full bg-[#F3E8FF]">
                {actionIcon(e.action)}
              </span>
              <div className="min-w-0 flex-1">
                <div className="text-slate-800">{describe(e)}</div>
                {showDiff && (
                  <div className="mt-0.5 text-[11px] text-slate-500">
                    {formatValue(e.field_name, e.old_value)}{" → "}
                    <span className="font-medium text-slate-700">
                      {formatValue(e.field_name, e.new_value)}
                    </span>
                  </div>
                )}
                <div className="mt-0.5 text-[11px] text-slate-400">
                  {new Date(e.created_at).toLocaleString("fr-FR")}
                  {e.actor_email && <> · par {e.actor_email}</>}
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
