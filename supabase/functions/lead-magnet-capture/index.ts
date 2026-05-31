import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.79.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Rate limit: 5 captures / IP / hour
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const WINDOW = 60 * 60 * 1000;
const MAX = 5;
function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const r = rateLimitMap.get(ip);
  if (!r || now > r.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + WINDOW });
    return true;
  }
  if (r.count >= MAX) return false;
  r.count++;
  return true;
}

function validateEmail(email: unknown): email is string {
  if (typeof email !== "string") return false;
  const e = email.trim().toLowerCase();
  return e.length > 4 && e.length < 255 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
}

const PDF_PATH = "/lead-magnets/7-erreurs-assurance.pdf";

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0] ||
      req.headers.get("x-real-ip") ||
      "unknown";
    if (!checkRateLimit(ip)) {
      return new Response(
        JSON.stringify({ success: false, message: "Trop de requêtes." }),
        { status: 429, headers: { "Content-Type": "application/json", ...corsHeaders } },
      );
    }

    const body = await req.json().catch(() => ({}));
    const { email, source } = body as { email?: unknown; source?: unknown };

    if (!validateEmail(email)) {
      return new Response(
        JSON.stringify({ success: false, message: "Email invalide" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } },
      );
    }

    const normalized = (email as string).trim().toLowerCase();
    const cleanSource =
      typeof source === "string" && source.length < 80 ? source : "lead_magnet_7_erreurs";

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    // Upsert prospect into newsletter_subscribers (status=pending — pas de
    // double opt-in pour ne pas bloquer la délivrance du PDF).
    const { data: existing } = await supabase
      .from("newsletter_subscribers")
      .select("id, status")
      .eq("email", normalized)
      .maybeSingle();

    if (!existing) {
      const { error } = await supabase.from("newsletter_subscribers").insert({
        email: normalized,
        status: "pending",
      });
      if (error) {
        console.error("lead-magnet insert error", error);
      }
    } else if (existing.status === "unsubscribed") {
      // ré-opt-in léger
      await supabase
        .from("newsletter_subscribers")
        .update({ status: "pending", unsubscribed_at: null })
        .eq("id", existing.id);
    }

    console.log("lead_magnet_capture", { source: cleanSource, ts: new Date().toISOString() });

    return new Response(
      JSON.stringify({ success: true, pdf_url: PDF_PATH }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } },
    );
  } catch (e) {
    console.error("lead-magnet-capture error", e);
    return new Response(
      JSON.stringify({ success: false, message: "Erreur serveur" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } },
    );
  }
});
