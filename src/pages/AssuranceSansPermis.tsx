import VerticalInsurancePage from "@/components/insurance/VerticalInsurancePage";
import BrandName from "@/components/BrandName";
import arthurCar from "@/assets/mascotte/arthur-car.webp?w=480&format=webp";
import { SANS_PERMIS_HOWTO_STEPS } from "@/data/sansPermisHowToSteps";
import {
  SansPermisHowItWorks,
  SansPermisReglementation,
  SansPermisControleTechnique,
  SansPermisAssuranceObligatoire,
  SansPermisGarantiesTable,
  SansPermisMarche,
  SansPermisSourcesNote,
} from "@/components/insurance/SansPermisGuideSections";
import { addHowToSchema } from "@/utils/seoUtils";

// Schéma WebPage avec citation des sources du contenu de fond (même pattern
// que /assurance-velo). Sources lues le 2026-09-21.
const sansPermisWebPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://www.jemassuremoinscher.fr/assurance-sans-permis#webpage",
  "url": "https://www.jemassuremoinscher.fr/assurance-sans-permis",
  "name": "Assurance voiture sans permis (VSP)",
  "inLanguage": "fr-FR",
  "dateModified": "2026-09-21",
  "citation": [
    { "@type": "CreativeWork", "name": "Ministère de l'Intérieur — réponse à la question écrite n° 07151 du Sénat (17 septembre 2026)", "url": "https://www.senat.fr/questions/base/2025/qSEQ251207151.html" },
    { "@type": "CreativeWork", "name": "service-public.gouv.fr — Brevet de sécurité routière (BSR), catégorie AM du permis de conduire", "url": "https://www.service-public.gouv.fr/particuliers/vosdroits/F2890" },
    { "@type": "CreativeWork", "name": "service-public.gouv.fr — Quels permis de conduire faut-il avoir selon la catégorie du véhicule ?", "url": "https://www.service-public.gouv.fr/particuliers/vosdroits/F12096" },
    { "@type": "CreativeWork", "name": "service-public.gouv.fr — Permis B1 : quadricycle lourd à moteur", "url": "https://www.service-public.gouv.fr/particuliers/vosdroits/F2833" },
    { "@type": "CreativeWork", "name": "service-public.gouv.fr — Contrôle technique d'un 2, 3 roues ou quadricycle à moteur (catégorie L)", "url": "https://www.service-public.gouv.fr/particuliers/vosdroits/F37538" },
    { "@type": "CreativeWork", "name": "Code de la route — article R221-5", "url": "https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000037411514" },
    { "@type": "CreativeWork", "name": "Code de la route — article R311-1", "url": "https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000045025478" },
    { "@type": "CreativeWork", "name": "Arrêté du 23 octobre 2023 relatif au contrôle technique des véhicules motorisés à deux ou trois roues et quadricycles à moteur", "url": "https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000048242538" },
    { "@type": "CreativeWork", "name": "Code des assurances — article L211-1", "url": "https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000048523650" },
    { "@type": "CreativeWork", "name": "Code de la route — article L324-2", "url": "https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000033460260" },
    { "@type": "CreativeWork", "name": "AAA-Data — Intelligence Auto n° 80 (16 avril 2025)", "url": "https://www.aaa-data.fr/actualites/intelligence-auto-n80-pourquoi-les-voitures-sans-permis-connaissent-un-debut-d-annee-difficile/" },
    { "@type": "CreativeWork", "name": "Direct Assurance — Assurance voiture sans permis", "url": "https://www.direct-assurance.fr/assurance-auto/assurance-sans-permis" },
    { "@type": "CreativeWork", "name": "Groupama — Quelle assurance pour voiture sans permis choisir ?", "url": "https://www.groupama.fr/assurance-auto/conseils/assurance-voiture-sans-permis/" },
  ],
};

// Même source que la section visible « Comment comparer… » (SansPermisHowItWorks) :
// le schéma ne peut pas diverger du contenu affiché.
const sansPermisHowToSchema = addHowToSchema({
  name: "Comment comparer son assurance voiture sans permis",
  description: "Les quatre étapes du formulaire de devis pour comparer des assurances voiture sans permis avec un conseiller",
  totalTime: "PT2M",
  steps: SANS_PERMIS_HOWTO_STEPS,
});

const AssuranceSansPermis = () => (
  <VerticalInsurancePage
    slug="sans-permis"
    extraSchemas={[sansPermisWebPageSchema, sansPermisHowToSchema]}
    extraSection={
      <>
        <SansPermisHowItWorks />
        <SansPermisReglementation />
        <SansPermisControleTechnique />
        <SansPermisAssuranceObligatoire />
        <SansPermisGarantiesTable />
        <SansPermisMarche />
        <SansPermisSourcesNote />
      </>
    }
    breadcrumbLabel="Assurance Voiture Sans Permis"
    heroImage={arthurCar}
    heroAlt="Arthur avec voiture sans permis"
    heroTitle="Assurance voiture sans permis (VSP) moins chère"
    heroSubtitle="Aixam, Ligier, Microcar, Chatenet… Comparez les offres VSP de plusieurs assureurs en 2 minutes, gratuitement."
    seoTitle="Assurance voiture sans permis 2026 | Comparateur VSP"
    seoDescription="Comparez les assurances voiture sans permis (Aixam, Ligier, Microcar). Devis gratuit en 2 min. Formules tiers, intermédiaire ou tous risques."
    canonical="https://www.jemassuremoinscher.fr/assurance-sans-permis"
    keyword="assurance voiture sans permis"
    keywords="assurance VSP, assurance voiturette, assurance Aixam, assurance Ligier, assurance sans permis pas cher"
    insuranceType="sans_permis"
    courtierProduct="sans-permis"
    serviceName="Assurance Voiture Sans Permis"
    serviceDescription="Comparateur d'assurance VSP (voiturette). Aixam, Ligier, Microcar, Chatenet. Devis gratuit en 2 minutes."
    productCategory="Assurance Automobile"
    expertiseLabel="assurance voiture sans permis"
    faqs={[
      { question: "L'assurance voiture sans permis est-elle obligatoire ?", answer: "Oui. L'article L211-1 du Code des assurances impose d'être couvert par une assurance de responsabilité civile pour faire circuler un véhicule terrestre à moteur, ce qu'est une voiture sans permis. Le défaut d'assurance est puni de 3 750 euros d'amende (article L324-2 du Code de la route)." },
      { question: "Faut-il un permis pour conduire une voiture sans permis ?", answer: "Il faut le permis AM (option quadricycle léger à moteur), accessible à partir de 14 ans, ou n'importe quelle autre catégorie de permis de conduire. Les personnes nées avant le 1er janvier 1988 n'ont pas besoin de titre de conduite (service-public.gouv.fr). Le quadricycle lourd, lui, exige un permis, notamment le B1 à partir de 16 ans." },
      { question: "Quel est le prix d'une assurance VSP ?", answer: "Le prix dépend du profil du conducteur (âge, antécédents), du véhicule et de la formule choisie (tiers, intermédiaire, tous risques), et varie d'un assureur à l'autre. Nous ne publions pas de fourchette de prix : comparez des devis établis pour votre situation." },
      { question: "Peut-on assurer une VSP à 14 ans ?", answer: "Le permis AM s'obtient dès 14 ans, ce qui permet de conduire une voiturette. Les conditions pour assurer un conducteur mineur (souscripteur du contrat, conducteur déclaré) sont fixées par chaque assureur : renseignez-vous avant de souscrire." },
      { question: "Quelles garanties choisir pour une VSP ?", answer: "Le minimum légal est la responsabilité civile. Au-delà, les formules varient selon l'assureur : chez Direct Assurance, par exemple, le vol, l'incendie et le bris de glace commencent à la formule Tiers Maxi et les dommages tous accidents à la formule Tous Risques (voir le tableau). Selon Direct Assurance, la responsabilité civile ne prend pas en charge les dommages corporels du conducteur responsable : vérifiez que la garantie du conducteur figure dans votre contrat." },
      { question: "Le contrôle technique est-il obligatoire pour une voiture sans permis ?", answer: "Oui, depuis le 15 avril 2024, selon un calendrier fixé par la date de première immatriculation : avant 2017, au plus tard le 31 décembre 2024 ; de 2017 à 2019, en 2025 ; de 2020 à 2021, en 2026 ; à partir de 2022, dans les 6 mois avant le 5e anniversaire de la première mise en circulation (arrêté du 23 octobre 2023 ; service-public.gouv.fr)." },
      { question: "Quelle est la vitesse maximale d'une voiture sans permis ?", answer: "Selon le ministère de l'Intérieur, la vitesse d'un quadricycle léger à moteur est limitée à 45 km/h et sa puissance ne peut excéder 6 kW." },
      { question: "Le marché des voitures sans permis est-il toujours en croissance ?", answer: "Les immatriculations neuves sont passées de 13 376 en 2019 à 31 714 en 2024, soit environ +137 % (AAA-Data). La même publication relève toutefois un coup de frein au premier trimestre 2025 (-29 %) : la hausse de 2019 à 2024 ne permet pas d'affirmer que le marché continue de croître." },
    ]}
    enBrefFacts={[
      <><BrandName /> compare les contrats VSP des principaux assureurs.</>,
      "Le tarif dépend du profil du conducteur et de la voiturette : comparez plusieurs devis.",
      "Aixam, Ligier, Microcar, Chatenet, Bellier, Casalini : des marques courantes de voiturettes.",
      "Devis gratuit en moins de 2 minutes, sans engagement.",
    ]}
    ctaTitle="Prêt à économiser sur votre assurance sans permis ?"
    ctaDescription="Comparez en 2 minutes les meilleures offres VSP du marché."
  />
);
export default AssuranceSansPermis;
