-- Double authentification (TOTP), PHASE 1 : réglage et journalisation.
--
-- - app_settings.mfa_mode : 'off' (défaut), 'warn' ou 'enforce'. Rien ne
--   s'active tant qu'un admin ne change pas ce réglage depuis
--   /admin/securite (et Paul doit d'abord confirmer que la TOTP est activée
--   sur Lovable Cloud).
-- - 'warn' : les accès au CRM en aal1 (mot de passe seul) sont journalisés
--   dans mfa_access_log, au plus une ligne par compte toutes les 10 minutes,
--   et un bandeau invite à activer la double authentification.
-- - 'enforce' en phase 1 : contrôle côté interface uniquement (redirection
--   vers l'enrôlement ou la saisie du code). Le blocage côté base (politiques
--   RLS aal2) et la vérification dans les Edge Functions relèvent de la
--   phase 2, par une migration distincte.
--
-- AUCUNE politique RLS n'est créée ni modifiée : les deux tables ont la RLS
-- activée sans politique (accès service_role uniquement) et ne sont lues ou
-- écrites qu'au travers des fonctions SECURITY DEFINER ci-dessous.

CREATE TABLE IF NOT EXISTS public.app_settings (
  key text PRIMARY KEY,
  value text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid,
  CONSTRAINT app_settings_mfa_mode_check
    CHECK (key <> 'mfa_mode' OR value IN ('off', 'warn', 'enforce'))
);

ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.app_settings FROM anon, authenticated;
GRANT ALL ON public.app_settings TO service_role;

INSERT INTO public.app_settings (key, value)
VALUES ('mfa_mode', 'off')
ON CONFLICT (key) DO NOTHING;

CREATE TABLE IF NOT EXISTS public.mfa_access_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  user_id uuid NOT NULL,
  aal text NOT NULL,
  path text
);

CREATE INDEX IF NOT EXISTS mfa_access_log_user_created_idx
  ON public.mfa_access_log (user_id, created_at DESC);

ALTER TABLE public.mfa_access_log ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.mfa_access_log FROM anon, authenticated;
GRANT ALL ON public.mfa_access_log TO service_role;

-- Mode courant ('off' si la ligne manque). Lisible par tout compte connecté.
CREATE OR REPLACE FUNCTION public.get_mfa_mode()
 RETURNS text
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT COALESCE((SELECT value FROM public.app_settings WHERE key = 'mfa_mode'), 'off');
$function$;

REVOKE EXECUTE ON FUNCTION public.get_mfa_mode() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_mfa_mode() TO authenticated, service_role;

-- Changement de mode : admin uniquement. 'enforce' exige une session aal2 et
-- au moins deux facteurs vérifiés sur le compte de l'admin (pas de
-- verrouillage hors du CRM si un téléphone est perdu).
CREATE OR REPLACE FUNCTION public.set_mfa_mode(p_mode text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_factors integer;
BEGIN
  IF auth.uid() IS NULL OR NOT public.has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'Réservé aux administrateurs' USING ERRCODE = '42501';
  END IF;
  IF p_mode IS NULL OR p_mode NOT IN ('off', 'warn', 'enforce') THEN
    RAISE EXCEPTION 'Mode invalide : %', p_mode USING ERRCODE = '22023';
  END IF;
  IF p_mode = 'enforce' THEN
    IF COALESCE(auth.jwt() ->> 'aal', '') <> 'aal2' THEN
      RAISE EXCEPTION 'Connectez-vous avec votre code de double authentification avant de passer en mode bloquant'
        USING ERRCODE = '42501';
    END IF;
    SELECT count(*) INTO v_factors
    FROM auth.mfa_factors
    WHERE user_id = auth.uid() AND status = 'verified';
    IF v_factors < 2 THEN
      RAISE EXCEPTION 'Deux facteurs vérifiés sont nécessaires sur votre compte avant le mode bloquant (actuellement %)', v_factors
        USING ERRCODE = '42501';
    END IF;
  END IF;

  INSERT INTO public.app_settings (key, value, updated_at, updated_by)
  VALUES ('mfa_mode', p_mode, now(), auth.uid())
  ON CONFLICT (key) DO UPDATE
    SET value = EXCLUDED.value, updated_at = now(), updated_by = auth.uid();
  RETURN p_mode;
END;
$function$;

REVOKE EXECUTE ON FUNCTION public.set_mfa_mode(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.set_mfa_mode(text) TO authenticated;

-- Journalise un accès aal1 au CRM, seulement en mode 'warn', au plus une
-- ligne par compte toutes les 10 minutes. Le niveau est lu dans le jeton,
-- jamais fourni par le client. Renvoie true si une ligne a été écrite.
CREATE OR REPLACE FUNCTION public.log_mfa_access(p_path text)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN false;
  END IF;
  IF public.get_mfa_mode() <> 'warn' THEN
    RETURN false;
  END IF;
  IF COALESCE(auth.jwt() ->> 'aal', 'aal1') <> 'aal1' THEN
    RETURN false;
  END IF;
  IF EXISTS (
    SELECT 1 FROM public.mfa_access_log
    WHERE user_id = auth.uid() AND created_at > now() - interval '10 minutes'
  ) THEN
    RETURN false;
  END IF;

  INSERT INTO public.mfa_access_log (user_id, aal, path)
  VALUES (auth.uid(), 'aal1', left(p_path, 200));
  RETURN true;
END;
$function$;

REVOKE EXECUTE ON FUNCTION public.log_mfa_access(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.log_mfa_access(text) TO authenticated;

-- Vue d'ensemble pour l'admin : comptes du CRM, facteurs vérifiés et
-- derniers accès aal1 journalisés.
CREATE OR REPLACE FUNCTION public.get_mfa_overview()
 RETURNS TABLE(user_id uuid, email text, roles text[], verified_factors integer, last_aal1_access timestamptz)
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  IF auth.uid() IS NULL OR NOT public.has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'Réservé aux administrateurs' USING ERRCODE = '42501';
  END IF;
  RETURN QUERY
  SELECT ur.user_id,
         COALESCE(p.email, u.email)::text,
         array_agg(DISTINCT ur.role::text),
         (SELECT count(*)::integer FROM auth.mfa_factors f
          WHERE f.user_id = ur.user_id AND f.status = 'verified'),
         (SELECT max(l.created_at) FROM public.mfa_access_log l WHERE l.user_id = ur.user_id)
  FROM public.user_roles ur
  LEFT JOIN public.profiles p ON p.id = ur.user_id
  LEFT JOIN auth.users u ON u.id = ur.user_id
  GROUP BY ur.user_id, p.email, u.email
  ORDER BY 2;
END;
$function$;

REVOKE EXECUTE ON FUNCTION public.get_mfa_overview() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_mfa_overview() TO authenticated;
