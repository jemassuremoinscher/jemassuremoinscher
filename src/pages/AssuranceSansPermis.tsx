import VerticalInsurancePage from "@/components/insurance/VerticalInsurancePage";
import BrandName from "@/components/BrandName";
import arthurCar from "@/assets/mascotte/arthur-car.webp";

const LandingSansPermis = () => (
  <VerticalInsurancePage
    slug="sans-permis"
    breadcrumbLabel="Assurance Voiture Sans Permis"
    heroImage={arthurCar}
    heroAlt="Arthur avec voiture sans permis"
    heroTitle="Assurance voiture sans permis (VSP) moins chère"
    heroSubtitle="Aixam, Ligier, Microcar, Chatenet… Comparez les meilleures offres VSP et économisez jusqu'à 35% en 2 minutes."
    seoTitle="Assurance voiture sans permis 2026 | Comparateur VSP"
    seoDescription="Comparez les assurances voiture sans permis (Aixam, Ligier, Microcar). Devis gratuit en 2 min. Dès 22€/mois. Tiers, intermédiaire, tous risques."
    canonical="https://www.jemassuremoinscher.fr/landing/sans-permis"
    keyword="assurance voiture sans permis"
    keywords="assurance VSP, assurance voiturette, assurance Aixam, assurance Ligier, assurance sans permis pas cher"
    insuranceType="auto"
    productKey="auto"
    serviceName="Assurance Voiture Sans Permis"
    serviceDescription="Comparateur d'assurance VSP (voiturette). Aixam, Ligier, Microcar, Chatenet. Devis gratuit en 2 minutes."
    productCategory="Assurance Automobile"
    expertiseLabel="assurance voiture sans permis"
    faqs={[
      { question: "L'assurance VSP est-elle obligatoire ?", answer: "Oui, comme toute auto, la responsabilité civile est obligatoire pour circuler en voiture sans permis sur la voie publique." },
      { question: "Quel est le prix d'une assurance VSP ?", answer: "En moyenne entre 22€ et 60€/mois selon le profil (âge, antécédents) et la formule choisie (tiers, intermédiaire, tous risques)." },
      { question: "Peut-on assurer une VSP à 14 ans ?", answer: "Oui, dès l'obtention du permis AM (BSR), un adolescent peut conduire et assurer une VSP. Le contrat est souvent souscrit par un parent." },
      { question: "Quelles garanties choisir pour une VSP ?", answer: "Tiers minimum obligatoire. La formule intermédiaire (vol/incendie) est conseillée. Tous risques utile pour une VSP neuve ou récente." },
    ]}
    enBrefFacts={[
      <><BrandName /> compare les contrats VSP des principaux assureurs.</>,
      "Tarifs dès 22€/mois selon le profil et la voiturette.",
      "Aixam, Ligier, Microcar, Chatenet, Bellier, Casalini : tous modèles assurés.",
      "Devis gratuit en moins de 2 minutes, sans engagement.",
    ]}
    ctaTitle="Prêt à économiser sur votre assurance sans permis ?"
    ctaDescription="Comparez en 2 minutes les meilleures offres VSP du marché."
  />
);
export default LandingSansPermis;
