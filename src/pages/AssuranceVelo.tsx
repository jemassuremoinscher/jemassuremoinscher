import VerticalInsurancePage from "@/components/insurance/VerticalInsurancePage";
import BrandName from "@/components/BrandName";
import arthurBike from "@/assets/mascotte/arthur-bike.png";

const AssuranceVelo = () => (
  <VerticalInsurancePage
    slug="velo"
    breadcrumbLabel="Assurance Vélo & VAE"
    heroImage={arthurBike}
    heroAlt="Arthur à vélo"
    heroTitle="Assurance vélo & VAE (vélo électrique)"
    heroSubtitle="Vol, casse, assistance, responsabilité civile : protégez votre vélo musculaire ou électrique dès 4€/mois."
    seoTitle="Assurance vélo & VAE 2026 | Comparateur vol & casse"
    seoDescription="Comparez les meilleures assurances vélo et VAE. Garanties vol, casse, dommages, RC. Dès 4€/mois. Devis gratuit en 2 minutes."
    canonical="https://www.jemassuremoinscher.fr/assurance-velo"
    keyword="assurance vélo"
    keywords="assurance vélo, assurance VAE, assurance vélo électrique, vol vélo, assurance vélo cargo"
    insuranceType="velo"
    serviceName="Assurance Vélo & VAE"
    serviceDescription="Comparateur d'assurance vélo et vélo à assistance électrique (VAE). Garanties vol, casse, assistance."
    productCategory="Assurance Mobilité"
    expertiseLabel="assurance vélo"
    faqs={[
      { question: "L'assurance vélo est-elle obligatoire ?", answer: "Non, sauf pour certains speed-bikes (>25 km/h) qui nécessitent une RC moto. Une RC vie privée couvre la responsabilité civile à vélo." },
      { question: "Que couvre une assurance vélo ?", answer: "Principalement le vol (avec antivol agréé), la casse accidentelle, le vandalisme, et l'assistance/dépannage. Souvent avec RC complémentaire." },
      { question: "Combien coûte une assurance VAE ?", answer: "Entre 4€ et 25€/mois selon la valeur du vélo (musculaire 600€ vs VAE 3000€) et les garanties choisies." },
      { question: "L'assurance habitation couvre-t-elle le vol de vélo ?", answer: "Oui à domicile, mais rarement à l'extérieur. Une assurance vélo dédiée couvre partout (rue, transport, voyage)." },
    ]}
    enBrefFacts={[
      // "Cyclassur, Sharelock, Qover" retiré : aucun n'est un partenaire réel
      // du site (cf. Partners.tsx) — formulation générique en attendant de
      // confirmer les vrais partenaires vélo avec Paul.
      <><BrandName /> compare les offres d'assurance vélo adaptées à votre profil.</>,
      "Garantie vol valable partout, y compris en extérieur.",
      "VAE, cargo, pliant, speed-bike : tous types couverts.",
      "Tarifs dès 4€/mois pour un vélo musculaire.",
    ]}
    ctaTitle="Prêt à protéger votre vélo dès aujourd'hui ?"
    ctaDescription="Comparez les assurances vélo en 2 minutes, gratuitement."
  />
);
export default AssuranceVelo;
