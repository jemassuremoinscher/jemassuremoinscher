import { Card } from "@/components/ui/card";

/**
 * Sections de fond de /assurance-photographe, rédigées le 2026-09-23
 * après recherche primaire.
 *
 * Constat de la recherche : le métier de photographe n'est pas une
 * profession réglementée en France (aucun texte de loi spécifique
 * trouvé imposant une RC pro). Cherché un vrai tableau de garanties
 * chiffré chez un assureur spécialisé (Pixel-Assur, matériel
 * photo/vidéo/drone) et chez un généraliste (MAIF) : AUCUN des deux ne
 * publie de plafonds précis et sourcables — Pixel-Assur reste
 * descriptif sans chiffres, MAIF ne propose que des scénarios
 * illustratifs sans montant. Conformément à la consigne, PAS de
 * tableau de garanties inventé : le contenu reste qualitatif.
 *
 * Volontairement ABSENTS : tout chiffre de prix ou de plafond de
 * garantie (aucune source primaire trouvée) ; toute référence à une
 * obligation légale de RC pro (n'existe pas pour cette profession).
 */

const H2 = "text-xl md:text-2xl font-bold text-foreground mb-3";
const P = "text-muted-foreground leading-relaxed mb-3";
const UL = "list-disc pl-5 space-y-2 text-muted-foreground leading-relaxed mb-3";

export const PhotographeCadre = () => (
  <section className="max-w-4xl mx-auto mb-12" aria-labelledby="photographe-cadre-title">
    <h2 id="photographe-cadre-title" className={H2}>Photographe professionnel : pas de profession réglementée</h2>
    <p className={P}>
      Contrairement à d'autres métiers évoqués sur ce site (VTC, coach sportif), la photographie professionnelle n'est pas une profession réglementée en France : aucun diplôme, carte professionnelle ni texte de loi spécifique n'impose de RC pro pour l'exercer.
    </p>
    <p className={P}>
      Cela ne rend pas cette assurance inutile : un photographe reste exposé à la responsabilité civile de droit commun en cas de dommage à un client (chute de matériel, dommage en studio) ou de perte de fichiers livrables, ce qui rend une RC pro et une garantie matériel dédiée fortement recommandées en pratique — sans qu'un texte ne les impose.
    </p>
    <h3 className="text-base md:text-lg font-semibold text-foreground mt-6 mb-2">Ce qu'une couverture adaptée couvre généralement</h3>
    <ul className={UL}>
      <li><strong className="text-foreground">RC professionnelle.</strong> Dommages corporels, matériels ou immatériels causés à un client ou un tiers pendant une prestation (studio, mariage, événementiel, extérieur).</li>
      <li><strong className="text-foreground">Matériel photo/vidéo.</strong> Option dédiée pour la casse, la perte ou le vol des boîtiers, objectifs et accessoires — à distinguer de la RC pro, qui ne couvre pas votre propre matériel.</li>
      <li><strong className="text-foreground">Perte de données.</strong> Certains contrats couvrent la perte de fichiers confiés par le client ou produits pendant la prestation.</li>
    </ul>
    <p className="text-xs text-muted-foreground mt-4 leading-relaxed">
      Recherche effectuée le 23 septembre 2026 auprès d'un assureur spécialisé matériel photo/vidéo/drone et d'un assureur généraliste : aucun des deux ne publie de tableau de garanties avec des plafonds chiffrés et sourcables. Nous ne publions donc pas de tableau ni de fourchette de prix inventés.
    </p>
  </section>
);

export const PhotographeSourcesNote = () => (
  <Card className="p-4 md:p-5 bg-muted/30 max-w-4xl mx-auto mb-12">
    <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
      <strong className="text-foreground">Recherche effectuée le 23 septembre 2026.</strong> Contrairement à d'autres pages de ce site, il n'existe pas de texte de loi à citer pour ce métier non réglementé, ni de tableau de garanties chiffré et sourcable trouvé chez les assureurs consultés. Le bouton de comparaison de cette page ouvre notre comparateur général.
    </p>
  </Card>
);
