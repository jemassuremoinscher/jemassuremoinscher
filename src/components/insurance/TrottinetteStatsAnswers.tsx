import { AlertTriangle, ShieldAlert } from "lucide-react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

/**
 * Bloc GEO (Generative Engine Optimization) spécifique à /assurance-trottinette :
 * réponses courtes et citables sur l'accidentologie EDPM en France, chaque
 * chiffre gardant sa source dans le texte visible. Même structure que
 * VeloVolStatsAnswers.tsx (/assurance-velo) et DirectAnswers.tsx (home).
 *
 * Angle différent du vélo par nécessité, pas par choix éditorial : le vol de
 * trottinette n'a pas d'étude officielle équivalente à l'ADMA (vélo) — la
 * carte 2 le dit explicitement plutôt que de combler ce trou avec un chiffre
 * inventé ou recyclé du vélo.
 *
 * Source : ONISR (Observatoire national interministériel de la sécurité
 * routière, ministère de l'Intérieur) — voir aussi le schema
 * WebPage.citation dans AssuranceTrottinette.tsx.
 */
const ANSWERS = [
  {
    icon: AlertTriangle,
    question: "Combien de personnes sont mortes ou blessées en trottinette électrique en France ?",
    lead:
      "79 utilisateurs d'engins de déplacement personnel motorisés (EDPM, dont la trottinette électrique) sont morts sur la route en France en 2025, contre 45 en 2024 — une hausse de plus de 75 %, selon l'ONISR (Observatoire national interministériel de la sécurité routière, ministère de l'Intérieur).",
    bullets: [
      "Environ 1 200 blessés graves estimés en 2025, en hausse de 38 % par rapport à 2024.",
      "62 % des utilisateurs présumés responsables de leur accident sont seuls en cause (perte d'équilibre, obstacle, état de la chaussée).",
      "59 des 79 décès de 2025 ont eu lieu en agglomération.",
    ],
  },
  {
    icon: ShieldAlert,
    question: "Le vol de trottinette électrique est-il aussi documenté que le vol de vélo ?",
    lead:
      "Non, pas avec le même niveau de précision : contrairement au vol de vélo (étudié par l'ADMA), aucune étude officielle ne chiffre spécifiquement le vol de trottinette électrique en France à ce jour.",
    bullets: [
      "Les données publiques disponibles (France Mobilités, ADEME) portent sur les ventes et l'usage, pas sur le vol.",
      "Les bonnes pratiques restent les mêmes que pour le vélo : antivol homologué, stationnement à un point fixe, photo et numéro de série conservés.",
    ],
  },
];

const TrottinetteStatsAnswers = () => {
  return (
    <section
      className="pt-4 md:pt-6 pb-10 md:pb-14"
      aria-labelledby="trottinette-stats-title"
      data-ai-description="Statistiques sourcées sur l'accidentologie des trottinettes électriques en France : ONISR, ministère de l'Intérieur."
    >
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-6 md:mb-8"
        >
          <h2 id="trottinette-stats-title" className="text-2xl md:text-4xl font-bold text-foreground mb-3">
            Trottinette électrique en France : les chiffres
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Les données officielles de sécurité routière, sourcées — et honnêtes sur ce qui n'est pas
            encore documenté.
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

export default TrottinetteStatsAnswers;
