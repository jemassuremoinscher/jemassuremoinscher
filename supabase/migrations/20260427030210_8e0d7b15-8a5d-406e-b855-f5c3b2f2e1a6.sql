CREATE OR REPLACE FUNCTION public.queue_social_post_on_article_approval()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'extensions'
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

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_queue_social_post_on_article_approval ON public.seo_article_suggestions;
CREATE TRIGGER trg_queue_social_post_on_article_approval
AFTER INSERT OR UPDATE OF status ON public.seo_article_suggestions
FOR EACH ROW
EXECUTE FUNCTION public.queue_social_post_on_article_approval();

UPDATE public.linkedin_config
SET webhook_url = 'https://hook.eu1.make.com/swhr61xm1p2alnmmfrlif7af4ofd71o7',
    provider = 'make',
    is_active = true,
    linkedin_enabled = true,
    facebook_enabled = true;

INSERT INTO public.linkedin_config (webhook_url, provider, is_active, linkedin_enabled, facebook_enabled)
SELECT 'https://hook.eu1.make.com/swhr61xm1p2alnmmfrlif7af4ofd71o7', 'make', true, true, true
WHERE NOT EXISTS (SELECT 1 FROM public.linkedin_config);