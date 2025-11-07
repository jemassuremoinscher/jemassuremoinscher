-- Create table for Google Ads campaigns tracking
CREATE TABLE public.google_ads_campaigns (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id TEXT NOT NULL UNIQUE,
  campaign_name TEXT NOT NULL,
  budget_daily DECIMAL(10, 2),
  budget_total DECIMAL(10, 2),
  total_spend DECIMAL(10, 2) DEFAULT 0,
  total_clicks INTEGER DEFAULT 0,
  total_impressions INTEGER DEFAULT 0,
  total_conversions INTEGER DEFAULT 0,
  conversion_value DECIMAL(10, 2) DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'ended')),
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for tracking individual conversions from Google Ads
CREATE TABLE public.google_ads_conversions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id TEXT,
  conversion_type TEXT NOT NULL CHECK (conversion_type IN ('quote_request', 'callback_request')),
  conversion_value DECIMAL(10, 2) NOT NULL,
  insurance_type TEXT,
  postal_code TEXT,
  source TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_content TEXT,
  utm_term TEXT,
  click_cost DECIMAL(10, 2),
  lead_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX idx_google_ads_campaigns_status ON public.google_ads_campaigns(status);
CREATE INDEX idx_google_ads_campaigns_dates ON public.google_ads_campaigns(start_date, end_date);
CREATE INDEX idx_google_ads_conversions_campaign ON public.google_ads_conversions(campaign_id);
CREATE INDEX idx_google_ads_conversions_type ON public.google_ads_conversions(conversion_type);
CREATE INDEX idx_google_ads_conversions_date ON public.google_ads_conversions(created_at);

-- Enable RLS
ALTER TABLE public.google_ads_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.google_ads_conversions ENABLE ROW LEVEL SECURITY;

-- Policies for campaigns (admin only)
CREATE POLICY "Admins can view all campaigns" 
ON public.google_ads_campaigns 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  )
);

CREATE POLICY "Admins can insert campaigns" 
ON public.google_ads_campaigns 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  )
);

CREATE POLICY "Admins can update campaigns" 
ON public.google_ads_campaigns 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  )
);

-- Policies for conversions (admin only)
CREATE POLICY "Admins can view all conversions" 
ON public.google_ads_conversions 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  )
);

CREATE POLICY "Admins can insert conversions" 
ON public.google_ads_conversions 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  )
);

-- Trigger to update updated_at
CREATE TRIGGER update_google_ads_campaigns_updated_at
BEFORE UPDATE ON public.google_ads_campaigns
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Function to calculate campaign metrics
CREATE OR REPLACE FUNCTION public.calculate_campaign_metrics()
RETURNS TABLE (
  campaign_id TEXT,
  campaign_name TEXT,
  total_spend DECIMAL,
  total_conversions BIGINT,
  conversion_value DECIMAL,
  cost_per_lead DECIMAL,
  roi_percentage DECIMAL,
  conversion_rate DECIMAL
) 
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    c.campaign_id,
    c.campaign_name,
    c.total_spend,
    COUNT(conv.id) as total_conversions,
    COALESCE(SUM(conv.conversion_value), 0) as conversion_value,
    CASE 
      WHEN COUNT(conv.id) > 0 THEN c.total_spend / COUNT(conv.id)
      ELSE 0
    END as cost_per_lead,
    CASE 
      WHEN c.total_spend > 0 THEN ((COALESCE(SUM(conv.conversion_value), 0) - c.total_spend) / c.total_spend) * 100
      ELSE 0
    END as roi_percentage,
    CASE 
      WHEN c.total_clicks > 0 THEN (COUNT(conv.id)::DECIMAL / c.total_clicks) * 100
      ELSE 0
    END as conversion_rate
  FROM public.google_ads_campaigns c
  LEFT JOIN public.google_ads_conversions conv ON c.campaign_id = conv.campaign_id
  WHERE c.status = 'active'
  GROUP BY c.id, c.campaign_id, c.campaign_name, c.total_spend, c.total_clicks
$$;

-- Enable realtime for real-time updates
ALTER TABLE public.google_ads_campaigns REPLICA IDENTITY FULL;
ALTER TABLE public.google_ads_conversions REPLICA IDENTITY FULL;

ALTER PUBLICATION supabase_realtime ADD TABLE public.google_ads_campaigns;
ALTER PUBLICATION supabase_realtime ADD TABLE public.google_ads_conversions;