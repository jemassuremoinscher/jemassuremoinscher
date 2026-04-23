import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Sparkles, RefreshCw, Eye, Check, X, Copy, TrendingUp, Search, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';

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

const scoreMeta = {
  excellent: { label: 'Fiable', badge: 'default' as const },
  good: { label: 'Solide', badge: 'secondary' as const },
  warning: { label: 'À corriger', badge: 'outline' as const },
  critical: { label: 'Fragile', badge: 'destructive' as const },
};

export const SEOSuggestions = () => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [seoReport, setSeoReport] = useState<SeoAuditReport | null>(null);
  const [seoError, setSeoError] = useState<string | null>(null);
  const [isSeoLoading, setIsSeoLoading] = useState(true);

  useEffect(() => {
    fetchSuggestions();
    loadSeoReport();
  }, []);

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
                  {seoReport.checks.map((issue) => (
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