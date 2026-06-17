DROP POLICY IF EXISTS "Anyone can submit comments" ON public.blog_comments;
CREATE POLICY "Anyone can submit comments"
ON public.blog_comments FOR INSERT
WITH CHECK (status = 'pending');