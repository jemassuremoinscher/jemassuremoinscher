CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

ALTER TABLE public.linkedin_config
  ADD COLUMN IF NOT EXISTS provider text NOT NULL DEFAULT 'make',
  ADD COLUMN IF NOT EXISTS facebook_enabled boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS linkedin_enabled boolean NOT NULL DEFAULT true;

ALTER TABLE public.linkedin_auto_posts
  ADD COLUMN IF NOT EXISTS article_url text,
  ADD COLUMN IF NOT EXISTS image_url text,
  ADD COLUMN IF NOT EXISTS provider text NOT NULL DEFAULT 'make',
  ADD COLUMN IF NOT EXISTS linkedin_status text NOT NULL DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS facebook_status text NOT NULL DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS response_payload jsonb;

UPDATE public.linkedin_config
SET webhook_url = 'https://hook.eu1.make.com/swhr61xm1p2alnmmfrlif7af4ofd71o7',
    provider = 'make',
    facebook_enabled = true,
    linkedin_enabled = true
WHERE webhook_url IS NULL
   OR webhook_url = ''
   OR webhook_url LIKE '%zapier.com%';

INSERT INTO public.linkedin_config (webhook_url, provider, facebook_enabled, linkedin_enabled, is_active)
SELECT 'https://hook.eu1.make.com/swhr61xm1p2alnmmfrlif7af4ofd71o7', 'make', true, true, true
WHERE NOT EXISTS (SELECT 1 FROM public.linkedin_config);

UPDATE public.linkedin_auto_posts
SET article_url = COALESCE(article_url, 'https://jemassuremoinscher.fr/blog/' || article_slug),
    provider = COALESCE(provider, 'make'),
    linkedin_status = CASE WHEN status = 'posted' THEN 'posted' WHEN status = 'failed' THEN 'failed' ELSE linkedin_status END,
    facebook_status = CASE WHEN status = 'posted' THEN 'posted' WHEN status = 'failed' THEN 'failed' ELSE facebook_status END;

CREATE OR REPLACE FUNCTION public.queue_social_post_on_article_approval()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  v_article_url text;
  v_existing_id uuid;
BEGIN
  IF NEW.status <> 'approved' OR (TG_OP = 'UPDATE' AND COALESCE(OLD.status, '') = 'approved') THEN
    RETURN NEW;
  END IF;

  v_article_url := 'https://jemassuremoinscher.fr/blog/' || NEW.slug;

  SELECT id INTO v_existing_id
  FROM public.linkedin_auto_posts
  WHERE article_slug = NEW.slug
  LIMIT 1;

  IF v_existing_id IS NULL THEN
    INSERT INTO public.linkedin_auto_posts (
      article_slug,
      article_title,
      article_url,
      image_url,
      post_content,
      provider,
      status,
      linkedin_status,
      facebook_status
    ) VALUES (
      NEW.slug,
      NEW.title,
      v_article_url,
      NULL,
      NEW.suggested_meta_description,
      'make',
      'pending',
      'pending',
      'pending'
    );
  END IF;

  PERFORM extensions.net.http_post(
    url := 'https://hook.eu1.make.com/swhr61xm1p2alnmmfrlif7af4ofd71o7',
    headers := jsonb_build_object('Content-Type', 'application/json'),
    body := jsonb_build_object(
      'event', 'article_inserted',
      'title', NEW.title,
      'url', v_article_url,
      'image_url', NULL,
      'slug', NEW.slug,
      'source', 'jemassuremoinscher.fr',
      'channels', jsonb_build_array('linkedin', 'facebook')
    )
  );

  RETURN NEW;
EXCEPTION WHEN invalid_schema_name OR undefined_function THEN
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_queue_social_post_on_article_approval ON public.seo_article_suggestions;
CREATE TRIGGER trg_queue_social_post_on_article_approval
AFTER INSERT OR UPDATE OF status ON public.seo_article_suggestions
FOR EACH ROW
EXECUTE FUNCTION public.queue_social_post_on_article_approval();