import VerticalInsurancePage from "@/components/insurance/VerticalInsurancePage";
import BrandName from "@/components/BrandName";
import arthurThumbsUp from "@/assets/mascotte/arthur-thumbs-up.webp";
import {
  SeniorIntro,
  SeniorAuto,
  SeniorSante,
  SeniorEmprunteur,
  SeniorExpatriationSortante,
  SeniorExpatriationEntrante,
  SeniorSourcesNote,
} from "@/components/insurance/SeniorGuideSections";

// Schéma WebPage : cette page est une synthèse qui pointe vers 5
// contenus déjà en ligne (voir SeniorGuideSections.tsx), pas un contenu
// isolé de plus. Mise à jour le 23 septembre 2026.
const seniorWebPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://www.jemassuremoinscher.fr/assurance-senior#webpage",
  "url": "https://www.jemassuremoinscher.fr/assurance-senior",
  "name": "Assurance senior : auto, santé, emprunteur, expatriation",
  "inLanguage": "fr-FR",
  "dateModified": "2026-09-23",
};

const AssuranceSenior = () => (
  <VerticalInsurancePage
    slug="senior"
    extraSchemas={[seniorWebPageSchema]}
    extraSection={
      <>
        <SeniorIntro />
        <SeniorAuto />
        <SeniorSante />
        <SeniorEmprunteur />
        <SeniorExpatriationSortante />
        <SeniorExpatriationEntrante />
        <SeniorSourcesNote />
      </>
    }
    breadcrumbLabel="Assurance Senior"
    heroImage={arthurThumbsUp}
    heroAlt="Arthur accompagne les seniors"
    heroTitle="Assurance senior : le point sur chaque situation"
    heroSubtitle="Il n'existe pas UNE assurance senior : auto, santé, emprunteur, expatriation dans un sens ou l'autre. On vous oriente vers le contenu qui correspond à votre situation."
    seoTitle="Assurance Senior 2026 | Auto, santé, emprunteur, expatriation"
    seoDescription="Assurance senior : pas un produit unique. Auto après 75 ans, mutuelle santé, emprunteur et risque aggravé, expatriation à la retraite — on vous oriente."
    canonical="https://www.jemassuremoinscher.fr/assurance-senior"
    keyword="assurance senior"
    keywords="assurance senior, assurance auto senior, mutuelle senior, assurance emprunteur senior, retraite étranger"
    insuranceType="comparateur"
    courtierProduct="senior"
    serviceName="Assurance Senior"
    serviceDescription="Point de synthèse sur les différentes situations d'assurance pour les seniors : auto, santé, emprunteur, expatriation."
    productCategory="Assurance Particuliers"
    expertiseLabel="assurance senior"
    faqs={[
      { question: "Existe-t-il un contrat \"assurance senior\" unique ?", answer: "Non. Selon votre situation, vous relevez de l'assurance auto (profil 75+), de la mutuelle santé, de l'assurance emprunteur, ou de règles spécifiques à l'expatriation à la retraite. Chaque situation a ses propres règles." },
      { question: "L'âge est-il un motif de refus d'assurance auto ?", answer: "Non, l'âge n'est pas un motif légal de refus en France. Certains assureurs demandent une visite médicale à partir de 75-80 ans, sans que ce soit une obligation légale du permis B." },
      { question: "Un senior expatrié doit-il changer d'assurance ?", answer: "Oui, généralement. La couverture santé, l'assurance habitation et parfois l'assurance auto suivent des règles différentes à l'étranger — dans les deux sens (partir de France ou s'y installer)." },
    ]}
    enBrefFacts={[
      <><BrandName /> vous oriente selon votre situation de senior.</>,
      "Pas de produit unique : auto, santé, emprunteur, expatriation ont chacun leurs règles.",
      "Cette page pointe vers nos guides détaillés plutôt que de les dupliquer.",
      "Le bouton ci-dessous ouvre notre comparateur général : vous y choisissez vous-même le type de contrat.",
    ]}
    ctaTitle="Prêt à comparer votre assurance senior ?"
    ctaDescription="Ouvre notre comparateur général — vous choisissez le type de contrat qui correspond à votre situation."
  />
);
export default AssuranceSenior;
