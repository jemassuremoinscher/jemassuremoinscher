import VerticalInsurancePage from "@/components/insurance/VerticalInsurancePage";
import Scooter50StatsAnswers from "@/components/insurance/Scooter50StatsAnswers";
import arthurMoto from "@/assets/mascotte/arthur-moto.webp";
import { addHowToSchema, addSpeakableSchema } from "@/utils/seoUtils";
import { Award, ShieldCheck, FileText, Phone } from "lucide-react";

// Schema WebPage avec citation de la source ONISR du bloc "Cyclomoteur 50cc
// en France : les chiffres" — même pattern que veloStatsWebPageSchema
// (AssuranceVelo.tsx) et trottinetteStatsWebPageSchema (AssuranceTrottinette.tsx).
// URL vérifiée le 2026-09-13.
const scooter50StatsWebPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://www.jemassuremoinscher.fr/assurance-scooter-50cc#webpage",
  "url": "https://www.jemassuremoinscher.fr/assurance-scooter-50cc",
  "name": "Assurance scooter 50cc & cyclomoteur : comparateur BSR/AM",
  "inLanguage": "fr-FR",
  "dateModified": "2026-09-13",
  "citation": [
    { "@type": "CreativeWork", "name": "ONISR — Bilan définitif 2024 de la sécurité routière", "url": "https://www.onisr.securite-routiere.gouv.fr/sites/default/files/2025-06/2025%2005%2028_ONISR_Accidentalit%C3%A9_Bilan_d%C3%A9finitif_2024_v2.pdf" },
  ],
  // Speakable ajouté le 2026-09-14 (infrastructure addSpeakableSchema,
  // seoUtils.ts) : cible le H1 et le H2 du bloc réponses courtes sourcées.
  "speakable": addSpeakableSchema(["h1", "#scooter50-stats-title"]),
};

// Étapes fidèles au vrai flux du formulaire (stepConfigs.ts, verticale moto) :
// marque/modèle/année, cylindrée (option "50" ajoutée le 2026-09-12),
// stationnement, bonus-malus, âge (variante buildAgeStepMoto50, 14-99 ans),
// code postal, formule. Même pattern que trottinette/vélo.
const scooter50HowToSchema = addHowToSchema({
  name: "Comment assurer son cyclomoteur 50cc en ligne",
  description: "Guide étape par étape pour comparer et souscrire une assurance cyclomoteur 50cc en 2 minutes, dès 14 ans avec le BSR/AM",
  totalTime: "PT2M",
  steps: [
    {
      name: "Renseignez votre cyclomoteur",
      text: "Indiquez la marque, le modèle, l'année et la cylindrée (50cc) de votre scooter ou cyclomoteur.",
    },
    {
      name: "Précisez votre profil conducteur",
      text: "Âge (dès 14 ans avec le BSR/AM), lieu de stationnement et bonus-malus si vous en avez un.",
    },
    {
      name: "Comparez les formules",
      text: "Au tiers, intermédiaire ou tous risques : le prix varie fortement selon l'âge du conducteur.",
    },
    {
      name: "Souscrivez en ligne",
      text: "Validez l'offre choisie et recevez votre attestation d'assurance immédiatement.",
    },
  ],
});

const AssuranceScooter50cc = () => (
  <VerticalInsurancePage
    slug="scooter-50cc"
    extraSchemas={[scooter50StatsWebPageSchema, scooter50HowToSchema]}
    extraSection={<Scooter50StatsAnswers />}
    breadcrumbLabel="Assurance Scooter 50cc"
    heroImage={arthurMoto}
    heroAlt="Arthur en scooter"
    heroTitle="Assurance Scooter 50cc & Cyclomoteur"
    // Prix vérifié le 2026-09-14 par un devis réel de bout en bout (profil
    // Kymco 50cc, Nice) : dès 9€/mois à 26-59 ans, jusqu'à 27€/mois à 14-17
    // ans avec BSR/AM (surprime jeune conducteur). "Dès 13€/mois" envisagé
    // initialement était un artefact de recherche marché générique, jamais
    // vérifié contre le vrai parcours — corrigé avant publication.
    heroSubtitle="Dès 9€/mois pour un conducteur confirmé, jusqu'à environ 27€/mois pour un primo-conducteur 14-17 ans avec BSR/AM. Immatriculation obligatoire depuis 2004."
    seoTitle="Assurance Scooter 50cc / Cyclomoteur 2026 | Comparateur"
    seoDescription="Assurance cyclomoteur 50cc dès 9€/mois (jusqu'à 27€/mois pour un primo-conducteur 14-17 ans, BSR/AM). Immatriculation obligatoire. Devis gratuit en 2 min."
    canonical="https://www.jemassuremoinscher.fr/assurance-scooter-50cc"
    keyword="assurance scooter 50cc"
    keywords="assurance scooter 50cc, assurance cyclomoteur, assurance BSR, assurance AM, assurance scooter 14 ans"
    insuranceType="moto"
    productKey="scooter-50cc"
    serviceName="Assurance Scooter 50cc & Cyclomoteur"
    serviceDescription="Comparateur d'assurance cyclomoteur 50cc. RC obligatoire, vol, casse. BSR/AM dès 14 ans."
    productCategory="Assurance Mobilité"
    expertiseLabel="assurance scooter 50cc"
    expertisePoints={[
      "Courtiers certifiés ORIAS, spécialisés en assurance deux-roues",
      "Accompagnement des profils jeunes conducteurs (14-17 ans, BSR/AM)",
      "Comparaison des formules tiers, intermédiaire et tous risques",
      "Accompagnement personnalisé par un conseiller dédié",
    ]}
    faqs={[
      { question: "Quel permis pour conduire un scooter 50cc ?", answer: "Le permis AM (ex-BSR, depuis le 19 janvier 2013) suffit à partir de 14 ans. Les personnes nées avant 1988 en sont dispensées." },
      { question: "Un scooter 50cc doit-il être immatriculé ?", answer: "Oui, l'immatriculation est obligatoire depuis le 1er juillet 2004 pour tout cyclomoteur neuf, généralisée à tous les modèles (y compris anciens) depuis 2011. Carte grise et plaque sont requises pour circuler." },
      { question: "Quelle assurance minimale pour un cyclomoteur 50cc ?", answer: "La responsabilité civile (formule au tiers) est le minimum légal obligatoire. Le tarif varie fortement selon l'âge : comptez environ 9€/mois pour un conducteur confirmé (26-59 ans), mais jusqu'à 27€/mois pour un primo-conducteur de 14-17 ans avec BSR/AM, l'assureur appliquant une surprime jeune conducteur significative." },
      { question: "Un 50cc électrique a-t-il les mêmes obligations qu'un thermique ?", answer: "Oui : immatriculation, assurance RC et permis AM/BSR (si bridé à 45 km/h) s'appliquent de la même façon, thermique ou électrique." },
      { question: "Quelle différence avec l'assurance moto 125cc ?", answer: "Le 50cc s'obtient dès 14 ans avec le permis AM ; le 125cc nécessite le permis A1 dès 16 ans (ou le permis B avec formation de 7h pour les titulaires majeurs). Voir notre assurance moto pour les cylindrées supérieures." },
    ]}
    enBrefFacts={[
      "jemassuremoinscher.fr compare les assurances cyclomoteur 50cc pour les profils dès 14 ans (BSR/AM).",
      "Immatriculation obligatoire depuis 2004 : carte grise et plaque requises.",
      "Dès 9€/mois pour un conducteur confirmé, devis gratuit en moins de 2 minutes.",
    ]}
    ctaTitle="Prêt à comparer votre assurance scooter 50cc ?"
    ctaDescription="Devis gratuit en 2 minutes, dès 14 ans avec le BSR/AM."
  />
);

export default AssuranceScooter50cc;
