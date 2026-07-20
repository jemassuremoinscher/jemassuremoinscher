import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Check, Loader2, FileText } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface BarometreOptinProps {
  variant?: "card" | "compact";
  source?: string;
}

const BAROMETRE_URL = "/barometre-cout-assurance-2026.pdf";

/**
 * Permanent email capture magnet — offers the "Baromètre du coût de
 * l'assurance 2026". Plugged into the existing newsletter-subscribe
 * edge function (same double-opt-in flow as NewsletterSection).
 * A `source` value is sent so admin can track lead magnet origin.
 */
export const BarometreOptin = ({ variant = "card", source = "barometre_magnet" }: BarometreOptinProps) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Email invalide");
      return;
    }
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("newsletter-subscribe", {
        body: { email, source },
      });
      if (error) throw error;
      if (data?.success) {
        setIsSubscribed(true);
        setEmail("");
        toast.success("Presque terminé !", {
          description: "Confirmez votre email pour recevoir le baromètre.",
        });
        // Open the baromètre page as an immediate value
        window.open(BAROMETRE_URL, "_blank", "noopener,noreferrer");
      } else {
        toast.error("Une erreur est survenue", { description: data?.message });
      }
    } catch (err) {
      console.error("Barometre optin error:", err);
      toast.error("Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  if (variant === "compact") {
    return (
      <div className="bg-primary-foreground/5 border border-primary-foreground/10 rounded-xl p-4">
        <div className="flex items-start gap-3 mb-3">
          <FileText className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <p className="text-sm font-semibold text-primary-foreground">Baromètre 2026 gratuit</p>
            <p className="text-xs text-primary-foreground/60">Prix moyens par assurance & région</p>
          </div>
        </div>
        {isSubscribed ? (
          <p className="text-xs text-accent flex items-center gap-1.5">
            <Check className="h-3.5 w-3.5" aria-hidden="true" /> Vérifiez votre email
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <label htmlFor="barometre-footer-email" className="sr-only">Votre email</label>
            <Input
              id="barometre-footer-email"
              type="email"
              placeholder="votre@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-9 text-sm bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/40"
              disabled={isLoading}
              aria-required="true"
            />
            <Button
              type="submit"
              size="sm"
              className="h-9 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
              disabled={isLoading}
              aria-label="Recevoir le baromètre par email"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              ) : (
                <><Download className="mr-1.5 h-4 w-4" aria-hidden="true" />Recevoir</>
              )}
            </Button>
          </form>
        )}
      </div>
    );
  }

  return (
    <aside className="my-10 rounded-2xl border-2 border-accent/30 bg-gradient-to-br from-accent/10 via-background to-primary/5 p-6 md:p-8 shadow-md">
      <div className="flex flex-col md:flex-row items-start gap-5">
        <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-accent/20 flex items-center justify-center">
          <FileText className="h-7 w-7 text-accent" aria-hidden="true" />
        </div>
        <div className="flex-1 w-full">
          <h3 className="text-xl md:text-2xl font-bold text-foreground mb-1">
            Recevez le Baromètre du coût de l'assurance 2026
          </h3>
          <p className="text-sm md:text-base text-muted-foreground mb-4">
            Prix moyens par assurance, région et profil — mis à jour pour 2026. Gratuit, sans engagement.
          </p>
          {isSubscribed ? (
            <div className="flex items-center gap-2 text-accent-foreground bg-accent/20 rounded-lg px-4 py-3">
              <Check className="h-5 w-5 text-accent" aria-hidden="true" />
              <span className="text-sm font-medium">Vérifiez votre boîte mail pour confirmer l'inscription.</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
              <label htmlFor="barometre-article-email" className="sr-only">Votre email</label>
              <Input
                id="barometre-article-email"
                type="email"
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 flex-1 text-base"
                disabled={isLoading}
                aria-required="true"
              />
              <Button
                type="submit"
                size="lg"
                className="h-12 px-6 bg-accent hover:bg-accent/90 text-accent-foreground font-bold whitespace-nowrap"
                disabled={isLoading}
                aria-label="Recevoir le baromètre par email"
              >
                {isLoading ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />Envoi…</>
                ) : (
                  <><Download className="mr-2 h-4 w-4" aria-hidden="true" />Recevoir le baromètre</>
                )}
              </Button>
            </form>
          )}
          <p className="text-xs text-muted-foreground/70 mt-3">
            Pas de spam. Désinscription en un clic. Vos données restent confidentielles.
          </p>
        </div>
      </div>
    </aside>
  );
};

export default BarometreOptin;
