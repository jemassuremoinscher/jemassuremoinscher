import VerticalInsurancePage from "@/components/insurance/VerticalInsurancePage";
import BrandName from "@/components/BrandName";
import arthurCar from "@/assets/mascotte/arthur-car.webp";

const AssuranceFlotteAuto = () => (
  <VerticalInsurancePage
    slug="flotte-auto"
    breadcrumbLabel="Assurance Flotte Auto Entreprise"
    heroImage={arthurCar}
    heroAlt="Arthur flotte auto entreprise"
    heroTitle="Assurance flotte auto entreprise (dès 3 véhicules)"
    heroSubtitle="VL, VU, poids lourds, véhicules de fonction : un seul contrat, une seule échéance, une gestion simplifiée et des tarifs négociés."
    seoTitle="Assurance flotte auto entreprise 2026 | Comparateur"
    seoDescription="Comparez les assurances flotte auto entreprise (dès 3 véhicules). Tarifs négociés, gestion centralisée, économies jusqu'à 30%."
    canonical="https://www.jemassuremoinscher.fr/assurance-flotte-auto"
    keyword="assurance flotte auto"
    keywords="assurance flotte auto, assurance flotte entreprise, flotte VL VU, assurance véhicules de société"
    insuranceType="flotte"
    productKey="auto"
    serviceName="Assurance Flotte Auto Entreprise"
    serviceDescription="Comparateur d'assurance flotte auto pour entreprises (3 véhicules et +). Tarifs négociés, gestion simplifiée."
    productCategory="Assurance Professionnelle"
    expertiseLabel="assurance flotte auto"
    faqs={[
      { question: "À partir de combien de véhicules une flotte ?", answer: "Généralement 3 véhicules minimum pour bénéficier d'un contrat flotte unique, avec des conditions tarifaires avantageuses." },
      { question: "Quels avantages versus contrats individuels ?", answer: "Tarifs négociés (–15 à –30%), une seule échéance, gestion centralisée, ajout/retrait de véhicules en cours d'année simplifié." },
      { question: "Peut-on mélanger VL, VU et poids lourds ?", answer: "Oui, un contrat flotte couvre tous types : véhicules légers, utilitaires, poids lourds, véhicules de fonction, et même 2-roues." },
      { question: "Comment est calculée la prime flotte ?", answer: "Selon la sinistralité historique de la flotte, le nombre et type de véhicules, les usages (commercial, transport, fonction)." },
    ]}
    enBrefFacts={[
      <><BrandName /> négocie pour vous les meilleurs tarifs flotte du marché.</>,
      "Économies jusqu'à 30% versus contrats individuels.",
      "Gestion centralisée : 1 échéance, 1 interlocuteur, 1 reporting.",
      "Adapté à toute taille de flotte, dès 3 véhicules.",
    ]}
    ctaTitle="Prêt à optimiser le coût de votre flotte ?"
    ctaDescription="Devis flotte gratuit en 2 minutes. Un expert dédié vous rappelle."
  />
);
export default AssuranceFlotteAuto;
