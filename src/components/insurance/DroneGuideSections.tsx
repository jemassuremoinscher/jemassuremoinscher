import { Card } from "@/components/ui/card";

/**
 * Sections de fond de /assurance-drone, rédigées le 2026-09-23 à partir de
 * sources primaires lues le même jour.
 *
 * Sources (toutes paraphrasées, jamais recopiées) :
 * - ecologie.gouv.fr, page AlphaTango (enregistrement des drones)
 * - ecologie.gouv.fr, bulletin "1er juillet 2024 — Réglementation
 *   européenne" (fin des scénarios nationaux S-1/S-2/S-3 au 1er janvier
 *   2026)
 * - Code des transports, articles L6131-1 et L6131-2 (Légifrance) — lus
 *   directement : L6131-1 concerne les collisions aéronef-contre-aéronef
 *   et NE traite PAS des drones ; L6131-2 établit une responsabilité
 *   civile de plein droit de l'exploitant envers les tiers au sol, mais
 *   n'impose pas formellement une assurance
 * - Règlement (CE) n° 785/2004, qui exclut explicitement les aéronefs de
 *   moins de 20 kg de son champ d'application
 * - Me Hassan Kohen, avocat en droit pénal, kohenavocats.com — analyse
 *   publiée reconnaissant que l'obligation d'assurance RC pour les
 *   drones professionnels de moins de 20 kg repose sur une interprétation
 *   administrative de la DGAC, pas sur un texte unique et explicite
 *
 * Volontairement ABSENTS (non vérifiés) : tout chiffre de prix ; un
 * montant de sanction pénale pour défaut d'assurance (la piste L6232-4
 * s'est révélée fausse — cet article concerne la navigabilité, pas
 * l'assurance — et aucune autre source primaire n'a permis de confirmer
 * un montant) ; le détail des nouveaux scénarios standards européens
 * (STS-01/STS-02) faute de texte officiel français directement consulté
 * sur leur contenu technique.
 */

const SRC = {
  alphatango: { label: "ecologie.gouv.fr — AlphaTango, enregistrement des drones", href: "https://www.ecologie.gouv.fr/politiques-publiques/alphatango" },
  categorieSpecifique: { label: "ecologie.gouv.fr — Exploitation de drones en catégorie spécifique", href: "https://www.ecologie.gouv.fr/politiques-publiques/exploitation-drones-categorie-specifique" },
  l61312: { label: "Code des transports, article L6131-2 (Légifrance)", href: "https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000023078395" },
  kohen: { label: "Me Hassan Kohen, avocat — analyse sur l'assurance drone professionnel", href: "https://kohenavocats.com/drone-professionnel-dommage-tiers-assurance-sanction-preuve-recours/" },
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

export const DroneEnregistrement = () => (
  <section className="max-w-4xl mx-auto mb-12" aria-labelledby="drone-enregistrement-title">
    <h2 id="drone-enregistrement-title" className={H2}>Drone : enregistrement et catégories</h2>
    <p className={P}>
      Depuis le 26 décembre 2018, l'enregistrement est obligatoire pour tout drone de 800 g ou plus, ou équipé d'un dispositif de signalement électronique, via la plateforme AlphaTango (alphatango.aviation-civile.gouv.fr). Cette démarche attribue un numéro d'exploitant à apposer visiblement sur l'appareil.
    </p>
    <p className={P}>
      Une exemption existe pour la catégorie ouverte : les aéronefs de moins de 250 g, avec une énergie d'impact inférieure à 80 joules et sans capteur de données personnelles, ne sont pas concernés par cette obligation.
    </p>
    <h3 className={H3}>Changement majeur au 1ᵉʳ janvier 2026</h3>
    <p className={P}>
      Les scénarios nationaux français S-1, S-2 et S-3, qui encadraient historiquement l'usage professionnel des drones, ont cessé d'exister le 1ᵉʳ janvier 2026. Le cadre applicable est désormais entièrement celui du règlement européen sur les aéronefs sans équipage (UAS), avec ses propres catégories (ouverte, spécifique, certifiée) et ses propres scénarios standards.
    </p>
    <Sources keys={["alphatango", "categorieSpecifique"]} />
  </section>
);

export const DroneAssuranceRC = () => (
  <section className="max-w-4xl mx-auto mb-12" aria-labelledby="drone-assurance-title">
    <h2 id="drone-assurance-title" className={H2}>Assurance RC : ce que dit vraiment la loi</h2>
    <p className={P}>
      L'article L6131-2 du Code des transports rend l'exploitant d'un aéronef responsable de plein droit des dommages causés par ses évolutions ou par des objets qui s'en détachent aux personnes et aux biens à la surface — une responsabilité qui ne peut être écartée que par la preuve d'une faute de la victime. C'est une responsabilité civile stricte, pas une obligation d'assurance formulée comme telle.
    </p>
    <p className={P}>
      Le règlement européen (CE) n° 785/2004, qui fixe des montants minimaux de couverture pour les exploitants d'aéronefs, exclut explicitement de son champ les aéronefs de moins de 20 kg — c'est-à-dire la quasi-totalité des drones civils.
    </p>
    <p className={P}>
      Il n'existe donc pas, à ce jour, un texte unique et explicite qui rende l'assurance responsabilité civile obligatoire pour un drone professionnel de moins de 20 kg. Comme l'expose Me Hassan Kohen, avocat, ce règlement de 2004 est antérieur à l'essor des drones commerciaux : « en pratique, la direction générale de l'aviation civile qualifie la responsabilité civile Aéronef d'obligatoire » — une interprétation administrative de la DGAC, pas une obligation légale formulée par un texte spécifique aux drones. Cela ne rend pas cette assurance moins nécessaire : la responsabilité stricte de l'article L6131-2 expose financièrement tout exploitant en cas de dommage à un tiers.
    </p>
    <Sources keys={["l61312", "kohen"]} />
  </section>
);

export const DroneSourcesNote = () => (
  <Card className="p-4 md:p-5 bg-muted/30 max-w-4xl mx-auto mb-12">
    <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
      <strong className="text-foreground">Sources consultées le 23 septembre 2026.</strong> Les textes de loi ont été lus sur Légifrance le même jour. Nous sommes transparents sur les points où la loi elle-même est ambiguë (assurance RC pour les drones de moins de 20 kg) plutôt que d'affirmer une certitude qui n'existe pas dans les textes. Le bouton de comparaison de cette page ouvre notre comparateur général. Les pages de sources sont publiques, susceptibles d'évoluer : les textes en vigueur et votre contrat font foi.
    </p>
  </Card>
);
