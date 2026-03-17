import { Zap, ShieldCheck, Euro, AlertTriangle } from "lucide-react";
import SEOLandingPage from "@/components/landing/SEOLandingPage";

const AssuranceTrottinetteElectrique = () => {
  const advantages = [
    {
      icon: AlertTriangle,
      title: "Obligatoire depuis 2024",
      description:
        "Tout EDPM motorisé circulant sur la voie publique doit être assuré au minimum en responsabilité civile. Sans assurance, vous risquez une amende de 3 750 €.",
    },
    {
      icon: Euro,
      title: "Dès 3,50 €/mois",
      description:
        "Nos courtiers comparent 30+ assureurs pour trouver les formules trottinette les plus compétitives, avec ou sans vol et casse.",
    },
    {
      icon: ShieldCheck,
      title: "Garanties adaptées aux EDPM",
      description:
        "Responsabilité civile, protection corporelle du conducteur, vol, dommages matériels : choisissez la couverture qui vous convient.",
    },
  ];

  const faqs = [
    {
      question: "L'assurance trottinette électrique est-elle obligatoire en France en 2026 ?",
      answer:
        "Oui, depuis le décret du 23 octobre 2023, tous les Engins de Déplacement Personnel Motorisés (EDPM) — trottinettes électriques, gyroroues, hoverboards — doivent être assurés au minimum en responsabilité civile pour circuler sur la voie publique. Cette obligation s'applique même si vous roulez uniquement sur piste cyclable. Le défaut d'assurance est passible d'une amende pouvant atteindre 3 750 €.",
    },
    {
      question: "Combien coûte une assurance trottinette électrique ?",
      answer:
        "Le prix d'une assurance trottinette électrique varie de 3,50 € à 15 €/mois selon la formule choisie. Une formule de base (responsabilité civile seule) coûte environ 3,50 à 5 €/mois. Une formule intermédiaire avec protection corporelle du conducteur revient à 6-8 €/mois. Les formules tous risques incluant vol et dommages matériels se situent entre 10 et 15 €/mois. Un courtier compare ces offres gratuitement pour vous.",
    },
    {
      question: "Que couvre l'assurance responsabilité civile pour une trottinette ?",
      answer:
        "La responsabilité civile (RC) couvre les dommages corporels et matériels que vous pourriez causer à un tiers en circulant avec votre trottinette électrique : piéton renversé, véhicule rayé, dégâts sur du mobilier urbain. Elle ne couvre pas vos propres blessures ni le vol de votre trottinette — pour cela, des garanties complémentaires (protection du conducteur, garantie vol) sont nécessaires.",
    },
  ];

  const contentBody = `
    <p>Depuis 2024, l'<strong>assurance trottinette électrique est obligatoire en France</strong>. Que vous utilisiez votre EDPM pour vos trajets domicile-travail ou pour vos loisirs, vous devez souscrire au minimum une garantie responsabilité civile. Cette obligation concerne tous les engins motorisés : trottinettes électriques, gyroroues, monoroues, hoverboards et skateboards électriques.</p>

    <p>Chez <strong>jemassuremoinscher.fr</strong>, nos courtiers spécialisés en mobilité urbaine comparent les offres de plus de 30 assureurs partenaires pour vous trouver la <strong>meilleure assurance EDPM au prix le plus bas</strong>. En 2 minutes, obtenez un devis gratuit et sans engagement adapté à votre usage quotidien.</p>

    <h3>Pourquoi l'assurance trottinette est-elle devenue obligatoire ?</h3>
    <p>L'explosion du nombre de trottinettes électriques en circulation (plus de 2,5 millions en France en 2026) a entraîné une hausse significative des accidents impliquant des EDPM. Face à ce constat, le législateur a imposé l'obligation d'assurance pour <strong>protéger les usagers et les tiers</strong>. Un accident de trottinette peut engendrer des dommages corporels graves : sans assurance, c'est votre patrimoine personnel qui est engagé pour indemniser la victime.</p>

    <h3>Les différentes formules d'assurance trottinette</h3>
    <p>Trois niveaux de couverture existent pour votre trottinette électrique :</p>
    <ul>
      <li><strong>Formule Essentielle</strong> (dès 3,50 €/mois) : responsabilité civile obligatoire uniquement. Idéale pour un usage occasionnel.</li>
      <li><strong>Formule Confort</strong> (dès 6 €/mois) : RC + protection corporelle du conducteur + assistance. Recommandée pour les trajets quotidiens.</li>
      <li><strong>Formule Tous Risques</strong> (dès 10 €/mois) : couverture complète incluant vol, casse, dommages matériels et protection juridique. Conseillée pour les trottinettes haut de gamme (valeur > 500 €).</li>
    </ul>

    <h3>Les règles de circulation des EDPM en 2026</h3>
    <p>En plus de l'assurance obligatoire, les conducteurs de trottinettes électriques doivent respecter plusieurs règles : <strong>vitesse maximale de 25 km/h</strong>, interdiction de rouler sur les trottoirs (sauf autorisation municipale), port du casque recommandé (obligatoire hors agglomération), gilet rétro-réfléchissant de nuit, et interdiction de transporter un passager. Le non-respect de ces règles peut entraîner des amendes de 35 € à 1 500 €.</p>

    <p>Ne prenez pas le risque de rouler sans assurance. <strong>Comparez gratuitement les offres</strong> et trouvez la couverture adaptée à votre trottinette électrique en quelques clics.</p>
  `;

  return (
    <SEOLandingPage
      title="Assurance Trottinette Électrique Obligatoire 2026 | Devis"
      metaDescription="Assurance trottinette électrique obligatoire en France 2026. Comparez dès 3,50€/mois. 30+ assureurs. Devis gratuit en 2 min."
      keyword="assurance trottinette électrique"
      keywords="assurance obligatoire trottinette électrique france 2026, assurance EDPM, assurance gyroroue, trottinette electrique assurance"
      canonical="https://www.jemassuremoinscher.fr/assurance-trottinette-electrique"
      heroIcon={Zap}
      heroTitle="Assurance Trottinette Électrique : Obligatoire dès 3,50 €/mois"
      heroSubtitle="L'assurance EDPM est obligatoire en France depuis 2024. Nos courtiers comparent 30+ assureurs pour trouver votre couverture au meilleur prix."
      ctaLabel="Comparer les offres gratuitement"
      ctaLink="/comparateur"
      contentTitle="Tout savoir sur l'assurance trottinette électrique obligatoire"
      contentBody={contentBody}
      advantages={advantages}
      faqTitle="FAQ – Assurance Trottinette Électrique"
      faqs={faqs}
      breadcrumbs={[
        { name: "Accueil", url: "https://www.jemassuremoinscher.fr/" },
        { name: "Assurance Trottinette Électrique", url: "https://www.jemassuremoinscher.fr/assurance-trottinette-electrique" },
      ]}
      bottomCtaTitle="Roulez l'esprit tranquille dès aujourd'hui"
      bottomCtaDescription="Comparez les assurances trottinette électrique en 2 minutes et trouvez la formule adaptée à votre usage."
      bottomCtaLabel="Obtenir mon devis gratuit"
      bottomCtaLink="/comparateur"
    />
  );
};

export default AssuranceTrottinetteElectrique;
