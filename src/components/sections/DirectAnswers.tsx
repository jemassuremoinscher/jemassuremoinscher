import { Link } from "react-router-dom";
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
      "En comparant au moins 5 offres avant chaque échéance : à garanties identiques, l'écart de prix entre deux assureurs atteint couramment 30 à 40 % pour un même profil.",
    bullets: [
      "Réévaluez vos garanties : une voiture de plus de 8 ans passe souvent avantageusement du tous risques au tiers étendu.",
      "Ajustez votre franchise : +150 € de franchise fait généralement baisser la prime auto de 5 à 10 %.",
      "Regroupez auto + habitation chez le même assureur : 5 à 15 % de remise multi-contrats.",
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
      "Notre rémunération est une commission versée par l'assureur, identique quel que soit le contrat retenu.",
      "Vos données ne sont transmises qu'aux assureurs nécessaires à votre devis (RGPD).",
      "Aucun engagement : vous restez libre de conserver votre contrat actuel.",
    ],
  },
];

const PRICES = [
  { type: "Assurance auto (tiers)", price: "dès 22 €/mois", ref: "/assurance-auto" },
  { type: "Assurance auto (tous risques)", price: "dès 45 €/mois", ref: "/assurance-auto" },
  { type: "Assurance habitation (T2/T3)", price: "dès 8 €/mois", ref: "/assurance-habitation" },
  { type: "Mutuelle santé (individuelle)", price: "dès 19 €/mois", ref: "/assurance-sante" },
  { type: "Assurance moto / scooter", price: "dès 15 €/mois", ref: "/assurance-moto" },
  { type: "Assurance trottinette électrique", price: "dès 2,90 €/mois", ref: "/assurance-trottinette" },
];

const DirectAnswers = () => {
  return (
    <section
      className="py-14 md:py-20 bg-muted/20 border-t border-border/30 section-lazy"
      aria-labelledby="reponses-directes-title"
    >
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-10">
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
        </div>

        <div className="grid gap-5 md:gap-6">
          {ANSWERS.map((item) => (
            <article
              key={item.question}
              className="rounded-2xl border border-border/50 bg-card p-6 md:p-7 shadow-sm"
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
            </article>
          ))}
        </div>

        {/* Tableau de repères tarifaires : format citable par les moteurs génératifs */}
        <div className="mt-10 rounded-2xl border border-border/50 bg-card p-5 md:p-7 shadow-sm">
          <h3 className="text-lg md:text-xl font-bold text-foreground mb-2">
            Combien coûte une assurance moins chère ? Repères de prix 2026
          </h3>
          <p className="text-sm text-muted-foreground mb-5">
            Tarifs d'entrée constatés sur les devis réalisés via jemassuremoinscher.fr. Le prix final
            dépend de votre profil, de votre localisation et des garanties choisies.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <caption className="sr-only">
                Prix d'entrée par type d'assurance constatés en 2026
              </caption>
              <thead>
                <tr className="border-b border-border/60 text-foreground">
                  <th scope="col" className="py-2 pr-4 font-semibold">Type d'assurance</th>
                  <th scope="col" className="py-2 pr-4 font-semibold">Prix constaté</th>
                  <th scope="col" className="py-2 font-semibold">Comparer</th>
                </tr>
              </thead>
              <tbody>
                {PRICES.map((row) => (
                  <tr key={row.type} className="border-b border-border/30 last:border-0">
                    <td className="py-2.5 pr-4 text-muted-foreground">{row.type}</td>
                    <td className="py-2.5 pr-4 font-semibold text-foreground">{row.price}</td>
                    <td className="py-2.5">
                      <Link to={row.ref} className="text-primary font-medium hover:underline">
                        Voir les offres
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DirectAnswers;
