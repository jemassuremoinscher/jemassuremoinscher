import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Send, Eye, Loader2, Share2, Linkedin, Facebook, Instagram, RefreshCw, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { blogDrafts2026 } from "@/data/blogDrafts2026";
import type { BlogArticle } from "@/data/blogArticles";
import { useLanguage } from "@/contexts/LanguageContext";

const SITE_URL = "https://jemassuremoinscher.fr";
type Channel = "linkedin" | "facebook" | "instagram";

const buildPayload = (article: BlogArticle, channel: Channel) => {
  const headline = article.socialHeadlines?.[channel] || article.description;
  const url = `${SITE_URL}/blog/${article.slug}`;
  const image = article.image
    ? (article.image.startsWith("http") ? article.image : `${SITE_URL}${article.image}`)
    : null;
  return { headline, url, image };
};

export const DraftArticlesSocialPublisher = () => {
  const { t } = useLanguage();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("linkedin_auto_posts")
      .select("article_slug,status,linkedin_status,facebook_status,posted_at")
      .in("article_slug", blogDrafts2026.map((d) => d.slug));
    setPosts(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  const publishToMake = async (article: BlogArticle) => {
    setPosting(article.slug);
    try {
      const linkedin = buildPayload(article, "linkedin");
      const facebook = buildPayload(article, "facebook");
      const instagram = buildPayload(article, "instagram");

      const existing = posts.find((p) => p.article_slug === article.slug);
      const payload = {
        article_slug: article.slug,
        article_title: article.title,
        article_url: linkedin.url,
        image_url: linkedin.image,
        short_description: linkedin.headline,
        post_content: `${linkedin.headline}\n\n👉 ${linkedin.url}\n\n#assurance #jemassuremoinscher`,
        provider: "make",
        status: "pending",
        linkedin_status: "pending",
        facebook_status: "pending",
      } as any;

      if (existing) {
        await supabase.from("linkedin_auto_posts").update(payload).eq("article_slug", article.slug);
      } else {
        await supabase.from("linkedin_auto_posts").insert(payload);
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { toast.error("Non authentifié"); setPosting(null); return; }

      const res = await supabase.functions.invoke("post-to-linkedin", {
        body: {
          slug: article.slug,
          channels: ["linkedin", "facebook", "instagram"],
          headlines: { linkedin: linkedin.headline, facebook: facebook.headline, instagram: instagram.headline },
        },
        headers: { Authorization: `Bearer ${session.access_token}` },
      });

      if (res.error) toast.error("Erreur Make.com : " + res.error.message);
      else toast.success(`"${article.title}" envoyé à Make.com 🎉 (LinkedIn + Facebook + Instagram)`);
      fetchPosts();
    } catch (e: any) {
      toast.error(e.message || "Erreur d'envoi");
    } finally {
      setPosting(null);
    }
  };

  const statusForSlug = (slug: string) => posts.find((p) => p.article_slug === slug);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Share2 className="h-5 w-5 text-primary" />
              Publier les brouillons sur les réseaux sociaux
              <Badge variant="outline">{blogDrafts2026.length} articles</Badge>
            </CardTitle>
            <CardDescription>
              Envoie l'article à Make.com pour publication sur LinkedIn, Facebook et Instagram. La publication sur le site se gère depuis l'onglet « Articles ».
            </CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={fetchPosts} aria-label={t("a11y.common.refresh")}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin" /></div>
        ) : (
          blogDrafts2026.map((article) => {
            const status = statusForSlug(article.slug);
            const isPosted = status?.status === "posted";
            return (
              <Card key={article.slug} className="overflow-hidden">
                <div className="grid md:grid-cols-[200px_1fr] gap-4">
                  {article.image && (
                    <img
                      src={typeof article.image === "string" ? article.image : (article.image as any)}
                      alt={article.title}
                      width={800}
                      height={450}
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
                      {isPosted && (
                        <Badge className="bg-primary text-primary-foreground gap-1">
                          <CheckCircle2 className="h-3 w-3" /> Envoyé
                        </Badge>
                      )}
                      {status?.status === "pending" && (
                        <Badge variant="outline">En file d'attente</Badge>
                      )}
                    </div>

                    <Tabs defaultValue="linkedin" className="w-full">
                      <TabsList className="h-8">
                        <TabsTrigger value="linkedin" className="text-xs gap-1"><Linkedin className="h-3 w-3" />LinkedIn</TabsTrigger>
                        <TabsTrigger value="facebook" className="text-xs gap-1"><Facebook className="h-3 w-3" />Facebook</TabsTrigger>
                        <TabsTrigger value="instagram" className="text-xs gap-1"><Instagram className="h-3 w-3" />Instagram</TabsTrigger>
                      </TabsList>
                      {(["linkedin", "facebook", "instagram"] as Channel[]).map((ch) => (
                        <TabsContent key={ch} value={ch} className="mt-2">
                          <p className="text-sm bg-muted/50 p-3 rounded-md whitespace-pre-line">
                            {article.socialHeadlines?.[ch] || article.description}
                          </p>
                        </TabsContent>
                      ))}
                    </Tabs>

                    <div className="flex flex-wrap gap-2 pt-2">
                      <Button asChild variant="outline" size="sm">
                        <Link to={`/blog-preview/${article.slug}`} target="_blank" rel="noopener">
                          <Eye className="h-3 w-3 mr-1" /> Aperçu
                        </Link>
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => publishToMake(article)}
                        disabled={posting === article.slug}
                      >
                        {posting === article.slug ? (
                          <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                        ) : (
                          <Send className="h-3 w-3 mr-1" />
                        )}
                        {isPosted ? "Renvoyer à Make.com" : "Publier sur réseaux sociaux"}
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </CardContent>
    </Card>
  );
};
