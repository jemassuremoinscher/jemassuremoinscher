import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { GoogleAdsMetrics } from "./GoogleAdsMetrics";
import { GoogleAdsCampaignCharts } from "./GoogleAdsCampaignCharts";
import { GoogleAdsCampaignsTable } from "./GoogleAdsCampaignsTable";
import { Card } from "@/components/ui/card";
import { Loader2, AlertCircle, TrendingUp } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { format, subDays } from "date-fns";
import { fr } from "date-fns/locale";

export const GoogleAdsDashboard = () => {
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Fetch campaigns
  const { data: campaigns, isLoading: campaignsLoading } = useQuery({
    queryKey: ['google-ads-campaigns'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('google_ads_campaigns')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Fetch campaign metrics
  const { data: metrics, isLoading: metricsLoading } = useQuery({
    queryKey: ['campaign-metrics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('calculate_campaign_metrics');
      
      if (error) throw error;
      return data;
    },
    refetchInterval: 30000,
  });

  // Fetch conversions for timeline
  const { data: conversions, isLoading: conversionsLoading } = useQuery({
    queryKey: ['google-ads-conversions-timeline'],
    queryFn: async () => {
      const thirtyDaysAgo = subDays(new Date(), 30);
      
      const { data, error } = await supabase
        .from('google_ads_conversions')
        .select('*')
        .gte('created_at', thirtyDaysAgo.toISOString())
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return data;
    },
    refetchInterval: 30000,
  });

  // Setup realtime subscriptions
  useEffect(() => {
    const channel = supabase
      .channel('google-ads-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'google_ads_campaigns'
        },
        () => {
          setLastUpdate(new Date());
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'google_ads_conversions'
        },
        () => {
          setLastUpdate(new Date());
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Calculate aggregated metrics
  const aggregatedMetrics = {
    totalSpend: campaigns?.reduce((sum, c) => sum + Number(c.total_spend), 0) || 0,
    totalConversions: campaigns?.reduce((sum, c) => sum + Number(c.total_conversions), 0) || 0,
    conversionValue: campaigns?.reduce((sum, c) => sum + Number(c.conversion_value), 0) || 0,
    totalClicks: campaigns?.reduce((sum, c) => sum + Number(c.total_clicks), 0) || 0,
  };

  // Prepare conversions by date for charts
  const conversionsByDate = conversions?.reduce((acc: any[], conv) => {
    const date = format(new Date(conv.created_at), 'dd/MM', { locale: fr });
    const existing = acc.find(item => item.date === date);
    
    if (existing) {
      if (conv.conversion_type === 'quote_request') existing.quotes++;
      if (conv.conversion_type === 'callback_request') existing.callbacks++;
      existing.total++;
    } else {
      acc.push({
        date,
        quotes: conv.conversion_type === 'quote_request' ? 1 : 0,
        callbacks: conv.conversion_type === 'callback_request' ? 1 : 0,
        total: 1,
      });
    }
    
    return acc;
  }, []) || [];

  const isLoading = campaignsLoading || metricsLoading || conversionsLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!campaigns || campaigns.length === 0) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Aucune campagne Google Ads n'est configurée pour le moment. 
          Commencez par créer des campagnes dans votre compte Google Ads et assurez-vous 
          que le tracking des conversions est bien configuré.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with last update */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-2">
            <TrendingUp className="h-8 w-8 text-primary" />
            Analytics Google Ads
          </h2>
          <p className="text-muted-foreground mt-1">
            Suivi en temps réel de vos campagnes publicitaires
          </p>
        </div>
        <Card className="p-3">
          <p className="text-sm text-muted-foreground">
            Dernière mise à jour : {format(lastUpdate, 'HH:mm:ss', { locale: fr })}
          </p>
        </Card>
      </div>

      {/* Metrics Cards */}
      <GoogleAdsMetrics
        totalSpend={aggregatedMetrics.totalSpend}
        totalConversions={aggregatedMetrics.totalConversions}
        conversionValue={aggregatedMetrics.conversionValue}
        totalClicks={aggregatedMetrics.totalClicks}
      />

      {/* Charts */}
      {metrics && (
        <GoogleAdsCampaignCharts
          campaigns={metrics}
          conversionsByDate={conversionsByDate}
        />
      )}

      {/* Campaigns Table */}
      {metrics && (
        <GoogleAdsCampaignsTable
          campaigns={campaigns}
          metrics={metrics}
        />
      )}
    </div>
  );
};
