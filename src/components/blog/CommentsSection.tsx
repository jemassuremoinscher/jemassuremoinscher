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
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const commentSchema = z.object({
  authorName: z.string()
    .trim()
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(100, "Le nom ne peut pas dépasser 100 caractères"),
  authorEmail: z.string()
    .trim()
    .email("Email invalide")
    .max(255, "L'email ne peut pas dépasser 255 caractères"),
  content: z.string()
    .trim()
    .min(10, "Le commentaire doit contenir au moins 10 caractères")
    .max(1000, "Le commentaire ne peut pas dépasser 1000 caractères"),
});

type CommentFormData = z.infer<typeof commentSchema>;

interface Comment {
  id: string;
  author_name: string;
  content: string;
  created_at: string;
}

interface CommentsSectionProps {
  articleSlug: string;
}

export const CommentsSection = ({ articleSlug }: CommentsSectionProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CommentFormData>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      authorName: "",
      authorEmail: "",
      content: "",
    },
  });

  useEffect(() => {
    fetchComments();
  }, [articleSlug]);

  const fetchComments = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("blog_comments")
        .select("id, author_name, content, created_at")
        .eq("article_slug", articleSlug)
        .eq("status", "approved")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setComments(data || []);
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: CommentFormData) => {
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase.from("blog_comments").insert({
        article_slug: articleSlug,
        author_name: data.authorName,
        author_email: data.authorEmail,
        content: data.content,
        status: "pending",
      });

      if (error) throw error;

      toast({
        title: "Commentaire envoyé !",
        description: "Votre commentaire sera publié après modération.",
      });
      
      form.reset();
    } catch (error) {
      console.error("Error submitting comment:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="mt-16">
      <div className="flex items-center gap-2 mb-8">
        <MessageSquare className="h-6 w-6 text-primary" />
        <h3 className="text-2xl font-bold">Commentaires ({comments.length})</h3>
      </div>

      {/* Comment Form */}
      <Card className="p-6 mb-8">
        <h4 className="text-lg font-semibold mb-4">Laisser un commentaire</h4>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="authorName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom *</FormLabel>
                    <FormControl>
                      <Input placeholder="Votre nom" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="authorEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email * (non publié)</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="votre@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Commentaire *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Partagez votre expérience ou posez une question..."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Envoi en cours...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Publier le commentaire
                </>
              )}
            </Button>

            <p className="text-xs text-muted-foreground">
              Votre commentaire sera publié après modération. Les champs marqués d'un * sont obligatoires.
            </p>
          </form>
        </Form>
      </Card>

      {/* Comments List */}
      <div className="space-y-6">
        {isLoading ? (
          <div className="text-center py-12">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
            <p className="text-muted-foreground mt-4">Chargement des commentaires...</p>
          </div>
        ) : comments.length === 0 ? (
          <Card className="p-12 text-center">
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              Aucun commentaire pour le moment. Soyez le premier à commenter !
            </p>
          </Card>
        ) : (
          comments.map((comment) => (
            <Card key={comment.id} className="p-6">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 rounded-full p-3">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h5 className="font-semibold">{comment.author_name}</h5>
                    <span className="text-sm text-muted-foreground">
                      {format(new Date(comment.created_at), "d MMMM yyyy 'à' HH:mm", { locale: fr })}
                    </span>
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
