-- Fix PUBLIC_DATA_EXPOSURE: Blog comment emails publicly accessible
-- Strategy: Update RLS to restrict public SELECT to non-email columns via a view

-- Step 1: Create a public view that excludes author_email
CREATE VIEW public.blog_comments_public AS
SELECT id, article_slug, author_name, content, status, created_at, updated_at
FROM public.blog_comments
WHERE status = 'approved';

-- Step 2: Grant public access to the view
GRANT SELECT ON public.blog_comments_public TO anon, authenticated;

-- Step 3: Drop the overly permissive SELECT policy
DROP POLICY IF EXISTS "Only approved comments are visible" ON public.blog_comments;

-- Step 4: Create new restrictive policies
-- Admins can view all comments (including emails for moderation)
CREATE POLICY "Admins can view all comments" 
ON public.blog_comments 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Step 5: Add policy for admins to update comments (for moderation)
CREATE POLICY "Admins can update comments" 
ON public.blog_comments 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Step 6: Add policy for admins to delete comments
CREATE POLICY "Admins can delete comments" 
ON public.blog_comments 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));