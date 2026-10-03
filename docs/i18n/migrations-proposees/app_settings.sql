-- REMPLACÉE (3 octobre 2026) par la migration unique
-- supabase/migrations/20261003000200_app_settings.sql de la branche
-- revue/mfa-phase1, recopiée ci-dessous à l'identique. NON APPLIQUÉE.
-- Après application : passer APP_SETTINGS_AVAILABLE à true dans
-- src/config/site.ts.

-- Réglages du site : table app_settings UNIQUE (3 octobre 2026).
--
-- Remplace les deux définitions incompatibles proposées auparavant :
-- value text (branche revue/mfa-phase1) et value jsonb (proposition i18n).
-- Valeur toujours en jsonb. Réglages connus et contraintes :
--   mfa_mode           : "off" | "warn" | "enforce" (chaîne JSON), défaut "off".
--                        Lu et écrit uniquement par get_mfa_mode() et
--                        set_mfa_mode() (migration 20261003000400_mfa_phase1),
--                        qui imposent leurs contrôles (admin, session aal2,
--                        deux facteurs vérifiés pour "enforce").
--   languages_enabled  : tableau non vide de codes parmi fr, en, it ;
--                        défaut ["fr","en"] (italien caché).
--   callback_languages : même format ; défaut ["fr"].
--
-- Lecture publique (anon, authenticated) limitée aux deux réglages de
-- langue. Lecture complète et écriture des réglages de langue : admin
-- (has_role). mfa_mode n'est jamais écrit directement depuis le client :
-- seulement par set_mfa_mode() (SECURITY DEFINER), pour que ses contrôles
-- ne puissent pas être contournés.
-- Idempotente : peut être appliquée deux fois.

CREATE TABLE IF NOT EXISTS public.app_settings (
  key        text PRIMARY KEY,
  value      jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid
);

ALTER TABLE public.app_settings DROP CONSTRAINT IF EXISTS app_settings_mfa_mode_check;
ALTER TABLE public.app_settings ADD CONSTRAINT app_settings_mfa_mode_check CHECK (
  key <> 'mfa_mode'
  OR (jsonb_typeof(value) = 'string' AND value #>> '{}' IN ('off', 'warn', 'enforce'))
);

ALTER TABLE public.app_settings DROP CONSTRAINT IF EXISTS app_settings_languages_check;
ALTER TABLE public.app_settings ADD CONSTRAINT app_settings_languages_check CHECK (
  key NOT IN ('languages_enabled', 'callback_languages')
  OR (
    jsonb_typeof(value) = 'array'
    AND jsonb_array_length(value) > 0
    AND value <@ '["fr","en","it"]'::jsonb
  )
);

ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.app_settings FROM anon, authenticated;
GRANT SELECT ON public.app_settings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.app_settings TO authenticated;
GRANT ALL ON public.app_settings TO service_role;

DROP POLICY IF EXISTS "app_settings lecture publique des langues" ON public.app_settings;
CREATE POLICY "app_settings lecture publique des langues" ON public.app_settings
  FOR SELECT TO anon, authenticated
  USING (key IN ('languages_enabled', 'callback_languages'));

DROP POLICY IF EXISTS "app_settings lecture admin" ON public.app_settings;
CREATE POLICY "app_settings lecture admin" ON public.app_settings
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "app_settings ajout admin" ON public.app_settings;
CREATE POLICY "app_settings ajout admin" ON public.app_settings
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role) AND key <> 'mfa_mode');

DROP POLICY IF EXISTS "app_settings modification admin" ON public.app_settings;
CREATE POLICY "app_settings modification admin" ON public.app_settings
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role) AND key <> 'mfa_mode')
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role) AND key <> 'mfa_mode');

DROP POLICY IF EXISTS "app_settings suppression admin" ON public.app_settings;
CREATE POLICY "app_settings suppression admin" ON public.app_settings
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role) AND key <> 'mfa_mode');

INSERT INTO public.app_settings (key, value) VALUES
  ('mfa_mode', '"off"'),
  ('languages_enabled', '["fr","en"]'),
  ('callback_languages', '["fr"]')
ON CONFLICT (key) DO NOTHING;
