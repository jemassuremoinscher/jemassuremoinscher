import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Check, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const NewsletterSection = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { toast } = useToast();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast({
        title: "Email invalide",
        description: "Veuillez entrer une adresse email valide.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("newsletter-subscribe", {
        body: { email },
      });

      if (error) throw error;

      if (data?.success) {
        setIsSubscribed(true);
        setEmail("");
        toast({
          title: "Presque terminé !",
          description: data.message,
        });
      } else {
        toast({
          title: "Erreur",
          description: data?.message || "Une erreur est survenue.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Newsletter subscription error:", error);
      toast({
        title: "Erreur",
        description: "Impossible de s'inscrire pour le moment. Veuillez réessayer plus tard.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-primary to-primary/80 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-secondary/10 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/20 mb-6 animate-float">
            <Mail className="h-8 w-8 text-accent" />
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold text-primary-foreground mb-4">
            Restez informé des meilleures offres
          </h2>
          
          <p className="text-lg text-primary-foreground/90 mb-8">
            Recevez nos conseils d'experts et les dernières promotions directement dans votre boîte mail.
            <br />
            <span className="font-semibold">100% gratuit, 0% spam.</span>
          </p>

          {isSubscribed ? (
            <div className="bg-accent/20 backdrop-blur-sm border-2 border-accent/50 rounded-2xl p-8 animate-scale-in">
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center">
                  <Check className="h-8 w-8 text-accent-foreground" />
                </div>
                <h3 className="text-2xl font-bold text-primary-foreground">
                  Vérifiez votre email !
                </h3>
                <p className="text-primary-foreground/90">
                  Un email de confirmation vous a été envoyé. Cliquez sur le lien pour confirmer votre abonnement.
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
              <Input
                type="email"
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 h-14 px-6 text-lg bg-card/95 backdrop-blur-sm border-2 border-transparent focus:border-accent transition-all"
                disabled={isLoading}
              />
              <Button
                type="submit"
                size="lg"
                className="h-14 px-8 text-lg bg-accent hover:bg-accent/90 text-accent-foreground font-bold shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Inscription...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-5 w-5" />
                    S'inscrire
                  </>
                )}
              </Button>
            </form>
          )}

          <p className="text-sm text-primary-foreground/70 mt-6">
            En vous inscrivant, vous acceptez de recevoir nos emails. Vous pouvez vous désinscrire à tout moment.
          </p>
        </div>
      </div>
    </section>
  );
};
