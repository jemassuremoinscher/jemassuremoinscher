import VerticalInsurancePage from "@/components/insurance/VerticalInsurancePage";
import BrandName from "@/components/BrandName";
import arthurCar from "@/assets/mascotte/arthur-car.webp?w=480&format=webp";
import {
  VtcReglementation,
  VtcAssuranceObligatoire,
  VtcMarche,
  VtcSourcesNote,
} from "@/components/insurance/VtcGuideSections";

// Schéma WebPage avec citation des sources du contenu de fond (même pattern
// que les autres pages piliers). Sources lues le 23 septembre 2026. Pas de
// schéma HowTo : aucun formulaire de devis VTC dédié n'existe (voir
// VtcGuideSections.tsx).
const vtcWebPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://www.jemassuremoinscher.fr/assurance-vtc#webpage",
  "url": "https://www.jemassuremoinscher.fr/assurance-vtc",
  "name": "Assurance VTC : réglementation, carte professionnelle, RC pro",
  "inLanguage": "fr-FR",
  "dateModified": "2026-09-23",
  "citation": [
    { "@type": "CreativeWork", "name": "Code des transports — article L3120-1", "url": "https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000029530535" },
    { "@type": "CreativeWork", "name": "Code des transports — article L3120-2-2", "url": "https://www.legifrance.gouv.fr/affichCodeArticle.do?cidTexte=LEGITEXT000023086525&idArticle=LEGIARTI000033738163" },
    { "@type": "CreativeWork", "name": "Code des transports — article L3120-4", "url": "https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000033745494" },
    { "@type": "CreativeWork", "name": "Code des transports — article L3122-3", "url": "https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000043154009" },
    { "@type": "CreativeWork", "name": "service-public.gouv.fr — Devenir chauffeur de VTC", "url": "https://entreprendre.service-public.gouv.fr/vosdroits/F31027" },
    { "@type": "CreativeWork", "name": "SDES — Les chauffeurs des plateformes de VTC en 2024", "url": "https://www.statistiques.developpement-durable.gouv.fr/les-chauffeurs-des-plateformes-de-vtc-en-2024-premiers-resultats" },
  ],
};

const AssuranceVtc = () => (
  <VerticalInsurancePage
    slug="vtc"
    extraSchemas={[vtcWebPageSchema]}
    extraSection={
      <>
        <VtcReglementation />
        <VtcAssuranceObligatoire />
        <VtcMarche />
        <VtcSourcesNote />
      </>
    }
    breadcrumbLabel="Assurance VTC"
    heroImage={arthurCar}
    heroAlt="Arthur, chauffeur VTC"
    heroTitle="Assurance VTC : ce qu'il faut savoir"
    heroSubtitle="Carte professionnelle, registre, assurance RC pro obligatoire : les règles à connaître avant de vous lancer, sourcées sur les textes officiels."
    seoTitle="Assurance VTC 2026 | Réglementation, carte pro, RC pro"
    seoDescription="VTC : carte professionnelle, registre, assurance RC pro obligatoire. Ce que disent le Code des transports et service-public.gouv.fr, sans prix inventé."
    canonical="https://www.jemassuremoinscher.fr/assurance-vtc"
    keyword="assurance vtc"
    keywords="assurance vtc, carte professionnelle vtc, rc pro vtc, registre vtc, réglementation vtc"
    insuranceType="comparateur"
    courtierProduct="vtc"
    serviceName="Assurance VTC"
    serviceDescription="Réglementation et assurance RC pro obligatoire pour les chauffeurs VTC : carte professionnelle, registre, textes officiels."
    productCategory="Assurance Professionnelle"
    expertiseLabel="assurance vtc"
    faqs={[
      { question: "Le VTC est-il un statut différent du taxi ?", answer: "Oui. Le VTC (voiture de transport avec chauffeur) est un service de transport de personnes à titre onéreux avec un véhicule de 4 à 9 places, distinct du taxi (Code des transports, article L3120-1)." },
      { question: "Faut-il une carte professionnelle pour conduire un VTC ?", answer: "Oui, délivrée par l'autorité administrative (article L3120-2-2, loi du 29 décembre 2016). Elle suppose le permis B depuis 3 ans (2 ans si conduite accompagnée), un casier judiciaire sans certaines condamnations, un contrôle médical favorable et la réussite d'un examen théorique et pratique, selon service-public.gouv.fr." },
      { question: "L'assurance RC pro est-elle obligatoire pour un chauffeur VTC ?", answer: "Oui. L'article L3120-4 du Code des transports impose de pouvoir justifier à tout moment d'un contrat d'assurance couvrant la responsabilité civile professionnelle. Cette obligation vient de la loi du 1er octobre 2014, un texte différent de celui qui a créé la carte professionnelle. Le défaut d'assurance est puni d'une amende pouvant aller jusqu'à 3 750 €." },
      { question: "Combien coûte une assurance VTC ?", answer: "Le prix dépend du véhicule, du profil du conducteur, de l'activité déclarée et des garanties choisies, et varie d'un assureur à l'autre. Nous ne publions pas de fourchette de prix : comparez des devis établis pour votre situation." },
      { question: "Le marché du VTC est-il en croissance ?", answer: "Oui : selon le SDES, la France comptait environ 71 300 chauffeurs actifs sur les plateformes de VTC en 2024, soit 27 % de plus qu'en 2023 et 51 % de plus qu'en 2022." },
    ]}
    enBrefFacts={[
      <><BrandName /> compare les contrats RC pro pour chauffeurs VTC.</>,
      "Carte professionnelle, registre, assurance obligatoire : on fait le point avec vous.",
      "Le tarif dépend du véhicule et de l'activité déclarée : comparez plusieurs devis.",
      "Le bouton ci-dessous ouvre notre comparateur général : vous y choisissez vous-même le type de contrat.",
    ]}
    ctaTitle="Prêt à comparer votre assurance VTC ?"
    ctaDescription="Ouvre notre comparateur général — vous choisissez le type de contrat qui correspond à votre situation."
  />
);
export default AssuranceVtc;
