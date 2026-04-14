
-- =============================================
-- 1. Restrict Realtime channel subscriptions to admins only
-- =============================================
CREATE POLICY "Only admins can subscribe to realtime channels"
ON realtime.messages
FOR SELECT
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin'::public.app_role)
);

-- =============================================
-- 2. Agents can read their own assigned insurance quotes
-- =============================================
CREATE POLICY "Agents can view their assigned quotes"
ON public.insurance_quotes
FOR SELECT
TO authenticated
USING (
  assigned_to IN (
    SELECT id FROM public.sales_agents WHERE user_id = auth.uid()
  )
);

-- =============================================
-- 3. Agents can read their own assigned contact callbacks
-- =============================================
CREATE POLICY "Agents can view their assigned callbacks"
ON public.contact_callbacks
FOR SELECT
TO authenticated
USING (
  assigned_to IN (
    SELECT id FROM public.sales_agents WHERE user_id = auth.uid()
  )
);
