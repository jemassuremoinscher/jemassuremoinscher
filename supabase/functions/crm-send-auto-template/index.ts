import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
  productLabel,
  TRANSACTIONAL_TEMPLATES,
  fillVars,
  containsVar,
  findUnresolvedPlaceholder,
  buildUnsubLink,
  bodyToHtml,
} from "../_shared/email-vars.ts";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const FROM = "jemassuremoinscher.fr <contact@jemassuremoinscher.fr>";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });

// Comparaison à temps constant maison — pas d'import externe (un import
// deno.land/std indisponible au déploiement a déjà cassé cette fonction
// une fois, on ne prend plus ce risque pour un utilitaire de 5 lignes).
function constantTimeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

interface Payload {
  dealId: string;
  templateName: string;
  recipientEmail: string;
  recipientName: string;
  product: string;
}

serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const admin = createClient(supabaseUrl, serviceKey);

  const { data: secretRow } = await admin
    .from("cron_config")
    .select("value")
    .eq("key", "cron_secret")
    .maybeSingle();
  const expectedSecret = secretRow?.value || "";
  const authHeader = req.headers.get("Authorization") || "";
  const providedSecret = authHeader.replace(/^Bearer\s+/i, "");

  const enc = new TextEncoder();
  const isAuthorized =
    expectedSecret.length > 0 &&
    constantTimeEqual(enc.encode(expectedSecret), enc.encode(providedSecret));

  if (!isAuthorized) {
    return json({ error: "Non autorisé" }, 401);
  }

  let payload: Payload;
  try {
    payload = await req.json();
  } catch {
    return json({ error: "Corps de requête invalide" }, 400);
  }

  const { dealId, templateName, recipientEmail, recipientName, product } = payload;
  if (!dealId || !templateName || !recipientEmail) {
    return json({ error: "Champs manquants (dealId, templateName, recipientEmail)" }, 400);
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipientEmail)) {
    return json({ error: "Adresse email destinataire invalide" }, 400);
  }

  const isTransactional = TRANSACTIONAL_TEMPLATES.has(templateName);

  const { data: template, error: templateErr } = await admin
    .from("email_templates")
    .select("id, subject, body")
    .eq("name", templateName)
    .eq("is_active", true)
    .maybeSingle();
  if (templateErr || !template) {
    return json({ error: `Template "${templateName}" introuvable ou inactif` }, 404);
  }

  const { data: dealRow, error: dealErr } = await admin
    .from("deals")
    .select("contact_id, contacts(id, email_opt_out)")
    .eq("id", dealId)
    .maybeSingle();
  const contact = (dealRow as unknown as { contacts: { id: string; email_opt_out: boolean } | null })?.contacts ?? null;

  // Opt-out en mode FERMÉ pour tout template non transactionnel : si on ne
  // peut pas prouver que le contact n'est pas désinscrit, on n'envoie pas.
  if (!isTransactional) {
    if (dealErr || !contact) {
      console.error(
        "crm-send-auto-template: statut de désinscription non vérifiable, envoi refusé:",
        dealErr?.message ?? "contact introuvable pour ce deal",
      );
      await admin.from("site_error_log").insert({
        page_path: "function:crm-send-auto-template",
        error_type: "opt_out_unverifiable",
        message: dealErr?.message ?? "contact introuvable pour ce deal",
        context: { deal_id: dealId, template_name: templateName },
      });
      return json({ error: "Statut de désinscription non vérifiable — envoi refusé par sécurité" }, 500);
    }
    if (contact.email_opt_out) {
      console.log(`crm-send-auto-template: envoi annulé (contact désinscrit) — deal ${dealId}, template "${templateName}"`);
      return json({ success: true, skipped: true, reason: "contact désinscrit (email_opt_out)" });
    }
  }

  // Lien de désinscription : généré seulement si le template en a besoin
  // (évite un blocage inutile pour un template qui ne le mentionne pas).
  // Pour un template non transactionnel qui EN A besoin, une clé
  // UNSUB_TOKEN_SECRET absente/invalide bloque l'envoi (500 explicite +
  // log) plutôt que de partir avec un lien cassé.
  const needsUnsubLink = contact != null && (containsVar(template.subject, "lien_desinscription") || containsVar(template.body, "lien_desinscription"));
  let unsubLink = "";
  if (needsUnsubLink) {
    try {
      unsubLink = await buildUnsubLink(contact!.id);
    } catch (e) {
      console.error("crm-send-auto-template: génération du lien de désinscription impossible:", e);
      if (!isTransactional) {
        await admin.from("site_error_log").insert({
          page_path: "function:crm-send-auto-template",
          error_type: "unsub_token_unavailable",
          message: e instanceof Error ? e.message : String(e),
          context: { deal_id: dealId, template_name: templateName },
        });
        return json({ error: "Lien de désinscription indisponible (UNSUB_TOKEN_SECRET) — envoi refusé" }, 500);
      }
      // Transactionnel : ne bloque jamais un email de suivi de dossier.
    }
  }

  // Slug produit inconnu : refuse plutôt que d'envoyer "assurance ." — un
  // fallback vide casse le texte silencieusement. Tous les insurance_type
  // réels doivent être couverts par PRODUCT_LABELS ; un slug manquant est
  // une lacune à combler, pas un cas à masquer. Ne bloque que si le
  // template utilise réellement {{produit}} — un template qui ne le
  // mentionne pas n'a pas à échouer pour un slug qu'il n'affichera jamais.
  const templateNeedsProduct = containsVar(template.subject, "produit") || containsVar(template.body, "produit");
  const productReadable = productLabel(product || "");
  if (templateNeedsProduct && product && productReadable === null) {
    console.error(`crm-send-auto-template: slug produit non reconnu "${product}", envoi refusé`);
    await admin.from("site_error_log").insert({
      page_path: "function:crm-send-auto-template",
      error_type: "unmapped_product_slug",
      message: `Slug insurance_type non couvert par PRODUCT_LABELS: "${product}"`,
      context: { deal_id: dealId, template_name: templateName, product },
    });
    return json({ error: `Produit non reconnu : "${product}" — envoi refusé` }, 500);
  }

  const firstName = (recipientName || "").trim().split(/\s+/)[0] || "";
  const subject = fillVars(template.subject, firstName, productReadable ?? "", unsubLink);
  const emailBody = fillVars(template.body, firstName, productReadable ?? "", unsubLink);

  // Garde-fou générique : un {{...}} ou un [xxx] encore présent après
  // substitution partirait tel quel au client (cf. le placeholder
  // [Nom du document manquant], jamais reconnu comme une variable).
  const unresolved = findUnresolvedPlaceholder(subject) ?? findUnresolvedPlaceholder(emailBody);
  if (unresolved) {
    console.error(`crm-send-auto-template: placeholder non résolu "${unresolved}" dans le template "${templateName}", envoi refusé`);
    await admin.from("site_error_log").insert({
      page_path: "function:crm-send-auto-template",
      error_type: "unresolved_placeholder",
      message: `Placeholder non résolu : "${unresolved}"`,
      context: { deal_id: dealId, template_name: templateName },
    });
    return json({ error: `Placeholder non résolu dans le template "${templateName}" : "${unresolved}" — envoi refusé` }, 400);
  }

  let resendId: string;
  try {
    const sent = await resend.emails.send({
      from: FROM,
      to: recipientEmail,
      subject,
      text: emailBody,
      html: bodyToHtml(emailBody),
    });
    if (sent.error || !sent.data?.id) {
      console.error("Resend a renvoyé une erreur (auto-template):", sent.error);
      return json({ error: `Échec de l'envoi Resend : ${sent.error?.message ?? "réponse sans id"}` }, 502);
    }
    resendId = sent.data.id;
  } catch (e) {
    console.error("Exception pendant l'envoi Resend (auto-template):", e);
    return json({ error: "Échec de l'envoi Resend (exception réseau)" }, 502);
  }

  const { error: activityErr } = await admin.from("activities").insert({
    deal_id: dealId,
    author_id: null,
    action_type: "email",
    description: `Template automatique envoyé : ${subject}`,
    metadata: { kind: "auto_template", template_id: template.id, template_name: templateName, resend_email_id: resendId },
  });
  if (activityErr) {
    console.error("Email auto envoyé mais échec du log activities:", activityErr);
  }

  const { error: trackingErr } = await admin.from("email_tracking").insert({
    quote_id: null,
    recipient_email: recipientEmail,
    recipient_name: recipientName || recipientEmail,
    email_type: "crm_auto_template",
    subject,
    resend_email_id: resendId,
    status: "sent",
  });
  if (trackingErr) {
    console.error("Email auto envoyé mais échec du log email_tracking:", trackingErr);
  }

  return json({ success: true, resendEmailId: resendId });
});
