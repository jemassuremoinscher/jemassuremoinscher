import VerticalInsurancePage from "@/components/insurance/VerticalInsurancePage";
import BrandName from "@/components/BrandName";
import arthurFlying from "@/assets/mascotte/arthur-flying.webp?w=480&format=webp";
import {
  DroneEnregistrement,
  DroneAssuranceRC,
  DroneSourcesNote,
} from "@/components/insurance/DroneGuideSections";

// Schéma WebPage avec citation des sources du contenu de fond (même pattern
// que les autres pages piliers). Sources lues le 23 septembre 2026.
const droneWebPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://www.jemassuremoinscher.fr/assurance-drone#webpage",
  "url": "https://www.jemassuremoinscher.fr/assurance-drone",
  "name": "Assurance drone : enregistrement, catégories, assurance RC",
  "inLanguage": "fr-FR",
  "dateModified": "2026-09-23",
  "citation": [
    { "@type": "CreativeWork", "name": "ecologie.gouv.fr — AlphaTango", "url": "https://www.ecologie.gouv.fr/politiques-publiques/alphatango" },
    { "@type": "CreativeWork", "name": "ecologie.gouv.fr — Exploitation de drones en catégorie spécifique", "url": "https://www.ecologie.gouv.fr/politiques-publiques/exploitation-drones-categorie-specifique" },
    { "@type": "CreativeWork", "name": "Code des transports — article L6131-2", "url": "https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000023078395" },
    { "@type": "CreativeWork", "name": "Me Hassan Kohen — assurance drone professionnel", "url": "https://kohenavocats.com/drone-professionnel-dommage-tiers-assurance-sanction-preuve-recours/" },
  ],
};

const AssuranceDrone = () => (
  <VerticalInsurancePage
    slug="drone"
    extraSchemas={[droneWebPageSchema]}
    extraSection={
      <>
        <DroneEnregistrement />
        <DroneAssuranceRC />
        <DroneSourcesNote />
      </>
    }
    breadcrumbLabel="Assurance Drone"
    heroImage={arthurFlying}
    heroAlt="Arthur, télépilote de drone"
    heroTitle="Assurance drone : ce qu'il faut savoir"
    heroSubtitle="Enregistrement AlphaTango, fin des scénarios S1/S2/S3, assurance RC : le point sourcé sur les textes officiels, sans certitude inventée là où la loi est floue."
    seoTitle="Assurance Drone 2026 | Enregistrement, réglementation, RC pro"
    seoDescription="Drone professionnel : enregistrement AlphaTango, catégorie spécifique depuis 2026, assurance RC. Ce que disent vraiment les textes, sans prix inventé."
    canonical="https://www.jemassuremoinscher.fr/assurance-drone"
    keyword="assurance drone"
    keywords="assurance drone, assurance drone professionnel, rc pro drone, alphatango, télépilote"
    insuranceType="comparateur"
    courtierProduct="drone"
    serviceName="Assurance Drone"
    serviceDescription="Réglementation drone et assurance responsabilité civile pour télépilotes professionnels : enregistrement, catégories, textes officiels."
    productCategory="Assurance Professionnelle"
    expertiseLabel="assurance drone"
    faqs={[
      { question: "Faut-il enregistrer son drone ?", answer: "Oui, depuis le 26 décembre 2018, pour tout drone de 800 g ou plus, ou équipé d'un dispositif de signalement électronique, via la plateforme AlphaTango. Exemption pour la catégorie ouverte de moins de 250 g sans capteur de données personnelles." },
      { question: "Les scénarios S1, S2, S3 existent-ils encore ?", answer: "Non. Ils ont cessé d'exister le 1ᵉʳ janvier 2026, remplacés par le cadre européen sur les aéronefs sans équipage (catégories ouverte, spécifique, certifiée)." },
      { question: "L'assurance RC est-elle obligatoire pour un drone professionnel ?", answer: "La réponse n'est pas aussi simple qu'on le présente souvent. Le règlement européen (CE) 785/2004 exclut les aéronefs de moins de 20 kg de son champ, et l'article L6131-2 du Code des transports crée une responsabilité civile stricte de l'exploitant sans imposer formellement une assurance. En pratique, la DGAC traite cette assurance comme obligatoire par interprétation administrative — ce qui, combiné à la responsabilité stricte du L6131-2, en fait une protection indispensable même sans texte unique qui l'impose littéralement." },
      { question: "Combien coûte une assurance drone ?", answer: "Le prix dépend du type d'usage (loisir ou professionnel), du matériel et des garanties choisies, et varie d'un assureur à l'autre. Nous ne publions pas de fourchette de prix : comparez des devis établis pour votre situation." },
    ]}
    enBrefFacts={[
      <><BrandName /> compare les contrats RC pour télépilotes de drones.</>,
      "Enregistrement AlphaTango, catégorie spécifique depuis 2026 : on fait le point avec vous.",
      "Sur l'assurance RC, la loi elle-même est ambiguë pour les drones de moins de 20 kg — on vous le dit plutôt que d'inventer une certitude.",
      "Le bouton ci-dessous ouvre notre comparateur général : vous y choisissez vous-même le type de contrat.",
    ]}
    ctaTitle="Prêt à comparer votre assurance drone ?"
    ctaDescription="Ouvre notre comparateur général — vous choisissez le type de contrat qui correspond à votre situation."
  />
);
export default AssuranceDrone;
