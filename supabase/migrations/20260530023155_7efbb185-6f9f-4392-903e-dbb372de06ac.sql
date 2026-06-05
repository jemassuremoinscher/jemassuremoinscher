
-- 1) Restrict sensitive columns on published_drafts from anon/authenticated
REVOKE SELECT ON public.published_drafts FROM anon, authenticated;
GRANT SELECT (slug, short_description, published_at) ON public.published_drafts TO anon, authenticated;

-- 2) Restrict sensitive internal columns on seo_article_suggestions from anon/authenticated
REVOKE SELECT ON public.seo_article_suggestions FROM anon, authenticated;
GRANT SELECT (
  id, title, slug, suggested_content, suggested_meta_description,
  suggested_author, target_keyword, image_url, short_description,
  status, published_at, created_at
) ON public.seo_article_suggestions TO anon, authenticated;

-- 3) Size constraints on publicly writable tables
ALTER TABLE public.quote_funnel_events
  ADD CONSTRAINT metadata_size_check
  CHECK (octet_length(metadata::text) < 8192);

ALTER TABLE public.chatbot_transfers
  ADD CONSTRAINT conversation_size_check
  CHECK (octet_length(conversation_history::text) < 65536);

ALTER TABLE public.insurance_quotes
  ADD CONSTRAINT quote_data_size_check
  CHECK (octet_length(quote_data::text) < 32768);

ALTER TABLE public.blog_comments
  ADD CONSTRAINT content_length_check
  CHECK (char_length(content) <= 4000),
  ADD CONSTRAINT author_name_length_check CHECK (char_length(author_name) <= 200),
  ADD CONSTRAINT author_email_length_check CHECK (char_length(author_email) <= 255);

-- 4) Update sitemap submission trigger to include internal auth header
CREATE OR REPLACE FUNCTION public.trigger_gsc_sitemap_submission()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'net'
AS $function$
DECLARE
  v_function_url TEXT := 'https://ybqxpngkbgosobtetxac.supabase.co/functions/v1/submit-sitemap-gsc';
  v_service_key TEXT := current_setting('app.settings.service_role_key', true);
BEGIN
  IF NEW.status = 'approved' AND (TG_OP = 'INSERT' OR OLD.status IS DISTINCT FROM 'approved') THEN
    PERFORM net.http_post(
      url := v_function_url,
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'x-internal-trigger', 'db-sitemap-submission'
      ),
      body := jsonb_build_object('trigger_source', 'article_approval', 'slug', NEW.slug),
      timeout_milliseconds := 5000
    );
  END IF;
  RETURN NEW;
END;
$function$;
