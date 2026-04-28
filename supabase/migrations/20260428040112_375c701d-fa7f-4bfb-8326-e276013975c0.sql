ALTER TABLE public.seo_article_suggestions
ADD COLUMN IF NOT EXISTS short_description TEXT;

ALTER TABLE public.linkedin_auto_posts
ADD COLUMN IF NOT EXISTS short_description TEXT;

CREATE OR REPLACE FUNCTION public.build_social_short_description(_title text, _meta text DEFAULT NULL, _content text DEFAULT NULL)
RETURNS text
LANGUAGE plpgsql
IMMUTABLE
SET search_path TO 'public'
AS $$
DECLARE
  base text;
BEGIN
  base := COALESCE(NULLIF(trim(_meta), ''), NULLIF(trim(_content), ''), NULLIF(trim(_title), ''), 'Nouvel article assurance à découvrir.');
  base := regexp_replace(base, '^#+\s*', '');
  base := regexp_replace(base, '\s+', ' ', 'g');
  base := trim(base);

  IF length(base) > 210 THEN
    base := trim(substring(base from 1 for 207)) || '...';
  END IF;

  RETURN '🛡️ ' || base;
END;
$$;

UPDATE public.seo_article_suggestions
SET short_description = public.build_social_short_description(title, suggested_meta_description, suggested_content)
WHERE short_description IS NULL OR trim(short_description) = '';

UPDATE public.linkedin_auto_posts lap
SET short_description = COALESCE(
  NULLIF(lap.short_description, ''),
  sas.short_description,
  public.build_social_short_description(lap.article_title, lap.post_content, NULL)
)
FROM public.seo_article_suggestions sas
WHERE lap.article_slug = sas.slug
  AND (lap.short_description IS NULL OR trim(lap.short_description) = '');

UPDATE public.linkedin_auto_posts
SET short_description = public.build_social_short_description(article_title, post_content, NULL)
WHERE short_description IS NULL OR trim(short_description) = '';

CREATE OR REPLACE FUNCTION public.queue_social_post_on_article_approval()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'net'
AS $$
DECLARE
  v_article_url text;
  v_image_url text := NULL;
  v_webhook_url text;
  v_is_active boolean;
  v_linkedin_enabled boolean;
  v_facebook_enabled boolean;
  v_existing_id uuid;
  v_request_id bigint;
  v_payload jsonb;
  v_channels jsonb := '[]'::jsonb;
  v_short_description text;
BEGIN
  IF NEW.status <> 'approved' OR (TG_OP = 'UPDATE' AND COALESCE(OLD.status, '') = 'approved') THEN
    RETURN NEW;
  END IF;

  SELECT webhook_url, is_active, linkedin_enabled, facebook_enabled
  INTO v_webhook_url, v_is_active, v_linkedin_enabled, v_facebook_enabled
  FROM public.linkedin_config
  ORDER BY created_at ASC
  LIMIT 1;

  v_webhook_url := COALESCE(NULLIF(v_webhook_url, ''), 'https://hook.eu1.make.com/swhr61xm1p2alnmmfrlif7af4ofd71o7');
  v_is_active := COALESCE(v_is_active, true);
  v_linkedin_enabled := COALESCE(v_linkedin_enabled, true);
  v_facebook_enabled := COALESCE(v_facebook_enabled, true);

  IF NOT v_is_active THEN
    RETURN NEW;
  END IF;

  IF v_linkedin_enabled THEN
    v_channels := v_channels || jsonb_build_array('linkedin');
  END IF;
  IF v_facebook_enabled THEN
    v_channels := v_channels || jsonb_build_array('facebook');
  END IF;

  v_article_url := 'https://www.jemassuremoinscher.fr/blog/' || NEW.slug;
  v_short_description := COALESCE(NULLIF(NEW.short_description, ''), public.build_social_short_description(NEW.title, NEW.suggested_meta_description, NEW.suggested_content));

  v_payload := jsonb_build_object(
    'event', 'article_inserted',
    'title', NEW.title,
    'short_description', v_short_description,
    'url', v_article_url,
    'article_url', v_article_url,
    'image_url', v_image_url,
    'slug', NEW.slug,
    'channels', v_channels,
    'provider', 'make',
    'source', 'jemassuremoinscher.fr',
    'posted_at', now()
  );

  SELECT id INTO v_existing_id
  FROM public.linkedin_auto_posts
  WHERE article_slug = NEW.slug
  LIMIT 1;

  SELECT net.http_post(
    url := v_webhook_url,
    headers := jsonb_build_object('Content-Type', 'application/json'),
    body := v_payload,
    timeout_milliseconds := 5000
  ) INTO v_request_id;

  IF v_existing_id IS NULL THEN
    INSERT INTO public.linkedin_auto_posts (
      article_slug,
      article_title,
      article_url,
      image_url,
      short_description,
      post_content,
      provider,
      status,
      linkedin_status,
      facebook_status,
      posted_at,
      error_message,
      response_payload
    ) VALUES (
      NEW.slug,
      NEW.title,
      v_article_url,
      v_image_url,
      v_short_description,
      NEW.suggested_meta_description,
      'make',
      'posted',
      CASE WHEN v_linkedin_enabled THEN 'posted' ELSE 'disabled' END,
      CASE WHEN v_facebook_enabled THEN 'posted' ELSE 'disabled' END,
      now(),
      NULL,
      jsonb_build_object('make_request_id', v_request_id, 'delivery', 'queued_by_database', 'payload', v_payload)
    );
  ELSE
    UPDATE public.linkedin_auto_posts
    SET article_title = NEW.title,
        article_url = v_article_url,
        image_url = v_image_url,
        short_description = v_short_description,
        post_content = COALESCE(post_content, NEW.suggested_meta_description),
        provider = 'make',
        status = 'posted',
        linkedin_status = CASE WHEN v_linkedin_enabled THEN 'posted' ELSE 'disabled' END,
        facebook_status = CASE WHEN v_facebook_enabled THEN 'posted' ELSE 'disabled' END,
        posted_at = now(),
        error_message = NULL,
        response_payload = jsonb_build_object('make_request_id', v_request_id, 'delivery', 'queued_by_database', 'payload', v_payload)
    WHERE id = v_existing_id;
  END IF;

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  INSERT INTO public.linkedin_auto_posts (
    article_slug,
    article_title,
    article_url,
    image_url,
    short_description,
    post_content,
    provider,
    status,
    linkedin_status,
    facebook_status,
    error_message,
    response_payload
  ) VALUES (
    NEW.slug,
    NEW.title,
    COALESCE(v_article_url, 'https://www.jemassuremoinscher.fr/blog/' || NEW.slug),
    v_image_url,
    COALESCE(v_short_description, public.build_social_short_description(NEW.title, NEW.suggested_meta_description, NEW.suggested_content)),
    NEW.suggested_meta_description,
    'make',
    'failed',
    'failed',
    'failed',
    SQLERRM,
    jsonb_build_object('delivery', 'database_trigger_failed')
  )
  ON CONFLICT DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_queue_social_post_on_article_approval ON public.seo_article_suggestions;
CREATE TRIGGER trg_queue_social_post_on_article_approval
AFTER INSERT OR UPDATE OF status ON public.seo_article_suggestions
FOR EACH ROW
EXECUTE FUNCTION public.queue_social_post_on_article_approval();