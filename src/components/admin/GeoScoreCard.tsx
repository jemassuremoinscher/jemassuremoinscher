import { useEffect, useMemo, useState } from "react";
import { AlertCircle, CheckCircle2, Info, RefreshCw, ShieldCheck, Copy, Wand2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { applyGeoContentImprovement, applyGeoIssueFix, applyGeoVisibilityFix, buildContentImprovementKey, listAppliedContentImprovements, canAutoFixGeoIssue, hydrateAuditReport, validateGeoContentImprovement, validateGeoIssueFix, validateGeoVisibilityFix, type ContentSuggestionDraft } from "@/lib/auditFixes";
import { toast } from "sonner";

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
      rankingScore: number;
      trackedPages: number;
    };
    pageRanking: Array<{ path: string; clicks: number; impressions: number; avgPosition: number; ctr: number; opportunityScore: number; aiPotential: string; contentAction: string }>;
    queryOpportunities: Array<{ query: string; page: string; clicks: number; impressions: number; position: number; ctr: number; intent: string; recommendation: string }>;
  };
};

type FixAction = {
  label: string;
  details: string;
};

type AppliedSuggestionState = Record<string, ContentSuggestionDraft>;

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
  const [fixStatuses, setFixStatuses] = useState<Record<string, 'idle' | 'sending' | 'success' | 'error'>>({});
  const [appliedSuggestions, setAppliedSuggestions] = useState<AppliedSuggestionState>({});

  const copyFixAction = (action: FixAction) => {
    navigator.clipboard.writeText(`${action.label}\n\n${action.details}`);
  };

  const loadAppliedImprovements = async () => {
    const items = await listAppliedContentImprovements('geo');
    setAppliedSuggestions(items);
  };

  const rememberAppliedSuggestion = (key: string, suggestion: ContentSuggestionDraft) => {
    setAppliedSuggestions((current) => ({
      ...current,
      [key]: suggestion,
      [suggestion.slug]: suggestion,
    }));
  };

  const renderAppliedSuggestion = (key: string) => {
    const suggestion = appliedSuggestions[key];
    if (!suggestion) return null;

    return (
      <div className="mt-3 rounded-lg border border-border bg-card p-3 text-xs text-muted-foreground space-y-1">
        <p className="font-medium text-foreground">Amélioration appliquée</p>
        <p><span className="font-medium text-foreground">Page cible :</span> {suggestion.applied_path ?? 'Non disponible'}</p>
        <p><span className="font-medium text-foreground">Action :</span> {suggestion.title}</p>
        <p><span className="font-medium text-foreground">Statut :</span> {suggestion.status}</p>
        <p><span className="font-medium text-foreground">Enregistrement :</span> backend mis à jour sur la page cible et trace conservée pour masquer cette amélioration.</p>
      </div>
    );
  };

  const markGeoIssueResolved = (issue: GeoAuditCheck) => {
    setReport((current) => {
      if (!current) return current;

      const existingIssue = current.checks.find((item) => item.id === issue.id);
      if (!existingIssue || existingIssue.pass) return current;

      const updatedChecks = current.checks.map((item) => item.id === issue.id
        ? { ...item, pass: true, actual: item.expected, reason: "Correction appliquée et validée depuis le backoffice." }
        : item);

      const nextFailedChecks = Math.max(0, current.summary.failedChecks - 1);
      const nextPassedChecks = current.summary.passedChecks + 1;
      const nextWeightedPassed = current.summary.weightedPassed + issue.weight;
      const nextScore = Math.round((nextWeightedPassed / current.summary.weightedTotal) * 100);

      return {
        ...current,
        score: nextScore,
        status: nextFailedChecks === 0 ? "excellent" : current.status,
        checks: updatedChecks,
        mismatches: updatedChecks.filter((item) => !item.pass),
        summary: {
          ...current.summary,
          failedChecks: nextFailedChecks,
          passedChecks: nextPassedChecks,
          weightedPassed: nextWeightedPassed,
        },
      };
    });
  };

  const runDirectFix = async (key: string, issue: GeoAuditCheck) => {
    setFixStatuses((current) => ({ ...current, [key]: 'sending' }));

    try {
      const result = await applyGeoIssueFix(issue);

      markGeoIssueResolved(issue);
      setFixStatuses((current) => ({ ...current, [key]: 'success' }));
      toast.success(result.message);
    } catch (error) {
      setFixStatuses((current) => ({ ...current, [key]: 'error' }));
      toast.error(error instanceof Error ? error.message : 'Erreur pendant la correction.');
    }
  };

  const markGeoVisibilityResolved = (check: VisibilityCheck) => {
    setVisibilityReport((current) => {
      if (!current) return current;

      const existingCheck = current.geo.checks.find((item) => item.id === check.id);
      if (!existingCheck || existingCheck.pass) return current;

      const updatedChecks = current.geo.checks.map((item) => item.id === check.id
        ? { ...item, pass: true, reason: "Action appliquée et validée depuis le backoffice." }
        : item);
      const nextPassedChecks = current.geo.passedChecks + 1;
      const nextWeightedPassed = current.geo.weightedPassed + check.weight;
      const nextScore = Math.round((nextWeightedPassed / current.geo.weightedTotal) * 100);

      return {
        ...current,
        geo: {
          ...current.geo,
          score: nextScore,
          status: nextPassedChecks === current.geo.totalChecks ? "excellent" : current.geo.status,
          passedChecks: nextPassedChecks,
          weightedPassed: nextWeightedPassed,
          checks: updatedChecks,
        },
      };
    });
  };

  const runVisibilityFix = async (key: string, check: VisibilityCheck) => {
    setFixStatuses((current) => ({ ...current, [key]: 'sending' }));

    try {
      const result = await applyGeoVisibilityFix(check);

      markGeoVisibilityResolved(check);
      setFixStatuses((current) => ({ ...current, [key]: 'success' }));
      toast.success(result.message);
    } catch (error) {
      setFixStatuses((current) => ({ ...current, [key]: 'error' }));
      toast.error(error instanceof Error ? error.message : 'Erreur pendant la correction.');
    }
  };

  const runPageContentImprovement = async (key: string, page: VisibilityScore["geo"]["pageRanking"][number]) => {
    setFixStatuses((current) => ({ ...current, [key]: 'sending' }));

    try {
      const result = await applyGeoContentImprovement({
        scope: "page",
        path: page.path,
        recommendation: page.contentAction,
      });

      rememberAppliedSuggestion(key, result.suggestion);
      await loadReport();
      setFixStatuses((current) => ({ ...current, [key]: 'success' }));
      toast.success('Amélioration GEO activée', {
        description: `Les métadonnées de ${result.suggestion.applied_path ?? page.path} ont été mises à jour.`,
      });
    } catch (error) {
      setFixStatuses((current) => ({ ...current, [key]: 'error' }));
      toast.error(error instanceof Error ? error.message : "Erreur pendant l'amélioration contenu.");
    }
  };

  const runQueryContentImprovement = async (key: string, item: VisibilityScore["geo"]["queryOpportunities"][number]) => {
    setFixStatuses((current) => ({ ...current, [key]: 'sending' }));

    try {
      const payload = {
        scope: "query" as const,
        path: item.page,
        query: item.query,
        intent: item.intent,
        recommendation: item.recommendation,
      };
      const result = await applyGeoContentImprovement(payload);

      rememberAppliedSuggestion(key, result.suggestion);
      await loadReport();
      setFixStatuses((current) => ({ ...current, [key]: 'success' }));
      toast.success('Amélioration GEO activée', {
        description: `Les métadonnées de ${result.suggestion.applied_path ?? item.page} ont été mises à jour.`,
      });
    } catch (error) {
      setFixStatuses((current) => ({ ...current, [key]: 'error' }));
      toast.error(error instanceof Error ? error.message : "Erreur pendant l'amélioration contenu.");
    }
  };

  const renderFixStatus = (key: string) => {
    const status = fixStatuses[key] ?? 'idle';
    if (status === 'sending') return <p className="text-xs text-muted-foreground">Correction en cours…</p>;
    if (status === 'success') return <p className="text-xs text-primary">Correction appliquée.</p>;
    if (status === 'error') return <p className="text-xs text-destructive">Erreur de correction. Réessaie.</p>;
    return null;
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
      const resolvedIds = await Promise.all(
        data.checks
          .filter((item) => !item.pass)
          .map(async (item) => ((await validateGeoIssueFix(item)) ? item.id : null)),
      );

      const hydrated = await hydrateAuditReport(
        data,
        resolvedIds.filter(Boolean) as string[],
        "Correction déjà appliquée et restaurée depuis les données sauvegardées.",
      );

      setReport({
        ...hydrated,
        mismatches: hydrated.checks.filter((item) => !item.pass),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Impossible de charger le rapport GEO.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadReport();
    loadVisibilityReport();
    void loadAppliedImprovements();
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
      const nextReport = response.data as VisibilityScore;
      const resolvedIds = await Promise.all(
        nextReport.geo.checks
          .filter((check) => !check.pass)
          .map(async (check) => ((await validateGeoVisibilityFix(check)) ? check.id : null)),
      );

      const resolvedSet = new Set(resolvedIds.filter(Boolean) as string[]);
      const resolvedWeight = nextReport.geo.checks
        .filter((check) => !check.pass && resolvedSet.has(check.id))
        .reduce((sum, check) => sum + check.weight, 0);
      const resolvedCount = nextReport.geo.checks.filter((check) => !check.pass && resolvedSet.has(check.id)).length;
      const weightedPassed = nextReport.geo.weightedPassed + resolvedWeight;
      const passedChecks = nextReport.geo.passedChecks + resolvedCount;
      const score = Math.round((weightedPassed / nextReport.geo.weightedTotal) * 100);

      setVisibilityReport({
        ...nextReport,
        geo: {
          ...nextReport.geo,
          score,
          status: passedChecks === nextReport.geo.totalChecks ? "excellent" : nextReport.geo.status,
          passedChecks,
          weightedPassed,
          checks: nextReport.geo.checks.map((check) => (
            resolvedSet.has(check.id)
              ? { ...check, pass: true, reason: "Action déjà appliquée et restaurée depuis les données sauvegardées." }
              : check
          )),
        },
      });
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

  const pendingGeoPageImprovements = useMemo(
    () => (visibilityReport?.geo.pageRanking ?? []).filter((page) => !appliedSuggestions[buildContentImprovementKey({
      source: 'geo',
      scope: 'page',
      path: page.path,
    })]),
    [appliedSuggestions, visibilityReport],
  );

  const pendingGeoQueryImprovements = useMemo(
    () => (visibilityReport?.geo.queryOpportunities ?? []).filter((item) => !appliedSuggestions[buildContentImprovementKey({
      source: 'geo',
      scope: 'query',
      path: item.page,
      query: item.query,
    })]),
    [appliedSuggestions, visibilityReport],
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
                <div className="rounded-md border border-border p-3">
                  <p className="text-muted-foreground">Ranking proxy IA</p>
                  <p className="font-semibold text-foreground">{visibilityReport?.geo.metrics.rankingScore ?? 0}/100</p>
                </div>
                <div className="rounded-md border border-border p-3">
                  <p className="text-muted-foreground">Pages suivies</p>
                  <p className="font-semibold text-foreground">{visibilityReport?.geo.metrics.trackedPages ?? 0}</p>
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
                      {!item.pass && canAutoFixGeoIssue(item) ? (
                        <div className="mt-4 flex flex-wrap gap-2">
                          <Button size="sm" onClick={() => void runDirectFix(item.id, item)} disabled={fixStatuses[item.id] === 'sending'}>
                            <Wand2 className="h-4 w-4 mr-1" />
                            {fixStatuses[item.id] === 'sending' ? 'Correction...' : 'Appliquer la correction'}
                          </Button>
                        </div>
                      ) : null}
                      {renderFixStatus(item.id)}
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
                          {(check.label.toLowerCase().includes('diversité') || check.label.toLowerCase().includes('mentions') || check.label.toLowerCase().includes('requêtes')) ? (
                            <Button size="sm" onClick={() => void runVisibilityFix(check.id, check)} disabled={fixStatuses[check.id] === 'sending'}>
                              <Wand2 className="h-4 w-4 mr-1" />
                              {fixStatuses[check.id] === 'sending' ? 'Correction...' : 'Appliquer la correction'}
                            </Button>
                          ) : (
                            <Button size="sm" variant="outline" onClick={() => copyFixAction(getGeoVisibilityFixAction(check))}>
                              <Copy className="h-4 w-4 mr-1" />
                              Copier l'action
                            </Button>
                          )}
                        </div>
                      ) : null}
                      {renderFixStatus(check.id)}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Ranking IA par page</CardTitle>
              <CardDescription>Proxy interne basé sur visibilité requêtes, potentiel IA et couverture éditoriale.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {pendingGeoPageImprovements.slice(0, 10).map((page) => (
                <div key={`geo-${page.path}`} className="rounded-lg border border-border p-3 text-sm">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="font-medium text-foreground">{page.path}</p>
                      <p className="text-xs text-muted-foreground mt-1">Potentiel IA : {page.aiPotential} · Opportunité : {page.opportunityScore}/100</p>
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                      <span>{page.impressions} impressions</span>
                      <span>Pos. {page.avgPosition.toFixed(1)}</span>
                      <span>CTR {page.ctr.toFixed(1)}%</span>
                    </div>
                  </div>
                  <p className="mt-2 text-muted-foreground"><span className="font-medium text-foreground">Amélioration contenu :</span> {page.contentAction}</p>
                  <p className="mt-2 text-xs text-muted-foreground">Cette action applique directement les métadonnées améliorées sur la page cible.</p>
                  <div className="mt-3">
                    <Button size="sm" onClick={() => void runPageContentImprovement(`page-content-${page.path}`, page)} disabled={fixStatuses[`page-content-${page.path}`] === 'sending'}>
                      <Wand2 className="h-4 w-4 mr-1" />
                      {fixStatuses[`page-content-${page.path}`] === 'sending' ? 'Activation...' : "Activer l'amélioration"}
                    </Button>
                  </div>
                  {renderFixStatus(`page-content-${page.path}`)}
                  {renderAppliedSuggestion(`page-content-${page.path}`)}
                </div>
              ))}
              {pendingGeoPageImprovements.length === 0 ? (
                <div className="rounded-lg border border-border bg-card p-4 text-sm text-muted-foreground">
                  Toutes les améliorations GEO de pages de cet encart ont déjà été activées.
                </div>
              ) : null}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Requêtes IA et contenus à créer</CardTitle>
              <CardDescription>Comparatifs, FAQ, définitions et guides de décision à forte reprise potentielle.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {pendingGeoQueryImprovements.slice(0, 10).map((item) => (
                <div key={`geo-query-${item.query}-${item.page}`} className="rounded-lg border border-border p-3 text-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-foreground">{item.query}</p>
                      <p className="text-xs text-muted-foreground mt-1">{item.page}</p>
                    </div>
                    <Badge variant="outline">{item.intent}</Badge>
                  </div>
                  <div className="mt-2 grid gap-1 text-muted-foreground">
                    <p>Impressions : <span className="font-medium text-foreground">{item.impressions}</span> · Position : <span className="font-medium text-foreground">{item.position.toFixed(1)}</span></p>
                    <p><span className="font-medium text-foreground">Amélioration contenu :</span> {item.recommendation}</p>
                  </div>
                  <div className="mt-3">
                    <Button size="sm" onClick={() => void runQueryContentImprovement(`query-content-${item.page}-${item.query}`, item)} disabled={fixStatuses[`query-content-${item.page}-${item.query}`] === 'sending'}>
                      <Wand2 className="h-4 w-4 mr-1" />
                      {fixStatuses[`query-content-${item.page}-${item.query}`] === 'sending' ? 'Activation...' : "Activer l'amélioration"}
                    </Button>
                  </div>
                  {renderFixStatus(`query-content-${item.page}-${item.query}`)}
                  {renderAppliedSuggestion(`query-content-${item.page}-${item.query}`)}
                </div>
              ))}
              {pendingGeoQueryImprovements.length === 0 ? (
                <div className="rounded-lg border border-border bg-card p-4 text-sm text-muted-foreground">
                  Toutes les améliorations GEO de requêtes de cet encart ont déjà été activées.
                </div>
              ) : null}
            </CardContent>
          </Card>
        </>
      )}

    </div>
  );
};