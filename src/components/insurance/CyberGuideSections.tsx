import { Card } from "@/components/ui/card";

/**
 * Section de fond de /assurance-cyber, ajoutée le 2026-09-24 (traitement
 * léger, pas une refonte complète comme sans-permis/camping-car/décennale).
 *
 * Sources (paraphrasées, jamais recopiées) :
 * - Code des assurances, article L12-10-1 (Légifrance) — créé par la loi
 *   n°2023-22 du 24 janvier 2023 (LOPMI), article 5, en vigueur depuis le
 *   24/04/2023
 *
 * Recherche effectuée : aucune obligation légale générale de souscrire une
 * cyber-assurance pour les TPE/PME (aucun texte trouvé qui l'impose) ;
 * aucun tableau de garanties chiffré et sourcable trouvé chez un assureur
 * spécialisé (vérifié chez Stoik, principal acteur cyber PME/ETI français)
 * ni chez un généraliste — contenu volontairement qualitatif, sans plafond
 * ni prix inventés.
 */

const SRC = {
  l1210: { label: "Code des assurances, article L12-10-1 (Légifrance)", href: "https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000047048152" },
} as const;

const H2 = "text-xl md:text-2xl font-bold text-foreground mb-3";
const P = "text-muted-foreground leading-relaxed mb-3";

export const CyberObligationEtDelai = () => (
  <section className="max-w-4xl mx-auto mb-12" aria-labelledby="cyber-obligation-title">
    <h2 id="cyber-obligation-title" className={H2}>Cyber-assurance : pas d'obligation légale, mais un délai à connaître</h2>
    <p className={P}>
      Aucun texte n'impose aux TPE et PME de souscrire une assurance cyber. La démarche reste volontaire — mais une contrainte légale s'applique une fois le contrat souscrit : en cas d'atteinte malveillante à un système informatique, l'indemnisation est conditionnée au dépôt d'une plainte dans les 72 heures suivant la connaissance de l'attaque par la victime.
    </p>
    <p className={P}>
      Cette règle, issue de la loi LOPMI du 24 janvier 2023, ne vise que les atteintes malveillantes (au sens des articles 323-1 à 323-3-1 du Code pénal) et s'applique uniquement dans le cadre d'une activité professionnelle. Passé ce délai, l'assureur peut refuser l'indemnisation.
    </p>
    <p className="text-xs text-muted-foreground mt-4 leading-relaxed">
      Sources :{" "}
      <a href={SRC.l1210.href} target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">
        {SRC.l1210.label}
      </a>
    </p>
  </section>
);

export const CyberSourcesNote = () => (
  <Card className="p-4 md:p-5 bg-muted/30 max-w-4xl mx-auto mb-12">
    <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
      <strong className="text-foreground">Sources consultées le 24 septembre 2026.</strong> Nous n'avons trouvé aucun tableau de garanties chiffré et sourcable publié par un assureur spécialisé : les plafonds et franchises varient d'un contrat à l'autre et ne sont communiqués que sur devis. Le bouton de comparaison de cette page ouvre notre comparateur général.
    </p>
  </Card>
);
