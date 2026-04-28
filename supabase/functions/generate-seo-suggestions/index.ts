import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

type ParsedArticle = {
  title: string;
  meta_description: string;
  short_description: string;
  author: string;
  content: string;
};

type FailureDetail = {
  keyword: string;
  reason: string;
};

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
  const jwtSignature = btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwtHeader}.${jwtPayload}.${jwtSignature}`,
  });

  const tokenData = await tokenRes.json();
  if (!tokenData.access_token) throw new Error("Failed to get Google access token");
  return tokenData.access_token;
}

async function fetchGSCData(accessToken: string, siteUrl: string): Promise<any[]> {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 28);

  const res = await fetch(
    `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        startDate: startDate.toISOString().split("T")[0],
        endDate: endDate.toISOString().split("T")[0],
        dimensions: ["query", "page"],
        rowLimit: 100,
        dimensionFilterGroups: [{
          filters: [{
            dimension: "query",
            operator: "notContains",
            expression: "jemassuremoinscher",
          }],
        }],
      }),
    },
  );

  const data = await res.json();
  if (!res.ok) throw new Error(`GSC API error: ${JSON.stringify(data)}`);
  return data.rows || [];
}

function findOpportunities(rows: any[]): any[] {
  return rows
    .filter((row: any) => row.position >= 10 && row.position <= 60 && row.impressions >= 5)
    .sort((a: any, b: any) => b.impressions - a.impressions)
    .slice(0, 10);
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function stripCodeFences(raw: string): string {
  return raw
    .replace(/```json\s*/gi, "")
    .replace(/```\s*/gi, "")
    .trim();
}

function extractTaggedSection(raw: string, tag: string): string | null {
  const match = raw.match(new RegExp(`\\[\\[${tag}\\]\\]([\\s\\S]*?)\\[\\[\\/${tag}\\]\\]`, "i"));
  return match?.[1]?.trim() || null;
}

function sanitizeJsonPayload(cleaned: string): string {
  let sanitized = "";
  let inString = false;
  let escaped = false;

  for (let i = 0; i < cleaned.length; i++) {
    const ch = cleaned[i];

    if (escaped) {
      sanitized += ch;
      escaped = false;
      continue;
    }

    if (ch === "\\" && inString) {
      sanitized += ch;
      escaped = true;
      continue;
    }

    if (ch === '"') {
      if (!inString) {
        inString = true;
        sanitized += ch;
        continue;
      }

      let j = i + 1;
      while (j < cleaned.length && (cleaned[j] === " " || cleaned[j] === "\t")) j++;
      const nextCh = j < cleaned.length ? cleaned[j] : "";

      if (nextCh === ":" || nextCh === "," || nextCh === "}" || nextCh === "]" || nextCh === "" || nextCh === "\n" || nextCh === "\r") {
        inString = false;
        sanitized += ch;
        continue;
      }

      sanitized += '\\"';
      continue;
    }

    if (inString) {
      if (ch === "\n") {
        sanitized += "\\n";
        continue;
      }
      if (ch === "\r") {
        sanitized += "\\r";
        continue;
      }
      if (ch === "\t") {
        sanitized += "\\t";
        continue;
      }
    }

    sanitized += ch;
  }

  return sanitized;
}

function tryParseJsonArticle(raw: string): Partial<ParsedArticle> | null {
  const cleaned = stripCodeFences(raw);
  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");

  if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
    return null;
  }

  const jsonCandidate = cleaned.substring(firstBrace, lastBrace + 1);

  try {
    return JSON.parse(jsonCandidate);
  } catch {
    return JSON.parse(sanitizeJsonPayload(jsonCandidate));
  }
}

function normalizeArticle(article: Partial<ParsedArticle>): ParsedArticle {
  const title = typeof article.title === "string" ? article.title.trim() : "";
  const content = typeof article.content === "string" ? article.content.trim() : "";
  const metaDescriptionSource = typeof article.meta_description === "string"
    ? article.meta_description
    : "";
  const shortDescriptionSource = typeof article.short_description === "string" && article.short_description.trim().length > 0
    ? article.short_description.trim()
    : `🛡️ ${metaDescriptionSource || title}`;
  const rawAuthor = typeof article.author === "string" && article.author.trim().length > 0
    ? article.author.trim()
    : "L'équipe d'experts Jemassuremoinscher";
  const author = rawAuthor.toLowerCase().includes("arthur")
    ? "L'équipe d'experts Jemassuremoinscher"
    : rawAuthor;

  if (!title) throw new Error("Titre manquant dans la réponse IA");
  if (!content) throw new Error("Contenu manquant dans la réponse IA");

  return {
    title,
    content,
    author,
    meta_description: metaDescriptionSource.trim().slice(0, 150),
    short_description: shortDescriptionSource.replace(/\s+/g, " ").slice(0, 220),
  };
}

function parseAiArticle(raw: string): ParsedArticle {
  const taggedArticle = {
    title: extractTaggedSection(raw, "TITLE") || "",
    meta_description: extractTaggedSection(raw, "META_DESCRIPTION") || "",
    short_description: extractTaggedSection(raw, "SHORT_DESCRIPTION") || "",
    author: extractTaggedSection(raw, "AUTHOR") || "",
    content: extractTaggedSection(raw, "CONTENT") || "",
  };

  if (taggedArticle.title && taggedArticle.content) {
    return normalizeArticle(taggedArticle);
  }

  const jsonArticle = tryParseJsonArticle(raw);
  if (jsonArticle) {
    return normalizeArticle(jsonArticle);
  }

  throw new Error("Impossible d'extraire un format exploitable depuis la réponse IA");
}

function buildFallbackArticle(keyword: string, currentPage: string, opp: any): ParsedArticle {
  const normalizedKeyword = keyword.trim() || "définition assurance";
  const title = `${normalizedKeyword.charAt(0).toUpperCase()}${normalizedKeyword.slice(1)} : définition, garanties et conseils 2026`;
  const meta = `${normalizedKeyword} : définition claire, exemples, démarches et conseils pour mieux comprendre votre assurance en 2026.`;

  return normalizeArticle({
    title,
    meta_description: meta,
    author: "L'équipe d'experts Jemassuremoinscher",
    content: `# ${title}

## En bref

Le sujet **${normalizedKeyword}** mérite une explication simple, fiable et directement exploitable pour comparer un contrat d'assurance. Cette fiche sert de base éditoriale : elle peut être enrichie manuellement avant publication avec les exemples, chiffres et liens internes les plus pertinents.

## Définition

En assurance, un sinistre désigne généralement un événement prévu au contrat qui déclenche potentiellement l'intervention de l'assureur : accident, dégât des eaux, vol, incendie, dommage corporel ou autre événement garanti selon le type de couverture souscrite.

## Pourquoi c'est important

Comprendre cette notion aide à vérifier si une situation est couverte, quelles démarches effectuer et quels justificatifs transmettre. C'est aussi un point clé pour comparer les exclusions, franchises, plafonds d'indemnisation et délais de déclaration.

## Démarches à prévoir

| Étape | Action recommandée | Point de vigilance |
|---|---|---|
| 1 | Relire les garanties du contrat | Vérifier exclusions et franchises |
| 2 | Déclarer l'événement rapidement | Respecter les délais contractuels |
| 3 | Réunir les preuves | Photos, factures, constat, témoignages |
| 4 | Suivre l'indemnisation | Contrôler les plafonds et vétusté appliquée |

## Conseils pour comparer

- Comparez le niveau de garantie réel, pas seulement le prix.
- Vérifiez les franchises applicables à chaque type de sinistre.
- Contrôlez les délais de déclaration et les documents demandés.
- Regardez les plafonds d'indemnisation et les exclusions.

## Maillage interne utile

Selon votre besoin, consultez aussi nos pages dédiées : [assurance auto](/assurance-auto), [assurance habitation](/assurance-habitation), [mutuelle santé](/assurance-sante), [assurance moto](/assurance-moto) et [glossaire assurance](/glossaire).

## FAQ

### Que faire après un sinistre ?

Prévenez votre assureur dans les délais prévus, rassemblez les justificatifs et conservez une trace écrite de vos échanges.

### Un sinistre est-il toujours indemnisé ?

Non. L'indemnisation dépend des garanties souscrites, des exclusions, des franchises et des plafonds prévus au contrat.

### Comment réduire le risque de mauvaise surprise ?

Comparez les contrats avant de signer et demandez une explication claire des exclusions, franchises et limites d'indemnisation.

---

Note backoffice : brouillon de secours créé automatiquement après indisponibilité temporaire de l'IA pour la requête "${normalizedKeyword}". Page GSC associée : ${currentPage || "non disponible"}. Position observée : ${Math.round(Number(opp?.position || 0) * 10) / 10}, impressions : ${Number(opp?.impressions || 0)}.`,
  });
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY") || Deno.env.get("SUPABASE_PUBLISHABLE_KEY");
    const ga4ServiceAccountJson = Deno.env.get("GA4_SERVICE_ACCOUNT_JSON");
    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");

    if (!supabaseUrl || !supabaseServiceKey || !anonKey) {
      throw new Error("Configuration backend manquante");
    }

    if (!ga4ServiceAccountJson) {
      return new Response(JSON.stringify({ error: "Service account GSC non configuré" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!lovableApiKey) {
      return new Response(JSON.stringify({ error: "LOVABLE_API_KEY non configurée" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { createClient } = await import("https://esm.sh/@supabase/supabase-js@2");
    const authHeader = req.headers.get("Authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const token = authHeader.replace("Bearer ", "");
    const invocationMode = token === anonKey ? "cron" : "admin";
    console.log(`Invocation mode: ${invocationMode}`);

    if (token !== anonKey) {
      const supabaseUser = createClient(supabaseUrl, anonKey, {
        global: { headers: { Authorization: authHeader } },
      });

      const { data: claimsData, error: claimsError } = await supabaseUser.auth.getClaims(token);
      if (claimsError || !claimsData?.claims) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const userId = claimsData.claims.sub;
      const { data: roleData } = await supabaseUser
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .eq("role", "admin")
        .maybeSingle();

      if (!roleData) {
        return new Response(JSON.stringify({ error: "Forbidden" }), {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const serviceAccount = JSON.parse(ga4ServiceAccountJson);

    console.log("Fetching GSC data...");
    const accessToken = await getGoogleAccessToken(serviceAccount, "https://www.googleapis.com/auth/webmasters.readonly");
    const gscRows = await fetchGSCData(accessToken, "sc-domain:jemassuremoinscher.fr");
    console.log(`Got ${gscRows.length} GSC rows`);

    const opportunities = findOpportunities(gscRows);
    if (opportunities.length === 0) {
      return new Response(JSON.stringify({
        message: "Aucune opportunité détectée",
        opportunities: 0,
        generated: 0,
        skipped: 0,
        failed: 0,
        suggestions: [],
        errors: [],
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log(`Found ${opportunities.length} opportunities`);

    const topOpportunities = opportunities.slice(0, 3);
    const suggestions: Array<{ keyword: string; title: string; slug: string }> = [];
    const skippedKeywords: string[] = [];
    const failures: FailureDetail[] = [];

    for (const opp of topOpportunities) {
      const keyword = opp.keys[0];
      const currentPage = opp.keys[1];

      const { data: existing } = await supabase
        .from("seo_article_suggestions")
        .select("id")
        .eq("target_keyword", keyword)
        .maybeSingle();

      if (existing) {
        console.log(`Skipping existing keyword: ${keyword}`);
        skippedKeywords.push(keyword);
        continue;
      }

      const prompt = `Tu es un expert SEO et rédacteur pour jemassuremoinscher.fr, un courtier en assurances indépendant.

Génère un article de blog SEO optimisé pour la requête "${keyword}" (position actuelle: ${Math.round(opp.position)}, ${opp.impressions} impressions/28j).
URL actuellement associée dans Google Search Console: ${currentPage}

Contraintes:
- 1500+ mots minimum
- Titre H1 optimisé contenant le mot-clé exact
- Meta description de 150 caractères max
- Short description de 3 phrases maximum, optimisée réseaux sociaux, avec un emoji au début
- Structure avec H2/H3 logiques
- Inclure un tableau de données chiffrées
- Inclure une FAQ de 3-4 questions
- Maillage interne vers: /assurance-auto, /assurance-sante, /assurance-habitation, /assurance-pret, /assurance-vie, /assurance-moto, /assurance-animaux, /blog (choisir les plus pertinents)
- Ton expert mais accessible, pas de jargon inutile
- Données à jour pour 2026
- Mentionner "jemassuremoinscher.fr" naturellement 2-3 fois
- Suggérer un auteur expert crédible avec titre/spécialité
- Ne jamais utiliser les balises [[TITLE]], [[META_DESCRIPTION]], [[AUTHOR]], [[CONTENT]] à l'intérieur du contenu

Réponds STRICTEMENT avec ce format, sans JSON, sans bloc de code et sans texte avant/après:
[[TITLE]]
Titre de l'article
[[/TITLE]]
[[META_DESCRIPTION]]
Meta description
[[/META_DESCRIPTION]]
[[SHORT_DESCRIPTION]]
Accroche sociale courte avec emoji, 3 phrases maximum
[[/SHORT_DESCRIPTION]]
[[AUTHOR]]
Prénom Nom – Titre
[[/AUTHOR]]
[[CONTENT]]
Article complet en markdown
[[/CONTENT]]`;

      try {
        const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${lovableApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-2.5-flash",
            messages: [
              {
                role: "system",
                content: "Tu es un expert SEO français spécialisé en assurance. Respecte exactement le format demandé avec les balises [[TITLE]], [[META_DESCRIPTION]], [[AUTHOR]] et [[CONTENT]].",
              },
              { role: "user", content: prompt },
            ],
          }),
        });

        let article: ParsedArticle;

        if (!aiRes.ok) {
          const errText = await aiRes.text();
          console.error(`AI error for \"${keyword}\": ${aiRes.status} ${errText}`);
          if (aiRes.status === 401 || aiRes.status === 402) {
            article = buildFallbackArticle(keyword, currentPage, opp);
          } else {
            failures.push({ keyword, reason: `Erreur IA ${aiRes.status}` });
            if (aiRes.status === 429) {
              console.log("Rate limited, stopping generation");
              break;
            }
            continue;
          }
        } else {
          const aiData = await aiRes.json();
          const rawContent = aiData.choices?.[0]?.message?.content;

          if (!rawContent || typeof rawContent !== "string") {
            failures.push({ keyword, reason: "Réponse IA vide" });
            continue;
          }

          try {
            article = parseAiArticle(rawContent);
          } catch (parseErr) {
            const reason = parseErr instanceof Error ? parseErr.message : "Erreur de parsing inconnue";
            console.error(`Parse failed for \"${keyword}\": ${reason}. Raw start: ${rawContent.substring(0, 200)}`);
            failures.push({ keyword, reason });
            continue;
          }
        }

        const slug = slugify(article.title || keyword);
        const { error: insertError } = await supabase.from("seo_article_suggestions").insert({
          title: article.title,
          slug,
          target_keyword: keyword,
          gsc_position: Math.round(opp.position * 10) / 10,
          gsc_impressions: opp.impressions,
          gsc_clicks: opp.clicks,
          suggested_content: article.content,
          suggested_meta_description: article.meta_description,
          suggested_author: article.author,
          status: "pending",
        });

        if (insertError) {
          console.error(`Insert error for \"${keyword}\": ${insertError.message}`);
          failures.push({ keyword, reason: insertError.message });
          continue;
        }

        suggestions.push({ keyword, title: article.title, slug });
        console.log(`Created suggestion for: ${keyword}`);
      } catch (err) {
        const reason = err instanceof Error ? err.message : "Erreur inconnue";
        console.error(`Error generating for \"${keyword}\": ${reason}`);
        failures.push({ keyword, reason });
      }
    }

    const generatedCount = suggestions.length;
    const skippedCount = skippedKeywords.length;
    const failedCount = failures.length;

    return new Response(JSON.stringify({
      message: generatedCount > 0
        ? `${generatedCount} suggestion(s) générée(s)`
        : failedCount > 0
          ? "La génération a échoué"
          : "Aucune nouvelle suggestion à créer",
      opportunities: opportunities.length,
      generated: generatedCount,
      skipped: skippedCount,
      failed: failedCount,
      suggestions,
      errors: failures.slice(0, 5),
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({
      error: error instanceof Error ? error.message : "Unknown error",
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});