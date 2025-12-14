-- Fix 1: Drop overly permissive chatbot_transfers policies and add proper ones
DROP POLICY IF EXISTS "Authenticated users can view transfers" ON public.chatbot_transfers;
DROP POLICY IF EXISTS "Authenticated users can update transfers" ON public.chatbot_transfers;

CREATE POLICY "Admins can view all transfers"
ON public.chatbot_transfers
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Agents can view assigned transfers"
ON public.chatbot_transfers
FOR SELECT
USING (assigned_to = auth.uid());

CREATE POLICY "Admins can update transfers"
ON public.chatbot_transfers
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Agents can update assigned transfers"
ON public.chatbot_transfers
FOR UPDATE
USING (assigned_to = auth.uid());

-- Fix 2: Drop overly permissive agent_performance policy
-- SECURITY DEFINER triggers already bypass RLS, so this broad policy is unnecessary
DROP POLICY IF EXISTS "System can update performance" ON public.agent_performance;