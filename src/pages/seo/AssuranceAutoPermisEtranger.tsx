import { Globe, ShieldCheck, Euro, FileCheck } from "lucide-react";
import SEOLandingPage from "@/components/landing/SEOLandingPage";

const AssuranceAutoPermisEtranger = () => {
  const advantages = [
    {
      icon: Globe,
      title: "Permis étrangers acceptés",
      description:
        "Nos assureurs partenaires couvrent les conducteurs titulaires d'un permis étranger, européen ou international.",
    },
    {
      icon: Euro,
      title: "Tarifs négociés",
      description:
        "Nous comparons 30+ compagnies pour trouver les offres qui acceptent votre profil au meilleur prix, sans surprime abusive.",
    },
    {
      icon: FileCheck,
      title: "Accompagnement complet",
      description:
        "Nos courtiers vous guident dans les démarches : validité du permis, échange de titre, documents nécessaires.",
    },
  ];

  const faqs = [
    {
      question: "Peut-on conduire en France avec un permis étranger ?",
      answer:
        "Oui, sous conditions. Un permis délivré par un pays de l'UE/EEE est valable sans limitation. Un permis hors UE est utilisable pendant 1 an après l'installation en France (ou 18 mois selon les accords bilatéraux). Passé ce délai, un échange de permis ou le passage du permis français est obligatoire. Pendant la période de validité, vous pouvez souscrire une assurance auto en France avec votre permis étranger.",
    },
    {
      question: "Quels documents fournir pour assurer une voiture avec un permis étranger ?",
      answer:
        "Les assureurs demandent généralement : votre permis de conduire étranger en cours de validité, une traduction officielle (sauf permis UE), un justificatif de domicile en France, la carte grise du véhicule à assurer, et un relevé d'information de votre précédent assureur si vous aviez un historique de conduite. Un courtier peut vous aider à constituer votre dossier complet.",
    },
    {
      question: "L'assurance auto est-elle plus chère avec un permis étranger ?",
      answer:
        "Pas nécessairement. Les tarifs dépendent de votre expérience de conduite, de votre historique de sinistres et du véhicule à assurer. Certains assureurs appliquent un coefficient majoré par manque d'antécédents français, mais un courtier identifie les compagnies les plus compétitives pour votre profil. Un relevé d'information étranger peut aider à faire valoir votre bonus acquis à l'étranger.",
    },
  ];

  const contentBody = `
    <p>Vous êtes titulaire d'un <strong>permis de conduire étranger</strong> et souhaitez assurer un véhicule en France ? Que vous soyez expatrié, étudiant international ou nouveau résident, trouver une <strong>assurance auto avec un permis étranger</strong> peut s'avérer compliqué. De nombreux assureurs refusent les profils sans historique de conduite français.</p>

    <p>Chez <strong>jemassuremoinscher.fr</strong>, nos courtiers sont spécialisés dans les profils atypiques. Nous travaillons avec plus de 30 assureurs partenaires, dont plusieurs acceptent les <strong>permis étrangers (UE, international et hors UE)</strong>, pour vous proposer une couverture adaptée au meilleur tarif.</p>

    <h3>Permis étranger en France : les règles à connaître</h3>
    <p>La validité de votre permis étranger en France dépend de son pays d'émission :</p>
    <ul>
      <li><strong>Permis UE/EEE</strong> : reconnu sans limitation de durée. Aucune démarche nécessaire pour conduire et s'assurer.</li>
      <li><strong>Permis hors UE avec accord bilatéral</strong> (Suisse, Québec, Japon, etc.) : échangeable contre un permis français sans repasser l'examen. Valable 1 an après l'installation.</li>
      <li><strong>Permis hors UE sans accord</strong> : utilisable pendant 1 an. Après ce délai, il faut passer le permis français.</li>
    </ul>

    <h3>Comment trouver une assurance auto avec un permis étranger ?</h3>
    <p>Le principal obstacle est l'absence de <strong>relevé d'information français</strong>. Ce document retrace votre historique d'assurance et votre coefficient bonus-malus. Sans lui, les assureurs vous considèrent comme un conducteur « sans antécédent », ce qui peut majorer la prime. Nos courtiers contournent cette difficulté en :</p>
    <ul>
      <li>Identifiant les assureurs qui acceptent les <strong>relevés d'information étrangers</strong></li>
      <li>Négociant la prise en compte de votre <strong>expérience de conduite à l'étranger</strong></li>
      <li>Sélectionnant les compagnies avec les <strong>tarifs les plus compétitifs</strong> pour les profils internationaux</li>
    </ul>

    <h3>Les pièces à préparer pour votre devis</h3>
    <p>Pour obtenir un devis rapide, munissez-vous de : votre permis de conduire étranger, une traduction assermentée (si hors UE), un justificatif de domicile en France, la carte grise du véhicule, et si possible un relevé d'information de votre assureur précédent. Notre équipe vous accompagne à chaque étape pour <strong>finaliser votre souscription sans stress</strong>.</p>

    <p>Ne restez pas sans assurance. <strong>Demandez votre devis gratuit</strong> et roulez en toute légalité avec un permis étranger en France.</p>
  `;

  return (
    <SEOLandingPage
      title="Assurance Auto Permis Étranger | Devis Gratuit"
      metaDescription="Assurance auto avec permis étranger en France. Permis UE, international ou hors UE acceptés. 30+ assureurs comparés. Devis gratuit."
      keyword="assurance auto permis étranger"
      keywords="assurance voiture avec permis etranger, assurance permis etranger, permis étranger assurance auto France, permis international assurance"
      canonical="https://www.jemassuremoinscher.fr/assurance-auto-permis-etranger"
      heroIcon={Globe}
      heroTitle="Assurance Auto avec Permis Étranger : Trouvez Votre Couverture"
      heroSubtitle="Permis étranger, UE ou international ? Nos courtiers trouvent les assureurs qui acceptent votre profil au meilleur prix. Devis gratuit en 2 min."
      ctaLabel="Obtenir mon devis gratuit"
      ctaLink="/assurance-auto"
      contentTitle="Comment assurer sa voiture avec un permis étranger en France ?"
      contentBody={contentBody}
      advantages={advantages}
      faqTitle="FAQ – Assurance Auto Permis Étranger"
      faqs={faqs}
      breadcrumbs={[
        { name: "Accueil", url: "https://www.jemassuremoinscher.fr/" },
        { name: "Assurance Auto", url: "https://www.jemassuremoinscher.fr/assurance-auto" },
        { name: "Permis Étranger", url: "https://www.jemassuremoinscher.fr/assurance-auto-permis-etranger" },
      ]}
      bottomCtaTitle="Permis étranger ? Roulez assuré dès aujourd'hui"
      bottomCtaDescription="Nos courtiers identifient les assureurs qui acceptent votre permis étranger et négocient le meilleur tarif."
      bottomCtaLabel="Comparer les offres maintenant"
      bottomCtaLink="/assurance-auto"
    />
  );
};

export default AssuranceAutoPermisEtranger;
