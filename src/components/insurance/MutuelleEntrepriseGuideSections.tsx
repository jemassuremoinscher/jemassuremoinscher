import { Card } from "@/components/ui/card";

/**
 * Section de fond de /assurance-mutuelle-entreprise, ajoutée le 2026-09-24
 * (traitement léger — le contenu existant de la page était déjà exact,
 * cette section ajoute la citation directe des textes qui manquait).
 *
 * Sources (paraphrasées, jamais recopiées) :
 * - Code de la sécurité sociale, article L911-7 (Légifrance) — obligation
 *   depuis le 01/01/2016, créé par la loi n°2013-504 du 14 juin 2013 (loi
 *   de sécurisation de l'emploi, issue de l'ANI du 11 janvier 2013),
 *   financement employeur minimum 50% (art. L911-7, III)
 * - Décret n°2014-1025 du 8 septembre 2014 (Légifrance) — panier de soins
 *   minimum, pris en application de l'article L911-7
 */

const SRC = {
  l9117: { label: "Code de la sécurité sociale, article L911-7 (Légifrance)", href: "https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000031686110" },
  decret2014: { label: "Décret n°2014-1025 du 8 septembre 2014 (Légifrance)", href: "https://www.legifrance.gouv.fr/loda/id/JORFTEXT000029434975" },
} as const;

const H2 = "text-xl md:text-2xl font-bold text-foreground mb-3";
const P = "text-muted-foreground leading-relaxed mb-3";

export const MutuelleEntrepriseCadreLegal = () => (
  <section className="max-w-4xl mx-auto mb-12" aria-labelledby="mutuelle-cadre-title">
    <h2 id="mutuelle-cadre-title" className={H2}>Le cadre légal exact</h2>
    <p className={P}>
      Depuis le 1ᵉʳ janvier 2016, toute entreprise du secteur privé dont les salariés ne bénéficient pas déjà d'une couverture collective obligatoire doit leur en proposer une (Code de la sécurité sociale, article L911-7). L'obligation vise toutes les entreprises, quelle que soit leur taille, leur forme ou leur activité, et découle de la loi n°2013-504 du 14 juin 2013 — issue de l'accord national interprofessionnel (ANI) du 11 janvier 2013.
    </p>
    <p className={P}>
      L'article L911-7, III fixe le financement minimum : l'employeur assure au moins la moitié de la cotisation.
    </p>
    <p className={P}>
      Le panier de soins minimum est fixé par le décret n°2014-1025 du 8 septembre 2014 : prise en charge intégrale du ticket modérateur sur les consultations et actes remboursables, forfait journalier hospitalier sans limitation de durée, frais dentaires à 125 % du tarif de la Sécurité sociale, et un forfait optique par période de deux ans (100 € minimum pour une correction simple, jusqu'à 200 € pour une correction complexe).
    </p>
    <p className="text-xs text-muted-foreground mt-4 leading-relaxed">
      Sources :{" "}
      <a href={SRC.l9117.href} target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">{SRC.l9117.label}</a>
      {" · "}
      <a href={SRC.decret2014.href} target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">{SRC.decret2014.label}</a>
    </p>
  </section>
);

export const MutuelleEntrepriseSourcesNote = () => (
  <Card className="p-4 md:p-5 bg-muted/30 max-w-4xl mx-auto mb-12">
    <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
      <strong className="text-foreground">Sources consultées le 24 septembre 2026.</strong> Les textes ont été lus sur Légifrance le même jour. Le bouton de comparaison de cette page ouvre notre comparateur général.
    </p>
  </Card>
);
