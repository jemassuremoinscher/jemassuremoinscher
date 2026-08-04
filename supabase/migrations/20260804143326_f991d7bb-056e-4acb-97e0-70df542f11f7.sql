CREATE OR REPLACE FUNCTION public.auto_assign_lead()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  best_agent_id UUID;
  best_score DECIMAL := 0;
  current_score DECIMAL;
  agent_record RECORD;
  original_assigned_agent UUID;
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Never trust a client-provided assignment. Assignment is decided server-side.
    NEW.assigned_to := NULL;
  ELSIF OLD.assigned_to IS NOT NULL AND NEW.status = 'pending' THEN
    original_assigned_agent := OLD.assigned_to;
  END IF;

  FOR agent_record IN
    SELECT id
    FROM public.sales_agents
    WHERE is_active = true
  LOOP
    current_score := public.calculate_assignment_score(
      agent_record.id,
      NEW.insurance_type,
      COALESCE(NEW.lead_score, 50)
    );

    IF current_score > best_score THEN
      best_score := current_score;
      best_agent_id := agent_record.id;
    END IF;
  END LOOP;

  IF best_agent_id IS NOT NULL THEN
    IF original_assigned_agent IS NOT NULL AND original_assigned_agent != best_agent_id THEN
      INSERT INTO public.lead_redistribution_log (
        lead_id, lead_type, from_agent, to_agent, reason, created_at
      ) VALUES (
        NEW.id, 'insurance_quote', original_assigned_agent, best_agent_id,
        'Agent saturé - redistribution automatique', NOW()
      );
    END IF;
    NEW.assigned_to := best_agent_id;
  ELSE
    NEW.assigned_to := NULL;
    NEW.status := 'pending';
  END IF;

  RETURN NEW;
END;
$$;

DROP POLICY IF EXISTS "Anyone can request quotes" ON public.insurance_quotes;
CREATE POLICY "Anyone can request quotes"
ON public.insurance_quotes
FOR INSERT
TO public
WITH CHECK (
  status = 'pending'
  AND signed_before_hot IS NOT TRUE
  AND deleted_at IS NULL
  AND last_contacted_at IS NULL
  AND next_follow_up IS NULL
  AND notes IS NULL
  AND (lead_score IS NULL OR lead_score BETWEEN 0 AND 100)
  AND (
    assigned_to IS NULL
    OR EXISTS (
      SELECT 1
      FROM public.sales_agents sa
      WHERE sa.id = assigned_to
        AND sa.is_active = true
    )
  )
);