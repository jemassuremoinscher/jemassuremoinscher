// Pilier /assurance-animaux : FAQ et sources, partagées entre le texte
// visible (AnimauxPillar.tsx) et le JSON-LD FAQPage (AssuranceAnimaux.tsx),
// pour que les deux restent identiques mot pour mot.
//
// Les fourchettes de garanties viennent de trois documents d'information
// (IPID/DIPA) consultés le 1er octobre 2026, listés dans ANIMAUX_SOURCES.
// Aucun nom d'assureur dans le texte : ils n'apparaissent que dans les sources.

export interface PilierFaq {
  question: string;
  answer: string;
}

export const ANIMAUX_FAQ: PilierFaq[] = [
  {
    question: "Quel est le taux de remboursement d'une assurance chien ou chat ?",
    answer:
      "Il dépend de la formule. Dans les contrats examinés pour ce guide qui l'indiquent, il va de 60 à 100 % des frais vétérinaires, dans la limite d'un plafond annuel et après déduction d'une éventuelle franchise.",
  },
  {
    question: "Qu'est-ce que le délai de carence ?",
    answer:
      "C'est la période qui suit la souscription pendant laquelle les frais ne sont pas remboursés. Dans les contrats examinés qui les chiffrent : 48 heures pour un accident dans l'un d'eux, 45 jours pour une maladie, et jusqu'à 6 mois pour une chirurgie liée à une maladie dans l'un des contrats.",
  },
  {
    question: "Jusqu'à quel âge peut-on assurer son chien ou son chat ?",
    answer:
      "Chaque contrat fixe un âge maximal à la souscription. Dans les trois contrats examinés, l'âge minimal est de 2 mois et l'âge maximal va de 5 ans à moins de 10 ans selon le contrat, la formule et parfois la race.",
  },
  {
    question: "Les maladies déjà connues sont-elles couvertes ?",
    answer:
      "En général non. Dans les contrats examinés qui le précisent, les maladies dont l'origine est antérieure à la souscription ou qui apparaissent pendant le délai de carence sont exclues ; les affections congénitales ou héréditaires sont exclues par les trois contrats. La liste exacte figure dans les conditions générales.",
  },
  {
    question: "Les vaccins sont-ils remboursés ?",
    answer:
      "Seulement si la formule comprend un forfait prévention. Dans les contrats examinés qui en prévoient un, ce forfait va de 30 à 150 € par an selon la formule, et la formule d'entrée de gamme de l'un d'eux exclut la prévention et les vaccins.",
  },
  {
    question: "Quelle est la différence entre le plafond et la franchise ?",
    answer:
      "Le plafond est le montant maximal remboursé sur une année ; au-delà, les frais restent à votre charge. La franchise est la part qui reste à votre charge sur chaque remboursement ou sur l'année. Dans les contrats examinés qui les chiffrent, le plafond va de 400 à 4 000 € par an et la franchise annuelle de 0 à 75 €, selon la formule.",
  },
  {
    question: "L'assurance est-elle obligatoire pour un chien de 1re ou 2e catégorie ?",
    answer:
      "L'assurance santé ne l'est pas, mais une assurance responsabilité civile couvrant les dommages causés par le chien à des tiers est obligatoire. Son absence est passible d'une amende de 450 € au maximum, et une attestation de responsabilité civile est exigée pour obtenir le permis de détention (service-public.gouv.fr, fiche F1839).",
  },
];

export interface PilierSource {
  label: string;
  url: string;
  consulted: string;
}

export const ANIMAUX_SOURCES: PilierSource[] = [
  {
    label: "Santévet : document d'information sur le produit d'assurance (DIPA) au 1er janvier 2026",
    url: "https://www.santevet.com/wp-content/uploads/2026/03/DIPA_-_SVFR_-_AXA_-_AZ_-_01012026_DIGITAL.pdf",
    consulted: "1er octobre 2026",
  },
  {
    label: "Dalma : document d'information sur le produit d'assurance (IPID, version 9)",
    url: "https://editique.dalma.co/formule_dalma/latest/IPID_Dalma_fr.pdf",
    consulted: "1er octobre 2026",
  },
  {
    label: "Assur O'Poil : document d'information sur le produit d'assurance (IPID)",
    url: "https://www.souscription.assuropoil.fr/Ipid-fr.pdf",
    consulted: "1er octobre 2026",
  },
  {
    label: "HelloSafe : baromètre de l'assurance animaux (données 2025)",
    url: "https://hellosafe.fr/assurance-animaux/marche",
    consulted: "1er octobre 2026",
  },
  {
    label: "L'assurance en mouvement : « Assurance animaux : La France zappe, pour combien de temps ? » (11 août 2025), reprise du chiffre de 5 %",
    url: "https://www.lassuranceenmouvement.com/2025/08/11/assurance-animaux-la-france-zappe-pour-combien-de-temps/",
    consulted: "1er octobre 2026",
  },
  {
    label: "Service-public.gouv.fr : fiche F1839, chiens dangereux (1re et 2e catégories)",
    url: "https://www.service-public.gouv.fr/particuliers/vosdroits/F1839",
    consulted: "2 octobre 2026",
  },
];
