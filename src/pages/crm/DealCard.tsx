import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Phone, Mail, MailCheck, Flame, UserCircle2, AlertTriangle } from "lucide-react";
import type { DealRow } from "./types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type AgentOption = { id: string; user_id: string | null; full_name: string };

export function DealCard({
  deal,
  onOpen,
  agents = [],
  onAssigned,
  overdue = false,
  hasAutoEmail = false,
}: {
  deal: DealRow;
  onOpen: (d: DealRow) => void;
  agents?: AgentOption[];
  onAssigned?: () => void;
  overdue?: boolean;
  hasAutoEmail?: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: deal.id, data: { deal } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const contact = deal.contacts;
  const hot = (deal.lead_score ?? 0) >= 80;

  const currentAgent =
    agents.find((a) => (a.user_id ?? a.id) === deal.assigned_to)?.full_name ?? null;

  const handleAssign = async (value: string) => {
    const { error } = await supabase
      .from("deals")
      .update({ assigned_to: value || null })
      .eq("id", deal.id);
    if (error) return toast.error("Assignation impossible : " + error.message);
    toast.success(value ? "Deal assigné" : "Assignation retirée");
    onAssigned?.();
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => onOpen(deal)}
      className="group cursor-grab rounded-3xl border border-[#E9D5FF] dark:border-[#362B54] bg-white dark:bg-[#1E1B2E] p-4 shadow-sm hover:border-[#C4B5FD] hover:shadow-md active:cursor-grabbing"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-slate-900 dark:text-slate-50">
            {contact?.full_name ?? "Prospect"}
          </div>
          <div className="mt-0.5 text-[11px] uppercase tracking-wide text-[#7C3AED] dark:text-[#C4B5FD]">
            {deal.insurance_type}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          {hasAutoEmail && (
            <span
              className="flex items-center gap-1 rounded-full bg-[#F3E8FF] dark:bg-[#262140] px-2 py-0.5 text-[10px] font-semibold text-[#7C3AED] dark:text-[#C4B5FD]"
              title="Email automatique envoyé pour ce deal"
            >
              <MailCheck className="h-3 w-3" />
            </span>
          )}
          {overdue && (
            <span
              className="flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-semibold text-red-600"
              title="Tâche en retard"
            >
              <AlertTriangle className="h-3 w-3" />
            </span>
          )}
          {hot && (
            <span className="flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-semibold text-red-600">
              <Flame className="h-3 w-3" />
              {deal.lead_score}
            </span>
          )}
        </div>
      </div>

      <div className="mt-3 space-y-1 text-xs text-slate-500 dark:text-slate-400">
        {contact?.email && (
          <div className="flex items-center gap-1.5 truncate">
            <Mail className="h-3 w-3 shrink-0" />
            <span className="truncate">{contact.email}</span>
          </div>
        )}
        {contact?.phone && (
          <div className="flex items-center gap-1.5">
            <Phone className="h-3 w-3" />
            {contact.phone}
          </div>
        )}
      </div>

      {agents.length > 0 && (
        <div
          className="mt-3 flex items-center gap-1.5"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
        >
          <UserCircle2 className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
          <select
            value={deal.assigned_to ?? ""}
            onChange={(e) => handleAssign(e.target.value)}
            className="w-full truncate rounded-full border border-[#E9D5FF] dark:border-[#362B54] bg-white dark:bg-[#1E1B2E] px-2 py-0.5 text-[11px] text-slate-600 dark:text-slate-300 hover:border-[#C4B5FD] focus:outline-none focus:ring-1 focus:ring-[#7C3AED]"
            title={currentAgent ?? "Non assigné"}
          >
            <option value="">Non assigné</option>
            {agents.filter((a) => a.user_id).map((a) => (
              <option key={a.id} value={a.user_id!}>
                {a.full_name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500">
        <span>{new Date(deal.created_at).toLocaleDateString("fr-FR")}</span>
        {deal.estimated_commission != null && (
          <span className="rounded-full bg-[#F3E8FF] dark:bg-[#262140] px-2 py-0.5 font-semibold text-[#5B21B6] dark:text-[#D8B4FE]">
            {deal.estimated_commission.toFixed(0)}€
          </span>
        )}
      </div>
    </div>
  );
}
