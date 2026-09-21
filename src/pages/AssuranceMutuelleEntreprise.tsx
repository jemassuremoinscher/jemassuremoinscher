import VerticalInsurancePage from "@/components/insurance/VerticalInsurancePage";
import BrandName from "@/components/BrandName";
import arthurBusiness from "@/assets/mascotte/arthur-business.webp";

const AssuranceMutuelleEntreprise = () => (
  <VerticalInsurancePage
    slug="mutuelle-entreprise"
    breadcrumbLabel="Mutuelle Entreprise (Collective)"
    heroImage={arthurBusiness}
    heroAlt="Arthur mutuelle entreprise collective"
    heroTitle="Mutuelle entreprise obligatoire (ANI)"
    heroSubtitle="Conforme ANI, panier de soins minimum, financement 50% employeur : trouvez le contrat collectif au meilleur rapport garanties/prix."
    seoTitle="Mutuelle entreprise 2026 | Comparateur ANI collective"
    seoDescription="Comparez les mutuelles entreprise collectives obligatoires. Conformité ANI, panier de soins, prise en charge 50% employeur."
    canonical="https://www.jemassuremoinscher.fr/assurance-mutuelle-entreprise"
    keyword="mutuelle entreprise"
    keywords="mutuelle entreprise, mutuelle collective, mutuelle ANI, complémentaire santé entreprise"
    insuranceType="mutuelle_entreprise"
    courtierProduct="mutuelle-entreprise"
    serviceName="Mutuelle Entreprise Collective"
    serviceDescription="Comparateur de mutuelles entreprise obligatoires (loi ANI). Tarifs négociés, conformité légale, gestion simplifiée."
    productCategory="Mutuelle Santé"
    expertiseLabel="mutuelle entreprise"
    faqs={[
      { question: "La mutuelle entreprise est-elle obligatoire ?", answer: "Oui depuis le 1er janvier 2016 (loi ANI). Toute entreprise du secteur privé doit proposer une complémentaire santé à ses salariés et la financer à 50% minimum." },
      { question: "Qu'est-ce que le panier de soins minimum ?", answer: "Un socle légal minimum : 100% BR consultation, hospitalisation forfait journalier intégral, dentaire 125% BR, optique forfait par période 2 ans." },
      { question: "Combien coûte une mutuelle collective ?", answer: "Le coût dépend du niveau de garanties, de la composition de l'effectif (âge, ayants droit) et de la convention collective éventuelle. L'employeur en finance au moins 50%. Nous ne publions pas de fourchette de prix : comparez des devis établis pour votre entreprise." },
      { question: "Quels cas de dispense ?", answer: "CDD <12 mois, temps très partiel, ayants droit déjà couverts, ACS, contrat en cours à la mise en place… selon les conditions de l'acte fondateur." },
    ]}
    enBrefFacts={[
      <><BrandName /> compare les mutuelles entreprise conformes ANI.</>,
      "Le tarif dépend du niveau de garanties et de la composition de l'effectif.",
      "Conformité légale garantie (panier de soins, ANI, DSN).",
      "Gestion en ligne simplifiée : adhésion, radiation, ayants droit.",
    ]}
    ctaTitle="Prêt à choisir la mutuelle de vos salariés ?"
    ctaDescription="Devis mutuelle entreprise gratuit en 2 minutes."
  />
);
export default AssuranceMutuelleEntreprise;
