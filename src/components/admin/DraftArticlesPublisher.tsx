import { useState, useCallback, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Eye, Loader2, FileText, Globe, RefreshCw, CheckCircle2, EyeOff, Pencil, Save, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { blogDrafts2026 } from "@/data/blogDrafts2026";
import { invalidatePublishedDraftsCache } from "@/hooks/usePublishedDrafts";

type PublishedRow = { slug: string; short_description: string | null };

type CombinedArticle = {
  source: "draft" | "seo";
  slug: string;
  title: string;
  description?: string;
  category?: string;
  author?: string;
  readTime?: string;
  image?: string | null;
  // for short description / make.com slug
  defaultShort: string;
  // for SEO articles
  seoId?: string;
  seoShort?: string | null;
};

const buildShortFromTitle = (title: string) => {
  const t = title.replace(/\s+/g, " ").trim();
  const safe = t.length > 95 ? `${t.slice(0, 92)}...` : t;
  return `🚨 Et si ${safe.toLowerCase()} vous coûtait plus cher que prévu ? La réponse ici ⬇️`;
};

export const DraftArticlesPublisher = () => {
  const [publishedRows, setPublishedRows] = useState<PublishedRow[]>([]);
  const [seoApproved, setSeoApproved] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);

  // editing of "social short description" (the make.com accroche) — keyed by slug
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    const [pubRes, seoRes] = await Promise.all([
      supabase.from("published_drafts").select("slug, short_description"),
      supabase
        .from("seo_article_suggestions")
        .select("*")
        .eq("status", "approved")
        .order("published_at", { ascending: false, nullsFirst: false }),
    ]);
    if (pubRes.error) toast.error("Erreur chargement publiés : " + pubRes.error.message);
    setPublishedRows((pubRes.data as any) || []);
    setSeoApproved((seoRes.data as any) || []);
    invalidatePublishedDraftsCache();
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAll();
    const ch = supabase
      .channel("published_drafts_admin")
      .on("postgres_changes", { event: "*", schema: "public", table: "published_drafts" }, () => fetchAll())
      .on("postgres_changes", { event: "*", schema: "public", table: "seo_article_suggestions" }, () => fetchAll())
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [fetchAll]);

  const publishedSlugSet = useMemo(() => new Set(publishedRows.map((r) => r.slug)), [publishedRows]);
  const publishedShortBySlug = useMemo(() => {
    const m = new Map<string, string | null>();
    publishedRows.forEach((r) => m.set(r.slug, r.short_description));
    return m;
  }, [publishedRows]);

  // All static drafts (always shown — published or not)
  const staticArticles: CombinedArticle[] = useMemo(
    () =>
      blogDrafts2026.map((a) => ({
        source: "draft" as const,
        slug: a.slug,
        title: a.title,
        description: (a as any).description,
        category: (a as any).category,
        author: (a as any).author,
        readTime: (a as any).readTime,
        image: typeof a.image === "string" ? a.image : ((a.image as any) ?? null),
        defaultShort: buildShortFromTitle(a.title),
      })),
    [],
  );

  // SEO approved articles
  const seoArticles: CombinedArticle[] = useMemo(
    () =>
      seoApproved.map((s) => ({
        source: "seo" as const,
        slug: s.slug,
        title: s.title,
        description: s.suggested_meta_description || undefined,
        category: "SEO",
        author: s.suggested_author || undefined,
        image: s.image_url || null,
        defaultShort: s.short_description || buildShortFromTitle(s.title),
        seoId: s.id,
        seoShort: s.short_description,
      })),
    [seoApproved],
  );

  const allArticles = useMemo(() => [...staticArticles, ...seoArticles], [staticArticles, seoArticles]);

  const publish = async (slug: string, title: string) => {
    setBusy(slug);
    const { data: { session } } = await supabase.auth.getSession();
    const { error } = await supabase.from("published_drafts").insert({ slug, published_by: session?.user.id });
    if (error) toast.error("Erreur : " + error.message);
    else toast.success(`"${title}" est en ligne 🎉`);
    await fetchAll();
    setBusy(null);
  };

  const unpublish = async (slug: string, title: string) => {
    setBusy(slug);
    const { error } = await supabase.from("published_drafts").delete().eq("slug", slug);
    if (error) toast.error("Erreur : " + error.message);
    else toast.info(`"${title}" est repassé en brouillon`);
    await fetchAll();
    setBusy(null);
  };

  const startEditShort = (article: CombinedArticle) => {
    setEditingSlug(article.slug);
    const current =
      article.source === "seo"
        ? (article.seoShort ?? article.defaultShort)
        : (publishedShortBySlug.get(article.slug) ?? article.defaultShort);
    setEditValue(current || "");
  };

  const saveShort = async (article: CombinedArticle) => {
    setSavingEdit(true);
    const value = editValue.trim() || null;
    let error: any = null;
    if (article.source === "seo") {
      const res = await supabase
        .from("seo_article_suggestions")
        .update({ short_description: value } as any)
        .eq("id", article.seoId!);
      error = res.error;
    } else {
      // Upsert into published_drafts (must exist — only published items can be edited from this card normally,
      // but we also allow editing draft-only by inserting a row with just slug+short_description? Keep simple:
      // require it to be already published, otherwise create a stub row.
      if (publishedSlugSet.has(article.slug)) {
        const res = await supabase
          .from("published_drafts")
          .update({ short_description: value } as any)
          .eq("slug", article.slug);
        error = res.error;
      } else {
        const { data: { session } } = await supabase.auth.getSession();
        const res = await supabase
          .from("published_drafts")
          .insert({ slug: article.slug, published_by: session?.user.id, short_description: value } as any);
        error = res.error;
      }
    }
    setSavingEdit(false);
    if (error) {
      toast.error("Erreur sauvegarde : " + error.message);
      return;
    }
    toast.success("Accroche réseaux sociaux mise à jour ✅");
    setEditingSlug(null);
    setEditValue("");
    await fetchAll();
  };

  const totalPublished = publishedSlugSet.size + seoArticles.length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Articles
              <Badge variant="outline">{allArticles.length} articles</Badge>
              <Badge className="bg-primary text-primary-foreground gap-1">
                <CheckCircle2 className="h-3 w-3" /> {totalPublished} publiés
              </Badge>
            </CardTitle>
            <CardDescription>
              Brouillons statiques + suggestions SEO approuvées. Modifiez l'accroche envoyée aux réseaux (Make.com) directement ici.
            </CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={fetchAll} aria-label="Rafraîchir">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin" /></div>
        ) : allArticles.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">Aucun article disponible.</p>
        ) : (
          allArticles.map((article) => {
            const isPublished = article.source === "seo" ? true : publishedSlugSet.has(article.slug);
            const isBusy = busy === article.slug;
            const currentShort =
              article.source === "seo"
                ? (article.seoShort ?? article.defaultShort)
                : (publishedShortBySlug.get(article.slug) ?? article.defaultShort);
            const isOverridden =
              article.source === "seo"
                ? !!article.seoShort
                : (publishedShortBySlug.get(article.slug) ?? null) !== null;
            const isEditing = editingSlug === article.slug;

            return (
              <Card key={`${article.source}-${article.slug}`} className="overflow-hidden">
                <div className="grid md:grid-cols-[200px_1fr] gap-4">
                  {article.image ? (
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-40 md:h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-40 md:h-full bg-muted flex items-center justify-center text-muted-foreground text-xs">
                      Pas d'image
                    </div>
                  )}
                  <div className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-base leading-tight">{article.title}</h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          {[article.category, article.author, article.readTime].filter(Boolean).join(" · ")}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        {article.source === "seo" && (
                          <Badge variant="secondary" className="gap-1">
                            <Sparkles className="h-3 w-3" /> SEO
                          </Badge>
                        )}
                        {isPublished ? (
                          <Badge className="bg-primary text-primary-foreground gap-1">
                            <CheckCircle2 className="h-3 w-3" /> En ligne
                          </Badge>
                        ) : (
                          <Badge variant="outline">Brouillon</Badge>
                        )}
                      </div>
                    </div>

                    {article.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">{article.description}</p>
                    )}

                    {/* Social short description (Make.com accroche) */}
                    <div className="rounded-md border border-border bg-muted/40 p-3 space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                          Accroche réseaux (Make.com)
                        </span>
                        {isOverridden && !isEditing && (
                          <Badge variant="secondary" className="text-[10px]">Personnalisée</Badge>
                        )}
                      </div>
                      {isEditing ? (
                        <>
                          <Textarea
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            rows={3}
                            className="text-sm"
                            placeholder="🚨 Et si …"
                          />
                          <div className="flex gap-2">
                            <Button size="sm" onClick={() => saveShort(article)} disabled={savingEdit}>
                              {savingEdit ? <Loader2 className="h-3 w-3 mr-1 animate-spin" /> : <Save className="h-3 w-3 mr-1" />}
                              Enregistrer
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => setEditingSlug(null)}>
                              Annuler
                            </Button>
                          </div>
                        </>
                      ) : (
                        <p className="text-sm whitespace-pre-line">{currentShort}</p>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2 pt-1">
                      <Button asChild variant="outline" size="sm">
                        <Link to={`/blog-preview/${article.slug}`} target="_blank" rel="noopener">
                          <Eye className="h-3 w-3 mr-1" /> Aperçu
                        </Link>
                      </Button>
                      {!isEditing && (
                        <Button variant="outline" size="sm" onClick={() => startEditShort(article)}>
                          <Pencil className="h-3 w-3 mr-1" /> Modifier accroche
                        </Button>
                      )}
                      {article.source === "draft" && (
                        isPublished ? (
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
                          <Button size="sm" onClick={() => publish(article.slug, article.title)} disabled={isBusy}>
                            {isBusy ? <Loader2 className="h-3 w-3 mr-1 animate-spin" /> : <Globe className="h-3 w-3 mr-1" />}
                            Publier sur le site
                          </Button>
                        )
                      )}
                      {article.source === "seo" && (
                        <Button asChild variant="outline" size="sm">
                          <Link to={`/blog/${article.slug}`} target="_blank" rel="noopener">
                            <Globe className="h-3 w-3 mr-1" /> Voir en ligne
                          </Link>
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
          ℹ️ L'accroche modifiée ici est utilisée par Make.com pour les publications LinkedIn / Facebook (champ <code>short_description</code>).
        </p>
      </CardContent>
    </Card>
  );
};
