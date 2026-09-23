import VerticalInsurancePage from "@/components/insurance/VerticalInsurancePage";
import BrandName from "@/components/BrandName";
import arthurDetective from "@/assets/mascotte/arthur-detective.webp";
import {
  RcProMicroPasUneRegleUnique,
  RcProMicroSourcesNote,
} from "@/components/insurance/RcProMicroGuideSections";

// Schéma WebPage avec citation des sources du contenu de fond. Sources
// lues le 23 septembre 2026.
const rcProMicroWebPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://www.jemassuremoinscher.fr/assurance-rc-pro-micro-entreprise#webpage",
  "url": "https://www.jemassuremoinscher.fr/assurance-rc-pro-micro-entreprise",
  "name": "RC pro micro-entreprise : quand est-elle vraiment obligatoire ?",
  "inLanguage": "fr-FR",
  "dateModified": "2026-09-23",
  "citation": [
    { "@type": "CreativeWork", "name": "Code des assurances — articles L241-1 à L243-9", "url": "https://www.legifrance.gouv.fr/codes/section_lc/LEGITEXT000006073984/LEGISCTA000006142820/" },
    { "@type": "CreativeWork", "name": "Code des assurances — article L243-3", "url": "https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006796023" },
    { "@type": "CreativeWork", "name": "Code du tourisme — article L211-18", "url": "https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000036242744" },
    { "@type": "CreativeWork", "name": "INPI — annuaire des activités et professions réglementées", "url": "https://www.inpi.fr/ressources/formalites-dentreprises/types-dactivites-possibles-en-tant-que-micro-entrepreneur" },
  ],
};

const AssuranceRcProMicroEntreprise = () => (
  <VerticalInsurancePage
    slug="rc-pro-micro-entreprise"
    extraSchemas={[rcProMicroWebPageSchema]}
    extraSection={
      <>
        <RcProMicroPasUneRegleUnique />
        <RcProMicroSourcesNote />
      </>
    }
    breadcrumbLabel="RC Pro Micro-Entreprise"
    heroImage={arthurDetective}
    heroAlt="Arthur enquête sur votre activité"
    heroTitle="RC pro micro-entreprise : est-elle obligatoire ?"
    heroSubtitle="Il n'existe pas de règle unique : la loi l'impose activité par activité. Le point sourcé sur les textes officiels, sans généralisation abusive."
    seoTitle="RC Pro Micro-Entreprise 2026 | Obligatoire selon votre activité"
    seoDescription="RC pro micro-entreprise : obligatoire pour certaines activités réglementées (BTP, tourisme...), pas pour les autres. Ce que disent vraiment les textes."
    canonical="https://www.jemassuremoinscher.fr/assurance-rc-pro-micro-entreprise"
    keyword="rc pro micro entreprise"
    keywords="rc pro micro entreprise, rc pro obligatoire, assurance auto-entrepreneur, responsabilité civile professionnelle"
    insuranceType="comparateur"
    courtierProduct="rc-pro-micro-entreprise"
    serviceName="RC Pro Micro-Entreprise"
    serviceDescription="Obligation de responsabilité civile professionnelle pour micro-entrepreneurs selon leur activité : textes officiels, sans généralisation."
    productCategory="Assurance Professionnelle"
    expertiseLabel="rc pro micro-entreprise"
    faqs={[
      { question: "La RC pro est-elle obligatoire pour toute micro-entreprise ?", answer: "Non. Il n'existe pas de règle unique : la loi l'impose pour certaines activités réglementées (BTP, tourisme, santé, professions juridiques ou financières, chacune avec son propre texte), et ne l'impose pas pour la majorité des activités non réglementées (conseil, artisanat hors BTP, création, prestations de service)." },
      { question: "Comment savoir si mon activité est concernée ?", answer: "Consultez l'annuaire des activités et professions réglementées de l'INPI, qui recense au cas par cas les activités soumises à une obligation légale." },
      { question: "Quelle sanction en cas de défaut d'assurance pour une activité réglementée du BTP ?", answer: "6 mois d'emprisonnement et 75 000 € d'amende, ou l'une des deux peines seulement (Code des assurances, article L243-3)." },
      { question: "Faut-il souscrire une RC pro même si mon activité n'est pas réglementée ?", answer: "Ce n'est pas une obligation légale, mais c'est une protection recommandée : elle couvre les conséquences financières d'une faute professionnelle causant un dommage à un client ou un tiers." },
    ]}
    enBrefFacts={[
      <><BrandName /> compare les contrats RC pro pour micro-entrepreneurs.</>,
      "Pas de règle unique : l'obligation dépend de votre activité précise.",
      "On vous dit clairement quand la loi l'impose et quand elle ne l'impose pas, plutôt que de généraliser.",
      "Le bouton ci-dessous ouvre notre comparateur général : vous y choisissez vous-même le type de contrat.",
    ]}
    ctaTitle="Prêt à comparer votre RC pro micro-entreprise ?"
    ctaDescription="Ouvre notre comparateur général — vous choisissez le type de contrat qui correspond à votre situation."
  />
);
export default AssuranceRcProMicroEntreprise;
