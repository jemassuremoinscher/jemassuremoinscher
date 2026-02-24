import { Car, GraduationCap, Euro, ShieldCheck, Clock, Smartphone } from "lucide-react";
import SEOLandingPage from "@/components/landing/SEOLandingPage";

const AssuranceJeuneConducteur = () => {
  const advantages = [
    {
      icon: Euro,
      title: "Tarifs adaptés aux jeunes",
      description:
        "Nous comparons 30+ assureurs pour trouver les offres spéciales jeunes conducteurs et réduire votre prime.",
    },
    {
      icon: Smartphone,
      title: "Boîtier télématique",
      description:
        "Optez pour un boîtier connecté et prouvez votre bonne conduite pour bénéficier de réductions allant jusqu'à 30 %.",
    },
    {
      icon: ShieldCheck,
      title: "Garanties sur mesure",
      description:
        "Choisissez entre tiers, tiers+ ou tous risques selon votre véhicule et votre budget, avec un accompagnement personnalisé.",
    },
  ];

  const faqs = [
    {
      question: "Pourquoi l'assurance auto est-elle plus chère pour un jeune conducteur ?",
      answer:
        "Les statistiques montrent que les conducteurs de moins de 25 ans ont un risque d'accident plus élevé. Les assureurs appliquent donc une surprime pouvant aller de 50 % à 100 % la première année. Cette majoration diminue chaque année sans sinistre responsable : elle passe à 50 % la deuxième année, puis 25 % la troisième.",
    },
    {
      question: "Comment réduire le prix de mon assurance auto jeune conducteur ?",
      answer:
        "Plusieurs leviers existent : la conduite accompagnée (qui réduit la surprime à 50 % dès la 1ère année), le choix d'un véhicule de faible puissance, l'installation d'un boîtier télématique, ou encore le fait de figurer en conducteur secondaire sur le contrat d'un parent. Un courtier peut aussi négocier des tarifs préférentiels.",
    },
    {
      question: "Quelle formule d'assurance choisir quand on débute ?",
      answer:
        "Pour un véhicule d'occasion de faible valeur, une formule au tiers ou tiers+ est souvent suffisante et économique. Pour un véhicule récent ou financé à crédit, le tous risques est recommandé. Votre courtier analysera votre situation pour vous orienter vers le meilleur rapport garanties/prix.",
    },
  ];

  const contentBody = `
    <p>L'<strong>assurance auto pour jeune conducteur</strong> représente souvent un budget conséquent. Avec une surprime pouvant doubler le tarif standard, trouver une couverture abordable relève du défi. C'est précisément là qu'un <strong>courtier spécialisé</strong> fait toute la différence.</p>

    <p>Chez <strong>jemassuremoinscher.fr</strong>, nous accompagnons chaque année des centaines de jeunes conducteurs dans leur recherche d'assurance. Notre réseau de plus de 30 assureurs partenaires nous permet d'identifier les compagnies qui proposent les <strong>meilleurs tarifs pour les profils débutants</strong>, qu'il s'agisse de jeunes ayant suivi la conduite accompagnée ou de conducteurs fraîchement diplômés.</p>

    <p>Un courtier connaît les <strong>critères spécifiques de chaque assureur</strong>. Certaines compagnies valorisent la conduite accompagnée, d'autres proposent des réductions pour les véhicules de faible puissance ou pour l'installation d'un boîtier télématique. Sans cet accompagnement, vous risquez de passer à côté d'économies substantielles.</p>

    <h3>La surprime jeune conducteur, comment ça marche ?</h3>
    <p>Tout nouveau conducteur se voit appliquer un <strong>coefficient de départ de 1.00</strong> (ni bonus ni malus). Les assureurs ajoutent une surprime légale pouvant atteindre 100 % la première année. Cette majoration diminue progressivement : <strong>50 % la deuxième année, 25 % la troisième</strong>, puis disparaît si aucun sinistre responsable n'est déclaré. La conduite accompagnée permet de réduire cette surprime de moitié dès le départ.</p>

    <h3>Les conseils de nos courtiers pour les jeunes conducteurs</h3>
    <p>Nos experts recommandent plusieurs stratégies pour <strong>optimiser votre budget assurance</strong> : privilégier un véhicule de catégorie d'assurance basse (groupes 1 à 6), envisager une formule au tiers+ plutôt que tous risques pour un véhicule d'occasion, et comparer systématiquement les offres avant de s'engager. Un courtier négocie également les <strong>franchises et les options</strong> pour vous offrir le meilleur équilibre entre protection et coût.</p>

    <p>Ne payez plus le prix fort pour votre première assurance auto. <strong>Demandez votre devis gratuit</strong> et laissez nos courtiers trouver l'offre idéale pour votre profil.</p>
  `;

  return (
    <SEOLandingPage
      title="Assurance Auto Jeune Conducteur | Devis"
      metaDescription="Assurance auto jeune conducteur moins chère. Courtier spécialisé, tarifs négociés auprès de 30+ assureurs. Devis gratuit en 2 min."
      keyword="assurance auto jeune conducteur"
      keywords="assurance jeune conducteur, assurance auto débutant, surprime jeune conducteur, assurance permis probatoire"
      canonical="https://www.jemassuremoinscher.fr/assurance-auto-jeune-conducteur"
      heroIcon={GraduationCap}
      heroTitle="Assurance Auto Jeune Conducteur : Économisez dès le 1er Jour"
      heroSubtitle="Surprime trop élevée ? Nos courtiers négocient les meilleurs tarifs jeunes conducteurs auprès de 30+ assureurs. Devis gratuit et sans engagement."
      ctaLabel="Obtenir mon devis gratuit"
      ctaLink="/assurance-auto"
      contentTitle="Pourquoi choisir un courtier pour votre assurance jeune conducteur ?"
      contentBody={contentBody}
      advantages={advantages}
      faqTitle="FAQ – Assurance Jeune Conducteur"
      faqs={faqs}
      breadcrumbs={[
        { name: "Accueil", url: "https://www.jemassuremoinscher.fr/" },
        { name: "Assurance Auto", url: "https://www.jemassuremoinscher.fr/assurance-auto" },
        { name: "Jeune Conducteur", url: "https://www.jemassuremoinscher.fr/assurance-auto-jeune-conducteur" },
      ]}
      bottomCtaTitle="Prêt à trouver votre assurance jeune conducteur ?"
      bottomCtaDescription="Nos courtiers spécialisés trouvent les meilleures offres pour les conducteurs débutants, avec ou sans conduite accompagnée."
      bottomCtaLabel="Comparer les offres maintenant"
      bottomCtaLink="/assurance-auto"
    />
  );
};

export default AssuranceJeuneConducteur;
