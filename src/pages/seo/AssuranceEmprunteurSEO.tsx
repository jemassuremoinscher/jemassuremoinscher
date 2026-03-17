import { Landmark, ShieldCheck, Euro, Scale } from "lucide-react";
import SEOLandingPage from "@/components/landing/SEOLandingPage";

const AssuranceEmprunteurSEO = () => {
  const advantages = [
    {
      icon: Euro,
      title: "Jusqu'à 15 000 € d'économies",
      description:
        "En changeant d'assurance emprunteur, nos clients économisent en moyenne 10 000 à 15 000 € sur la durée totale de leur prêt.",
    },
    {
      icon: Scale,
      title: "Loi Lemoine : changez à tout moment",
      description:
        "Depuis 2022, vous pouvez changer d'assurance emprunteur à tout moment, sans frais et sans attendre la date anniversaire.",
    },
    {
      icon: ShieldCheck,
      title: "Garanties équivalentes",
      description:
        "Votre banque ne peut refuser une délégation d'assurance si les garanties sont équivalentes. Nos courtiers s'en assurent.",
    },
  ];

  const faqs = [
    {
      question: "Qu'est-ce que l'assurance emprunteur ?",
      answer:
        "L'assurance emprunteur (ou assurance de prêt immobilier) est une garantie exigée par les banques lors de la souscription d'un crédit immobilier. Elle protège l'emprunteur et la banque en cas de décès, d'invalidité, d'incapacité de travail ou de perte d'emploi. Elle garantit le remboursement du capital restant dû si l'emprunteur ne peut plus honorer ses mensualités. Bien qu'elle ne soit pas légalement obligatoire, aucune banque n'accorde de prêt sans cette couverture.",
    },
    {
      question: "Peut-on changer d'assurance emprunteur en cours de prêt ?",
      answer:
        "Oui, grâce à la loi Lemoine (entrée en vigueur le 1er juin 2022), vous pouvez résilier votre assurance emprunteur à tout moment, sans frais et sans pénalités, pour la remplacer par un contrat offrant des garanties équivalentes. La banque dispose de 10 jours ouvrés pour accepter ou refuser la substitution (un refus doit être motivé). Cette loi s'applique à tous les contrats en cours, quelle que soit leur date de souscription.",
    },
    {
      question: "Combien peut-on économiser en changeant d'assurance emprunteur ?",
      answer:
        "Les économies dépendent de votre profil, du montant emprunté et de la durée restante. En moyenne, un emprunteur économise entre 5 000 € et 15 000 € sur la durée totale du prêt en passant du contrat groupe de la banque à une délégation d'assurance individuelle. Pour un prêt de 250 000 € sur 25 ans, l'économie peut atteindre 20 000 €. Un courtier calcule gratuitement votre économie potentielle.",
    },
  ];

  const contentBody = `
    <p>L'<strong>assurance emprunteur</strong>, aussi appelée assurance de prêt immobilier, est la garantie que votre banque exige pour accorder un crédit immobilier. Elle représente en moyenne <strong>25 à 30 % du coût total de votre prêt</strong> — un poste de dépense considérable que la plupart des emprunteurs négligent.</p>

    <p>Chez <strong>jemassuremoinscher.fr</strong>, nos courtiers sont spécialisés en <strong>délégation d'assurance emprunteur</strong>. Nous comparons les offres de plus de 30 assureurs pour vous trouver une couverture équivalente ou supérieure à celle de votre banque, à un tarif nettement inférieur. En moyenne, nos clients économisent <strong>10 000 à 15 000 €</strong> sur la durée de leur prêt.</p>

    <h3>Assurance emprunteur : définition et garanties</h3>
    <p>L'assurance emprunteur couvre plusieurs risques liés à votre capacité de remboursement :</p>
    <ul>
      <li><strong>Décès (DC)</strong> : le capital restant dû est remboursé à la banque.</li>
      <li><strong>Perte Totale et Irréversible d'Autonomie (PTIA)</strong> : prise en charge intégrale en cas d'invalidité totale.</li>
      <li><strong>Incapacité Temporaire de Travail (ITT)</strong> : vos mensualités sont prises en charge pendant votre arrêt de travail.</li>
      <li><strong>Invalidité Permanente (IPT/IPP)</strong> : couverture proportionnelle à votre taux d'invalidité.</li>
      <li><strong>Perte d'emploi</strong> (optionnelle) : prise en charge temporaire des mensualités en cas de licenciement.</li>
    </ul>

    <h3>Loi Lemoine : la liberté de choisir votre assurance</h3>
    <p>Depuis la <strong>loi Lemoine du 1er juin 2022</strong>, vous pouvez changer d'assurance emprunteur à tout moment, sans frais ni pénalités. Avant cette loi, il fallait attendre la date anniversaire du contrat (loi Bourquin) ou les 12 premiers mois (loi Hamon). Désormais, la résiliation est possible <strong>à n'importe quel moment de la vie du prêt</strong>, ce qui ouvre une opportunité d'économies considérable pour tous les emprunteurs.</p>

    <h3>Pourquoi passer par un courtier pour votre assurance emprunteur ?</h3>
    <p>Les contrats groupe proposés par les banques sont souvent <strong>2 à 3 fois plus chers</strong> qu'une assurance individuelle en délégation. Un courtier compare les offres du marché, vérifie l'<strong>équivalence des garanties</strong> (condition imposée par la loi pour que la banque accepte le changement), et gère toute la procédure administrative à votre place. C'est gratuit, rapide et sans risque pour votre prêt en cours.</p>

    <p>Ne laissez pas votre banque décider pour vous. <strong>Comparez gratuitement</strong> et découvrez combien vous pouvez économiser sur votre assurance emprunteur.</p>
  `;

  return (
    <SEOLandingPage
      title="Assurance Emprunteur : Définition, Loi Lemoine & Devis"
      metaDescription="Assurance emprunteur : définition, garanties et loi Lemoine 2026. Changez à tout moment et économisez jusqu'à 15 000€. Devis gratuit."
      keyword="assurance emprunteur"
      keywords="assurance emprunteur définition, assurance de prêt immobilier, délégation assurance emprunteur, loi Lemoine assurance emprunteur, changer assurance emprunteur"
      canonical="https://www.jemassuremoinscher.fr/assurance-emprunteur"
      heroIcon={Landmark}
      heroTitle="Assurance Emprunteur : Économisez jusqu'à 15 000 € sur Votre Prêt"
      heroSubtitle="Grâce à la loi Lemoine, changez d'assurance emprunteur à tout moment. Nos courtiers comparent 30+ assureurs pour réduire votre prime."
      ctaLabel="Calculer mes économies"
      ctaLink="/assurance-pret"
      contentTitle="Assurance emprunteur : tout comprendre pour mieux choisir"
      contentBody={contentBody}
      advantages={advantages}
      faqTitle="FAQ – Assurance Emprunteur"
      faqs={faqs}
      breadcrumbs={[
        { name: "Accueil", url: "https://www.jemassuremoinscher.fr/" },
        { name: "Assurance Prêt", url: "https://www.jemassuremoinscher.fr/assurance-pret" },
        { name: "Assurance Emprunteur", url: "https://www.jemassuremoinscher.fr/assurance-emprunteur" },
      ]}
      bottomCtaTitle="Changez d'assurance emprunteur et économisez"
      bottomCtaDescription="Loi Lemoine : résiliez à tout moment. Nos courtiers trouvent la meilleure offre en garanties équivalentes."
      bottomCtaLabel="Comparer gratuitement"
      bottomCtaLink="/assurance-pret"
    />
  );
};

export default AssuranceEmprunteurSEO;
