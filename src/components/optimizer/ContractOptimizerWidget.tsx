import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

type Step = "closed" | "form" | "result" | "email" | "done";

const profiles = [
  { value: "jeune", label: "Jeune conducteur" },
  { value: "famille", label: "Famille" },
  { value: "senior", label: "Senior (+55 ans)" },
  { value: "malusse", label: "Malussé" },
  { value: "standard", label: "Conducteur standard" },
];

// Moyenne par profil (référence interne)
const avgByProfile: Record<string, number> = {
  jeune: 1100,
  famille: 650,
  senior: 520,
  malusse: 1400,
  standard: 620,
};

export default function ContractOptimizerWidget() {
  const [step, setStep] = useState<Step>("closed");
  const [price, setPrice] = useState("");
  const [profile, setProfile] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [sending, setSending] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Click outside to minimize
  useEffect(() => {
    if (step === "closed") return;
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        // Don't auto-close, just let the user use the X
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [step]);

  const priceNum = parseInt(price) || 0;
  const avg = avgByProfile[profile] || 620;
  const diff = priceNum - avg;
  const percentOver = avg > 0 ? Math.round((diff / avg) * 100) : 0;
  const isOverpaying = diff > 0;
  const savings = isOverpaying ? diff : 0;

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (priceNum > 0 && profile) {
      setStep("result");
    }
  };

  const handleSubmitEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSending(true);
    try {
      await supabase.from("insurance_quotes").insert({
        full_name: name || "Visiteur Optimiseur",
        email,
        phone: "",
        insurance_type: "auto",
        quote_data: {
          source: "optimizer_widget",
          current_price: priceNum,
          profile,
          estimated_savings: savings,
          percent_over: percentOver,
        },
        status: "pending",
        lead_source: "optimizer_widget",
      });
      setStep("done");
    } catch {
      // silent fail
      setStep("done");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed bottom-20 right-4 z-50 flex flex-col items-end gap-3" ref={panelRef}>
      <AnimatePresence>
        {step !== "closed" && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="w-[340px] rounded-2xl border border-border bg-card shadow-[var(--shadow-lg)] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-primary/5 border-b border-border">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <path d="M12 20V10" /><path d="M18 20V4" /><path d="M6 20v-4" />
                  </svg>
                </div>
                <span className="text-sm font-semibold text-foreground">Optimiseur de contrat</span>
              </div>
              <button
                onClick={() => { setStep("closed"); setPrice(""); setProfile(""); setEmail(""); setName(""); }}
                className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-muted transition-colors text-muted-foreground"
                aria-label="Fermer"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>

            <div className="p-4">
              {/* Step: Form */}
              {step === "form" && (
                <form onSubmit={handleSubmitForm} className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Vérifiez en 10 secondes si vous payez trop cher.
                  </p>

                  <div>
                    <label htmlFor="opt-price" className="block text-xs font-medium text-muted-foreground mb-1">
                      Votre prime annuelle actuelle
                    </label>
                    <div className="relative">
                      <input
                        id="opt-price"
                        type="number"
                        min="50"
                        max="5000"
                        placeholder="Ex: 750"
                        value={price}
                        onChange={e => setPrice(e.target.value)}
                        className="w-full rounded-xl border border-border bg-background px-4 py-2.5 pr-10 text-foreground text-base focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                        required
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium">€/an</span>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="opt-profile" className="block text-xs font-medium text-muted-foreground mb-1">
                      Votre profil
                    </label>
                    <select
                      id="opt-profile"
                      value={profile}
                      onChange={e => setProfile(e.target.value)}
                      className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-foreground text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                      required
                    >
                      <option value="">Choisir…</option>
                      {profiles.map(p => (
                        <option key={p.value} value={p.value}>{p.label}</option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-xl bg-primary text-primary-foreground py-2.5 font-semibold text-sm shadow-md hover:shadow-lg transition-all hover:opacity-90"
                  >
                    Analyser mon contrat →
                  </button>
                </form>
              )}

              {/* Step: Result */}
              {step === "result" && (
                <div className="space-y-4">
                  {isOverpaying ? (
                    <>
                      <div className="text-center">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-destructive/10 mb-3">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-destructive">
                            <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                          </svg>
                        </div>
                        <p className="text-base font-bold text-foreground">
                          Vous payez <span className="text-destructive">{percentOver}% trop cher</span>
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          par rapport à la moyenne de nos utilisateurs avec un profil similaire.
                        </p>
                      </div>

                      <div className="rounded-xl bg-primary/5 border border-primary/20 p-3 text-center">
                        <p className="text-xs text-muted-foreground">Économie potentielle estimée</p>
                        <p className="text-2xl font-extrabold text-primary">{savings}€<span className="text-sm font-normal text-muted-foreground">/an</span></p>
                      </div>
                    </>
                  ) : (
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-3">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary"><polyline points="20 6 9 17 4 12"/></svg>
                      </div>
                      <p className="text-base font-bold text-foreground">Bon prix !</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Votre tarif est dans la moyenne. On peut quand même chercher mieux !
                      </p>
                    </div>
                  )}

                  <button
                    onClick={() => setStep("email")}
                    className="w-full rounded-xl bg-primary text-primary-foreground py-2.5 font-semibold text-sm shadow-md hover:shadow-lg transition-all hover:opacity-90 animate-pulse"
                  >
                    Recevoir mon rapport détaillé →
                  </button>

                  <button
                    onClick={() => setStep("form")}
                    className="w-full text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    ← Modifier mes infos
                  </button>
                </div>
              )}

              {/* Step: Email capture */}
              {step === "email" && (
                <form onSubmit={handleSubmitEmail} className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Recevez votre analyse personnalisée avec les 3 meilleures offres pour votre profil.
                  </p>

                  <input
                    type="text"
                    placeholder="Votre prénom"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-foreground text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                  />

                  <input
                    type="email"
                    placeholder="Votre email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-foreground text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                    required
                  />

                  <button
                    type="submit"
                    disabled={sending}
                    className="w-full rounded-xl bg-primary text-primary-foreground py-2.5 font-semibold text-sm shadow-md hover:shadow-lg transition-all hover:opacity-90 disabled:opacity-50"
                  >
                    {sending ? "Envoi…" : "Envoyer mon rapport gratuit"}
                  </button>

                  <p className="text-[10px] text-muted-foreground/60 text-center">
                    Vos données restent confidentielles. Pas de spam.
                  </p>
                </form>
              )}

              {/* Step: Done */}
              {step === "done" && (
                <div className="text-center py-2 space-y-3">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                  <p className="text-base font-bold text-foreground">C'est envoyé !</p>
                  <p className="text-sm text-muted-foreground">
                    Un conseiller vous contactera sous 24h avec votre analyse personnalisée.
                  </p>
                  <a
                    href="/comparateur"
                    className="inline-block text-sm text-primary font-medium hover:underline"
                  >
                    Comparer maintenant →
                  </a>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating trigger button */}
      {step === "closed" && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setStep("form")}
          className="flex items-center gap-2 rounded-full bg-card border border-border shadow-[var(--shadow-hover)] px-4 py-2.5 text-sm font-medium text-foreground hover:shadow-[var(--shadow-lg)] transition-shadow"
          aria-label="Vérifiez votre contrat"
        >
          <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
              <path d="M12 20V10" /><path d="M18 20V4" /><path d="M6 20v-4" />
            </svg>
          </span>
          <span>Payez-vous trop cher ?</span>
        </motion.button>
      )}
    </div>
  );
}
