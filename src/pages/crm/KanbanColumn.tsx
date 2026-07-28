import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import type { DealRow } from "./types";
import { STAGES } from "./types";
import { DealCard, type AgentOption } from "./DealCard";

export function KanbanColumn({
  stage,
  deals,
  onOpen,
  agents,
  onAssigned,
  overdueDealIds,
}: {
  stage: (typeof STAGES)[number];
  deals: DealRow[];
  onOpen: (d: DealRow) => void;
  agents?: AgentOption[];
  onAssigned?: () => void;
  overdueDealIds?: Set<string>;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: stage.id });
  const total = deals.reduce((s, d) => s + (d.estimated_commission ?? 0), 0);

  return (
    <div
      ref={setNodeRef}
      className={`flex w-72 shrink-0 flex-col rounded-3xl border border-[#E9D5FF] dark:border-[#362B54] transition-colors ${
        isOver ? "bg-[#F3E8FF] dark:bg-[#262140]" : "bg-[#FAF5FF]/50 dark:bg-[#13111C]/50"
      }`}
    >
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ background: stage.accent }}
          />
          <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">
            {stage.label}
          </span>
          <span className="rounded-full bg-white dark:bg-[#1E1B2E] px-2 py-0.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
            {deals.length}
          </span>
        </div>
        {total > 0 && (
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
            {total.toFixed(0)}€
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 px-2 pb-3">
        <SortableContext
          items={deals.map((d) => d.id)}
          strategy={verticalListSortingStrategy}
        >
          {deals.map((d) => (
            <DealCard
              key={d.id}
              deal={d}
              onOpen={onOpen}
              agents={agents}
              onAssigned={onAssigned}
              overdue={overdueDealIds?.has(d.id)}
            />
          ))}
        </SortableContext>
        {deals.length === 0 && (
          <div className="grid h-24 place-items-center rounded-2xl border border-dashed border-[#E9D5FF] dark:border-[#362B54] text-xs text-slate-400 dark:text-slate-500">
            Glisser une carte ici
          </div>
        )}
      </div>
    </div>
  );
}
