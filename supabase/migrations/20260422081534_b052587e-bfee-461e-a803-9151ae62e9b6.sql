
-- Function: normalize insurance_type to canonical slug
CREATE OR REPLACE FUNCTION public.normalize_insurance_type(_input text)
RETURNS text
LANGUAGE plpgsql
IMMUTABLE
SET search_path = public
AS $$
DECLARE
  k text;
BEGIN
  IF _input IS NULL THEN
    RETURN NULL;
  END IF;
  k := lower(trim(_input));
  -- strip accents minimally
  k := translate(k, 'àáâãäåèéêëìíîïòóôõöùúûüçñ', 'aaaaaaeeeeiiiiooooouuuucn');

  RETURN CASE k
    WHEN 'auto' THEN 'auto'
    WHEN 'assurance auto' THEN 'auto'
    WHEN 'assurance automobile' THEN 'auto'
    WHEN 'automobile' THEN 'auto'
    WHEN 'moto' THEN 'moto'
    WHEN 'assurance moto' THEN 'moto'
    WHEN 'habitation' THEN 'habitation'
    WHEN 'assurance habitation' THEN 'habitation'
    WHEN 'sante' THEN 'sante'
    WHEN 'assurance sante' THEN 'sante'
    WHEN 'mutuelle' THEN 'sante'
    WHEN 'mutuelle sante' THEN 'sante'
    WHEN 'mutuelle tns' THEN 'sante'
    WHEN 'pret' THEN 'pret'
    WHEN 'assurance pret' THEN 'pret'
    WHEN 'assurance pret immobilier' THEN 'pret'
    WHEN 'emprunteur' THEN 'pret'
    WHEN 'assurance emprunteur' THEN 'pret'
    WHEN 'animaux' THEN 'animaux'
    WHEN 'assurance animaux' THEN 'animaux'
    WHEN 'vie' THEN 'vie'
    WHEN 'assurance vie' THEN 'vie'
    WHEN 'prevoyance' THEN 'prevoyance'
    WHEN 'assurance prevoyance' THEN 'prevoyance'
    WHEN 'rc_pro' THEN 'rc_pro'
    WHEN 'rc-pro' THEN 'rc_pro'
    WHEN 'rc pro' THEN 'rc_pro'
    WHEN 'rcpro' THEN 'rc_pro'
    WHEN 'rc professionnelle' THEN 'rc_pro'
    WHEN 'assurance rc pro' THEN 'rc_pro'
    WHEN 'assurance rcpro' THEN 'rc_pro'
    WHEN 'mrp' THEN 'mrp'
    WHEN 'assurance mrp' THEN 'mrp'
    WHEN 'multirisque professionnelle' THEN 'mrp'
    WHEN 'gli' THEN 'gli'
    WHEN 'assurance gli' THEN 'gli'
    WHEN 'garantie loyers impayes' THEN 'gli'
    WHEN 'pno' THEN 'pno'
    WHEN 'assurance pno' THEN 'pno'
    WHEN 'proprietaire non occupant' THEN 'pno'
    WHEN 'gestion_locative' THEN 'gestion_locative'
    WHEN 'gestion locative' THEN 'gestion_locative'
    WHEN 'gestion immobiliere' THEN 'gestion_locative'
    WHEN 'administrateur de biens' THEN 'gestion_locative'
    WHEN 'metiers_atypiques' THEN 'metiers_atypiques'
    WHEN 'metiers atypiques' THEN 'metiers_atypiques'
    WHEN 'assurance metiers atypiques' THEN 'metiers_atypiques'
    WHEN 'risques aggraves' THEN 'metiers_atypiques'
    WHEN 'accrobranche' THEN 'metiers_atypiques'
    WHEN 'cordiste' THEN 'metiers_atypiques'
    WHEN 'cordiste btp' THEN 'metiers_atypiques'
    WHEN 'evenementiel' THEN 'metiers_atypiques'
    WHEN 'moniteur sport' THEN 'metiers_atypiques'
    WHEN 'moniteur de sport' THEN 'metiers_atypiques'
    ELSE NULL
  END;
END;
$$;

-- Update validation trigger to normalize + reject invalid types
CREATE OR REPLACE FUNCTION public.validate_insurance_quote()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  normalized text;
BEGIN
  IF NOT is_valid_email(NEW.email) THEN
    RAISE EXCEPTION 'Invalid email format';
  END IF;
  IF length(NEW.full_name) < 2 OR length(NEW.full_name) > 120 THEN
    RAISE EXCEPTION 'Invalid full name length';
  END IF;
  IF length(NEW.phone) < 6 OR length(NEW.phone) > 30 THEN
    RAISE EXCEPTION 'Invalid phone length';
  END IF;
  IF NEW.insurance_type IS NULL OR length(NEW.insurance_type) > 60 THEN
    RAISE EXCEPTION 'Invalid insurance type';
  END IF;

  -- Normalize and validate insurance_type
  normalized := public.normalize_insurance_type(NEW.insurance_type);
  IF normalized IS NULL THEN
    RAISE EXCEPTION 'Unknown insurance_type: %. Must be one of the canonical types (auto, moto, habitation, sante, pret, animaux, vie, prevoyance, rc_pro, mrp, gli, pno, gestion_locative, metiers_atypiques).', NEW.insurance_type;
  END IF;
  NEW.insurance_type := normalized;

  IF NEW.notes IS NOT NULL AND length(NEW.notes) > 5000 THEN
    RAISE EXCEPTION 'Notes too long';
  END IF;

  IF auth.uid() IS NULL THEN
    NEW.assigned_to := NULL;
    NEW.status := 'pending';
    NEW.deleted_at := NULL;
    NEW.last_contacted_at := NULL;
    NEW.next_follow_up := NULL;
    NEW.notes := NULL;
    NEW.signed_before_hot := false;
  END IF;
  RETURN NEW;
END;
$$;
