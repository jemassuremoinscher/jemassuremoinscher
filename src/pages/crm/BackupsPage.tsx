import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { DatabaseBackup, Download, Loader2, RefreshCw, ShieldCheck } from "lucide-react";

interface Snapshot {
  id: string;
  created_at: string;
  trigger_source: string;
  status: string;
  tables: Record<string, number> | null;
  row_count: number;
  file_path: string | null;
  size_bytes: number | null;
  error_message: string | null;
}

const formatSize = (bytes: number | null) => {
  if (!bytes) return "—";
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
};

export default function BackupsPage() {
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("backup_snapshots")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(60);
    if (error) toast.error("Impossible de charger l'historique des sauvegardes");
    setSnapshots((data as unknown as Snapshot[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Suivi temps réel : statut « en cours » puis « terminée » sans rafraîchir
  useEffect(() => {
    const channel = supabase
      .channel("backup-snapshots-live")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "backup_snapshots" },
        (payload) => {
          const row = payload.new as Snapshot | undefined;
          if (payload.eventType === "DELETE") {
            const oldId = (payload.old as { id?: string })?.id;
            setSnapshots((prev) => prev.filter((s) => s.id !== oldId));
            return;
          }
          if (!row?.id) return;
          setSnapshots((prev) => {
            const exists = prev.some((s) => s.id === row.id);
            if (exists) return prev.map((s) => (s.id === row.id ? { ...s, ...row } : s));
            return [row, ...prev];
          });
          if (payload.eventType === "UPDATE" && row.status === "success") {
            toast.success("Sauvegarde terminée");
          }
          if (payload.eventType === "UPDATE" && row.status === "error") {
            toast.error("Sauvegarde en échec", { description: row.error_message ?? undefined });
          }
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const runningSnapshot = snapshots.find((s) => s.status === "running");

  const runBackup = async () => {
    setRunning(true);
    toast.info("Sauvegarde lancée…");
    try {
      const { error } = await supabase.functions.invoke("db-backup", { body: {} });
      if (error) throw error;
      await load();
    } catch (e) {
      toast.error("Échec de la sauvegarde", {
        description: e instanceof Error ? e.message : undefined,
      });
    } finally {
      setRunning(false);
    }
  };


  const download = async (snapshot: Snapshot) => {
    if (!snapshot.file_path) return;
    const { data, error } = await supabase.storage
      .from("db-backups")
      .createSignedUrl(snapshot.file_path, 300);
    if (error || !data) {
      toast.error("Lien de téléchargement indisponible");
      return;
    }
    window.open(data.signedUrl, "_blank", "noopener");
  };

  return (
    <div className="space-y-6 p-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold">
            <DatabaseBackup className="h-6 w-6 text-[#7C3AED]" />
            Sauvegardes
          </h1>
          <p className="text-sm text-muted-foreground">
            Sauvegarde automatique quotidienne (03h00) · conservation 30 jours
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={load} disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Actualiser
          </Button>
          <Button onClick={runBackup} disabled={running}>
            {running ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <ShieldCheck className="mr-2 h-4 w-4" />
            )}
            Sauvegarder maintenant
          </Button>
        </div>
      </header>

      <Card className="overflow-hidden rounded-3xl">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left">
              <tr>
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium">Origine</th>
                <th className="p-4 font-medium">Statut</th>
                <th className="p-4 font-medium">Lignes</th>
                <th className="p-4 font-medium">Taille</th>
                <th className="p-4 font-medium text-right">Restauration</th>
              </tr>
            </thead>
            <tbody>
              {snapshots.length === 0 && !loading && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground">
                    Aucune sauvegarde pour le moment. Lance-en une avec « Sauvegarder maintenant ».
                  </td>
                </tr>
              )}
              {snapshots.map((s) => (
                <tr key={s.id} className="border-t">
                  <td className="p-4 whitespace-nowrap">
                    {new Date(s.created_at).toLocaleString("fr-FR")}
                  </td>
                  <td className="p-4 capitalize">{s.trigger_source}</td>
                  <td className="p-4">
                    <Badge
                      variant={s.status === "success" ? "default" : s.status === "error" ? "destructive" : "secondary"}
                    >
                      {s.status === "success" ? "Réussie" : s.status === "error" ? "Échec" : "En cours"}
                    </Badge>
                    {s.error_message && (
                      <div className="mt-1 max-w-xs truncate text-xs text-destructive" title={s.error_message}>
                        {s.error_message}
                      </div>
                    )}
                  </td>
                  <td className="p-4">{s.row_count.toLocaleString("fr-FR")}</td>
                  <td className="p-4">{formatSize(s.size_bytes)}</td>
                  <td className="p-4 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={!s.file_path}
                      onClick={() => download(s)}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Télécharger
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <p className="text-xs text-muted-foreground">
        Chaque sauvegarde est un export complet (JSON) des tables métier : contacts, deals, tâches,
        documents, contrats, devis, rappels, abonnés, commerciaux et rôles. Pour restaurer, télécharge
        le fichier et demande-moi la réinjection des tables souhaitées.
      </p>
    </div>
  );
}
