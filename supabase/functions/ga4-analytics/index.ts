import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify auth
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;

    const { createClient } = await import("https://esm.sh/@supabase/supabase-js@2");
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });

    const token = authHeader.replace('Bearer ', '');
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const userId = claimsData.claims.sub;
    const { data: roleData } = await supabase.from('user_roles').select('role').eq('user_id', userId).eq('role', 'admin').maybeSingle();
    if (!roleData) {
      return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // Get GA4 credentials
    const ga4PropertyId = Deno.env.get('GA4_PROPERTY_ID');
    const ga4ServiceAccountJson = Deno.env.get('GA4_SERVICE_ACCOUNT_JSON');

    if (!ga4PropertyId || !ga4ServiceAccountJson) {
      return new Response(JSON.stringify({ 
        error: 'GA4 non configuré',
        message: 'Les identifiants Google Analytics ne sont pas encore configurés.' 
      }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // Parse service account
    const serviceAccount = JSON.parse(ga4ServiceAccountJson);

    // Create JWT for Google API auth
    const now = Math.floor(Date.now() / 1000);
    const jwtHeader = btoa(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
    const jwtPayload = btoa(JSON.stringify({
      iss: serviceAccount.client_email,
      scope: 'https://www.googleapis.com/auth/analytics.readonly',
      aud: 'https://oauth2.googleapis.com/token',
      exp: now + 3600,
      iat: now,
    })).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');

    // Sign JWT with RSA
    const pemContent = serviceAccount.private_key
      .replace('-----BEGIN PRIVATE KEY-----', '')
      .replace('-----END PRIVATE KEY-----', '')
      .replace(/\n/g, '');
    
    const binaryKey = Uint8Array.from(atob(pemContent), c => c.charCodeAt(0));
    const cryptoKey = await crypto.subtle.importKey(
      'pkcs8',
      binaryKey,
      { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
      false,
      ['sign']
    );

    const signatureInput = new TextEncoder().encode(`${jwtHeader}.${jwtPayload}`);
    const signature = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', cryptoKey, signatureInput);
    const jwtSignature = btoa(String.fromCharCode(...new Uint8Array(signature))).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');

    const jwt = `${jwtHeader}.${jwtPayload}.${jwtSignature}`;

    // Exchange JWT for access token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
    });

    const tokenData = await tokenResponse.json();
    console.log('Token response status:', tokenResponse.status);
    if (!tokenData.access_token) {
      console.error('Token error:', JSON.stringify(tokenData));
      throw new Error('Failed to get access token: ' + JSON.stringify(tokenData));
    }
    console.log('Access token obtained successfully');

    const accessToken = tokenData.access_token;

    // Parse request body for date range
    const body = await req.json().catch(() => ({}));
    const startDate = body.startDate || '30daysAgo';
    const endDate = body.endDate || 'today';

    // Fetch multiple reports in parallel
    const baseUrl = `https://analyticsdata.googleapis.com/v1beta/properties/${ga4PropertyId}:runReport`;
    const headers = {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    };

    const [overviewRes, pagesRes, sourcesRes, dailyRes] = await Promise.all([
      // Overview metrics
      fetch(baseUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          dateRanges: [{ startDate, endDate }],
          metrics: [
            { name: 'activeUsers' },
            { name: 'sessions' },
            { name: 'screenPageViews' },
            { name: 'averageSessionDuration' },
            { name: 'bounceRate' },
            { name: 'newUsers' },
          ],
        }),
      }),
      // Top pages
      fetch(baseUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          dateRanges: [{ startDate, endDate }],
          dimensions: [{ name: 'pagePath' }],
          metrics: [
            { name: 'screenPageViews' },
            { name: 'activeUsers' },
            { name: 'averageSessionDuration' },
          ],
          orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
          limit: 15,
        }),
      }),
      // Traffic sources
      fetch(baseUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          dateRanges: [{ startDate, endDate }],
          dimensions: [{ name: 'sessionSource' }],
          metrics: [
            { name: 'sessions' },
            { name: 'activeUsers' },
            { name: 'bounceRate' },
          ],
          orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
          limit: 10,
        }),
      }),
      // Daily visitors
      fetch(baseUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          dateRanges: [{ startDate, endDate }],
          dimensions: [{ name: 'date' }],
          metrics: [
            { name: 'activeUsers' },
            { name: 'sessions' },
            { name: 'screenPageViews' },
          ],
          orderBys: [{ dimension: { dimensionName: 'date' }, desc: false }],
        }),
      }),
    ]);

    const [overview, pages, sources, daily] = await Promise.all([
      overviewRes.json(),
      pagesRes.json(),
      sourcesRes.json(),
      dailyRes.json(),
    ]);

    // Parse overview
    const overviewMetrics = overview.rows?.[0]?.metricValues || [];
    const parsedOverview = {
      activeUsers: parseInt(overviewMetrics[0]?.value || '0'),
      sessions: parseInt(overviewMetrics[1]?.value || '0'),
      pageViews: parseInt(overviewMetrics[2]?.value || '0'),
      avgSessionDuration: parseFloat(overviewMetrics[3]?.value || '0'),
      bounceRate: parseFloat(overviewMetrics[4]?.value || '0'),
      newUsers: parseInt(overviewMetrics[5]?.value || '0'),
    };

    // Parse pages
    const parsedPages = (pages.rows || []).map((row: any) => ({
      path: row.dimensionValues[0].value,
      views: parseInt(row.metricValues[0].value),
      users: parseInt(row.metricValues[1].value),
      avgDuration: parseFloat(row.metricValues[2].value),
    }));

    // Parse sources
    const parsedSources = (sources.rows || []).map((row: any) => ({
      source: row.dimensionValues[0].value,
      sessions: parseInt(row.metricValues[0].value),
      users: parseInt(row.metricValues[1].value),
      bounceRate: parseFloat(row.metricValues[2].value),
    }));

    // Parse daily
    const parsedDaily = (daily.rows || []).map((row: any) => {
      const dateStr = row.dimensionValues[0].value;
      const formatted = `${dateStr.slice(6, 8)}/${dateStr.slice(4, 6)}`;
      return {
        date: formatted,
        users: parseInt(row.metricValues[0].value),
        sessions: parseInt(row.metricValues[1].value),
        pageViews: parseInt(row.metricValues[2].value),
      };
    });

    return new Response(JSON.stringify({
      overview: parsedOverview,
      pages: parsedPages,
      sources: parsedSources,
      daily: parsedDaily,
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: unknown) {
    console.error('GA4 Analytics error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
