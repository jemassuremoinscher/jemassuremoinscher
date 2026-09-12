import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

// Expéditeur unique de tous les envois : contact@jemassuremoinscher.fr.
// hello@ n'est pas une boîte réceptrice : les réponses clients y seraient perdues.
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

interface Payload {
  dealId: string;
  templateId: string | null;
  recipientEmail: string;
  recipientName: string;
  subject: string;
  body: string;
}

serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

  const authHeader = req.headers.get("Authorization") ?? "";
  const authedClient = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: authHeader } },
  });
  const { data: userData, error: userErr } = await authedClient.auth.getUser();
  if (userErr || !userData?.user) {
    console.error("Auth rejetée (401) sur crm-send-template:", userErr?.message ?? "pas d'utilisateur dans la session");
    return json({ error: "Non authentifié" }, 401);
  }
  const authorId = userData.user.id;

  let payload: Payload;
  try {
    payload = await req.json();
  } catch (e) {
    console.error("Corps de requête invalide (400) sur crm-send-template:", e);
    return json({ error: "Corps de requête invalide" }, 400);
  }

  const { dealId, templateId, recipientEmail, recipientName, subject, body } = payload;
  if (!dealId || !recipientEmail || !subject?.trim() || !body?.trim()) {
    console.error("Champs manquants (400) sur crm-send-template:", { dealId, recipientEmail, hasSubject: Boolean(subject?.trim()), hasBody: Boolean(body?.trim()) });
    return json({ error: "Champs manquants (dealId, recipientEmail, subject, body)" }, 400);
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipientEmail)) {
    console.error("Adresse email destinataire invalide (400) sur crm-send-template:", recipientEmail);
    return json({ error: "Adresse email destinataire invalide" }, 400);
  }

  let resendId: string;
  try {
    const sent = await resend.emails.send({
      from: FROM,
      to: recipientEmail,
      subject: subject.trim(),
      text: body,
      html: bodyToHtml(body),
    });
    if (sent.error || !sent.data?.id) {
      console.error("Resend a renvoyé une erreur:", sent.error);
      return json(
        { error: `Échec de l'envoi Resend : ${sent.error?.message ?? "réponse sans id"}` },
        502,
      );
    }
    resendId = sent.data.id;
  } catch (e) {
    console.error("Exception pendant l'envoi Resend:", e);
    return json({ error: "Échec de l'envoi Resend (exception réseau)" }, 502);
  }

  const admin = createClient(supabaseUrl, serviceKey);

  const { error: activityErr } = await admin.from("activities").insert({
    deal_id: dealId,
    author_id: authorId,
    action_type: "email",
    description: `Template envoyé : ${subject.trim()}`,
    metadata: { kind: "template", template_id: templateId, resend_email_id: resendId },
  });
  if (activityErr) {
    console.error("Email envoyé mais échec du log activities:", activityErr);
  }

  const { error: trackingErr } = await admin.from("email_tracking").insert({
    quote_id: null,
    recipient_email: recipientEmail,
    recipient_name: recipientName || recipientEmail,
    email_type: "crm_template",
    subject: subject.trim(),
    resend_email_id: resendId,
    status: "sent",
  });
  if (trackingErr) {
    console.error("Email envoyé mais échec du log email_tracking:", trackingErr);
  }

  return json({ success: true, resendEmailId: resendId });
});
