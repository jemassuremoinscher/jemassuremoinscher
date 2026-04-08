import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Sparkles, RefreshCw, Eye, Check, X, Copy, TrendingUp, Search } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

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

export const SEOSuggestions = () => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    fetchSuggestions();
  }, []);

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

  return (
    <div className="space-y-6">
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