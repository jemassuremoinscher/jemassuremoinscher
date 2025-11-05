-- Table des commerciaux
CREATE TABLE public.sales_agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  specializations TEXT[] DEFAULT '{}',
  max_daily_leads INTEGER NOT NULL DEFAULT 10,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table des performances des commerciaux
CREATE TABLE public.agent_performance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID REFERENCES public.sales_agents(id) ON DELETE CASCADE NOT NULL,
  insurance_type TEXT NOT NULL,
  total_leads INTEGER NOT NULL DEFAULT 0,
  converted_leads INTEGER NOT NULL DEFAULT 0,
  conversion_rate DECIMAL(5,2) GENERATED ALWAYS AS (
    CASE 
      WHEN total_leads > 0 THEN (converted_leads::DECIMAL / total_leads::DECIMAL * 100)
      ELSE 0
    END
  ) STORED,
  avg_conversion_time_days DECIMAL(5,1),
  last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Index pour optimiser les requêtes
CREATE INDEX idx_agent_performance_agent_id ON public.agent_performance(agent_id);
CREATE INDEX idx_agent_performance_insurance_type ON public.agent_performance(insurance_type);
CREATE INDEX idx_sales_agents_active ON public.sales_agents(is_active) WHERE is_active = true;

-- Enable RLS
ALTER TABLE public.sales_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_performance ENABLE ROW LEVEL SECURITY;

-- RLS Policies pour sales_agents
CREATE POLICY "Admins can manage sales agents"
  ON public.sales_agents
  FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Agents can view their own profile"
  ON public.sales_agents
  FOR SELECT
  USING (auth.uid() = user_id);

-- RLS Policies pour agent_performance
CREATE POLICY "Admins can view all performance"
  ON public.agent_performance
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Agents can view their own performance"
  ON public.agent_performance
  FOR SELECT
  USING (
    agent_id IN (
      SELECT id FROM public.sales_agents WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "System can update performance"
  ON public.agent_performance
  FOR ALL
  USING (true);

-- Fonction pour calculer la charge actuelle d'un commercial
CREATE OR REPLACE FUNCTION public.get_agent_current_load(p_agent_id UUID)
RETURNS INTEGER
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COUNT(*)::INTEGER
  FROM public.insurance_quotes
  WHERE assigned_to IN (
    SELECT user_id FROM public.sales_agents WHERE id = p_agent_id
  )
  AND status IN ('pending', 'contacted', 'qualified')
  AND created_at > CURRENT_DATE;
$$;

-- Fonction pour calculer le score d'attribution
CREATE OR REPLACE FUNCTION public.calculate_assignment_score(
  p_agent_id UUID,
  p_insurance_type TEXT,
  p_lead_score INTEGER
)
RETURNS DECIMAL
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  agent_load INTEGER;
  max_load INTEGER;
  specialization_bonus DECIMAL := 0;
  performance_score DECIMAL := 0;
  load_factor DECIMAL;
  final_score DECIMAL;
BEGIN
  -- Récupérer la charge actuelle et max
  SELECT 
    get_agent_current_load(p_agent_id),
    max_daily_leads
  INTO agent_load, max_load
  FROM public.sales_agents
  WHERE id = p_agent_id;
  
  -- Si le commercial a atteint sa charge max, score = 0
  IF agent_load >= max_load THEN
    RETURN 0;
  END IF;
  
  -- Facteur de charge (plus la charge est faible, meilleur le score)
  load_factor := 1 - (agent_load::DECIMAL / max_load::DECIMAL);
  
  -- Bonus de spécialisation (+30% si spécialisé dans ce type)
  SELECT 
    CASE 
      WHEN p_insurance_type = ANY(specializations) THEN 0.3
      ELSE 0
    END
  INTO specialization_bonus
  FROM public.sales_agents
  WHERE id = p_agent_id;
  
  -- Score de performance (taux de conversion pour ce type d'assurance)
  SELECT COALESCE(conversion_rate / 100, 0.2)
  INTO performance_score
  FROM public.agent_performance
  WHERE agent_id = p_agent_id
    AND insurance_type = p_insurance_type;
  
  -- Si pas de données de performance, score par défaut de 0.2
  IF performance_score IS NULL THEN
    performance_score := 0.2;
  END IF;
  
  -- Calcul du score final (pondération: charge 40%, spécialisation 30%, performance 30%)
  final_score := (load_factor * 0.4) + (specialization_bonus) + (performance_score * 0.3);
  
  -- Bonus pour les leads chauds si l'agent a un bon taux de conversion
  IF p_lead_score >= 80 AND performance_score > 0.4 THEN
    final_score := final_score * 1.2;
  END IF;
  
  RETURN final_score;
END;
$$;

-- Fonction pour assigner automatiquement un lead au meilleur commercial
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
BEGIN
  -- Ne rien faire si déjà assigné
  IF NEW.assigned_to IS NOT NULL THEN
    RETURN NEW;
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
  
  -- Assigner au meilleur commercial
  IF best_agent_user_id IS NOT NULL THEN
    NEW.assigned_to := best_agent_user_id;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Trigger pour l'auto-attribution sur les nouveaux devis
CREATE TRIGGER trigger_auto_assign_quote
  BEFORE INSERT ON public.insurance_quotes
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_assign_lead();

-- Trigger pour l'auto-attribution sur les demandes de rappel
CREATE OR REPLACE FUNCTION public.auto_assign_callback()
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
BEGIN
  -- Ne rien faire si déjà assigné
  IF NEW.assigned_to IS NOT NULL THEN
    RETURN NEW;
  END IF;
  
  -- Pour les callbacks, on prend le commercial avec la charge la plus faible
  SELECT user_id INTO best_agent_user_id
  FROM public.sales_agents sa
  WHERE is_active = true
  ORDER BY get_agent_current_load(sa.id) ASC
  LIMIT 1;
  
  -- Assigner au commercial
  IF best_agent_user_id IS NOT NULL THEN
    NEW.assigned_to := best_agent_user_id;
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_auto_assign_callback
  BEFORE INSERT ON public.contact_callbacks
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_assign_callback();

-- Fonction pour mettre à jour les performances quand un lead est converti
CREATE OR REPLACE FUNCTION public.update_agent_performance()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  agent_id_var UUID;
  conversion_time_days DECIMAL;
BEGIN
  -- Seulement si le statut change vers 'converted' ou 'rejected'
  IF NEW.status IN ('converted', 'rejected') AND OLD.status NOT IN ('converted', 'rejected') THEN
    -- Récupérer l'ID du commercial
    SELECT id INTO agent_id_var
    FROM public.sales_agents
    WHERE user_id = NEW.assigned_to;
    
    IF agent_id_var IS NOT NULL THEN
      -- Calculer le temps de conversion
      conversion_time_days := EXTRACT(EPOCH FROM (NOW() - NEW.created_at)) / 86400;
      
      -- Mettre à jour ou insérer les performances
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

-- Contrainte unique pour agent_performance
ALTER TABLE public.agent_performance ADD CONSTRAINT unique_agent_insurance UNIQUE (agent_id, insurance_type);

CREATE TRIGGER trigger_update_performance_quotes
  AFTER UPDATE ON public.insurance_quotes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_agent_performance();

-- Trigger pour les updated_at
CREATE TRIGGER update_sales_agents_updated_at
  BEFORE UPDATE ON public.sales_agents
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();