CREATE OR REPLACE FUNCTION public.generate_unique_seo_article_slug(_base_slug text, _exclude_id uuid DEFAULT NULL)
RETURNS text
LANGUAGE plpgsql
STABLE
SET search_path = public
AS $$
DECLARE
  v_base text;
  v_candidate text;
  v_suffix integer := 2;
BEGIN
  v_base := lower(coalesce(nullif(trim(_base_slug), ''), 'article'));
  v_base := translate(v_base, 'àáâãäåèéêëìíîïòóôõöùúûüçñ', 'aaaaaaeeeeiiiiooooouuuucn');
  v_base := regexp_replace(v_base, '[^a-z0-9]+', '-', 'g');
  v_base := regexp_replace(v_base, '(^-+|-+$)', '', 'g');
  v_base := coalesce(nullif(v_base, ''), 'article');
  v_candidate := v_base;

  WHILE EXISTS (
    SELECT 1
    FROM public.seo_article_suggestions
    WHERE slug = v_candidate
      AND (_exclude_id IS NULL OR id <> _exclude_id)
  ) LOOP
    v_candidate := v_base || '-' || v_suffix;
    v_suffix := v_suffix + 1;
  END LOOP;

  RETURN v_candidate;
END;
$$;

CREATE OR REPLACE FUNCTION public.ensure_unique_seo_article_slug()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.slug := public.generate_unique_seo_article_slug(NEW.slug, NEW.id);
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_ensure_unique_seo_article_slug ON public.seo_article_suggestions;
CREATE TRIGGER trg_ensure_unique_seo_article_slug
BEFORE INSERT OR UPDATE OF slug, status ON public.seo_article_suggestions
FOR EACH ROW
EXECUTE FUNCTION public.ensure_unique_seo_article_slug();

CREATE UNIQUE INDEX IF NOT EXISTS seo_article_suggestions_slug_unique_idx
ON public.seo_article_suggestions (slug);