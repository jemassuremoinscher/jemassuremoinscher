CREATE OR REPLACE FUNCTION public.queue_social_post_on_article_approval()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, net
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
  v_payload := jsonb_build_object(
    'event', 'article_inserted',
    'title', NEW.title,
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