-- Fix security warnings: Set search_path for functions
DROP FUNCTION IF EXISTS calculate_lead_score_quotes() CASCADE;
CREATE OR REPLACE FUNCTION calculate_lead_score_quotes()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
$$;

DROP FUNCTION IF EXISTS calculate_lead_score_callbacks() CASCADE;
CREATE OR REPLACE FUNCTION calculate_lead_score_callbacks()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  score INTEGER := 0;
BEGIN
  -- Base score
  score := 15;
  
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
$$;

-- Recreate triggers
CREATE TRIGGER trigger_calculate_lead_score_quotes
  BEFORE INSERT OR UPDATE ON public.insurance_quotes
  FOR EACH ROW
  EXECUTE FUNCTION calculate_lead_score_quotes();

CREATE TRIGGER trigger_calculate_lead_score_callbacks
  BEFORE INSERT OR UPDATE ON public.contact_callbacks
  FOR EACH ROW
  EXECUTE FUNCTION calculate_lead_score_callbacks();