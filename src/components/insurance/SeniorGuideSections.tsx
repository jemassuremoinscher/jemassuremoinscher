import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";

/**
 * Sections de /assurance-senior, rédigées le 2026-09-23.
 *
 * Ce pilier N'EST PAS un contenu isolé de plus : c'est une synthèse
 * transversale qui pointe vers 5 contenus déjà en ligne, plutôt que de
 * les dupliquer. Chaque section = quelques phrases de synthèse + lien
 * vers le contenu source, jamais une réécriture complète.
 *
 * Contenus source (vérifiés le 23 septembre 2026) :
 * - /profil/senior-75-plus (assurance auto senior, outil déjà en ligne)
 * - /blog/mutuelle-sante-senior-2026-optimisez-vos-remboursements-avec-les-bonnes-strategies
 * - /blog/assurance-emprunteur-risque-aggrave-senior-maladie
 * - /blog/assurance-expatrie-senior-2026-le-guide-complet-pour-une-retraite-sereine-a-l-etranger
 *   (expatriation SORTANTE : un Français senior part vivre sa retraite
 *   à l'étranger)
 * - /blog/assurance-retraite-expatrie-france (angle INVERSE : un
 *   étranger vient vivre sa retraite en France — 6e angle identifié en
 *   cours de recherche, pas dans la liste initiale, validé ensuite)
 *
 * Il n'existe pas de produit "assurance senior" unique : ce pilier est
 * un hub de navigation entre plusieurs situations distinctes, pas une
 * page produit.
 */

const H2 = "text-xl md:text-2xl font-bold text-foreground mb-3";
const P = "text-muted-foreground leading-relaxed mb-3";
const LinkStyle = "underline hover:text-primary font-medium";

export const SeniorIntro = () => (
  <section className="max-w-4xl mx-auto mb-10" aria-labelledby="senior-intro-title">
    <h2 id="senior-intro-title" className={H2}>Il n'existe pas UNE assurance senior</h2>
    <p className={P}>
      "Assurance senior" recouvre en réalité plusieurs questions bien différentes selon votre situation : conduire après 75 ans, optimiser sa mutuelle santé, emprunter avec un antécédent médical, ou s'assurer en changeant de pays à la retraite — dans un sens ou dans l'autre. Cette page fait le point sur chacune, avec un lien vers le contenu dédié à chaque situation.
    </p>
  </section>
);

export const SeniorAuto = () => (
  <section className="max-w-4xl mx-auto mb-10" aria-labelledby="senior-auto-title">
    <h2 id="senior-auto-title" className={H2}>Conduire après 75 ans</h2>
    <p className={P}>
      L'âge n'est pas un motif légal de refus d'assurance auto en France. La visite médicale n'est pas obligatoire pour le permis B après 75 ans (sauf suspension médicale antérieure), mais certains assureurs la demandent à partir de 75 ou 80 ans — l'anticiper peut jouer sur votre tarif.
    </p>
    <p className={P}>
      <Link to="/profil/senior-75-plus" className={LinkStyle}>Voir le profil complet assurance auto senior 75+ →</Link>
    </p>
  </section>
);

export const SeniorSante = () => (
  <section className="max-w-4xl mx-auto mb-10" aria-labelledby="senior-sante-title">
    <h2 id="senior-sante-title" className={H2}>Optimiser sa mutuelle santé</h2>
    <p className={P}>
      Les besoins de remboursement évoluent souvent après la retraite (soins dentaires, optique, hospitalisation). Choisir sa mutuelle senior suppose de comparer les niveaux de garantie selon ses besoins réels, pas seulement le prix affiché.
    </p>
    <p className={P}>
      <Link to="/blog/mutuelle-sante-senior-2026-optimisez-vos-remboursements-avec-les-bonnes-strategies" className={LinkStyle}>Lire le guide mutuelle santé senior →</Link>
    </p>
  </section>
);

export const SeniorEmprunteur = () => (
  <section className="max-w-4xl mx-auto mb-10" aria-labelledby="senior-emprunteur-title">
    <h2 id="senior-emprunteur-title" className={H2}>Emprunter avec un risque aggravé</h2>
    <p className={P}>
      Au-delà de 60-65 ans selon les assureurs, ou avec un antécédent médical déclaré, l'assurance emprunteur déclenche un questionnaire médical approfondi et parfois une surprime ou une exclusion ciblée. Le droit à l'oubli et la convention AERAS peuvent s'appliquer selon votre situation.
    </p>
    <p className={P}>
      <Link to="/blog/assurance-emprunteur-risque-aggrave-senior-maladie" className={LinkStyle}>Lire le guide assurance emprunteur et risque aggravé →</Link>
    </p>
  </section>
);

export const SeniorExpatriationSortante = () => (
  <section className="max-w-4xl mx-auto mb-10" aria-labelledby="senior-expat-sortant-title">
    <h2 id="senior-expat-sortant-title" className={H2}>Partir vivre sa retraite à l'étranger</h2>
    <p className={P}>
      S'installer à l'étranger pour sa retraite change la couverture santé (perte de la Sécurité sociale française selon le pays), l'assurance habitation et parfois l'assurance auto. Les règles varient fortement selon la destination.
    </p>
    <p className={P}>
      <Link to="/blog/assurance-expatrie-senior-2026-le-guide-complet-pour-une-retraite-sereine-a-l-etranger" className={LinkStyle}>Lire le guide retraite à l'étranger →</Link>
    </p>
  </section>
);

export const SeniorExpatriationEntrante = () => (
  <section className="max-w-4xl mx-auto mb-10" aria-labelledby="senior-expat-entrant-title">
    <h2 id="senior-expat-entrant-title" className={H2}>Venir vivre sa retraite en France</h2>
    <p className={P}>
      À l'inverse, un retraité étranger qui s'installe en France doit s'assurer selon les règles françaises dès son arrivée (assurance habitation, complémentaire santé), avec des démarches spécifiques à son statut de résident.
    </p>
    <p className={P}>
      <Link to="/blog/assurance-retraite-expatrie-france" className={LinkStyle}>Lire le guide retraité expatrié en France →</Link>
    </p>
  </section>
);

export const SeniorSourcesNote = () => (
  <Card className="p-4 md:p-5 bg-muted/30 max-w-4xl mx-auto mb-12">
    <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
      <strong className="text-foreground">Page de synthèse mise à jour le 23 septembre 2026.</strong> Cette page renvoie vers nos contenus détaillés plutôt que de les dupliquer. Il n'existe pas de contrat "assurance senior" unique : le bouton de comparaison ci-dessous ouvre notre comparateur général, où vous choisissez le type de contrat qui correspond à votre situation précise.
    </p>
  </Card>
);
