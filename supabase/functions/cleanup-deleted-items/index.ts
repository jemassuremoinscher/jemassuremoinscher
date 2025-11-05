import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.79.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('Starting cleanup of deleted items older than 30 days...');

    // Calculate date 30 days ago
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const cutoffDate = thirtyDaysAgo.toISOString();

    // Delete old insurance quotes
    const { data: deletedQuotes, error: quotesError } = await supabase
      .from('insurance_quotes')
      .delete()
      .not('deleted_at', 'is', null)
      .lt('deleted_at', cutoffDate);

    if (quotesError) {
      console.error('Error deleting quotes:', quotesError);
      throw quotesError;
    }

    // Delete old contact callbacks
    const { data: deletedCallbacks, error: callbacksError } = await supabase
      .from('contact_callbacks')
      .delete()
      .not('deleted_at', 'is', null)
      .lt('deleted_at', cutoffDate);

    if (callbacksError) {
      console.error('Error deleting callbacks:', callbacksError);
      throw callbacksError;
    }

    const result = {
      success: true,
      message: 'Cleanup completed successfully',
      timestamp: new Date().toISOString(),
      cutoffDate,
    };

    console.log('Cleanup completed:', result);

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in cleanup-deleted-items function:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
