import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Eye, Loader2, FileText, Globe, RefreshCw, CheckCircle2, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";
import { blogDrafts2026 } from "@/data/blogDrafts2026";
import { invalidatePublishedDraftsCache } from "@/hooks/usePublishedDrafts";

export const DraftArticlesPublisher = () => {
  const [publishedSlugs, setPublishedSlugs] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);

  const fetchPublished = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from("published_drafts").select("slug");
    if (error) toast.error("Erreur de chargement : " + error.message);
    setPublishedSlugs(new Set((data || []).map((r) => r.slug)));
    invalidatePublishedDraftsCache();
    setLoading(false);
  }, []);

  useEffect(() => { fetchPublished(); }, [fetchPublished]);

  const publish = async (slug: string, title: string) => {
    setBusy(slug);
    const { data: { session } } = await supabase.auth.getSession();
    const { error } = await supabase
      .from("published_drafts")
      .insert({ slug, published_by: session?.user.id });
    if (error) toast.error("Erreur : " + error.message);
    else toast.success(`"${title}" est en ligne 🎉`);
    await fetchPublished();
    setBusy(null);
  };

  const unpublish = async (slug: string, title: string) => {
    setBusy(slug);
    const { error } = await supabase.from("published_drafts").delete().eq("slug", slug);
    if (error) toast.error("Erreur : " + error.message);
    else toast.info(`"${title}" est repassé en brouillon`);
    await fetchPublished();
    setBusy(null);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Brouillons prêts à publier
              <Badge variant="outline">{blogDrafts2026.length} articles</Badge>
            </CardTitle>
            <CardDescription>
              Vérifiez chaque article via l'aperçu, puis publiez-le sur le site public d'un clic.
            </CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={fetchPublished} aria-label="Rafraîchir">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin" /></div>
        ) : (
          blogDrafts2026.map((article) => {
            const isPublished = publishedSlugs.has(article.slug);
            const isBusy = busy === article.slug;
            return (
              <Card key={article.slug} className="overflow-hidden">
                <div className="grid md:grid-cols-[200px_1fr] gap-4">
                  {article.image && (
                    <img
                      src={typeof article.image === "string" ? article.image : (article.image as any)}
                      alt={article.title}
                      className="w-full h-40 md:h-full object-cover"
                      loading="lazy"
                    />
                  )}
                  <div className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-base leading-tight">{article.title}</h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          {article.category} · {article.author} · {article.readTime}
                        </p>
                      </div>
                      {isPublished ? (
                        <Badge className="bg-primary text-primary-foreground gap-1">
                          <CheckCircle2 className="h-3 w-3" /> En ligne
                        </Badge>
                      ) : (
                        <Badge variant="outline">Brouillon</Badge>
                      )}
                    </div>

                    <p className="text-sm text-muted-foreground line-clamp-2">{article.description}</p>

                    <div className="flex flex-wrap gap-2 pt-2">
                      <Button asChild variant="outline" size="sm">
                        <Link to={`/blog-preview/${article.slug}`} target="_blank" rel="noopener">
                          <Eye className="h-3 w-3 mr-1" /> Aperçu
                        </Link>
                      </Button>
                      {isPublished ? (
                        <>
                          <Button asChild variant="outline" size="sm">
                            <Link to={`/blog/${article.slug}`} target="_blank" rel="noopener">
                              <Globe className="h-3 w-3 mr-1" /> Voir en ligne
                            </Link>
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => unpublish(article.slug, article.title)}
                            disabled={isBusy}
                            aria-label="Dépublier"
                          >
                            {isBusy ? <Loader2 className="h-3 w-3 mr-1 animate-spin" /> : <EyeOff className="h-3 w-3 mr-1" />}
                            Dépublier
                          </Button>
                        </>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => publish(article.slug, article.title)}
                          disabled={isBusy}
                        >
                          {isBusy ? <Loader2 className="h-3 w-3 mr-1 animate-spin" /> : <Globe className="h-3 w-3 mr-1" />}
                          Publier sur le site
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })
        )}
        <p className="text-xs text-muted-foreground border-t pt-3">
          ℹ️ « Publier sur le site » rend l'article immédiatement visible sur <code>/blog/{`{slug}`}</code> et dans la liste publique. Vous pouvez le repasser en brouillon à tout moment.
        </p>
      </CardContent>
    </Card>
  );
};
