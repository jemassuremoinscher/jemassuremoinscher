import VerticalInsurancePage from "@/components/insurance/VerticalInsurancePage";
import BrandName from "@/components/BrandName";
import arthurClimbing from "@/assets/mascotte/arthur-climbing.webp";
import {
  CoachSportifQualification,
  CoachSportifAssuranceRC,
  CoachSportifSourcesNote,
} from "@/components/insurance/CoachSportifGuideSections";

// Schéma WebPage avec citation des sources du contenu de fond. Sources
// lues le 23 septembre 2026.
const coachSportifWebPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://www.jemassuremoinscher.fr/assurance-coach-sportif#webpage",
  "url": "https://www.jemassuremoinscher.fr/assurance-coach-sportif",
  "name": "Assurance coach sportif : qualification, carte pro, RC pro",
  "inLanguage": "fr-FR",
  "dateModified": "2026-09-23",
  "citation": [
    { "@type": "CreativeWork", "name": "Code du sport — article L212-1", "url": "https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000037388193" },
    { "@type": "CreativeWork", "name": "Code du sport — article L212-8", "url": "https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000047941858" },
    { "@type": "CreativeWork", "name": "Code du sport — article L321-1", "url": "https://www.legifrance.gouv.fr/codes/section_lc/LEGITEXT000006071318/LEGISCTA000006151574/" },
  ],
};

const AssuranceCoachSportif = () => (
  <VerticalInsurancePage
    slug="coach-sportif"
    extraSchemas={[coachSportifWebPageSchema]}
    extraSection={
      <>
        <CoachSportifQualification />
        <CoachSportifAssuranceRC />
        <CoachSportifSourcesNote />
      </>
    }
    breadcrumbLabel="Assurance Coach Sportif"
    heroImage={arthurClimbing}
    heroAlt="Arthur, coach sportif"
    heroTitle="Assurance coach sportif : ce qu'il faut savoir"
    heroSubtitle="Qualification obligatoire, carte professionnelle, RC pro : le point sourcé sur les textes officiels — avec une nuance importante sur ce qui est vraiment obligatoire pour l'indépendant."
    seoTitle="Assurance Coach Sportif 2026 | Qualification, carte pro, RC pro"
    seoDescription="Coach sportif indépendant : qualification obligatoire (Code du sport), carte professionnelle, RC pro. Ce que disent vraiment les textes, sans prix inventé."
    canonical="https://www.jemassuremoinscher.fr/assurance-coach-sportif"
    keyword="assurance coach sportif"
    keywords="assurance coach sportif, rc pro coach sportif, carte professionnelle éducateur sportif, assurance coach yoga"
    insuranceType="comparateur"
    courtierProduct="coach-sportif"
    serviceName="Assurance Coach Sportif"
    serviceDescription="Réglementation et assurance responsabilité civile pour coachs sportifs indépendants : qualification, carte professionnelle, textes officiels."
    productCategory="Assurance Professionnelle"
    expertiseLabel="assurance coach sportif"
    faqs={[
      { question: "Faut-il un diplôme pour être coach sportif rémunéré ?", answer: "Oui. Seules les personnes titulaires d'un diplôme, titre professionnel ou certificat de qualification reconnu peuvent enseigner, animer ou encadrer une activité physique ou sportive contre rémunération (Code du sport, article L212-1)." },
      { question: "Quelle sanction en cas d'exercice sans qualification ?", answer: "Un an d'emprisonnement et 15 000 € d'amende, y compris pour le fait d'utiliser les titres de professeur, moniteur, éducateur, entraîneur ou animateur sans les détenir (article L212-8)." },
      { question: "La RC pro est-elle obligatoire pour un coach sportif indépendant ?", answer: "Pas au sens strict d'un texte qui la nomme. L'article L321-1 du Code du sport impose l'assurance RC aux associations, sociétés et fédérations sportives — pas à l'éducateur individuel sans établissement propre. Sa responsabilité civile de droit commun l'expose néanmoins en cas de faute professionnelle, ce qui rend cette assurance fortement recommandée et quasi systématiquement exigée par les salles partenaires." },
      { question: "Combien coûte une RC pro coach sportif ?", answer: "Le prix dépend de la discipline, du volume d'élèves et des garanties choisies, et varie d'un assureur à l'autre. Nous ne publions pas de fourchette de prix : comparez des devis établis pour votre situation." },
    ]}
    enBrefFacts={[
      <><BrandName /> compare les contrats RC pro pour coachs sportifs indépendants.</>,
      "Qualification obligatoire, carte professionnelle : on fait le point sourcé avec vous.",
      "Sur la RC pro individuelle, aucun texte ne l'impose nommément — on vous le dit plutôt que d'inventer une obligation.",
      "Le bouton ci-dessous ouvre notre comparateur général : vous y choisissez vous-même le type de contrat.",
    ]}
    ctaTitle="Prêt à comparer votre RC pro coach sportif ?"
    ctaDescription="Ouvre notre comparateur général — vous choisissez le type de contrat qui correspond à votre situation."
  />
);
export default AssuranceCoachSportif;
