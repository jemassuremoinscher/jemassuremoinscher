import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Fonction appelée uniquement par le trigger Postgres notify_deal_stage_email()
// (migration deal_stage_auto_email) via net.http_post — jamais par un client
// utilisateur. Pas de session utilisateur possible ici (un trigger n'a pas de
// JWT) : l'authentification se fait par secret partagé (public.cron_config),
// même mécanisme déjà utilisé par generate-seo-suggestions/db-backup dans ce
// projet. verify_jwt=false côté gateway (cf. supabase/config.toml), vérifié
// manuellement ci-dessous.

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

const escapeHtml = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const bodyToHtml = (body: string) =>
  `<div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;font-size:15px;line-height:1.6;color:#111827;">${
    escapeHtml(body).replace(/\r?\n/g, "<br>")
  }</div>`;

const fillVars = (text: string, firstName: string, product: string) =>
  text
    .replace(/\{\{\s*prenom\s*\}\}/gi, firstName)
    .replace(/\{\{\s*produit\s*\}\}/gi, product);

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

  // Auth par secret partagé : env var d'abord, sinon repli sur cron_config
  // (verrouillée au service_role, cf. migration 20260621135820).
  let expectedSecret = Deno.env.get("CRON_SECRET") || "";
  if (!expectedSecret) {
    const { data } = await admin.from("cron_config").select("value").eq("key", "cron_secret").maybeSingle();
    expectedSecret = data?.value || "";
  }
  const authHeader = req.headers.get("Authorization") || "";
  const providedSecret = authHeader.replace(/^Bearer\s+/i, "");
  if (!expectedSecret || providedSecret !== expectedSecret) {
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

  const { data: template, error: templateErr } = await admin
    .from("email_templates")
    .select("id, subject, body")
    .eq("name", templateName)
    .eq("is_active", true)
    .maybeSingle();
  if (templateErr || !template) {
    return json({ error: `Template "${templateName}" introuvable ou inactif` }, 404);
  }

  const firstName = (recipientName || "").trim().split(/\s+/)[0] || "";
  const subject = fillVars(template.subject, firstName, product || "");
  const emailBody = fillVars(template.body, firstName, product || "");

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
      return json(
        { error: `Échec de l'envoi Resend : ${sent.error?.message ?? "réponse sans id"}` },
        502,
      );
    }
    resendId = sent.data.id;
  } catch (e) {
    console.error("Exception pendant l'envoi Resend (auto-template):", e);
    return json({ error: "Échec de l'envoi Resend (exception réseau)" }, 502);
  }

  // Envoi confirmé — log. author_id volontairement absent : LeadTimeline
  // affiche déjà "Système" quand author_id est null.
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
