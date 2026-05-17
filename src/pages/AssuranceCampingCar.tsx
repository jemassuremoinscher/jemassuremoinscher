import VerticalInsurancePage from "@/components/insurance/VerticalInsurancePage";
import BrandName from "@/components/BrandName";
import arthurCar from "@/assets/mascotte/arthur-car.webp";

const AssuranceCampingCar = () => (
  <VerticalInsurancePage
    slug="camping-car"
    breadcrumbLabel="Assurance Camping-car & Van"
    heroImage={arthurCar}
    heroAlt="Arthur avec camping-car"
    heroTitle="Assurance camping-car & van aménagé"
    heroSubtitle="Capucine, profilé, intégral, van aménagé… Couvrez votre maison sur roues au juste prix avec une formule adaptée à votre usage."
    seoTitle="Assurance camping-car 2026 | Comparateur van aménagé"
    seoDescription="Comparez les meilleures assurances camping-car et van aménagé. Devis gratuit en 2 min. Garanties contenu, accessoires, hivernage incluses."
    canonical="https://www.jemassuremoinscher.fr/assurance-camping-car"
    keyword="assurance camping-car"
    keywords="assurance camping-car, assurance van aménagé, assurance fourgon, hivernage camping-car"
    insuranceType="auto"
    productKey="auto"
    serviceName="Assurance Camping-car & Van"
    serviceDescription="Comparateur d'assurance camping-car et van aménagé. Garanties spécifiques contenu, accessoires, hivernage."
    productCategory="Assurance Automobile"
    expertiseLabel="assurance camping-car"
    faqs={[
      { question: "Quelles garanties spécifiques pour un camping-car ?", answer: "Au-delà du tiers obligatoire : contenu (effets personnels, vaisselle), accessoires (auvent, panneau solaire), assistance 0 km, et hivernage pour les périodes sans usage." },
      { question: "Combien coûte une assurance camping-car ?", answer: "En moyenne 350 à 900€/an selon la valeur, le type (capucine, intégral) et l'usage (loisir, résidence principale)." },
      { question: "Peut-on suspendre son assurance en hiver ?", answer: "Oui, la plupart des assureurs proposent une formule hivernage à tarif réduit (garage seul) pendant les mois d'inactivité." },
      { question: "Le permis B suffit-il pour un camping-car ?", answer: "Oui jusqu'à 3,5 tonnes. Au-delà, le permis C1 est requis. Cela influe sur la prime d'assurance." },
    ]}
    enBrefFacts={[
      <><BrandName /> compare les assureurs spécialistes camping-car.</>,
      "Garanties hivernage et tous accessoires (auvent, antenne, panneau solaire).",
      "Formules loisirs ou résidence principale disponibles.",
      "Assistance 0 km partout en Europe.",
    ]}
    ctaTitle="Prêt à protéger votre camping-car au meilleur prix ?"
    ctaDescription="Recevez votre devis camping-car en 2 minutes, gratuit et sans engagement."
  />
);
export default AssuranceCampingCar;
