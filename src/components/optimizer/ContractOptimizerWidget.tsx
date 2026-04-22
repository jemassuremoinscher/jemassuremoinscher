import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import arthurCar from "@/assets/mascotte/arthur-car.webp";

type Step = "closed" | "form" | "result" | "email" | "done";

const profiles = [
  { value: "jeune", label: "Jeune conducteur" },
  { value: "famille", label: "Famille" },
  { value: "senior", label: "Senior (+55 ans)" },
  { value: "malusse", label: "Malussé" },
  { value: "bonus50", label: "Bonus 50" },
  { value: "standard", label: "Conducteur standard" },
];

const avgByProfile: Record<string, number> = {
  jeune: 1100,
  famille: 650,
  senior: 520,
  malusse: 1400,
  bonus50: 420,
  standard: 620,
};

export default function ContractOptimizerWidget() {
  const [step, setStep] = useState<Step>("closed");
  const [dismissed, setDismissed] = useState(false);
  const [price, setPrice] = useState("");
  const [profile, setProfile] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [sending, setSending] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Auto-dismiss the closed CTA after 8 seconds if not clicked
  useEffect(() => {
    if (step !== "closed" || dismissed) return;
    const timer = setTimeout(() => setDismissed(true), 8000);
    return () => clearTimeout(timer);
  }, [step, dismissed]);

  const priceNum = parseInt(price) || 0;
  const avg = avgByProfile[profile] || 620;
  const diff = priceNum - avg;
  const percentOver = avg > 0 ? Math.round((diff / avg) * 100) : 0;
  const isOverpaying = diff > 0;
  const savings = isOverpaying ? diff : 0;

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (priceNum > 0 && profile) setStep("result");
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
      setStep("done");
    } finally {
      setSending(false);
    }
  };

  const isOpen = step !== "closed";

  return (
    <div className="fixed bottom-20 right-4 z-50 flex flex-col items-end gap-3" ref={panelRef}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="relative w-[340px] rounded-2xl border border-border bg-card shadow-[var(--shadow-lg)] overflow-hidden"
          >
            {/* Arthur en voiture — filigrane bien visible et centré */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-56 h-56 pointer-events-none select-none z-0">
              <img
                src={arthurCar}
                alt="Arthur en voiture pour l'optimiseur d'assurance auto"
                aria-hidden="true"
                className="w-full h-full object-contain opacity-[0.18]"
                loading="lazy"
              />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-primary/5 border-b border-border">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C1.4 11.3 1 12.1 1 13v3c0 .6.4 1 1 1h2" /><circle cx="7" cy="17" r="2" /><circle cx="17" cy="17" r="2" />
                  </svg>
                </div>
                <span className="text-sm font-semibold text-foreground">Optimiseur Auto</span>
              </div>
              <button
                onClick={() => { setStep("closed"); setPrice(""); setProfile(""); setEmail(""); setName(""); }}
                className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-muted transition-colors text-muted-foreground"
                aria-label="Fermer"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>

            <div className="p-4 relative z-10">
              {/* Step: Form */}
              {step === "form" && (
                <form onSubmit={handleSubmitForm} className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Payez-vous votre <strong className="text-foreground">assurance auto</strong> trop cher ? Vérifiez en 10 secondes.
                  </p>

                  <div>
                    <label htmlFor="opt-price" className="block text-xs font-medium text-muted-foreground mb-1">
                      Votre prime auto annuelle
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
                      Votre profil conducteur
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
                    Analyser mon assurance auto →
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
                          Vous payez votre auto <span className="text-destructive">{percentOver}% trop cher</span>
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          par rapport à la moyenne de nos assurés auto avec un profil similaire.
                        </p>
                      </div>

                      <div className="rounded-xl bg-primary/5 border border-primary/20 p-3 text-center">
                        <p className="text-xs text-muted-foreground">Économie auto estimée</p>
                        <p className="text-2xl font-extrabold text-primary">{savings}€<span className="text-sm font-normal text-muted-foreground">/an</span></p>
                      </div>
                    </>
                  ) : (
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-3">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary"><polyline points="20 6 9 17 4 12"/></svg>
                      </div>
                      <p className="text-base font-bold text-foreground">Bon prix auto !</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Votre tarif auto est dans la moyenne. On peut quand même chercher mieux !
                      </p>
                    </div>
                  )}

                  <button
                    onClick={() => setStep("email")}
                    className="w-full rounded-xl bg-primary text-primary-foreground py-2.5 font-semibold text-sm shadow-md hover:shadow-lg transition-all hover:opacity-90 animate-pulse"
                  >
                    Recevoir mon rapport auto détaillé →
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
                    Recevez votre analyse auto personnalisée avec les 3 meilleures offres pour votre profil.
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
                    {sending ? "Envoi…" : "Envoyer mon rapport auto gratuit"}
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
                    Un conseiller auto vous contactera sous 24h avec votre analyse personnalisée.
                  </p>
                  <a
                    href="/comparateur?step=1&profile=auto"
                    className="inline-block text-sm text-primary font-medium hover:underline"
                  >
                    Comparer mon assurance auto →
                  </a>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating trigger button */}
      {step === "closed" && !dismissed && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setStep("form")}
          className="flex items-center gap-2 rounded-full bg-card border border-border shadow-[var(--shadow-hover)] px-4 py-2.5 text-sm font-medium text-foreground hover:shadow-[var(--shadow-lg)] transition-shadow"
          aria-label="Vérifiez votre assurance auto"
        >
          <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
              <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C1.4 11.3 1 12.1 1 13v3c0 .6.4 1 1 1h2" /><circle cx="7" cy="17" r="2" /><circle cx="17" cy="17" r="2" />
            </svg>
          </span>
          <span>Assurance auto trop chère ?</span>
        </motion.button>
      )}
    </div>
  );
}
