-- Drop the broken policy that compares auth.uid() directly to sales_agents.id
DROP POLICY IF EXISTS "Agents can view their own redistributions" ON public.lead_redistribution_log;

-- Create corrected policy that joins through sales_agents
CREATE POLICY "Agents can view their own redistributions"
ON public.lead_redistribution_log
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.sales_agents sa
    WHERE sa.user_id = auth.uid()
    AND (sa.id = lead_redistribution_log.from_agent OR sa.id = lead_redistribution_log.to_agent)
  )
);