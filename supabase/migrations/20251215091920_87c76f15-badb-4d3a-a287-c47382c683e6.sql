-- Fix SECURITY DEFINER view warning by recreating as SECURITY INVOKER
DROP VIEW IF EXISTS public.blog_comments_public;

CREATE VIEW public.blog_comments_public 
WITH (security_invoker = true) AS
SELECT id, article_slug, author_name, content, status, created_at, updated_at
FROM public.blog_comments
WHERE status = 'approved';

-- Re-grant public access
GRANT SELECT ON public.blog_comments_public TO anon, authenticated;