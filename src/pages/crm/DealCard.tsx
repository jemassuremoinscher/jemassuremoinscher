import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Phone, Mail, Flame } from "lucide-react";
import type { DealRow } from "./types";

export function DealCard({
  deal,
  onOpen,
}: {
  deal: DealRow;
  onOpen: (d: DealRow) => void;
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

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => onOpen(deal)}
      className="group cursor-grab rounded-3xl border border-[#E9D5FF] bg-white p-4 shadow-sm hover:border-[#C4B5FD] hover:shadow-md active:cursor-grabbing"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-slate-900">
            {contact?.full_name ?? "Prospect"}
          </div>
          <div className="mt-0.5 text-[11px] uppercase tracking-wide text-[#7C3AED]">
            {deal.insurance_type}
          </div>
        </div>
        {hot && (
          <span className="flex shrink-0 items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-semibold text-red-600">
            <Flame className="h-3 w-3" />
            {deal.lead_score}
          </span>
        )}
      </div>

      <div className="mt-3 space-y-1 text-xs text-slate-500">
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

      <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
        <span>{new Date(deal.created_at).toLocaleDateString("fr-FR")}</span>
        {deal.estimated_commission != null && (
          <span className="rounded-full bg-[#F3E8FF] px-2 py-0.5 font-semibold text-[#5B21B6]">
            {deal.estimated_commission.toFixed(0)}€
          </span>
        )}
      </div>
    </div>
  );
}
