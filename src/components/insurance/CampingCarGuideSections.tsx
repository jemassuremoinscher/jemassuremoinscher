import { Card } from "@/components/ui/card";
import { CAMPING_CAR_HOWTO_STEPS } from "@/data/campingCarHowToSteps";

/**
 * Sections de fond de /assurance-camping-car, rédigées le 2026-09-22 à partir
 * de sources primaires lues les 21 et 22 septembre 2026 (aucun chiffre de
 * prix, aucun plafond chiffré, aucun montant de garantie : uniquement des
 * règles attribuées à leur source).
 *
 * Sources (toutes paraphrasées, jamais recopiées) :
 * - Ministère de l'Intérieur (et outre-mer), réponses aux questions écrites
 *   de l'Assemblée nationale n° 6151 (26/03/2013) et n° 8735 (07/11/2023)
 * - Légifrance : Code de la route R221-4 (en vigueur 29/04/2016), L324-2 (en
 *   vigueur 20/08/2026) ; Code des assurances L211-1 (en vigueur 08/12/2023),
 *   L113-2 (en vigueur 01/04/2018), L113-4 (en vigueur 01/05/1990), L113-8
 *   (en vigueur 08/01/1981), L113-9 (en vigueur 21/07/1976) ; Code général
 *   des collectivités territoriales L2213-4-1 (en vigueur 25/08/2021) ;
 *   décret n° 2025-1180 et arrêté du 8 décembre 2025 (JORF)
 * - Conseil constitutionnel, décision n° 2026-903 DC du 21 mai 2026
 * - service-public.gouv.fr, F2878 « Contrôle technique d'une voiture
 *   (catégorie M1) » (vérifiée 01/01/2026, cite nommément le camping-car de
 *   3,5 t maximum) ; page d'actualité A18705 (11/12/2025)
 * - Mieux respirer en ville (site gouvernemental, page non datée) ;
 *   ecologie.gouv.fr, certificats qualité de l'air Crit'Air (mise à jour
 *   02/02/2026) ; ville de Paris, page ZFE (mise à jour 30/12/2025)
 * - Groupama : page réglementation camping-car (mise à jour 16/06/2026) et
 *   page assurance camping-car (grille de garanties, sans date affichée)
 * - Aquaverde Assurance, courtier : « Quelles garanties choisir pour assurer
 *   son camping-car ? » (publié 30/01/2025, modifié 11/06/2026)
 * - GAV Assurance, courtier : « Assurance camping-car : garanties, prix et
 *   conseils » (sans date affichée)
 *
 * Volontairement ABSENTS (non confirmés au niveau primaire, décision du
 * 2026-09-22) : que l'obligation d'assurance (L211-1) vise explicitement un
 * véhicule à l'arrêt ; la périodicité du contrôle technique au-delà de 3,5 t
 * (textes contradictoires ou incomplets) ; le nombre exact de villes en ZFE
 * et les critères détaillés des classes Crit'Air ; qu'un « avenant » soit
 * juridiquement obligatoire pour un usage résidence principale (absent des
 * sources lues).
 *
 * Réserves : les conditions décrites pour Groupama, Aquaverde et GAV
 * Assurance sont celles de ces sociétés, pas des règles valables pour tous
 * les contrats.
 */

const SRC = {
  interieur6151: { label: "Ministère de l'Intérieur, réponse à la question écrite n° 6151 (Assemblée nationale, 26 mars 2013)", href: "https://questions.assemblee-nationale.fr/q14/14-6151QE.htm" },
  interieur8735: { label: "Ministère de l'Intérieur et des outre-mer, réponse à la question écrite n° 8735 (Assemblée nationale, 7 novembre 2023)", href: "https://questions.assemblee-nationale.fr/q16/16-8735QE.htm" },
  r2214: { label: "Code de la route, article R221-4 (Légifrance)", href: "https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000032468236" },
  l211: { label: "Code des assurances, article L211-1 (Légifrance)", href: "https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000048523650" },
  l324: { label: "Code de la route, article L324-2 (Légifrance)", href: "https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000033460260" },
  l1132: { label: "Code des assurances, article L113-2 (Légifrance)", href: "https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000035731302" },
  l1134: { label: "Code des assurances, article L113-4 (Légifrance)", href: "https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006792030" },
  l1138: { label: "Code des assurances, article L113-8 (Légifrance)", href: "https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006792058" },
  l1139: { label: "Code des assurances, article L113-9 (Légifrance)", href: "https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006792066" },
  cgct: { label: "Code général des collectivités territoriales, article L2213-4-1 (Légifrance)", href: "https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000043976834" },
  conscstit: { label: "Conseil constitutionnel, décision n° 2026-903 DC du 21 mai 2026", href: "https://www.conseil-constitutionnel.fr/decision/2026/2026903DC.htm" },
  mrv: { label: "Mieux respirer en ville, ZFE françaises (site gouvernemental)", href: "https://mieuxrespirerenville.gouv.fr/fiches-thematique/se-deplacer/zfe-francaises" },
  ecologieCritair: { label: "Ministère de la Transition écologique, certificats qualité de l'air Crit'Air (mise à jour le 2 février 2026)", href: "https://www.ecologie.gouv.fr/politiques-publiques/certificats-qualite-lair-critair" },
  parisZfe: { label: "Ville de Paris, la zone à faibles émissions (ZFE) (mise à jour le 30 décembre 2025)", href: "https://www.paris.fr/pages/la-zone-a-faibles-emissions-zfe-pour-lutter-contre-la-pollution-de-l-air-16799" },
  spCT: { label: "service-public.gouv.fr, contrôle technique d'une voiture, catégorie M1 (vérifiée le 1er janvier 2026)", href: "https://www.service-public.gouv.fr/particuliers/vosdroits/F2878" },
  ctA18705: { label: "service-public.gouv.fr, un contrôle technique renforcé à partir de 2026 (11 décembre 2025)", href: "https://www.service-public.gouv.fr/particuliers/actualites/A18705" },
  groupamaLegislation: { label: "Groupama, réglementation camping-car (mise à jour le 16 juin 2026)", href: "https://www.groupama.fr/assurance-camping-car/conseils/legislation/" },
  groupamaAssurance: { label: "Groupama, assurance camping-car (grille de garanties)", href: "https://www.groupama.fr/assurance-camping-car/" },
  aquaverde: { label: "Aquaverde Assurance, quelles garanties choisir pour assurer son camping-car (publié le 30 janvier 2025, modifié le 11 juin 2026)", href: "https://www.aquaverde-assurance.fr/garantie-assurance-camping-car" },
  gav: { label: "GAV Assurance, assurance camping-car : garanties, prix et conseils", href: "https://www.gav-assurance.fr/assurance-camping-car-garanties-prix" },
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

export const CampingCarHowItWorks = () => (
  <section className="max-w-4xl mx-auto mb-12" aria-labelledby="cc-howto-title">
    <h2 id="cc-howto-title" className={H2}>Comment comparer son assurance camping-car en 4 étapes</h2>
    <ol className="space-y-3">
      {CAMPING_CAR_HOWTO_STEPS.map((s, i) => (
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

export const CampingCarPermis = () => (
  <section className="max-w-4xl mx-auto mb-12" aria-labelledby="cc-permis-title">
    <h2 id="cc-permis-title" className={H2}>Quel permis pour conduire un camping-car ?</h2>
    <p className={P}>
      Le permis nécessaire dépend du poids total autorisé en charge (PTAC) du véhicule, indiqué sur la carte grise.
    </p>
    <ul className={UL}>
      <li>
        <strong className="text-foreground">Jusqu'à 3,5 tonnes : permis B.</strong> Le Code de la route (article R221-4) définit la catégorie B comme les véhicules dont le PTAC « n'excède pas 3,5 tonnes ». La plupart des camping-cars profilés, capucines et vans aménagés restent sous ce seuil.
      </li>
      <li>
        <strong className="text-foreground">De 3,5 à 7,5 tonnes : permis C1.</strong> L'article R221-4 définit la catégorie C1 comme les véhicules dont le PTAC est « supérieur à 3 500 kilogrammes sans excéder 7 500 kilogrammes ». Le ministère de l'Intérieur confirme, dans une réponse du 7 novembre 2023, que le titulaire du seul permis B « se trouve dans l'obligation de détenir la catégorie C1 » pour conduire un camping-car de plus de 3,5 t ; un examen restreint (« C1 code 97 ») existe, sans l'épreuve propre au transport professionnel.
      </li>
      <li>
        <strong className="text-foreground">Au-delà de 7,5 tonnes : permis C.</strong> Rare pour un camping-car, mais possible pour les plus gros intégraux.
      </li>
      <li>
        <strong className="text-foreground">Exception pour les permis B délivrés avant le 20 janvier 1975.</strong> Le ministère de l'Intérieur précise, dans une réponse du 26 mars 2013, que ces titulaires peuvent conduire « les véhicules affectés au transport de personnes comportant, outre le siège du conducteur, huit places assises au maximum et dont le poids total autorisé en charge excède 3 500 kg » : il faut faire ajouter la mention correspondante (code 79) sur son permis, en préfecture.
      </li>
    </ul>
    <Sources keys={["r2214", "interieur8735", "interieur6151"]} />
  </section>
);

export const CampingCarZFE = () => (
  <section className="max-w-4xl mx-auto mb-12" aria-labelledby="cc-zfe-title">
    <h2 id="cc-zfe-title" className={H2}>Zones à faibles émissions (ZFE) et vignette Crit'Air</h2>
    <p className={P}>
      L'instauration d'une zone à faibles émissions mobilité (ZFE-m) est obligatoire, depuis le 31 décembre 2024, dans toutes les agglomérations métropolitaines de plus de 150 000 habitants (Code général des collectivités territoriales, article L2213-4-1). Selon le site gouvernemental Mieux respirer en ville, 25 ZFE sont actuellement actives en France.
    </p>
    <p className={P}>
      Les restrictions varient d'une agglomération à l'autre. À titre d'exemple, les véhicules classés Crit'Air 3, 4, 5 et non classés ne peuvent plus circuler dans la Métropole du Grand Paris depuis le 1er janvier 2025 — et non janvier 2026, contrairement à ce qu'écrivent certains sites commerciaux. La ville de Paris précise toutefois qu'une « période pédagogique » a été prolongée jusqu'au 31 décembre 2026 : pendant cette période, aucune sanction n'est appliquée.
    </p>
    <p className={P}>
      La vignette Crit'Air est obligatoire pour circuler dans une ZFE, quel que soit le type de véhicule (ministère de la Transition écologique). Le Conseil constitutionnel a par ailleurs jugé, le 21 mai 2026, qu'un article de loi supprimant les ZFE était contraire à la Constitution pour un motif de procédure : les ZFE restent donc en vigueur.
    </p>
    <p className={P}>
      Le classement Crit'Air exact de votre camping-car (selon son PTAC, sa motorisation et sa date de première immatriculation) s'obtient sur <a href="https://www.certificat-air.gouv.fr" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">certificat-air.gouv.fr</a>.
    </p>
    <Sources keys={["cgct", "mrv", "parisZfe", "ecologieCritair", "conscstit"]} />
  </section>
);

export const CampingCarControleTechnique = () => (
  <section className="max-w-4xl mx-auto mb-12" aria-labelledby="cc-ct-title">
    <h2 id="cc-ct-title" className={H2}>Contrôle technique d'un camping-car</h2>
    <p className={P}>
      Pour un camping-car de 3,5 tonnes maximum (catégorie M1), service-public.gouv.fr confirme la même règle que pour une voiture particulière : le premier contrôle technique doit être réalisé dans les 6 mois avant le 4e anniversaire de la première mise en circulation, puis tous les 2 ans si le résultat est favorable.
    </p>
    <p className={P}>
      Depuis le 1er janvier 2026, un décret et un arrêté du 8 décembre 2025 ajoutent la vérification des campagnes de rappel constructeur : un rappel grave non traité est signalé sur le procès-verbal, et une contre-visite est obligatoire en cas d'airbag Takata classé « stop drive ». Cette évolution vise les véhicules de 3,5 tonnes maximum.
    </p>
    <p className={P}>
      Pour un camping-car de plus de 3,5 tonnes, la réglementation applicable diffère (véhicules dits « lourds ») et les textes consultés ne permettent pas d'affirmer une périodicité unique : renseignez-vous auprès d'un centre de contrôle technique agréé pour véhicules lourds.
    </p>
    <Sources keys={["spCT", "ctA18705"]} />
  </section>
);

export const CampingCarAssuranceObligatoire = () => (
  <section className="max-w-4xl mx-auto mb-12" aria-labelledby="cc-oblig-title">
    <h2 id="cc-oblig-title" className={H2}>Assurance obligatoire, y compris à l'arrêt</h2>
    <p className={P}>
      L'article L211-1 du Code des assurances impose à toute personne dont la responsabilité civile peut être engagée d'être couverte par une assurance garantissant cette responsabilité « pour faire circuler » son véhicule. Le texte ne détaille pas explicitement le cas d'un véhicule qui reste longtemps à l'arrêt (hivernage, stationnement prolongé) : par prudence, et selon Groupama, un camping-car doit rester assuré même pendant les périodes où il ne roule pas.
    </p>
    <h3 className={H3}>Sanction en cas de défaut d'assurance</h3>
    <p className={P}>
      L'article L324-2 du Code de la route punit de 3 750 euros d'amende le fait, y compris par négligence, de mettre ou de maintenir en circulation un véhicule terrestre à moteur sans être couvert par une assurance de responsabilité civile conforme à l'article L211-1, avec des peines complémentaires possibles (suspension du permis, confiscation du véhicule).
    </p>
    <Sources keys={["l211", "l324", "groupamaLegislation"]} />
  </section>
);

export const CampingCarUsageDeclare = () => (
  <section className="max-w-4xl mx-auto mb-12" aria-labelledby="cc-usage-title">
    <h2 id="cc-usage-title" className={H2}>Usage résidence principale ou prolongé : un point de vigilance</h2>
    <p className={P}>
      Le Code des assurances impose à l'assuré de répondre exactement aux questions de l'assureur et de déclarer, en cours de contrat, toute circonstance nouvelle qui aggrave le risque (article L113-2). En cas d'aggravation non déclarée, l'assureur peut résilier le contrat ou proposer une nouvelle prime (article L113-4).
    </p>
    <p className={P}>
      Deux régimes existent en cas de déclaration inexacte : le contrat n'est nul que si la réticence ou la fausse déclaration est intentionnelle et change l'appréciation du risque par l'assureur (article L113-8). Sans mauvaise foi établie, il n'y a pas de nullité, mais l'indemnité versée après sinistre est réduite proportionnellement à l'écart entre la prime payée et celle qui aurait dû l'être (article L113-9).
    </p>
    <p className={P}>
      Concrètement, selon GAV Assurance (courtier), un camping-car déclaré en usage « loisirs et vacances » n'est pas couvert de la même façon s'il sert de résidence principale plusieurs mois par an : au-delà de quatre mois par an, ce courtier recommande de déclarer un usage prolongé ou une résidence mobile, ce qui a un effet sur la prime. Chaque assureur fixe ses propres critères d'usage : vérifiez la déclaration d'usage de votre contrat avant de partir plusieurs mois.
    </p>
    <Sources keys={["l1132", "l1134", "l1138", "l1139", "gav"]} />
  </section>
);

type Cell = "inclus" | "non" | "option" | string;

const GROUPAMA_GARANTIES: { name: string; cells: [Cell, Cell, Cell] }[] = [
  { name: "Responsabilité civile, accidents corporels du conducteur, défense pénale et recours, assistance au véhicule et aux personnes", cells: ["inclus", "inclus", "inclus"] },
  { name: "Bris de glace, catastrophes naturelles et technologiques, attentats", cells: ["option", "inclus", "inclus"] },
  { name: "Incendie, événements climatiques, vol", cells: ["non", "inclus", "inclus"] },
  { name: "Dommages tous accidents et vandalisme", cells: ["non", "non", "inclus"] },
  { name: "Véhicule de remplacement en cas d'accident", cells: ["inclus", "inclus", "inclus"] },
  { name: "Indemnité journalière pour louer un véhicule de remplacement", cells: ["option", "option", "option"] },
  { name: "Assistance panne 0 km", cells: ["option", "option", "option"] },
  { name: "Contenu du véhicule", cells: ["non", "option", "option"] },
  { name: "Aménagements du véhicule", cells: ["non", "option", "option"] },
];

const cellText = (c: Cell) => (c === "inclus" ? "Incluse" : c === "non" ? "Non incluse" : c === "option" ? "En option" : c);

export const CampingCarGarantiesTable = () => (
  <section className="max-w-4xl mx-auto mb-12" aria-labelledby="cc-garanties-title">
    <h2 id="cc-garanties-title" className={H2}>Que couvrent les formules d'une assurance camping-car ?</h2>
    <p className={P}>
      Chaque assureur définit ses propres formules : leur nom, leur contenu et leurs options changent d'un contrat à l'autre. Ce tableau reprend, à titre d'exemple et sans aucun montant, les principales lignes de la grille que publie Groupama pour ses trois formules (page consultée le 22 septembre 2026 ; disponibilité et contenu « variables selon les Caisses régionales », précise Groupama). Ce n'est ni une règle générale ni un comparatif : votre contrat fait foi.
    </p>
    <p className="md:hidden text-xs text-muted-foreground mb-2">Faites défiler le tableau horizontalement pour voir toutes les colonnes.</p>
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full min-w-[560px] border-collapse">
        <caption className="sr-only">Garanties des trois formules camping-car de Groupama</caption>
        <thead>
          <tr>
            <th scope="col" className={TH}>Garantie</th>
            <th scope="col" className={`${TH} text-center`}>Mini (au tiers)</th>
            <th scope="col" className={`${TH} text-center`}>Eco (au tiers)</th>
            <th scope="col" className={`${TH} text-center`}>Confort (tous risques)</th>
          </tr>
        </thead>
        <tbody>
          {GROUPAMA_GARANTIES.map((g) => (
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
      Chez Aquaverde (courtier), les trois formules (Tiers, Tiers intermédiaire, Tous risques) suivent une logique voisine : responsabilité civile, garantie du conducteur, défense et recours sont incluses dans les trois ; bris de glace, vol, incendie et catastrophes naturelles commencent au Tiers intermédiaire ; les dommages tous accidents restent réservés au Tous risques. Une différence à noter : chez Aquaverde, l'assistance en cas de panne est incluse dès la formule Tiers, alors qu'elle est proposée en option dans les trois formules de Groupama. Les garanties, plafonds et franchises exacts figurent dans les conditions générales de chaque contrat.
    </p>
    <Sources keys={["groupamaAssurance", "aquaverde"]} />
  </section>
);

export const CampingCarSourcesNote = () => (
  <Card className="p-4 md:p-5 bg-muted/30 max-w-4xl mx-auto mb-12">
    <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
      <strong className="text-foreground">Sources consultées les 21 et 22 septembre 2026.</strong> Les textes de loi ont été lus sur Légifrance aux mêmes dates. Les garanties décrites sont celles de Groupama et d'Aquaverde, pas des règles valables pour tous les contrats. Les pages de sources sont publiques, susceptibles d'évoluer : votre contrat et les textes en vigueur font foi.
    </p>
  </Card>
);
