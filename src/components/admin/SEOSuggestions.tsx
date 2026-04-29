import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Sparkles, RefreshCw, Eye, Check, X, Copy, TrendingUp, Search, AlertCircle, CheckCircle2, Wand2, Pencil, Save, CalendarDays, Image as ImageIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { applySeoContentImprovement, applySeoIssueFix, applySeoVisibilityFix, buildContentImprovementKey, canAutoFixSeoIssue, hydrateAuditReport, isBlogArticleSuggestionSlug, listAppliedContentImprovements, validateSeoIssueFix, validateSeoVisibilityFix, type ContentSuggestionDraft } from '@/lib/auditFixes';

type FixAction = {
  label: string;
  details: string;
};

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
  short_description: string | null;
  image_url: string | null;
  published_at: string | null;
  suggested_author: string | null;
  status: string;
  created_at: string;
};

type EditingSuggestion = {
  suggested_content: string;
  image_url: string;
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
      coveredPages: number;
      totalTrackedPages: number;
      visibleQueries: number;
      opportunityQueries: number;
    };
    topQueries: Array<{ query: string; page: string; clicks: number; impressions: number; position: number; ctr: number; intent: string; recommendation: string }>;
    queryOpportunities: Array<{ query: string; page: string; clicks: number; impressions: number; position: number; ctr: number; intent: string; recommendation: string }>;
    pageVisibility: Array<{ path: string; clicks: number; impressions: number; avgPosition: number; ctr: number; opportunityScore: number; aiPotential: string; contentAction: string }>;
  };
};

type AppliedSuggestionState = Record<string, ContentSuggestionDraft>;

const scoreMeta = {
  excellent: { label: 'Fiable', badge: 'default' as const },
  good: { label: 'Solide', badge: 'secondary' as const },
  warning: { label: 'À corriger', badge: 'outline' as const },
  critical: { label: 'Fragile', badge: 'destructive' as const },
};

const getScoreCategory = (score: number) => {
  if (score >= 85) return 'excellent' as const;
  if (score >= 70) return 'good' as const;
  if (score >= 50) return 'warning' as const;
  return 'critical' as const;
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

type SEOSuggestionsProps = {
  mode?: 'all' | 'seo' | 'articles';
};

export const SEOSuggestions = ({ mode = 'all' }: SEOSuggestionsProps) => {
  const showSeoPanels = mode === 'all' || mode === 'seo';
  const showArticlesPanel = mode === 'all' || mode === 'articles';

  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [seoReport, setSeoReport] = useState<SeoAuditReport | null>(null);
  const [visibilityReport, setVisibilityReport] = useState<VisibilityScore | null>(null);
  const [seoError, setSeoError] = useState<string | null>(null);
  const [visibilityError, setVisibilityError] = useState<string | null>(null);
  const [isSeoLoading, setIsSeoLoading] = useState(true);
  const [fixStatuses, setFixStatuses] = useState<Record<string, 'idle' | 'sending' | 'success' | 'error'>>({});
  const [appliedSuggestions, setAppliedSuggestions] = useState<AppliedSuggestionState>({});
  const [appliedImprovementsLoaded, setAppliedImprovementsLoaded] = useState(false);

  useEffect(() => {
    if (showArticlesPanel) {
      fetchSuggestions();
    }

    if (showSeoPanels) {
      loadSeoReport();
      loadVisibilityReport();
      void loadAppliedImprovements();
    }
  }, [showArticlesPanel, showSeoPanels]);

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

      const nextReport = response.data as VisibilityScore;
      const resolvedIds = await Promise.all(
        nextReport.seo.checks
          .filter((check) => !check.pass)
          .map(async (check) => ((await validateSeoVisibilityFix(check)) ? check.id : null)),
      );

      const resolvedSet = new Set(resolvedIds.filter(Boolean) as string[]);
      const resolvedWeight = nextReport.seo.checks
        .filter((check) => !check.pass && resolvedSet.has(check.id))
        .reduce((sum, check) => sum + check.weight, 0);
      const resolvedCount = nextReport.seo.checks.filter((check) => !check.pass && resolvedSet.has(check.id)).length;
      const weightedPassed = nextReport.seo.weightedPassed + resolvedWeight;
      const passedChecks = nextReport.seo.passedChecks + resolvedCount;
      const score = Math.round((weightedPassed / nextReport.seo.weightedTotal) * 100);

      setVisibilityReport({
        ...nextReport,
        seo: {
          ...nextReport.seo,
          score,
          status: passedChecks === nextReport.seo.totalChecks ? 'excellent' : nextReport.seo.status,
          passedChecks,
          weightedPassed,
          checks: nextReport.seo.checks.map((check) => (
            resolvedSet.has(check.id)
              ? { ...check, pass: true, reason: 'Action déjà appliquée et restaurée depuis les données sauvegardées.' }
              : check
          )),
        },
      });
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
      const resolvedIds = await Promise.all(
        data.checks
          .filter((issue) => !issue.pass)
          .map(async (issue) => ((await validateSeoIssueFix(issue)) ? issue.id : null)),
      );

      const hydrated = await hydrateAuditReport(
        data,
        resolvedIds.filter(Boolean) as string[],
        'Correction déjà appliquée et restaurée depuis les données sauvegardées.',
      );

      setSeoReport({
        ...hydrated,
        issues: hydrated.checks.filter((item) => !item.pass),
        pageScores: hydrated.pageScores.map((page) => {
          const resolvedForPage = data.checks.filter((issue) => issue.file === page.file && !issue.pass).length
            - hydrated.checks.filter((issue) => issue.file === page.file && !issue.pass).length;
          return resolvedForPage > 0
            ? { ...page, issues: Math.max(0, page.issues - resolvedForPage), score: Math.min(100, page.score + resolvedForPage * 10) }
            : page;
        }),
      });
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
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Erreur chargement suggestions');
    } else {
      setSuggestions(((data as Suggestion[]) || []).filter((item) => isBlogArticleSuggestionSlug(item.slug)));
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

  const loadAppliedImprovements = async () => {
    try {
      setAppliedImprovementsLoaded(false);
      const items = await listAppliedContentImprovements('seo');
      setAppliedSuggestions(items);
    } catch {
      setAppliedSuggestions({});
    } finally {
      setAppliedImprovementsLoaded(true);
    }
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

  const refreshSeoScores = async () => {
    await Promise.all([loadSeoReport(), loadVisibilityReport(), loadAppliedImprovements()]);
  };

  const markSeoIssueResolved = (issue: SeoAuditCheck) => {
    setSeoReport((current) => {
      if (!current) return current;

      const existingIssue = current.checks.find((item) => item.id === issue.id);
      if (!existingIssue || existingIssue.pass) return current;

      const updatedChecks = current.checks.map((item) => item.id === issue.id
        ? { ...item, pass: true, actual: item.expected, reason: 'Correction appliquée et validée depuis le backoffice.' }
        : item);

      const nextFailedChecks = Math.max(0, current.summary.failedChecks - 1);
      const nextPassedChecks = current.summary.passedChecks + 1;
      const nextWeightedPassed = current.summary.weightedPassed + issue.weight;
      const nextScore = Math.round((nextWeightedPassed / current.summary.weightedTotal) * 100);
      const nextPageScores = current.pageScores.map((page) => page.file === issue.file
        ? { ...page, issues: Math.max(0, page.issues - 1), score: Math.min(100, page.issues <= 1 ? 100 : page.score) }
        : page);
      const becameStrong = current.pageScores.some((page) => page.file === issue.file && page.issues === 1);

      return {
        ...current,
        score: nextScore,
        status: nextFailedChecks === 0 ? 'excellent' : current.status,
        checks: updatedChecks,
        issues: updatedChecks.filter((item) => !item.pass),
        pageScores: nextPageScores,
        summary: {
          ...current.summary,
          failedChecks: nextFailedChecks,
          passedChecks: nextPassedChecks,
          weightedPassed: nextWeightedPassed,
          strongPages: current.summary.strongPages + (becameStrong ? 1 : 0),
        },
      };
    });
  };

  const runDirectFix = async (key: string, issue: SeoAuditCheck) => {
    setFixStatuses((current) => ({ ...current, [key]: 'sending' }));

    try {
      const result = await applySeoIssueFix(issue);

      markSeoIssueResolved(issue);
      setFixStatuses((current) => ({ ...current, [key]: 'success' }));
      toast.success(result.message);
    } catch (error) {
      setFixStatuses((current) => ({ ...current, [key]: 'error' }));
      toast.error(error instanceof Error ? error.message : 'Erreur pendant la correction.');
    }
  };

  const markVisibilityCheckResolved = (check: VisibilityCheck) => {
    setVisibilityReport((current) => {
      if (!current) return current;

      const existingCheck = current.seo.checks.find((item) => item.id === check.id);
      if (!existingCheck || existingCheck.pass) return current;

      const updatedChecks = current.seo.checks.map((item) => item.id === check.id
        ? { ...item, pass: true, reason: 'Action appliquée et validée depuis le backoffice.' }
        : item);
      const nextPassedChecks = current.seo.passedChecks + 1;
      const nextWeightedPassed = current.seo.weightedPassed + check.weight;
      const nextScore = Math.round((nextWeightedPassed / current.seo.weightedTotal) * 100);

      return {
        ...current,
        seo: {
          ...current.seo,
          score: nextScore,
          status: nextPassedChecks === current.seo.totalChecks ? 'excellent' : current.seo.status,
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
      const result = await applySeoVisibilityFix(check);

      markVisibilityCheckResolved(check);
      setFixStatuses((current) => ({ ...current, [key]: 'success' }));
      toast.success(result.message);
    } catch (error) {
      setFixStatuses((current) => ({ ...current, [key]: 'error' }));
      toast.error(error instanceof Error ? error.message : 'Erreur pendant la correction.');
    }
  };

  const runPageContentImprovement = async (key: string, page: VisibilityScore['seo']['pageVisibility'][number]) => {
    setFixStatuses((current) => ({ ...current, [key]: 'sending' }));

    try {
      const payload = { scope: 'page' as const, path: page.path, recommendation: page.contentAction };
      const result = await applySeoContentImprovement(payload);

      rememberAppliedSuggestion(key, result.suggestion);
      await Promise.all([loadAppliedImprovements(), loadVisibilityReport()]);
      setFixStatuses((current) => ({ ...current, [key]: 'success' }));
      toast.success('Amélioration SEO activée', {
        description: `Les métadonnées de ${result.suggestion.applied_path ?? page.path} ont été mises à jour.`,
      });
    } catch (error) {
      setFixStatuses((current) => ({ ...current, [key]: 'error' }));
      toast.error(error instanceof Error ? error.message : "Erreur pendant l'amélioration contenu.");
    }
  };

  const runQueryContentImprovement = async (key: string, item: VisibilityScore['seo']['queryOpportunities'][number]) => {
    setFixStatuses((current) => ({ ...current, [key]: 'sending' }));

    try {
      const payload = {
        scope: 'query' as const,
        path: item.page,
        query: item.query,
        intent: item.intent,
        recommendation: item.recommendation,
      };
      const result = await applySeoContentImprovement(payload);

      rememberAppliedSuggestion(key, result.suggestion);
      await Promise.all([loadAppliedImprovements(), loadVisibilityReport()]);
      setFixStatuses((current) => ({ ...current, [key]: 'success' }));
      toast.success('Amélioration SEO activée', {
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

  const statusBadge = (status: string) => {
    const config: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; label: string }> = {
      pending: { variant: 'outline', label: '⏳ En attente' },
      approved: { variant: 'default', label: '✅ Approuvé' },
      rejected: { variant: 'destructive', label: '❌ Rejeté' },
    };
    const c = config[status] || config.pending;
    return <Badge variant={c.variant}>{c.label}</Badge>;
  };

  const seoImprovementProgress = useMemo(() => {
    if (!visibilityReport) {
      return { appliedCount: 0, totalCount: 0, bonus: 0, displayScore: 0 };
    }

    const actionableKeys = new Set([
      ...visibilityReport.seo.queryOpportunities.map((item) => buildContentImprovementKey({
        source: 'seo',
        scope: 'query',
        path: item.page,
        query: item.query,
      })),
      ...visibilityReport.seo.pageVisibility.map((page) => buildContentImprovementKey({
        source: 'seo',
        scope: 'page',
        path: page.path,
      })),
    ]);

    const uniqueApplied = new Map<string, ContentSuggestionDraft>();
    Object.values(appliedSuggestions).forEach((item) => {
      if (item?.slug) uniqueApplied.set(item.slug, item);
    });

    const appliedCount = Array.from(uniqueApplied.keys()).filter((slug) => actionableKeys.has(slug)).length;
    const totalCount = actionableKeys.size;
    const bonus = totalCount > 0 ? Math.round((appliedCount / totalCount) * 20) : 0;

    return {
      appliedCount,
      totalCount,
      bonus,
      displayScore: Math.min(100, visibilityReport.seo.score + bonus),
    };
  }, [appliedSuggestions, visibilityReport]);

  const visibilityDisplayScore = visibilityReport ? seoImprovementProgress.displayScore : 0;

  const seoStatus = useMemo(() => {
    if (!seoReport) return scoreMeta.warning;
    return scoreMeta[seoReport.status] ?? scoreMeta.warning;
  }, [seoReport]);

  const visibilityStatus = useMemo(() => {
    if (!visibilityReport) return scoreMeta.warning;
    return scoreMeta[getScoreCategory(visibilityDisplayScore)] ?? scoreMeta.warning;
  }, [visibilityDisplayScore, visibilityReport]);

  const failedSeoChecks = useMemo(
    () => seoReport?.checks.filter((issue) => !issue.pass) ?? [],
    [seoReport],
  );

  const failedVisibilityChecks = useMemo(
    () => visibilityReport?.seo.checks.filter((check) => !check.pass) ?? [],
    [visibilityReport],
  );

  const pendingSeoQueryOpportunities = useMemo(
    () => (visibilityReport?.seo.queryOpportunities ?? []).filter((item) => !appliedSuggestions[buildContentImprovementKey({
      source: 'seo',
      scope: 'query',
      path: item.page,
      query: item.query,
    })]),
    [appliedSuggestions, visibilityReport],
  );

  const pendingSeoPageImprovements = useMemo(
    () => (visibilityReport?.seo.pageVisibility ?? []).filter((page) => !appliedSuggestions[buildContentImprovementKey({
      source: 'seo',
      scope: 'page',
      path: page.path,
    })]),
    [appliedSuggestions, visibilityReport],
  );

  return (
    <div className="space-y-6">
      {showSeoPanels ? (seoError ? (
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
                  <Button variant="outline" size="sm" onClick={() => void refreshSeoScores()} disabled={isSeoLoading}>
                    <RefreshCw className={`h-4 w-4 mr-2 ${isSeoLoading ? 'animate-spin' : ''}`} />
                    Actualiser les scores SEO
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
                      <p className="text-2xl font-black text-foreground">{visibilityReport ? visibilityDisplayScore : '--'}/100</p>
                      <Badge variant={visibilityStatus.badge}>{visibilityStatus.label}</Badge>
                    </div>
                  </div>
                  <Progress value={visibilityReport ? visibilityDisplayScore : 0} className="h-2.5" />
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
                    <div className="rounded-md border border-border p-3">
                      <p className="text-muted-foreground">Pages couvertes</p>
                      <p className="font-semibold text-foreground">{visibilityReport ? `${visibilityReport.seo.metrics.coveredPages}/${visibilityReport.seo.metrics.totalTrackedPages}` : '--'}</p>
                    </div>
                    <div className="rounded-md border border-border p-3">
                      <p className="text-muted-foreground">Requêtes visibles</p>
                      <p className="font-semibold text-foreground">{visibilityReport?.seo.metrics.visibleQueries ?? 0}</p>
                    </div>
                    <div className="rounded-md border border-border p-3">
                      <p className="text-muted-foreground">Requêtes opportunités</p>
                      <p className="font-semibold text-foreground">{visibilityReport?.seo.metrics.opportunityQueries ?? 0}</p>
                    </div>
                  </div>
                  {visibilityError ? <p className="text-xs text-destructive">{visibilityError}</p> : null}
                </div>

                <div className="rounded-lg border border-border bg-card p-4 text-sm text-muted-foreground space-y-2">
                  <p className="font-medium text-foreground">Méthodologie live</p>
                  <p>{visibilityReport?.methodology.seo ?? 'Chargement...'} Le score affiché inclut aussi l'avancement des améliorations activées.</p>
                  <p><span className="font-medium text-foreground">Poids validé :</span> {visibilityReport?.seo.weightedPassed ?? 0} / {visibilityReport?.seo.weightedTotal ?? 0}</p>
                  <p><span className="font-medium text-foreground">Checks validés :</span> {visibilityReport?.seo.passedChecks ?? 0} / {visibilityReport?.seo.totalChecks ?? 0}</p>
                  <p><span className="font-medium text-foreground">Améliorations activées :</span> {seoImprovementProgress.appliedCount} / {seoImprovementProgress.totalCount} · bonus exécution +{seoImprovementProgress.bonus} pts</p>
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
                      {!issue.pass && canAutoFixSeoIssue(issue) ? (
                        <div className="mt-4 flex flex-wrap gap-2">
                          <Button size="sm" onClick={() => void runDirectFix(issue.id, issue)} disabled={fixStatuses[issue.id] === 'sending'}>
                            <Wand2 className="h-4 w-4 mr-1" />
                            {fixStatuses[issue.id] === 'sending' ? 'Correction...' : 'Appliquer la correction'}
                          </Button>
                        </div>
                      ) : null}
                      {renderFixStatus(issue.id)}
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
                          <Button size="sm" onClick={() => void runVisibilityFix(check.id, check)} disabled={fixStatuses[check.id] === 'sending'}>
                            <Wand2 className="h-4 w-4 mr-1" />
                            {fixStatuses[check.id] === 'sending' ? 'Correction...' : 'Appliquer la correction'}
                          </Button>
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
              <CardTitle className="text-base">Couverture requêtes & opportunités</CardTitle>
              <CardDescription>Volume SEO réel, requêtes visibles et contenus à renforcer.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 lg:grid-cols-2">
              <div className="space-y-3">
                <p className="text-sm font-medium text-foreground">Top requêtes visibles</p>
                <div className="space-y-3 max-h-[24rem] overflow-y-auto pr-1">
                  {visibilityReport?.seo.topQueries?.slice(0, 8).map((item) => (
                    <div key={`${item.query}-${item.page}`} className="rounded-lg border border-border p-3 text-sm">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-medium text-foreground">{item.query}</p>
                          <p className="text-xs text-muted-foreground mt-1">{item.page}</p>
                        </div>
                        <Badge variant="outline">{item.intent}</Badge>
                      </div>
                      <div className="mt-2 grid gap-1 text-muted-foreground">
                        <p>Impressions : <span className="font-medium text-foreground">{item.impressions}</span></p>
                        <p>Position : <span className="font-medium text-foreground">{item.position.toFixed(1)}</span> · CTR : <span className="font-medium text-foreground">{item.ctr.toFixed(1)}%</span></p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                <p className="text-sm font-medium text-foreground">Pistes contenu prioritaires</p>
                <div className="space-y-3 max-h-[24rem] overflow-y-auto pr-1">
                  {!appliedImprovementsLoaded ? (
                    <div className="rounded-lg border border-border bg-card p-4 text-sm text-muted-foreground">
                      Chargement des améliorations SEO déjà activées...
                    </div>
                  ) : pendingSeoQueryOpportunities.slice(0, 8).map((item) => (
                    <div key={`${item.query}-${item.page}-opp`} className="rounded-lg border border-border p-3 text-sm">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-medium text-foreground">{item.query}</p>
                          <p className="text-xs text-muted-foreground mt-1">{item.page}</p>
                        </div>
                        <Badge variant="secondary">{item.intent}</Badge>
                      </div>
                      <div className="mt-2 grid gap-1 text-muted-foreground">
                        <p>Impressions : <span className="font-medium text-foreground">{item.impressions}</span> · Position : <span className="font-medium text-foreground">{item.position.toFixed(1)}</span></p>
                        <p><span className="font-medium text-foreground">Action contenu :</span> {item.recommendation}</p>
                      </div>
                      <p className="mt-2 text-xs text-muted-foreground">Cette action applique directement les métadonnées améliorées sur la page cible.</p>
                      <div className="mt-3">
                        <Button size="sm" onClick={() => void runQueryContentImprovement(`seo-query-content-${item.page}-${item.query}`, item)} disabled={fixStatuses[`seo-query-content-${item.page}-${item.query}`] === 'sending'}>
                          <Wand2 className="h-4 w-4 mr-1" />
                          {fixStatuses[`seo-query-content-${item.page}-${item.query}`] === 'sending' ? 'Activation...' : "Activer l'amélioration"}
                        </Button>
                      </div>
                      {renderFixStatus(`seo-query-content-${item.page}-${item.query}`)}
                      {renderAppliedSuggestion(`seo-query-content-${item.page}-${item.query}`)}
                    </div>
                  ))}
                  {appliedImprovementsLoaded && pendingSeoQueryOpportunities.length === 0 ? (
                    <div className="rounded-lg border border-border bg-card p-4 text-sm text-muted-foreground">
                      Toutes les améliorations SEO de contenu de cet encart ont déjà été activées.
                    </div>
                  ) : null}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Pages à renforcer</CardTitle>
              <CardDescription>Pages visibles ou absentes à travailler côté contenu.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {!appliedImprovementsLoaded ? (
                <div className="rounded-lg border border-border bg-card p-4 text-sm text-muted-foreground">
                  Chargement des améliorations SEO déjà activées...
                </div>
              ) : pendingSeoPageImprovements.slice(0, 10).map((page) => (
                <div key={page.path} className="rounded-lg border border-border p-3 text-sm">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="font-medium text-foreground">{page.path}</p>
                      <p className="text-xs text-muted-foreground mt-1">Potentiel IA : {page.aiPotential} · Score d'opportunité : {page.opportunityScore}/100</p>
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
                    <Button size="sm" onClick={() => void runPageContentImprovement(`seo-page-content-${page.path}`, page)} disabled={fixStatuses[`seo-page-content-${page.path}`] === 'sending'}>
                      <Wand2 className="h-4 w-4 mr-1" />
                      {fixStatuses[`seo-page-content-${page.path}`] === 'sending' ? 'Activation...' : "Activer l'amélioration"}
                    </Button>
                  </div>
                  {renderFixStatus(`seo-page-content-${page.path}`)}
                  {renderAppliedSuggestion(`seo-page-content-${page.path}`)}
                </div>
              ))}
              {appliedImprovementsLoaded && pendingSeoPageImprovements.length === 0 ? (
                <div className="rounded-lg border border-border bg-card p-4 text-sm text-muted-foreground">
                  Toutes les améliorations SEO de pages de cet encart ont déjà été activées.
                </div>
              ) : null}
            </CardContent>
          </Card>
        </>
      )) : null}

      {showArticlesPanel ? <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
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
      </div> : null}

      {showArticlesPanel && suggestions.length === 0 && !isLoading && (
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

      {showArticlesPanel ? <div className="grid gap-4">
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
              {s.short_description && (
                <p className="text-sm mb-4 border-l-2 border-accent/40 pl-3">
                  {s.short_description}
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
      </div> : null}

    </div>
  );
};