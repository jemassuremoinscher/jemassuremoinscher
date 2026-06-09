import { Car, ShieldCheck, Euro, Clock, Handshake, Scale } from "lucide-react";
import SEOLandingPage from "@/components/landing/SEOLandingPage";

const AssuranceAutoMalusse = () => {
  const advantages = [
    {
      icon: ShieldCheck,
      title: "Couverture garantie",
      description:
        "Même avec un malus élevé, nous trouvons un assureur qui vous couvre avec des garanties solides.",
    },
    {
      icon: Euro,
      title: "Tarifs négociés",
      description:
        "Grâce à nos partenariats avec plus de 30 compagnies, nous obtenons des tarifs compétitifs pour les profils malussés.",
    },
    {
      icon: Handshake,
      title: "Accompagnement personnalisé",
      description:
        "Un courtier dédié analyse votre situation et vous guide vers la meilleure offre, sans jugement.",
    },
  ];

  const faqs = [
    {
      question: "Puis-je m'assurer même avec un coefficient de malus de 3.50 ?",
      answer:
        "Oui, absolument. Nos partenaires assureurs sont spécialisés dans les profils à risque et acceptent les coefficients bonus-malus élevés, y compris au-delà de 3.50. Votre courtier négociera les meilleures conditions possibles en fonction de votre historique.",
    },
    {
      question: "Combien de temps faut-il pour retrouver un bonus après un malus ?",
      answer:
        "En l'absence de sinistre responsable, votre coefficient diminue de 5 % chaque année. Il faut environ 13 ans sans accident responsable pour revenir au bonus maximal de 0.50 depuis un coefficient de 1.00. Votre courtier peut vous aider à optimiser cette trajectoire.",
    },
    {
      question: "Quels documents sont nécessaires pour un devis auto malussé ?",
      answer:
        "Vous aurez besoin de votre relevé d'information (fourni par votre ancien assureur), de votre permis de conduire, de la carte grise du véhicule et d'un justificatif de domicile. Le relevé d'information est le document le plus important car il détaille votre historique de sinistralité.",
    },
  ];

  const contentBody = `
    <p>Trouver une <strong>assurance auto avec un malus</strong> peut rapidement devenir un parcours du combattant. De nombreux assureurs traditionnels refusent les profils malussés ou proposent des primes exorbitantes. C'est exactement pour cette raison que faire appel à un <strong>courtier en assurance spécialisé</strong> change la donne.</p>

    <p>Chez <strong>jemassuremoinscher.fr</strong>, nous collaborons avec plus de 30 compagnies d'assurance, dont plusieurs sont spécialisées dans l'acceptation des conducteurs malussés. Notre rôle est de <strong>négocier pour vous</strong> les meilleures conditions, en tenant compte de votre coefficient bonus-malus, de votre historique de sinistralité et de votre véhicule.</p>

    <p>Un courtier connaît les critères d'acceptation de chaque assureur. Là où un comparateur en ligne vous donnera un refus automatique, <strong>un courtier humain</strong> saura présenter votre dossier sous le meilleur angle et identifier les compagnies les plus susceptibles de vous couvrir à un tarif juste.</p>

    <h3>Comment fonctionne le coefficient bonus-malus ?</h3>
    <p>Le coefficient de réduction-majoration (CRM) est calculé chaque année par votre assureur. En cas de sinistre responsable, il augmente de 25 %. Sans sinistre, il diminue de 5 %. Le coefficient peut varier de <strong>0.50 (bonus maximal)</strong> à <strong>3.50 (malus maximal)</strong>. Un malus élevé signifie une prime d'assurance plus chère, mais cela ne signifie pas que vous êtes inassurable.</p>

    <h3>Les avantages d'un courtier pour un conducteur malussé</h3>
    <p>Contrairement aux plateformes automatisées, un courtier offre un <strong>accompagnement personnalisé</strong>. Il analyse votre relevé d'information, identifie les assureurs adaptés à votre profil et négocie directement les tarifs. De plus, il vous conseille sur les actions à mener pour <strong>réduire progressivement votre malus</strong> : choix de garanties adaptées, installation d'un boîtier télématique ou passage en formule au tiers temporairement.</p>

    <p>Ne laissez pas un malus vous priver d'une couverture de qualité. <strong>Demandez votre devis gratuit</strong> dès maintenant et laissez nos experts trouver la solution qui vous convient.</p>
  `;

  return (
    <SEOLandingPage
      title="Assurance Auto Malussé | Devis Courtier"
      metaDescription="Trouvez une assurance auto malgré un malus. Courtier spécialisé, tarifs négociés auprès de 30+ assureurs. Devis gratuit en 2 min."
      keyword="assurance auto malussé"
      keywords="assurance malus, conducteur malussé, assurance auto après résiliation, courtier malus auto"
      canonical="https://www.jemassuremoinscher.fr/assurance-auto-malus"
      heroIcon={Car}
      heroTitle="Assurance Auto Malussé : Trouvez Votre Couverture"
      heroSubtitle="Même avec un malus, nos courtiers négocient pour vous les meilleurs tarifs auprès de 30+ assureurs partenaires. Devis gratuit et sans engagement."
      ctaLabel="Obtenir mon devis gratuit"
      ctaLink="/assurance-auto"
      contentTitle="Pourquoi choisir un courtier pour votre assurance auto malussé ?"
      contentBody={contentBody}
      advantages={advantages}
      faqTitle="FAQ – Assurance Auto Malussé"
      faqs={faqs}
      breadcrumbs={[
        { name: "Accueil", url: "https://www.jemassuremoinscher.fr/" },
        { name: "Assurance Auto", url: "https://www.jemassuremoinscher.fr/assurance-auto" },
        { name: "Assurance Auto Malussé", url: "https://www.jemassuremoinscher.fr/assurance-auto-malus" },
      ]}
      bottomCtaTitle="Prêt à trouver votre assurance auto malussé ?"
      bottomCtaDescription="Nos courtiers spécialisés sont à votre disposition pour analyser votre dossier et vous proposer la meilleure offre."
      bottomCtaLabel="Comparer les offres maintenant"
      bottomCtaLink="/assurance-auto"
    />
  );
};

export default AssuranceAutoMalusse;
