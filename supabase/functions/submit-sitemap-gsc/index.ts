// Soumet le sitemap.xml à Google Search Console via le connecteur Lovable.
// Appelé automatiquement par un trigger DB après approbation d'article,
// et exposable manuellement (POST sans body requis).

import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SITE_URL = "sc-domain:jemassuremoinscher.fr";
const SITEMAP_URL = "https://www.jemassuremoinscher.fr/sitemap.xml";
const GATEWAY = "https://connector-gateway.lovable.dev/google_search_console";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const start = Date.now();
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  // Authorization: require Bearer token — either the CRON_SECRET (DB trigger) or a valid admin JWT
  const authHeader = req.headers.get("Authorization") ?? "";
  let authorized = false;

  if (authHeader.startsWith("Bearer ")) {
    const token = authHeader.replace("Bearer ", "");
    const cronSecret = Deno.env.get("CRON_SECRET");
    if (cronSecret && token === cronSecret) {
      authorized = true;
    } else {
      const { data: claimsData } = await supabase.auth.getClaims(token);
      if (claimsData?.claims?.sub) {
        const { data: roleRow } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", claimsData.claims.sub)
          .eq("role", "admin")
          .maybeSingle();
        authorized = !!roleRow;
      }
    }
  }

  if (!authorized) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  let trigger_source = "manual";
  try {
    const body = await req.json().catch(() => ({}));
    if (body?.trigger_source) {
      trigger_source = String(body.trigger_source).replace(/[^a-zA-Z0-9_\-]/g, "").slice(0, 64) || "manual";
    }
  } catch (_) {
    // ignore
  }

  const lovableKey = Deno.env.get("LOVABLE_API_KEY");
  const gscKey = Deno.env.get("GOOGLE_SEARCH_CONSOLE_API_KEY");

  if (!lovableKey || !gscKey) {
    await supabase.from("sitemap_submission_log").insert({
      site_url: SITE_URL,
      sitemap_url: SITEMAP_URL,
      trigger_source,
      status: "error",
      error_message: "Missing LOVABLE_API_KEY or GOOGLE_SEARCH_CONSOLE_API_KEY",
      duration_ms: Date.now() - start,
    });
    return new Response(JSON.stringify({ success: false, error: "missing_credentials" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const encSite = encodeURIComponent(SITE_URL);
  const encMap = encodeURIComponent(SITEMAP_URL);
  const url = `${GATEWAY}/webmasters/v3/sites/${encSite}/sitemaps/${encMap}`;

  let httpStatus: number | null = null;
  let responseBody = "";
  let status = "error";
  let errorMessage: string | null = null;

  try {
    const resp = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${lovableKey}`,
        "X-Connection-Api-Key": gscKey,
      },
    });
    httpStatus = resp.status;
    responseBody = (await resp.text()).slice(0, 2000);
    status = resp.ok ? "success" : "error";
    if (!resp.ok) errorMessage = `GSC returned ${resp.status}`;
  } catch (e) {
    errorMessage = (e as Error).message;
  }

  const duration_ms = Date.now() - start;

  await supabase.from("sitemap_submission_log").insert({
    site_url: SITE_URL,
    sitemap_url: SITEMAP_URL,
    trigger_source,
    status,
    http_status: httpStatus,
    response_body: responseBody || null,
    error_message: errorMessage,
    duration_ms,
  });

  return new Response(
    JSON.stringify({ success: status === "success", http_status: httpStatus, duration_ms }),
    {
      status: status === "success" ? 200 : 502,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    },
  );
});
