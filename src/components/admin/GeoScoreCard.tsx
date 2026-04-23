import { useEffect, useMemo, useState } from "react";
import { AlertCircle, CheckCircle2, Info, RefreshCw, ShieldCheck, ArrowUpRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";

type GeoAuditCheck = {
  id: string;
  category: string;
  file: string;
  description: string;
  pass: boolean;
  weight: number;
  impact: number;
  expected: string;
  actual: string | null;
  reason: string;
};

type GeoAuditReport = {
  generatedAt: string;
  score: number;
  status: "excellent" | "good" | "warning" | "critical";
  methodology: string;
  summary: {
    totalChecks: number;
    passedChecks: number;
    failedChecks: number;
    auditedFiles: number;
    auditedPages: number;
    staticRoutes: number;
    weightedPassed: number;
    weightedTotal: number;
  };
  mismatches: GeoAuditCheck[];
  checks: GeoAuditCheck[];
};

type VisibilityCheck = {
  id: string;
  label: string;
  source: 'gsc' | 'ga4';
  value: string;
  expected: string;
  weight: number;
  pass: boolean;
  reason: string;
};

type VisibilityScore = {
  generatedAt: string;
  methodology: { seo: string; geo: string };
  geo: {
    score: number;
    status: 'excellent' | 'good' | 'warning' | 'critical';
    weightedPassed: number;
    weightedTotal: number;
    passedChecks: number;
    totalChecks: number;
    checks: VisibilityCheck[];
    metrics: {
      llmSessions: number;
      llmSources: string[];
      iaCitations: number;
    };
  };
};

type FixAction = {
  label: string;
  details: string;
};

const LOVABLE_PROJECT_URL = 'https://lovable.dev/projects/0c846637-eedf-4940-bd90-f40cb5a873ee';

const statusConfig = {
  excellent: { label: "Fiable", badge: "default" as const },
  good: { label: "Solide", badge: "secondary" as const },
  warning: { label: "À surveiller", badge: "outline" as const },
  critical: { label: "Non fiable", badge: "destructive" as const },
};

const getGeoFixAction = (item: GeoAuditCheck): FixAction => {
  const category = item.category.toLowerCase();
  const description = item.description.toLowerCase();

  if (category.includes("title") || description.includes("title")) {
    return {
      label: "Aligner les titres",
      details: `Harmoniser sur ${item.file} le title React et le shell HTML statique pour éviter les écarts entre rendu applicatif et version servie aux crawlers.`,
    };
  }

  if (category.includes("geo") || description.includes("geo")) {
    return {
      label: "Aligner les textes GEO",
      details: `Synchroniser les textes GEO entre React et HTML statique sur ${item.file}, puis régénérer les pages statiques avant build pour supprimer l’écart détecté.`,
    };
  }

  if (category.includes("route") || description.includes("route")) {
    return {
      label: "Corriger la route statique",
      details: `Ajouter ou régénérer la route statique correspondante à ${item.file} afin que la couverture HTML reflète bien la route React publiée.`,
    };
  }

  return {
    label: "Proposer un fix GEO",
    details: `Corriger l’écart GEO détecté sur ${item.file} : ${item.description}. Attendu : ${item.expected}.${item.actual ? ` Observé : ${item.actual}.` : ""}`,
  };
};

const getGeoVisibilityFixAction = (check: VisibilityCheck): FixAction => {
  const label = check.label.toLowerCase();

  if (label.includes("sessions")) {
    return {
      label: "Augmenter le trafic IA",
      details: "Créer des contenus répondant directement à des questions, structurer les réponses en blocs clairs et renforcer les pages qui performent déjà pour capter davantage de visites issues des assistants IA.",
    };
  }

  if (label.includes("diversité")) {
    return {
      label: "Diversifier les sources IA",
      details: "Étendre la couverture éditoriale avec des contenus comparatifs, définitions, FAQ et guides de décision pour être repris par plusieurs assistants IA et non une seule source.",
    };
  }

  if (label.includes("mentions") || label.includes("requêtes")) {
    return {
      label: "Renforcer les citations IA",
      details: "Ajouter davantage d’entités nommées, FAQ précises, preuves d’expertise et maillage sémantique afin d’augmenter les mentions de marque et de pages dans les parcours IA.",
    };
  }

  return {
    label: "Proposer une action GEO",
    details: `Traiter ce signal GEO réel : ${check.label}. Attendu : ${check.expected}. Valeur actuelle : ${check.value}.`,
  };
};

export const GeoScoreCard = () => {
  const [report, setReport] = useState<GeoAuditReport | null>(null);
  const [visibilityReport, setVisibilityReport] = useState<VisibilityScore | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visibilityError, setVisibilityError] = useState<string | null>(null);

  const copyFixAction = (action: FixAction) => {
    navigator.clipboard.writeText(`${action.label}\n\n${action.details}`);
  };

  const openLovableFix = async (action: FixAction) => {
    const prompt = `${action.label}\n\n${action.details}`;

    try {
      await navigator.clipboard.writeText(prompt);
    } catch {
      // ignore clipboard failures, opening Lovable is the main action
    }

    const url = `${LOVABLE_PROJECT_URL}?prompt=${encodeURIComponent(prompt)}&message=${encodeURIComponent(prompt)}`;
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer');

    if (!newWindow) {
      window.location.href = url;
    }
  };

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
    loadVisibilityReport();
  }, []);

  const loadVisibilityReport = async () => {
    try {
      setVisibilityError(null);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Non authentifié');
      const response = await supabase.functions.invoke('visibility-score', { body: {} });
      if (response.error) throw response.error;
      if (response.data?.error && !response.data?.geo) {
        throw new Error(response.data.message || response.data.error);
      }
      setVisibilityReport(response.data as VisibilityScore);
    } catch (err) {
      setVisibilityError(err instanceof Error ? err.message : 'Impossible de charger la visibilité réelle GEO.');
    }
  };

  const statusMeta = useMemo(() => {
    if (!report) return statusConfig.warning;
    return statusConfig[report.status] ?? statusConfig.warning;
  }, [report]);

  const visibilityStatus = useMemo(() => {
    if (!visibilityReport) return statusConfig.warning;
    return statusConfig[visibilityReport.geo.status] ?? statusConfig.warning;
  }, [visibilityReport]);

  const failedGeoChecks = useMemo(
    () => report?.checks.filter((item) => !item.pass) ?? [],
    [report],
  );

  const failedGeoVisibilityChecks = useMemo(
    () => visibilityReport?.geo.checks.filter((check) => !check.pass) ?? [],
    [visibilityReport],
  );

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
                <p className="text-xs text-muted-foreground">Pages HTML auditées</p>
                <p className="mt-1 text-2xl font-bold text-foreground">{report?.summary.auditedPages ?? 0}</p>
              </div>
              <div className="rounded-lg border border-border bg-card p-4">
                <p className="text-xs text-muted-foreground">Fichiers couverts</p>
                <p className="mt-1 text-2xl font-bold text-foreground">{report?.summary.auditedFiles ?? 0}</p>
              </div>
              <div className="rounded-lg border border-border bg-card p-4">
                <p className="text-xs text-muted-foreground">Routes statiques couvertes</p>
                <p className="mt-1 text-2xl font-bold text-foreground">{report?.summary.staticRoutes ?? 0}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-start gap-3 py-4">
              <Info className="mt-0.5 h-5 w-5 text-primary" />
              <div className="space-y-1 text-sm text-muted-foreground">
                <p className="font-medium text-foreground">Ce score mesure l'alignement GEO, pas la visibilité réelle.</p>
                <p>100/100 signifie que les contenus React et HTML statique audités sont cohérents sur ce périmètre ; cela ne garantit ni rankings ni trafic.</p>
                <p>Méthodologie : {report?.methodology ?? "Chargement..."}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-base">Visibilité réelle GEO</CardTitle>
                  <CardDescription>Sous-score séparé basé sur citations IA + trafic LLM.</CardDescription>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-foreground">{visibilityReport?.geo.score ?? '--'}/100</p>
                  <Badge variant={visibilityStatus.badge}>{visibilityStatus.label}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Progress value={visibilityReport?.geo.score ?? 0} className="h-2.5" />
              <div className="grid gap-3 sm:grid-cols-3 text-sm">
                <div className="rounded-md border border-border p-3">
                  <p className="text-muted-foreground">Sessions LLM</p>
                  <p className="font-semibold text-foreground">{visibilityReport?.geo.metrics.llmSessions ?? 0}</p>
                </div>
                <div className="rounded-md border border-border p-3">
                  <p className="text-muted-foreground">Sources IA distinctes</p>
                  <p className="font-semibold text-foreground">{visibilityReport?.geo.metrics.llmSources.length ?? 0}</p>
                </div>
                <div className="rounded-md border border-border p-3">
                  <p className="text-muted-foreground">Requêtes IA détectées</p>
                  <p className="font-semibold text-foreground">{visibilityReport?.geo.metrics.iaCitations ?? 0}</p>
                </div>
              </div>
              <div className="rounded-lg border border-border bg-card p-4 text-sm text-muted-foreground space-y-2">
                <p className="font-medium text-foreground">Méthodologie live</p>
                <p>{visibilityReport?.methodology.geo ?? 'Chargement...'}</p>
                <p><span className="font-medium text-foreground">Poids validé :</span> {visibilityReport?.geo.weightedPassed ?? 0} / {visibilityReport?.geo.weightedTotal ?? 0}</p>
              </div>
              {visibilityError ? <p className="text-xs text-destructive">{visibilityError}</p> : null}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Checks GEO détaillés</CardTitle>
              <CardDescription>
                Chaque check affiche son poids dans le score total et la raison du succès ou de l'échec.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!report || isLoading ? (
                <div className="text-sm text-muted-foreground">Chargement du détail...</div>
              ) : (
                <div className="space-y-3 max-h-[34rem] overflow-y-auto pr-1">
                  {failedGeoChecks.length === 0 ? (
                    <div className="rounded-lg border border-border bg-card p-4 text-sm text-muted-foreground">
                      Aucun écart GEO bloquant détecté sur cet audit.
                    </div>
                  ) : failedGeoChecks.map((item) => (
                    <div key={item.id} className="rounded-lg border border-border bg-card p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-medium text-foreground">{item.description}</p>
                          <p className="text-xs text-muted-foreground mt-1">{item.file}</p>
                        </div>
                        <div className="flex flex-wrap items-center justify-end gap-2">
                          <Badge variant={item.pass ? "secondary" : "destructive"}>{item.pass ? "Passe" : "Échec"}</Badge>
                          <Badge variant="outline">{item.category}</Badge>
                          <Badge variant="outline">Poids {item.weight}</Badge>
                        </div>
                      </div>
                      <div className="mt-3 grid gap-2 text-sm">
                        <p className="text-muted-foreground"><span className="font-medium text-foreground">Impact score :</span> {item.pass ? "+" : "-"}{item.impact}</p>
                        <p className="text-muted-foreground"><span className="font-medium text-foreground">Pourquoi :</span> {item.reason}</p>
                        <p className="text-muted-foreground"><span className="font-medium text-foreground">Attendu :</span> {item.expected}</p>
                        {item.actual ? <p className="text-muted-foreground"><span className="font-medium text-foreground">Trouvé :</span> {item.actual}</p> : null}
                      </div>
                      {!item.pass ? (
                        <div className="mt-4 flex flex-wrap gap-2">
                          <Button size="sm" onClick={() => { void openLovableFix(getGeoFixAction(item)); }}>
                            <ArrowUpRight className="h-4 w-4 mr-1" />
                            Proposer la correction
                          </Button>
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Checks de visibilité réelle GEO</CardTitle>
              <CardDescription>Trafic LLM et signaux IA réels, séparés du score technique.</CardDescription>
            </CardHeader>
            <CardContent>
              {!visibilityReport ? (
                <div className="text-sm text-muted-foreground">Chargement du détail live...</div>
              ) : (
                <div className="space-y-3">
                  {failedGeoVisibilityChecks.length === 0 ? (
                    <div className="rounded-lg border border-border bg-card p-4 text-sm text-muted-foreground">
                      Aucun signal de visibilité réelle GEO en échec pour le moment.
                    </div>
                  ) : failedGeoVisibilityChecks.map((check) => (
                    <div key={check.id} className="rounded-lg border border-border bg-card p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-medium text-foreground">{check.label}</p>
                          <p className="text-xs text-muted-foreground mt-1">Source : {check.source.toUpperCase()}</p>
                        </div>
                        <div className="flex flex-wrap items-center justify-end gap-2">
                          <Badge variant={check.pass ? 'secondary' : 'destructive'}>{check.pass ? 'Passe' : 'Échec'}</Badge>
                          <Badge variant="outline">Poids {check.weight}</Badge>
                        </div>
                      </div>
                      <div className="mt-3 grid gap-2 text-sm text-muted-foreground">
                        <p><span className="font-medium text-foreground">Valeur :</span> {check.value}</p>
                        <p><span className="font-medium text-foreground">Attendu :</span> {check.expected}</p>
                        <p><span className="font-medium text-foreground">Pourquoi :</span> {check.reason}</p>
                      </div>
                      {!check.pass ? (
                        <div className="mt-4 flex flex-wrap gap-2">
                          <Button size="sm" onClick={() => { void openLovableFix(getGeoVisibilityFixAction(check)); }}>
                            <ArrowUpRight className="h-4 w-4 mr-1" />
                            Proposer la correction
                          </Button>
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};