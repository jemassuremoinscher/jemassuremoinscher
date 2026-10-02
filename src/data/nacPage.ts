// Page /assurance-nac : FAQ et sources, partagées entre le texte visible et
// le JSON-LD FAQPage (identiques mot pour mot).
//
// Sources : la fiche F34922 de service-public.gouv.fr (vérifiée le 3 octobre
// 2025 par la DILA, consultée le 2 octobre 2026), l'article L212-10 du code
// rural (identification des furets hors cession) et les trois documents
// d'information du pilier /assurance-animaux (consultés le 1er octobre 2026).
// Un seul de ces trois contrats accepte des NAC : toutes les informations
// d'assurance propres aux NAC viennent de ce seul document (décision du
// 2 octobre 2026), et la page le dit. Aucun prix, aucune économie promise.

import { ANIMAUX_SOURCES, type PilierSource } from "@/data/animauxPilier";

export const NAC_TITLE = "Assurance NAC : furet, lapin, perroquet, quelles règles ?";
export const NAC_META =
  "Assurer un NAC : règles de détention et d'acquisition selon la fiche officielle, et ce que prévoit le seul des trois contrats examinés qui accepte des NAC.";

export const F34922_URL = "https://www.service-public.gouv.fr/particuliers/vosdroits/F34922";

export const NAC_FAQ: { question: string; answer: string }[] = [
  {
    question: "Qu'est-ce qu'un NAC ?",
    answer:
      "Selon la fiche F34922 de service-public.gouv.fr, les NAC sont des espèces animales autres que les chiens et les chats, détenues par une personne pour son agrément : mammifères, rongeurs, oiseaux, reptiles, batraciens, poissons, etc. Un NAC peut appartenir à une espèce domestique ou non domestique.",
  },
  {
    question: "Peut-on assurer un lapin ou un furet ?",
    answer:
      "Parmi les trois contrats examinés, un seul accepte des NAC. Il accepte les furets âgés de 3 mois à 2 ans et les lapins âgés de 3 mois à 3 ans à la date d'effet. Les deux autres ne couvrent que les chiens et les chats.",
  },
  {
    question: "Faut-il une autorisation pour détenir un NAC ?",
    answer:
      "Cela dépend de l'espèce. Selon la fiche F34922, la détention d'un animal d'espèce non domestique est libre, soumise à déclaration au préfet ou soumise à autorisation avec certificat de capacité, selon le classement de l'espèce dans un arrêté ministériel ; pour certaines espèces, le régime dépend aussi du nombre d'animaux détenus.",
  },
  {
    question: "Faut-il identifier son NAC pour l'assurer ?",
    answer:
      "Le seul contrat examiné qui accepte des NAC exclut les animaux non identifiés et non désignés aux dispositions particulières. Selon la fiche F34922, le furet doit être identifié au fichier I-Cad, et les mammifères, oiseaux, reptiles et amphibiens d'espèce protégée doivent être marqués et inscrits au fichier I-Fap avant leur cession.",
  },
  {
    question: "Quel est le délai de carence pour un NAC ?",
    answer:
      "Dans le seul contrat examiné qui accepte des NAC : 48 heures pour un accident, 45 jours pour une maladie et 6 mois pour une intervention chirurgicale à la suite d'une maladie.",
  },
];

// F34922 et l'article L212-10, puis les trois documents d'information du
// pilier : parmi eux, seul le premier (Santévet) accepte des NAC ; les deux
// autres sont cités parce qu'ils les excluent.
export const NAC_SOURCES: PilierSource[] = [
  {
    label:
      "Service-public.gouv.fr : « Avoir un nouvel animal de compagnie (Nac) : quelles sont les règles ? », fiche F34922 (vérifiée le 3 octobre 2025)",
    url: F34922_URL,
    consulted: "2 octobre 2026",
  },
  {
    label:
      "Légifrance : article L212-10 du code rural et de la pêche maritime (version en vigueur depuis le 2 décembre 2021)",
    url: "https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000033035507/",
    consulted: "2 octobre 2026",
  },
  ...ANIMAUX_SOURCES.slice(0, 3),
];
