import { Card } from "@/components/ui/card";
import { DECENNALE_HOWTO_STEPS } from "@/data/decennaleHowToSteps";

/**
 * Sections de fond de /assurance-decennale, rédigées le 2026-09-22 à partir
 * de sources primaires lues le même jour (aucun chiffre de prix, aucun
 * plafond chiffré : uniquement des règles attribuées à leur source).
 *
 * Sources (toutes paraphrasées, jamais recopiées) :
 * - Légifrance : Code des assurances L241-1 (en vigueur 08/08/2015), L243-2
 *   (en vigueur 08/08/2015), L243-3 (peine confirmée lors du chantier
 *   précédent) ; Code civil 1792, 1792-1, 1792-4-1 (en vigueur 19/06/2008) ;
 *   loi n° 78-12 du 4 janvier 1978 (loi Spinetta)
 * - Cour de cassation, assemblée plénière, 12 juillet 1991, pourvoi
 *   n° 90-13.602, publié au bulletin (sous-traitant non lié au maître de
 *   l'ouvrage)
 * - SMABTP, « Assurance décennale des professionnels du BTP » (tableau des 4
 *   garanties légales de la construction, lu dans le HTML de la page le
 *   22 septembre 2026, sans date de mise à jour affichée)
 *
 * Point nouveau par rapport au texte précédent de la page : le sous-traitant
 * n'a pas d'obligation légale d'assurance décennale au titre de l'article
 * L241-1, car il n'est pas « constructeur » au sens de l'article 1792-1 (pas
 * de lien contractuel direct avec le maître de l'ouvrage). En pratique, les
 * entreprises principales l'exigent souvent quand même par contrat.
 *
 * Volontairement ABSENTS (non confirmés au niveau primaire, décision du
 * 2026-09-22) : les critères précis distinguant un élément d'équipement
 * dissociable d'un élément indissociable (jurisprudence non relue à la
 * source) ; tout délai chiffré de délivrance d'attestation.
 *
 * Réserves : le tableau des 4 garanties légales est celui publié par
 * SMABTP ; il décrit la réglementation générale, pas un contrat particulier.
 */

const SRC = {
  l2411: { label: "Code des assurances, article L241-1 (Légifrance)", href: "https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006795912" },
  spinetta: { label: "Loi n° 78-12 du 4 janvier 1978 relative à la responsabilité et à l'assurance dans le domaine de la construction (Légifrance)", href: "https://www.legifrance.gouv.fr/loda/id/JORFTEXT000000522720" },
  c1792: { label: "Code civil, article 1792 (Légifrance)", href: "https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006443502" },
  c17921: { label: "Code civil, article 1792-1 (Légifrance)", href: "https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006443512" },
  c179241: { label: "Code civil, article 1792-4-1 (Légifrance)", href: "https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000019017055" },
  assplen1991: { label: "Cour de cassation, assemblée plénière, 12 juillet 1991, pourvoi n° 90-13.602, publié au bulletin", href: "https://www.legifrance.gouv.fr/affichJuriJudi.do?idTexte=JURITEXT000007027156" },
  l2432: { label: "Code des assurances, article L243-2 (Légifrance)", href: "https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000031010272" },
  l2433: { label: "Code des assurances, article L243-3 (Légifrance)", href: "https://www.legifrance.gouv.fr/loda/article_lc/LEGIARTI000006796023" },
  smabtp: { label: "SMABTP, assurance décennale des professionnels du BTP (page consultée le 22 septembre 2026)", href: "https://www.smabtp.fr/sma/assurance/besoins/assurance-decennale" },
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

export const DecennaleHowItWorks = () => (
  <section className="max-w-4xl mx-auto mb-12" aria-labelledby="dc-howto-title">
    <h2 id="dc-howto-title" className={H2}>Comment comparer son assurance décennale en 4 étapes</h2>
    <ol className="space-y-3">
      {DECENNALE_HOWTO_STEPS.map((s, i) => (
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

export const DecennaleQuiEstConcerne = () => (
  <section className="max-w-4xl mx-auto mb-12" aria-labelledby="dc-concerne-title">
    <h2 id="dc-concerne-title" className={H2}>Qui doit souscrire une garantie décennale ?</h2>
    <p className={P}>
      Depuis la loi n° 78-12 du 4 janvier 1978 (dite loi Spinetta), l'article L241-1 du Code des assurances impose à « toute personne physique ou morale, dont la responsabilité décennale peut être engagée sur le fondement de la présomption établie par les articles 1792 et suivants du code civil », d'être couverte par une assurance. La justification doit pouvoir être présentée « à l'ouverture de tout chantier ».
    </p>
    <p className={P}>
      L'article 1792-1 du Code civil précise qui est « réputé constructeur » : notamment « tout architecte, entrepreneur, technicien ou autre personne liée au maître de l'ouvrage par un contrat de louage d'ouvrage ». C'est ce lien contractuel direct avec le maître d'ouvrage qui déclenche l'obligation.
    </p>
    <h3 className={H3}>Le cas particulier des sous-traitants</h3>
    <p className={P}>
      Un sous-traitant est lié par contrat à l'entreprise principale, pas au maître d'ouvrage : il n'entre donc pas dans la liste de l'article 1792-1. La Cour de cassation l'a confirmé en assemblée plénière (12 juillet 1991) : « le sous-traitant n'est pas contractuellement lié au maître de l'ouvrage », et l'action du maître d'ouvrage contre lui n'est pas soumise au régime de la garantie décennale. Le sous-traitant n'a donc pas d'obligation légale d'assurance décennale au titre de l'article L241-1 — même si, en pratique, les entreprises principales l'exigent souvent par contrat.
    </p>
    <Sources keys={["l2411", "spinetta", "c17921", "assplen1991"]} />
  </section>
);

export const DecennaleDureeEtGaranties = () => (
  <section className="max-w-4xl mx-auto mb-12" aria-labelledby="dc-duree-title">
    <h2 id="dc-duree-title" className={H2}>Durée de la garantie et autres garanties légales du BTP</h2>
    <p className={P}>
      L'article 1792 du Code civil rend le constructeur responsable de plein droit envers le maître ou l'acquéreur de l'ouvrage des dommages « qui compromettent la solidité de l'ouvrage » ou qui, l'affectant dans l'un de ses éléments constitutifs ou d'équipement, « le rendent impropre à sa destination » — sauf s'il prouve une cause étrangère. L'article 1792-4-1 fixe la durée : le constructeur est déchargé de cette responsabilité 10 ans après la réception des travaux.
    </p>
    <p className={P}>
      La garantie décennale n'est pas la seule garantie légale de la construction. SMABTP en résume les quatre, dans un tableau qui décrit la réglementation générale, pas un contrat particulier :
    </p>
    <p className="md:hidden text-xs text-muted-foreground mb-2">Faites défiler le tableau horizontalement pour voir toutes les colonnes.</p>
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full min-w-[640px] border-collapse">
        <caption className="sr-only">Les quatre garanties légales de la construction, selon SMABTP</caption>
        <thead>
          <tr>
            <th scope="col" className={TH}>Garantie légale</th>
            <th scope="col" className={TH}>Période</th>
            <th scope="col" className={TH}>Concerne</th>
            <th scope="col" className={TH}>Type d'assurance</th>
            <th scope="col" className={TH}>Qui souscrit</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row" className={`${TD} font-medium text-foreground text-left`}>Parfait achèvement</th>
            <td className={TD}>1 an après réception</td>
            <td className={TD}>Tous travaux et équipements (hors usure normale)</td>
            <td className={TD}>Obligation légale, non assurable</td>
            <td className={TD}>—</td>
          </tr>
          <tr>
            <th scope="row" className={`${TD} font-medium text-foreground text-left`}>Bon fonctionnement (biennale)</th>
            <td className={TD}>2 ans après réception</td>
            <td className={TD}>Éléments d'équipement dissociables</td>
            <td className={TD}>Assurance obligatoire</td>
            <td className={TD}>Chaque professionnel « constructeur »</td>
          </tr>
          <tr>
            <th scope="row" className={`${TD} font-medium text-foreground text-left`}>Décennale</th>
            <td className={TD}>10 ans après réception</td>
            <td className={TD}>Tous travaux considérés comme des ouvrages</td>
            <td className={TD}>Assurance obligatoire</td>
            <td className={TD}>Chaque professionnel « constructeur »</td>
          </tr>
          <tr>
            <th scope="row" className={`${TD} font-medium text-foreground text-left`}>Dommages-ouvrage</th>
            <td className={TD}>10 ans après réception</td>
            <td className={TD}>Préfinancement des réparations de nature décennale</td>
            <td className={TD}>Assurance obligatoire</td>
            <td className={TD}>Le maître d'ouvrage, pas l'artisan</td>
          </tr>
        </tbody>
      </table>
    </div>
    <Sources keys={["c1792", "c179241", "smabtp"]} />
  </section>
);

export const DecennaleAttestationSanction = () => (
  <section className="max-w-4xl mx-auto mb-12" aria-labelledby="dc-attestation-title">
    <h2 id="dc-attestation-title" className={H2}>Attestation et sanction en cas de défaut d'assurance</h2>
    <p className={P}>
      L'article L243-2 du Code des assurances impose que la justification de l'assurance décennale prenne « la forme d'attestations d'assurance, jointes aux devis et factures des professionnels assurés », selon un modèle fixé par arrêté du ministre chargé de l'économie.
    </p>
    <h3 className={H3}>Sanction</h3>
    <p className={P}>
      Ne pas être assuré est puni de six mois d'emprisonnement et de 75 000 € d'amende, ou de l'une de ces deux peines seulement (article L243-3 du Code des assurances).
    </p>
    <Sources keys={["l2432", "l2433"]} />
  </section>
);

export const DecennaleSourcesNote = () => (
  <Card className="p-4 md:p-5 bg-muted/30 max-w-4xl mx-auto mb-12">
    <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
      <strong className="text-foreground">Sources consultées le 22 septembre 2026.</strong> Les textes de loi et l'arrêt de la Cour de cassation ont été lus sur Légifrance le même jour. Le tableau des garanties est celui publié par SMABTP et décrit la réglementation générale, pas un contrat particulier. Les pages de sources sont publiques, susceptibles d'évoluer : les textes en vigueur et votre contrat font foi.
    </p>
  </Card>
);
