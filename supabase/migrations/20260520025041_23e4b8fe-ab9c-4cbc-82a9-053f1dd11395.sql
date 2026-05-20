
-- 1. Admin guard for cleanup_old_deleted_items
CREATE OR REPLACE FUNCTION public.cleanup_old_deleted_items()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  IF NOT has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'Unauthorized: admin role required';
  END IF;

  DELETE FROM public.insurance_quotes
  WHERE deleted_at IS NOT NULL AND deleted_at < NOW() - INTERVAL '30 days';

  DELETE FROM public.contact_callbacks
  WHERE deleted_at IS NOT NULL AND deleted_at < NOW() - INTERVAL '30 days';
END;
$function$;

REVOKE EXECUTE ON FUNCTION public.cleanup_old_deleted_items() FROM anon;

-- 2. Admin guard for calculate_campaign_metrics
CREATE OR REPLACE FUNCTION public.calculate_campaign_metrics()
RETURNS TABLE(campaign_id text, campaign_name text, total_spend numeric, total_conversions bigint, conversion_value numeric, cost_per_lead numeric, roi_percentage numeric, conversion_rate numeric)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  IF NOT has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'Unauthorized: admin role required';
  END IF;

  RETURN QUERY
  SELECT 
    c.campaign_id,
    c.campaign_name,
    c.total_spend,
    COUNT(conv.id) as total_conversions,
    COALESCE(SUM(conv.conversion_value), 0) as conversion_value,
    CASE WHEN COUNT(conv.id) > 0 THEN c.total_spend / COUNT(conv.id) ELSE 0 END as cost_per_lead,
    CASE WHEN c.total_spend > 0 THEN ((COALESCE(SUM(conv.conversion_value), 0) - c.total_spend) / c.total_spend) * 100 ELSE 0 END as roi_percentage,
    CASE WHEN c.total_clicks > 0 THEN (COUNT(conv.id)::DECIMAL / c.total_clicks) * 100 ELSE 0 END as conversion_rate
  FROM public.google_ads_campaigns c
  LEFT JOIN public.google_ads_conversions conv ON c.campaign_id = conv.campaign_id
  WHERE c.status = 'active'
  GROUP BY c.id, c.campaign_id, c.campaign_name, c.total_spend, c.total_clicks;
END;
$function$;

REVOKE EXECUTE ON FUNCTION public.calculate_campaign_metrics() FROM anon;

-- 3. Restrict published_drafts: hide published_by from public
DROP POLICY IF EXISTS "Public can read published drafts" ON public.published_drafts;
CREATE POLICY "Public can read published drafts"
  ON public.published_drafts FOR SELECT TO public USING (true);

REVOKE SELECT ON public.published_drafts FROM anon, authenticated;
GRANT SELECT (slug, published_at, short_description) ON public.published_drafts TO anon, authenticated;

-- 4. Restrict seo_article_suggestions: only expose public-facing columns to anon/authenticated
REVOKE SELECT ON public.seo_article_suggestions FROM anon, authenticated;
GRANT SELECT (id, slug, title, short_description, image_url, published_at, created_at, status, target_keyword) ON public.seo_article_suggestions TO anon, authenticated;
