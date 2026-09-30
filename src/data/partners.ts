/**
 * Source unique des partenaires/assureurs affichés sur le site (carousel
 * homepage, /nos-partenaires) et du décompte qui en dérive (NB_ASSUREURS,
 * src/config/site.ts). Avant le 2026-09-30, cette liste vivait en dur dans
 * Partners.tsx sans catégorie, et le "70" affiché partout sur le site était
 * une constante manuelle sans lien avec elle (confirmé : 40 entrées réelles
 * ici contre "70+" répété 145 fois ailleurs — écart non résolu par ce
 * chantier, qui ne touche que ce fichier et le décompte qui en dérive).
 *
 * `logo` : import d'un fichier réellement présent dans le dépôt — jamais une
 * URL externe, jamais téléchargé depuis internet.
 * `autorisationLogo` : le logo n'est affiché QUE si `logo` existe ET que ce
 * champ vaut true. Sans logo (ou sans autorisation), le nom s'affiche en
 * texte. Les 40 entrées historiques sont marquées true (déjà en ligne en
 * production, autorisation implicite antérieure à ce chantier) ; toute
 * nouvelle entrée sans fichier fourni reste à false par défaut.
 * `categories` : tableau libre (ex. "animaux"). Vide = non classée — ne pas
 * en déduire une absence de couverture, juste que la catégorisation n'a pas
 * encore été faite pour cette entrée (décision de Paul, 2026-09-30 : ne pas
 * toucher aux catégories des 34 entrées hors périmètre animaux).
 * `type` : "assureur" | "courtier" | "a verifier" — statut vérifié dans un
 * registre officiel (ORIAS pour les courtiers, ACPR/liste des organismes
 * d'assurance pour les assureurs), jamais une déduction. REGAFI (registre
 * consulté le 2026-09-30 pour les 25 ajouts ci-dessous) couvre les
 * établissements BANCAIRES/PAIEMENT/monnaie électronique — PAS les
 * assureurs ni les courtiers d'assurance ; recherche via ce registre non
 * concluante pour cette raison, pas pour un problème de nom. Les 25
 * entrées ci-dessous sont donc "a verifier" (statut réel non prouvé par un
 * registre) même si Paul en confirme la relation partenariale.
 * `publicRestreint` : mention à afficher quand le partenaire ne s'adresse
 * qu'à un public défini (ex. professions de santé, collectivités) — pour
 * éviter de suggérer au visiteur qu'il peut souscrire alors qu'il n'y est
 * pas éligible.
 */

import aCommeAssureLogo from "@/assets/logos/a-comme-assure.png";
import abeilleLogo from "@/assets/logos/abeille.webp";
import acheelLogo from "@/assets/logos/acheel.webp";
import alanLogo from "@/assets/logos/alan-new.webp";
import allianzLogo from "@/assets/logos/allianz.webp";
import amaguizLogo from "@/assets/logos/amaguiz.webp";
import amvLogo from "@/assets/logos/amv.webp";
import animauxSanteLogo from "@/assets/logos/animaux-sante.png";
import aonLogo from "@/assets/logos/aon.webp";
import aprilLogo from "@/assets/logos/april-new.webp";
import aprilMotoLogo from "@/assets/logos/april-moto.png";
import assu2000Logo from "@/assets/logos/assu-2000.png";
import assurpeopleLogo from "@/assets/logos/assurpeople.png";
import axaLogo from "@/assets/logos/axa.webp";
import bulleBleueLogo from "@/assets/logos/bulle-bleue.png";
import cardifLogo from "@/assets/logos/cardif.png";
import directAssuranceLogo from "@/assets/logos/direct-assurance-new.webp";
import fidanimoLogo from "@/assets/logos/fidanimo.png";
import ganLogo from "@/assets/logos/gan.svg";
import generaliLogo from "@/assets/logos/generali-new.webp";
import gmfLogo from "@/assets/logos/gmf-new.webp";
import goodflairLogo from "@/assets/logos/goodflair.png";
import leocareLogo from "@/assets/logos/leocare.webp";
import lolivierLogo from "@/assets/logos/lolivier.webp";
import maafLogo from "@/assets/logos/maaf.webp";
import macifLogo from "@/assets/logos/macif-new.webp";
import maifLogo from "@/assets/logos/maif.webp";
import matmutLogo from "@/assets/logos/matmut-new.webp";
import maxanceLogo from "@/assets/logos/maxance.webp";
import milaLogo from "@/assets/logos/mila.webp";
import mmaLogo from "@/assets/logos/mma-new.webp";
import mpaLogo from "@/assets/logos/mpa.webp";
import neoLogo from "@/assets/logos/neo.webp";
import omerosLogo from "@/assets/logos/omeros.png";
import ornikarLogo from "@/assets/logos/ornikar.webp";
import santevetLogo from "@/assets/logos/santevet.png";
import sollyAzarLogo from "@/assets/logos/solly-azar.png";
import swissLifeLogo from "@/assets/logos/swisslife.webp";
import wilovLogo from "@/assets/logos/wilov.webp";

export interface Partner {
  name: string;
  logo?: string;
  autorisationLogo?: boolean;
  categories: string[];
  type?: "assureur" | "courtier" | "a verifier";
  publicRestreint?: string;
}

export const partners: Partner[] = [
  // ── 40 entrées historiques (Partners.tsx avant le 2026-09-30) ──
  { name: "A comme Assure", logo: aCommeAssureLogo, autorisationLogo: true, categories: [] },
  { name: "Abeille Assurances", logo: abeilleLogo, autorisationLogo: true, categories: [] },
  { name: "Acheel", logo: acheelLogo, autorisationLogo: true, categories: ["animaux"] },
  { name: "Alan", logo: alanLogo, autorisationLogo: true, categories: [] },
  { name: "Allianz", logo: allianzLogo, autorisationLogo: true, categories: [] },
  { name: "Amaguiz", logo: amaguizLogo, autorisationLogo: true, categories: [] },
  { name: "AMV", logo: amvLogo, autorisationLogo: true, categories: [] },
  { name: "Animaux Santé", logo: animauxSanteLogo, autorisationLogo: true, categories: ["animaux"] },
  { name: "AON", logo: aonLogo, autorisationLogo: true, categories: [] },
  { name: "April", logo: aprilLogo, autorisationLogo: true, categories: [] },
  { name: "April Moto", logo: aprilMotoLogo, autorisationLogo: true, categories: [] },
  { name: "Assu 2000", logo: assu2000Logo, autorisationLogo: true, categories: [] },
  { name: "Assurpeople", logo: assurpeopleLogo, autorisationLogo: true, categories: [] },
  { name: "AXA", logo: axaLogo, autorisationLogo: true, categories: [] },
  { name: "Bulle Bleue", logo: bulleBleueLogo, autorisationLogo: true, categories: ["animaux"] },
  { name: "Cardif", logo: cardifLogo, autorisationLogo: true, categories: [] },
  { name: "Direct Assurance", logo: directAssuranceLogo, autorisationLogo: true, categories: [] },
  { name: "Fidanimo", logo: fidanimoLogo, autorisationLogo: true, categories: ["animaux"] },
  { name: "GAN", logo: ganLogo, autorisationLogo: true, categories: [] },
  { name: "Generali", logo: generaliLogo, autorisationLogo: true, categories: [] },
  { name: "GMF", logo: gmfLogo, autorisationLogo: true, categories: [] },
  { name: "Goodflair", logo: goodflairLogo, autorisationLogo: true, categories: ["animaux"] },
  { name: "Leocare", logo: leocareLogo, autorisationLogo: true, categories: [] },
  { name: "L'Olivier Assurance", logo: lolivierLogo, autorisationLogo: true, categories: [] },
  { name: "MAAF", logo: maafLogo, autorisationLogo: true, categories: [] },
  { name: "MACIF", logo: macifLogo, autorisationLogo: true, categories: [] },
  { name: "MAIF", logo: maifLogo, autorisationLogo: true, categories: [] },
  { name: "Matmut", logo: matmutLogo, autorisationLogo: true, categories: [] },
  { name: "Maxance", logo: maxanceLogo, autorisationLogo: true, categories: [] },
  { name: "Mila", logo: milaLogo, autorisationLogo: true, categories: [] },
  { name: "MMA", logo: mmaLogo, autorisationLogo: true, categories: [] },
  { name: "Mutuelle de Poitiers", logo: mpaLogo, autorisationLogo: true, categories: [] },
  { name: "Neo Assurances", logo: neoLogo, autorisationLogo: true, categories: [] },
  { name: "Omeros", logo: omerosLogo, autorisationLogo: true, categories: [] },
  { name: "Ornikar", logo: ornikarLogo, autorisationLogo: true, categories: [] },
  { name: "Santevet", logo: santevetLogo, autorisationLogo: true, categories: ["animaux"] },
  { name: "Solly Azar", logo: sollyAzarLogo, autorisationLogo: true, categories: [] },
  { name: "SwissLife", logo: swissLifeLogo, autorisationLogo: true, categories: [] },
  { name: "Wilov", logo: wilovLogo, autorisationLogo: true, categories: [] },

  // ── 12 ajouts, liste de référence animaux fournie par Paul (2026-09-30) ──
  // Aucun logo fourni : nom en texte tant que Paul n'a pas déposé les
  // fichiers dans public/partners/ avec autorisation confirmée.
  { name: "Dalma", categories: ["animaux"] },
  { name: "Kozoo", categories: ["animaux"] },
  { name: "Assur O'Poil", categories: ["animaux"] },
  { name: "Agria", categories: ["animaux"] },
  { name: "Assurveto", categories: ["animaux"] },
  { name: "Cplussur", categories: ["animaux"] },
  { name: "Lassie", categories: ["animaux"] },
  { name: "Selfassurance", categories: ["animaux"] },
  { name: "Fidel'Ami Santé", categories: ["animaux"] },
  { name: "ECA Assurances", categories: ["animaux"] },
  { name: "MGEN", categories: ["animaux"] },
  { name: "Groupama", categories: ["animaux"] },

  // ── 25 ajouts confirmés par Paul (2026-09-30) ──
  // Aucun logo fourni. `type` à "a verifier" pour les 25 : REGAFI (seul
  // registre consulté) ne couvre pas les assureurs/courtiers d'assurance,
  // voir le commentaire d'en-tête — reste à vérifier via ORIAS ou la liste
  // ACPR des organismes d'assurance.
  { name: "Pacifica (Crédit Agricole Assurances)", categories: [], type: "a verifier" },
  { name: "Thélem assurances", categories: [], type: "a verifier" },
  { name: "Allianz Direct", categories: [], type: "a verifier" },
  { name: "Hiscox", categories: [], type: "a verifier" },
  { name: "Zurich", categories: [], type: "a verifier" },
  { name: "SMABTP / SMA", categories: [], type: "a verifier" },
  { name: "SMACL Assurances", categories: [], type: "a verifier", publicRestreint: "Collectivités locales, associations et acteurs de l'économie sociale" },
  { name: "Wakam", categories: [], type: "a verifier" },
  { name: "Lemonade", categories: [], type: "a verifier" },
  { name: "Sogessur", categories: [], type: "a verifier" },
  { name: "Mutuelle des Motards", categories: [], type: "a verifier" },
  { name: "Harmonie Mutuelle", categories: [], type: "a verifier" },
  { name: "Malakoff Humanis", categories: [], type: "a verifier" },
  { name: "AG2R La Mondiale", categories: [], type: "a verifier" },
  { name: "Klesia", categories: [], type: "a verifier" },
  { name: "Apicil", categories: [], type: "a verifier" },
  { name: "MGEFI", categories: [], type: "a verifier" },
  { name: "MACSF", categories: [], type: "a verifier", publicRestreint: "Professions de santé" },
  { name: "CNP Assurances", categories: [], type: "a verifier" },
  { name: "AFI ESCA", categories: [], type: "a verifier" },
  { name: "Suravenir", categories: [], type: "a verifier" },
  { name: "Assurances du Crédit Mutuel (ACM)", categories: [], type: "a verifier" },
  { name: "MetLife", categories: [], type: "a verifier" },
  { name: "Sogecap", categories: [], type: "a verifier" },
  { name: "Alptis", categories: [], type: "a verifier" },
];
