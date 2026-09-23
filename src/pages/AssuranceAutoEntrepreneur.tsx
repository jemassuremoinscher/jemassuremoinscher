import VerticalInsurancePage from "@/components/insurance/VerticalInsurancePage";
import BrandName from "@/components/BrandName";
import arthurBusiness from "@/assets/mascotte/arthur-business.webp";
import {
  AutoEntrepreneurStatutVsActivite,
  AutoEntrepreneurSourcesNote,
} from "@/components/insurance/AutoEntrepreneurGuideSections";

// Schéma WebPage avec citation des sources du contenu de fond. Sources
// lues le 23 septembre 2026.
const autoEntrepreneurWebPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://www.jemassuremoinscher.fr/assurance-auto-entrepreneur#webpage",
  "url": "https://www.jemassuremoinscher.fr/assurance-auto-entrepreneur",
  "name": "Assurance auto-entrepreneur : RC pro selon votre activité",
  "inLanguage": "fr-FR",
  "dateModified": "2026-09-23",
  "citation": [
    { "@type": "CreativeWork", "name": "Code des assurances — articles L241-1 à L243-9", "url": "https://www.legifrance.gouv.fr/codes/section_lc/LEGITEXT000006073984/LEGISCTA000006142820/" },
    { "@type": "CreativeWork", "name": "Code des assurances — article L243-3", "url": "https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006796023" },
    { "@type": "CreativeWork", "name": "INPI — annuaire des activités et professions réglementées", "url": "https://www.inpi.fr/ressources/formalites-dentreprises/types-dactivites-possibles-en-tant-que-micro-entrepreneur" },
  ],
};

const AssuranceAutoEntrepreneur = () => (
  <VerticalInsurancePage
    slug="auto-entrepreneur"
    extraSchemas={[autoEntrepreneurWebPageSchema]}
    extraSection={
      <>
        <AutoEntrepreneurStatutVsActivite />
        <AutoEntrepreneurSourcesNote />
      </>
    }
    breadcrumbLabel="Assurance Auto-Entrepreneur"
    heroImage={arthurBusiness}
    heroAlt="Arthur, auto-entrepreneur"
    heroTitle="Assurance auto-entrepreneur : ce qu'il faut savoir"
    heroSubtitle="C'est votre activité qui détermine l'obligation de RC pro, pas votre statut d'auto-entrepreneur. Le point sourcé, sans généralisation abusive."
    seoTitle="Assurance Auto-Entrepreneur 2026 | RC pro selon votre activité"
    seoDescription="Auto-entrepreneur : la RC pro est-elle obligatoire ? Ça dépend de votre activité, pas de votre statut. Ce que disent vraiment les textes."
    canonical="https://www.jemassuremoinscher.fr/assurance-auto-entrepreneur"
    keyword="assurance auto entrepreneur"
    keywords="assurance auto entrepreneur, rc pro auto entrepreneur, assurance micro entreprise"
    insuranceType="comparateur"
    courtierProduct="auto-entrepreneur"
    serviceName="Assurance Auto-Entrepreneur"
    serviceDescription="Obligation de responsabilité civile professionnelle pour auto-entrepreneurs selon leur activité déclarée : textes officiels, sans généralisation."
    productCategory="Assurance Professionnelle"
    expertiseLabel="assurance auto-entrepreneur"
    faqs={[
      { question: "La RC pro est-elle obligatoire pour tout auto-entrepreneur ?", answer: "Non, ça dépend de votre activité, pas de votre statut. Obligatoire pour le BTP (garantie décennale) et certaines activités réglementées avec leur propre texte (tourisme, santé, juridique, financier) ; recommandée mais pas légalement imposée pour la majorité des autres activités (conseil, création, prestations de service)." },
      { question: "Comment savoir si mon activité d'auto-entrepreneur est concernée ?", answer: "Consultez l'annuaire des activités et professions réglementées de l'INPI, qui recense au cas par cas les activités soumises à une obligation légale." },
      { question: "Que se passe-t-il en cas de défaut d'assurance décennale en auto-entrepreneur BTP ?", answer: "6 mois d'emprisonnement et 75 000 € d'amende, ou l'une des deux peines seulement (Code des assurances, article L243-3)." },
    ]}
    enBrefFacts={[
      <><BrandName /> compare les contrats RC pro pour auto-entrepreneurs.</>,
      "C'est votre activité qui détermine l'obligation, pas votre statut d'auto-entrepreneur.",
      "On vous dit clairement quand la loi l'impose et quand elle ne l'impose pas, plutôt que de généraliser.",
      "Le bouton ci-dessous ouvre notre comparateur général : vous y choisissez vous-même le type de contrat.",
    ]}
    ctaTitle="Prêt à comparer votre RC pro auto-entrepreneur ?"
    ctaDescription="Ouvre notre comparateur général — vous choisissez le type de contrat qui correspond à votre situation."
  />
);
export default AssuranceAutoEntrepreneur;
