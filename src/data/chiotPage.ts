// Page /assurance-chiot : FAQ et sources, partagées entre le texte visible et
// le JSON-LD FAQPage (identiques mot pour mot).
//
// Sources : les trois documents d'information déjà utilisés pour le pilier
// /assurance-animaux (consultés le 1er octobre 2026) et la fiche F34877 de
// service-public.gouv.fr (vérifiée le 28 avril 2026 par la DILA, consultée
// le 2 octobre 2026). Aucun prix, aucune économie promise.

import { ANIMAUX_SOURCES, type PilierSource } from "@/data/animauxPilier";

export const CHIOT_TITLE = "Assurance chiot : âge, carence, vaccins et identification";
export const CHIOT_META =
  "Assurer un chiot : âge minimum, carence, maladies héréditaires, vaccins et identification obligatoire. Règles officielles et trois contrats examinés.";

export const F34877_URL = "https://www.service-public.gouv.fr/particuliers/vosdroits/F34877";

export const CHIOT_FAQ: { question: string; answer: string }[] = [
  {
    question: "À partir de quel âge peut-on assurer un chiot ?",
    answer:
      "Dès 2 mois dans les trois contrats examinés pour ce guide. C'est aussi l'âge minimum fixé pour acquérir un chiot (8 semaines), selon la fiche F34877 de service-public.gouv.fr.",
  },
  {
    question: "Faut-il attendre que le chiot soit vacciné pour l'assurer ?",
    answer:
      "Les documents d'information examinés n'imposent pas de vaccination pour souscrire. En revanche, deux des trois contrats excluent, au moins dans certaines formules, les maladies qui auraient pu être évitées par les vaccins : vérifiez cette clause dans votre contrat.",
  },
  {
    question: "Les vaccins du chiot sont-ils remboursés ?",
    answer:
      "Seulement si la formule comprend un forfait ou une option prévention. Dans le contrat qui le chiffre, ce forfait va de 30 à 150 € par an selon la formule ; un autre contrat exclut les vaccinations dans sa formule d'entrée de gamme.",
  },
  {
    question: "Une maladie héréditaire découverte plus tard est-elle couverte ?",
    answer:
      "Non dans les trois contrats examinés : ils excluent les affections congénitales ou héréditaires, même lorsqu'elles se révèlent après la souscription. L'un d'eux cite la dysplasie de la hanche et la luxation chronique de la rotule.",
  },
  {
    question: "Le chiot doit-il être identifié avant d'être assuré ?",
    answer:
      "Il doit l'être de toute façon avant d'être cédé, selon la fiche F34877 de service-public.gouv.fr. Côté assurance, les documents d'information examinés ne posent pas l'identification comme condition générale de souscription, mais l'un d'eux exclut les animaux non identifiés.",
  },
  {
    question: "Combien de temps après la souscription mon chiot est-il couvert ?",
    answer:
      "Cela dépend du délai de carence de chaque contrat. Dans les contrats examinés qui les chiffrent : 48 heures pour un accident dans l'un d'eux, 45 jours pour une maladie, et jusqu'à 6 mois pour une chirurgie liée à une maladie dans l'un des contrats.",
  },
];

// Les trois documents d'information (mêmes libellés et dates que le pilier)
// puis la fiche F34877.
export const CHIOT_SOURCES: PilierSource[] = [
  ...ANIMAUX_SOURCES.slice(0, 3),
  {
    label: "Service-public.gouv.fr : « Avoir un chien ou un chat : quelles sont les règles ? » (fiche F34877)",
    url: F34877_URL,
    consulted: "2 octobre 2026",
  },
];
