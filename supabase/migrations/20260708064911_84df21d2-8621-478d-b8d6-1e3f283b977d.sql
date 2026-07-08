GRANT SELECT ON public.seo_article_suggestions TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.seo_article_suggestions TO authenticated;
GRANT ALL ON public.seo_article_suggestions TO service_role;