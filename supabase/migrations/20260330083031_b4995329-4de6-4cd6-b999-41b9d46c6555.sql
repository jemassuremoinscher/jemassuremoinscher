-- Align assigned_to to sales_agents.id (assignable agents without auth accounts)
-- 1) Convert legacy auth.users assignments to sales_agents.id when possible
UPDATE public.insurance_quotes q
SET assigned_to = sa.id
FROM public.sales_agents sa
WHERE sa.user_id IS NOT NULL
  AND q.assigned_to = sa.user_id;

UPDATE public.contact_callbacks c
SET assigned_to = sa.id
FROM public.sales_agents sa
WHERE sa.user_id IS NOT NULL
  AND c.assigned_to = sa.user_id;

-- 2) Clear orphan assignments before changing FK
UPDATE public.insurance_quotes q
SET assigned_to = NULL
WHERE assigned_to IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM public.sales_agents sa WHERE sa.id = q.assigned_to
  );

UPDATE public.contact_callbacks c
SET assigned_to = NULL
WHERE assigned_to IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM public.sales_agents sa WHERE sa.id = c.assigned_to
  );

-- 3) Replace foreign keys to reference sales_agents(id)
ALTER TABLE public.insurance_quotes
  DROP CONSTRAINT IF EXISTS insurance_quotes_assigned_to_fkey;

ALTER TABLE public.contact_callbacks
  DROP CONSTRAINT IF EXISTS contact_callbacks_assigned_to_fkey;

ALTER TABLE public.insurance_quotes
  ADD CONSTRAINT insurance_quotes_assigned_to_fkey
  FOREIGN KEY (assigned_to)
  REFERENCES public.sales_agents(id)
  ON DELETE SET NULL;

ALTER TABLE public.contact_callbacks
  ADD CONSTRAINT contact_callbacks_assigned_to_fkey
  FOREIGN KEY (assigned_to)
  REFERENCES public.sales_agents(id)
  ON DELETE SET NULL;

-- 4) Update helper and assignment functions to work with sales_agents.id in assigned_to
CREATE OR REPLACE FUNCTION public.get_agent_current_load(p_agent_id uuid)
RETURNS integer
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT COUNT(*)::INTEGER
  FROM public.insurance_quotes
  WHERE assigned_to = p_agent_id
    AND status IN ('pending', 'contacted')
    AND created_at > CURRENT_DATE;
$$;

CREATE OR REPLACE FUNCTION public.auto_assign_lead()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  best_agent_id UUID;
  best_score DECIMAL := 0;
  current_score DECIMAL;
  agent_record RECORD;
  original_assigned_agent UUID;
BEGIN
  IF NEW.assigned_to IS NOT NULL AND TG_OP = 'INSERT' THEN
    RETURN NEW;
  END IF;

  IF TG_OP = 'UPDATE' AND OLD.assigned_to IS NOT NULL AND NEW.status = 'pending' THEN
    original_assigned_agent := OLD.assigned_to;
  END IF;

  FOR agent_record IN
    SELECT id
    FROM public.sales_agents
    WHERE is_active = true
  LOOP
    current_score := calculate_assignment_score(
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
        lead_id,
        lead_type,
        from_agent,
        to_agent,
        reason,
        created_at
      ) VALUES (
        NEW.id,
        'insurance_quote',
        original_assigned_agent,
        best_agent_id,
        'Agent saturé - redistribution automatique',
        NOW()
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

CREATE OR REPLACE FUNCTION public.auto_assign_callback()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  best_agent_id UUID;
  original_assigned_agent UUID;
BEGIN
  IF NEW.assigned_to IS NOT NULL AND TG_OP = 'INSERT' THEN
    RETURN NEW;
  END IF;

  IF TG_OP = 'UPDATE' AND OLD.assigned_to IS NOT NULL AND NEW.status = 'pending' THEN
    original_assigned_agent := OLD.assigned_to;
  END IF;

  SELECT sa.id INTO best_agent_id
  FROM public.sales_agents sa
  WHERE sa.is_active = true
  ORDER BY get_agent_current_load(sa.id) ASC
  LIMIT 1;

  IF best_agent_id IS NOT NULL THEN
    IF original_assigned_agent IS NOT NULL AND original_assigned_agent != best_agent_id THEN
      INSERT INTO public.lead_redistribution_log (
        lead_id,
        lead_type,
        from_agent,
        to_agent,
        reason,
        created_at
      ) VALUES (
        NEW.id,
        'contact_callback',
        original_assigned_agent,
        best_agent_id,
        'Agent saturé - redistribution automatique',
        NOW()
      );
    END IF;

    NEW.assigned_to := best_agent_id;
  END IF;

  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.reassign_pending_leads()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  reassigned_count INTEGER := 0;
  lead_record RECORD;
  new_agent UUID;
  best_score DECIMAL;
  current_score DECIMAL;
  agent_record RECORD;
BEGIN
  IF NOT has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'Unauthorized: admin role required';
  END IF;

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

    FOR agent_record IN
      SELECT id
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
        new_agent := agent_record.id;
      END IF;
    END LOOP;

    IF new_agent IS NOT NULL THEN
      UPDATE public.insurance_quotes
      SET assigned_to = new_agent
      WHERE id = lead_record.id;

      reassigned_count := reassigned_count + 1;
    END IF;
  END LOOP;

  RETURN reassigned_count;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_monthly_goals()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  agent_id_var UUID;
  current_month DATE;
BEGIN
  IF NEW.assigned_to IS NOT NULL THEN
    SELECT id INTO agent_id_var
    FROM public.sales_agents
    WHERE id = NEW.assigned_to;
  END IF;

  IF NEW.status = 'converted' AND OLD.status != 'converted' THEN
    IF agent_id_var IS NOT NULL THEN
      current_month := DATE_TRUNC('month', CURRENT_DATE);

      INSERT INTO public.monthly_goals (
        agent_id,
        month,
        current_leads,
        current_conversions
      )
      VALUES (
        agent_id_var,
        current_month,
        1,
        1
      )
      ON CONFLICT (agent_id, month)
      DO UPDATE SET
        current_leads = monthly_goals.current_leads + 1,
        current_conversions = monthly_goals.current_conversions + 1,
        updated_at = NOW();
    END IF;
  ELSIF NEW.assigned_to IS NOT NULL AND (OLD.assigned_to IS NULL OR OLD.assigned_to != NEW.assigned_to) THEN
    IF agent_id_var IS NOT NULL THEN
      current_month := DATE_TRUNC('month', CURRENT_DATE);

      INSERT INTO public.monthly_goals (
        agent_id,
        month,
        current_leads
      )
      VALUES (
        agent_id_var,
        current_month,
        1
      )
      ON CONFLICT (agent_id, month)
      DO UPDATE SET
        current_leads = monthly_goals.current_leads + 1,
        updated_at = NOW();
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_agent_performance()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  agent_id_var UUID;
  conversion_time_days DECIMAL;
BEGIN
  IF NEW.status IN ('converted', 'rejected') AND OLD.status NOT IN ('converted', 'rejected') THEN
    SELECT id INTO agent_id_var
    FROM public.sales_agents
    WHERE id = NEW.assigned_to;

    IF agent_id_var IS NOT NULL THEN
      conversion_time_days := EXTRACT(EPOCH FROM (NOW() - NEW.created_at)) / 86400;

      INSERT INTO public.agent_performance (
        agent_id,
        insurance_type,
        total_leads,
        converted_leads,
        avg_conversion_time_days,
        last_updated
      )
      VALUES (
        agent_id_var,
        NEW.insurance_type,
        1,
        CASE WHEN NEW.status = 'converted' THEN 1 ELSE 0 END,
        CASE WHEN NEW.status = 'converted' THEN conversion_time_days ELSE NULL END,
        NOW()
      )
      ON CONFLICT (agent_id, insurance_type)
      DO UPDATE SET
        total_leads = agent_performance.total_leads + 1,
        converted_leads = agent_performance.converted_leads + CASE WHEN NEW.status = 'converted' THEN 1 ELSE 0 END,
        avg_conversion_time_days = CASE
          WHEN NEW.status = 'converted' THEN
            COALESCE(
              (agent_performance.avg_conversion_time_days * agent_performance.converted_leads + conversion_time_days)
              / (agent_performance.converted_leads + 1),
              conversion_time_days
            )
          ELSE agent_performance.avg_conversion_time_days
        END,
        last_updated = NOW();
    END IF;
  END IF;

  RETURN NEW;
END;
$$;