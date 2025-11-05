-- Table des objectifs mensuels
CREATE TABLE public.monthly_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID REFERENCES public.sales_agents(id) ON DELETE CASCADE NOT NULL,
  month DATE NOT NULL,
  goal_leads INTEGER NOT NULL DEFAULT 50,
  goal_conversions INTEGER NOT NULL DEFAULT 10,
  goal_revenue DECIMAL(10,2) DEFAULT 0,
  current_leads INTEGER NOT NULL DEFAULT 0,
  current_conversions INTEGER NOT NULL DEFAULT 0,
  current_revenue DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(agent_id, month)
);

-- Table des badges
CREATE TABLE public.achievement_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  category TEXT NOT NULL,
  requirement_type TEXT NOT NULL,
  requirement_value INTEGER NOT NULL,
  points INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table des badges obtenus
CREATE TABLE public.agent_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID REFERENCES public.sales_agents(id) ON DELETE CASCADE NOT NULL,
  badge_id UUID REFERENCES public.achievement_badges(id) ON DELETE CASCADE NOT NULL,
  earned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(agent_id, badge_id)
);

-- Index
CREATE INDEX idx_monthly_goals_agent ON public.monthly_goals(agent_id, month);
CREATE INDEX idx_agent_badges_agent ON public.agent_badges(agent_id);

-- Enable RLS
ALTER TABLE public.monthly_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievement_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_badges ENABLE ROW LEVEL SECURITY;

-- RLS Policies pour monthly_goals
CREATE POLICY "Admins can manage goals"
  ON public.monthly_goals
  FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Agents can view their own goals"
  ON public.monthly_goals
  FOR SELECT
  USING (
    agent_id IN (
      SELECT id FROM public.sales_agents WHERE user_id = auth.uid()
    )
  );

-- RLS Policies pour achievement_badges
CREATE POLICY "Everyone can view badges"
  ON public.achievement_badges
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage badges"
  ON public.achievement_badges
  FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies pour agent_badges
CREATE POLICY "Admins can view all agent badges"
  ON public.agent_badges
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Agents can view their own badges"
  ON public.agent_badges
  FOR SELECT
  USING (
    agent_id IN (
      SELECT id FROM public.sales_agents WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "System can award badges"
  ON public.agent_badges
  FOR INSERT
  WITH CHECK (true);

-- Fonction pour mettre à jour les objectifs mensuels
CREATE OR REPLACE FUNCTION public.update_monthly_goals()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  agent_id_var UUID;
  current_month DATE;
BEGIN
  -- Seulement si le statut change vers 'converted'
  IF NEW.status = 'converted' AND OLD.status != 'converted' THEN
    -- Récupérer l'ID du commercial
    SELECT id INTO agent_id_var
    FROM public.sales_agents
    WHERE user_id = NEW.assigned_to;
    
    IF agent_id_var IS NOT NULL THEN
      current_month := DATE_TRUNC('month', CURRENT_DATE);
      
      -- Mettre à jour ou créer l'objectif du mois
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
  -- Si un nouveau lead est assigné
  ELSIF NEW.assigned_to IS NOT NULL AND (OLD.assigned_to IS NULL OR OLD.assigned_to != NEW.assigned_to) THEN
    SELECT id INTO agent_id_var
    FROM public.sales_agents
    WHERE user_id = NEW.assigned_to;
    
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

CREATE TRIGGER trigger_update_monthly_goals
  AFTER INSERT OR UPDATE ON public.insurance_quotes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_monthly_goals();

-- Fonction pour vérifier et attribuer les badges
CREATE OR REPLACE FUNCTION public.check_and_award_badges()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  badge_record RECORD;
  agent_total_conversions INTEGER;
  agent_hot_leads INTEGER;
  agent_conversion_rate DECIMAL;
BEGIN
  -- Récupérer les stats de l'agent
  SELECT 
    SUM(converted_leads) as total_conversions,
    AVG(conversion_rate) as avg_rate
  INTO agent_total_conversions, agent_conversion_rate
  FROM public.agent_performance
  WHERE agent_id = NEW.agent_id;
  
  -- Parcourir tous les badges
  FOR badge_record IN 
    SELECT * FROM public.achievement_badges
  LOOP
    -- Vérifier si l'agent mérite ce badge
    IF badge_record.requirement_type = 'conversions' AND 
       agent_total_conversions >= badge_record.requirement_value THEN
      
      -- Attribuer le badge si pas déjà obtenu
      INSERT INTO public.agent_badges (agent_id, badge_id)
      VALUES (NEW.agent_id, badge_record.id)
      ON CONFLICT (agent_id, badge_id) DO NOTHING;
      
    ELSIF badge_record.requirement_type = 'conversion_rate' AND 
          agent_conversion_rate >= badge_record.requirement_value THEN
      
      INSERT INTO public.agent_badges (agent_id, badge_id)
      VALUES (NEW.agent_id, badge_record.id)
      ON CONFLICT (agent_id, badge_id) DO NOTHING;
      
    ELSIF badge_record.requirement_type = 'goal_achieved' AND 
          NEW.current_conversions >= NEW.goal_conversions THEN
      
      INSERT INTO public.agent_badges (agent_id, badge_id)
      VALUES (NEW.agent_id, badge_record.id)
      ON CONFLICT (agent_id, badge_id) DO NOTHING;
    END IF;
  END LOOP;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_check_badges_on_goal_update
  AFTER UPDATE ON public.monthly_goals
  FOR EACH ROW
  EXECUTE FUNCTION public.check_and_award_badges();

-- Insérer des badges par défaut
INSERT INTO public.achievement_badges (name, description, icon, category, requirement_type, requirement_value, points) VALUES
('Première Conversion', 'Réalisez votre première conversion', '🎯', 'milestone', 'conversions', 1, 10),
('Apprenti Vendeur', 'Atteignez 5 conversions', '📈', 'milestone', 'conversions', 5, 25),
('Vendeur Confirmé', 'Atteignez 10 conversions', '💼', 'milestone', 'conversions', 10, 50),
('Expert Commercial', 'Atteignez 25 conversions', '🏆', 'milestone', 'conversions', 25, 100),
('Maître Vendeur', 'Atteignez 50 conversions', '👑', 'milestone', 'conversions', 50, 250),
('Légende', 'Atteignez 100 conversions', '⭐', 'milestone', 'conversions', 100, 500),
('Efficace', 'Maintenez un taux de conversion de 30%+', '🎪', 'performance', 'conversion_rate', 30, 75),
('Redoutable', 'Maintenez un taux de conversion de 40%+', '🔥', 'performance', 'conversion_rate', 40, 150),
('Imbattable', 'Maintenez un taux de conversion de 50%+', '💎', 'performance', 'conversion_rate', 50, 300),
('Objectif Atteint', 'Atteignez votre objectif mensuel', '🎉', 'goal', 'goal_achieved', 1, 50),
('Surperformeur', 'Dépassez votre objectif de 150%', '🚀', 'goal', 'goal_exceeded', 150, 100);

-- Trigger pour les updated_at
CREATE TRIGGER update_monthly_goals_updated_at
  BEFORE UPDATE ON public.monthly_goals
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();