import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

async function getGoogleAccessToken(serviceAccount: any, scope: string): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const jwtHeader = btoa(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  const jwtPayload = btoa(JSON.stringify({
    iss: serviceAccount.client_email,
    scope,
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now,
  })).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');

  const pemContent = serviceAccount.private_key
    .replace('-----BEGIN PRIVATE KEY-----', '')
    .replace('-----END PRIVATE KEY-----', '')
    .replace(/\n/g, '');

  const binaryKey = Uint8Array.from(atob(pemContent), c => c.charCodeAt(0));
  const cryptoKey = await crypto.subtle.importKey(
    'pkcs8', binaryKey,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false, ['sign']
  );

  const signatureInput = new TextEncoder().encode(`${jwtHeader}.${jwtPayload}`);
  const signature = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', cryptoKey, signatureInput);
  const jwtSignature = btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');

  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwtHeader}.${jwtPayload}.${jwtSignature}`,
  });

  const tokenData = await tokenRes.json();
  if (!tokenData.access_token) throw new Error('Failed to get Google access token');
  return tokenData.access_token;
}

async function fetchGSCData(accessToken: string, siteUrl: string): Promise<any[]> {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 28);

  const res = await fetch(
    `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        dimensions: ['query', 'page'],
        rowLimit: 100,
        dimensionFilterGroups: [{
          filters: [{
            dimension: 'query',
            operator: 'notContains',
            expression: 'jemassuremoinscher',
          }],
        }],
      }),
    }
  );

  const data = await res.json();
  if (!res.ok) throw new Error(`GSC API error: ${JSON.stringify(data)}`);
  return data.rows || [];
}

function findOpportunities(rows: any[]): any[] {
  // Filter queries with position 10-60 and decent impressions
  return rows
    .filter((r: any) => r.position >= 10 && r.position <= 60 && r.impressions >= 5)
    .sort((a: any, b: any) => b.impressions - a.impressions)
    .slice(0, 10);
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const { createClient } = await import("https://esm.sh/@supabase/supabase-js@2");

    // Check if this is a cron call (anon key) or admin call (user JWT)
    const authHeader = req.headers.get('Authorization');
    let isCronCall = false;

    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.replace('Bearer ', '');
      const anonKey = Deno.env.get('SUPABASE_ANON_KEY') || Deno.env.get('SUPABASE_PUBLISHABLE_KEY');
      
      if (token === anonKey) {
        // Cron job call with anon key — allow
        isCronCall = true;
      } else {
        // User call — verify admin role
        const supabaseUser = createClient(supabaseUrl, anonKey!, {
          global: { headers: { Authorization: authHeader } },
        });
        const { data: claimsData, error: claimsError } = await supabaseUser.auth.getClaims(token);
        if (claimsError || !claimsData?.claims) {
          return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        const userId = claimsData.claims.sub;
        const { data: roleData } = await supabaseUser.from('user_roles').select('role').eq('user_id', userId).eq('role', 'admin').maybeSingle();
        if (!roleData) {
          return new Response(JSON.stringify({ error: 'Forbidden' }), {
            status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
      }
    } else {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Use service role for DB operations (needed for cron calls)
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get credentials
    const ga4ServiceAccountJson = Deno.env.get('GA4_SERVICE_ACCOUNT_JSON');
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!ga4ServiceAccountJson) {
      return new Response(JSON.stringify({ error: 'Service account GSC non configuré' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: 'LOVABLE_API_KEY non configurée' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const serviceAccount = JSON.parse(ga4ServiceAccountJson);

    // 1. Get GSC data
    console.log('Fetching GSC data...');
    const accessToken = await getGoogleAccessToken(serviceAccount, 'https://www.googleapis.com/auth/webmasters.readonly');
    const gscRows = await fetchGSCData(accessToken, 'sc-domain:jemassuremoinscher.fr');
    console.log(`Got ${gscRows.length} GSC rows`);

    const opportunities = findOpportunities(gscRows);
    if (opportunities.length === 0) {
      return new Response(JSON.stringify({ message: 'Aucune opportunité détectée', suggestions: 0 }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Found ${opportunities.length} opportunities`);

    // 2. Generate articles via AI for top 3 opportunities
    const topOpportunities = opportunities.slice(0, 3);
    const suggestions = [];

    for (const opp of topOpportunities) {
      const keyword = opp.keys[0];
      const page = opp.keys[1];

      // Check if suggestion already exists
      const { data: existing } = await supabase
        .from('seo_article_suggestions')
        .select('id')
        .eq('target_keyword', keyword)
        .maybeSingle();

      if (existing) {
        console.log(`Skipping existing keyword: ${keyword}`);
        continue;
      }

      const prompt = `Tu es un expert SEO et rédacteur pour jemassuremoinscher.fr, un courtier en assurances indépendant.

Génère un article de blog SEO optimisé pour la requête "${keyword}" (position actuelle: ${Math.round(opp.position)}, ${opp.impressions} impressions/28j).

Contraintes:
- 1500+ mots minimum
- Titre H1 optimisé contenant le mot-clé exact
- Meta description de 150 caractères max
- Structure avec H2/H3 logiques
- Inclure un tableau de données chiffrées
- Inclure une FAQ de 3-4 questions
- Maillage interne vers: /assurance-auto, /assurance-sante, /assurance-habitation, /assurance-pret, /assurance-vie, /assurance-moto, /assurance-animaux, /blog (choisir les plus pertinents)
- Ton expert mais accessible, pas de jargon inutile
- Données à jour pour 2026
- Mentionner "jemassuremoinscher.fr" naturellement 2-3 fois
- Suggérer un auteur expert crédible avec titre/spécialité

Format de réponse en JSON:
{
  "title": "...",
  "meta_description": "...",
  "author": "Prénom Nom – Titre",
  "content": "le contenu markdown complet de l'article"
}`;

      try {
        const aiRes = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'google/gemini-2.5-flash',
            messages: [
              { role: 'system', content: 'Tu es un expert SEO français spécialisé en assurance. Réponds uniquement en JSON valide.' },
              { role: 'user', content: prompt },
            ],
            response_format: { type: 'json_object' },
          }),
        });

        if (!aiRes.ok) {
          const errText = await aiRes.text();
          console.error(`AI error for "${keyword}": ${aiRes.status} ${errText}`);
          if (aiRes.status === 429) {
            console.log('Rate limited, stopping generation');
            break;
          }
          continue;
        }

        const aiData = await aiRes.json();
        const rawContent = aiData.choices?.[0]?.message?.content;
        if (!rawContent) continue;

        // Extract valid JSON from AI response — handle unescaped newlines inside string values
        let article;
        try {
          let cleaned = rawContent
            .replace(/```json\s*/gi, '')
            .replace(/```\s*/gi, '')
            .trim();
          
          const firstBrace = cleaned.indexOf('{');
          const lastBrace = cleaned.lastIndexOf('}');
          if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
            console.error(`No JSON object found for "${keyword}"`);
            continue;
          }
          cleaned = cleaned.substring(firstBrace, lastBrace + 1);
          
          try {
            article = JSON.parse(cleaned);
          } catch {
            // State-machine: escape control chars and fix unescaped quotes inside JSON string values
            let sanitized = '';
            let inString = false;
            let escaped = false;
            for (let i = 0; i < cleaned.length; i++) {
              const ch = cleaned[i];
              if (escaped) { sanitized += ch; escaped = false; continue; }
              if (ch === '\\' && inString) { sanitized += ch; escaped = true; continue; }
              if (ch === '"') {
                if (!inString) {
                  inString = true; sanitized += ch; continue;
                }
                // Check if this quote is actually ending the string
                // Look ahead: skip whitespace, if next non-ws is : , } ] or end, it's a closing quote
                let j = i + 1;
                while (j < cleaned.length && (cleaned[j] === ' ' || cleaned[j] === '\t')) j++;
                const nextCh = j < cleaned.length ? cleaned[j] : '';
                if (nextCh === ':' || nextCh === ',' || nextCh === '}' || nextCh === ']' || nextCh === '' || nextCh === '\n' || nextCh === '\r') {
                  inString = false; sanitized += ch; continue;
                }
                // Otherwise it's an unescaped quote inside a string — escape it
                sanitized += '\\"'; continue;
              }
              if (inString) {
                if (ch === '\n') { sanitized += '\\n'; continue; }
                if (ch === '\r') { sanitized += '\\r'; continue; }
                if (ch === '\t') { sanitized += '\\t'; continue; }
              }
              sanitized += ch;
            }
            article = JSON.parse(sanitized);
          }
        } catch (parseErr) {
          console.error(`JSON parse failed for "${keyword}": ${parseErr}. Raw start: ${rawContent.substring(0, 200)}`);
          continue;
        }

        const slug = slugify(article.title || keyword);

        const { error: insertError } = await supabase.from('seo_article_suggestions').insert({
          title: article.title,
          slug,
          target_keyword: keyword,
          gsc_position: Math.round(opp.position * 10) / 10,
          gsc_impressions: opp.impressions,
          gsc_clicks: opp.clicks,
          suggested_content: article.content,
          suggested_meta_description: article.meta_description,
          suggested_author: article.author,
          status: 'pending',
        });

        if (insertError) {
          console.error(`Insert error: ${insertError.message}`);
        } else {
          suggestions.push({ keyword, title: article.title, slug });
          console.log(`Created suggestion for: ${keyword}`);
        }
      } catch (err) {
        console.error(`Error generating for "${keyword}": ${err}`);
      }
    }

    return new Response(JSON.stringify({
      message: `${suggestions.length} suggestion(s) générée(s)`,
      opportunities: opportunities.length,
      suggestions,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
