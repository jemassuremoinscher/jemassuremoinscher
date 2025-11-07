import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.79.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GoogleAdsCredentials {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
  developerToken: string;
  customerId: string;
}

interface CampaignMetrics {
  campaign_id: string;
  campaign_name: string;
  status: string;
  budget_daily?: number;
  budget_total?: number;
  total_spend: number;
  total_clicks: number;
  total_impressions: number;
  total_conversions: number;
  conversion_value: number;
  start_date?: string;
  end_date?: string;
}

const getAccessToken = async (credentials: GoogleAdsCredentials): Promise<string> => {
  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: credentials.clientId,
      client_secret: credentials.clientSecret,
      refresh_token: credentials.refreshToken,
      grant_type: 'refresh_token',
    }),
  });

  if (!tokenResponse.ok) {
    const error = await tokenResponse.text();
    throw new Error(`Failed to get access token: ${error}`);
  }

  const { access_token } = await tokenResponse.json();
  return access_token;
};

const fetchCampaignsFromGoogleAds = async (
  accessToken: string,
  credentials: GoogleAdsCredentials
): Promise<CampaignMetrics[]> => {
  const query = `
    SELECT 
      campaign.id,
      campaign.name,
      campaign.status,
      campaign_budget.amount_micros,
      metrics.cost_micros,
      metrics.clicks,
      metrics.impressions,
      metrics.conversions,
      metrics.conversions_value
    FROM campaign
    WHERE segments.date DURING LAST_30_DAYS
  `;

  const response = await fetch(
    `https://googleads.googleapis.com/v16/customers/${credentials.customerId}/googleAds:searchStream`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'developer-token': credentials.developerToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Google Ads API error: ${error}`);
  }

  const results = await response.json();
  const campaigns: CampaignMetrics[] = [];

  for (const batch of results) {
    for (const row of batch.results || []) {
      const campaign = row.campaign;
      const metrics = row.metrics;
      const budget = row.campaignBudget;

      campaigns.push({
        campaign_id: campaign.id.toString(),
        campaign_name: campaign.name,
        status: campaign.status.toLowerCase(),
        budget_daily: budget?.amountMicros ? Number(budget.amountMicros) / 1_000_000 : undefined,
        total_spend: Number(metrics.costMicros || 0) / 1_000_000,
        total_clicks: Number(metrics.clicks || 0),
        total_impressions: Number(metrics.impressions || 0),
        total_conversions: Number(metrics.conversions || 0),
        conversion_value: Number(metrics.conversionsValue || 0),
      });
    }
  }

  return campaigns;
};

const syncCampaignsToDatabase = async (
  supabaseClient: any,
  campaigns: CampaignMetrics[]
): Promise<void> => {
  for (const campaign of campaigns) {
    const { error } = await supabaseClient
      .from('google_ads_campaigns')
      .upsert(
        {
          campaign_id: campaign.campaign_id,
          campaign_name: campaign.campaign_name,
          status: campaign.status,
          budget_daily: campaign.budget_daily,
          budget_total: campaign.budget_total,
          total_spend: campaign.total_spend,
          total_clicks: campaign.total_clicks,
          total_impressions: campaign.total_impressions,
          total_conversions: campaign.total_conversions,
          conversion_value: campaign.conversion_value,
          start_date: campaign.start_date,
          end_date: campaign.end_date,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'campaign_id' }
      );

    if (error) {
      console.error(`Error syncing campaign ${campaign.campaign_id}:`, error);
      throw error;
    }
  }
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🚀 Starting Google Ads sync...');

    const credentials: GoogleAdsCredentials = {
      clientId: Deno.env.get('GOOGLE_ADS_CLIENT_ID')!,
      clientSecret: Deno.env.get('GOOGLE_ADS_CLIENT_SECRET')!,
      refreshToken: Deno.env.get('GOOGLE_ADS_REFRESH_TOKEN')!,
      developerToken: Deno.env.get('GOOGLE_ADS_DEVELOPER_TOKEN')!,
      customerId: Deno.env.get('GOOGLE_ADS_CUSTOMER_ID')!,
    };

    if (!credentials.clientId || !credentials.clientSecret || !credentials.refreshToken) {
      throw new Error('Missing Google Ads credentials in environment variables');
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get access token
    console.log('🔑 Getting access token...');
    const accessToken = await getAccessToken(credentials);

    // Fetch campaigns from Google Ads
    console.log('📊 Fetching campaigns from Google Ads...');
    const campaigns = await fetchCampaignsFromGoogleAds(accessToken, credentials);
    console.log(`✅ Fetched ${campaigns.length} campaigns`);

    // Sync to database
    console.log('💾 Syncing to database...');
    await syncCampaignsToDatabase(supabase, campaigns);
    console.log('✅ Sync completed successfully');

    return new Response(
      JSON.stringify({
        success: true,
        message: `Synced ${campaigns.length} campaigns`,
        campaigns: campaigns.length,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('❌ Error syncing Google Ads:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
