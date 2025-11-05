-- Add CRM fields to insurance_quotes
ALTER TABLE public.insurance_quotes
ADD COLUMN IF NOT EXISTS lead_score INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS lead_source TEXT DEFAULT 'website',
ADD COLUMN IF NOT EXISTS assigned_to UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS last_contacted_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS next_follow_up TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS notes TEXT;

-- Add CRM fields to contact_callbacks
ALTER TABLE public.contact_callbacks
ADD COLUMN IF NOT EXISTS lead_score INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS lead_source TEXT DEFAULT 'website',
ADD COLUMN IF NOT EXISTS assigned_to UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS last_contacted_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS next_follow_up TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS notes TEXT;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_quotes_lead_score ON public.insurance_quotes(lead_score DESC);
CREATE INDEX IF NOT EXISTS idx_callbacks_lead_score ON public.contact_callbacks(lead_score DESC);
CREATE INDEX IF NOT EXISTS idx_quotes_assigned_to ON public.insurance_quotes(assigned_to);
CREATE INDEX IF NOT EXISTS idx_callbacks_assigned_to ON public.contact_callbacks(assigned_to);

-- Create function to auto-calculate lead score for insurance_quotes
CREATE OR REPLACE FUNCTION calculate_lead_score_quotes()
RETURNS TRIGGER AS $$
DECLARE
  score INTEGER := 0;
  utm_data JSONB;
BEGIN
  -- Base score
  score := 10;
  
  -- Phone provided (+20 points)
  IF NEW.phone IS NOT NULL AND NEW.phone != '' THEN
    score := score + 20;
  END IF;
  
  -- Email provided (+10 points)
  IF NEW.email IS NOT NULL AND NEW.email != '' THEN
    score := score + 10;
  END IF;
  
  -- Source scoring
  IF NEW.quote_data IS NOT NULL THEN
    utm_data := NEW.quote_data->'utm_data';
    
    -- Landing page source (+30 points - high intent)
    IF NEW.quote_data->>'source' LIKE 'landing_%' THEN
      score := score + 30;
      NEW.lead_source := 'landing_page';
    END IF;
    
    -- Paid traffic (+25 points)
    IF utm_data->>'medium' IN ('cpc', 'paid', 'ppc') THEN
      score := score + 25;
    END IF;
    
    -- Organic/direct (-10 points)
    IF utm_data->>'medium' IN ('organic', 'direct') THEN
      score := score - 10;
    END IF;
  END IF;
  
  -- Insurance type scoring (higher value products)
  CASE NEW.insurance_type
    WHEN 'vie' THEN score := score + 30;
    WHEN 'pret' THEN score := score + 25;
    WHEN 'sante' THEN score := score + 20;
    WHEN 'auto' THEN score := score + 15;
    WHEN 'rc-pro' THEN score := score + 20;
    WHEN 'mrp' THEN score := score + 20;
    ELSE score := score + 10;
  END CASE;
  
  -- Recency bonus (last 24h = +15 points)
  IF NEW.created_at > NOW() - INTERVAL '24 hours' THEN
    score := score + 15;
  END IF;
  
  -- Cap score between 0 and 100
  NEW.lead_score := LEAST(100, GREATEST(0, score));
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create function to auto-calculate lead score for contact_callbacks
CREATE OR REPLACE FUNCTION calculate_lead_score_callbacks()
RETURNS TRIGGER AS $$
DECLARE
  score INTEGER := 0;
BEGIN
  -- Base score
  score := 15; -- Callbacks have higher base score (more engaged)
  
  -- Phone provided (+25 points - critical for callbacks)
  IF NEW.phone IS NOT NULL AND NEW.phone != '' THEN
    score := score + 25;
  END IF;
  
  -- Email provided (+10 points)
  IF NEW.email IS NOT NULL AND NEW.email != '' THEN
    score := score + 10;
  END IF;
  
  -- Message provided (+20 points - shows engagement)
  IF NEW.message IS NOT NULL AND NEW.message != '' THEN
    score := score + 20;
  END IF;
  
  -- Preferred time specified (+15 points)
  IF NEW.preferred_time IS NOT NULL AND NEW.preferred_time != '' THEN
    score := score + 15;
  END IF;
  
  -- Recency bonus (last 24h = +20 points)
  IF NEW.created_at > NOW() - INTERVAL '24 hours' THEN
    score := score + 20;
  END IF;
  
  -- Cap score between 0 and 100
  NEW.lead_score := LEAST(100, GREATEST(0, score));
  
  NEW.lead_source := 'contact_form';
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic scoring
DROP TRIGGER IF EXISTS trigger_calculate_lead_score_quotes ON public.insurance_quotes;
CREATE TRIGGER trigger_calculate_lead_score_quotes
  BEFORE INSERT OR UPDATE ON public.insurance_quotes
  FOR EACH ROW
  EXECUTE FUNCTION calculate_lead_score_quotes();

DROP TRIGGER IF EXISTS trigger_calculate_lead_score_callbacks ON public.contact_callbacks;
CREATE TRIGGER trigger_calculate_lead_score_callbacks
  BEFORE INSERT OR UPDATE ON public.contact_callbacks
  FOR EACH ROW
  EXECUTE FUNCTION calculate_lead_score_callbacks();

-- Backfill existing records with scores
UPDATE public.insurance_quotes SET updated_at = updated_at WHERE lead_score = 0;
UPDATE public.contact_callbacks SET updated_at = updated_at WHERE lead_score = 0;