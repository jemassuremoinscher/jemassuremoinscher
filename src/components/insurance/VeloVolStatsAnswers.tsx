import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, AlertTriangle, FileCheck, Zap } from "lucide-react";

/**
 * Bloc GEO (Generative Engine Optimization) spécifique à /assurance-velo :
 * réponses courtes et citables sur le vol de vélo en France, chaque chiffre
 * gardant sa source propre dans le texte visible (jamais fusionné en un
 * chiffre unique fabriqué). Même structure que DirectAnswers.tsx (home) :
 * H3 question + réponse directe sourcée + puces.
 *
 * Sources (voir aussi le schema WebPage.citation dans AssuranceVelo.tsx) :
 * - ADMA, "Le vol de vélos en France" (synthèse, avril 2023)
 * - SSMSI / ministère de l'Intérieur, enquête "Vécu et ressenti en matière
 *   de sécurité" (données 2022, publiée novembre 2024)
 * - Union Sport & Cycle, Observatoire du Cycle 2025 (présenté avril 2026)
 */
const ANSWERS = [
  {
    icon: AlertTriangle,
    question: "Combien de vélos sont volés en France chaque année ?",
    lead:
      "Entre 350 000 et 580 000 vélos sont volés chaque année en France selon l'ADMA (étude avril 2023), et environ 815 000 personnes déclarent avoir été victimes d'un vol ou d'une tentative de vol selon le Service statistique ministériel de la sécurité intérieure (SSMSI, ministère de l'Intérieur, enquête « Vécu et ressenti en matière de sécurité »).",
    bullets: [
      "Le taux de plainte reste faible : entre 18 et 25 % selon les sources, ce qui explique en partie l'écart entre les études.",
      "59 % des vols ont lieu dans l'espace public, 41 % à l'intérieur d'un logement ou d'un local privé (synthèse ADMA-FUB).",
      "87 % des vélos volés dans la rue étaient pourtant attachés à un point fixe au moment du vol — un antivol seul ne suffit pas toujours.",
    ],
  },
  {
    icon: FileCheck,
    question: "Porter plainte améliore-t-il les chances de récupérer son vélo ?",
    lead:
      "Oui : le taux de récupération est environ 1,25 fois plus élevé pour les vélos ayant fait l'objet d'une plainte (6,15 %) que pour les autres (4,9 %), selon l'ADMA.",
    bullets: [
      "La plainte reste indispensable pour toute indemnisation par l'assurance, indépendamment de son effet sur la récupération.",
      "Le marquage Bicycode facilite l'identification du vélo par la police en cas de contrôle ou de revente.",
    ],
    link: { to: "/blog/velos-cargos-vae-protection-vol-urbain", label: "Voir les démarches détaillées en cas de vol" },
  },
  {
    icon: Zap,
    question: "Le vélo électrique, une cible en forte croissance",
    lead:
      "Plus de 500 000 vélos à assistance électrique (507 000 précisément) ont été vendus en France en 2025, selon l'Observatoire du Cycle 2025 de l'Union Sport & Cycle (présenté en avril 2026) — un parc en forte expansion, et une cible privilégiée pour le vol du fait de sa valeur élevée.",
    bullets: [
      "Le prix moyen d'un VAE atteint désormais environ 2 000 €, contre 638 € pour un vélo classique, selon la même étude — un écart de valeur qui explique l'attrait pour les voleurs.",
    ],
  },
];

const VeloVolStatsAnswers = () => {
  return (
    <section
      className="pt-4 md:pt-6 pb-10 md:pb-14"
      aria-labelledby="velo-stats-title"
      data-ai-description="Statistiques sourcées sur le vol de vélo en France : ADMA, SSMSI (ministère de l'Intérieur), Union Sport & Cycle."
    >
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-6 md:mb-8"
        >
          <h2 id="velo-stats-title" className="text-2xl md:text-4xl font-bold text-foreground mb-3">
            Vol de vélo en France : les chiffres
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Les données officielles et sectorielles, chacune avec sa source — jamais fusionnées en un
            seul chiffre.
          </p>
        </motion.div>

        <div className="grid gap-5 md:gap-6">
          {ANSWERS.map((item, index) => (
            <motion.article
              key={item.question}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="rounded-2xl border border-border/50 bg-card p-6 md:p-7 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex items-start gap-4">
                <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <item.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="text-lg md:text-xl font-bold text-foreground mb-2">
                    {item.question}
                  </h3>
                  <p className="text-foreground/90 leading-relaxed mb-4">{item.lead}</p>
                  <ul className="space-y-2">
                    {item.bullets.map((b) => (
                      <li key={b} className="flex gap-2 text-sm text-muted-foreground leading-relaxed">
                        <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent" aria-hidden="true" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                  {item.link && (
                    <Link
                      to={item.link.to}
                      className="mt-3 inline-block text-sm font-medium text-primary hover:underline underline-offset-2"
                    >
                      → {item.link.label}
                    </Link>
                  )}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VeloVolStatsAnswers;
