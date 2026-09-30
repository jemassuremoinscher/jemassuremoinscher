import { motion } from "framer-motion";
import { Check, TrendingDown, CalendarClock, ShieldCheck } from "lucide-react";

/**
 * Bloc GEO (Generative Engine Optimization) :
 * réponses courtes et citables aux 4 intentions de recherche principales
 * ("payer moins cher", "quand résilier", "combien ça coûte", "est-ce fiable").
 * Structure : question en H3 + réponse directe en 1 phrase + liste à puces.
 */
const ANSWERS = [
  {
    icon: TrendingDown,
    question: "Comment payer son assurance moins cher en 2026 ?",
    lead:
      "En comparant au moins 5 offres avant chaque échéance : à garanties identiques, l'écart de prix entre deux assureurs peut être significatif pour un même profil.",
    bullets: [
      "Réévaluez vos garanties : une voiture de plus de 8 ans passe souvent avantageusement du tous risques au tiers étendu.",
      "Ajustez votre franchise : une franchise plus élevée fait généralement baisser la prime auto.",
      "Regroupez auto + habitation chez le même assureur : les contrats multi-produits sont souvent proposés avec une remise.",
      "Déclarez votre kilométrage réel : sous 8 000 km/an, les formules « petits rouleurs » sont moins chères.",
      "Comparez chaque année : la fidélité n'est presque jamais récompensée tarifairement en assurance.",
    ],
  },
  {
    icon: CalendarClock,
    question: "Quand peut-on résilier son assurance ?",
    lead:
      "À tout moment après 12 mois de contrat, sans frais ni justificatif, grâce à la loi Hamon (art. L113-15-2 du Code des assurances).",
    bullets: [
      "Auto, moto, habitation : résiliation libre après la première année (loi Hamon).",
      "Mutuelle santé individuelle : résiliation infra-annuelle possible après 12 mois.",
      "Assurance emprunteur : changement possible à tout moment depuis la loi Lemoine (2022).",
      "Avant 12 mois : résiliation à l'échéance avec un préavis de 2 mois (loi Chatel).",
      "Le nouvel assureur se charge gratuitement des démarches de résiliation à votre place.",
    ],
  },
  {
    icon: ShieldCheck,
    question: "Un comparateur d'assurance est-il vraiment gratuit ?",
    lead:
      "Oui : la comparaison et la mise en relation sont gratuites pour vous, le courtier étant rémunéré par l'assureur uniquement si vous souscrivez.",
    bullets: [
      "Aucun frais de dossier, aucun paiement demandé pour obtenir un devis.",
      "Nous sommes rémunérés par une commission versée par l'assureur en cas de souscription.",
      "Vos données ne sont transmises qu'aux assureurs nécessaires à votre devis (RGPD).",
      "Aucun engagement : vous restez libre de conserver votre contrat actuel.",
    ],
  },
];

const DirectAnswers = () => {
  return (
    <section
      className="pt-4 md:pt-6 pb-10 md:pb-14 bg-muted/20 section-lazy"
      aria-labelledby="reponses-directes-title"
    >
      <div className="container mx-auto px-4 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-6 md:mb-8"
        >
          <h2
            id="reponses-directes-title"
            className="text-2xl md:text-4xl font-bold text-foreground mb-3"
          >
            S'assurer moins cher : les réponses essentielles
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Les règles concrètes qui font baisser une prime d'assurance en France, expliquées
            simplement par nos conseillers.
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

export default DirectAnswers;
