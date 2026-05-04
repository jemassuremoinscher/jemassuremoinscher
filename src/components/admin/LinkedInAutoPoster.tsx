import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Facebook, Instagram, Linkedin, Send, Settings, Plus, Loader2, Trash2, RefreshCw, Share2, Eye, CheckCircle2, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { blogArticles } from '@/data/blogArticles';
import { blogArticles2026 } from '@/data/blogArticles2026';
import { blogDrafts2026 } from '@/data/blogDrafts2026';

const allArticles = [...blogArticles, ...blogArticles2026, ...blogDrafts2026];
type Channel = 'linkedin' | 'facebook' | 'instagram';

const buildShortDescription = (title: string, content?: string | null) => {
  const base = (content || title).replace(/\s+/g, ' ').trim();
  return `🛡️ ${base.length > 210 ? `${base.slice(0, 207).trim()}...` : base}`;
};

export const LinkedInAutoPoster = () => {
  const [webhookUrl, setWebhookUrl] = useState('https://hook.eu1.make.com/swhr61xm1p2alnmmfrlif7af4ofd71o7');
  const [isActive, setIsActive] = useState(true);
  const [postDay, setPostDay] = useState('monday');
  const [postHour, setPostHour] = useState(9);
  const [configId, setConfigId] = useState<string | null>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [posting, setPosting] = useState<string | null>(null);
  const [syncingImages, setSyncingImages] = useState(false);

  // New post form
  const [selectedSlug, setSelectedSlug] = useState('');
  const [customContent, setCustomContent] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const resolveArticleImage = (img: any): string | null => {
    if (!img) return null;
    const SITE = 'https://www.jemassuremoinscher.fr';
    if (typeof img !== 'string') return null;
    if (img.startsWith('http')) return img;
    try {
      return new URL(img, typeof window !== 'undefined' ? window.location.origin : SITE).href;
    } catch {
      return `${SITE}${img.startsWith('/') ? '' : '/'}${img}`;
    }
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    const [configRes, postsRes] = await Promise.all([
      supabase.from('linkedin_config').select('*').limit(1).maybeSingle(),
      supabase.from('linkedin_auto_posts').select('*').order('created_at', { ascending: false }),
    ]);

    if (configRes.data) {
      setConfigId(configRes.data.id);
      setWebhookUrl(configRes.data.webhook_url || 'https://hook.eu1.make.com/swhr61xm1p2alnmmfrlif7af4ofd71o7');
      setIsActive(configRes.data.is_active);
      setPostDay(configRes.data.post_day);
      setPostHour(configRes.data.post_hour);
    }
    if (postsRes.data) setPosts(postsRes.data);
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const saveConfig = async () => {
    if (!webhookUrl.trim()) {
      toast.error('Veuillez entrer l\'URL du webhook Make.com');
      return;
    }
    setSaving(true);
    const configData = { webhook_url: webhookUrl, is_active: isActive, post_day: postDay, post_hour: postHour, provider: 'make', linkedin_enabled: true, facebook_enabled: true } as any;

    if (configId) {
      const { error } = await supabase.from('linkedin_config').update(configData).eq('id', configId);
      if (error) toast.error('Erreur sauvegarde: ' + error.message);
      else toast.success('Configuration LinkedIn sauvegardée ✅');
    } else {
      const { data, error } = await supabase.from('linkedin_config').insert(configData).select().single();
      if (error) toast.error('Erreur création: ' + error.message);
      else { setConfigId(data.id); toast.success('Configuration LinkedIn créée ✅'); }
    }
    setSaving(false);
  };

  const queueArticle = async () => {
    if (!selectedSlug) { toast.error('Sélectionnez un article'); return; }
    const article = allArticles.find(a => a.slug === selectedSlug);
    if (!article) return;

    const existing = posts.find(p => p.article_slug === selectedSlug && p.status === 'pending');
    if (existing) { toast.error('Cet article est déjà en file d\'attente'); return; }

    const siteUrl = 'https://jemassuremoinscher.fr';
    const articleUrl = `${siteUrl}/blog/${article.slug}`;
    const imageUrl = article.image ? (article.image.startsWith('http') ? article.image : `${siteUrl}${article.image}`) : null;
    const defaultContent = `📰 Nouvel article sur jemassuremoinscher.fr !\n\n${article.title}\n\n👉 Lire l'article complet : ${siteUrl}/blog/${article.slug}\n\n#assurance #comparateur #économies #jemassuremoinscher`;
    const articleSummary = (article as any).excerpt || (article as any).description || null;
    const shortDescription = buildShortDescription(article.title, customContent || articleSummary);

    const { error } = await supabase.from('linkedin_auto_posts').insert({
      article_slug: article.slug,
      article_title: article.title,
      article_url: articleUrl,
      image_url: imageUrl,
      short_description: shortDescription,
      post_content: customContent.trim() || defaultContent,
      provider: 'make',
      status: 'pending',
      linkedin_status: 'pending',
      facebook_status: 'pending',
    } as any);

    if (error) toast.error('Erreur: ' + error.message);
    else {
      toast.success(`"${article.title}" ajouté à la file d'attente 🎯`);
      setSelectedSlug('');
      setCustomContent('');
      setShowAddForm(false);
      fetchData();
    }
  };

  const triggerNow = async (slug: string) => {
    if (!configId) { toast.error('Configurez d\'abord le webhook'); return; }
    setPosting(slug);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { toast.error('Non authentifié'); return; }

      const res = await supabase.functions.invoke('post-to-linkedin', {
        body: { slug },
        headers: { Authorization: `Bearer ${session.access_token}` },
      });

      if (res.error) toast.error('Erreur: ' + res.error.message);
      else toast.success(res.data?.message || 'Article envoyé à Make.com pour LinkedIn et Facebook ! 🎉');
      fetchData();
    } catch (e: any) {
      toast.error(e.message || 'Erreur d\'envoi');
    } finally {
      setPosting(null);
    }
  };

  const deletePost = async (id: string) => {
    const { error } = await supabase.from('linkedin_auto_posts').delete().eq('id', id);
    if (error) toast.error('Erreur suppression');
    else { toast.success('Supprimé'); fetchData(); }
  };

  const postedSlugs = new Set(posts.filter(p => p.status === 'posted').map(p => p.article_slug));
  const availableArticles = allArticles.filter(a => !postedSlugs.has(a.slug));

  const statusBadge = (status: string) => {
    switch (status) {
      case 'posted': return <Badge className="bg-primary text-primary-foreground">Envoyé</Badge>;
      case 'pending': return <Badge variant="outline" className="border-accent text-accent-foreground">En attente</Badge>;
      case 'failed': return <Badge variant="destructive">Échoué</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (loading) return <div className="flex items-center justify-center p-8"><Loader2 className="h-6 w-6 animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Share2 className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">Publications sociales automatiques</h2>
      </div>

      {/* Config */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Settings className="h-5 w-5" /> Configuration Make.com</CardTitle>
          <CardDescription>Envoi automatique vers Make.com pour publier ou monitorer LinkedIn et Facebook.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">URL Webhook Make.com</label>
            <Input
              value={webhookUrl}
              onChange={e => setWebhookUrl(e.target.value)}
              placeholder="https://hook.eu1.make.com/..."
              type="url"
            />
            <p className="text-xs text-muted-foreground mt-1">Payload envoyé : titre, description courte, URL de l'article, URL d'image si disponible, slug et canaux LinkedIn/Facebook.</p>
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2">
              <Switch checked={isActive} onCheckedChange={setIsActive} />
              <span className="text-sm">{isActive ? 'Actif' : 'Désactivé'}</span>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm">Jour :</label>
              <Select value={postDay} onValueChange={setPostDay}>
                <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {['monday', 'tuesday', 'wednesday', 'thursday', 'friday'].map(d => (
                    <SelectItem key={d} value={d}>
                      {d === 'monday' ? 'Lundi' : d === 'tuesday' ? 'Mardi' : d === 'wednesday' ? 'Mercredi' : d === 'thursday' ? 'Jeudi' : 'Vendredi'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm">Heure :</label>
              <Select value={String(postHour)} onValueChange={v => setPostHour(Number(v))}>
                <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 14 }, (_, i) => i + 7).map(h => (
                    <SelectItem key={h} value={String(h)}>{h}h</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={saveConfig} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
            Sauvegarder la configuration
          </Button>
        </CardContent>
      </Card>

      {/* Queue Article */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2"><Plus className="h-5 w-5" /> Planifier un article</span>
            <Button variant="outline" size="sm" onClick={() => setShowAddForm(!showAddForm)}>
              {showAddForm ? 'Fermer' : 'Ajouter'}
            </Button>
          </CardTitle>
        </CardHeader>
        {showAddForm && (
          <CardContent className="space-y-4">
            <Select value={selectedSlug} onValueChange={setSelectedSlug}>
              <SelectTrigger><SelectValue placeholder="Choisir un article..." /></SelectTrigger>
              <SelectContent>
                {availableArticles.map(a => (
                  <SelectItem key={a.slug} value={a.slug}>{a.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div>
              <label className="text-sm font-medium mb-1 block">Contenu personnalisé (optionnel)</label>
              <Textarea
                value={customContent}
                onChange={e => setCustomContent(e.target.value)}
                placeholder="Laissez vide pour utiliser le contenu par défaut..."
                rows={4}
              />
            </div>
            <Button onClick={queueArticle}>
              <Plus className="h-4 w-4 mr-2" /> Ajouter à la file d'attente
            </Button>
          </CardContent>
        )}
      </Card>

      {/* All articles — card layout with social sub-tabs */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Share2 className="h-5 w-5 text-primary" />
                Tous les articles
                <Badge variant="outline">{posts.length}</Badge>
              </CardTitle>
              <CardDescription>
                Brouillons et articles publiés sur les réseaux sociaux. Visualisez l'accroche par canal et publiez en un clic.
              </CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={fetchData} aria-label="Rafraîchir">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {posts.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">Aucun article planifié</p>
          ) : (
            posts.map((post) => {
              const article = allArticles.find((a) => a.slug === post.article_slug);
              const image = post.image_url || (article?.image
                ? (typeof article.image === 'string' && article.image.startsWith('http')
                    ? article.image
                    : `https://jemassuremoinscher.fr${article.image}`)
                : null);
              const headlines: Record<Channel, string> = {
                linkedin: article?.socialHeadlines?.linkedin || post.short_description || post.post_content || article?.description || post.article_title,
                facebook: article?.socialHeadlines?.facebook || post.short_description || post.post_content || article?.description || post.article_title,
                instagram: article?.socialHeadlines?.instagram || post.short_description || post.post_content || article?.description || post.article_title,
              };
              const isPosted = post.status === 'posted';
              const isPending = post.status === 'pending';
              const isFailed = post.status === 'failed';

              return (
                <Card key={post.id} className="overflow-hidden">
                  <div className="grid md:grid-cols-[200px_1fr] gap-4">
                    {image ? (
                      <img
                        src={image}
                        alt={post.article_title}
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
                          <h3 className="font-bold text-base leading-tight">{post.article_title}</h3>
                          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-2 flex-wrap">
                            <span className="inline-flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              Ajouté le {new Date(post.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                            {post.posted_at && (
                              <span className="inline-flex items-center gap-1 text-primary">
                                · Publié le {new Date(post.posted_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                              </span>
                            )}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          {isPosted && <Badge className="bg-primary text-primary-foreground gap-1"><CheckCircle2 className="h-3 w-3" /> Envoyé</Badge>}
                          {isPending && <Badge variant="outline">En file d'attente</Badge>}
                          {isFailed && <Badge variant="destructive">Échoué</Badge>}
                          <div className="flex gap-1">
                            <Badge variant={post.linkedin_status === 'posted' ? 'default' : post.linkedin_status === 'failed' ? 'destructive' : 'outline'} className="text-[10px] gap-1"><Linkedin className="h-2.5 w-2.5" />LI</Badge>
                            <Badge variant={post.facebook_status === 'posted' ? 'default' : post.facebook_status === 'failed' ? 'destructive' : 'outline'} className="text-[10px] gap-1"><Facebook className="h-2.5 w-2.5" />FB</Badge>
                          </div>
                        </div>
                      </div>

                      <Tabs defaultValue="linkedin" className="w-full">
                        <TabsList className="h-8">
                          <TabsTrigger value="linkedin" className="text-xs gap-1"><Linkedin className="h-3 w-3" />LinkedIn</TabsTrigger>
                          <TabsTrigger value="facebook" className="text-xs gap-1"><Facebook className="h-3 w-3" />Facebook</TabsTrigger>
                          <TabsTrigger value="instagram" className="text-xs gap-1"><Instagram className="h-3 w-3" />Instagram</TabsTrigger>
                        </TabsList>
                        {(['linkedin', 'facebook', 'instagram'] as Channel[]).map((ch) => (
                          <TabsContent key={ch} value={ch} className="mt-2">
                            <p className="text-sm bg-muted/50 p-3 rounded-md whitespace-pre-line">
                              {headlines[ch]}
                            </p>
                          </TabsContent>
                        ))}
                      </Tabs>

                      {post.error_message && <p className="text-xs text-destructive">{post.error_message}</p>}

                      <div className="flex flex-wrap gap-2 pt-2">
                        <Button asChild variant="outline" size="sm">
                          <Link to={`/blog-preview/${post.article_slug}`} target="_blank" rel="noopener">
                            <Eye className="h-3 w-3 mr-1" /> Aperçu
                          </Link>
                        </Button>
                        {(isPending || isFailed) && (
                          <Button
                            size="sm"
                            onClick={() => triggerNow(post.article_slug)}
                            disabled={posting === post.article_slug}
                          >
                            {posting === post.article_slug ? <Loader2 className="h-3 w-3 mr-1 animate-spin" /> : isFailed ? <RefreshCw className="h-3 w-3 mr-1" /> : <Send className="h-3 w-3 mr-1" />}
                            {isFailed ? 'Réessayer' : 'Publier maintenant'}
                          </Button>
                        )}
                        {isPosted && (
                          <Button size="sm" variant="outline" onClick={() => triggerNow(post.article_slug)} disabled={posting === post.article_slug}>
                            {posting === post.article_slug ? <Loader2 className="h-3 w-3 mr-1 animate-spin" /> : <RefreshCw className="h-3 w-3 mr-1" />}
                            Renvoyer
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            if (confirm(`Supprimer "${post.article_title}" ?`)) deletePost(post.id);
                          }}
                          aria-label="Supprimer"
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-3 w-3" />
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
    </div>
  );
};
