import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Déclenchée quotidiennement par pg_cron (migration 20260928000700 — pas
// encore appliquée, en attente d'un dry-run manuel), jamais par un client.
// Auth par secret partagé, source unique public.cron_config (même
// mécanisme que crm-send-auto-template).
//
// Ne fait AUCUN envoi elle-même : cible les deals éligibles via
// public.get_deals_due_for_followup() (SQL, strictement en lecture) puis
// délègue l'envoi effectif à crm-send-auto-template (même auth, même
// respect d'email_opt_out, même lien de désinscription, mêmes logs — pas
// de logique dupliquée). Cette fonction ne fait que l'idempotence propre
// à la relance : un statut 'sent' n'est écrit dans quote_followup_log
// qu'après une réponse de succès confirmée ; un échec écrit 'failed'
// (jamais couvert par la contrainte unique, donc retenté au prochain
// passage). Toute erreur d'écriture dans quote_followup_log est elle-même
// journalisée dans site_error_log.

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY") ?? "";

// 2026-09-28 : plafond par passage. Un incident (ciblage trop large, bug
// de fenêtre) ne doit jamais se traduire par des centaines d'emails partis
// d'un coup - les candidats au-delà restent éligibles et sont traités au
// prochain passage (aucune perte, juste un étalement).
const MAX_SENDS_PER_RUN = 25;

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

// "Relance J+7" n'est volontairement pas encore en base au moment où ce
// code est écrit : tant qu'elle n'existe pas, le garde-fou ci-dessous
// échoue intentionnellement et bloque LES DEUX envois (pas de sortie
// partielle) - ce n'est pas un bug, c'est le garde-fou qui a justement
// fait défaut lors de l'incident du 2026-09-12.
const TEMPLATE_BY_MILESTONE: Record<string, string> = {
  j3: "Relance après devis non signé",
  j7: "Relance J+7",
};

interface Candidate {
  deal_id: string;
  contact_id: string;
  contact_email: string;
  contact_name: string;
  insurance_type: string;
  stage: string;
}

type LogRow = {
  deal_id: string;
  milestone: string;
  status: "sent" | "failed";
  resend_email_id?: string | null;
  error_message?: string;
};

async function recordFollowup(admin: ReturnType<typeof createClient>, row: LogRow) {
  const { error } = await admin.from("quote_followup_log").insert(row);
  if (error) {
    console.error("send-followup-reminders: échec insert quote_followup_log:", error.message);
    await admin.from("site_error_log").insert({
      page_path: "cron:send-followup-reminders",
      error_type: "log_failed",
      message: error.message,
      context: { deal_id: row.deal_id, milestone: row.milestone, attempted_status: row.status },
    });
  }
}

serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

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

  const { error: guardErr } = await admin.rpc("assert_template_names_exist", {
    expected_names: Object.values(TEMPLATE_BY_MILESTONE),
  });
  if (guardErr) {
    console.error("send-followup-reminders: garde-fou échoué:", guardErr.message);
    await admin.from("site_error_log").insert({
      page_path: "cron:send-followup-reminders",
      error_type: "missing_template",
      message: guardErr.message,
      context: { expected: Object.values(TEMPLATE_BY_MILESTONE) },
    });
    return json({ error: `Garde-fou templates échoué : ${guardErr.message}` }, 500);
  }

  const summary: Record<string, { candidates: number; sent: number; skipped: number; failed: number }> = {};
  let processed = 0;
  let capReached = false;

  for (const milestone of ["j3", "j7"] as const) {
    const templateName = TEMPLATE_BY_MILESTONE[milestone];
    const stats = { candidates: 0, sent: 0, skipped: 0, failed: 0 };
    summary[milestone] = stats;

    const { data: candidates, error: candErr } = await admin.rpc("get_deals_due_for_followup", {
      p_milestone: milestone,
    });
    if (candErr) {
      console.error(`send-followup-reminders: ciblage ${milestone} échoué:`, candErr.message);
      await admin.from("site_error_log").insert({
        page_path: "cron:send-followup-reminders",
        error_type: "targeting_query_failed",
        message: candErr.message,
        context: { milestone },
      });
      continue;
    }

    const rows = (candidates ?? []) as Candidate[];
    stats.candidates = rows.length;

    for (const row of rows) {
      if (processed >= MAX_SENDS_PER_RUN) {
        capReached = true;
        break;
      }
      processed++;

      try {
        const res = await fetch(`${SUPABASE_URL}/functions/v1/crm-send-auto-template`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: ANON_KEY,
            Authorization: `Bearer ${expectedSecret}`,
          },
          body: JSON.stringify({
            dealId: row.deal_id,
            templateName,
            recipientEmail: row.contact_email,
            recipientName: row.contact_name,
            product: row.insurance_type,
          }),
        });
        const body = await res.json().catch(() => ({}));

        if (res.ok && body?.success) {
          await recordFollowup(admin, {
            deal_id: row.deal_id,
            milestone,
            status: "sent",
            resend_email_id: body.resendEmailId ?? null,
          });
          if (body.skipped) {
            stats.skipped++;
          } else {
            stats.sent++;
          }
        } else {
          stats.failed++;
          await recordFollowup(admin, {
            deal_id: row.deal_id,
            milestone,
            status: "failed",
            error_message: body?.error ?? `HTTP ${res.status}`,
          });
        }
      } catch (e) {
        stats.failed++;
        console.error(`send-followup-reminders: envoi ${milestone} échoué pour deal ${row.deal_id}:`, e);
        await recordFollowup(admin, {
          deal_id: row.deal_id,
          milestone,
          status: "failed",
          error_message: e instanceof Error ? e.message : String(e),
        });
      }
    }

    if (capReached) break;
  }

  if (capReached) {
    console.warn(`send-followup-reminders: plafond de ${MAX_SENDS_PER_RUN} envois atteint, reste traité au prochain passage.`);
    await admin.from("site_error_log").insert({
      page_path: "cron:send-followup-reminders",
      error_type: "followup_cap_reached",
      message: `Plafond de ${MAX_SENDS_PER_RUN} envois atteint pour ce passage — candidats restants traités au prochain passage.`,
      context: { max_sends_per_run: MAX_SENDS_PER_RUN, processed },
    });
  }

  return json({ success: true, summary, capReached });
});
