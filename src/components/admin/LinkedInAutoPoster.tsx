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

  // Dismissed drafts + draft social overrides (persisted locally until queued)
  const DISMISSED_KEY = 'lap.dismissedDrafts.v1';
  const DRAFT_OVERRIDES_KEY = 'lap.draftChannelOverrides.v1';
  const [dismissedDrafts, setDismissedDrafts] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem(DISMISSED_KEY) || '[]'); } catch { return []; }
  });
  const [draftChannelOverrides, setDraftChannelOverrides] = useState<Record<string, Partial<Record<Channel, string>>>>(() => {
    try { return JSON.parse(localStorage.getItem(DRAFT_OVERRIDES_KEY) || '{}'); } catch { return {}; }
  });
  const dismissDraft = (slug: string, title: string) => {
    if (!confirm(`Supprimer le brouillon « ${title} » de cette liste ?`)) return;
    const next = Array.from(new Set([...dismissedDrafts, slug]));
    setDismissedDrafts(next);
    localStorage.setItem(DISMISSED_KEY, JSON.stringify(next));
    toast.success('Brouillon retiré de la liste');
  };
  const persistDraftOverrides = (next: Record<string, Partial<Record<Channel, string>>>) => {
    setDraftChannelOverrides(next);
    localStorage.setItem(DRAFT_OVERRIDES_KEY, JSON.stringify(next));
  };

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

  // Editing per-channel descriptions
  const [editing, setEditing] = useState<Record<string, string>>({}); // key = `${postId}:${channel}`
  const [savingEdit, setSavingEdit] = useState<string | null>(null);
  const editKey = (id: string, ch: Channel) => `${id}:${ch}`;
  const saveChannelOverride = async (post: any, ch: Channel, value: string) => {
    const key = editKey(post.id, ch);
    setSavingEdit(key);
    const next = { ...(post.channel_overrides || {}), [ch]: value };
    const { error } = await supabase
      .from('linkedin_auto_posts')
      .update({ channel_overrides: next } as any)
      .eq('id', post.id);
    setSavingEdit(null);
    if (error) { toast.error('Erreur: ' + error.message); return; }
    toast.success(`Description ${ch} mise à jour ✅`);
    setEditing((e) => { const n = { ...e }; delete n[key]; return n; });
    fetchData();
  };
  const saveDraftChannelOverride = (slug: string, ch: Channel, value: string) => {
    const key = editKey(`draft-${slug}`, ch);
    const next = { ...draftChannelOverrides, [slug]: { ...(draftChannelOverrides[slug] || {}), [ch]: value } };
    persistDraftOverrides(next);
    setEditing((e) => { const n = { ...e }; delete n[key]; return n; });
    toast.success(`Description ${ch} du brouillon mise à jour ✅`);
  };
  const resetChannelOverride = async (post: any, ch: Channel) => {
    const next = { ...(post.channel_overrides || {}) };
    delete next[ch];
    const { error } = await supabase
      .from('linkedin_auto_posts')
      .update({ channel_overrides: next } as any)
      .eq('id', post.id);
    if (error) { toast.error('Erreur: ' + error.message); return; }
    toast.success(`Description ${ch} réinitialisée`);
    fetchData();
  };
  const resetDraftChannelOverride = (slug: string, ch: Channel) => {
    const next = { ...draftChannelOverrides, [slug]: { ...(draftChannelOverrides[slug] || {}) } };
    delete next[slug]?.[ch];
    if (next[slug] && Object.keys(next[slug]).length === 0) delete next[slug];
    persistDraftOverrides(next);
    toast.success(`Description ${ch} du brouillon réinitialisée`);
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

    const siteUrl = 'https://www.jemassuremoinscher.fr';
    const articleUrl = `${siteUrl}/blog/${article.slug}`;
    const imageUrl = resolveArticleImage(article.image);
    const defaultContent = `📰 Nouvel article sur jemassuremoinscher.fr !\n\n${article.title}\n\n👉 Lire l'article complet : ${siteUrl}/blog/${article.slug}\n\n#assurance #comparateur #économies #jemassuremoinscher`;
    const articleSummary = (article as any).excerpt || (article as any).description || null;
    const shortDescription = buildShortDescription(article.title, customContent || articleSummary);
    const savedOverrides = draftChannelOverrides[article.slug] || {};
    const payload: any = {
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
    };
    if (Object.keys(savedOverrides).length > 0) payload.channel_overrides = savedOverrides;

    const { error } = await supabase.from('linkedin_auto_posts').insert(payload);

    if (error) toast.error('Erreur: ' + error.message);
    else {
      toast.success(`"${article.title}" ajouté à la file d'attente 🎯`);
      setSelectedSlug('');
      setCustomContent('');
      setShowAddForm(false);
      if (draftChannelOverrides[article.slug]) {
        const next = { ...draftChannelOverrides };
        delete next[article.slug];
        persistDraftOverrides(next);
      }
      fetchData();
    }
  };

  const queueAndPostDraftNow = async (slug: string) => {
    if (!configId) { toast.error('Configurez d\'abord le webhook'); return; }
    const article = allArticles.find(a => a.slug === slug);
    if (!article) return;
    setPosting(slug);
    try {
      // 1. Queue if not already
      const existing = posts.find(p => p.article_slug === slug);
      if (!existing) {
        const siteUrl = 'https://www.jemassuremoinscher.fr';
        const articleUrl = `${siteUrl}/blog/${article.slug}`;
        const imageUrl = resolveArticleImage(article.image);
        const articleSummary = (article as any).excerpt || (article as any).description || null;
        const shortDescription = buildShortDescription(article.title, articleSummary);
        const savedOverrides = draftChannelOverrides[article.slug] || {};
        const payload: any = {
          article_slug: article.slug,
          article_title: article.title,
          article_url: articleUrl,
          image_url: imageUrl,
          short_description: shortDescription,
          provider: 'make',
          status: 'pending',
          linkedin_status: 'pending',
          facebook_status: 'pending',
        };
        if (Object.keys(savedOverrides).length > 0) payload.channel_overrides = savedOverrides;
        const { error: insertErr } = await supabase.from('linkedin_auto_posts').insert(payload);
        if (insertErr) { toast.error('Erreur file : ' + insertErr.message); setPosting(null); return; }
        if (draftChannelOverrides[article.slug]) {
          const next = { ...draftChannelOverrides };
          delete next[article.slug];
          persistDraftOverrides(next);
        }
      }
      // 2. Trigger immediately
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { toast.error('Non authentifié'); setPosting(null); return; }
      const res = await supabase.functions.invoke('post-to-linkedin', {
        body: { slug },
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (res.error) toast.error('Erreur: ' + res.error.message);
      else toast.success(res.data?.message || `"${article.title}" envoyé à Make.com 🎉`);
      fetchData();
    } catch (e: any) {
      toast.error(e.message || 'Erreur d\'envoi');
    } finally {
      setPosting(null);
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

  const syncImagesForQueue = async () => {
    setSyncingImages(true);
    let updated = 0; let skipped = 0;
    for (const post of posts) {
      if (post.image_url) { skipped++; continue; }
      const article = allArticles.find((a) => a.slug === post.article_slug);
      const url = resolveArticleImage(article?.image);
      if (!url) continue;
      const { error } = await supabase.from('linkedin_auto_posts').update({ image_url: url }).eq('id', post.id);
      if (!error) updated++;
    }
    setSyncingImages(false);
    toast.success(`${updated} image(s) synchronisée(s) · ${skipped} déjà OK`);
    fetchData();
  };

  const queuedSlugs = new Set(posts.map((p) => p.article_slug));
  const unqueuedDrafts = blogDrafts2026.filter((d) => !queuedSlugs.has(d.slug) && !dismissedDrafts.includes(d.slug));

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
    </div>
  );
};
