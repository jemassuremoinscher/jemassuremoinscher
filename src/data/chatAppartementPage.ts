// Page /assurance-chat-appartement : FAQ et sources, partagées entre le texte
// visible et le JSON-LD FAQPage (identiques mot pour mot).
//
// Sources : fiches F2693 (bail et animaux, vérifiée le 6 mars 2026) et F17603
// (assurance et animal de compagnie, vérifiée le 6 février 2026) de
// service-public.gouv.fr, consultées le 3 octobre 2026 ; fiche F34877 et
// article L212-10 du code rural pour l'identification ; les trois documents
// d'information du pilier /assurance-animaux. Aucun risque de santé propre au
// chat d'intérieur (aucune source, décision du 3 octobre 2026). Aucun prix,
// aucune économie promise.

import { ANIMAUX_SOURCES, type PilierSource } from "@/data/animauxPilier";
import { CHIOT_SOURCES } from "@/data/chiotPage";
import { NAC_SOURCES } from "@/data/nacPage";

export const CHAT_APPART_TITLE = "Assurance chat d'appartement : santé, responsabilité, bail";
export const CHAT_APPART_META =
  "Chat en appartement : les règles pour un locataire, qui répond des dommages causés à autrui, l'identification et ce que prévoient trois contrats santé.";

export const CHAT_APPART_FAQ: { question: string; answer: string }[] = [
  {
    question: "Un propriétaire peut-il interdire un chat dans un logement loué ?",
    answer:
      "Pas dans un logement loué comme résidence principale, vide ou meublé : selon la fiche F2693 de service-public.gouv.fr, le locataire peut y détenir un ou plusieurs animaux de compagnie s'il respecte la tranquillité du voisinage. Dans un meublé de tourisme, le loueur peut interdire tout animal dans le contrat de location.",
  },
  {
    question: "Faut-il une assurance pour son chat ?",
    answer:
      "Aucune assurance n'est obligatoire pour un chat, selon la fiche F17603 de service-public.gouv.fr. Mais vous êtes responsable des dommages matériels et corporels qu'il peut causer à un tiers ; en pratique, la garantie responsabilité civile de votre assurance multirisque habitation permet de les couvrir.",
  },
  {
    question: "Mon chat abîme le logement que je loue : qui paie ?",
    answer:
      "Selon la fiche F2693, le locataire est responsable des dégâts causés par ses animaux. Pour savoir si votre assurance les prend en charge, vérifiez votre contrat habitation.",
  },
  {
    question: "Un chat qui ne sort jamais doit-il être identifié ?",
    answer:
      "Oui. Selon l'article L212-10 du code rural et de la pêche maritime, les chats de plus de sept mois doivent être identifiés, même en dehors de toute cession, et tout chat doit l'être avant d'être cédé.",
  },
  {
    question: "Existe-t-il une assurance santé pour les chats d'intérieur ?",
    answer:
      "L'un des trois contrats examinés propose une formule dédiée aux chats d'intérieur ; son document d'information la mentionne pour l'alimentation thérapeutique et ne détaille pas d'autres garanties propres à cette formule.",
  },
];

export const CHAT_APPART_SOURCES: PilierSource[] = [
  {
    label:
      "Service-public.gouv.fr : « Le bail (ou contrat de location) peut-il interdire les animaux dans le logement ? », fiche F2693 (vérifiée le 6 mars 2026) — https://www.service-public.gouv.fr/particuliers/vosdroits/F2693",
    url: "https://www.service-public.gouv.fr/particuliers/vosdroits/F2693",
    consulted: "3 octobre 2026",
  },
  {
    label:
      "Service-public.gouv.fr : « Doit-on être assuré lorsqu'on a un animal de compagnie ? », fiche F17603 (vérifiée le 6 février 2026) — https://www.service-public.gouv.fr/particuliers/vosdroits/F17603",
    url: "https://www.service-public.gouv.fr/particuliers/vosdroits/F17603",
    consulted: "3 octobre 2026",
  },
  // F34877 et article L212-10, déjà cités par /assurance-chiot et /assurance-nac.
  CHIOT_SOURCES[CHIOT_SOURCES.length - 1],
  NAC_SOURCES[1],
  ...ANIMAUX_SOURCES.slice(0, 3),
];
