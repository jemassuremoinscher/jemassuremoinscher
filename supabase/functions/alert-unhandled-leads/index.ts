import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { isWithinAlertHours } from "./paris-hour.ts";

// Alerte interne : demandes de devis non traitées après 45 minutes ouvrées
// (8h-19h, 7j/7, Europe/Paris). Déclenchée par pg_cron toutes les 10 min
// (docs/cron/alert_unhandled_leads_cron.sql, à appliquer manuellement par
// Paul après un dry-run), jamais par un client. Auth par secret partagé
// (cron_config.cron_secret, comparaison en temps constant), comme
// send-followup-reminders.
//
// - Ciblage : public.get_unhandled_leads() (SQL, strictement en lecture),
//   qui applique horaires, "traité", activation, une alerte par deal,
//   arrêt après 3 échecs et plafond de 10.
// - Destinataires : public.alert_recipients (active = true), jamais en dur.
//   Aucun actif -> erreur dans site_error_log, aucun envoi.
// - Un seul email récapitulatif par passage ; une ligne lead_alert_log par
//   deal : 'sent' seulement après succès Resend confirmé, sinon 'failed'.
// - Contenu minimal : prénom, produit, heure de la demande, délai écoulé,
//   lien CRM. Jamais l'email ni le téléphone du prospect.
// - {"dryRun": true} : renvoie les deals ciblés, n'envoie rien, n'écrit rien.

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const MAX_DEALS_PER_RUN = 10;
const SENDER = "jemassuremoinscher.fr <contact@jemassuremoinscher.fr>";
const CRM_DEAL_URL = "https://www.jemassuremoinscher.fr/admin?deal=";
const PAGE_PATH = "cron:alert-unhandled-leads";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });

function constantTimeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

const esc = (s: unknown) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const formatParis = (iso: string) =>
  new Intl.DateTimeFormat("fr-FR", {
    timeZone: "Europe/Paris",
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));

const formatMinutes = (m: number) => (m >= 60 ? `${Math.floor(m / 60)} h ${String(m % 60).padStart(2, "0")}` : `${m} min`);

interface UnhandledLead {
  deal_id: string;
  first_name: string | null;
  insurance_type: string;
  requested_at: string;
  clock_start: string;
  due_at: string;
  business_minutes_elapsed: number;
  failed_attempts: number;
}

type Admin = ReturnType<typeof createClient>;

async function logError(admin: Admin, error_type: string, message: string, context: Record<string, unknown> = {}) {
  const { error } = await admin.from("site_error_log").insert({ page_path: PAGE_PATH, error_type, message, context });
  if (error) console.error("alert-unhandled-leads: échec insert site_error_log:", error.message);
}

async function recordAlerts(admin: Admin, rows: { deal_id: string; status: "sent" | "failed"; error_message?: string; resend_email_id?: string | null }[]) {
  for (const row of rows) {
    const { error } = await admin.from("lead_alert_log").insert(row);
    if (error) {
      console.error("alert-unhandled-leads: échec insert lead_alert_log:", error.message);
      await logError(admin, "log_failed", error.message, { deal_id: row.deal_id, attempted_status: row.status });
    }
  }
}

function buildEmail(leads: UnhandledLead[]) {
  const rows = leads
    .map(
      (l) => `<tr>
        <td style="padding:6px 10px;border-bottom:1px solid #e5e7eb;">${esc(l.first_name || "(prénom non renseigné)")}</td>
        <td style="padding:6px 10px;border-bottom:1px solid #e5e7eb;">${esc(l.insurance_type)}</td>
        <td style="padding:6px 10px;border-bottom:1px solid #e5e7eb;">${esc(formatParis(l.requested_at))}</td>
        <td style="padding:6px 10px;border-bottom:1px solid #e5e7eb;">${esc(formatMinutes(l.business_minutes_elapsed))}</td>
        <td style="padding:6px 10px;border-bottom:1px solid #e5e7eb;"><a href="${esc(CRM_DEAL_URL + encodeURIComponent(l.deal_id))}">Ouvrir dans le CRM</a></td>
      </tr>`,
    )
    .join("");
  const n = leads.length;
  const subject = `Alerte : ${n} demande${n > 1 ? "s" : ""} de devis non traitée${n > 1 ? "s" : ""} depuis plus de 45 min`;
  const html = `<div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;font-size:14px;color:#111827;">
    <p>${n} demande${n > 1 ? "s" : ""} de devis ${n > 1 ? "sont" : "est"} sans traitement depuis plus de 45 minutes ouvrées (8h-19h, heure de Paris).</p>
    <table style="border-collapse:collapse;">
      <thead><tr>
        <th style="text-align:left;padding:6px 10px;border-bottom:2px solid #d1d5db;">Prénom</th>
        <th style="text-align:left;padding:6px 10px;border-bottom:2px solid #d1d5db;">Produit</th>
        <th style="text-align:left;padding:6px 10px;border-bottom:2px solid #d1d5db;">Demande</th>
        <th style="text-align:left;padding:6px 10px;border-bottom:2px solid #d1d5db;">Délai ouvré écoulé</th>
        <th style="text-align:left;padding:6px 10px;border-bottom:2px solid #d1d5db;">CRM</th>
      </tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <p style="color:#6b7280;font-size:12px;">Une seule alerte par demande. Coordonnées du prospect disponibles uniquement dans le CRM.</p>
  </div>`;
  return { subject, html };
}

serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

  const { data: secretRow } = await admin.from("cron_config").select("value").eq("key", "cron_secret").maybeSingle();
  const expectedSecret = secretRow?.value || "";
  const providedSecret = (req.headers.get("Authorization") || "").replace(/^Bearer\s+/i, "");
  const enc = new TextEncoder();
  const isAuthorized = expectedSecret.length > 0 && constantTimeEqual(enc.encode(expectedSecret), enc.encode(providedSecret));
  if (!isAuthorized) return json({ error: "Non autorisé" }, 401);

  const body = await req.json().catch(() => ({}));
  const dryRun = body?.dryRun === true;

  // Double garde horaires (get_unhandled_leads() filtre déjà) : jamais
  // d'email hors 8h-19h, heure de Paris.
  if (!isWithinAlertHours(new Date())) return json({ success: true, skipped: "hors horaires (8h-19h, Europe/Paris)", dryRun });

  const { data: leadsData, error: leadsErr } = await admin.rpc("get_unhandled_leads", { p_limit: MAX_DEALS_PER_RUN });
  if (leadsErr) {
    await logError(admin, "targeting_query_failed", leadsErr.message);
    return json({ error: `Ciblage échoué : ${leadsErr.message}` }, 500);
  }
  const leads = ((leadsData ?? []) as UnhandledLead[]).slice(0, MAX_DEALS_PER_RUN);

  if (dryRun) return json({ success: true, dryRun: true, count: leads.length, leads });
  if (leads.length === 0) return json({ success: true, count: 0 });

  const { data: recipientRows, error: recErr } = await admin.from("alert_recipients").select("email").eq("active", true);
  const recipients = (recipientRows ?? []).map((r: { email: string }) => r.email).filter(Boolean);
  if (recErr || recipients.length === 0) {
    await logError(admin, "no_alert_recipients", recErr?.message ?? "Aucun destinataire actif dans alert_recipients : alerte non envoyée.", {
      deal_ids: leads.map((l) => l.deal_id),
    });
    return json({ error: "Aucun destinataire actif" }, 500);
  }

  const { subject, html } = buildEmail(leads);
  let sentId: string | null = null;
  let sendError: string | null = null;
  try {
    const res = await resend.emails.send({ from: SENDER, to: recipients, subject, html });
    if (res.error || !res.data?.id) sendError = res.error?.message ?? "Réponse Resend sans identifiant";
    else sentId = res.data.id;
  } catch (e) {
    sendError = e instanceof Error ? e.message : String(e);
  }

  if (sentId) {
    await recordAlerts(admin, leads.map((l) => ({ deal_id: l.deal_id, status: "sent" as const, resend_email_id: sentId })));
    return json({ success: true, count: leads.length, resendEmailId: sentId });
  }

  await recordAlerts(admin, leads.map((l) => ({ deal_id: l.deal_id, status: "failed" as const, error_message: sendError ?? "Échec inconnu" })));
  await logError(admin, "alert_send_failed", sendError ?? "Échec inconnu", { deal_ids: leads.map((l) => l.deal_id) });
  return json({ error: `Envoi échoué : ${sendError}` }, 500);
});
