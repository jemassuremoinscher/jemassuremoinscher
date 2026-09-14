import { AlertTriangle, ShieldAlert } from "lucide-react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

/**
 * Bloc GEO spécifique à /assurance-scooter-50cc : même pattern que
 * VeloVolStatsAnswers.tsx et TrottinetteStatsAnswers.tsx. Chiffres 100%
 * vérifiés le 2026-09-13 (ONISR, bilan définitif 2024, publié mai 2025) —
 * voir aussi le schema WebPage.citation dans AssuranceScooter50cc.tsx.
 *
 * Carte 2 : le lien BSR/AM (14 ans) — accidentalité n'est PAS une statistique
 * cyclomoteur isolée par l'ONISR dans les sources consultées. L'avertissement
 * est placé avant le chiffre, jamais après, pour qu'aucune lecture ne
 * l'associe au cyclomoteur spécifiquement (formulation validée le 2026-09-12).
 */
const ANSWERS = [
  {
    icon: AlertTriangle,
    question: "Combien de cyclomotoristes sont morts sur la route en France ?",
    lead:
      "123 cyclomotoristes sont morts sur la route en France en 2024, sur un total de 720 tués parmi les usagers de deux-roues motorisés (597 motocyclistes et 123 cyclomotoristes), selon le bilan définitif 2024 de l'ONISR (Observatoire national interministériel de la sécurité routière, ministère de l'Intérieur, publié en mai 2025).",
    bullets: [
      "Les cyclomotoristes représentent 17 % des 720 décès en deux-roues motorisé, contre 83 % pour les motocyclistes.",
      "1 tué sur 5 sur la route est un usager de deux-roues motorisé, alors que ces véhicules représentent environ 2 % du trafic.",
    ],
  },
  {
    icon: ShieldAlert,
    question: "Le BSR/AM dès 14 ans est-il un facteur de risque documenté pour le cyclomoteur ?",
    lead:
      "Attention : l'ONISR ne publie pas de statistique de mortalité ou de blessure isolée pour le seul cyclomoteur chez les 14-17 ans. Cette tranche d'âge présente, tous modes de déplacement confondus (piéton, vélo, voiture, deux-roues motorisés), un risque d'être blessé grave deux fois supérieur à la moyenne (92 tués toutes causes en 2024, -24 par rapport à 2023 ; source : ONISR, bilan 2024).",
    bullets: [
      "Le non-port du casque concerne un tiers des décès en deux-roues motorisé toutes cylindrées confondues (pas de chiffre isolé pour le 50cc spécifiquement) — un casque homologué reste obligatoire quel que soit l'âge.",
    ],
  },
];

const Scooter50StatsAnswers = () => {
  return (
    <section
      className="pt-4 md:pt-6 pb-10 md:pb-14"
      aria-labelledby="scooter50-stats-title"
      data-ai-description="Statistiques sourcées sur l'accidentologie des cyclomoteurs 50cc en France : ONISR, ministère de l'Intérieur."
    >
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-6 md:mb-8"
        >
          <h2 id="scooter50-stats-title" className="text-2xl md:text-4xl font-bold text-foreground mb-3">
            Cyclomoteur 50cc en France : les chiffres
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Les données officielles de sécurité routière, sourcées — et honnêtes sur ce qui n'est pas
            spécifiquement documenté pour le 50cc.
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
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Scooter50StatsAnswers;
