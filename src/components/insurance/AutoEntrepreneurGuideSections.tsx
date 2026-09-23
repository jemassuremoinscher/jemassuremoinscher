import { Card } from "@/components/ui/card";

/**
 * Sections de fond de /assurance-auto-entrepreneur, rédigées le
 * 2026-09-23. Réutilise le même cadre juridique déjà vérifié pour
 * /assurance-rc-pro-micro-entreprise (Code des assurances L241-1 à
 * L243-9 et L243-3, Code du tourisme L211-18, annuaire INPI), avec
 * l'angle spécifique à l'auto-entrepreneur.
 *
 * Point structurant : "auto-entrepreneur" est un régime fiscal et
 * social simplifié (micro-entreprise), pas une activité en soi.
 * L'obligation de RC pro dépend de l'activité déclarée, exactement
 * comme pour toute micro-entreprise — pas du statut auto-entrepreneur
 * lui-même. Corrige au passage une généralisation trouvée dans la
 * landing existante ("obligatoire pour beauté, conseil réglementé"),
 * infirmée par la recherche primaire (voir commit de1f0a19).
 *
 * Volontairement ABSENTS (non vérifiés) : tout chiffre de prix ; une
 * liste exhaustive des activités réglementées (renvoi vers l'annuaire
 * INPI).
 */

const SRC = {
  l2419: { label: "Code des assurances, articles L241-1 à L243-9 (Légifrance)", href: "https://www.legifrance.gouv.fr/codes/section_lc/LEGITEXT000006073984/LEGISCTA000006142820/" },
  l2433: { label: "Code des assurances, article L243-3 (Légifrance)", href: "https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006796023" },
  inpi: { label: "INPI — annuaire des activités et professions réglementées", href: "https://www.inpi.fr/ressources/formalites-dentreprises/types-dactivites-possibles-en-tant-que-micro-entrepreneur" },
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

export const AutoEntrepreneurStatutVsActivite = () => (
  <section className="max-w-4xl mx-auto mb-12" aria-labelledby="ae-statut-title">
    <h2 id="ae-statut-title" className={H2}>Auto-entrepreneur : c'est votre activité qui compte, pas votre statut</h2>
    <p className={P}>
      "Auto-entrepreneur" (aujourd'hui officiellement micro-entrepreneur) désigne un régime fiscal et social simplifié — pas une activité en soi. La question de savoir si votre RC pro est obligatoire ne dépend donc jamais de ce statut, mais de ce que vous faites concrètement : un auto-entrepreneur du BTP et un auto-entrepreneur consultant en marketing ne sont pas soumis aux mêmes règles.
    </p>
    <h3 className={H3}>Où la loi l'impose</h3>
    <p className={P}>
      Tout constructeur, y compris auto-entrepreneur, doit souscrire une assurance couvrant sa responsabilité décennale (Code des assurances, articles L241-1 à L243-9). Le défaut d'assurance est puni de 6 mois d'emprisonnement et 75 000 € d'amende, ou l'une des deux peines (article L243-3). Les opérateurs de voyages et de séjours, ainsi que certaines professions de santé, juridiques ou financières, ont chacun leur propre texte imposant la RC pro.
    </p>
    <h3 className={H3}>Où elle ne l'est pas</h3>
    <p className={P}>
      Pour la majorité des activités non réglementées — conseil, création, prestations de service, artisanat hors BTP — aucun texte n'impose la RC pro. Elle reste une démarche volontaire, mais fortement recommandée : elle couvre les conséquences financières d'une faute professionnelle causant un dommage à un client. Pour vérifier votre cas précis, l'annuaire des activités et professions réglementées de l'INPI reste la référence.
    </p>
    <Sources keys={["l2419", "l2433", "inpi"]} />
  </section>
);

export const AutoEntrepreneurSourcesNote = () => (
  <Card className="p-4 md:p-5 bg-muted/30 max-w-4xl mx-auto mb-12">
    <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
      <strong className="text-foreground">Sources consultées le 23 septembre 2026.</strong> Les textes de loi ont été lus sur Légifrance le même jour. Nous ne généralisons pas une obligation de RC pro à toutes les activités d'auto-entrepreneur : elle dépend de l'activité exercée, pas du statut. Le bouton de comparaison de cette page ouvre notre comparateur général. Les pages de sources sont publiques, susceptibles d'évoluer : les textes en vigueur et votre contrat font foi.
    </p>
  </Card>
);
