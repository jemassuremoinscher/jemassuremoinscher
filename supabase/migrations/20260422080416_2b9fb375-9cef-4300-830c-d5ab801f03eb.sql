CREATE OR REPLACE FUNCTION public.calculate_lead_score_quotes()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
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

    IF NEW.quote_data->>'source' LIKE 'landing_%' THEN
      score := score + 30;
      NEW.lead_source := 'landing_page';
    END IF;

    IF utm_data->>'medium' IN ('cpc', 'paid', 'ppc') THEN
      score := score + 25;
    END IF;

    IF utm_data->>'medium' IN ('organic', 'direct') THEN
      score := score - 10;
    END IF;
  END IF;

  -- Insurance type scoring (higher value products)
  CASE NEW.insurance_type
    WHEN 'vie' THEN score := score + 30;
    WHEN 'metiers_atypiques' THEN score := score + 30; -- niche à forte marge courtage
    WHEN 'pret' THEN score := score + 25;
    WHEN 'sante' THEN score := score + 20;
    WHEN 'auto' THEN score := score + 15;
    WHEN 'rc_pro' THEN score := score + 20;
    WHEN 'rc-pro' THEN score := score + 20; -- legacy slug fallback
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
$function$;