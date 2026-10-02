// Page /assurance-chaton : FAQ et sources, partagées entre le texte visible et
// le JSON-LD FAQPage (identiques mot pour mot).
//
// Sources : les trois documents d'information du pilier /assurance-animaux
// (consultés le 1er octobre 2026) et la fiche F34877 de service-public.gouv.fr
// (consultée le 2 octobre 2026). Rien sur la vaccination des chatons en
// dehors de ce que disent ces sources. Aucun prix, aucune économie promise.

import { type PilierSource } from "@/data/animauxPilier";
import { CHIOT_SOURCES } from "@/data/chiotPage";

export const CHATON_TITLE = "Assurance chaton : carence, stérilisation, identification";
export const CHATON_META =
  "Assurer un chaton : âge minimum, carence, maladies héréditaires, stérilisation et identification. Règles officielles et trois contrats examinés.";

export const CHATON_FAQ: { question: string; answer: string }[] = [
  {
    question: "À partir de quel âge peut-on assurer un chaton ?",
    answer:
      "Dès 2 mois dans les trois contrats examinés pour ce guide. C'est aussi l'âge minimum fixé pour acquérir un chaton (8 semaines), selon la fiche F34877 de service-public.gouv.fr.",
  },
  {
    question: "La stérilisation du chaton est-elle remboursée ?",
    answer:
      "Une stérilisation qui ne fait pas suite à une maladie n'est pas couverte par la garantie accident et maladie des contrats examinés. Elle peut l'être dans le cadre d'un forfait ou d'une option prévention, ou dans certaines formules seulement : vérifiez ce que prévoit la formule proposée.",
  },
  {
    question: "Faut-il attendre que le chaton soit vacciné pour l'assurer ?",
    answer:
      "Les documents d'information examinés n'imposent pas de vaccination pour souscrire. En revanche, deux des trois contrats excluent, au moins dans certaines formules, les maladies qui auraient pu être évitées par les vaccins : vérifiez cette clause dans votre contrat.",
  },
  {
    question: "Une maladie héréditaire découverte plus tard est-elle couverte ?",
    answer:
      "Non dans les trois contrats examinés : ils excluent les affections congénitales ou héréditaires, même lorsqu'elles se révèlent après la souscription.",
  },
  {
    question: "Le chaton doit-il être identifié avant d'être assuré ?",
    answer:
      "Il doit l'être de toute façon avant d'être cédé, selon la fiche F34877 de service-public.gouv.fr. Côté assurance, les documents d'information examinés ne posent pas l'identification comme condition générale de souscription, mais l'un d'eux exclut les animaux non identifiés.",
  },
  {
    question: "Combien de temps après la souscription mon chaton est-il couvert ?",
    answer:
      "Cela dépend du délai de carence de chaque contrat. Dans les contrats examinés qui les chiffrent : 48 heures pour un accident dans l'un d'eux, 45 jours pour une maladie, et jusqu'à 6 mois pour une chirurgie liée à une maladie dans l'un des contrats.",
  },
];

// Mêmes sources que la page chiot : les trois documents d'information puis
// la fiche F34877.
export const CHATON_SOURCES: PilierSource[] = CHIOT_SOURCES;
