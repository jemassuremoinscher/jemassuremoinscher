import { useEffect, useState } from "react";
import { Loader2, MailX, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import SEOOptimized from "@/components/SEOOptimized";
import { supabase } from "@/integrations/supabase/client";

// Le jeton est lu dans le FRAGMENT de l'URL (#token=...), jamais dans la
// query string : un fragment n'est jamais envoyé au serveur dans une
// requête HTTP (pas dans les logs serveur/CDN, pas dans un en-tête
// Referer vers un tiers que la page chargerait). react-router ne route
// pas sur le fragment (BrowserRouter) — on le lit nous-mêmes via
// window.location.hash. Cette route est aussi explicitement exclue du
// chargement des scripts analytics (voir index.html/loadAnalytics) :
// le jeton ne doit atteindre ni GA4, ni Clarity, ni Meta Pixel.
const Desinscription = () => {
  const [token, setToken] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");

  useEffect(() => {
    const match = /token=([^&]+)/.exec(window.location.hash);
    setToken(match ? decodeURIComponent(match[1]) : "");
  }, []);

  const handleConfirm = async () => {
    setStatus("loading");
    try {
      await supabase.functions.invoke("email-optout", { body: { token } });
    } catch {
      // Réponse volontairement identique côté fonction (anti-énumération) :
      // on affiche la confirmation même en cas d'erreur réseau.
    }
    setStatus("done");
  };

  return (
    <>
      <SEOOptimized
        title="Désinscription | jemassuremoinscher.fr"
        description="Gérer la réception de nos emails."
        noindex
      />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4">
        <Card className="w-full max-w-md p-8 text-center space-y-4">
          {status === "done" ? (
            <>
              <CheckCircle2 className="mx-auto h-10 w-10 text-primary" />
              <h1 className="text-xl font-semibold">C'est fait</h1>
              <p className="text-muted-foreground">
                Vous ne recevrez plus d'emails de relance ou d'information de notre part. Si
                vous avez une demande en cours, un conseiller peut toujours vous recontacter
                par téléphone si vous nous l'avez demandé.
              </p>
            </>
          ) : (
            <>
              <MailX className="mx-auto h-10 w-10 text-muted-foreground" />
              <h1 className="text-xl font-semibold">Se désinscrire</h1>
              <p className="text-muted-foreground">
                Confirmez pour ne plus recevoir nos emails de relance ou d'information.
              </p>
              <Button
                onClick={handleConfirm}
                disabled={!token || status === "loading"}
                className="w-full"
              >
                {status === "loading" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Confirmer ma désinscription"
                )}
              </Button>
            </>
          )}
        </Card>
      </div>
    </>
  );
};

export default Desinscription;
