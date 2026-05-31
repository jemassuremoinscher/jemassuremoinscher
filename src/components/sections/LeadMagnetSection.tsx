import { useState } from "react";
import { Download, Mail, CheckCircle2, AlertCircle, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

const PDF_URL = "/lead-magnets/7-erreurs-assurance.pdf";

/**
 * Lead magnet secondaire — capture les visiteurs "haut de funnel"
 * qui ne sont pas encore prêts à faire un devis.
 *
 * Flux : email → newsletter-subscribe (RGPD double opt-in) →
 * téléchargement immédiat du PDF "7 erreurs qui te font payer
 * ton assurance trop cher" pour nourrir le lead.
 */
const LeadMagnetSection = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    setErrorMsg("");
    try {
      const { error } = await supabase.functions.invoke("newsletter-subscribe", {
        body: { email: email.trim() },
      });
      if (error) throw error;
      setStatus("success");
      // Déclenche le téléchargement après un court délai pour laisser le
      // visuel de succès apparaître.
      setTimeout(() => {
        const a = document.createElement("a");
        a.href = PDF_URL;
        a.download = "7-erreurs-assurance.pdf";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }, 400);
    } catch (err) {
      setStatus("error");
      setErrorMsg(
        err instanceof Error ? err.message : "Une erreur est survenue. Réessayez."
      );
    }
  };

  return (
    <section
      className="py-14 md:py-20 bg-gradient-to-br from-primary/5 via-background to-accent/10"
      aria-labelledby="lead-magnet-title"
    >
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="relative overflow-hidden rounded-[2rem] bg-card border border-border/60 shadow-[0_20px_50px_-20px_rgba(124,58,237,0.25)]">
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-accent/30 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
          <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-primary/20 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />

          <div className="relative grid md:grid-cols-[1fr_1.2fr] gap-8 p-6 md:p-10">
            {/* Visuel */}
            <div className="flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 self-start px-3 py-1.5 rounded-full bg-accent/20 border border-accent/40 mb-4">
                <BookOpen className="w-4 h-4 text-primary" aria-hidden="true" />
                <span className="text-xs font-bold text-primary uppercase tracking-wide">
                  Guide gratuit
                </span>
              </div>
              <h2
                id="lead-magnet-title"
                className="text-2xl md:text-3xl lg:text-4xl font-black text-foreground leading-tight mb-4"
              >
                7 erreurs qui te font payer ton assurance{" "}
                <span className="text-primary">trop cher</span>
              </h2>
              <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-4">
                Pas encore prêt à comparer ? Télécharge gratuitement notre guide&nbsp;: les
                7 réflexes qui font économiser à nos clients <strong>jusqu'à 280&nbsp;€/an</strong>{" "}
                sur leur contrat — sans changer leurs garanties.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" aria-hidden="true" />
                  PDF 2 pages, lecture en 3&nbsp;minutes
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" aria-hidden="true" />
                  Astuces concrètes &amp; chiffrées
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" aria-hidden="true" />
                  Conforme loi Hamon et loi Lemoine 2026
                </li>
              </ul>
            </div>

            {/* Formulaire */}
            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="bg-background/60 backdrop-blur-sm border border-border rounded-2xl p-6 md:p-8 flex flex-col justify-center"
              aria-describedby="lead-magnet-help"
            >
              {status === "success" ? (
                <div className="text-center py-4">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-3">
                    <CheckCircle2 className="w-8 h-8 text-primary" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">
                    Merci ! Ton guide arrive.
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Si le téléchargement n'a pas démarré&nbsp;:
                  </p>
                  <a
                    href={PDF_URL}
                    download="7-erreurs-assurance.pdf"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground font-bold text-sm hover:bg-primary/90 transition-colors"
                  >
                    <Download className="w-4 h-4" aria-hidden="true" />
                    Télécharger le PDF
                  </a>
                </div>
              ) : (
                <>
                  <label htmlFor="lead-magnet-email" className="text-sm font-bold text-foreground mb-2 block">
                    Reçois le guide par email
                  </label>
                  <div className="relative mb-3">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
                    <input
                      id="lead-magnet-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setStatus("idle"); }}
                      placeholder="ton.email@exemple.fr"
                      autoComplete="email"
                      className="w-full pl-10 pr-3 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-foreground"
                      disabled={status === "loading"}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-primary to-primary/90 text-primary-foreground font-bold hover:shadow-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <Download className="w-4 h-4" aria-hidden="true" />
                    {status === "loading" ? "Envoi en cours…" : "Recevoir mon guide gratuit"}
                  </button>
                  {status === "error" && (
                    <p className="mt-3 text-xs text-destructive flex items-start gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" aria-hidden="true" />
                      <span>{errorMsg}</span>
                    </p>
                  )}
                  <p id="lead-magnet-help" className="mt-3 text-[11px] text-muted-foreground leading-snug">
                    🔒 Email confidentiel, jamais revendu. Désinscription en 1 clic. En soumettant ce
                    formulaire tu acceptes notre <a href="/politique-confidentialite" className="underline hover:text-primary">politique de confidentialité</a>.
                  </p>
                </>
              )}
            </motion.form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LeadMagnetSection;
