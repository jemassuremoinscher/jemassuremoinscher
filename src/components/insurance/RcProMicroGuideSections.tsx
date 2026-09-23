import { Card } from "@/components/ui/card";

/**
 * Sections de fond de /assurance-rc-pro-micro-entreprise, rédigées le
 * 2026-09-23 à partir de sources primaires lues le même jour.
 *
 * Sources (toutes paraphrasées, jamais recopiées) :
 * - Code des assurances, articles L241-1 à L243-9 (Légifrance) — garantie
 *   décennale et RC pro obligatoires pour les constructeurs (BTP)
 * - Code des assurances, article L243-3 (Légifrance) — sanction : 6 mois
 *   d'emprisonnement et 75 000 € d'amende (ou l'une des deux peines)
 * - Code du tourisme, article L211-18 (Légifrance) — RC pro obligatoire
 *   pour les opérateurs de voyages et de séjours
 * - INPI — annuaire des activités et professions réglementées, outil de
 *   vérification au cas par cas
 *
 * Point structurant, mis en avant dès l'introduction : il n'existe pas de
 * règle unique. La RC pro est imposée par la loi pour certaines activités
 * réglementées (BTP, tourisme, professions de santé/juridiques/
 * financières, chacune avec son propre texte) et n'est imposée par aucun
 * texte pour la majorité des activités non réglementées (conseil,
 * artisanat hors BTP, création, prestations de service...), où elle
 * reste une démarche volontaire fortement recommandée.
 *
 * Volontairement ABSENTS (non vérifiés) : tout chiffre de prix ; une
 * liste exhaustive de toutes les professions réglementées (renvoi vers
 * l'annuaire INPI plutôt qu'une liste maison qui deviendrait vite
 * obsolète ou incomplète).
 */

const SRC = {
  l2419: { label: "Code des assurances, articles L241-1 à L243-9 (Légifrance)", href: "https://www.legifrance.gouv.fr/codes/section_lc/LEGITEXT000006073984/LEGISCTA000006142820/" },
  l2433: { label: "Code des assurances, article L243-3 (Légifrance)", href: "https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006796023" },
  tourisme: { label: "Code du tourisme, article L211-18 (Légifrance)", href: "https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000036242744" },
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
const UL = "list-disc pl-5 space-y-2 text-muted-foreground leading-relaxed mb-3";

export const RcProMicroPasUneRegleUnique = () => (
  <section className="max-w-4xl mx-auto mb-12" aria-labelledby="rcpro-nuance-title">
    <h2 id="rcpro-nuance-title" className={H2}>RC pro micro-entreprise : ça dépend de votre activité</h2>
    <p className={P}>
      Il n'existe pas une règle unique qui rendrait la RC pro obligatoire pour toutes les micro-entreprises. La loi l'impose activité par activité, à travers des textes distincts — et pour la majorité des activités non réglementées, elle n'est imposée par aucun texte.
    </p>
    <h3 className={H3}>Activités où la loi l'impose explicitement</h3>
    <ul className={UL}>
      <li>
        <strong className="text-foreground">BTP / construction.</strong> Tout constructeur doit souscrire une assurance couvrant sa responsabilité décennale (Code des assurances, articles L241-1 à L243-9). Le défaut d'assurance est puni de 6 mois d'emprisonnement et 75 000 € d'amende, ou l'une des deux peines (article L243-3).
      </li>
      <li>
        <strong className="text-foreground">Tourisme.</strong> Les opérateurs de voyages et de séjours (agences, plateformes de réservation) doivent disposer d'une garantie RC pro (Code du tourisme, article L211-18).
      </li>
      <li>
        <strong className="text-foreground">Professions de santé, juridiques, financières.</strong> Chacune est soumise à son propre texte (Code de la santé publique, Code monétaire et financier pour les conseillers en investissements financiers, etc.).
      </li>
    </ul>
    <h3 className={H3}>Pour toutes les autres activités</h3>
    <p className={P}>
      Consultant, artisan hors BTP, créateur, prestataire de service : aucun texte général n'impose la RC pro. Elle reste une démarche volontaire — mais fortement recommandée, car elle protège contre les conséquences financières d'une faute professionnelle causant un dommage à un client ou un tiers.
    </p>
    <p className={P}>
      Pour vérifier si votre activité précise est réglementée, l'outil de référence est l'annuaire des activités et professions réglementées de l'INPI — à consulter au cas par cas, plutôt qu'une liste générale qui ne pourrait pas être exhaustive.
    </p>
    <Sources keys={["l2419", "l2433", "tourisme", "inpi"]} />
  </section>
);

export const RcProMicroSourcesNote = () => (
  <Card className="p-4 md:p-5 bg-muted/30 max-w-4xl mx-auto mb-12">
    <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
      <strong className="text-foreground">Sources consultées le 23 septembre 2026.</strong> Les textes de loi ont été lus sur Légifrance le même jour. Nous ne prétendons pas à une liste exhaustive des activités réglementées : consultez l'annuaire INPI pour votre cas précis. Le bouton de comparaison de cette page ouvre notre comparateur général. Les pages de sources sont publiques, susceptibles d'évoluer : les textes en vigueur et votre contrat font foi.
    </p>
  </Card>
);
