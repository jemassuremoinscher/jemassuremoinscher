import VerticalInsurancePage from "@/components/insurance/VerticalInsurancePage";
import BrandName from "@/components/BrandName";
import arthurBusiness from "@/assets/mascotte/arthur-business.webp";

const AssuranceProtectionJuridique = () => (
  <VerticalInsurancePage
    slug="protection-juridique"
    breadcrumbLabel="Protection Juridique"
    heroImage={arthurBusiness}
    heroAlt="Arthur protection juridique"
    heroTitle="Assurance protection juridique"
    heroSubtitle="Litiges consommation, voisinage, travail, immobilier… Faites-vous défendre par un avocat sans avancer de frais."
    seoTitle="Protection juridique 2026 | Assurance litiges & avocat"
    seoDescription="Comparez les meilleures protections juridiques. Avocats, expertises, frais de justice pris en charge. Dès 8€/mois."
    canonical="https://www.jemassuremoinscher.fr/assurance-protection-juridique"
    keyword="protection juridique"
    keywords="assurance protection juridique, avocat, litige consommation, défense recours"
    insuranceType="rc_pro"
    serviceName="Assurance Protection Juridique"
    serviceDescription="Protection juridique pour litiges du quotidien (consommation, travail, voisinage, immobilier)."
    productCategory="Assurance Juridique"
    expertiseLabel="protection juridique"
    faqs={[
      { question: "Quels litiges sont couverts ?", answer: "Consommation, travail, voisinage, immobilier, fiscal, administratif, santé… selon le contrat. Les litiges familiaux et pénaux graves sont souvent exclus." },
      { question: "Combien coûte une protection juridique ?", answer: "Entre 8€ et 25€/mois pour un particulier. Les contrats pro/entreprise vont de 30 à 150€/mois selon l'activité." },
      { question: "Puis-je choisir mon avocat ?", answer: "Oui, le libre choix de l'avocat est garanti par la loi. L'assureur prend en charge ses honoraires dans la limite du barème contractuel." },
      { question: "Quel est le délai de carence ?", answer: "Généralement 1 à 3 mois selon les garanties. Les litiges nés avant la souscription ne sont pas couverts." },
    ]}
    enBrefFacts={[
      <><BrandName /> compare les contrats de protection juridique particuliers et pros.</>,
      "Libre choix de votre avocat, garanti par la loi.",
      "Prise en charge des frais de justice, expertises, huissiers.",
      "Tarifs dès 8€/mois pour un particulier.",
    ]}
    ctaTitle="Prêt à être défendu sans avancer de frais ?"
    ctaDescription="Comparez en 2 minutes les meilleures protections juridiques."
  />
);
export default AssuranceProtectionJuridique;
