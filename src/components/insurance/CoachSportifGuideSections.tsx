import { Card } from "@/components/ui/card";

/**
 * Sections de fond de /assurance-coach-sportif, rédigées le 2026-09-23 à
 * partir de sources primaires lues le même jour.
 *
 * Sources (toutes paraphrasées, jamais recopiées) :
 * - Code du sport, article L212-1 (Légifrance) — qualification obligatoire
 *   pour enseigner contre rémunération, en vigueur depuis le 01/01/2019
 * - Code du sport, article L212-8 (Légifrance) — sanction pénale exacte :
 *   1 an d'emprisonnement et 15 000 € d'amende
 * - Code du sport, article R212-89 (Légifrance) — carte professionnelle
 *   délivrée par le préfet après déclaration d'activité
 * - Code du sport, article L321-1 (Légifrance) — obligation d'assurance
 *   RC, dont le champ est limité aux associations, sociétés et
 *   fédérations sportives (PAS à l'éducateur individuel)
 * - Code du sport, article L322-2 et L321-7 (Légifrance) — obligation
 *   d'assurance de l'exploitant d'un établissement d'APS
 *
 * Nuance volontairement mise en avant : contrairement à ce qu'affirmait
 * (à tort) la landing /landing/coach-sportif avant correction, aucun
 * article du Code du sport n'impose nommément la RC pro au coach
 * indépendant sans établissement propre. C'est la qualification qui est
 * strictement obligatoire (sanctionnée), pas l'assurance en tant que
 * telle pour ce cas précis — même logique de transparence que pour le
 * vide juridique drone <20 kg.
 *
 * Volontairement ABSENTS (non vérifiés) : tout chiffre de prix ; un
 * montant de garantie minimal pour la RC pro coach (aucun texte ne le
 * fixe pour l'indépendant sans établissement).
 */

const SRC = {
  l2121: { label: "Code du sport, article L212-1 (Légifrance)", href: "https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000037388193" },
  l2128: { label: "Code du sport, article L212-8 (Légifrance)", href: "https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000047941858" },
  r21289: { label: "Code du sport, article R212-89 (Légifrance)", href: "https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000047941858" },
  l3211: { label: "Code du sport, article L321-1 (Légifrance)", href: "https://www.legifrance.gouv.fr/codes/section_lc/LEGITEXT000006071318/LEGISCTA000006151574/" },
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

export const CoachSportifQualification = () => (
  <section className="max-w-4xl mx-auto mb-12" aria-labelledby="coach-qualif-title">
    <h2 id="coach-qualif-title" className={H2}>Coach sportif : ce qui est légalement obligatoire</h2>
    <p className={P}>
      Seules les personnes titulaires d'un diplôme, titre professionnel ou certificat de qualification enregistré au répertoire national des certifications professionnelles peuvent enseigner, animer ou encadrer une activité physique ou sportive contre rémunération (article L212-1 du Code du sport, en vigueur depuis le 1ᵉʳ janvier 2019).
    </p>
    <ul className={UL}>
      <li>
        <strong className="text-foreground">Sanction.</strong> Exercer contre rémunération sans posséder cette qualification, ou faire usage des titres de professeur, moniteur, éducateur, entraîneur ou animateur sans les détenir, est puni d'un an d'emprisonnement et de 15 000 € d'amende (article L212-8).
      </li>
      <li>
        <strong className="text-foreground">Carte professionnelle.</strong> Après déclaration d'activité, le préfet délivre une carte professionnelle d'éducateur sportif au déclarant dont les qualifications répondent aux conditions de reconnaissance (article R212-89).
      </li>
    </ul>
    <Sources keys={["l2121", "l2128", "r21289"]} />
  </section>
);

export const CoachSportifAssuranceRC = () => (
  <section className="max-w-4xl mx-auto mb-12" aria-labelledby="coach-assurance-title">
    <h2 id="coach-assurance-title" className={H2}>Assurance RC pro : une nuance importante</h2>
    <p className={P}>
      L'article L321-1 du Code du sport impose une assurance couvrant la responsabilité civile — mais son champ est précis : « les associations, les sociétés et les fédérations sportives souscrivent pour l'exercice de leur activité des garanties d'assurance couvrant leur responsabilité civile, celle de leurs préposés salariés ou bénévoles et celle des pratiquants du sport ». Cette obligation vise ces structures, pas l'éducateur sportif individuel.
    </p>
    <p className={P}>
      De même, l'obligation d'assurance de l'exploitant d'un établissement d'activités physiques et sportives (articles L322-2 et L321-7) vise celui qui exploite l'établissement — une salle de sport, par exemple — pas le coach qui y intervient sans en être l'exploitant.
    </p>
    <p className={P}>
      Concrètement : un coach salarié ou affilié à une salle est couvert par l'assurance de celle-ci. Un coach indépendant sans établissement propre n'est visé par aucun article du Code du sport qui lui imposerait nommément une RC pro personnelle — c'est la responsabilité civile de droit commun qui l'expose en cas de faute professionnelle, ce qui rend cette assurance fortement recommandée en pratique (et quasi systématiquement exigée par les salles partenaires), sans qu'un texte spécifique ne la rende obligatoire pour ce cas précis.
    </p>
    <Sources keys={["l3211"]} />
  </section>
);

export const CoachSportifSourcesNote = () => (
  <Card className="p-4 md:p-5 bg-muted/30 max-w-4xl mx-auto mb-12">
    <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
      <strong className="text-foreground">Sources consultées le 23 septembre 2026.</strong> Les textes de loi ont été lus sur Légifrance le même jour. Nous distinguons clairement ce qui est strictement obligatoire (la qualification) de ce qui est fortement recommandé sans texte spécifique (la RC pro du coach indépendant), plutôt que de présenter les deux comme équivalents. Le bouton de comparaison de cette page ouvre notre comparateur général. Les pages de sources sont publiques, susceptibles d'évoluer : les textes en vigueur et votre contrat font foi.
    </p>
  </Card>
);
