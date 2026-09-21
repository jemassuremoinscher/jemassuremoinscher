import VerticalInsurancePage from "@/components/insurance/VerticalInsurancePage";
import BrandName from "@/components/BrandName";
import VeloVolStatsAnswers from "@/components/insurance/VeloVolStatsAnswers";
import SpeedBikeSection from "@/components/insurance/SpeedBikeSection";
import { VELO_HOWTO_STEPS } from "@/data/veloHowToSteps";
import {
  VeloHowItWorks,
  VeloComparisonTable,
  VeloTypeAndValue,
  VeloAntivolStationnement,
  VeloTheftSteps,
  VeloSourcesNote,
} from "@/components/insurance/VeloGuideSections";
import arthurBike from "@/assets/mascotte/arthur-bike.png";
import { addHowToSchema, addSpeakableSchema } from "@/utils/seoUtils";

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
  "dateModified": "2026-09-21",
  "citation": [
    { "@type": "CreativeWork", "name": "ADMA — Le vol de vélos en France (synthèse, avril 2023)", "url": "https://www.mobilites-actives.fr/ressource/le-vol-de-velos-en-france-synthese/" },
    { "@type": "CreativeWork", "name": "SSMSI (ministère de l'Intérieur) — Vécu et ressenti en matière de sécurité", "url": "https://www.interieur.gouv.fr/Interstats/Publications-et-infographies/Interstats-References/Rapport-d-enquete-Vecu-et-ressenti-en-matiere-de-securite-2022-victimation-delinquance-et-sentiment-d-insecurite" },
    { "@type": "CreativeWork", "name": "Union Sport & Cycle — Observatoire du Cycle 2025", "url": "https://www.unionsportcycle.com/les-actualites/2026-04-24/observatoire-du-cycle-les-chiffres" },
    { "@type": "CreativeWork", "name": "Les Echos — Le vélo cargo prend son envol en France (13 juillet 2021, chiffres Union Sport & Cycle)", "url": "https://www.unionsportcycle.com/usc/2021-07-13/le-velo-cargo-prend-son-envol-en-france" },
    { "@type": "CreativeWork", "name": "MAIF — Mon vélo est-il couvert par mon assurance habitation ?", "url": "https://www.maif.fr/habitation/guide-assurance-habitation/assurance-velo" },
    { "@type": "CreativeWork", "name": "MAIF — Vol de vélo : quelle prise en charge par l'assurance ?", "url": "https://www.maif.fr/vehicule-mobilite/guide-assurance-velo/vol-velo" },
    { "@type": "CreativeWork", "name": "MAIF — Antivol pour vélo électrique : lequel choisir ?", "url": "https://www.maif.fr/vehicule-mobilite/guide-assurance-velo/antivol" },
    { "@type": "CreativeWork", "name": "Ministère de l'Écologie — Marquage et identification des vélos", "url": "https://www.ecologie.gouv.fr/politiques-publiques/identification-cycles" },
    { "@type": "CreativeWork", "name": "Décret n° 2020-1439 du 23 novembre 2020 relatif à l'identification des cycles", "url": "https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000042558926" },
    { "@type": "CreativeWork", "name": "Code des assurances — article L113-2", "url": "https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000035731302" },
    { "@type": "CreativeWork", "name": "FUB — Commission antivol", "url": "https://www.fub.fr/moi-velo/ma-securite/equipement/antivols/commission-antivol" },
  ],
  // Speakable ajouté le 2026-09-14 (infrastructure addSpeakableSchema,
  // seoUtils.ts) : cible le H1 et le H2 du bloc réponses courtes sourcées.
  "speakable": addSpeakableSchema(["h1", "#velo-stats-title"]),
};

// Étapes fidèles au contenu réel de la page : contrairement à trottinette
// (produit RC obligatoire dédié), il n'existe aucun partenaire spécialisé
// vélo (cf. Partners.tsx) — la page compare l'extension vol vélo de
// l'assurance habitation, pas une souscription de police vélo autonome.
const veloHowToSchema = addHowToSchema({
  name: "Comment vérifier et compléter sa garantie vol de vélo",
  description: "Guide étape par étape pour évaluer sa garantie vol de vélo en assurance habitation et comparer une extension dédiée si besoin",
  totalTime: "PT2M",
  // Même source que la section visible "Comment vérifier..." (VeloHowItWorks) :
  // le schéma ne peut plus diverger du contenu affiché.
  steps: VELO_HOWTO_STEPS,
});

const AssuranceVelo = () => (
  <VerticalInsurancePage
    slug="velo"
    extraSchemas={[veloStatsWebPageSchema, veloHowToSchema]}
    extraSection={
      <>
        <VeloHowItWorks />
        <VeloVolStatsAnswers />
        <VeloComparisonTable />
        <VeloTypeAndValue />
        <VeloAntivolStationnement />
        <VeloTheftSteps />
        <SpeedBikeSection />
        <VeloSourcesNote />
      </>
    }
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
      // Réécrites le 2026-09-20 : les fourchettes de prix (9-30 €/mois pour un
      // contrat dédié, plafond 300-500 € hors domicile, extension 5-10 €/mois)
      // n'avaient aucune source primaire et les sources publiques trouvées ne
      // concordaient pas entre elles. Formulation qualitative, alignée sur ce
      // que MAIF documente réellement (cf. VeloGuideSections.tsx).
      { question: "Combien coûte une assurance vélo dédiée (hors extension habitation) ?", answer: "Le prix d'une assurance vélo dédiée dépend de la valeur du vélo, des garanties choisies (vol, casse, accessoires, assistance), de la franchise et du plafond de remboursement, et varie d'un assureur à l'autre. Nous ne publions pas de fourchette de prix : ces contrats ne sont pas des offres que nous comparons aujourd'hui. Pour savoir ce que coûte la garantie vol de votre contrat habitation ou son extension, un conseiller compare vos conditions actuelles." },
      { question: "L'assurance habitation couvre-t-elle le vol de vélo ?", answer: "La plupart des contrats d'assurance habitation garantissent le vol à l'intérieur du logement, parfois sous conditions : vélo rangé dans un lieu fermé et sécurisé (cave, garage privatif), ou protégé par un antivol et attaché à un point fixe. Hors du domicile (dans la rue, en trajet), la protection se renforce en ajustant le contrat habitation ou en souscrivant un contrat spécifique au vélo. Le plafond de remboursement et la franchise sont fixés par chaque contrat : à vérifier avant tout." },
      { question: "Comment est calculée l'indemnisation en cas de vol ou de casse ?", answer: "Elle tient compte de l'âge du vélo (sa valeur se décote d'année en année), de la franchise prévue au contrat et du plafond de remboursement. Ces modalités sont fixées par chaque contrat : lisez les conditions générales avant de souscrire, et conservez la facture du vélo et de son antivol." },
      { question: "Quel antivol faut-il pour être indemnisé en cas de vol ?", answer: "Cela dépend de votre contrat. Chez certains assureurs, comme MAIF, un antivol homologué est obligatoire pour être indemnisé ; MAIF cite les antivols FUB (niveau « 2 roues »), SRA ou ART (niveau 2 minimum). Vérifiez dans vos conditions générales quels labels et quels niveaux sont acceptés avant d'acheter un antivol." },
      { question: "Dans quel délai déclarer le vol de son vélo à l'assureur ?", answer: "Dans le délai fixé par votre contrat. La loi (article L113-2 du Code des assurances) impose que ce délai ne soit pas inférieur à deux jours ouvrés en cas de vol ; les contrats prévoient souvent davantage (5 jours ouvrés pour le contrat vélo de MAIF). Déclarez le vol dès que possible, en joignant la copie de votre dépôt de plainte." },
      { question: "Le marquage du vélo est-il obligatoire ?", answer: "Il est obligatoire pour les vendeurs : vélos neufs identifiés depuis le 1er janvier 2021, vélos d'occasion vendus par un commerçant depuis le 1er juillet 2021. Entre particuliers, il n'est pas obligatoire, mais vous pouvez faire marquer votre vélo volontairement : le numéro est enregistré dans un fichier national, ce qui aide à restituer un vélo retrouvé (Bicycode est l'un des opérateurs agréés)." },
      // Formulation B validée : reliée au plafond, purement factuelle sur
      // l'existence de ces produits — jamais présentés comme comparés par
      // nous (aucun n'est partenaire, cf. Partners.tsx).
      { question: "Une assurance vélo dédiée est-elle utile en complément de l'habitation ?", answer: "Si la valeur de votre vélo dépasse le plafond de la garantie vol de votre assurance habitation, des contrats spécifiquement dédiés au vélo existent chez certains assureurs — par exemple Hepster ou Laka. Ce ne sont pas des offres que nous comparons aujourd'hui." },
      { question: "Et pour un vélo cargo utilisé à titre professionnel (livraison) ?", answer: "Un usage professionnel change le risque assuré et doit être déclaré à l'assureur — une omission peut entraîner un refus d'indemnisation. Le vélo cargo électrique s'est fortement développé en France : ses ventes ont progressé de 354 % en 2020 pour atteindre 11 000 unités, selon l'Union Sport & Cycle (chiffre relayé par Les Echos, 13 juillet 2021). Un usage à anticiper dès la souscription." },
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
