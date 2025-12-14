-- Fix SECURITY DEFINER function to require admin role
CREATE OR REPLACE FUNCTION public.reassign_pending_leads()
 RETURNS integer
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  reassigned_count INTEGER := 0;
  lead_record RECORD;
  new_agent UUID;
  best_score DECIMAL;
  current_score DECIMAL;
  agent_record RECORD;
BEGIN
  -- CRITICAL: Verify admin role before allowing redistribution
  IF NOT has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'Unauthorized: admin role required';
  END IF;

  -- Parcourir tous les leads en attente sans agent
  FOR lead_record IN 
    SELECT id, insurance_type, lead_score 
    FROM public.insurance_quotes
    WHERE status = 'pending' 
      AND assigned_to IS NULL
      AND deleted_at IS NULL
    ORDER BY lead_score DESC, created_at ASC
    LIMIT 50
  LOOP
    best_score := 0;
    new_agent := NULL;
    
    -- Trouver le meilleur agent pour ce lead
    FOR agent_record IN 
      SELECT id, user_id 
      FROM public.sales_agents 
      WHERE is_active = true
    LOOP
      current_score := calculate_assignment_score(
        agent_record.id,
        lead_record.insurance_type,
        COALESCE(lead_record.lead_score, 50)
      );
      
      IF current_score > best_score THEN
        best_score := current_score;
        new_agent := agent_record.user_id;
      END IF;
    END LOOP;
    
    -- Assigner si un agent est disponible
    IF new_agent IS NOT NULL THEN
      UPDATE public.insurance_quotes
      SET assigned_to = new_agent
      WHERE id = lead_record.id;
      
      reassigned_count := reassigned_count + 1;
    END IF;
  END LOOP;
  
  RETURN reassigned_count;
END;
$function$;