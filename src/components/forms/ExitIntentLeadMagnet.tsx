import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Mail, X, BookOpen, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { richText } from "@/lib/richText";


const SESSION_KEY = "exit_intent_lead_magnet_shown";

/**
 * Exit-intent / abandon rattrapage pour les formulaires multi-step.
 *
 * Déclencheurs :
 *  - Desktop : mouseleave par le haut de la fenêtre (intent de fermer l'onglet)
 *  - Manuel  : non
 *
 * Une seule occurrence par session (sessionStorage). Ne s'affiche pas si
 * `disabled` (par ex. après succès du formulaire principal).
 */
interface Props {
  disabled?: boolean;
  insuranceType?: string;
}

const ExitIntentLeadMagnet = ({ disabled = false, insuranceType }: Props) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const shownRef = useRef(false);

  // Déclencheurs
  useEffect(() => {
    if (disabled) return;
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(SESSION_KEY)) return;

    const trigger = (source: string) => {
      if (shownRef.current) return;
      shownRef.current = true;
      sessionStorage.setItem(SESSION_KEY, "1");
      setOpen(true);
      // Optional analytics hook
      try {
        (window as any).gtag?.("event", "exit_intent_shown", {
          source,
          insurance_type: insuranceType,
        });
      } catch {
        /* noop */
      }
    };

    const onMouseOut = (e: MouseEvent) => {
      if (e.relatedTarget) return;
      if (e.clientY > 0) return;
      trigger("desktop_mouseleave");
    };

    document.addEventListener("mouseout", onMouseOut);

    return () => {
      document.removeEventListener("mouseout", onMouseOut);
    };
  }, [disabled, insuranceType]);

  const close = () => setOpen(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setStatus("error");
      setErrorMsg(t('form.exitIntent.invalidEmail'));
      return;
    }
    setStatus("loading");
    setErrorMsg("");
    try {
      const { data, error } = await supabase.functions.invoke("lead-magnet-capture", {
        body: { email: trimmed, source: `exit_intent_${insuranceType ?? "global"}` },
      });
      if (error || !data?.success) {
        // soft fail — on garde le lien dispo quand même
        console.warn("lead-magnet-capture failed", error || data);
      }
    } catch (err) {
      console.warn("lead-magnet-capture exception", err);
    }
    setOpen(false);
    navigate(`/merci-guide?email=${encodeURIComponent(trimmed)}`);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="exit-intent-title"
          onClick={close}
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 240, damping: 24 }}
            className="relative w-full max-w-md bg-card border border-border rounded-[2rem] shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={close}
              aria-label={t('form.exitIntent.close')}
              className="absolute top-3 right-3 z-10 inline-flex items-center justify-center w-9 h-9 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>

            <div className="absolute -top-12 -right-12 w-40 h-40 bg-accent/30 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
            <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-primary/20 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />

            <div className="relative p-6 md:p-8">
              
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/20 border border-accent/40 mb-4">
                  <BookOpen className="w-4 h-4 text-primary" aria-hidden="true" />
                  <span className="text-xs font-bold text-primary uppercase tracking-wide">
                    {t('form.exitIntent.badge')}
                  </span>
                </div>
                  <h3 id="exit-intent-title" className="text-2xl md:text-3xl font-black text-foreground leading-tight mb-3">
                    {richText(t('form.exitIntent.title'), { highlight: <span className="text-primary">{t('form.exitIntent.title.highlight')}</span> })}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                    {richText(t('form.exitIntent.text'), { strong: <strong>{t('form.exitIntent.text.strong')}</strong> })}
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-3">
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); setStatus("idle"); }}
                        placeholder={t('form.exitIntent.emailPlaceholder')}
                        autoComplete="email"
                        aria-label={t('form.exitIntent.emailAria')}
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
                      {status === "loading" ? t('form.exitIntent.sending') : t('form.exitIntent.submit')}
                    </button>
                    {status === "error" && (
                      <p className="text-xs text-destructive flex items-start gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" aria-hidden="true" />
                        <span>{errorMsg}</span>
                      </p>
                    )}
                    <p className="text-[11px] text-muted-foreground leading-snug">
                      {t('form.exitIntent.privacy')}
                    </p>
                  </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ExitIntentLeadMagnet;
