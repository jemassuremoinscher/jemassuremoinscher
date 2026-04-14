
-- Drop overly permissive email_tracking policies
-- The Edge Function uses service role which bypasses RLS entirely
DROP POLICY IF EXISTS "Service role can insert email tracking" ON public.email_tracking;
DROP POLICY IF EXISTS "Service role can update email tracking" ON public.email_tracking;
