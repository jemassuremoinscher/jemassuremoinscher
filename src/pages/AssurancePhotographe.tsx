import VerticalInsurancePage from "@/components/insurance/VerticalInsurancePage";
import BrandName from "@/components/BrandName";
import arthurDetective from "@/assets/mascotte/arthur-detective.webp";
import {
  PhotographeCadre,
  PhotographeSourcesNote,
} from "@/components/insurance/PhotographeGuideSections";

const photographeWebPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://www.jemassuremoinscher.fr/assurance-photographe#webpage",
  "url": "https://www.jemassuremoinscher.fr/assurance-photographe",
  "name": "Assurance photographe : RC pro et matériel photo/vidéo",
  "inLanguage": "fr-FR",
  "dateModified": "2026-09-23",
};

const AssurancePhotographe = () => (
  <VerticalInsurancePage
    slug="photographe"
    extraSchemas={[photographeWebPageSchema]}
    extraSection={
      <>
        <PhotographeCadre />
        <PhotographeSourcesNote />
      </>
    }
    breadcrumbLabel="Assurance Photographe"
    heroImage={arthurDetective}
    heroAlt="Arthur, photographe professionnel"
    heroTitle="Assurance photographe : ce qu'il faut savoir"
    heroSubtitle="Métier non réglementé : pas d'obligation légale de RC pro, mais une protection fortement recommandée pour votre activité et votre matériel."
    seoTitle="Assurance Photographe 2026 | RC pro et matériel photo"
    seoDescription="Photographe professionnel : RC pro et garantie matériel photo/vidéo. Métier non réglementé — pas d'obligation légale, mais une protection recommandée."
    canonical="https://www.jemassuremoinscher.fr/assurance-photographe"
    keyword="assurance photographe"
    keywords="assurance photographe, rc pro photographe, assurance matériel photo, assurance vidéaste"
    insuranceType="comparateur"
    courtierProduct="photographe"
    serviceName="Assurance Photographe"
    serviceDescription="RC professionnelle et garantie matériel pour photographes et vidéastes indépendants, métier non réglementé."
    productCategory="Assurance Professionnelle"
    expertiseLabel="assurance photographe"
    faqs={[
      { question: "La RC pro est-elle obligatoire pour un photographe ?", answer: "Non. La photographie n'est pas une profession réglementée en France : aucun texte n'impose de RC pro. Elle reste fortement recommandée en pratique, car votre responsabilité civile de droit commun vous expose en cas de dommage à un client." },
      { question: "La RC pro couvre-t-elle mon matériel photo ?", answer: "Non, pas automatiquement. La RC pro couvre les dommages causés à un tiers, pas votre propre matériel — il faut une option ou un contrat dédié pour la casse, la perte ou le vol de vos boîtiers et objectifs." },
      { question: "Combien coûte une assurance photographe ?", answer: "Le prix dépend du matériel à couvrir, du volume d'activité et des garanties choisies, et varie d'un assureur à l'autre. Nous ne publions pas de fourchette de prix : comparez des devis établis pour votre situation." },
    ]}
    enBrefFacts={[
      <><BrandName /> compare les contrats RC pro et matériel pour photographes.</>,
      "Métier non réglementé : pas d'obligation légale, mais une protection recommandée.",
      "RC pro et garantie matériel sont deux couvertures différentes — on vous explique la distinction.",
      "Le bouton ci-dessous ouvre notre comparateur général : vous y choisissez vous-même le type de contrat.",
    ]}
    ctaTitle="Prêt à comparer votre assurance photographe ?"
    ctaDescription="Ouvre notre comparateur général — vous choisissez le type de contrat qui correspond à votre situation."
  />
);
export default AssurancePhotographe;
