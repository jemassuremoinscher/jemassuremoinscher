import VerticalInsurancePage from "@/components/insurance/VerticalInsurancePage";
import BrandName from "@/components/BrandName";
import arthurBtp from "@/assets/mascotte/arthur-btp.webp";

const AssuranceDecennale = () => (
  <VerticalInsurancePage
    slug="decennale"
    breadcrumbLabel="Garantie Décennale BTP"
    heroImage={arthurBtp}
    heroAlt="Arthur garantie décennale BTP"
    heroTitle="Assurance décennale BTP obligatoire"
    heroSubtitle="Maçon, plombier, électricien, artisan du bâtiment… Obtenez votre attestation décennale en 48h et au meilleur prix."
    seoTitle="Assurance décennale BTP 2026 | Comparateur artisans"
    seoDescription="Comparez les meilleures assurances décennales pour artisans du BTP. Attestation 48h. Tarifs dès 80€/mois selon métier."
    canonical="https://www.jemassuremoinscher.fr/assurance-decennale"
    keyword="assurance décennale"
    keywords="assurance décennale, garantie décennale, RC décennale, assurance artisan BTP"
    insuranceType="rc_pro"
    productKey="rc-pro"
    serviceName="Assurance Décennale BTP"
    serviceDescription="Comparateur d'assurance décennale pour artisans et entreprises du bâtiment. Attestation rapide, tarifs négociés."
    productCategory="Assurance Professionnelle"
    expertiseLabel="assurance décennale"
    faqs={[
      { question: "La décennale est-elle obligatoire ?", answer: "Oui pour tout professionnel du bâtiment (artisan, micro-entreprise, société) intervenant sur des travaux de construction ou de rénovation lourde, depuis la loi Spinetta de 1978." },
      { question: "Combien coûte une décennale ?", answer: "Entre 80€ et 400€/mois selon le métier (maçon, électricien…), le CA et l'expérience. Les métiers du gros œuvre sont plus chers." },
      { question: "Quelle est la durée de la garantie ?", answer: "10 ans à compter de la réception des travaux. La garantie couvre les dommages compromettant la solidité de l'ouvrage." },
      { question: "Puis-je démarrer mes chantiers sans attestation ?", answer: "Non, l'attestation doit être présentée avant tout chantier. Travailler sans est passible de 75 000€ d'amende et 6 mois de prison." },
    ]}
    enBrefFacts={[
      <><BrandName /> compare les assureurs spécialistes décennale BTP.</>,
      "Attestation décennale en 48h après validation du dossier.",
      "Tous corps de métier : maçon, plombier, électricien, couvreur, plaquiste…",
      "Tarifs négociés dès 80€/mois selon le métier.",
    ]}
    ctaTitle="Prêt à obtenir votre attestation décennale ?"
    ctaDescription="Devis gratuit en 2 minutes pour artisans et entreprises du BTP."
  />
);
export default AssuranceDecennale;
