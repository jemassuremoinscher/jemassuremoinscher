-- Drop the overly permissive INSERT policy on agent_badges
DROP POLICY IF EXISTS "System can award badges" ON public.agent_badges;

-- Add admin-only management policy for agent_badges
CREATE POLICY "Admins can manage agent badges"
  ON public.agent_badges
  FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
