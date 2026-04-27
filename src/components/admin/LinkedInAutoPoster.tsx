import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Facebook, Send, Settings, History, Plus, Loader2, Trash2, RefreshCw, Share2 } from 'lucide-react';
import { blogArticles } from '@/data/blogArticles';
import { blogArticles2026 } from '@/data/blogArticles2026';

const allArticles = [...blogArticles, ...blogArticles2026];

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

  // New post form
  const [selectedSlug, setSelectedSlug] = useState('');
  const [customContent, setCustomContent] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

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

    const { error } = await supabase.from('linkedin_auto_posts').insert({
      article_slug: article.slug,
      article_title: article.title,
      article_url: articleUrl,
      image_url: imageUrl,
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
            <p className="text-xs text-muted-foreground mt-1">Payload envoyé : titre, URL de l'article, URL d'image si disponible, slug et canaux LinkedIn/Facebook.</p>
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

      {/* History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2"><History className="h-5 w-5" /> Historique des publications</span>
            <Button variant="ghost" size="icon" onClick={fetchData}><RefreshCw className="h-4 w-4" /></Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {posts.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">Aucune publication planifiée</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Article</TableHead>
                  <TableHead>Canaux</TableHead>
                  <TableHead>Article</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts.map(post => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium max-w-xs truncate">{post.article_title}</TableCell>
                    <TableCell className="space-y-1">
                      <div className="flex flex-wrap gap-1">
                        <Badge variant={post.linkedin_status === 'posted' ? 'default' : post.linkedin_status === 'failed' ? 'destructive' : 'outline'}>LinkedIn</Badge>
                        <Badge variant={post.facebook_status === 'posted' ? 'default' : post.facebook_status === 'failed' ? 'destructive' : 'outline'}><Facebook className="h-3 w-3 mr-1" />Facebook</Badge>
                      </div>
                      {statusBadge(post.status)}
                      {post.error_message && <p className="text-xs text-destructive mt-1">{post.error_message}</p>}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground max-w-xs truncate">
                      {post.article_url || `https://jemassuremoinscher.fr/blog/${post.article_slug}`}
                      {post.image_url ? <p className="truncate">Image : {post.image_url}</p> : null}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {post.posted_at
                        ? new Date(post.posted_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
                        : new Date(post.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }) + ' (planifié)'}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      {post.status === 'pending' && (
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => triggerNow(post.article_slug)}
                          disabled={posting === post.article_slug}
                        >
                          {posting === post.article_slug ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <Send className="h-3 w-3 mr-1" />}
                          Publier
                        </Button>
                      )}
                      {post.status === 'failed' && (
                        <Button size="sm" variant="outline" onClick={() => triggerNow(post.article_slug)} disabled={posting === post.article_slug}>
                          <RefreshCw className="h-3 w-3 mr-1" /> Réessayer
                        </Button>
                      )}
                      <Button size="sm" variant="ghost" onClick={() => deletePost(post.id)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
