
-- 1) Newsletter: tighten INSERT policy
DROP POLICY IF EXISTS "Anyone can subscribe to newsletter" ON public.newsletter_subscribers;
CREATE POLICY "Anyone can subscribe to newsletter"
ON public.newsletter_subscribers
FOR INSERT
TO anon, authenticated
WITH CHECK (
  status = 'pending'
  AND confirmed_at IS NULL
  AND unsubscribed_at IS NULL
);

-- 2) cron_config: admin-only policies
CREATE POLICY "Admins can view cron config"
ON public.cron_config
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can manage cron config"
ON public.cron_config
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- 3) chatbot_transfers: add WITH CHECK to agent UPDATE
DROP POLICY IF EXISTS "Agents can update assigned transfers" ON public.chatbot_transfers;
CREATE POLICY "Agents can update assigned transfers"
ON public.chatbot_transfers
FOR UPDATE
TO authenticated
USING (
  assigned_to IN (SELECT sa.id FROM public.sales_agents sa WHERE sa.user_id = auth.uid())
)
WITH CHECK (
  assigned_to IN (SELECT sa.id FROM public.sales_agents sa WHERE sa.user_id = auth.uid())
  AND status IN ('in_progress','resolved','pending')
);

-- 4) Sitemap GSC trigger: use CRON_SECRET bearer instead of static header
CREATE OR REPLACE FUNCTION public.trigger_gsc_sitemap_submission()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'net'
AS $function$
DECLARE
  v_function_url TEXT := 'https://ybqxpngkbgosobtetxac.supabase.co/functions/v1/submit-sitemap-gsc';
  v_cron_secret TEXT;
BEGIN
  IF NEW.status = 'approved' AND (TG_OP = 'INSERT' OR OLD.status IS DISTINCT FROM 'approved') THEN
    SELECT value INTO v_cron_secret FROM public.cron_config WHERE key = 'CRON_SECRET' LIMIT 1;
    PERFORM net.http_post(
      url := v_function_url,
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || COALESCE(v_cron_secret, '')
      ),
      body := jsonb_build_object('trigger_source', 'article_approval', 'slug', NEW.slug),
      timeout_milliseconds := 5000
    );
  END IF;
  RETURN NEW;
END;
$function$;
