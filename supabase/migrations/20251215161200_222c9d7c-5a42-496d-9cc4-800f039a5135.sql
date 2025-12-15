-- Remove public UPDATE policy since all operations now use Edge Function with service role
DROP POLICY IF EXISTS "Users can update via confirmation token" ON public.newsletter_subscribers;

-- Add admin-only update policy for manual management if needed
CREATE POLICY "Admins can update subscribers"
ON public.newsletter_subscribers
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));