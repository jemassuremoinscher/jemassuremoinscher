REVOKE ALL ON FUNCTION public.queue_social_post_on_article_approval() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.queue_social_post_on_article_approval() FROM anon;
REVOKE ALL ON FUNCTION public.queue_social_post_on_article_approval() FROM authenticated;