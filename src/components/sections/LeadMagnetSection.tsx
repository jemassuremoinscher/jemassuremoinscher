import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Download, Mail, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

const PDF_URL = "/lead-magnets/7-erreurs-assurance.pdf";

const LeadMagnetSection = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setStatus("error");
      setErrorMsg("Email invalide");
      return;
    }
    setStatus("loading");
    try {
      const { data, error } = await supabase.functions.invoke("lead-magnet-capture", {
        body: { email: trimmed, source: "homepage_lead_magnet" },
      });
      if (error || !data?.success) {
        console.warn("lead-magnet-capture failed", error || data);
      }
    } catch (err) {
      console.warn("lead-magnet-capture exception", err);
    }
    setStatus("success");
  };

  return (
    <section
      className="py-10 md:py-14 bg-background"
      aria-labelledby="lead-magnet-title"
    >
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="rounded-2xl border border-border/60 bg-muted/30 p-5 md:p-6 flex flex-col md:flex-row md:items-center gap-5">
          <div className="flex items-start gap-3 md:flex-1">
            <div className="shrink-0 p-2 rounded-full bg-primary/10" aria-hidden="true">
              <BookOpen className="w-5 h-5 text-primary" />
            </div>
            <div className="min-w-0">
              <h2
                id="lead-magnet-title"
                className="text-base md:text-lg font-bold text-foreground leading-snug"
              >
                Guide gratuit&nbsp;: 7 erreurs qui font payer trop cher
              </h2>
              <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
                PDF 2 pages — économise jusqu'à <strong>280&nbsp;€/an</strong> sans changer tes garanties.
              </p>
            </div>
          </div>

          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 6 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3 }}
            className="flex flex-col sm:flex-row gap-2 md:w-auto md:min-w-[340px]"
            aria-describedby="lead-magnet-help"
          >
            {status === "success" ? (
              <a
                href={PDF_URL}
                download="7-erreurs-assurance.pdf"
                target="_blank"
                rel="noopener"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors whitespace-nowrap shadow-md"
              >
                <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                Télécharger mon guide (PDF)
              </a>
            ) : (
              <>
                <label htmlFor="lead-magnet-email" className="sr-only">Ton email</label>
                <div className="relative flex-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
                  <input
                    id="lead-magnet-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setStatus("idle"); }}
                    placeholder="ton.email@exemple.fr"
                    autoComplete="email"
                    className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-foreground"
                    disabled={status === "loading"}
                    aria-invalid={status === "error"}
                  />
                </div>
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  <Download className="w-4 h-4" aria-hidden="true" />
                  {status === "loading" ? "Envoi…" : "Recevoir le guide"}
                </button>
              </>
            )}
          </motion.form>
        </div>
        {status === "error" && errorMsg && (
          <p className="text-[11px] text-destructive mt-2 text-center">{errorMsg}</p>
        )}
        <p id="lead-magnet-help" className="text-[11px] text-muted-foreground mt-2 text-center">
          🔒 Email confidentiel, jamais revendu. Désinscription en 1 clic.
        </p>
      </div>
    </section>
  );
};

export default LeadMagnetSection;
