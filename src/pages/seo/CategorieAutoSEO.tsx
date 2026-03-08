import SEOCategoryPage from "@/components/seo/SEOCategoryPage";

const faqItems = [
  {
    question: "Puis-je changer d'assurance auto à tout moment ?",
    answer:
      "Oui, depuis la loi Hamon de 2015, vous pouvez résilier votre contrat d'assurance auto à tout moment après la première année d'engagement, sans frais ni pénalités. Votre nouvel assureur se charge des démarches de résiliation auprès de l'ancien.",
  },
  {
    question: "Quels sont les documents nécessaires pour souscrire une assurance auto ?",
    answer:
      "Pour souscrire une assurance auto, vous aurez besoin de votre permis de conduire, de la carte grise du véhicule, d'un relevé d'information (fourni par votre précédent assureur) et d'un RIB pour le prélèvement des cotisations.",
  },
  {
    question: "Comment est calculé le prix de mon assurance auto ?",
    answer:
      "Le tarif dépend de plusieurs critères : votre profil conducteur (âge, bonus-malus, antécédents), les caractéristiques du véhicule (modèle, puissance, valeur), votre zone géographique, le niveau de garanties choisi et votre usage du véhicule (kilométrage, trajet domicile-travail).",
  },
];

const contentBlocks = [
  {
    title: "Pourquoi comparer les assurances auto avec notre outil ?",
    content: `
      <p>Comparer les offres d'assurance auto est la méthode la plus efficace pour <strong>réduire votre prime jusqu'à 40 %</strong>. Les tarifs varient considérablement d'un assureur à l'autre pour des garanties équivalentes, et seul un comparateur indépendant vous permet d'obtenir une vision claire du marché en quelques clics.</p>
      <p>Notre outil analyse en temps réel les offres de <strong>plus de 30 compagnies partenaires</strong> (Allianz, AXA, MAIF, Matmut, Direct Assurance…) pour vous présenter les contrats les plus compétitifs adaptés à votre profil. Contrairement aux devis obtenus un par un, vous gagnez un temps précieux et accédez à des tarifs négociés exclusifs.</p>
      <p>De plus, notre comparateur est <strong>100 % gratuit et sans engagement</strong>. Vous n'avez aucune obligation de souscrire et vos données restent confidentielles conformément au RGPD.</p>
    `,
  },
  {
    title: "Les critères qui font varier le prix de votre prime auto",
    content: `
      <p>Comprendre les facteurs de tarification vous aide à mieux négocier. Voici les principaux critères pris en compte par les assureurs :</p>
      <ul>
        <li><strong>Le coefficient bonus-malus :</strong> un bon historique de conduite peut réduire votre prime de plus de 50 %.</li>
        <li><strong>Le type de véhicule :</strong> puissance fiscale, valeur à neuf et coût des réparations influencent directement le tarif.</li>
        <li><strong>Votre lieu de résidence :</strong> les zones urbaines à fort taux de sinistralité sont plus chères que les zones rurales.</li>
        <li><strong>Votre âge et expérience :</strong> les jeunes conducteurs paient une surprime, qui diminue progressivement avec l'expérience.</li>
        <li><strong>L'usage du véhicule :</strong> un kilométrage élevé ou un usage professionnel augmentent le risque et donc la cotisation.</li>
      </ul>
      <p>En renseignant précisément ces informations dans notre comparateur, vous obtenez des devis au plus juste, sans mauvaise surprise à la souscription.</p>
    `,
  },
  {
    title: "Quelles garanties choisir pour faire des économies ?",
    content: `
      <p>Le choix de la formule est déterminant pour optimiser le rapport couverture/prix. Trois niveaux existent :</p>
      <ul>
        <li><strong>Au tiers (responsabilité civile) :</strong> l'option la moins chère, idéale pour les véhicules anciens de faible valeur. Elle couvre uniquement les dommages causés à autrui.</li>
        <li><strong>Au tiers étendu (intermédiaire) :</strong> ajoute des garanties vol, incendie et bris de glace. Un bon compromis pour les véhicules de valeur moyenne.</li>
        <li><strong>Tous risques :</strong> la couverture la plus complète, recommandée pour les véhicules récents ou de valeur importante.</li>
      </ul>
      <p>Pour réaliser des économies supplémentaires, pensez à <strong>ajuster votre franchise</strong> (une franchise plus élevée réduit la prime), à regrouper vos contrats chez le même assureur, et à opter pour le <strong>paiement annuel</strong> plutôt que mensuel.</p>
      <p>Notre comparateur vous permet de simuler chaque formule pour trouver le meilleur équilibre entre protection et budget.</p>
    `,
  },
];

const CategorieAutoSEO = () => (
  <SEOCategoryPage
    metaTitle="Assurance Auto Moins Chère | Comparer en 2 min"
    metaDescription="Comparez les assurances auto et économisez jusqu'à 40 % sur votre prime. Devis gratuit et sans engagement en 2 minutes."
    canonicalPath="/assurance-auto-comparatif"
    h1="Assurance Auto : Comparez et payez moins cher"
    subtitle="Trouvez la meilleure assurance auto en comparant gratuitement plus de 30 offres en 2 minutes. Économisez jusqu'à 40 % sur votre prime annuelle sans sacrifier vos garanties."
    contentBlocks={contentBlocks}
    faqItems={faqItems}
    ctaLabel="Lancer le comparateur auto"
    ctaLink="/assurance-auto"
    serviceName="Comparateur d'assurance auto"
    serviceDescription="Service gratuit de comparaison d'assurances auto permettant d'économiser jusqu'à 40 % sur sa prime annuelle."
  />
);

export default CategorieAutoSEO;
