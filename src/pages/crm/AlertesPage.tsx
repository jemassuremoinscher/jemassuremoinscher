import { useEffect, useMemo, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { AlertTriangle, CheckCircle2, RefreshCw, ExternalLink } from "lucide-react";

interface SiteError {
  id: string;
  page_path: string;
  error_type: string;
  message: string | null;
  insurance_type: string | null;
  context: Record<string, unknown> | null;
  resolved_at: string | null;
  created_at: string;
}

const TYPE_LABELS: Record<string, string> = {
  form_submit: "Envoi de formulaire",
  callback_submit: "Demande de rappel",
  runtime: "Erreur JavaScript",
  route_not_found: "Page introuvable (404)",
  chunk_load: "Chargement de page",
  edge_function: "Service backend",
};

const TYPE_TONE: Record<string, string> = {
  form_submit: "bg-destructive/10 text-destructive border-destructive/30",
  callback_submit: "bg-destructive/10 text-destructive border-destructive/30",
  chunk_load: "bg-amber-500/10 text-amber-700 border-amber-500/30",
  runtime: "bg-amber-500/10 text-amber-700 border-amber-500/30",
  route_not_found: "bg-muted text-muted-foreground border-border",
  edge_function: "bg-destructive/10 text-destructive border-destructive/30",
};

const AlertesPage = () => {
  const [rows, setRows] = useState<SiteError[]>([]);
  const [loading, setLoading] = useState(true);
  const [showResolved, setShowResolved] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const query = supabase
      .from("site_error_log")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(300);
    const { data, error } = showResolved ? await query : await query.is("resolved_at", null);
    if (error) {
      toast.error("Impossible de charger les alertes");
    } else {
      setRows((data ?? []) as unknown as SiteError[]);
    }
    setLoading(false);
  }, [showResolved]);

  useEffect(() => {
    void load();
  }, [load]);

  // Live feed: new failures appear instantly
  useEffect(() => {
    const channel = supabase
      .channel("site-error-log-feed")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "site_error_log" },
        (payload) => {
          const row = payload.new as unknown as SiteError;
          setRows((prev) => [row, ...prev]);
          toast.error("Nouvelle erreur détectée sur le site", {
            description: `${TYPE_LABELS[row.error_type] ?? row.error_type} — ${row.page_path}`,
          });
        }
      )
      .subscribe();
    return () => {
      void supabase.removeChannel(channel);
    };
  }, []);

  const resolve = async (id: string) => {
    const { error } = await supabase
      .from("site_error_log")
      .update({ resolved_at: new Date().toISOString() })
      .eq("id", id);
    if (error) {
      toast.error("Échec de la mise à jour");
      return;
    }
    setRows((prev) => (showResolved ? prev : prev.filter((r) => r.id !== id)));
    toast.success("Alerte marquée comme traitée");
  };

  const grouped = useMemo(() => {
    const map = new Map<string, number>();
    rows.filter((r) => !r.resolved_at).forEach((r) => {
      map.set(r.error_type, (map.get(r.error_type) ?? 0) + 1);
    });
    return [...map.entries()].sort((a, b) => b[1] - a[1]);
  }, [rows]);

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-destructive" />
            Alertes techniques
          </h1>
          <p className="text-sm text-muted-foreground">
            Formulaires en échec, pages cassées et erreurs JavaScript détectées sur le site public.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowResolved((v) => !v)}>
            {showResolved ? "Masquer les traitées" : "Afficher les traitées"}
          </Button>
          <Button variant="outline" size="sm" onClick={() => void load()}>
            <RefreshCw className="h-4 w-4 mr-1.5" /> Actualiser
          </Button>
        </div>
      </header>

      {grouped.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {grouped.map(([type, count]) => (
            <Card key={type} className="p-4 rounded-2xl">
              <div className="text-xs uppercase tracking-wide text-muted-foreground">
                {TYPE_LABELS[type] ?? type}
              </div>
              <div className="text-3xl font-bold text-foreground mt-1">{count}</div>
            </Card>
          ))}
        </div>
      )}

      <Card className="rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-sm text-muted-foreground">Chargement…</div>
        ) : rows.length === 0 ? (
          <div className="p-10 text-center">
            <CheckCircle2 className="h-10 w-10 text-primary mx-auto mb-3" />
            <p className="font-semibold text-foreground">Aucune alerte en cours</p>
            <p className="text-sm text-muted-foreground">Tous les formulaires et pages fonctionnent.</p>
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {rows.map((r) => (
              <li key={r.id} className="p-4 flex flex-wrap items-start gap-3">
                <Badge variant="outline" className={TYPE_TONE[r.error_type] ?? ""}>
                  {TYPE_LABELS[r.error_type] ?? r.error_type}
                </Badge>
                <div className="flex-1 min-w-[240px]">
                  <div className="font-medium text-foreground break-all flex items-center gap-1.5">
                    {r.page_path}
                    <a
                      href={r.page_path}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`Ouvrir ${r.page_path}`}
                      className="text-muted-foreground hover:text-primary"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                  {r.message && (
                    <p className="text-sm text-muted-foreground break-words">{r.message}</p>
                  )}
                  <p className="text-xs text-muted-foreground/80 mt-1">
                    {new Date(r.created_at).toLocaleString("fr-FR")}
                    {r.insurance_type ? ` • ${r.insurance_type}` : ""}
                  </p>
                </div>
                {r.resolved_at ? (
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                    Traitée
                  </Badge>
                ) : (
                  <Button size="sm" variant="ghost" onClick={() => void resolve(r.id)}>
                    <CheckCircle2 className="h-4 w-4 mr-1.5" /> Traiter
                  </Button>
                )}
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
};

export default AlertesPage;
