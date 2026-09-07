import VerticalInsurancePage from "@/components/insurance/VerticalInsurancePage";
import BrandName from "@/components/BrandName";
import VeloVolStatsAnswers from "@/components/insurance/VeloVolStatsAnswers";
import arthurBike from "@/assets/mascotte/arthur-bike.png";

// Schema WebPage avec citation des sources des statistiques du bloc
// "Vol de vélo en France : les chiffres" (VeloVolStatsAnswers) — même pattern
// que le webPageSchema de la home (src/pages/Index.tsx), jamais utilisé
// avant ce jour sur une page verticale. URLs vérifiées le 2026-09-07.
const veloStatsWebPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://www.jemassuremoinscher.fr/assurance-velo#webpage",
  "url": "https://www.jemassuremoinscher.fr/assurance-velo",
  "name": "Assurance vélo & VAE : garantie vol habitation",
  "inLanguage": "fr-FR",
  "dateModified": "2026-09-07",
  "citation": [
    { "@type": "CreativeWork", "name": "ADMA — Le vol de vélos en France (synthèse, avril 2023)", "url": "https://www.mobilites-actives.fr/ressource/le-vol-de-velos-en-france-synthese/" },
    { "@type": "CreativeWork", "name": "SSMSI (ministère de l'Intérieur) — Vécu et ressenti en matière de sécurité", "url": "https://www.interieur.gouv.fr/Interstats/Publications-et-infographies/Interstats-References/Rapport-d-enquete-Vecu-et-ressenti-en-matiere-de-securite-2022-victimation-delinquance-et-sentiment-d-insecurite" },
    { "@type": "CreativeWork", "name": "Union Sport & Cycle — Observatoire du Cycle 2025", "url": "https://www.unionsportcycle.com/les-actualites/2026-04-24/observatoire-du-cycle-les-chiffres" },
  ],
};

const AssuranceVelo = () => (
  <VerticalInsurancePage
    slug="velo"
    extraSchemas={[veloStatsWebPageSchema]}
    extraSection={<VeloVolStatsAnswers />}
    breadcrumbLabel="Assurance Vélo & VAE"
    heroImage={arthurBike}
    heroAlt="Arthur à vélo"
    heroTitle="Assurance vélo & VAE (vélo électrique)"
    heroSubtitle="Vol, casse, RC : votre assurance habitation couvre déjà une partie du risque. On vous aide à voir ce qui manque et à comparer si une garantie dédiée devient utile."
    seoTitle="Assurance vélo & VAE 2026 | Garantie vol & habitation"
    seoDescription="Vol de vélo : ce que couvre votre assurance habitation, ses limites (VAE, cargo, hors domicile), et quand une offre dédiée devient utile. Devis gratuit en 2 min."
    canonical="https://www.jemassuremoinscher.fr/assurance-velo"
    keyword="assurance vélo"
    keywords="assurance vélo, assurance VAE, assurance vélo électrique, vol vélo, assurance vélo cargo, garantie vol vélo habitation, plafond vol vélo assurance habitation"
    insuranceType="velo"
    // "habitation" plutôt que le défaut "auto" de CourtierValueCards (bug
    // trouvé le 2026-09-07 : la page affichait "Pourquoi passer par un
    // courtier spécialisé pour l'assurance auto ?"). Cohérent avec le
    // nouvel angle : c'est bien la garantie vol de l'assurance habitation
    // qui est au centre de cette page, pas un produit vélo dédié inexistant
    // chez nos partenaires.
    productKey="habitation"
    serviceName="Assurance Vélo & VAE"
    serviceDescription="Comparateur d'assurance vélo et vélo à assistance électrique (VAE). Garanties vol, casse, assistance."
    productCategory="Assurance Mobilité"
    expertiseLabel="assurance vélo"
    // Remplace le défaut de ExpertiseSection ("50+ compagnies d'assurance
    // partenaires comparées") qui serait trompeur ici : aucun partenaire
    // n'est spécialisé vélo (cf. Partners.tsx) — ce qu'on compare vraiment,
    // c'est l'option vol des assureurs habitation généralistes.
    expertisePoints={[
      "Courtiers certifiés ORIAS, spécialisés en assurance habitation et mobilité",
      "Analyse de la garantie vol de votre contrat habitation actuel",
      "Comparaison des extensions vol vélo chez nos assureurs partenaires généralistes",
      "Accompagnement personnalisé par un conseiller dédié",
    ]}
    faqs={[
      { question: "L'assurance vélo est-elle obligatoire ?", answer: "Non, sauf pour certains speed-bikes (>25 km/h) qui nécessitent une RC moto. Une RC vie privée couvre la responsabilité civile à vélo." },
      { question: "Que couvre une assurance vélo ?", answer: "Principalement le vol (avec antivol agréé), la casse accidentelle, le vandalisme, et l'assistance/dépannage. Souvent avec RC complémentaire." },
      { question: "Combien coûte une assurance VAE ?", answer: "Entre 4€ et 25€/mois selon la valeur du vélo (musculaire 600€ vs VAE 3000€) et les garanties choisies." },
      { question: "L'assurance habitation couvre-t-elle le vol de vélo ?", answer: "Oui à domicile (garantie vol standard), mais rarement en dehors : à l'extérieur, la couverture est souvent limitée à 300-500€ — insuffisant pour un VAE ou un vélo cargo. Une extension vol vélo (généralement 5-10€/mois) permet d'étendre la couverture partout." },
      { question: "Comment est calculée l'indemnisation en cas de vol ou de casse ?", answer: "La plupart des contrats indemnisent en valeur d'usage : le montant remboursé diminue avec la vétusté du vélo (son âge), pas seulement en cas d'occasion. Certaines formules proposent une indemnisation en valeur d'achat (à neuf) — à vérifier précisément dans les conditions générales avant de choisir. Une franchise (montant restant à votre charge) s'applique généralement en plus, son niveau variant fortement d'un contrat à l'autre." },
      // Formulation B validée : reliée au plafond, purement factuelle sur
      // l'existence de ces produits — jamais présentés comme comparés par
      // nous (aucun n'est partenaire, cf. Partners.tsx).
      { question: "Une assurance vélo dédiée est-elle utile en complément de l'habitation ?", answer: "Si la valeur de votre vélo dépasse le plafond de la garantie vol de votre assurance habitation, des contrats spécifiquement dédiés au vélo existent chez certains assureurs — par exemple Hepster ou Laka. Ce ne sont pas des offres que nous comparons aujourd'hui." },
      { question: "Et pour un vélo cargo utilisé à titre professionnel (livraison) ?", answer: "Un usage professionnel change le risque assuré et doit être déclaré à l'assureur — une omission peut entraîner un refus d'indemnisation. Le vélo cargo s'est fortement développé ces dernières années en France (11 000 unités vendues en 2020, +354% vs 2019, Union Sport & Cycle) porté par la livraison urbaine, un usage à anticiper dès la souscription." },
    ]}
    enBrefFacts={[
      // "Cyclassur, Sharelock, Qover" retiré : aucun n'est un partenaire réel
      // du site (cf. Partners.tsx) — formulation générique en attendant de
      // confirmer les vrais partenaires vélo avec Paul.
      <><BrandName /> vous aide à vérifier votre garantie vol de vélo en assurance habitation.</>,
      "Plafonds, franchise, vétusté : ce que couvre vraiment votre contrat actuel.",
      "VAE, cargo, pliant, speed-bike : les points de vigilance selon le type de vélo.",
      "Comparaison des extensions vol vélo chez nos assureurs partenaires si besoin.",
    ]}
    ctaTitle="Prêt à vérifier votre garantie vol de vélo ?"
    ctaDescription="Comparez les extensions vol vélo en 2 minutes, gratuitement."
  />
);
export default AssuranceVelo;
