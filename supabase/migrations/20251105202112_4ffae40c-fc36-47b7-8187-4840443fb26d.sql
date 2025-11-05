-- Créer une table pour logger les redistributions
CREATE TABLE IF NOT EXISTS public.lead_redistribution_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL,
  lead_type TEXT NOT NULL,
  from_agent UUID REFERENCES auth.users(id),
  to_agent UUID REFERENCES auth.users(id),
  reason TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Index pour optimiser les requêtes
CREATE INDEX IF NOT EXISTS idx_lead_redistribution_log_created_at 
  ON public.lead_redistribution_log(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_lead_redistribution_log_agents 
  ON public.lead_redistribution_log(from_agent, to_agent);

-- Enable RLS
ALTER TABLE public.lead_redistribution_log ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Admins can view redistribution log" ON public.lead_redistribution_log;
DROP POLICY IF EXISTS "Agents can view their own redistributions" ON public.lead_redistribution_log;

-- RLS Policies
CREATE POLICY "Admins can view redistribution log"
  ON public.lead_redistribution_log
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Agents can view their own redistributions"
  ON public.lead_redistribution_log
  FOR SELECT
  USING (
    from_agent = auth.uid() OR to_agent = auth.uid()
  );

-- Améliorer la fonction d'auto-attribution pour gérer la redistribution
CREATE OR REPLACE FUNCTION public.auto_assign_lead()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  best_agent_user_id UUID;
  best_score DECIMAL := 0;
  current_score DECIMAL;
  agent_record RECORD;
  original_assigned_agent UUID;
BEGIN
  -- Si déjà assigné et qu'on ne force pas le réassignement, ne rien faire
  IF NEW.assigned_to IS NOT NULL AND TG_OP = 'INSERT' THEN
    RETURN NEW;
  END IF;

  -- Si UPDATE et le lead passe en "pending", on peut réassigner
  IF TG_OP = 'UPDATE' AND OLD.assigned_to IS NOT NULL AND NEW.status = 'pending' THEN
    original_assigned_agent := OLD.assigned_to;
  END IF;
  
  -- Parcourir tous les commerciaux actifs
  FOR agent_record IN 
    SELECT id, user_id 
    FROM public.sales_agents 
    WHERE is_active = true
  LOOP
    -- Calculer le score pour ce commercial
    current_score := calculate_assignment_score(
      agent_record.id,
      NEW.insurance_type,
      COALESCE(NEW.lead_score, 50)
    );
    
    -- Garder le meilleur score
    IF current_score > best_score THEN
      best_score := current_score;
      best_agent_user_id := agent_record.user_id;
    END IF;
  END LOOP;
  
  -- Si on a trouvé un agent disponible
  IF best_agent_user_id IS NOT NULL THEN
    -- Si l'agent est différent de l'original (redistribution)
    IF original_assigned_agent IS NOT NULL AND original_assigned_agent != best_agent_user_id THEN
      -- Logger la redistribution
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
        best_agent_user_id,
        'Agent saturé - redistribution automatique',
        NOW()
      );
    END IF;
    
    NEW.assigned_to := best_agent_user_id;
  ELSE
    -- Aucun agent disponible, mettre en file d'attente
    NEW.assigned_to := NULL;
    NEW.status := 'pending';
  END IF;
  
  RETURN NEW;
END;
$$;

-- Fonction pour réassigner automatiquement les leads en attente
CREATE OR REPLACE FUNCTION public.reassign_pending_leads()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  reassigned_count INTEGER := 0;
  lead_record RECORD;
  new_agent UUID;
  best_score DECIMAL;
  current_score DECIMAL;
  agent_record RECORD;
BEGIN
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
$$;

-- Fonction similaire pour les callbacks
CREATE OR REPLACE FUNCTION public.auto_assign_callback()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  best_agent_user_id UUID;
  original_assigned_agent UUID;
BEGIN
  -- Si déjà assigné et qu'on ne force pas le réassignement
  IF NEW.assigned_to IS NOT NULL AND TG_OP = 'INSERT' THEN
    RETURN NEW;
  END IF;

  -- Si UPDATE et redistribution
  IF TG_OP = 'UPDATE' AND OLD.assigned_to IS NOT NULL AND NEW.status = 'pending' THEN
    original_assigned_agent := OLD.assigned_to;
  END IF;
  
  -- Trouver l'agent avec la charge la plus faible
  SELECT user_id INTO best_agent_user_id
  FROM public.sales_agents sa
  WHERE is_active = true
  ORDER BY get_agent_current_load(sa.id) ASC
  LIMIT 1;
  
  IF best_agent_user_id IS NOT NULL THEN
    -- Logger si redistribution
    IF original_assigned_agent IS NOT NULL AND original_assigned_agent != best_agent_user_id THEN
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
        best_agent_user_id,
        'Agent saturé - redistribution automatique',
        NOW()
      );
    END IF;
    
    NEW.assigned_to := best_agent_user_id;
  END IF;
  
  RETURN NEW;
END;
$$;