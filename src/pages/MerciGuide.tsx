import { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Download, CheckCircle2, ArrowRight, Sparkles, Mail, Shield } from "lucide-react";
import { motion } from "framer-motion";
import arthurThumbsUp from "@/assets/mascotte/arthur-thumbs-up.webp";
import SEOOptimized from "@/components/SEOOptimized";

const PDF_URL = "/lead-magnets/7-erreurs-assurance.pdf";

const HIGHLIGHTS = [
  "Les 7 pièges qui font payer trop cher",
  "La méthode pour économiser jusqu'à 540 €/an",
  "Les bons réflexes avant chaque renouvellement",
  "Notre check-list pré-comparatif (à imprimer)",
];

const MerciGuide = () => {
  const [params] = useSearchParams();
  const email = params.get("email") || "";

  // Pré-déclenchement du téléchargement (utile mobile/Safari : on garde aussi le bouton)
  useEffect(() => {
    const t = window.setTimeout(() => {
      try {
        const a = document.createElement("a");
        a.href = PDF_URL;
        a.download = "7-erreurs-assurance.pdf";
        a.rel = "noopener";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } catch {
        /* noop — le bouton reste disponible */
      }
    }, 600);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <>
      <SEOOptimized
        title="Merci ! Votre guide gratuit est prêt — JMMC"
        description="Téléchargez votre guide PDF gratuit : les 7 erreurs qui font exploser votre assurance, et comment économiser jusqu'à 540 € par an."
        noIndex
      />
      <main className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/10">
        <div className="container mx-auto px-4 py-10 md:py-16 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="rounded-3xl bg-card border border-border shadow-2xl overflow-hidden"
          >
            {/* Hero brandé */}
            <div className="relative bg-gradient-to-br from-primary via-primary to-[hsl(263_70%_35%)] text-primary-foreground p-6 md:p-10">
              <div className="absolute -top-16 -right-16 w-56 h-56 bg-accent/30 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
              <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-accent/20 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />

              <div className="relative flex flex-col md:flex-row items-center gap-6">
                <div className="flex-1 text-center md:text-left">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/20 border border-accent/40 mb-3">
                    <Sparkles className="w-3.5 h-3.5 text-accent" aria-hidden="true" />
                    <span className="text-[11px] font-bold uppercase tracking-wide text-accent">
                      Guide envoyé
                    </span>
                  </div>
                  <h1 className="text-2xl md:text-4xl font-black leading-tight mb-2">
                    Merci ! Votre guide<br className="hidden md:block" />
                    <span className="text-accent">est prêt à télécharger.</span>
                  </h1>
                  {email && (
                    <p className="text-sm md:text-base text-primary-foreground/85 flex items-center justify-center md:justify-start gap-1.5">
                      <Mail className="w-4 h-4" aria-hidden="true" />
                      Une copie a été envoyée à <strong className="font-semibold">{email}</strong>
                    </p>
                  )}
                </div>
                <img
                  src={arthurThumbsUp}
                  alt="Arthur, mascotte JMMC, vous remercie"
                  width={140}
                  height={170}
                  className="w-28 md:w-36 h-auto drop-shadow-xl"
                  loading="eager"
                />
              </div>
            </div>

            {/* CTA téléchargement immédiat */}
            <div className="p-6 md:p-10 space-y-8">
              <div className="rounded-2xl bg-accent/15 border-2 border-accent/40 p-5 md:p-6 text-center">
                <p className="text-xs uppercase tracking-wide font-bold text-primary mb-2">
                  Téléchargement immédiat
                </p>
                <a
                  href={PDF_URL}
                  download="7-erreurs-assurance.pdf"
                  target="_blank"
                  rel="noopener"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-primary text-primary-foreground font-bold text-base hover:bg-primary/90 transition-colors shadow-lg hover:shadow-xl"
                  aria-label="Télécharger le guide PDF — 7 erreurs assurance"
                >
                  <Download className="w-5 h-5" aria-hidden="true" />
                  Télécharger mon guide (PDF)
                </a>
                <p className="text-[11px] text-muted-foreground mt-3">
                  Si le téléchargement ne démarre pas automatiquement, cliquez sur le bouton.
                </p>
              </div>

              {/* Résumé du contenu */}
              <div>
                <h2 className="text-lg md:text-xl font-bold text-foreground mb-4">
                  Ce que vous allez découvrir
                </h2>
                <ul className="grid sm:grid-cols-2 gap-3">
                  {HIGHLIGHTS.map((h) => (
                    <li
                      key={h}
                      className="flex items-start gap-2.5 p-3 rounded-xl bg-muted/40 border border-border"
                    >
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" aria-hidden="true" />
                      <span className="text-sm text-foreground leading-snug">{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Prochaine étape — vers comparateur */}
              <div className="rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 p-5 md:p-6">
                <div className="flex items-start gap-3 mb-3">
                  <div className="p-2 rounded-full bg-primary/15">
                    <Shield className="w-5 h-5 text-primary" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="text-base md:text-lg font-bold text-foreground">
                      Envie de passer à l'action tout de suite&nbsp;?
                    </h3>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      Comparez 70+ assureurs en 3 minutes et voyez combien vous pouvez économiser.
                    </p>
                  </div>
                </div>
                <Link
                  to="/comparateur?utm_source=lead-magnet&utm_medium=thankyou&utm_campaign=7-erreurs"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent text-accent-foreground font-semibold text-sm hover:bg-accent/90 transition-colors shadow"
                >
                  Lancer mon comparatif
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </div>

              {/* Trust line */}
              <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[11px] text-muted-foreground pt-2 border-t border-border">
                <span>★ 4.9/5 · 247 avis Google</span>
                <span>·</span>
                <span>70+ assureurs comparés</span>
                <span>·</span>
                <span>100 % en ligne</span>
                <span>·</span>
                <span>Sans engagement</span>
              </div>

              <p className="text-center text-xs text-muted-foreground">
                <Link to="/" className="underline hover:text-foreground">
                  Retour à l'accueil
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </main>
    </>
  );
};

export default MerciGuide;
