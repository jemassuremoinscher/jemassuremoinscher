import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { VELO_HOWTO_STEPS } from "@/data/veloHowToSteps";

/**
 * Sections de fond de /assurance-velo, rédigées le 2026-09-20 à partir de
 * sources consultées le même jour (aucun chiffre de prix, aucun plafond chiffré :
 * les fourchettes de l'ancienne FAQ n'avaient pas de source primaire).
 *
 * Sources (toutes paraphrasées, jamais recopiées) :
 * - MAIF, "Mon vélo est-il couvert par mon assurance habitation ?" (màj 10/12/2025)
 * - MAIF, "Vol de vélo : quelle prise en charge par l'assurance ?" (màj 14/09/2026)
 * - MAIF, "Antivol pour vélo électrique : lequel choisir ?" (màj 17/03/2024)
 * - MAIF, "Le marquage vélo est-il obligatoire ?" (màj 24/05/2023)
 * - Ministère de l'Écologie, "Marquage et identification des vélos" (màj 12/08/2025)
 * - Décret n° 2020-1439 du 23 novembre 2020 (Légifrance)
 * - Code des assurances, art. L113-2 (version en vigueur depuis le 01/04/2018)
 * - FUB, commission antivol ; Sold Secure, "Ratings explained"
 *
 * Réserves : Légifrance est derrière un contrôle anti-robot, les textes L113-2
 * et du décret ont été lus via un outil de lecture web (à recontrôler). Les
 * sites officiels SRA et ART étaient inaccessibles : ces labels ne sont
 * décrits que tels que MAIF les cite. Les conditions décrites sont celles d'un
 * assureur (MAIF), pas des règles valables pour tous les contrats.
 */

const SRC = {
  maifHabitation: { label: "MAIF, vélo et assurance habitation (màj 10 décembre 2025)", href: "https://www.maif.fr/habitation/guide-assurance-habitation/assurance-velo" },
  maifVol: { label: "MAIF, vol de vélo (màj 14 septembre 2026)", href: "https://www.maif.fr/vehicule-mobilite/guide-assurance-velo/vol-velo" },
  maifAntivol: { label: "MAIF, choisir un antivol (màj mars 2024)", href: "https://www.maif.fr/vehicule-mobilite/guide-assurance-velo/antivol" },
  maifMarquage: { label: "MAIF, marquage vélo (màj mai 2023)", href: "https://www.maif.fr/vehicule-mobilite/guide-assurance-velo/marquage-velo" },
  ecologie: { label: "Ministère de l'Écologie, marquage et identification des vélos (màj 12 août 2025)", href: "https://www.ecologie.gouv.fr/politiques-publiques/identification-cycles" },
  decret: { label: "Décret n° 2020-1439 du 23 novembre 2020 (Légifrance)", href: "https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000042558926" },
  l113: { label: "Code des assurances, article L113-2 (Légifrance)", href: "https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000035731302" },
  fub: { label: "FUB, commission antivol", href: "https://www.fub.fr/moi-velo/ma-securite/equipement/antivols/commission-antivol" },
  soldSecure: { label: "Sold Secure, présentation des grades", href: "https://soldsecure.com/ratings" },
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
const TH = "text-left p-3 font-semibold text-foreground text-sm bg-muted/50 align-top";
const TD = "p-3 text-sm text-muted-foreground align-top border-t border-border";

export const VeloHowItWorks = () => (
  <section className="max-w-4xl mx-auto mb-12" aria-labelledby="velo-howto-title">
    <h2 id="velo-howto-title" className={H2}>Comment vérifier sa garantie vol de vélo en 4 étapes</h2>
    <ol className="space-y-3">
      {VELO_HOWTO_STEPS.map((s, i) => (
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

export const VeloComparisonTable = () => (
  <section className="max-w-4xl mx-auto mb-12" aria-labelledby="velo-compare-title">
    <h2 id="velo-compare-title" className={H2}>Assurance habitation ou contrat vélo dédié : ce qui change</h2>
    <p className={P}>
      Il n'existe pas de grille unique : chaque contrat fixe ses propres plafonds, franchises et conditions. Ce tableau résume ce que disent les sources citées, sans aucun chiffre de prix ni de plafond. La référence reste toujours votre contrat.
    </p>
    <p className="md:hidden text-xs text-muted-foreground mb-2">Faites défiler le tableau horizontalement pour voir toutes les colonnes.</p>
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full min-w-[640px] border-collapse">
        <thead>
          <tr>
            <th scope="col" className={TH}>Critère</th>
            <th scope="col" className={TH}>Garantie vol de l'assurance habitation</th>
            <th scope="col" className={TH}>Contrat vélo dédié</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row" className={`${TD} font-medium text-foreground text-left`}>Où le vélo est couvert</th>
            <td className={TD}>Le vol à l'intérieur du logement est garanti par la plupart des contrats, parfois sous conditions. Hors du domicile, la protection se renforce en ajustant le contrat.</td>
            <td className={TD}>Prévu pour protéger aussi le vélo hors du domicile ; l'étendue exacte varie selon le contrat.</td>
          </tr>
          <tr>
            <th scope="row" className={`${TD} font-medium text-foreground text-left`}>Stationnement et antivol</th>
            <td className={TD}>Souvent : vélo dans un local fermé et sécurisé (cave, garage privatif), ou protégé par un antivol et attaché à un point fixe.</td>
            <td className={TD}>Chez certains assureurs, comme MAIF, un antivol homologué est obligatoire : sans lui, pas d'indemnisation.</td>
          </tr>
          <tr>
            <th scope="row" className={`${TD} font-medium text-foreground text-left`}>Base d'indemnisation</th>
            <td className={TD}>Définie par le contrat : plafond, franchise et éventuelle décote liée à l'âge du vélo sont à vérifier.</td>
            <td className={TD}>Selon MAIF : âge du vélo (décote d'année en année), franchise du contrat et plafond de remboursement.</td>
          </tr>
          <tr>
            <th scope="row" className={`${TD} font-medium text-foreground text-left`}>Autres garanties</th>
            <td className={TD}>La responsabilité civile vie privée couvre en général les dommages causés à des tiers à vélo (à confirmer dans votre contrat).</td>
            <td className={TD}>Selon le contrat : casse, accessoires, assistance. MAIF cite par exemple le vol, la casse et les accessoires.</td>
          </tr>
          <tr>
            <th scope="row" className={`${TD} font-medium text-foreground text-left`}>Quand c'est le plus adapté</th>
            <td className={TD}>À vérifier en premier : cette garantie est déjà incluse dans beaucoup de contrats.</td>
            <td className={TD}>Selon MAIF, plus adapté lorsque la valeur d'achat du vélo est élevée.</td>
          </tr>
        </tbody>
      </table>
    </div>
    <Sources keys={["maifHabitation", "maifVol"]} />
  </section>
);

export const VeloTypeAndValue = () => (
  <section className="max-w-4xl mx-auto mb-12" aria-labelledby="velo-type-title">
    <h2 id="velo-type-title" className={H2}>Type de vélo et valeur : ce qui change vraiment</h2>

    <h3 className={H3}>Selon le type de vélo</h3>
    <ul className="space-y-2 mb-3 text-muted-foreground leading-relaxed">
      <li>
        <strong className="text-foreground">Vélo à assistance électrique (VAE).</strong> Lorsque l'assistance se déclenche en pédalant, sans poignée d'accélérateur, et se coupe à 25 km/h, le VAE est assimilé à un vélo classique et ne nécessite pas d'assurance spécifique. C'est donc surtout le plafond de la garantie vol qu'il faut vérifier.
      </li>
      <li>
        <strong className="text-foreground">Speed-bike (plus de 25 km/h).</strong> Régime à part, avec une assurance obligatoire : voir la section dédiée plus bas.
      </li>
      <li>
        <strong className="text-foreground">Cargo et pliant.</strong> Notre formulaire les regroupe avec le speed-bike (usage spécifique ou plus de 25 km/h). Un cargo utilisé pour livrer relève d'un usage professionnel, à déclarer à l'assureur (voir la FAQ).
      </li>
    </ul>

    <h3 className={H3}>Selon la valeur du vélo</h3>
    <p className={P}>
      Notre formulaire vous demande dans quelle tranche se situe votre vélo (moins de 800 €, de 800 à 2 500 €, plus de 2 500 €) afin que le conseiller vérifie l'adéquation avec votre contrat. Ces tranches sont les nôtres : ce ne sont pas des seuils légaux ni des seuils d'assureurs.
    </p>
    <p className={P}>
      Ce qui compte réellement, c'est le plafond de remboursement fixé par le contrat, la franchise et la décote liée à l'âge du vélo. Selon MAIF, un contrat spécifique au vélo est plus adapté lorsque sa valeur d'achat est élevée. Conservez la facture du vélo et celle de l'antivol, ainsi que des photos : ce sont des pièces demandées lors d'une déclaration de vol.
    </p>
    <Sources keys={["maifHabitation", "maifVol"]} />
  </section>
);

export const VeloAntivolStationnement = () => (
  <section className="max-w-4xl mx-auto mb-12" aria-labelledby="velo-antivol-title">
    <h2 id="velo-antivol-title" className={H2}>Stationnement et antivol : ce que regardent les assureurs</h2>
    <p className={P}>
      Le lieu où vous garez votre vélo et l'antivol utilisé peuvent conditionner la garantie vol. C'est pourquoi notre formulaire vous demande si votre vélo dort dans un garage ou local fermé, un local vélo ou une cave, ou dans la rue.
    </p>
    <ul className="space-y-2 mb-3 text-muted-foreground leading-relaxed">
      <li>
        <strong className="text-foreground">À domicile.</strong> Selon MAIF, la garantie vol de l'habitation impose généralement que le vélo soit dans un lieu fermé et sécurisé (cave, garage privatif), ou protégé par un antivol et attaché à un point fixe.
      </li>
      <li>
        <strong className="text-foreground">Dans la rue.</strong> Chez certains assureurs, comme MAIF, un antivol homologué est obligatoire pour être indemnisé en cas de vol.
      </li>
    </ul>

    <h3 className={H3}>Les labels d'antivol cités par les assureurs</h3>
    <p className="md:hidden text-xs text-muted-foreground mb-2">Faites défiler le tableau horizontalement pour voir toutes les colonnes.</p>
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full min-w-[480px] border-collapse">
        <thead>
          <tr>
            <th scope="col" className={TH}>Label</th>
            <th scope="col" className={TH}>Ce que disent les sources</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row" className={`${TD} font-medium text-foreground text-left`}>FUB</th>
            <td className={TD}>La Fédération française des usagers de la bicyclette classe les antivols testés en deux niveaux, « 1 roue » et « 2 roues ». Le niveau « 2 roues » est présenté comme le minimum exigé par les assureurs (FUB) ou par certaines compagnies (MAIF).</td>
          </tr>
          <tr>
            <th scope="row" className={`${TD} font-medium text-foreground text-left`}>SRA</th>
            <td className={TD}>Homologation soumise à un cahier des charges strict, avec des tests en laboratoire et des contrôles en cours de vie des produits (selon MAIF).</td>
          </tr>
          <tr>
            <th scope="row" className={`${TD} font-medium text-foreground text-left`}>ART</th>
            <td className={TD}>Label cité par MAIF parmi les antivols acceptés, à partir du niveau 2.</td>
          </tr>
          <tr>
            <th scope="row" className={`${TD} font-medium text-foreground text-left`}>Sold Secure</th>
            <td className={TD}>Autre label existant, en quatre grades (Diamond, Gold, Silver, Bronze). Vérifiez qu'il figure parmi ceux acceptés par votre assureur.</td>
          </tr>
        </tbody>
      </table>
    </div>
    <p className={`${P} mt-3`}>
      Quel label et quel niveau sont acceptés varie d'un assureur à l'autre : consultez la liste dans les conditions générales de votre contrat avant d'acheter un antivol.
    </p>

    <h3 className={H3}>Bien attacher son vélo</h3>
    <p className={P}>
      Selon MAIF : attachez le cadre à un point fixe suffisamment haut pour qu'on ne puisse pas soulever le vélo ; l'antivol en U rigide est présenté comme le plus efficace contre le vol de VAE ; pour une chaîne, des maillons d'au moins 8 mm d'épaisseur ; et deux antivols en U dans les grandes villes ou la nuit.
    </p>

    <h3 className={H3}>Faire marquer son vélo</h3>
    <p className={P}>
      Le marquage attribue au vélo un numéro unique enregistré dans un fichier national, ce qui permet de restituer un vélo retrouvé à son propriétaire. L'obligation pèse sur les vendeurs professionnels, pas sur vous : vélos neufs identifiés depuis le 1er janvier 2021, vélos d'occasion vendus par un commerçant depuis le 1er juillet 2021. Entre particuliers, le marquage n'est pas obligatoire, mais vous pouvez faire marquer votre vélo volontairement ; Bicycode est l'un des opérateurs agréés.
    </p>
    <p className={P}>
      Notre article sur les antivols, le marquage et le traçage :{" "}
      <Link to="/blog/velos-cargos-vae-protection-vol-urbain" className="font-semibold text-primary hover:underline">
        vélos cargos et VAE, protection contre le vol urbain →
      </Link>
    </p>
    <Sources keys={["maifHabitation", "maifVol", "maifAntivol", "fub", "soldSecure", "ecologie", "decret", "maifMarquage"]} />
  </section>
);

export const VeloTheftSteps = () => (
  <section className="max-w-4xl mx-auto mb-12" aria-labelledby="velo-vol-title">
    <h2 id="velo-vol-title" className={H2}>Que faire en cas de vol de vélo</h2>
    <ol className="space-y-3 text-muted-foreground leading-relaxed">
      <li className="flex gap-3">
        <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-bold">1</span>
        <p><strong className="text-foreground">Portez plainte</strong> au commissariat le plus proche, ou déposez une pré-plainte en ligne.</p>
      </li>
      <li className="flex gap-3">
        <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-bold">2</span>
        <p>
          <strong className="text-foreground">Déclarez le vol à votre assureur</strong> dans le délai prévu par votre contrat. La loi (article L113-2 du Code des assurances) interdit que ce délai soit inférieur à deux jours ouvrés en cas de vol ; les contrats prévoient souvent davantage (5 jours ouvrés pour le contrat vélo de MAIF). Ne tardez pas : un retard ne peut en principe vous être opposé que si l'assureur démontre qu'il lui a causé un préjudice, mais mieux vaut ne pas s'y fier.
        </p>
      </li>
      <li className="flex gap-3">
        <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-bold">3</span>
        <p>
          <strong className="text-foreground">Rassemblez les pièces</strong> : date, heure et circonstances du vol, numéro de contrat, copie du dépôt de plainte, factures du vélo et de son antivol, photos si vous en avez.
        </p>
      </li>
      <li className="flex gap-3">
        <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-bold">4</span>
        <p>
          <strong className="text-foreground">Comprenez l'indemnisation</strong> : elle tient compte de l'âge du vélo, de la franchise et du plafond du contrat, et suppose de respecter les conditions de la garantie (par exemple l'antivol homologué).
        </p>
      </li>
    </ol>
    <Sources keys={["maifVol", "l113"]} />
  </section>
);

export const VeloSourcesNote = () => (
  <section className="max-w-4xl mx-auto mb-12">
    <Card className="p-4 md:p-5 bg-muted/30">
      <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
        <strong className="text-foreground">Sources consultées les 20 et 21 septembre 2026.</strong> Les conditions décrites pour MAIF sont celles de cet assureur, pas des règles valables pour tous les contrats. Les fiches de sources sont des pages publiques, susceptibles d'évoluer : votre contrat fait toujours foi.
      </p>
    </Card>
  </section>
);
