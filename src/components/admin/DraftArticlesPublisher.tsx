import { useState, useCallback, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  Eye, Loader2, FileText, Globe, RefreshCw, CheckCircle2, EyeOff, Pencil, Save, Sparkles,
  Linkedin, Facebook, Send, Share2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { blogDrafts2026 } from "@/data/blogDrafts2026";
import { invalidatePublishedDraftsCache } from "@/hooks/usePublishedDrafts";
import { useLanguage } from "@/contexts/LanguageContext";

type Channel = "linkedin" | "facebook" | "instagram";
type PublishedRow = { slug: string; short_description: string | null };
type SocialPost = {
  id: string;
  article_slug: string;
  status: string;
  linkedin_status: string;
  facebook_status: string;
  posted_at: string | null;
  short_description: string | null;
  channel_overrides: Partial<Record<Channel, string>> | null;
  image_url: string | null;
};

type CombinedArticle = {
  source: "draft" | "seo";
  slug: string;
  title: string;
  description?: string;
  category?: string;
  author?: string;
  readTime?: string;
  image?: string | null;
  defaultShort: string;
  seoId?: string;
  seoShort?: string | null;
  seoStatus?: "draft" | "pending" | "approved";
};

const buildShortFromTitle = (title: string) => {
  const t = title.replace(/\s+/g, " ").trim();
  const safe = t.length > 95 ? `${t.slice(0, 92)}...` : t;
  return `🚨 Et si ${safe.toLowerCase()} vous coûtait plus cher que prévu ? La réponse ici ⬇️`;
};

const resolveImage = (img: any): string | null => {
  if (!img) return null;
  const SITE = "https://www.jemassuremoinscher.fr";
  if (typeof img !== "string") return null;
  if (img.startsWith("http")) return img;
  try {
    return new URL(img, typeof window !== "undefined" ? window.location.origin : SITE).href;
  } catch {
    return `${SITE}${img.startsWith("/") ? "" : "/"}${img}`;
  }
};

export const DraftArticlesPublisher = () => {
  const { t } = useLanguage();
  const [publishedRows, setPublishedRows] = useState<PublishedRow[]>([]);
  const [seoApproved, setSeoApproved] = useState<any[]>([]);
  const [socialPosts, setSocialPosts] = useState<SocialPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [posting, setPosting] = useState<string | null>(null);

  // Edit state — global short OR per-channel: key = `${slug}` or `${slug}:${channel}`
  const [editing, setEditing] = useState<Record<string, string>>({});
  const [savingEdit, setSavingEdit] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    const [pubRes, seoRes, postsRes] = await Promise.all([
      supabase.from("published_drafts").select("slug, short_description"),
      supabase
        .from("seo_article_suggestions")
        .select("*")
        .in("status", ["approved", "draft", "pending"])
        .order("published_at", { ascending: false, nullsFirst: false }),
      supabase.from("linkedin_auto_posts").select("*"),
    ]);
    if (pubRes.error) toast.error("Erreur chargement publiés : " + pubRes.error.message);
    setPublishedRows((pubRes.data as any) || []);
    setSeoApproved((seoRes.data as any) || []);
    setSocialPosts((postsRes.data as any) || []);
    invalidatePublishedDraftsCache();
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAll();
    const ch = supabase
      .channel("content_manager_admin")
      .on("postgres_changes", { event: "*", schema: "public", table: "published_drafts" }, () => fetchAll())
      .on("postgres_changes", { event: "*", schema: "public", table: "seo_article_suggestions" }, () => fetchAll())
      .on("postgres_changes", { event: "*", schema: "public", table: "linkedin_auto_posts" }, () => fetchAll())
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [fetchAll]);

  const publishedSlugSet = useMemo(() => new Set(publishedRows.map((r) => r.slug)), [publishedRows]);
  const publishedShortBySlug = useMemo(() => {
    const m = new Map<string, string | null>();
    publishedRows.forEach((r) => m.set(r.slug, r.short_description));
    return m;
  }, [publishedRows]);
  const postBySlug = useMemo(() => {
    const m = new Map<string, SocialPost>();
    socialPosts.forEach((p) => m.set(p.article_slug, p));
    return m;
  }, [socialPosts]);

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

  // ----- Site publish actions -----
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

  // ----- Global short description -----
  const startEditGlobal = (article: CombinedArticle) => {
    const current = article.source === "seo"
      ? (article.seoShort ?? article.defaultShort)
      : (publishedShortBySlug.get(article.slug) ?? article.defaultShort);
    setEditing((s) => ({ ...s, [article.slug]: current || "" }));
  };
  const saveGlobal = async (article: CombinedArticle) => {
    const value = (editing[article.slug] ?? "").trim() || null;
    setSavingEdit(article.slug);
    let error: any = null;
    if (article.source === "seo") {
      const r = await supabase.from("seo_article_suggestions").update({ short_description: value } as any).eq("id", article.seoId!);
      error = r.error;
    } else if (publishedSlugSet.has(article.slug)) {
      const r = await supabase.from("published_drafts").update({ short_description: value } as any).eq("slug", article.slug);
      error = r.error;
    } else {
      const { data: { session } } = await supabase.auth.getSession();
      const r = await supabase.from("published_drafts").insert({ slug: article.slug, published_by: session?.user.id, short_description: value } as any);
      error = r.error;
    }
    setSavingEdit(null);
    if (error) { toast.error("Erreur : " + error.message); return; }
    toast.success("Accroche par défaut mise à jour ✅");
    setEditing((s) => { const n = { ...s }; delete n[article.slug]; return n; });
    await fetchAll();
  };

  // ----- Per-channel override (stored on linkedin_auto_posts) -----
  const ensurePostRow = async (article: CombinedArticle): Promise<SocialPost | null> => {
    const existing = postBySlug.get(article.slug);
    if (existing) return existing;
    const siteUrl = "https://www.jemassuremoinscher.fr";
    const articleUrl = `${siteUrl}/blog/${article.slug}`;
    const imageUrl = resolveImage(article.image);
    const currentShort = article.source === "seo"
      ? (article.seoShort ?? article.defaultShort)
      : (publishedShortBySlug.get(article.slug) ?? article.defaultShort);
    const { data, error } = await supabase
      .from("linkedin_auto_posts")
      .insert({
        article_slug: article.slug,
        article_title: article.title,
        article_url: articleUrl,
        image_url: imageUrl,
        short_description: currentShort,
        provider: "make",
        status: "pending",
        linkedin_status: "pending",
        facebook_status: "pending",
      } as any)
      .select()
      .single();
    if (error) { toast.error("Erreur création file : " + error.message); return null; }
    return data as any;
  };

  const channelKey = (slug: string, ch: Channel) => `${slug}:${ch}`;
  const startEditChannel = (article: CombinedArticle, ch: Channel) => {
    const post = postBySlug.get(article.slug);
    const current =
      post?.channel_overrides?.[ch] ??
      post?.short_description ??
      (article.source === "seo" ? (article.seoShort ?? article.defaultShort)
        : (publishedShortBySlug.get(article.slug) ?? article.defaultShort));
    setEditing((s) => ({ ...s, [channelKey(article.slug, ch)]: current || "" }));
  };
  const saveChannel = async (article: CombinedArticle, ch: Channel) => {
    const k = channelKey(article.slug, ch);
    const value = (editing[k] ?? "").trim();
    setSavingEdit(k);
    const post = await ensurePostRow(article);
    if (!post) { setSavingEdit(null); return; }
    const next = { ...(post.channel_overrides || {}), [ch]: value };
    const { error } = await supabase.from("linkedin_auto_posts").update({ channel_overrides: next } as any).eq("id", post.id);
    setSavingEdit(null);
    if (error) { toast.error("Erreur : " + error.message); return; }
    toast.success(`Accroche ${ch} mise à jour ✅`);
    setEditing((s) => { const n = { ...s }; delete n[k]; return n; });
    await fetchAll();
  };
  const resetChannel = async (article: CombinedArticle, ch: Channel) => {
    const post = postBySlug.get(article.slug);
    if (!post) return;
    const next = { ...(post.channel_overrides || {}) };
    delete next[ch];
    const { error } = await supabase.from("linkedin_auto_posts").update({ channel_overrides: next } as any).eq("id", post.id);
    if (error) { toast.error("Erreur : " + error.message); return; }
    toast.success(`Accroche ${ch} réinitialisée`);
    await fetchAll();
  };

  // ----- Publish to socials now -----
  const publishToSocialsNow = async (article: CombinedArticle) => {
    setPosting(article.slug);
    try {
      await ensurePostRow(article);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { toast.error("Non authentifié"); return; }
      const res = await supabase.functions.invoke("post-to-linkedin", {
        body: { slug: article.slug },
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (res.error) toast.error("Erreur: " + res.error.message);
      else toast.success(res.data?.message || `"${article.title}" envoyé aux réseaux 🎉`);
      await fetchAll();
    } catch (e: any) {
      toast.error(e.message || "Erreur d'envoi");
    } finally {
      setPosting(null);
    }
  };

  const totalPublished = publishedSlugSet.size + seoArticles.length;

  const channelStatusBadge = (status: string | undefined) => {
    if (status === "posted") return <Badge className="bg-primary text-primary-foreground text-[10px] gap-1"><CheckCircle2 className="h-2.5 w-2.5" />Envoyé</Badge>;
    if (status === "failed") return <Badge variant="destructive" className="text-[10px]">Échoué</Badge>;
    if (status === "disabled") return <Badge variant="outline" className="text-[10px]">Désactivé</Badge>;
    return <Badge variant="outline" className="text-[10px]">En attente</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <CardTitle className="flex items-center gap-2 flex-wrap">
              <FileText className="h-5 w-5 text-primary" />
              Articles & diffusion
              <Badge variant="outline">{allArticles.length} articles</Badge>
              <Badge className="bg-primary text-primary-foreground gap-1">
                <CheckCircle2 className="h-3 w-3" /> {totalPublished} en ligne
              </Badge>
            </CardTitle>
            <CardDescription>
              Brouillons + suggestions SEO approuvées. Modifiez l'accroche par défaut ou par réseau, et publiez sur les réseaux en un clic.
            </CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={fetchAll} aria-label={t("a11y.common.refresh")}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {loading ? (
          <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin" /></div>
        ) : allArticles.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">Aucun article disponible.</p>
        ) : (
          (() => {
            const renderCard = (article: CombinedArticle) => {
              const isPublishedSite = article.source === "seo" ? true : publishedSlugSet.has(article.slug);
              const isBusy = busy === article.slug;
              const post = postBySlug.get(article.slug);
              const isPublishedSocial = post?.status === "posted";
              const globalShort = article.source === "seo"
                ? (article.seoShort ?? article.defaultShort)
                : (publishedShortBySlug.get(article.slug) ?? article.defaultShort);
              const isOverridden = article.source === "seo"
                ? !!article.seoShort
                : (publishedShortBySlug.get(article.slug) ?? null) !== null;
              const isEditingGlobal = article.slug in editing;

              return (
                <Card key={`${article.source}-${article.slug}`} className="overflow-hidden">
                  <div className="grid md:grid-cols-[200px_1fr] gap-4">
                    {article.image ? (
                      <img src={article.image} alt={article.title} width={800} height={450} className="w-full h-40 md:h-full object-cover" loading="lazy" />
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
                        <div className="flex flex-col items-end gap-1">
                          <div className="flex flex-wrap items-center gap-1 justify-end">
                            {article.source === "seo" && (
                              <Badge variant="secondary" className="gap-1"><Sparkles className="h-3 w-3" /> SEO</Badge>
                            )}
                            {isPublishedSite && (
                              <Badge className="bg-primary text-primary-foreground gap-1"><Globe className="h-3 w-3" /> Site internet</Badge>
                            )}
                            {isPublishedSocial && (
                              <Badge className="bg-accent text-accent-foreground gap-1"><Share2 className="h-3 w-3" /> Réseaux Sociaux</Badge>
                            )}
                            {!isPublishedSite && !isPublishedSocial && (
                              <Badge variant="outline">Brouillon</Badge>
                            )}
                          </div>
                          {post?.posted_at && (
                            <span className="text-[10px] text-muted-foreground">
                              Réseaux : {new Date(post.posted_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
                            </span>
                          )}
                        </div>
                      </div>

                      {article.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">{article.description}</p>
                      )}

                      {/* Accroche par défaut (utilisée pour tous les réseaux) */}
                      <div className="rounded-md border border-border bg-muted/40 p-3 space-y-2">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                            Accroche réseaux sociaux
                          </span>
                          <div className="flex items-center gap-2">
                            {isOverridden && !isEditingGlobal && <Badge variant="secondary" className="text-[10px]">Personnalisée</Badge>}
                            {!isEditingGlobal && (
                              <Button size="sm" variant="ghost" className="h-6 px-2 text-xs" onClick={() => startEditGlobal(article)}>
                                <Pencil className="h-3 w-3 mr-1" /> Modifier
                              </Button>
                            )}
                          </div>
                        </div>
                        {isEditingGlobal ? (
                          <>
                            <Textarea
                              value={editing[article.slug]}
                              onChange={(e) => setEditing((s) => ({ ...s, [article.slug]: e.target.value }))}
                              rows={3}
                              className="text-sm"
                              placeholder="🚨 Et si …"
                            />
                            <div className="flex gap-2">
                              <Button size="sm" onClick={() => saveGlobal(article)} disabled={savingEdit === article.slug}>
                                {savingEdit === article.slug ? <Loader2 className="h-3 w-3 mr-1 animate-spin" /> : <Save className="h-3 w-3 mr-1" />}
                                Enregistrer
                              </Button>
                              <Button size="sm" variant="ghost" onClick={() => setEditing((s) => { const n = { ...s }; delete n[article.slug]; return n; })}>
                                Annuler
                              </Button>
                            </div>
                          </>
                        ) : (
                          <p className="text-sm whitespace-pre-line">{globalShort}</p>
                        )}
                      </div>

                      {/* Statut par réseau (LinkedIn + Facebook) */}
                      <div className="flex flex-wrap gap-2 text-xs">
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-muted/40">
                          <Linkedin className="h-3 w-3" /> LinkedIn {channelStatusBadge(post?.linkedin_status)}
                        </span>
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-muted/40">
                          <Facebook className="h-3 w-3" /> Facebook {channelStatusBadge(post?.facebook_status)}
                        </span>
                      </div>

                      {/* Actions row */}
                      <div className="flex flex-wrap gap-2 pt-1 border-t border-border/50">
                        <Button asChild variant="outline" size="sm">
                          <Link to={`/blog-preview/${article.slug}`} target="_blank" rel="noopener">
                            <Eye className="h-3 w-3 mr-1" /> Aperçu
                          </Link>
                        </Button>
                        {article.source === "draft" && (
                          isPublishedSite ? (
                            <>
                              <Button asChild variant="outline" size="sm">
                                <Link to={`/blog/${article.slug}`} target="_blank" rel="noopener">
                                  <Globe className="h-3 w-3 mr-1" /> Voir en ligne
                                </Link>
                              </Button>
                              <Button size="sm" variant="ghost" onClick={() => unpublish(article.slug, article.title)} disabled={isBusy} aria-label={t("a11y.common.unpublish")}>
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
                        <Button
                          size="sm"
                          variant={isPublishedSocial ? "outline" : "default"}
                          onClick={() => publishToSocialsNow(article)}
                          disabled={posting === article.slug}
                        >
                          {posting === article.slug ? <Loader2 className="h-3 w-3 mr-1 animate-spin" /> : <Send className="h-3 w-3 mr-1" />}
                          {isPublishedSocial ? "Renvoyer aux réseaux" : "Publier sur les réseaux"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            };

            const isArticlePublished = (a: CombinedArticle) => {
              const siteOk = a.source === "seo" ? true : publishedSlugSet.has(a.slug);
              const socialOk = postBySlug.get(a.slug)?.status === "posted";
              return siteOk || socialOk;
            };
            const drafts = allArticles.filter((a) => !isArticlePublished(a));
            const published = allArticles.filter(isArticlePublished);

            return (
              <>
                <section className="space-y-3">
                  <h3 className="text-sm font-semibold flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    Brouillons & à publier
                    <Badge variant="outline">{drafts.length}</Badge>
                  </h3>
                  {drafts.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Aucun brouillon en attente.</p>
                  ) : (
                    <div className="space-y-4">{drafts.map(renderCard)}</div>
                  )}
                </section>

                <details className="rounded-lg border border-border bg-muted/20 group">
                  <summary className="cursor-pointer list-none flex items-center justify-between gap-2 p-3 hover:bg-muted/40 transition-colors rounded-lg">
                    <span className="flex items-center gap-2 text-sm font-semibold">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      Archives — Articles publiés
                      <Badge variant="outline">{published.length}</Badge>
                    </span>
                    <span className="text-xs text-muted-foreground group-open:hidden">Afficher</span>
                    <span className="text-xs text-muted-foreground hidden group-open:inline">Masquer</span>
                  </summary>
                  <div className="border-t border-border p-3">
                    {published.length === 0 ? (
                      <p className="text-sm text-muted-foreground">Aucun article publié pour le moment.</p>
                    ) : (
                      <div className="space-y-4">{published.map(renderCard)}</div>
                    )}
                  </div>
                </details>
              </>
            );
          })()
        )}
        <p className="text-xs text-muted-foreground border-t pt-3">
          ℹ️ L'accroche est unique pour LinkedIn et Facebook. « Publier sur les réseaux » envoie immédiatement à Make.com.
        </p>
      </CardContent>
    </Card>
  );
};
