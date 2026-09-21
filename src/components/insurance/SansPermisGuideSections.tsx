import { Card } from "@/components/ui/card";
import { SANS_PERMIS_HOWTO_STEPS } from "@/data/sansPermisHowToSteps";

/**
 * Sections de fond de /assurance-sans-permis, rédigées le 2026-09-21 à partir
 * de sources primaires lues le même jour (aucun chiffre de prix, aucun
 * plafond chiffré, aucun montant de garantie : uniquement des règles
 * attribuées à leur source).
 *
 * Sources (toutes paraphrasées, jamais recopiées) :
 * - Ministère de l'Intérieur, réponse à la question écrite Sénat n° 07151 (17/09/2026)
 * - service-public.gouv.fr : F2890 (BSR / permis AM, vérifiée 10/06/2025),
 *   F12096 (quels permis selon le véhicule, vérifiée 10/06/2025), F2833 (permis B1,
 *   vérifiée 26/05/2025), F37538 (contrôle technique catégorie L, vérifiée 01/01/2026)
 * - Légifrance : Code de la route R221-5 (en vigueur 01/01/2024), R311-1 (en
 *   vigueur 25/07/2026), L324-2 (en vigueur 20/08/2026) ; Code des assurances
 *   L211-1 (en vigueur 08/12/2023) ; arrêté du 23 octobre 2023, articles 43 et 46
 * - AAA-Data, « Intelligence Auto n° 80 » (16/04/2025)
 * - Direct Assurance, page « assurance voiture sans permis » (grille lue dans
 *   le HTML de la page le 21/09/2026, sans date de mise à jour affichée)
 * - Groupama, « Quelle assurance pour voiture sans permis choisir ? »
 *   (mise à jour le 27/07/2026)
 *
 * Volontairement ABSENTS (non confirmés au niveau primaire, décision du
 * 2026-09-21) : vitesse du quadricycle lourd, règlement (UE) 168/2013 (EUR-Lex
 * illisible), parc de « 282 560 » véhicules (question parlementaire sans source
 * de données), situation des titulaires d'un AM obtenu avant mars 2024.
 *
 * Réserves : les conditions décrites pour Direct Assurance et Groupama sont
 * celles de ces assureurs, pas des règles valables pour tous les contrats.
 */

const SRC = {
  interieur: { label: "Ministère de l'Intérieur, réponse à la question écrite n° 07151 du Sénat (17 septembre 2026)", href: "https://www.senat.fr/questions/base/2025/qSEQ251207151.html" },
  spAM: { label: "service-public.gouv.fr, BSR / permis AM (vérifiée le 10 juin 2025)", href: "https://www.service-public.gouv.fr/particuliers/vosdroits/F2890" },
  spPermis: { label: "service-public.gouv.fr, quels permis selon le véhicule (vérifiée le 10 juin 2025)", href: "https://www.service-public.gouv.fr/particuliers/vosdroits/F12096" },
  spB1: { label: "service-public.gouv.fr, permis B1 (vérifiée le 26 mai 2025)", href: "https://www.service-public.gouv.fr/particuliers/vosdroits/F2833" },
  spCT: { label: "service-public.gouv.fr, contrôle technique catégorie L (vérifiée le 1er janvier 2026)", href: "https://www.service-public.gouv.fr/particuliers/vosdroits/F37538" },
  r221: { label: "Code de la route, article R221-5 (Légifrance)", href: "https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000037411514" },
  r311: { label: "Code de la route, article R311-1 (Légifrance)", href: "https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000045025478" },
  arrete: { label: "Arrêté du 23 octobre 2023 relatif au contrôle technique des véhicules de catégorie L (Légifrance)", href: "https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000048242538" },
  l211: { label: "Code des assurances, article L211-1 (Légifrance)", href: "https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000048523650" },
  l324: { label: "Code de la route, article L324-2 (Légifrance)", href: "https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000033460260" },
  aaa: { label: "AAA-Data, Intelligence Auto n° 80 (16 avril 2025)", href: "https://www.aaa-data.fr/actualites/intelligence-auto-n80-pourquoi-les-voitures-sans-permis-connaissent-un-debut-d-annee-difficile/" },
  direct: { label: "Direct Assurance, assurance voiture sans permis (page consultée le 21 septembre 2026)", href: "https://www.direct-assurance.fr/assurance-auto/assurance-sans-permis" },
  groupama: { label: "Groupama, quelle assurance pour voiture sans permis (mise à jour le 27 juillet 2026)", href: "https://www.groupama.fr/assurance-auto/conseils/assurance-voiture-sans-permis/" },
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
const TH = "text-left p-3 font-semibold text-foreground text-sm bg-muted/50 align-top";
const TD = "p-3 text-sm text-muted-foreground align-top border-t border-border";
const TDC = `${TD} text-center`;

export const SansPermisHowItWorks = () => (
  <section className="max-w-4xl mx-auto mb-12" aria-labelledby="sp-howto-title">
    <h2 id="sp-howto-title" className={H2}>Comment comparer son assurance voiture sans permis en 4 étapes</h2>
    <ol className="space-y-3">
      {SANS_PERMIS_HOWTO_STEPS.map((s, i) => (
        <li key={s.name} className="flex gap-3">
          <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-bold">{i + 1}</span>
          <p className="text-muted-foreground leading-relaxed">
            <strong className="text-foreground">{s.name}.</strong> {s.text}
          </p>
        </li>
      ))}
    </ol>
  </section>
);

export const SansPermisReglementation = () => (
  <section className="max-w-4xl mx-auto mb-12" aria-labelledby="sp-regle-title">
    <h2 id="sp-regle-title" className={H2}>Voiture sans permis : ce que dit la réglementation</h2>
    <p className={P}>
      Ces repères viennent de textes et de pages officielles, citées sous la section. Ils décrivent la règle générale : pour votre situation précise, référez-vous aux textes cités et à votre contrat.
    </p>

    <h3 className={H3}>Un quadricycle léger à moteur</h3>
    <p className={P}>
      Selon le ministère de l'Intérieur, les véhicules dits « sans permis » sont des quadricycles légers à moteur de catégorie L6e, définis à l'article R. 311-1 du Code de la route. Leur vitesse est limitée à 45 km/h et leur puissance ne peut excéder 6 kW.
    </p>

    <h3 className={H3}>Qui peut conduire, et à partir de quel âge</h3>
    <ul className={UL}>
      <li>
        <strong className="text-foreground">Permis AM.</strong> Selon service-public.gouv.fr, le permis AM (ancien brevet de sécurité routière) s'obtient à partir de 14 ans. Il comporte une option « quadricycle léger à moteur » (par exemple une voiturette) et une option « cyclomoteur ». La formation pratique dure au minimum 8 heures, sur au moins 2 jours.
      </li>
      <li>
        <strong className="text-foreground">Formation.</strong> Le ministère de l'Intérieur précise que la formation comprend une partie théorique validée par l'attestation scolaire de sécurité routière (ASSR) ou l'attestation de sécurité routière (ASR), et huit heures de pratique adaptée à la conduite d'un quadricycle léger.
      </li>
      <li>
        <strong className="text-foreground">Autre permis.</strong> service-public.gouv.fr indique que le permis AM ou n'importe quelle catégorie de permis de conduire permet de conduire un quadricycle léger à moteur.
      </li>
      <li>
        <strong className="text-foreground">Nés avant 1988.</strong> Les personnes nées avant le 1er janvier 1988 n'ont pas besoin de titre de conduite pour conduire un quadricycle léger à moteur (service-public.gouv.fr ; ministère de l'Intérieur).
      </li>
    </ul>

    <h3 className={H3}>À ne pas confondre : le quadricycle lourd</h3>
    <p className={P}>
      Le quadricycle lourd à moteur (catégorie L7e) n'est pas une voiture « sans permis » : il exige un permis, notamment le permis B1, accessible à partir de 16 ans (service-public.gouv.fr ; Code de la route, article R221-5).
    </p>
    <Sources keys={["interieur", "spAM", "spPermis", "spB1", "r221", "r311"]} />
  </section>
);

export const SansPermisControleTechnique = () => (
  <section className="max-w-4xl mx-auto mb-12" aria-labelledby="sp-ct-title">
    <h2 id="sp-ct-title" className={H2}>Contrôle technique d'une voiture sans permis</h2>
    <p className={P}>
      Les véhicules de catégorie L, dont les quadricycles légers à moteur, sont soumis à un contrôle technique obligatoire. Selon l'arrêté du 23 octobre 2023 (article 43, entré en vigueur le 15 avril 2024), le calendrier du premier contrôle dépend de la date de première immatriculation :
    </p>
    <ul className={UL}>
      <li>avant le 1er janvier 2017 : au plus tard le 31 décembre 2024 ;</li>
      <li>du 1er janvier 2017 au 31 décembre 2019 : en 2025 ;</li>
      <li>du 1er janvier 2020 au 31 décembre 2021 : en 2026 ;</li>
      <li>à partir du 1er janvier 2022 : selon l'article R. 323-27 du Code de la route, soit, d'après service-public.gouv.fr, dans les 6 mois avant le 5e anniversaire de la première mise en circulation.</li>
    </ul>
    <p className={P}>
      Pour les véhicules mis en circulation avant fin 2021, l'arrêté prévoit que le contrôle peut être réalisé jusqu'à quatre mois après la date anniversaire de la première mise en circulation, dans la limite du 31 décembre de l'année prévue. Selon service-public.gouv.fr, les contrôles suivants ont lieu tous les 3 ans.
    </p>
    <Sources keys={["arrete", "spCT"]} />
  </section>
);

export const SansPermisAssuranceObligatoire = () => (
  <section className="max-w-4xl mx-auto mb-12" aria-labelledby="sp-oblig-title">
    <h2 id="sp-oblig-title" className={H2}>Assurance obligatoire : ce que dit la loi</h2>
    <p className={P}>
      L'article L211-1 du Code des assurances (version en vigueur depuis le 8 décembre 2023) impose à toute personne dont la responsabilité civile peut être engagée en raison de dommages subis par des tiers, dans lesquels un véhicule est impliqué, d'être couverte par une assurance garantissant cette responsabilité pour faire circuler ce véhicule. Le texte définit le véhicule comme tout véhicule terrestre à moteur : une voiture sans permis en est un.
    </p>

    <h3 className={H3}>Sanction en cas de défaut d'assurance</h3>
    <p className={P}>
      L'article L324-2 du Code de la route (version en vigueur depuis le 20 août 2026) punit de 3 750 euros d'amende le fait, y compris par négligence, de mettre ou de maintenir en circulation un véhicule terrestre à moteur sans être couvert par une assurance de responsabilité civile conforme à l'article L211-1. Le même article prévoit des peines complémentaires, par exemple la suspension ou l'annulation du permis de conduire, ou la confiscation du véhicule.
    </p>
    <Sources keys={["l211", "l324"]} />
  </section>
);

type Cell = "inclus" | "non" | "option" | string;

const GARANTIES: { name: string; cells: [Cell, Cell, Cell, Cell] }[] = [
  { name: "Responsabilité civile (dommages causés à autrui)", cells: ["inclus", "inclus", "inclus", "inclus"] },
  { name: "Défense pénale et recours", cells: ["inclus", "inclus", "inclus", "inclus"] },
  { name: "Garantie personnelle du conducteur", cells: ["Incluse (plafond étendu en option)", "Incluse (plafond étendu en option)", "Incluse (plafond étendu en option)", "Incluse, avec un plafond d'indemnisation plus élevé"] },
  { name: "Assistance 24 h/24, 7 j/7", cells: ["inclus", "inclus", "inclus", "inclus"] },
  { name: "Véhicule de prêt pendant les réparations (garage partenaire)", cells: ["inclus", "inclus", "inclus", "inclus"] },
  { name: "Vol et tentative de vol", cells: ["non", "inclus", "inclus", "inclus"] },
  { name: "Incendie (vandalisme compris)", cells: ["non", "inclus", "inclus", "inclus"] },
  { name: "Bris de glace", cells: ["non", "inclus", "inclus", "inclus"] },
  { name: "Tempêtes, catastrophes naturelles et technologiques, attentats", cells: ["non", "inclus", "inclus", "inclus"] },
  { name: "Indemnisation en valeur à neuf", cells: ["non", "Incluse, durée limitée", "Incluse, durée limitée", "Incluse, durée plus longue"] },
  { name: "Dommages tous accidents (vandalisme compris)", cells: ["non", "non", "inclus", "inclus"] },
  { name: "Bris de glace étendu (optiques, toit) et contenu du véhicule", cells: ["non", "non", "non", "inclus"] },
  { name: "Assistance étendue (panne à 0 km, clés, véhicule électrique) et véhicule de prêt étendu", cells: ["option", "option", "option", "inclus"] },
];

const cellText = (c: Cell) => (c === "inclus" ? "Incluse" : c === "non" ? "Non incluse" : c === "option" ? "En option" : c);

export const SansPermisGarantiesTable = () => (
  <section className="max-w-4xl mx-auto mb-12" aria-labelledby="sp-garanties-title">
    <h2 id="sp-garanties-title" className={H2}>Que couvrent les formules d'une assurance voiture sans permis ?</h2>
    <p className={P}>
      Chaque assureur définit ses propres formules : leur nom, leur contenu et leurs options changent d'un contrat à l'autre. Ce tableau reprend, à titre d'exemple et sans aucun montant, les principales lignes de la grille que publie Direct Assurance pour ses quatre formules (page consultée le 21 septembre 2026, sans date de mise à jour affichée). Ce n'est ni une règle générale ni un comparatif : votre contrat fait foi.
    </p>
    <p className="md:hidden text-xs text-muted-foreground mb-2">Faites défiler le tableau horizontalement pour voir toutes les colonnes.</p>
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full min-w-[640px] border-collapse">
        <caption className="sr-only">Garanties des quatre formules voiture sans permis de Direct Assurance</caption>
        <thead>
          <tr>
            <th scope="col" className={TH}>Garantie</th>
            <th scope="col" className={`${TH} text-center`}>Tiers</th>
            <th scope="col" className={`${TH} text-center`}>Tiers Maxi</th>
            <th scope="col" className={`${TH} text-center`}>Tous Risques</th>
            <th scope="col" className={`${TH} text-center`}>Tous Risques Maxi</th>
          </tr>
        </thead>
        <tbody>
          {GARANTIES.map((g) => (
            <tr key={g.name}>
              <th scope="row" className={`${TD} font-medium text-foreground text-left`}>{g.name}</th>
              {g.cells.map((c, i) => (
                <td key={i} className={TDC}>{cellText(c)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <p className={`${P} mt-4`}>
      Selon Direct Assurance, la garantie de responsabilité civile ne prend pas en charge les dommages corporels du conducteur en cas d'accident responsable : c'est l'objet de la garantie personnelle du conducteur. Groupama indique de son côté que toutes ses formules incluent la garantie du conducteur et une solution de dépannage ou de remorquage 24 h/24. Les garanties, plafonds et franchises exacts figurent dans les conditions générales de chaque contrat.
    </p>
    <Sources keys={["direct", "groupama"]} />
  </section>
);

export const SansPermisMarche = () => (
  <section className="max-w-4xl mx-auto mb-12" aria-labelledby="sp-marche-title">
    <h2 id="sp-marche-title" className={H2}>Marché des voitures sans permis : ce que disent les chiffres</h2>
    <p className={P}>
      Selon AAA-Data (Intelligence Auto n° 80, 16 avril 2025), les immatriculations de voitures sans permis neuves sont passées de 13 376 en 2019 à 26 238 en 2023, puis à 31 714 en 2024, soit environ +137 % entre 2019 et 2024.
    </p>
    <p className={P}>
      La même publication relève toutefois un coup de frein au premier trimestre 2025 (-29 %). La hausse de 2019 à 2024 ne permet donc pas d'affirmer que le marché continue de croître.
    </p>
    <p className={P}>
      Ces données portent sur les immatriculations de véhicules neufs, pas sur le nombre de voitures sans permis en circulation.
    </p>
    <Sources keys={["aaa"]} />
  </section>
);

export const SansPermisSourcesNote = () => (
  <Card className="p-4 md:p-5 bg-muted/30 max-w-4xl mx-auto mb-12">
    <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
      <strong className="text-foreground">Sources consultées le 21 septembre 2026.</strong> Les textes de loi ont été lus sur Légifrance le même jour. Les garanties décrites sont celles de Direct Assurance et de Groupama, pas des règles valables pour tous les contrats. Les pages de sources sont publiques, susceptibles d'évoluer : votre contrat et les textes en vigueur font foi.
    </p>
  </Card>
);
