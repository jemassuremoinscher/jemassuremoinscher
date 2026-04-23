import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Sparkles, RefreshCw, Eye, Check, X, Copy, TrendingUp, Search, AlertCircle, CheckCircle2, ArrowUpRight } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';

type FixAction = {
  label: string;
  details: string;
};

const LOVABLE_PROJECT_URL = 'https://lovable.dev/projects/0c846637-eedf-4940-bd90-f40cb5a873ee';

type Suggestion = {
  id: string;
  title: string;
  slug: string;
  target_keyword: string;
  gsc_position: number | null;
  gsc_impressions: number | null;
  gsc_clicks: number | null;
  suggested_content: string;
  suggested_meta_description: string | null;
  suggested_author: string | null;
  status: string;
  created_at: string;
};

type GenerationResponse = {
  message?: string;
  opportunities?: number;
  generated?: number;
  skipped?: number;
  failed?: number;
  suggestions?: Array<{ keyword: string; title: string; slug: string }>;
  errors?: Array<{ keyword: string; reason: string }>;
};

type SeoAuditCheck = {
  id: string;
  file: string;
  category: string;
  description: string;
  pass: boolean;
  weight: number;
  impact: number;
  expected: string;
  actual: string | null;
  reason: string;
};

type SeoAuditReport = {
  generatedAt: string;
  score: number;
  status: 'excellent' | 'good' | 'warning' | 'critical';
  methodology: string;
  summary: {
    auditedPages: number;
    totalChecks: number;
    passedChecks: number;
    failedChecks: number;
    weightedPassed: number;
    weightedTotal: number;
    strongPages: number;
  };
  pageScores: Array<{ file: string; score: number; issues: number }>;
  issues: SeoAuditCheck[];
  checks: SeoAuditCheck[];
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
  seo: {
    score: number;
    status: 'excellent' | 'good' | 'warning' | 'critical';
    weightedPassed: number;
    weightedTotal: number;
    passedChecks: number;
    totalChecks: number;
    checks: VisibilityCheck[];
    metrics: {
      impressions: number;
      clicks: number;
      ctr: number;
      avgPosition: number;
      organicSessions: number;
      organicEngagementRate: number;
    };
  };
};

const scoreMeta = {
  excellent: { label: 'Fiable', badge: 'default' as const },
  good: { label: 'Solide', badge: 'secondary' as const },
  warning: { label: 'À corriger', badge: 'outline' as const },
  critical: { label: 'Fragile', badge: 'destructive' as const },
};

const getSeoFixAction = (issue: SeoAuditCheck): FixAction => {
  const category = issue.category.toLowerCase();
  const description = issue.description.toLowerCase();

  if (category.includes('title')) {
    return {
      label: 'Corriger le title',
      details: `Mettre à jour ${issue.file} avec une balise <title> unique, descriptive et alignée sur l’intention de la page. Attendu : ${issue.expected}.`,
    };
  }

  if (category.includes('meta') || description.includes('description')) {
    return {
      label: 'Corriger la meta description',
      details: `Ajouter ou réécrire la meta description sur ${issue.file} pour décrire clairement la page, éviter les doublons et respecter la cible attendue : ${issue.expected}.`,
    };
  }

  if (category.includes('canonical')) {
    return {
      label: 'Corriger le canonical',
      details: `Vérifier sur ${issue.file} qu’une seule balise canonical pointe vers l’URL finale correcte de la page. Attendu : ${issue.expected}.`,
    };
  }

  if (category.includes('h1') || description.includes('h1')) {
    return {
      label: 'Corriger la hiérarchie H1',
      details: `Garder un seul H1 principal sur ${issue.file}, puis rétrograder les autres titres en H2/H3 pour restaurer une hiérarchie sémantique propre.`,
    };
  }

  if (category.includes('open graph') || category.includes('og')) {
    return {
      label: 'Corriger les balises Open Graph',
      details: `Compléter sur ${issue.file} les balises og:title, og:description et og:url pour refléter exactement le contenu de la page et son URL canonique.`,
    };
  }

  if (category.includes('json-ld') || description.includes('json-ld')) {
    return {
      label: 'Corriger les données structurées',
      details: `Ajouter ou corriger le JSON-LD de ${issue.file} via le composant SEO centralisé pour que le balisage corresponde au type réel de la page.`,
    };
  }

  return {
    label: 'Proposer un fix SEO',
    details: `Revoir ${issue.file} pour corriger ce point SEO : ${issue.description}. Attendu : ${issue.expected}.${issue.actual ? ` Observé : ${issue.actual}.` : ''}`,
  };
};

const getVisibilityFixAction = (check: VisibilityCheck): FixAction => {
  const label = check.label.toLowerCase();

  if (label.includes('impressions')) {
    return {
      label: 'Augmenter la couverture SEO',
      details: 'Créer ou enrichir des pages ciblant des requêtes précises, renforcer le maillage interne et pousser l’indexation des pages stratégiques pour augmenter les impressions Search Console.',
    };
  }

  if (label.includes('position')) {
    return {
      label: 'Améliorer les positions',
      details: 'Renforcer l’intention de recherche, les titres/H1, le contenu principal, les liens internes et les signaux d’autorité sur les pages qui se positionnent déjà en page 2-4.',
    };
  }

  if (label.includes('ctr')) {
    return {
      label: 'Améliorer le CTR',
      details: 'Réécrire les titles et meta descriptions des pages les plus visibles pour mieux matcher la requête, clarifier la promesse et différencier le snippet en SERP.',
    };
  }

  if (label.includes('organiques') || label.includes('engagement')) {
    return {
      label: 'Améliorer le trafic qualifié',
      details: 'Optimiser les landing pages qui reçoivent du trafic organique : alignement intention/contenu, CTA plus clairs, vitesse, et sections de réponse plus directes au-dessus de la ligne de flottaison.',
    };
  }

  return {
    label: 'Proposer une action visibilité',
    details: `Traiter ce signal de visibilité réelle : ${check.label}. Attendu : ${check.expected}. Valeur actuelle : ${check.value}.`,
  };
};

export const SEOSuggestions = () => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [seoReport, setSeoReport] = useState<SeoAuditReport | null>(null);
  const [visibilityReport, setVisibilityReport] = useState<VisibilityScore | null>(null);
  const [seoError, setSeoError] = useState<string | null>(null);
  const [visibilityError, setVisibilityError] = useState<string | null>(null);
  const [isSeoLoading, setIsSeoLoading] = useState(true);

  useEffect(() => {
    fetchSuggestions();
    loadSeoReport();
    loadVisibilityReport();
  }, []);

  const loadVisibilityReport = async () => {
    try {
      setVisibilityError(null);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Non authentifié');

      const response = await supabase.functions.invoke('visibility-score', { body: {} });
      if (response.error) throw response.error;
      if (response.data?.error && !response.data?.seo) {
        throw new Error(response.data.message || response.data.error);
      }

      setVisibilityReport(response.data as VisibilityScore);
    } catch (err) {
      setVisibilityError(err instanceof Error ? err.message : 'Impossible de charger la visibilité réelle SEO.');
    }
  };

  const loadSeoReport = async () => {
    try {
      setIsSeoLoading(true);
      setSeoError(null);
      const response = await fetch(`/seo-audit-report.json?ts=${Date.now()}`, { cache: 'no-store' });

      if (!response.ok) {
        throw new Error('Rapport SEO indisponible. Lancez un build pour générer l’audit.');
      }

      const data = (await response.json()) as SeoAuditReport;
      setSeoReport(data);
    } catch (err) {
      setSeoError(err instanceof Error ? err.message : 'Impossible de charger le rapport SEO.');
    } finally {
      setIsSeoLoading(false);
    }
  };

  const fetchSuggestions = async () => {
    setIsLoading(true);

    const { data, error } = await supabase
      .from('seo_article_suggestions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Erreur chargement suggestions');
    } else {
      setSuggestions((data as Suggestion[]) || []);
    }

    setIsLoading(false);
  };

  const generateSuggestions = async () => {
    setIsGenerating(true);
    toast.info('Analyse GSC et génération en cours... (30-60s)');

    try {
      const { data, error } = await supabase.functions.invoke('generate-seo-suggestions', {
        body: {},
      });

      if (error) {
        throw new Error(error.message || 'Erreur génération');
      }

      const response = (data || {}) as GenerationResponse;
      const generated = response.generated ?? response.suggestions?.length ?? 0;
      const skipped = response.skipped ?? 0;
      const failed = response.failed ?? 0;
      const firstError = response.errors?.[0];

      if (generated === 0 && failed > 0) {
        throw new Error(firstError ? `${firstError.keyword} : ${firstError.reason}` : response.message || 'La génération a échoué');
      }

      if (generated > 0) {
        toast.success(`${generated} suggestion(s) générée(s)` + (skipped > 0 ? ` • ${skipped} déjà existante(s)` : ''));
      } else {
        toast.info(response.message || 'Aucune nouvelle suggestion créée');
      }

      if (failed > 0) {
        toast.info(`${failed} opportunité(s) n'ont pas pu être générées${firstError ? ` • ${firstError.keyword}` : ''}`);
      }

      await fetchSuggestions();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setIsGenerating(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from('seo_article_suggestions')
      .update({ status, reviewed_at: new Date().toISOString() } as any)
      .eq('id', id);

    if (error) {
      toast.error('Erreur mise à jour');
    } else {
      toast.success(status === 'approved' ? 'Article approuvé ✓' : 'Article rejeté');
      fetchSuggestions();
    }
  };

  const copyContent = (suggestion: Suggestion) => {
    navigator.clipboard.writeText(suggestion.suggested_content);
    toast.success('Contenu copié dans le presse-papier');
  };

  const copyFixAction = (action: FixAction) => {
    navigator.clipboard.writeText(`${action.label}\n\n${action.details}`);
    toast.success('Proposition de correction copiée');
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

    toast.success('Lovable ouvert avec la correction prête. Le prompt a aussi été copié en secours.');
  };

  const statusBadge = (status: string) => {
    const config: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; label: string }> = {
      pending: { variant: 'outline', label: '⏳ En attente' },
      approved: { variant: 'default', label: '✅ Approuvé' },
      rejected: { variant: 'destructive', label: '❌ Rejeté' },
    };
    const c = config[status] || config.pending;
    return <Badge variant={c.variant}>{c.label}</Badge>;
  };

  const seoStatus = useMemo(() => {
    if (!seoReport) return scoreMeta.warning;
    return scoreMeta[seoReport.status] ?? scoreMeta.warning;
  }, [seoReport]);

  const visibilityStatus = useMemo(() => {
    if (!visibilityReport) return scoreMeta.warning;
    return scoreMeta[visibilityReport.seo.status] ?? scoreMeta.warning;
  }, [visibilityReport]);

  const failedSeoChecks = useMemo(
    () => seoReport?.checks.filter((issue) => !issue.pass) ?? [],
    [seoReport],
  );

  const failedVisibilityChecks = useMemo(
    () => visibilityReport?.seo.checks.filter((check) => !check.pass) ?? [],
    [visibilityReport],
  );

  return (
    <div className="space-y-6">
      {seoError ? (
        <Card>
          <CardContent className="py-10 text-center space-y-3">
            <AlertCircle className="h-10 w-10 text-destructive mx-auto" />
            <p className="font-medium text-foreground">Rapport SEO introuvable</p>
            <p className="text-sm text-muted-foreground">{seoError}</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <CardTitle className="flex items-center gap-3">
                    <span className="text-3xl font-black text-foreground">{seoReport?.score ?? '--'}/100</span>
                    <Badge variant={seoStatus.badge}>{seoStatus.label}</Badge>
                  </CardTitle>
                  <CardDescription>
                    {seoReport
                      ? `Dernier audit : ${new Date(seoReport.generatedAt).toLocaleString('fr-FR')}`
                      : 'Chargement du dernier audit...'}
                  </CardDescription>
                </div>
                <div className="flex w-full flex-col gap-3 sm:w-72">
                  <Progress value={seoReport?.score ?? 0} className="h-2.5" />
                  <Button variant="outline" size="sm" onClick={loadSeoReport} disabled={isSeoLoading}>
                    <RefreshCw className={`h-4 w-4 mr-2 ${isSeoLoading ? 'animate-spin' : ''}`} />
                    Actualiser le score SEO
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-lg border border-border bg-card p-4">
                  <p className="text-xs text-muted-foreground">Pages auditées</p>
                  <p className="mt-1 text-2xl font-bold text-foreground">{seoReport?.summary.auditedPages ?? 0}</p>
                </div>
                <div className="rounded-lg border border-border bg-card p-4">
                  <p className="text-xs text-muted-foreground">Checks validés</p>
                  <p className="mt-1 text-2xl font-bold text-foreground">{seoReport?.summary.passedChecks ?? 0}</p>
                </div>
                <div className="rounded-lg border border-border bg-card p-4">
                  <p className="text-xs text-muted-foreground">Points à corriger</p>
                  <p className="mt-1 text-2xl font-bold text-foreground">{seoReport?.summary.failedChecks ?? 0}</p>
                </div>
                <div className="rounded-lg border border-border bg-card p-4">
                  <p className="text-xs text-muted-foreground">Pages solides</p>
                  <p className="mt-1 text-2xl font-bold text-foreground">{seoReport?.summary.strongPages ?? 0}</p>
                </div>
              </div>

              <div className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
                <div className="rounded-lg border border-border bg-card p-4 space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-foreground">Visibilité réelle SEO</p>
                      <p className="text-xs text-muted-foreground">Sous-score séparé basé sur Search Console + Analytics.</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-black text-foreground">{visibilityReport?.seo.score ?? '--'}/100</p>
                      <Badge variant={visibilityStatus.badge}>{visibilityStatus.label}</Badge>
                    </div>
                  </div>
                  <Progress value={visibilityReport?.seo.score ?? 0} className="h-2.5" />
                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 text-sm">
                    <div className="rounded-md border border-border p-3">
                      <p className="text-muted-foreground">Impressions</p>
                      <p className="font-semibold text-foreground">{visibilityReport?.seo.metrics.impressions ?? 0}</p>
                    </div>
                    <div className="rounded-md border border-border p-3">
                      <p className="text-muted-foreground">CTR</p>
                      <p className="font-semibold text-foreground">{visibilityReport ? `${visibilityReport.seo.metrics.ctr.toFixed(1)}%` : '--'}</p>
                    </div>
                    <div className="rounded-md border border-border p-3">
                      <p className="text-muted-foreground">Position moy.</p>
                      <p className="font-semibold text-foreground">{visibilityReport ? visibilityReport.seo.metrics.avgPosition.toFixed(1) : '--'}</p>
                    </div>
                    <div className="rounded-md border border-border p-3">
                      <p className="text-muted-foreground">Sessions organiques</p>
                      <p className="font-semibold text-foreground">{visibilityReport?.seo.metrics.organicSessions ?? 0}</p>
                    </div>
                    <div className="rounded-md border border-border p-3">
                      <p className="text-muted-foreground">Engagement organique</p>
                      <p className="font-semibold text-foreground">{visibilityReport ? `${visibilityReport.seo.metrics.organicEngagementRate.toFixed(1)}%` : '--'}</p>
                    </div>
                  </div>
                  {visibilityError ? <p className="text-xs text-destructive">{visibilityError}</p> : null}
                </div>

                <div className="rounded-lg border border-border bg-card p-4 text-sm text-muted-foreground space-y-2">
                  <p className="font-medium text-foreground">Méthodologie live</p>
                  <p>{visibilityReport?.methodology.seo ?? 'Chargement...'}</p>
                  <p><span className="font-medium text-foreground">Poids validé :</span> {visibilityReport?.seo.weightedPassed ?? 0} / {visibilityReport?.seo.weightedTotal ?? 0}</p>
                  <p><span className="font-medium text-foreground">Checks validés :</span> {visibilityReport?.seo.passedChecks ?? 0} / {visibilityReport?.seo.totalChecks ?? 0}</p>
                </div>
              </div>

              <div className="rounded-lg border border-border bg-card p-4 text-sm text-muted-foreground">
                <p><span className="font-medium text-foreground">Pages comptées :</span> {seoReport?.summary.auditedPages ?? 0}</p>
                <p><span className="font-medium text-foreground">Poids cumulé validé :</span> {seoReport?.summary.weightedPassed ?? 0} / {seoReport?.summary.weightedTotal ?? 0}</p>
              </div>

              <div className="rounded-lg border border-border bg-card p-4 text-sm text-muted-foreground">
                <p className="font-medium text-foreground">Méthodologie</p>
                <p className="mt-1">{seoReport?.methodology ?? 'Chargement...'}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Points SEO détectés</CardTitle>
              <CardDescription>Score on-page basé sur des critères reconnus, distinct du trafic réel ou du ranking.</CardDescription>
            </CardHeader>
            <CardContent>
              {!seoReport || isSeoLoading ? (
                <div className="text-sm text-muted-foreground">Chargement du détail...</div>
              ) : (
                <div className="space-y-3 max-h-[34rem] overflow-y-auto pr-1">
                  {failedSeoChecks.length === 0 ? (
                    <div className="rounded-lg border border-border bg-card p-4 text-sm text-muted-foreground">
                      Aucun point SEO bloquant détecté sur cet audit.
                    </div>
                  ) : failedSeoChecks.map((issue) => (
                    <div key={issue.id} className="rounded-lg border border-border bg-card p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-medium text-foreground">{issue.description}</p>
                          <p className="mt-1 text-xs text-muted-foreground">{issue.file}</p>
                        </div>
                        <div className="flex flex-wrap items-center justify-end gap-2">
                          <Badge variant={issue.pass ? 'secondary' : 'destructive'}>{issue.pass ? 'Passe' : 'Échec'}</Badge>
                          <Badge variant="outline">{issue.category}</Badge>
                          <Badge variant="outline">Poids {issue.weight}</Badge>
                        </div>
                      </div>
                      <div className="mt-3 grid gap-2 text-sm text-muted-foreground">
                        <p><span className="font-medium text-foreground">Impact score :</span> {issue.pass ? '+' : '-'}{issue.impact}</p>
                        <p><span className="font-medium text-foreground">Pourquoi :</span> {issue.reason}</p>
                        <p><span className="font-medium text-foreground">Attendu :</span> {issue.expected}</p>
                        {issue.actual ? <p><span className="font-medium text-foreground">Trouvé :</span> {issue.actual}</p> : null}
                      </div>
                      {!issue.pass ? (
                        <div className="mt-4 flex flex-wrap gap-2">
                          <Button size="sm" onClick={() => openLovableFix(getSeoFixAction(issue))}>
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
              <CardTitle className="text-base">Checks de visibilité réelle SEO</CardTitle>
              <CardDescription>Search Console + Analytics, séparés du score technique.</CardDescription>
            </CardHeader>
            <CardContent>
              {!visibilityReport ? (
                <div className="text-sm text-muted-foreground">Chargement du détail live...</div>
              ) : (
                <div className="space-y-3">
                  {failedVisibilityChecks.length === 0 ? (
                    <div className="rounded-lg border border-border bg-card p-4 text-sm text-muted-foreground">
                      Aucun signal de visibilité réelle SEO en échec pour le moment.
                    </div>
                  ) : failedVisibilityChecks.map((check) => (
                    <div key={check.id} className="rounded-lg border border-border bg-card p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-medium text-foreground">{check.label}</p>
                          <p className="mt-1 text-xs text-muted-foreground">Source : {check.source.toUpperCase()}</p>
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
                          <Button size="sm" onClick={() => openLovableFix(getVisibilityFixAction(check))}>
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

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Suggestions SEO automatiques
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Articles générés par IA à partir de vos données Google Search Console
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchSuggestions} disabled={isLoading || isGenerating}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
          <Button onClick={generateSuggestions} disabled={isGenerating || isLoading} size="sm">
            <Search className={`h-4 w-4 mr-2 ${isGenerating ? 'animate-pulse' : ''}`} />
            {isGenerating ? 'Analyse GSC...' : 'Générer depuis GSC'}
          </Button>
        </div>
      </div>

      {suggestions.length === 0 && !isLoading && (
        <Card>
          <CardContent className="py-12 text-center">
            <Sparkles className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground">Aucune suggestion pour le moment.</p>
            <p className="text-sm text-muted-foreground mt-1">
              Cliquez sur "Générer depuis GSC" pour analyser vos requêtes et créer des brouillons d'articles.
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {suggestions.map((s) => (
          <Card key={s.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-1 min-w-0">
                  <CardTitle className="text-base sm:text-lg truncate">{s.title}</CardTitle>
                  <CardDescription className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="font-mono bg-muted px-2 py-0.5 rounded">"{s.target_keyword}"</span>
                    {s.suggested_author && <span>par {s.suggested_author}</span>}
                  </CardDescription>
                </div>
                {statusBadge(s.status)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4 text-sm mb-4">
                {s.gsc_position && (
                  <div className="flex items-center gap-1.5">
                    <TrendingUp className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>Position: <strong>{s.gsc_position}</strong></span>
                  </div>
                )}
                {s.gsc_impressions != null && (
                  <div className="flex items-center gap-1.5">
                    <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>{s.gsc_impressions} impressions</span>
                  </div>
                )}
                {s.gsc_clicks != null && (
                  <div className="text-muted-foreground">{s.gsc_clicks} clics</div>
                )}
              </div>

              {s.suggested_meta_description && (
                <p className="text-sm text-muted-foreground italic mb-4 border-l-2 border-primary/30 pl-3">
                  {s.suggested_meta_description}
                </p>
              )}

              <div className="flex flex-wrap gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      Prévisualiser
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl max-h-[80vh]">
                    <DialogHeader>
                      <DialogTitle>{s.title}</DialogTitle>
                    </DialogHeader>
                    <ScrollArea className="max-h-[60vh] pr-4">
                      <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
                        {s.suggested_content}
                      </div>
                    </ScrollArea>
                  </DialogContent>
                </Dialog>

                <Button variant="outline" size="sm" onClick={() => copyContent(s)}>
                  <Copy className="h-4 w-4 mr-1" />
                  Copier
                </Button>

                {s.status === 'pending' && (
                  <>
                    <Button size="sm" onClick={() => updateStatus(s.id, 'approved')}>
                      <Check className="h-4 w-4 mr-1" />
                      Approuver
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => updateStatus(s.id, 'rejected')}>
                      <X className="h-4 w-4 mr-1" />
                      Rejeter
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};