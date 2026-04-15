-- Fix chatbot_transfers: agent policies use auth.uid() directly instead of sales_agents lookup
DROP POLICY IF EXISTS "Agents can view assigned transfers" ON public.chatbot_transfers;
DROP POLICY IF EXISTS "Agents can update assigned transfers" ON public.chatbot_transfers;

-- Corrected: join through sales_agents to resolve agent_id from user_id
CREATE POLICY "Agents can view assigned transfers"
ON public.chatbot_transfers
FOR SELECT
TO authenticated
USING (
  assigned_to IN (
    SELECT sa.id FROM public.sales_agents sa WHERE sa.user_id = auth.uid()
  )
);

CREATE POLICY "Agents can update assigned transfers"
ON public.chatbot_transfers
FOR UPDATE
TO authenticated
USING (
  assigned_to IN (
    SELECT sa.id FROM public.sales_agents sa WHERE sa.user_id = auth.uid()
  )
);

-- Also drop any remaining permissive email_tracking policies if they still exist
DROP POLICY IF EXISTS "Service role can insert email tracking" ON public.email_tracking;
DROP POLICY IF EXISTS "Service role can update email tracking" ON public.email_tracking;