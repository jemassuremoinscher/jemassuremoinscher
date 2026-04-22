import { useEffect, useMemo, useState } from "react";
import { AlertCircle, CheckCircle2, RefreshCw, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

type GeoAuditCheck = {
  id: string;
  category: string;
  file: string;
  description: string;
  pass: boolean;
  expected: string;
  actual: string | null;
};

type GeoAuditReport = {
  generatedAt: string;
  score: number;
  status: "excellent" | "good" | "warning" | "critical";
  summary: {
    totalChecks: number;
    passedChecks: number;
    failedChecks: number;
    auditedFiles: number;
    staticRoutes: number;
  };
  mismatches: GeoAuditCheck[];
};

const statusConfig = {
  excellent: { label: "Fiable", badge: "default" as const },
  good: { label: "Solide", badge: "secondary" as const },
  warning: { label: "À surveiller", badge: "outline" as const },
  critical: { label: "Non fiable", badge: "destructive" as const },
};

export const GeoScoreCard = () => {
  const [report, setReport] = useState<GeoAuditReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadReport = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`/geo-audit-report.json?ts=${Date.now()}`, { cache: "no-store" });

      if (!response.ok) {
        throw new Error("Rapport GEO indisponible. Lancez un build pour générer l'audit.");
      }

      const data = (await response.json()) as GeoAuditReport;
      setReport(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Impossible de charger le rapport GEO.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadReport();
  }, []);

  const statusMeta = useMemo(() => {
    if (!report) return statusConfig.warning;
    return statusConfig[report.status] ?? statusConfig.warning;
  }, [report]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            Score GEO
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Basé sur l'audit automatique React vs HTML statique exécuté avant chaque build.
          </p>
        </div>

        <Button variant="outline" size="sm" onClick={loadReport} disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
          Actualiser
        </Button>
      </div>

      {error ? (
        <Card>
          <CardContent className="py-10 text-center space-y-3">
            <AlertCircle className="h-10 w-10 text-destructive mx-auto" />
            <p className="font-medium text-foreground">Rapport GEO introuvable</p>
            <p className="text-sm text-muted-foreground">{error}</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <CardTitle className="flex items-center gap-3">
                    <span className="text-3xl font-black text-foreground">{report?.score ?? "--"}/100</span>
                    <Badge variant={statusMeta.badge}>{statusMeta.label}</Badge>
                  </CardTitle>
                  <CardDescription>
                    {report ? `Dernier audit : ${new Date(report.generatedAt).toLocaleString("fr-FR")}` : "Chargement du dernier audit..."}
                  </CardDescription>
                </div>
                <div className="min-w-[220px] w-full sm:w-64">
                  <Progress value={report?.score ?? 0} className="h-2.5" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg border border-border bg-card p-4">
                <p className="text-xs text-muted-foreground">Checks validés</p>
                <p className="mt-1 text-2xl font-bold text-foreground">{report?.summary.passedChecks ?? 0}</p>
              </div>
              <div className="rounded-lg border border-border bg-card p-4">
                <p className="text-xs text-muted-foreground">Différences détectées</p>
                <p className="mt-1 text-2xl font-bold text-foreground">{report?.summary.failedChecks ?? 0}</p>
              </div>
              <div className="rounded-lg border border-border bg-card p-4">
                <p className="text-xs text-muted-foreground">Fichiers audités</p>
                <p className="mt-1 text-2xl font-bold text-foreground">{report?.summary.auditedFiles ?? 0}</p>
              </div>
              <div className="rounded-lg border border-border bg-card p-4">
                <p className="text-xs text-muted-foreground">Routes GEO couvertes</p>
                <p className="mt-1 text-2xl font-bold text-foreground">{report?.summary.staticRoutes ?? 0}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Écarts détectés avant build</CardTitle>
              <CardDescription>
                Le score baisse dès qu'un texte GEO ou une métrique diverge entre les sources React et le HTML statique.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!report || isLoading ? (
                <div className="text-sm text-muted-foreground">Chargement du détail...</div>
              ) : report.mismatches.length === 0 ? (
                <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-4">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium text-foreground">Aucune différence détectée</p>
                    <p className="text-sm text-muted-foreground">Le contenu React audité est aligné avec le HTML statique généré.</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {report.mismatches.slice(0, 12).map((item) => (
                    <div key={item.id} className="rounded-lg border border-border bg-card p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-medium text-foreground">{item.description}</p>
                          <p className="text-xs text-muted-foreground mt-1">{item.file}</p>
                        </div>
                        <Badge variant="outline">{item.category}</Badge>
                      </div>
                      <div className="mt-3 grid gap-2 text-sm">
                        <p className="text-muted-foreground"><span className="font-medium text-foreground">Attendu :</span> {item.expected}</p>
                        {item.actual ? <p className="text-muted-foreground"><span className="font-medium text-foreground">Trouvé :</span> {item.actual}</p> : null}
                      </div>
                    </div>
                  ))}
                  {report.mismatches.length > 12 ? (
                    <p className="text-xs text-muted-foreground">+ {report.mismatches.length - 12} autres différences dans le rapport.</p>
                  ) : null}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};