-- Restrict public exposure of internal user UUID on published_drafts
REVOKE SELECT (published_by) ON public.published_drafts FROM anon;
REVOKE SELECT (published_by) ON public.published_drafts FROM authenticated;