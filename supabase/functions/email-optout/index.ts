import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Appelée en POST uniquement, depuis la page /desinscription du site
// (jamais directement depuis le lien dans l'email) : un GET ne doit JAMAIS
// modifier quoi que ce soit. Des scanners de sécurité d'entreprise suivent
// automatiquement les liens présents dans les emails - un lien-GET
// classique serait donc "cliqué" par une machine dès la première relance
// reçue. La page du site affiche un bouton explicite "Confirmer ma
// désinscription" qui déclenche ce POST.
//
// Pas de réponse HTML : le domaine de fonctions Supabase par défaut
// réécrit text/html en text/plain. Cette fonction ne renvoie que du JSON ;
// la confirmation visible vit sur le site (src/pages/Desinscription.tsx).
//
// Anti-énumération vis-à-vis de l'EXTÉRIEUR : réponse JSON strictement
// identique que le jeton soit valide, invalide, corrompu, ou absent.
// Distinction faite uniquement en INTERNE (2026-09-28) : une clé
// UNSUB_TOKEN_SECRET absente/invalide est un problème de configuration -
// ça doit être visible dans site_error_log immédiatement. Un jeton
// simplement invalide/corrompu (bruit de scanners, requêtes au hasard)
// reste silencieux, sans quoi site_error_log se remplirait de bruit sans
// valeur opérationnelle.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 20;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }
  if (record.count >= MAX_REQUESTS_PER_WINDOW) return false;
  record.count++;
  return true;
}

async function getUnsubKey(): Promise<CryptoKey> {
  const secretHex = Deno.env.get("UNSUB_TOKEN_SECRET") ?? "";
  const bytes = secretHex.match(/.{1,2}/g)?.map((b) => parseInt(b, 16)) ?? [];
  if (bytes.length !== 32) {
    throw new Error("UNSUB_TOKEN_SECRET invalide ou absent (attendu 32 octets / 64 caractères hex)");
  }
  return crypto.subtle.importKey("raw", new Uint8Array(bytes), "AES-GCM", false, ["decrypt"]);
}

function fromBase64Url(s: string): Uint8Array {
  const b64 = s.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((s.length + 3) % 4);
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

// Retourne le contactId déchiffré, ou null. En interne (jamais visible par
// l'appelant), journalise dans site_error_log SEULEMENT si la clé elle-même
// est invalide/absente - jamais pour un jeton simplement invalide/corrompu.
async function decryptToken(admin: ReturnType<typeof createClient>, token: string): Promise<string | null> {
  let key: CryptoKey;
  try {
    key = await getUnsubKey();
  } catch (e) {
    console.error("email-optout: UNSUB_TOKEN_SECRET invalide ou absent:", e);
    await admin.from("site_error_log").insert({
      page_path: "function:email-optout",
      error_type: "unsub_secret_invalid",
      message: e instanceof Error ? e.message : String(e),
      context: {},
    });
    return null;
  }

  try {
    const combined = fromBase64Url(token);
    const iv = combined.slice(0, 12);
    const ciphertext = combined.slice(12);
    const plaintext = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, ciphertext);
    return new TextDecoder().decode(plaintext);
  } catch {
    // Jeton invalide/corrompu : silencieux par design.
    return null;
  }
}

serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Réponse neutre pour tout ce qui n'est pas un POST volontaire - aucune
  // mutation possible en dehors de la branche ci-dessous.
  if (req.method !== "POST") {
    return json({ ok: true });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const admin = createClient(supabaseUrl, serviceKey);

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
  if (!checkRateLimit(ip)) {
    return json({ ok: true });
  }

  let token: string | null = null;
  try {
    const reqBody = await req.json();
    token = typeof reqBody?.token === "string" ? reqBody.token : null;
  } catch {
    return json({ ok: true });
  }
  if (!token) {
    return json({ ok: true });
  }

  const contactId = await decryptToken(admin, token);
  if (!contactId) {
    return json({ ok: true });
  }

  try {
    // Idempotent par nature : reposer true sur true ne change rien.
    await admin.from("contacts").update({ email_opt_out: true }).eq("id", contactId);
  } catch (e) {
    console.error("email-optout: échec de la mise à jour (jeton valide mais écriture échouée):", e);
  }

  return json({ ok: true });
});
