import VerticalInsurancePage from "@/components/insurance/VerticalInsurancePage";
import BrandName from "@/components/BrandName";
import arthurCar from "@/assets/mascotte/arthur-car.webp?w=480&format=webp";

const AssuranceAutoTemporaire = () => (
  <VerticalInsurancePage
    slug="auto-temporaire"
    breadcrumbLabel="Assurance Auto Temporaire"
    heroImage={arthurCar}
    heroAlt="Arthur avec assurance auto temporaire"
    heroTitle="Assurance auto temporaire (1 jour à 90 jours)"
    heroSubtitle="Besoin d'assurer une voiture pour 1 jour, 1 semaine, 1 mois ? Souscription immédiate, attestation envoyée en 5 minutes."
    seoTitle="Assurance auto temporaire 2026 | 1 jour à 90 jours"
    seoDescription="Souscrivez une assurance auto temporaire de 1 à 90 jours en ligne. Attestation immédiate. Idéal achat, prêt de véhicule, vacances."
    canonical="https://www.jemassuremoinscher.fr/assurance-auto-temporaire"
    keyword="assurance auto temporaire"
    keywords="assurance auto temporaire, assurance 1 jour, assurance courte durée, assurance voiture vacances"
    insuranceType="auto_temporaire"
    courtierProduct="auto-temporaire"
    serviceName="Assurance Auto Temporaire"
    serviceDescription="Assurance auto à la journée, à la semaine ou au mois. Souscription en ligne, attestation immédiate."
    productCategory="Assurance Automobile"
    expertiseLabel="assurance auto temporaire"
    faqs={[
      { question: "Quand souscrire une assurance auto temporaire ?", answer: "À l'achat d'un véhicule (le temps de l'immatriculer), pour un prêt entre amis, des vacances à l'étranger, ou un convoyage." },
      { question: "Quelle est la durée minimale ?", answer: "1 jour. La plupart des assureurs proposent 1, 3, 5, 7, 15, 30, 60 ou 90 jours. Renouvelable une fois." },
      { question: "Combien coûte une assurance temporaire ?", answer: "Le prix dépend de la durée assurée, du véhicule, de la formule et du profil du conducteur, et varie d'un assureur à l'autre. Nous ne publions pas de fourchette de prix : comparez des devis établis pour votre situation." },
      { question: "L'attestation est-elle envoyée immédiatement ?", answer: "Oui, après paiement en ligne et validation du profil, l'attestation et la carte verte arrivent par email en 5 à 15 minutes." },
    ]}
    enBrefFacts={[
      <><BrandName /> compare les assurances temporaires de 1 à 90 jours.</>,
      "Attestation et carte verte envoyées par email en moins de 15 min.",
      "Idéal pour achat occasion, prêt de véhicule, vacances ou convoyage.",
      "Le tarif dépend de la durée, du véhicule et du profil du conducteur.",
    ]}
    ctaTitle="Prêt à assurer votre véhicule pour quelques jours ?"
    ctaDescription="Souscription 100% en ligne, attestation immédiate."
  />
);
export default AssuranceAutoTemporaire;
