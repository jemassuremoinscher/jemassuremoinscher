import VerticalInsurancePage from "@/components/insurance/VerticalInsurancePage";
import BrandName from "@/components/BrandName";
import arthurCar from "@/assets/mascotte/arthur-car.webp?w=480&format=webp";
import { CAMPING_CAR_HOWTO_STEPS } from "@/data/campingCarHowToSteps";
import {
  CampingCarHowItWorks,
  CampingCarPermis,
  CampingCarZFE,
  CampingCarControleTechnique,
  CampingCarAssuranceObligatoire,
  CampingCarUsageDeclare,
  CampingCarGarantiesTable,
  CampingCarSourcesNote,
} from "@/components/insurance/CampingCarGuideSections";
import { addHowToSchema } from "@/utils/seoUtils";

// Schéma WebPage avec citation des sources du contenu de fond (même pattern
// que /assurance-velo et /assurance-sans-permis). Sources lues les 21 et 22
// septembre 2026.
const campingCarWebPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://www.jemassuremoinscher.fr/assurance-camping-car#webpage",
  "url": "https://www.jemassuremoinscher.fr/assurance-camping-car",
  "name": "Assurance camping-car & van aménagé",
  "inLanguage": "fr-FR",
  "dateModified": "2026-09-22",
  "citation": [
    { "@type": "CreativeWork", "name": "Ministère de l'Intérieur — réponse à la question écrite n° 6151 (Assemblée nationale, 26 mars 2013)", "url": "https://questions.assemblee-nationale.fr/q14/14-6151QE.htm" },
    { "@type": "CreativeWork", "name": "Ministère de l'Intérieur et des outre-mer — réponse à la question écrite n° 8735 (Assemblée nationale, 7 novembre 2023)", "url": "https://questions.assemblee-nationale.fr/q16/16-8735QE.htm" },
    { "@type": "CreativeWork", "name": "Code de la route — article R221-4", "url": "https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000032468236" },
    { "@type": "CreativeWork", "name": "Code des assurances — article L211-1", "url": "https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000048523650" },
    { "@type": "CreativeWork", "name": "Code de la route — article L324-2", "url": "https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000033460260" },
    { "@type": "CreativeWork", "name": "Code des assurances — article L113-2", "url": "https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000035731302" },
    { "@type": "CreativeWork", "name": "Code des assurances — article L113-4", "url": "https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006792030" },
    { "@type": "CreativeWork", "name": "Code des assurances — article L113-8", "url": "https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006792058" },
    { "@type": "CreativeWork", "name": "Code des assurances — article L113-9", "url": "https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006792066" },
    { "@type": "CreativeWork", "name": "Code général des collectivités territoriales — article L2213-4-1", "url": "https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000043976834" },
    { "@type": "CreativeWork", "name": "Conseil constitutionnel — décision n° 2026-903 DC du 21 mai 2026", "url": "https://www.conseil-constitutionnel.fr/decision/2026/2026903DC.htm" },
    { "@type": "CreativeWork", "name": "service-public.gouv.fr — Contrôle technique d'une voiture (catégorie M1)", "url": "https://www.service-public.gouv.fr/particuliers/vosdroits/F2878" },
    { "@type": "CreativeWork", "name": "service-public.gouv.fr — Un contrôle technique renforcé à partir de 2026 (11 décembre 2025)", "url": "https://www.service-public.gouv.fr/particuliers/actualites/A18705" },
    { "@type": "CreativeWork", "name": "Mieux respirer en ville — ZFE françaises", "url": "https://mieuxrespirerenville.gouv.fr/fiches-thematique/se-deplacer/zfe-francaises" },
    { "@type": "CreativeWork", "name": "Ville de Paris — La zone à faibles émissions (ZFE)", "url": "https://www.paris.fr/pages/la-zone-a-faibles-emissions-zfe-pour-lutter-contre-la-pollution-de-l-air-16799" },
    { "@type": "CreativeWork", "name": "Ministère de la Transition écologique — Certificats qualité de l'air Crit'Air", "url": "https://www.ecologie.gouv.fr/politiques-publiques/certificats-qualite-lair-critair" },
    { "@type": "CreativeWork", "name": "Groupama — Réglementation camping-car", "url": "https://www.groupama.fr/assurance-camping-car/conseils/legislation/" },
    { "@type": "CreativeWork", "name": "Groupama — Assurance camping-car", "url": "https://www.groupama.fr/assurance-camping-car/" },
    { "@type": "CreativeWork", "name": "Aquaverde Assurance — Quelles garanties choisir pour assurer son camping-car ?", "url": "https://www.aquaverde-assurance.fr/garantie-assurance-camping-car" },
    { "@type": "CreativeWork", "name": "GAV Assurance — Assurance camping-car : garanties, prix et conseils", "url": "https://www.gav-assurance.fr/assurance-camping-car-garanties-prix" },
  ],
};

// Même source que la section visible « Comment comparer… » (CampingCarHowItWorks) :
// le schéma ne peut pas diverger du contenu affiché.
const campingCarHowToSchema = addHowToSchema({
  name: "Comment comparer son assurance camping-car",
  description: "Les quatre étapes du formulaire de devis pour comparer des assurances camping-car avec un conseiller",
  totalTime: "PT2M",
  steps: CAMPING_CAR_HOWTO_STEPS,
});

const AssuranceCampingCar = () => (
  <VerticalInsurancePage
    slug="camping-car"
    extraSchemas={[campingCarWebPageSchema, campingCarHowToSchema]}
    extraSection={
      <>
        <CampingCarHowItWorks />
        <CampingCarPermis />
        <CampingCarZFE />
        <CampingCarControleTechnique />
        <CampingCarAssuranceObligatoire />
        <CampingCarUsageDeclare />
        <CampingCarGarantiesTable />
        <CampingCarSourcesNote />
      </>
    }
    breadcrumbLabel="Assurance Camping-car & Van"
    heroImage={arthurCar}
    heroAlt="Arthur avec camping-car"
    heroTitle="Assurance camping-car & van aménagé"
    heroSubtitle="Capucine, profilé, intégral, van aménagé… Comparez les offres de plusieurs assureurs pour votre maison sur roues."
    seoTitle="Assurance camping-car 2026 | Comparateur van aménagé"
    seoDescription="Comparez les assurances camping-car et van aménagé. Devis gratuit en 2 min. Permis, contrôle technique, Crit'Air, garanties : tout ce qu'il faut savoir."
    canonical="https://www.jemassuremoinscher.fr/assurance-camping-car"
    keyword="assurance camping-car"
    keywords="assurance camping-car, assurance van aménagé, assurance fourgon, permis camping-car, contrôle technique camping-car"
    insuranceType="camping_car"
    courtierProduct="camping-car"
    serviceName="Assurance Camping-car & Van"
    serviceDescription="Comparateur d'assurance camping-car et van aménagé. Garanties spécifiques contenu, accessoires, hivernage."
    productCategory="Assurance Automobile"
    expertiseLabel="assurance camping-car"
    faqs={[
      { question: "Quelles garanties spécifiques pour un camping-car ?", answer: "Au-delà de la responsabilité civile obligatoire, les assureurs proposent des formules incluant selon les cas le vol, l'incendie, le bris de glace, les dommages tous accidents, et en option le contenu du véhicule (effets personnels) ou ses aménagements (auvent, panneaux solaires). Le contenu exact de chaque formule varie d'un assureur à l'autre : voir le tableau ci-dessous." },
      { question: "Combien coûte une assurance camping-car ?", answer: "Le prix dépend de la valeur du véhicule, de son type (capucine, profilé, intégral, van aménagé), de l'usage (loisir, résidence principale), du profil du conducteur et des garanties choisies (contenu, accessoires, assistance, hivernage). Nous ne publions pas de fourchette de prix : comparez des devis établis pour votre situation." },
      { question: "Peut-on suspendre son assurance en hiver ?", answer: "Certains assureurs, comme Groupama, proposent une formule hivernage aux garanties réduites pour les périodes d'inactivité. Cela ne veut pas dire que le véhicule peut rester sans assurance : selon Groupama, un camping-car doit rester assuré même pendant l'hivernage." },
      { question: "Quel permis pour conduire un camping-car ?", answer: "Jusqu'à 3,5 tonnes (PTAC), le permis B suffit. De 3,5 à 7,5 tonnes, il faut le permis C1 (Code de la route, article R221-4 ; confirmé par le ministère de l'Intérieur). Les titulaires d'un permis B délivré avant le 20 janvier 1975 bénéficient d'une exception leur permettant de conduire un véhicule de plus de 3,5 tonnes, sous conditions, en faisant ajouter une mention sur leur permis." },
      { question: "Le contrôle technique est-il obligatoire pour un camping-car ?", answer: "Oui, pour un camping-car de 3,5 tonnes maximum : premier contrôle dans les 6 mois avant le 4e anniversaire de la première mise en circulation, puis tous les 2 ans (service-public.gouv.fr). Depuis le 1er janvier 2026, les campagnes de rappel constructeur graves sont aussi vérifiées. Au-delà de 3,5 tonnes, les règles des véhicules lourds s'appliquent : renseignez-vous auprès d'un centre agréé." },
      { question: "Faut-il une vignette Crit'Air pour un camping-car ?", answer: "Oui, la vignette Crit'Air est obligatoire pour circuler dans une zone à faibles émissions (ZFE), quel que soit le véhicule. Les restrictions varient selon les agglomérations : dans la Métropole du Grand Paris par exemple, les véhicules Crit'Air 3, 4, 5 et non classés sont restreints depuis le 1er janvier 2025, avec une période sans sanction prolongée jusqu'à fin 2026. Vérifiez le classement de votre véhicule sur certificat-air.gouv.fr." },
      { question: "Dois-je déclarer un usage résidence principale ou prolongé à mon assureur ?", answer: "Le Code des assurances impose de déclarer toute circonstance qui aggrave le risque en cours de contrat (article L113-2). Une fausse déclaration intentionnelle peut rendre le contrat nul (article L113-8) ; sans mauvaise foi, l'indemnité est simplement réduite proportionnellement après sinistre (article L113-9). Selon GAV Assurance, un usage déclaré « loisirs et vacances » ne couvre pas de la même façon un usage prolongé ou en résidence principale : signalez tout changement d'usage à votre assureur." },
    ]}
    enBrefFacts={[
      <><BrandName /> compare les assureurs spécialistes camping-car.</>,
      "Permis, contrôle technique, Crit'Air, usage déclaré : nos conseillers font le point avec vous.",
      "Le tarif dépend du véhicule, de l'usage et des garanties choisies : comparez plusieurs devis.",
      "Formules avec ou sans garantie du contenu et des aménagements, selon les assureurs.",
    ]}
    ctaTitle="Prêt à comparer votre assurance camping-car ?"
    ctaDescription="Recevez votre devis camping-car en 2 minutes, gratuit et sans engagement."
  />
);
export default AssuranceCampingCar;
