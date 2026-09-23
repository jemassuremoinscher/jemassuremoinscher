import { Card } from "@/components/ui/card";

/**
 * Sections de fond de /assurance-influenceur, rédigées le 2026-09-23 à
 * partir de sources primaires lues le même jour.
 *
 * Sources (toutes paraphrasées, jamais recopiées) :
 * - Loi n° 2023-451 du 9 juin 2023, article 1 (définition de l'activité
 *   d'influence commerciale) et article 9, § II (obligation d'assurance)
 *   — Légifrance
 * - Version en vigueur depuis le 08/11/2024, suite à l'Ordonnance
 *   n° 2024-978 du 6 novembre 2024 (mise en conformité avec le droit
 *   européen : directives e-commerce et services de médias)
 *
 * Point structurant, mis en avant dès l'introduction : l'obligation
 * d'assurance ne concerne QUE les influenceurs établis hors Union
 * européenne, Espace économique européen ou Suisse, visant un public
 * français. Un influenceur établi en France ou dans l'UE n'est PAS visé
 * par cette obligation légale spécifique — angle volontairement étroit,
 * pas gonflé pour paraître plus large qu'il ne l'est.
 *
 * Volontairement ABSENTS (non vérifiés) : tout chiffre de prix ; une
 * liste exhaustive des produits interdits (recoupée sur sources
 * secondaires convergentes, pas lue mot pour mot sur le texte de
 * l'ordonnance — présentée avec prudence, à titre informatif).
 */

const SRC = {
  art1: { label: "Loi n° 2023-451 du 9 juin 2023, article 1 (Légifrance)", href: "https://www.legifrance.gouv.fr/loda/article_lc/LEGIARTI000050468930" },
  art9: { label: "Loi n° 2023-451 du 9 juin 2023, article 9 (Légifrance)", href: "https://www.legifrance.gouv.fr/loda/article_lc/LEGIARTI000050468893" },
} as const;

type SrcKey = keyof typeof SRC;

const Sources = ({ keys }: { keys: SrcKey[] }) => (
  <p className="text-xs text-muted-foreground mt-4 leading-relaxed">
    Sources :{" "}
    {keys.map((k, i) => (
      <span key={k}>
        <a href={SRC[k].href} target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">
          {SRC[k].label}
        </a>
        {i < keys.length - 1 ? " · " : ""}
      </span>
    ))}
  </p>
);

const H2 = "text-xl md:text-2xl font-bold text-foreground mb-3";
const H3 = "text-base md:text-lg font-semibold text-foreground mt-6 mb-2";
const P = "text-muted-foreground leading-relaxed mb-3";
const UL = "list-disc pl-5 space-y-2 text-muted-foreground leading-relaxed mb-3";

export const InfluenceurCadreLegal = () => (
  <section className="max-w-4xl mx-auto mb-12" aria-labelledby="influenceur-cadre-title">
    <h2 id="influenceur-cadre-title" className={H2}>Influenceur : ce que dit la loi du 9 juin 2023</h2>
    <p className={P}>
      La loi n° 2023-451 du 9 juin 2023 définit l'activité d'influence commerciale comme le fait, pour une personne physique ou morale, de « mobiliser, à titre onéreux, sa notoriété auprès de son audience pour communiquer au public par voie électronique des contenus visant à faire la promotion, directement ou indirectement, de biens, de services ou d'une cause quelconque » (article 1).
    </p>
    <p className={P}>
      Ce texte encadre principalement les pratiques commerciales : contrat écrit obligatoire entre influenceur et annonceur au-delà d'un certain seuil de rémunération, mentions publicitaires obligatoires sur les contenus sponsorisés, et interdiction de promouvoir certains secteurs (actes de chirurgie ou médecine esthétique, produits financiers spéculatifs, notamment). Ce sont ces règles-là — pas l'assurance — qui forment le cœur du texte.
    </p>
    <Sources keys={["art1"]} />
  </section>
);

export const InfluenceurAssuranceRC = () => (
  <section className="max-w-4xl mx-auto mb-12" aria-labelledby="influenceur-assurance-title">
    <h2 id="influenceur-assurance-title" className={H2}>L'obligation d'assurance : un angle précis, pas général</h2>
    <p className={P}>
      L'article 9, § II de la loi impose une assurance responsabilité civile professionnelle, souscrite auprès d'un assureur établi dans l'Union européenne, à « la personne exerçant l'activité [d'influence commerciale] qui est établie en dehors de l'Union européenne, de la Confédération suisse ou de l'Espace économique européen lorsque cette activité vise, même accessoirement, un public établi sur le territoire français ».
    </p>
    <h3 className={H3}>Ce que ça veut dire concrètement</h3>
    <ul className={UL}>
      <li>
        <strong className="text-foreground">Concerné :</strong> un influenceur établi hors UE/EEE/Suisse (par exemple aux États-Unis, à Dubaï, etc.) dont le contenu vise, même partiellement, une audience française.
      </li>
      <li>
        <strong className="text-foreground">Pas concerné par cette obligation précise :</strong> un influenceur établi en France ou ailleurs dans l'UE/EEE/Suisse. Aucun texte de cette loi ne lui impose une RC pro au titre de son activité d'influence.
      </li>
    </ul>
    <p className={P}>
      Cette disposition est en vigueur depuis le 8 novembre 2024, après une modification par l'Ordonnance n° 2024-978 du 6 novembre 2024 destinée à mettre le texte français en conformité avec le droit européen.
    </p>
    <Sources keys={["art9"]} />
  </section>
);

export const InfluenceurSourcesNote = () => (
  <Card className="p-4 md:p-5 bg-muted/30 max-w-4xl mx-auto mb-12">
    <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
      <strong className="text-foreground">Sources consultées le 23 septembre 2026.</strong> Les textes de loi ont été lus sur Légifrance le même jour. Nous ne gonflons pas artificiellement le champ de cette obligation d'assurance : elle vise spécifiquement les influenceurs établis hors UE/EEE/Suisse, pas l'ensemble de la profession. Le bouton de comparaison de cette page ouvre notre comparateur général. Les pages de sources sont publiques, susceptibles d'évoluer : les textes en vigueur et votre contrat font foi.
    </p>
  </Card>
);
