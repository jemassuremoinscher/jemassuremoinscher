
-- Table de logs pour les soumissions de sitemap à Google Search Console
CREATE TABLE public.sitemap_submission_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_url TEXT NOT NULL,
  sitemap_url TEXT NOT NULL,
  trigger_source TEXT NOT NULL,
  status TEXT NOT NULL,
  http_status INTEGER,
  response_body TEXT,
  error_message TEXT,
  duration_ms INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT ON public.sitemap_submission_log TO authenticated;
GRANT ALL ON public.sitemap_submission_log TO service_role;

ALTER TABLE public.sitemap_submission_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view sitemap submission log"
  ON public.sitemap_submission_log
  FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE INDEX idx_sitemap_log_created_at ON public.sitemap_submission_log (created_at DESC);

-- Trigger: appelle l'edge function après approbation d'un article
CREATE OR REPLACE FUNCTION public.trigger_gsc_sitemap_submission()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, net
AS $$
DECLARE
  v_function_url TEXT := 'https://ybqxpngkbgosobtetxac.supabase.co/functions/v1/submit-sitemap-gsc';
BEGIN
  IF NEW.status = 'approved' AND (TG_OP = 'INSERT' OR OLD.status IS DISTINCT FROM 'approved') THEN
    PERFORM net.http_post(
      url := v_function_url,
      headers := jsonb_build_object('Content-Type', 'application/json'),
      body := jsonb_build_object('trigger_source', 'article_approval', 'slug', NEW.slug),
      timeout_milliseconds := 5000
    );
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_gsc_sitemap_submission ON public.seo_article_suggestions;
CREATE TRIGGER trg_gsc_sitemap_submission
  AFTER INSERT OR UPDATE OF status ON public.seo_article_suggestions
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_gsc_sitemap_submission();
