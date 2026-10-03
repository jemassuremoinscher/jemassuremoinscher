import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Shield, Download, Search, FlaskConical } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Row = {
  id: string;
  email: string;
  full_name: string | null;
  rgpd_consent: boolean;
  source: string | null;
  created_at: string;
};

// Réponse de la fonction gdpr-contact en mode simulation (phase 1 : aucun
// effacement réel n'est possible depuis cette page).
type Simulation = {
  found: boolean;
  manual_review: boolean;
  manual_reasons: string[];
  truncated: string[];
  tables: { table: string; count: number; planned_action: string }[];
  storage_files: { count: number; planned_action: string };
};

const invokeGdpr = async (action: "export" | "simulate", email: string) => {
  const { data, error } = await supabase.functions.invoke("gdpr-contact", {
    body: { action, email },
  });
  if (error) {
    // Le message utile est dans le corps JSON de la réponse d'erreur.
    let message = error.message;
    try {
      const body = await (error as { context?: Response }).context?.json();
      if (body?.error) message = body.error;
    } catch {
      /* corps illisible : message générique */
    }
    throw new Error(message);
  }
  return data;
};

export default function RgpdPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [freeEmail, setFreeEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [simulation, setSimulation] = useState<{ email: string; result: Simulation } | null>(null);

  const load = async () => {
    const { data } = await supabase
      .from("contacts")
      .select("id,email,full_name,rgpd_consent,source,created_at")
      .order("created_at", { ascending: false })
      .limit(2000);
    setRows((data ?? []) as Row[]);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return rows;
    return rows.filter(
      (r) =>
        r.email?.toLowerCase().includes(s) ||
        r.full_name?.toLowerCase().includes(s)
    );
  }, [rows, q]);

  const stats = useMemo(
    () => ({
      total: rows.length,
      withConsent: rows.filter((r) => r.rgpd_consent).length,
      withoutConsent: rows.filter((r) => !r.rgpd_consent).length,
    }),
    [rows]
  );

  const exportData = async (email: string) => {
    if (!email.trim()) return;
    setBusy(true);
    try {
      const data = await invokeGdpr("export", email);
      if (!data?.found) {
        toast.info("Aucune donnée trouvée pour cet email");
        return;
      }
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `rgpd-${email.trim().toLowerCase()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Export téléchargé");
    } catch (e) {
      toast.error(`Export impossible : ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setBusy(false);
    }
  };

  const simulateErasure = async (email: string) => {
    if (!email.trim()) return;
    setBusy(true);
    try {
      const result = (await invokeGdpr("simulate", email)) as Simulation;
      setSimulation({ email: email.trim().toLowerCase(), result });
    } catch (e) {
      toast.error(`Simulation impossible : ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col overflow-y-auto px-6 py-6">
      <div className="flex items-start gap-3">
        <div className="rounded-2xl bg-[#F5F3FF] dark:bg-[#262140] p-2.5">
          <Shield className="h-5 w-5 text-[#7C3AED] dark:text-[#C4B5FD]" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
            RGPD & Conformité
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Droit d'accès (export) et simulation du droit à l'effacement. Aucune donnée n'est
            supprimée depuis cette page.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-3xl border border-[#E9D5FF] dark:border-[#362B54] bg-white dark:bg-[#1E1B2E] p-5">
          <div className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Total contacts
          </div>
          <div className="mt-2 text-2xl font-semibold">{stats.total}</div>
        </div>
        <div className="rounded-3xl border border-emerald-200 bg-white dark:bg-[#1E1B2E] p-5">
          <div className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Consentement RGPD
          </div>
          <div className="mt-2 text-2xl font-semibold text-emerald-700">
            {stats.withConsent}
          </div>
        </div>
        <div className="rounded-3xl border border-amber-200 bg-white dark:bg-[#1E1B2E] p-5">
          <div className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Sans consentement
          </div>
          <div className="mt-2 text-2xl font-semibold text-amber-700">
            {stats.withoutConsent}
          </div>
        </div>
      </div>

      <form
        className="mt-6 flex flex-wrap items-center gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          simulateErasure(freeEmail);
        }}
      >
        <Input
          type="email"
          value={freeEmail}
          onChange={(e) => setFreeEmail(e.target.value)}
          placeholder="Email de la personne (même sans fiche contact)"
          className="max-w-md rounded-full"
        />
        <Button
          type="button"
          variant="outline"
          disabled={busy || !freeEmail.trim()}
          onClick={() => exportData(freeEmail)}
          className="rounded-full"
        >
          <Download className="mr-1 h-3.5 w-3.5" />
          Export
        </Button>
        <Button type="submit" variant="outline" disabled={busy || !freeEmail.trim()} className="rounded-full">
          <FlaskConical className="mr-1 h-3.5 w-3.5" />
          Simuler l'effacement
        </Button>
      </form>

      <div className="mt-6 flex items-center gap-2">
        <div className="relative flex-1 max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Rechercher un email ou un nom"
            className="rounded-full pl-9"
          />
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-3xl border border-[#E9D5FF] dark:border-[#362B54] bg-white dark:bg-[#1E1B2E]">
        <table className="w-full text-sm">
          <thead className="bg-[#FAF5FF] dark:bg-[#13111C] text-left text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
            <tr>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3">Source</th>
              <th className="px-4 py-3">Consentement</th>
              <th className="px-4 py-3">Créé</th>
              <th className="px-4 py-3 text-right">Actions RGPD</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-[#362B54]">
            {filtered.slice(0, 200).map((r) => (
              <tr key={r.id} className="hover:bg-[#FAF5FF]/60 dark:hover:bg-[#262140]/60">
                <td className="px-4 py-3">
                  <div className="font-medium text-slate-900 dark:text-slate-50">
                    {r.full_name || "—"}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">{r.email}</div>
                </td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{r.source ?? "—"}</td>
                <td className="px-4 py-3">
                  {r.rgpd_consent ? (
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs text-emerald-700">
                      Oui
                    </span>
                  ) : (
                    <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs text-amber-700">
                      Non
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-xs text-slate-500 dark:text-slate-400">
                  {new Date(r.created_at).toLocaleDateString("fr-FR")}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={busy}
                      onClick={() => exportData(r.email)}
                      className="rounded-full"
                    >
                      <Download className="mr-1 h-3.5 w-3.5" />
                      Export
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={busy}
                      onClick={() => simulateErasure(r.email)}
                      className="rounded-full"
                    >
                      <FlaskConical className="mr-1 h-3.5 w-3.5" />
                      Simuler l'effacement
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-slate-500 dark:text-slate-400">
                  Aucun contact
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {filtered.length > 200 && (
          <div className="border-t border-slate-100 dark:border-[#362B54] px-4 py-2 text-center text-xs text-slate-500 dark:text-slate-400">
            200 premiers affichés sur {filtered.length} — affinez votre recherche
          </div>
        )}
      </div>

      <Dialog open={!!simulation} onOpenChange={(open) => !open && setSimulation(null)}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Simulation d'effacement</DialogTitle>
            <DialogDescription>
              {simulation?.email} : simulation uniquement, aucune donnée n'a été modifiée ni supprimée.
            </DialogDescription>
          </DialogHeader>
          {simulation && !simulation.result.found && (
            <p className="text-sm text-slate-600 dark:text-slate-300">Aucune donnée trouvée pour cet email.</p>
          )}
          {simulation?.result.found && (
            <div className="space-y-3 text-sm">
              {simulation.result.manual_review && (
                <div className="rounded-2xl bg-amber-50 px-3 py-2 text-amber-800">
                  <div className="font-medium">Traitement manuel</div>
                  <div>{simulation.result.manual_reasons.join(" ; ")}. Rien ne serait effacé automatiquement.</div>
                </div>
              )}
              {simulation.result.truncated.length > 0 && (
                <div className="rounded-2xl bg-red-50 px-3 py-2 text-red-700">
                  Recherche tronquée sur : {simulation.result.truncated.join(", ")}.
                </div>
              )}
              <table className="w-full">
                <thead className="text-left text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  <tr>
                    <th className="py-1">Table</th>
                    <th className="py-1 text-right">Lignes</th>
                    <th className="py-1 pl-4">Action prévue (phase 2)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-[#362B54]">
                  {simulation.result.tables.map((t) => (
                    <tr key={t.table}>
                      <td className="py-1 font-mono text-xs">{t.table}</td>
                      <td className="py-1 text-right">{t.count}</td>
                      <td className="py-1 pl-4">{t.planned_action}</td>
                    </tr>
                  ))}
                  {simulation.result.storage_files.count > 0 && (
                    <tr>
                      <td className="py-1 font-mono text-xs">fichiers (crm-documents)</td>
                      <td className="py-1 text-right">{simulation.result.storage_files.count}</td>
                      <td className="py-1 pl-4">{simulation.result.storage_files.planned_action}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
