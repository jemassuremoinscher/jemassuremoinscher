import { Stethoscope, ShieldCheck, Euro, Users, Briefcase } from "lucide-react";
import SEOLandingPage from "@/components/landing/SEOLandingPage";

const MutuelleTNS = () => {
  const advantages = [
    {
      icon: Euro,
      title: "Cotisations déductibles",
      description:
        "En tant que TNS, vos cotisations de mutuelle sont déductibles de votre revenu imposable grâce à la loi Madelin.",
    },
    {
      icon: ShieldCheck,
      title: "Garanties professionnelles",
      description:
        "Des couvertures adaptées à votre activité : hospitalisation, dentaire, optique et médecines douces incluses.",
    },
    {
      icon: Users,
      title: "Protection familiale",
      description:
        "Étendez votre couverture à votre conjoint et vos enfants avec des formules famille avantageuses.",
    },
  ];

  const faqs = [
    {
      question: "Qu'est-ce que la loi Madelin et comment en bénéficier ?",
      answer:
        "La loi Madelin permet aux Travailleurs Non-Salariés (TNS) de déduire de leur revenu imposable les cotisations versées au titre d'un contrat de complémentaire santé. Pour en bénéficier, le contrat doit être un contrat Madelin souscrit à titre individuel et vous devez être à jour de vos cotisations sociales obligatoires. Le plafond de déduction est de 3,75 % du revenu professionnel + 7 % du PASS.",
    },
    {
      question: "Quelle différence entre une mutuelle TNS et une mutuelle salarié ?",
      answer:
        "Contrairement aux salariés qui bénéficient d'une mutuelle d'entreprise obligatoire (prise en charge à 50 % par l'employeur), les TNS doivent souscrire individuellement leur complémentaire santé. En contrepartie, ils bénéficient de l'avantage fiscal Madelin. Les contrats TNS offrent aussi plus de flexibilité dans le choix des garanties et des niveaux de remboursement.",
    },
    {
      question: "Quels profils TNS peuvent souscrire une mutuelle Madelin ?",
      answer:
        "Tous les Travailleurs Non-Salariés peuvent en bénéficier : artisans, commerçants, professions libérales, gérants majoritaires de SARL, auto-entrepreneurs (sous conditions). Votre courtier vérifiera votre éligibilité et vous aidera à choisir le contrat le plus adapté à votre activité et à votre situation familiale.",
    },
  ];

  const contentBody = `
    <p>En tant que <strong>Travailleur Non-Salarié (TNS)</strong>, vous ne bénéficiez pas de la mutuelle d'entreprise obligatoire dont profitent les salariés. Souscrire une <strong>complémentaire santé adaptée</strong> est donc essentiel pour couvrir vos frais médicaux et ceux de votre famille, tout en optimisant votre fiscalité grâce à la <strong>loi Madelin</strong>.</p>

    <p>Chez <strong>jemassuremoinscher.fr</strong>, nos courtiers sont spécialisés dans les contrats Madelin pour TNS. Nous comparons les offres de plus de 30 assureurs et mutuelles partenaires pour vous proposer la <strong>meilleure couverture au meilleur prix</strong>, en tenant compte de votre activité professionnelle, de votre âge et de vos besoins spécifiques.</p>

    <p>Faire appel à un courtier pour votre mutuelle TNS, c'est l'assurance de <strong>ne rien laisser au hasard</strong>. Chaque profession a des besoins différents : un artisan du bâtiment n'aura pas les mêmes priorités qu'un consultant indépendant ou un médecin libéral. Nos experts analysent votre situation et vous orientent vers les contrats qui correspondent réellement à votre quotidien.</p>

    <h3>L'avantage fiscal Madelin : comment ça marche ?</h3>
    <p>La loi Madelin vous permet de <strong>déduire vos cotisations de mutuelle de votre revenu imposable</strong>. Le plafond de déduction est calculé selon la formule suivante : 3,75 % de votre bénéfice imposable + 7 % du Plafond Annuel de la Sécurité Sociale (PASS). Concrètement, cela peut représenter une <strong>économie d'impôt de plusieurs centaines d'euros par an</strong>. Votre courtier vous aidera à maximiser cet avantage fiscal.</p>

    <h3>Pourquoi un courtier pour votre mutuelle TNS ?</h3>
    <p>Le marché des mutuelles TNS est vaste et les offres sont souvent complexes à comparer. Un courtier vous fait gagner du temps en <strong>présélectionnant les contrats les plus pertinents</strong> pour votre profil. Il négocie les tarifs, vérifie les exclusions de garantie et s'assure que votre contrat est bien éligible à la déduction Madelin. En cas de sinistre ou de litige avec votre mutuelle, il reste votre <strong>interlocuteur privilégié</strong> et défend vos intérêts.</p>

    <p>Protégez votre santé et optimisez votre fiscalité. <strong>Demandez votre devis gratuit</strong> et découvrez les meilleures mutuelles TNS du marché.</p>
  `;

  return (
    <SEOLandingPage
      title="Mutuelle TNS | Complémentaire Santé Madelin"
      metaDescription="Mutuelle TNS : comparez les meilleures offres Madelin. Courtier spécialisé, cotisations déductibles. Devis gratuit en 2 min."
      keyword="mutuelle TNS"
      keywords="mutuelle travailleur non salarié, complémentaire santé TNS, loi Madelin mutuelle, mutuelle indépendant, mutuelle profession libérale"
      canonical="https://www.jemassuremoinscher.fr/mutuelle-tns"
      heroIcon={Briefcase}
      heroTitle="Mutuelle TNS : La Complémentaire Santé des Indépendants"
      heroSubtitle="Profitez de l'avantage fiscal Madelin et trouvez la mutuelle idéale pour votre activité. Nos courtiers comparent 30+ offres pour vous."
      ctaLabel="Obtenir mon devis gratuit"
      ctaLink="/assurance-sante"
      contentTitle="Pourquoi choisir un courtier pour votre mutuelle TNS ?"
      contentBody={contentBody}
      advantages={advantages}
      faqTitle="FAQ – Mutuelle TNS & Loi Madelin"
      faqs={faqs}
      breadcrumbs={[
        { name: "Accueil", url: "https://www.jemassuremoinscher.fr/" },
        { name: "Assurance Santé", url: "https://www.jemassuremoinscher.fr/assurance-sante" },
        { name: "Mutuelle TNS", url: "https://www.jemassuremoinscher.fr/mutuelle-tns" },
      ]}
      bottomCtaTitle="Prêt à optimiser votre couverture santé TNS ?"
      bottomCtaDescription="Nos courtiers spécialisés en loi Madelin trouvent la mutuelle parfaite pour les indépendants, artisans et professions libérales."
      bottomCtaLabel="Comparer les mutuelles TNS"
      bottomCtaLink="/assurance-sante"
    />
  );
};

export default MutuelleTNS;
