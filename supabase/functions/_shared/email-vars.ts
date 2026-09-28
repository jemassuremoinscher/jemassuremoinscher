// Partagé entre crm-send-auto-template (envoi automatique déclenché par
// trigger/cron) et crm-send-template (envoi manuel par un agent depuis le
// CRM) : les deux doivent résoudre {{prenom}}, {{produit}} et
// {{lien_desinscription}} de façon identique. Centralisé le 2026-09-28
// après avoir dupliqué ce code une première fois — la duplication marche
// tant qu'on n'oublie pas de mettre à jour les deux copies, ce qui est
// justement le genre d'écart que ce projet essaie d'éliminer ce mois-ci.
//
// Import relatif ("../_shared/email-vars.ts") : c'est le mécanisme de
// partage de code standard entre Edge Functions Supabase, résolu et
// empaqueté par Deno au déploiement comme n'importe quel autre import
// relatif du dossier supabase/functions. Rien de spécifique à configurer
// côté Lovable/Supabase pour que ce fichier soit inclus — mais aucun outil
// à ma disposition ne me permet de confirmer que le déploiement Lovable
// package bien ce dossier : à vérifier après coup en testant réellement
// {{lien_desinscription}} sur un envoi (auto ET manuel), pas seulement en
// lisant les logs de build.

export const PRODUCT_LABELS: Record<string, string> = {
  auto: "auto",
  moto: "moto",
  habitation: "habitation",
  sante: "santé",
  pret: "emprunteur",
  animaux: "animaux",
  vie: "vie",
  prevoyance: "prévoyance",
  rc_pro: "RC Pro",
  mrp: "MRP",
  gli: "loyers impayés",
  pno: "PNO",
  gestion_locative: "gestion locative",
  metiers_atypiques: "métiers atypiques",
  velo: "vélo",
  trottinette: "trottinette",
  camping_car: "camping-car",
  sans_permis: "sans permis",
  auto_temporaire: "auto temporaire",
  flotte: "flotte auto",
  cyber: "cyber",
  decennale: "décennale",
  protection_juridique: "protection juridique",
  mutuelle_entreprise: "mutuelle d'entreprise",
};

// 2026-09-28 : plus de libellé générique inventé pour un slug hors liste
// (un fallback "" faisait lire "assurance ." dans les templates qui
// écrivent "assurance {{produit}}."). Renvoie null pour un slug non
// couvert - à l'appelant de refuser l'envoi et de journaliser le slug
// manquant dans site_error_log plutôt que d'envoyer un texte cassé.
export function productLabel(slug: string): string | null {
  return slug in PRODUCT_LABELS ? PRODUCT_LABELS[slug] : null;
}

// Templates exemptés d'email_opt_out (contenu transactionnel, nécessaire
// au suivi du dossier en cours - pas de la prospection). Frontière à faire
// valider par un juriste. Utilisé uniquement par crm-send-auto-template
// (envoi déclenché automatiquement) - un envoi manuel n'a pas de nom de
// template fixe (sujet/corps librement édités par l'agent), donc pas
// d'application directe de cette liste côté crm-send-template.
export const TRANSACTIONAL_TEMPLATES = new Set([
  "Confirmation de souscription / Accueil client",
  "Demande de pièces justificatives manquantes",
]);

export function fillVars(text: string, firstName: string, product: string, unsubLink: string): string {
  return text
    .replace(/\{\{\s*prenom\s*\}\}/gi, firstName)
    .replace(/\{\{\s*produit\s*\}\}/gi, product)
    .replace(/\{\{\s*lien_desinscription\s*\}\}/gi, unsubLink);
}

export function containsVar(text: string, varName: "prenom" | "produit" | "lien_desinscription"): boolean {
  return new RegExp(`\\{\\{\\s*${varName}\\s*\\}\\}`, "i").test(text);
}

// Garde-fou générique, appliqué APRÈS fillVars sur le sujet ET le corps,
// en envoi manuel comme automatique. Deux motifs :
// - {{...}} encore présent : une variable non reconnue par fillVars (nom
//   mal orthographié, ou une nouvelle variable jamais implémentée) est
//   restée telle quelle.
// - [xxx] d'au moins 3 caractères : couvre les placeholders à la main
//   laissés dans le texte des templates eux-mêmes, jamais traités comme
//   des variables ({{...}}) donc jamais remplacés par fillVars — cas réels
//   trouvés dans ce projet : "[Nom du document manquant]",
//   "[Numéro de téléphone]".
// Renvoie le premier motif trouvé (pour le message d'erreur), ou null.
const UNRESOLVED_VAR_RE = /\{\{[^{}]+\}\}/;
const UNRESOLVED_BRACKET_RE = /\[[^\[\]]{3,}\]/;

export function findUnresolvedPlaceholder(text: string): string | null {
  return UNRESOLVED_VAR_RE.exec(text)?.[0] ?? UNRESOLVED_BRACKET_RE.exec(text)?.[0] ?? null;
}

async function getUnsubKey(): Promise<CryptoKey> {
  const secretHex = Deno.env.get("UNSUB_TOKEN_SECRET") ?? "";
  const bytes = secretHex.match(/.{1,2}/g)?.map((b) => parseInt(b, 16)) ?? [];
  if (bytes.length !== 32) {
    throw new Error("UNSUB_TOKEN_SECRET invalide ou absent (attendu 32 octets / 64 caractères hex)");
  }
  return crypto.subtle.importKey("raw", new Uint8Array(bytes), "AES-GCM", false, ["encrypt"]);
}

function toBase64Url(bytes: Uint8Array): string {
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

// Lien vers la page du SITE (/desinscription), pas vers la fonction
// email-optout directement. Le jeton est mis dans le FRAGMENT (#token=...),
// jamais en query string : un fragment n'est jamais envoyé au serveur dans
// une requête HTTP (ni logs serveur/CDN, ni en-tête Referer vers un tiers
// que la page chargerait), contrairement à une query string. Combiné à
// l'exclusion explicite de cette route du chargement des scripts
// analytics (index.html/loadAnalytics), le jeton ne doit jamais atteindre
// GA4/Clarity/Meta Pixel ni aucun serveur autre que celui qui le déchiffre.
export async function buildUnsubLink(contactId: string): Promise<string> {
  const key = await getUnsubKey();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    new TextEncoder().encode(contactId),
  );
  const combined = new Uint8Array(iv.length + ciphertext.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(ciphertext), iv.length);
  const token = toBase64Url(combined);
  return `https://www.jemassuremoinscher.fr/desinscription#token=${token}`;
}

const escapeHtml = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const URL_RE = /(https?:\/\/[^\s<]+[^\s<.,;:!?)\]}])/g;
export const linkify = (html: string): string =>
  html.replace(URL_RE, (url) => `<a href="${url}" style="color:#2563eb;text-decoration:underline;">${url}</a>`);

const EMAIL_LOGO_HEADER = `<div style="background-color:#ffffff;padding:24px 0;text-align:center;">
  <img
    src="https://www.jemassuremoinscher.fr/arthur-thumbs-up-email.png"
    alt="jemassuremoinscher.fr"
    width="140"
    height="151"
    style="display:block;margin:0 auto;width:140px;height:auto;max-width:140px;border:0;outline:none;text-decoration:none;"
  />
</div>`;

export const bodyToHtml = (body: string): string =>
  `${EMAIL_LOGO_HEADER}<div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;font-size:15px;line-height:1.6;color:#111827;">${
    linkify(escapeHtml(body).replace(/\r?\n/g, "<br>"))
  }</div>`;
