import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

type ScoreStatus = "excellent" | "good" | "warning" | "critical";

type VisibilityCheck = {
  id: string;
  label: string;
  source: "gsc" | "ga4";
  value: string;
  expected: string;
  weight: number;
  pass: boolean;
  reason: string;
};

type QueryOpportunity = {
  query: string;
  page: string;
  clicks: number;
  impressions: number;
  position: number;
  ctr: number;
  intent: "comparatif" | "faq" | "definition" | "guide" | "local" | "transactionnel" | "informationnel";
  status: "visible" | "opportunité";
  recommendation: string;
};

type PageVisibility = {
  path: string;
  clicks: number;
  impressions: number;
  avgPosition: number;
  ctr: number;
  opportunityScore: number;
  aiPotential: "fort" | "moyen" | "faible";
  contentAction: string;
};

const KNOWN_SITE_PATHS = [
  "/",
  "/comparateur",
  "/blog",
  "/contact",
  "/glossaire",
  "/assurance-auto",
  "/assurance-moto",
  "/assurance-habitation",
  "/assurance-sante",
  "/assurance-pret",
  "/assurance-animaux",
  "/assurance-vie",
  "/assurance-prevoyance",
  "/assurance-rc-pro",
  "/assurance-mrp",
  "/assurance-pno",
  "/assurance-gli",
  "/nos-partenaires",
  "/outils/calculateur-bonus-malus",
];

const toStatus = (score: number): ScoreStatus => {
  if (score >= 85) return "excellent";
  if (score >= 70) return "good";
  if (score >= 50) return "warning";
  return "critical";
};

const makeCheck = (params: Omit<VisibilityCheck, "reason">): VisibilityCheck => ({
  ...params,
  reason: params.pass
    ? `Passe : ${params.value}, conforme à ${params.expected}.`
    : `Échec : ${params.value}, attendu ${params.expected}.`,
});

async function getGoogleAccessToken(serviceAccount: any, scope: string): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const jwtHeader = btoa(JSON.stringify({ alg: "RS256", typ: "JWT" })).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
  const jwtPayload = btoa(JSON.stringify({
    iss: serviceAccount.client_email,
    scope,
    aud: "https://oauth2.googleapis.com/token",
    exp: now + 3600,
    iat: now,
  })).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");

  const pemContent = serviceAccount.private_key
    .replace("-----BEGIN PRIVATE KEY-----", "")
    .replace("-----END PRIVATE KEY-----", "")
    .replace(/\n/g, "");

  const binaryKey = Uint8Array.from(atob(pemContent), (c) => c.charCodeAt(0));
  const cryptoKey = await crypto.subtle.importKey(
    "pkcs8",
    binaryKey,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"],
  );

  const signatureInput = new TextEncoder().encode(`${jwtHeader}.${jwtPayload}`);
  const signature = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", cryptoKey, signatureInput);
  const jwtSignature = btoa(String.fromCharCode(...new Uint8Array(signature))).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");

  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwtHeader}.${jwtPayload}.${jwtSignature}`,
  });

  const tokenData = await tokenResponse.json();
  if (!tokenData.access_token) {
    throw new Error(`Impossible d'obtenir le token Google: ${JSON.stringify(tokenData)}`);
  }

  return tokenData.access_token;
}

async function getGscRows(accessToken: string, siteUrl: string) {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 28);

  const response = await fetch(`https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      startDate: startDate.toISOString().split("T")[0],
      endDate: endDate.toISOString().split("T")[0],
      dimensions: ["query", "page"],
      rowLimit: 250,
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(`Erreur Search Console: ${JSON.stringify(data)}`);
  }

  return data.rows || [];
}

async function getGa4Report(accessToken: string, propertyId: string) {
  const url = `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`;
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  };

  const [organicSourcesRes, llmSourcesRes] = await Promise.all([
    fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify({
        dateRanges: [{ startDate: "28daysAgo", endDate: "today" }],
        dimensions: [{ name: "sessionSource" }, { name: "sessionMedium" }],
        metrics: [{ name: "sessions" }, { name: "engagedSessions" }],
        limit: 100,
      }),
    }),
    fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify({
        dateRanges: [{ startDate: "28daysAgo", endDate: "today" }],
        dimensions: [{ name: "sessionSource" }],
        metrics: [{ name: "sessions" }],
        dimensionFilter: {
          filter: {
            fieldName: "sessionSource",
            inListFilter: {
              values: ["chatgpt.com", "perplexity", "gemini.google.com", "copilot.microsoft.com"],
            },
          },
        },
        limit: 20,
      }),
    }),
  ]);

  const [organicSources, llmSources] = await Promise.all([organicSourcesRes.json(), llmSourcesRes.json()]);
  if (!organicSourcesRes.ok) throw new Error(`Erreur GA4 sources: ${JSON.stringify(organicSources)}`);
  if (!llmSourcesRes.ok) throw new Error(`Erreur GA4 LLM: ${JSON.stringify(llmSources)}`);

  return { organicSources, llmSources };
}

const normalizePath = (value: string) => {
  try {
    const url = new URL(value);
    return url.pathname === "" ? "/" : url.pathname.replace(/\/+$/, "") || "/";
  } catch {
    const sanitized = value.replace(/^https?:\/\/[^/]+/, "");
    return sanitized === "" ? "/" : sanitized.replace(/\/+$/, "") || "/";
  }
};

const detectIntent = (query: string): QueryOpportunity["intent"] => {
  const q = query.toLowerCase();
  if (q.includes("comparatif") || q.includes("meilleure") || q.includes("top")) return "comparatif";
  if (q.includes("faq") || q.includes("question")) return "faq";
  if (q.includes("définition") || q.includes("definition") || q.includes("veut dire") || q.includes("c'est quoi")) return "definition";
  if (q.includes("guide") || q.includes("comment choisir") || q.includes("comment")) return "guide";
  if (q.includes("près de") || q.includes("paris") || q.includes("lyon") || q.includes("marseille")) return "local";
  if (q.includes("devis") || q.includes("prix") || q.includes("pas cher") || q.includes("tarif")) return "transactionnel";
  return "informationnel";
};

const recommendationByIntent = (intent: QueryOpportunity["intent"]) => {
  switch (intent) {
    case "comparatif": return "Ajouter un comparatif structuré, un tableau de critères et une synthèse décisionnelle.";
    case "faq": return "Créer ou enrichir une FAQ courte avec réponses nettes, exemples et liens internes.";
    case "definition": return "Ajouter une définition concise, des cas d'usage et un maillage vers les pages business.";
    case "guide": return "Renforcer le guide avec étapes claires, critères de choix et CTA de suite logique.";
    case "local": return "Ajouter des signaux locaux ou régionaux et des éléments de réassurance contextuels.";
    case "transactionnel": return "Clarifier la promesse, les garanties et le CTA dès le haut de page.";
    default: return "Ajouter une réponse plus directe, des preuves d'expertise et du maillage sémantique.";
  }
};

const deriveAiPotential = (query: string, impressions: number, position: number): PageVisibility["aiPotential"] => {
  const q = query.toLowerCase();
  const hasAiFriendlyShape = ["comparatif", "faq", "guide", "définition", "definition", "comment", "pourquoi"].some((token) => q.includes(token));
  if (hasAiFriendlyShape && impressions >= 50 && position <= 20) return "fort";
  if (hasAiFriendlyShape || (impressions >= 20 && position <= 35)) return "moyen";
  return "faible";
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") || Deno.env.get("SUPABASE_PUBLISHABLE_KEY");
    const ga4PropertyId = Deno.env.get("GA4_PROPERTY_ID");
    const ga4ServiceAccountJson = Deno.env.get("GA4_SERVICE_ACCOUNT_JSON");

    if (!supabaseUrl || !supabaseAnonKey) throw new Error("Configuration backend manquante");
    if (!ga4PropertyId || !ga4ServiceAccountJson) {
      return new Response(JSON.stringify({
        error: "Analytics non configuré",
        message: "Les sources live Search Console / Analytics ne sont pas configurées.",
      }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { createClient } = await import("https://esm.sh/@supabase/supabase-js@2");
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userId = claimsData.claims.sub;
    const { data: roleData } = await supabase.from("user_roles").select("role").eq("user_id", userId).eq("role", "admin").maybeSingle();
    if (!roleData) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const serviceAccount = JSON.parse(ga4ServiceAccountJson);
    const webmastersToken = await getGoogleAccessToken(serviceAccount, "https://www.googleapis.com/auth/webmasters.readonly");
    const analyticsToken = await getGoogleAccessToken(serviceAccount, "https://www.googleapis.com/auth/analytics.readonly");

    const [gscRows, ga4Data] = await Promise.all([
      getGscRows(webmastersToken, "sc-domain:jemassuremoinscher.fr"),
      getGa4Report(analyticsToken, ga4PropertyId),
    ]);

    const totalImpressions = gscRows.reduce((sum: number, row: any) => sum + Number(row.impressions || 0), 0);
    const totalClicks = gscRows.reduce((sum: number, row: any) => sum + Number(row.clicks || 0), 0);
    const avgPosition = gscRows.length > 0
      ? gscRows.reduce((sum: number, row: any) => sum + Number(row.position || 0), 0) / gscRows.length
      : 0;
    const ctr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;

    const organicRows = ga4Data.organicSources.rows || [];
    const organicSessions = organicRows
      .filter((row: any) => (row.dimensionValues?.[1]?.value || "").toLowerCase() === "organic")
      .reduce((sum: number, row: any) => sum + Number(row.metricValues?.[0]?.value || 0), 0);
    const engagedOrganicSessions = organicRows
      .filter((row: any) => (row.dimensionValues?.[1]?.value || "").toLowerCase() === "organic")
      .reduce((sum: number, row: any) => sum + Number(row.metricValues?.[1]?.value || 0), 0);
    const organicEngagementRate = organicSessions > 0 ? (engagedOrganicSessions / organicSessions) * 100 : 0;

    const llmRows = ga4Data.llmSources.rows || [];
    const llmSessions = llmRows.reduce((sum: number, row: any) => sum + Number(row.metricValues?.[0]?.value || 0), 0);
    const llmSources = llmRows.map((row: any) => row.dimensionValues?.[0]?.value).filter(Boolean);
    const iaCitations = gscRows.filter((row: any) => {
      const query = String(row.keys?.[0] || "").toLowerCase();
      return query.includes("chatgpt") || query.includes("perplexity") || query.includes("gemini") || query.includes("copilot");
    }).length;

    const seoChecks = [
      makeCheck({ id: "seo-impressions", label: "Impressions Search Console", source: "gsc", value: `${totalImpressions}`, expected: ">= 100 impressions / 28 jours", weight: 30, pass: totalImpressions >= 100 }),
      makeCheck({ id: "seo-position", label: "Position moyenne Search Console", source: "gsc", value: avgPosition > 0 ? avgPosition.toFixed(1) : "0", expected: "<= 30", weight: 25, pass: avgPosition > 0 && avgPosition <= 30 }),
      makeCheck({ id: "seo-ctr", label: "CTR Search Console", source: "gsc", value: `${ctr.toFixed(1)}%`, expected: ">= 1%", weight: 20, pass: ctr >= 1 }),
      makeCheck({ id: "seo-organic-sessions", label: "Sessions organiques GA4", source: "ga4", value: `${organicSessions}`, expected: ">= 20 sessions / 28 jours", weight: 15, pass: organicSessions >= 20 }),
      makeCheck({ id: "seo-organic-engagement", label: "Engagement organique GA4", source: "ga4", value: `${organicEngagementRate.toFixed(1)}%`, expected: ">= 50%", weight: 10, pass: organicEngagementRate >= 50 }),
    ];

    const geoChecks = [
      makeCheck({ id: "geo-llm-sessions", label: "Sessions issues d'outils IA", source: "ga4", value: `${llmSessions}`, expected: ">= 5 sessions / 28 jours", weight: 45, pass: llmSessions >= 5 }),
      makeCheck({ id: "geo-llm-source-diversity", label: "Diversité des sources IA", source: "ga4", value: `${llmSources.length}`, expected: ">= 2 sources IA distinctes", weight: 25, pass: llmSources.length >= 2 }),
      makeCheck({ id: "geo-ia-citations", label: "Mentions IA détectables dans Search Console", source: "gsc", value: `${iaCitations}`, expected: ">= 1 requête liée IA", weight: 30, pass: iaCitations >= 1 }),
    ];

    const summarize = (checks: VisibilityCheck[]) => {
      const weightedTotal = checks.reduce((sum, check) => sum + check.weight, 0);
      const weightedPassed = checks.filter((check) => check.pass).reduce((sum, check) => sum + check.weight, 0);
      const score = weightedTotal > 0 ? Math.round((weightedPassed / weightedTotal) * 100) : 0;
      return {
        score,
        status: toStatus(score),
        weightedPassed,
        weightedTotal,
        passedChecks: checks.filter((check) => check.pass).length,
        totalChecks: checks.length,
      };
    };

    const seoSummary = summarize(seoChecks);
    const geoSummary = summarize(geoChecks);

    return new Response(JSON.stringify({
      generatedAt: new Date().toISOString(),
      methodology: {
        seo: "Sous-score live SEO basé sur Search Console (impressions, CTR, position) et Analytics (sessions organiques, engagement).",
        geo: "Sous-score live GEO basé sur les sources IA dans Analytics et les requêtes liées IA détectées dans Search Console.",
      },
      seo: {
        ...seoSummary,
        checks: seoChecks,
        metrics: {
          impressions: totalImpressions,
          clicks: totalClicks,
          ctr,
          avgPosition,
          organicSessions,
          organicEngagementRate,
        },
      },
      geo: {
        ...geoSummary,
        checks: geoChecks,
        metrics: {
          llmSessions,
          llmSources,
          iaCitations,
        },
      },
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Visibility score error:", error);
    return new Response(JSON.stringify({
      error: error instanceof Error ? error.message : "Unknown error",
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});