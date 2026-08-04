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
  k := translate(k, 'àáâãäåèéêëìíîïòóôõöùúûüçñ', 'aaaaaaeeeeiiiiooooouuuucn');
  k := replace(replace(k, '-', ' '), '_', ' ');

  RETURN CASE k
    WHEN 'auto' THEN 'auto'
    WHEN 'assurance auto' THEN 'auto'
    WHEN 'assurance automobile' THEN 'auto'
    WHEN 'automobile' THEN 'auto'
    WHEN 'voiture' THEN 'auto'
    WHEN 'moto' THEN 'moto'
    WHEN 'assurance moto' THEN 'moto'
    WHEN 'scooter' THEN 'moto'
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
    WHEN 'rc pro' THEN 'rc_pro'
    WHEN 'rcpro' THEN 'rc_pro'
    WHEN 'rc professionnelle' THEN 'rc_pro'
    WHEN 'assurance rc pro' THEN 'rc_pro'
    WHEN 'assurance rcpro' THEN 'rc_pro'
    WHEN 'mrp' THEN 'mrp'
    WHEN 'assurance mrp' THEN 'mrp'
    WHEN 'multirisque professionnelle' THEN 'mrp'
    WHEN 'restaurant' THEN 'mrp'
    WHEN 'gli' THEN 'gli'
    WHEN 'assurance gli' THEN 'gli'
    WHEN 'garantie loyers impayes' THEN 'gli'
    WHEN 'pno' THEN 'pno'
    WHEN 'assurance pno' THEN 'pno'
    WHEN 'proprietaire non occupant' THEN 'pno'
    WHEN 'gestion locative' THEN 'gestion_locative'
    WHEN 'gestion immobiliere' THEN 'gestion_locative'
    WHEN 'administrateur de biens' THEN 'gestion_locative'
    WHEN 'metiers atypiques' THEN 'metiers_atypiques'
    WHEN 'assurance metiers atypiques' THEN 'metiers_atypiques'
    WHEN 'risques aggraves' THEN 'metiers_atypiques'
    WHEN 'accrobranche' THEN 'metiers_atypiques'
    WHEN 'cordiste' THEN 'metiers_atypiques'
    WHEN 'cordiste btp' THEN 'metiers_atypiques'
    WHEN 'evenementiel' THEN 'metiers_atypiques'
    WHEN 'moniteur sport' THEN 'metiers_atypiques'
    WHEN 'moniteur de sport' THEN 'metiers_atypiques'
    WHEN 'coach sportif' THEN 'metiers_atypiques'
    WHEN 'photographe' THEN 'metiers_atypiques'
    WHEN 'influenceur' THEN 'metiers_atypiques'
    WHEN 'trottinette' THEN 'trottinette'
    WHEN 'assurance trottinette' THEN 'trottinette'
    WHEN 'trottinette electrique' THEN 'trottinette'
    WHEN 'edpm' THEN 'trottinette'
    WHEN 'velo' THEN 'velo'
    WHEN 'assurance velo' THEN 'velo'
    WHEN 'vae' THEN 'velo'
    WHEN 'assurance vae' THEN 'velo'
    WHEN 'camping car' THEN 'camping_car'
    WHEN 'assurance camping car' THEN 'camping_car'
    WHEN 'sans permis' THEN 'sans_permis'
    WHEN 'voiture sans permis' THEN 'sans_permis'
    WHEN 'vsp' THEN 'sans_permis'
    WHEN 'auto temporaire' THEN 'auto_temporaire'
    WHEN 'assurance auto temporaire' THEN 'auto_temporaire'
    WHEN 'flotte' THEN 'flotte'
    WHEN 'flotte auto' THEN 'flotte'
    WHEN 'assurance flotte' THEN 'flotte'
    WHEN 'assurance flotte auto' THEN 'flotte'
    WHEN 'vtc' THEN 'flotte'
    WHEN 'cyber' THEN 'cyber'
    WHEN 'cyber risques' THEN 'cyber'
    WHEN 'assurance cyber' THEN 'cyber'
    WHEN 'decennale' THEN 'decennale'
    WHEN 'assurance decennale' THEN 'decennale'
    WHEN 'garantie decennale' THEN 'decennale'
    WHEN 'protection juridique' THEN 'protection_juridique'
    WHEN 'assurance protection juridique' THEN 'protection_juridique'
    WHEN 'mutuelle entreprise' THEN 'mutuelle_entreprise'
    WHEN 'mutuelle collective' THEN 'mutuelle_entreprise'
    WHEN 'ani' THEN 'mutuelle_entreprise'
    WHEN 'auto entrepreneur' THEN 'rc_pro'
    WHEN 'rc pro micro entreprise' THEN 'rc_pro'
    WHEN 'senior' THEN 'sante'
    ELSE NULL
  END;
END;
$$;

CREATE TABLE IF NOT EXISTS public.site_error_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_path text NOT NULL,
  error_type text NOT NULL,
  message text,
  insurance_type text,
  context jsonb NOT NULL DEFAULT '{}'::jsonb,
  user_agent text,
  resolved_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT INSERT ON public.site_error_log TO anon;
GRANT SELECT, INSERT, UPDATE ON public.site_error_log TO authenticated;
GRANT ALL ON public.site_error_log TO service_role;

ALTER TABLE public.site_error_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can report a site error" ON public.site_error_log;
CREATE POLICY "Anyone can report a site error"
  ON public.site_error_log FOR INSERT
  WITH CHECK (resolved_at IS NULL AND length(page_path) <= 300 AND length(coalesce(message,'')) <= 2000);

DROP POLICY IF EXISTS "Admins can view site errors" ON public.site_error_log;
CREATE POLICY "Admins can view site errors"
  ON public.site_error_log FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can resolve site errors" ON public.site_error_log;
CREATE POLICY "Admins can resolve site errors"
  ON public.site_error_log FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE INDEX IF NOT EXISTS idx_site_error_log_created ON public.site_error_log (created_at DESC);