import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useOutletContext, useSearchParams } from "react-router-dom";
import { STAGES, type DealRow, type StageId } from "./types";
import { KanbanColumn } from "./KanbanColumn";
import { DealCard } from "./DealCard";
import { DealDrawer } from "./DealDrawer";
import { NewDealDialog } from "./NewDealDialog";
import { TasksWidget } from "@/components/admin/crm/TasksWidget";
import { fetchOverdueDealIds, fetchQualiteParSource } from "@/lib/crmApi";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";



type Ctx = { query: string };

export default function CrmKanban() {
  const { query } = useOutletContext<Ctx>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [deals, setDeals] = useState<DealRow[]>([]);
  const [agents, setAgents] = useState<{ id: string; user_id: string | null; full_name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeDeal, setActiveDeal] = useState<DealRow | null>(null);
  const [openDeal, setOpenDeal] = useState<DealRow | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerTab, setDrawerTab] = useState<"overview" | "advice">("overview");
  const [newOpen, setNewOpen] = useState(false);

  // Une seule requête agrégée pour tous les deals affichés (jamais une requête par carte).
  const { data: overdueDealIds } = useQuery({
    queryKey: ["deal-tasks-overdue"],
    queryFn: fetchOverdueDealIds,
    refetchInterval: 60000,
  });

  const { data: qualiteParSource } = useQuery({
    queryKey: ["qualite-par-source"],
    queryFn: fetchQualiteParSource,
  });

  // % de coordonnées erronées ce mois, toutes sources confondues (moyenne
  // pondérée sur les volumes, pas une moyenne des pourcentages par source).
  const monthlyErrorPct = useMemo(() => {
    if (!qualiteParSource || qualiteParSource.length === 0) return null;
    const totals = qualiteParSource.reduce(
      (acc, r) => ({ total: acc.total + r.total_leads, erronees: acc.erronees + r.coordonnees_erronees }),
      { total: 0, erronees: 0 }
    );
    return totals.total > 0 ? Math.round((totals.erronees / totals.total) * 100) : 0;
  }, [qualiteParSource]);

  // Global filters (seed from URL so dashboard links can preselect)
  const [agentFilter, setAgentFilter] = useState<string>(searchParams.get("agent") ?? "all");
  const [sourceFilter, setSourceFilter] = useState<string>(searchParams.get("source") ?? "all");
  const [stageFilter, setStageFilter] = useState<string>(searchParams.get("stage") ?? "all");
  const [dateFilter, setDateFilter] = useState<string>(searchParams.get("date") ?? "all");

  // keep URL in sync
  useEffect(() => {
    const next = new URLSearchParams(searchParams);
    const setOrDel = (k: string, v: string) => (v !== "all" ? next.set(k, v) : next.delete(k));
    setOrDel("agent", agentFilter);
    setOrDel("source", sourceFilter);
    setOrDel("stage", stageFilter);
    setOrDel("date", dateFilter);
    setSearchParams(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agentFilter, sourceFilter, stageFilter, dateFilter]);



  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  );

  const load = async () => {
    const [d, a] = await Promise.all([
      supabase
        .from("deals")
        .select(
          "id,contact_id,assigned_to,insurance_type,stage,lead_score,estimated_commission,source_type,source_id,notes,created_at,updated_at,contacts(id,full_name,email,phone,source,tags)"
        )
        .is("deleted_at", null)
        .order("lead_score", { ascending: false, nullsFirst: false })
        .order("created_at", { ascending: false })
        .limit(500),
      supabase.from("sales_agents").select("id,user_id,full_name").eq("is_active", true),
    ]);
    if (d.error) toast.error("Erreur de chargement des deals");
    setDeals((d.data ?? []) as unknown as DealRow[]);
    setAgents((a.data ?? []) as any);
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sources = useMemo(
    () => Array.from(new Set(deals.map((d) => d.contacts?.source ?? "inconnu"))).sort(),
    [deals]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const days = dateFilter === "7d" ? 7 : dateFilter === "30d" ? 30 : dateFilter === "90d" ? 90 : null;
    const cutoff = days ? Date.now() - days * 86400_000 : 0;
    return deals.filter((d) => {
      if (agentFilter !== "all") {
        const userId = agents.find((a) => a.id === agentFilter)?.user_id;
        if (d.assigned_to !== userId && d.assigned_to !== agentFilter) return false;
      }
      if (sourceFilter !== "all" && (d.contacts?.source ?? "inconnu") !== sourceFilter) return false;
      if (stageFilter !== "all" && d.stage !== stageFilter) return false;
      if (cutoff && new Date(d.created_at).getTime() < cutoff) return false;
      if (!q) return true;
      const c = d.contacts;
      return (
        c?.full_name?.toLowerCase().includes(q) ||
        c?.email?.toLowerCase().includes(q) ||
        c?.phone?.toLowerCase().includes(q) ||
        d.insurance_type.toLowerCase().includes(q)
      );
    });
  }, [deals, query, agentFilter, sourceFilter, stageFilter, dateFilter, agents]);

  const byStage = useMemo(() => {
    const map = new Map<StageId, DealRow[]>();
    STAGES.forEach((s) => map.set(s.id, []));
    filtered.forEach((d) => map.get(d.stage)?.push(d));
    return map;
  }, [filtered]);

  const onDragStart = (e: DragStartEvent) => {
    const d = deals.find((x) => x.id === e.active.id);
    if (d) setActiveDeal(d);
  };

  const onDragEnd = async (e: DragEndEvent) => {
    setActiveDeal(null);
    const { active, over } = e;
    if (!over) return;
    const dealId = String(active.id);
    const overId = String(over.id);
    const current = deals.find((d) => d.id === dealId);
    if (!current) return;
    // Determine target stage: over another card or the column itself
    let target: StageId | null = null;
    if (STAGES.some((s) => s.id === overId)) target = overId as StageId;
    else {
      const overDeal = deals.find((d) => d.id === overId);
      target = overDeal?.stage ?? null;
    }
    if (!target || target === current.stage) return;

    const prev = deals;
    setDeals((ds) =>
      ds.map((d) => (d.id === dealId ? { ...d, stage: target! } : d))
    );

    const { error } = await supabase
      .from("deals")
      .update({ stage: target })
      .eq("id", dealId);
    if (error) {
      setDeals(prev);
      toast.error("Impossible de déplacer ce deal");
      return;
    }
    toast.success(`Deplacé vers ${STAGES.find((s) => s.id === target)?.label}`);
  };

  const openDrawer = (d: DealRow, tab: "overview" | "advice" = "overview") => {
    setOpenDeal(d);
    setDrawerTab(tab);
    setDrawerOpen(true);
  };

  const navigateToDeal = (dealId: string, tab: "overview" | "advice" = "overview") => {
    const target = deals.find((d) => d.id === dealId);
    if (target) openDrawer(target, tab);
    else toast.error("Ce deal n'est plus disponible (déplacé ou supprimé)");
  };

  // Deep-link /admin?deal=<id>&tab=advice (widgets dashboard, notifications) :
  // ouvre le drawer du deal correspondant une fois les deals chargés, sur
  // l'onglet demandé, puis nettoie l'URL.
  useEffect(() => {
    if (loading) return;
    const dealId = searchParams.get("deal");
    if (!dealId) return;
    const tab = searchParams.get("tab") === "advice" ? "advice" : "overview";
    navigateToDeal(dealId, tab);
    const next = new URLSearchParams(searchParams);
    next.delete("deal");
    next.delete("tab");
    setSearchParams(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, searchParams]);

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="flex items-center justify-between px-6 pt-6 pb-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
            Pipeline commercial
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {loading ? "Chargement…" : `${filtered.length} deals actifs`}
          </p>
        </div>
        <Button
          onClick={() => setNewOpen(true)}
          className="rounded-full bg-[#7C3AED] hover:bg-[#6D28D9]"
        >
          <Plus className="mr-1.5 h-4 w-4" />
          Nouveau deal
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-2 border-b border-[#E9D5FF] dark:border-[#362B54] bg-[#FAFAFF] dark:bg-[#13111C] px-6 py-3">
        <span className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">Filtres :</span>
        <select value={agentFilter} onChange={(e) => setAgentFilter(e.target.value)}
          className="h-8 rounded-full border border-[#E9D5FF] dark:border-[#362B54] bg-white dark:bg-[#1E1B2E] px-3 text-xs">
          <option value="all">Tous commerciaux</option>
          {agents.map((a) => <option key={a.id} value={a.id}>{a.full_name}</option>)}
        </select>
        <select value={sourceFilter} onChange={(e) => setSourceFilter(e.target.value)}
          className="h-8 rounded-full border border-[#E9D5FF] dark:border-[#362B54] bg-white dark:bg-[#1E1B2E] px-3 text-xs">
          <option value="all">Toutes sources</option>
          {sources.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={stageFilter} onChange={(e) => setStageFilter(e.target.value)}
          className="h-8 rounded-full border border-[#E9D5FF] dark:border-[#362B54] bg-white dark:bg-[#1E1B2E] px-3 text-xs">
          <option value="all">Toutes étapes</option>
          {STAGES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
        </select>
        <select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)}
          className="h-8 rounded-full border border-[#E9D5FF] dark:border-[#362B54] bg-white dark:bg-[#1E1B2E] px-3 text-xs">
          <option value="all">Toutes dates</option>
          <option value="7d">7 derniers jours</option>
          <option value="30d">30 derniers jours</option>
          <option value="90d">90 derniers jours</option>
        </select>
        {(agentFilter !== "all" || sourceFilter !== "all" || stageFilter !== "all" || dateFilter !== "all") && (
          <button
            onClick={() => { setAgentFilter("all"); setSourceFilter("all"); setStageFilter("all"); setDateFilter("all"); }}
            className="text-xs text-[#7C3AED] dark:text-[#C4B5FD] hover:underline"
          >
            Réinitialiser
          </button>
        )}
      </div>

      <div className="px-6 pt-4">
        <TasksWidget onNavigateToDeal={navigateToDeal} />
      </div>

      <div className="relative flex-1 overflow-x-auto">
        <DndContext
          sensors={sensors}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
        >
          <div className="relative flex min-w-max gap-4 px-6 pb-8">
            {STAGES.map((stage) => (
              <KanbanColumn
                key={stage.id}
                stage={stage}
                deals={byStage.get(stage.id) ?? []}
                onOpen={openDrawer}
                agents={agents}
                onAssigned={load}
                overdueDealIds={overdueDealIds}
                monthlyErrorPct={stage.id === "invalid_contact" ? monthlyErrorPct : undefined}
              />
            ))}
          </div>
          <DragOverlay>
            {activeDeal && (
              <div className="w-72">
                <DealCard deal={activeDeal} onOpen={() => {}} />
              </div>
            )}
          </DragOverlay>
        </DndContext>
      </div>

      <DealDrawer
        deal={openDeal}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        initialTab={drawerTab}
        onDeleted={load}
      />
      <NewDealDialog open={newOpen} onOpenChange={setNewOpen} onCreated={load} />
    </div>
  );
}
