import VerticalInsurancePage from "@/components/insurance/VerticalInsurancePage";
import BrandName from "@/components/BrandName";
import arthurExcited from "@/assets/mascotte/arthur-excited.webp";
import {
  InfluenceurCadreLegal,
  InfluenceurAssuranceRC,
  InfluenceurSourcesNote,
} from "@/components/insurance/InfluenceurGuideSections";

// Schéma WebPage avec citation des sources du contenu de fond. Sources
// lues le 23 septembre 2026.
const influenceurWebPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://www.jemassuremoinscher.fr/assurance-influenceur#webpage",
  "url": "https://www.jemassuremoinscher.fr/assurance-influenceur",
  "name": "Assurance influenceur : ce que dit vraiment la loi du 9 juin 2023",
  "inLanguage": "fr-FR",
  "dateModified": "2026-09-23",
  "citation": [
    { "@type": "CreativeWork", "name": "Loi n° 2023-451 du 9 juin 2023 — article 1", "url": "https://www.legifrance.gouv.fr/loda/article_lc/LEGIARTI000050468930" },
    { "@type": "CreativeWork", "name": "Loi n° 2023-451 du 9 juin 2023 — article 9", "url": "https://www.legifrance.gouv.fr/loda/article_lc/LEGIARTI000050468893" },
  ],
};

const AssuranceInfluenceur = () => (
  <VerticalInsurancePage
    slug="influenceur"
    extraSchemas={[influenceurWebPageSchema]}
    extraSection={
      <>
        <InfluenceurCadreLegal />
        <InfluenceurAssuranceRC />
        <InfluenceurSourcesNote />
      </>
    }
    breadcrumbLabel="Assurance Influenceur"
    heroImage={arthurExcited}
    heroAlt="Arthur, créateur de contenu"
    heroTitle="Assurance influenceur : ce qu'il faut vraiment savoir"
    heroSubtitle="La loi du 9 juin 2023 encadre surtout les contrats et la publicité. Sur l'assurance, elle vise un cas précis — pas tous les influenceurs."
    seoTitle="Assurance Influenceur 2026 | Loi du 9 juin 2023, RC pro"
    seoDescription="Influenceur : ce que dit vraiment la loi du 9 juin 2023 sur l'assurance RC pro. Un angle précis (hors UE/EEE/Suisse), pas une obligation générale."
    canonical="https://www.jemassuremoinscher.fr/assurance-influenceur"
    keyword="assurance influenceur"
    keywords="assurance influenceur, rc pro influenceur, loi influenceur 2023, assurance créateur de contenu"
    insuranceType="comparateur"
    courtierProduct="influenceur"
    serviceName="Assurance Influenceur"
    serviceDescription="Cadre légal de l'activité d'influence commerciale et assurance responsabilité civile professionnelle, selon la loi du 9 juin 2023."
    productCategory="Assurance Professionnelle"
    expertiseLabel="assurance influenceur"
    faqs={[
      { question: "Tous les influenceurs doivent-ils souscrire une RC pro ?", answer: "Non. La loi du 9 juin 2023 (article 9, § II) n'impose cette assurance qu'aux influenceurs établis hors Union européenne, Espace économique européen ou Suisse, dont l'activité vise un public français. Un influenceur établi en France n'est pas concerné par cette obligation précise." },
      { question: "Que dit la loi du 9 juin 2023 pour les autres influenceurs ?", answer: "Elle encadre surtout les contrats (écrit obligatoire au-delà d'un certain seuil de rémunération), les mentions publicitaires et l'interdiction de promouvoir certains secteurs — pas l'assurance." },
      { question: "Une RC pro est-elle recommandée même sans obligation légale ?", answer: "Oui, en pratique : elle protège contre les conséquences financières d'un contenu jugé trompeur ou d'un litige avec un annonceur, même quand la loi ne l'impose pas nommément." },
      { question: "Combien coûte une RC pro pour créateur de contenu ?", answer: "Le prix dépend de l'activité, du volume de partenariats et des garanties choisies, et varie d'un assureur à l'autre. Nous ne publions pas de fourchette de prix : comparez des devis établis pour votre situation." },
    ]}
    enBrefFacts={[
      <><BrandName /> compare les contrats RC pro pour créateurs de contenu.</>,
      "La loi du 9 juin 2023 encadre surtout les contrats et la publicité, pas l'assurance en général.",
      "L'obligation d'assurance ne vise qu'un cas précis (hors UE/EEE/Suisse) — on ne la gonfle pas artificiellement.",
      "Le bouton ci-dessous ouvre notre comparateur général : vous y choisissez vous-même le type de contrat.",
    ]}
    ctaTitle="Prêt à comparer votre RC pro influenceur ?"
    ctaDescription="Ouvre notre comparateur général — vous choisissez le type de contrat qui correspond à votre situation."
  />
);
export default AssuranceInfluenceur;
