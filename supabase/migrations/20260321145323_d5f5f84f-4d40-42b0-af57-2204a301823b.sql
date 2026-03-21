
CREATE TABLE public.seo_article_suggestions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  target_keyword TEXT NOT NULL,
  gsc_position NUMERIC,
  gsc_impressions INTEGER,
  gsc_clicks INTEGER,
  suggested_content TEXT NOT NULL,
  suggested_meta_description TEXT,
  suggested_author TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID REFERENCES auth.users(id)
);

ALTER TABLE public.seo_article_suggestions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage SEO suggestions"
ON public.seo_article_suggestions
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));
