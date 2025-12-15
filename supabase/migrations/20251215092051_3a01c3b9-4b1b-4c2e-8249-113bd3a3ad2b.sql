-- Fix PUBLIC_DATA_EXPOSURE: Email tracking overly permissive policies
-- Drop the overly permissive policies - service role bypasses RLS anyway
DROP POLICY IF EXISTS "Service role can insert email tracking" ON public.email_tracking;
DROP POLICY IF EXISTS "Service role can update email tracking" ON public.email_tracking;