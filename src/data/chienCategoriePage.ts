// Page /assurance-chien-categorie-1-2 : FAQ et source, partagées entre le
// texte visible et le JSON-LD FAQPage (identiques mot pour mot).
//
// Source unique : fiche F1839 de service-public.gouv.fr (« Avoir un chien de
// catégorie : quelles sont les règles ? », vérifiée le 7 novembre 2025 par
// la DILA, consultée le 2 octobre 2026). Aucune obligation absente de la
// fiche ; articles du Code rural cités tels que la fiche les cite.

export const CHIEN_CATEGORIE_TITLE = "Chien de 1re ou 2e catégorie : obligations et assurance RC";
export const CHIEN_CATEGORIE_META =
  "Chien de 1re ou 2e catégorie : permis de détention, identification, vaccin antirabique, évaluation comportementale et assurance responsabilité civile.";

export const F1839_URL = "https://www.service-public.gouv.fr/particuliers/vosdroits/F1839";

export const CHIEN_CATEGORIE_FAQ: { question: string; answer: string }[] = [
  {
    question: "Quelle est la différence entre un chien de 1re et de 2e catégorie ?",
    answer:
      "La 1re catégorie regroupe les chiens d'attaque : des chiens sans pedigree, issus de croisements assimilables par leur morphologie aux races American Staffordshire terrier, Mastiff ou Tosa. La 2e catégorie regroupe les chiens de garde et de défense : les chiens de race American Staffordshire terrier, Rottweiler et Tosa, avec pedigree, ainsi que les chiens issus de croisements assimilables au Rottweiler.",
  },
  {
    question: "L'assurance est-elle obligatoire pour un chien de catégorie ?",
    answer:
      "Oui pour la responsabilité civile : le propriétaire ou le détenteur doit être assuré pour les dommages que le chien peut causer à des tiers, membres de la famille compris. L'absence d'assurance est passible d'une amende de 450 € au maximum. Une assurance santé pour les frais vétérinaires n'est en revanche pas obligatoire.",
  },
  {
    question: "Quels documents faut-il pour obtenir le permis de détention ?",
    answer:
      "Le formulaire cerfa, la copie du passeport européen du chien (identification, vaccination antirabique en cours de validité et, pour la 1re catégorie, stérilisation), l'attestation d'assurance responsabilité civile et l'attestation d'aptitude. Pour le permis définitif, il faut aussi les conclusions de l'évaluation comportementale.",
  },
  {
    question: "À quel âge faire l'évaluation comportementale ?",
    answer:
      "Entre 8 mois et 1 an, auprès d'un vétérinaire agréé. Elle est aussi obligatoire si le chien mord quelqu'un. Avant 8 mois, le maire délivre un permis provisoire valable jusqu'aux 12 mois du chien.",
  },
  {
    question: "Peut-on encore acheter un chien de 1re catégorie ?",
    answer:
      "Non. Il n'est plus possible d'acheter, de vendre ou de donner un chien de 1re catégorie, ni d'en importer ou d'en introduire en métropole, dans les départements et régions d'outre-mer, à Saint-Barthélemy, à Saint-Martin ou à Saint-Pierre-et-Miquelon.",
  },
  {
    question: "Le permis de détention est-il payant ?",
    answer:
      "Non, le permis est gratuit. Une demande doit être faite pour chaque chien, auprès de la mairie de la commune de résidence ou, à Paris, de la préfecture de police. Les frais de la formation qui donne l'attestation d'aptitude restent à la charge du propriétaire.",
  },
  {
    question: "Mon chien de catégorie doit-il porter une muselière ?",
    answer:
      "Oui, avec une laisse : sur la voie publique et dans les parties communes des immeubles collectifs pour les deux catégories, et aussi dans les lieux publics, les locaux ouverts au public et les transports en commun pour la 2e catégorie. Les chiens de 1re catégorie n'ont pas accès à ces lieux, sauf la voie publique.",
  },
];

// Textes cités par la fiche F1839, dans les termes de la fiche.
export const F1839_TEXTES = [
  "Code rural et de la pêche maritime : articles L211-11 à L211-28",
  "Code rural et de la pêche maritime : article L215-1",
  "Code rural et de la pêche maritime : article L215-2",
  "Code rural et de la pêche maritime : article L215-2-1",
  "Code rural et de la pêche maritime : articles D211-3-1 à D211-3-4",
  "Code rural et de la pêche maritime : articles R211-5 à R211-7",
  "Code rural et de la pêche maritime : article R215-2",
  "Arrêté du 27 avril 1999 établissant la liste des types de chiens susceptibles d'être dangereux",
];
