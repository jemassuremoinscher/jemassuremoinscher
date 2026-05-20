import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { MessageSquare, User, Loader2, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useLanguage } from "@/contexts/LanguageContext";
import { invokeSendQuoteEmail } from "@/lib/recaptcha";

const commentSchema = z.object({
  authorName: z.string().trim().min(2).max(100),
  authorEmail: z.string().trim().email().max(255),
  content: z.string().trim().min(10).max(1000),
});
type CommentFormData = z.infer<typeof commentSchema>;
interface Comment { id: string; author_name: string; content: string; created_at: string; }
interface CommentsSectionProps { articleSlug: string; }

export const CommentsSection = ({ articleSlug }: CommentsSectionProps) => {
  const { t } = useLanguage();
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<CommentFormData>({ resolver: zodResolver(commentSchema), defaultValues: { authorName: "", authorEmail: "", content: "" } });

  useEffect(() => { fetchComments(); }, [articleSlug]);

  const fetchComments = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/blog_comments_public?article_slug=eq.${encodeURIComponent(articleSlug)}&order=created_at.desc`, { headers: { 'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY, 'Content-Type': 'application/json' } });
      if (!response.ok) throw new Error('Failed to fetch comments');
      setComments(await response.json() || []);
    } catch (error) { console.error("Error fetching comments:", error); }
    finally { setIsLoading(false); }
  };

  const onSubmit = async (data: CommentFormData) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("blog_comments").insert({ article_slug: articleSlug, author_name: data.authorName, author_email: data.authorEmail, content: data.content, status: "pending" });
      if (error) throw error;
      await invokeSendQuoteEmail({ name: data.authorName, email: data.authorEmail, phone: '', type: 'Commentaire blog', details: { source: 'blog_comment', articleSlug, content: data.content }, estimatedPrice: 0 },).catch(err => console.error('Email notification error:', err));
      toast.success(t('comments.successTitle'), { description: t('comments.successDesc') });
      form.reset();
    } catch (error) { console.error("Error submitting comment:", error); toast.error(t('insPage.toast.error')); }
    finally { setIsSubmitting(false); }
  };

  return (
    <section className="mt-16">
      <div className="flex items-center gap-2 mb-8"><MessageSquare className="h-6 w-6 text-primary" /><h3 className="text-2xl font-bold">{t('comments.title')} ({comments.length})</h3></div>
      <Card className="p-6 mb-8">
        <h4 className="text-lg font-semibold mb-4">{t('comments.leaveComment')}</h4>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <FormField control={form.control} name="authorName" render={({ field }) => (<FormItem><FormLabel>{t('comments.name')}</FormLabel><FormControl><Input placeholder={t('comments.namePlaceholder')} {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="authorEmail" render={({ field }) => (<FormItem><FormLabel>{t('comments.email')}</FormLabel><FormControl><Input type="email" placeholder={t('comments.emailPlaceholder')} {...field} /></FormControl><FormMessage /></FormItem>)} />
            </div>
            <FormField control={form.control} name="content" render={({ field }) => (<FormItem><FormLabel>{t('comments.comment')}</FormLabel><FormControl><Textarea placeholder={t('comments.commentPlaceholder')} className="min-h-[120px]" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />{t('comments.sending')}</>) : (<><Send className="mr-2 h-4 w-4" />{t('comments.submit')}</>)}
            </Button>
            <p className="text-xs text-muted-foreground">{t('comments.moderation')}</p>
          </form>
        </Form>
      </Card>
      <div className="space-y-6">
        {isLoading ? (
          <div className="text-center py-12"><Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" /><p className="text-muted-foreground mt-4">{t('comments.loading')}</p></div>
        ) : comments.length === 0 ? (
          <Card className="p-12 text-center"><MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" /><p className="text-muted-foreground">{t('comments.noComments')}</p></Card>
        ) : (
          comments.map((comment) => (
            <Card key={comment.id} className="p-6">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 rounded-full p-3"><User className="h-6 w-6 text-primary" /></div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h5 className="font-semibold">{comment.author_name}</h5>
                    <span className="text-sm text-muted-foreground">{format(new Date(comment.created_at), "d MMMM yyyy 'à' HH:mm", { locale: fr })}</span>
                  </div>
                  <p className="text-muted-foreground whitespace-pre-wrap">{comment.content}</p>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </section>
  );
};
