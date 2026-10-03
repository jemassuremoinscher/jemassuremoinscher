-- PROPOSITION — NON APPLIQUÉE (chantier i18n, étape 1, 3 octobre 2026).
-- À valider par Paul, puis à déplacer dans supabase/migrations/ avec un
-- horodatage postérieur à la dernière migration appliquée, et à appliquer.
-- Après application : passer APP_SETTINGS_AVAILABLE à true dans
-- src/config/site.ts (sinon le site garde les valeurs par défaut sans
-- interroger la base).
--
-- Réglages publics du site, lus par le navigateur avec la clé anon :
--   languages_enabled  : langues proposées par le bouton de langue ;
--                        défaut ["fr","en"] (l'italien reste caché tant
--                        que Paul ne l'ajoute pas).
--   callback_languages : langues dans lesquelles un conseiller peut
--                        rappeler (étape 5) ; défaut ["fr"].
-- Lecture : tout le monde, uniquement pour les clés publiques listées dans
-- la politique. Écriture : administrateurs seulement.

CREATE TABLE IF NOT EXISTS public.app_settings (
  key         text PRIMARY KEY,
  value       jsonb NOT NULL,
  description text,
  updated_at  timestamptz NOT NULL DEFAULT now(),
  updated_by  uuid REFERENCES auth.users(id) ON DELETE SET NULL
);

ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "app_settings lecture publique" ON public.app_settings;
CREATE POLICY "app_settings lecture publique" ON public.app_settings
  FOR SELECT TO anon, authenticated
  USING (key IN ('languages_enabled', 'callback_languages'));

DROP POLICY IF EXISTS "app_settings admin" ON public.app_settings;
CREATE POLICY "app_settings admin" ON public.app_settings
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Valeur : tableau JSON de codes de langue parmi fr, en, it.
ALTER TABLE public.app_settings DROP CONSTRAINT IF EXISTS app_settings_languages_check;
ALTER TABLE public.app_settings ADD CONSTRAINT app_settings_languages_check CHECK (
  key NOT IN ('languages_enabled', 'callback_languages')
  OR (
    jsonb_typeof(value) = 'array'
    AND jsonb_array_length(value) > 0
    AND value <@ '["fr","en","it"]'::jsonb
  )
);

INSERT INTO public.app_settings (key, value, description) VALUES
  ('languages_enabled', '["fr","en"]', 'Langues proposées par le bouton de langue du site (fr toujours inclus).'),
  ('callback_languages', '["fr"]', 'Langues dans lesquelles un conseiller peut rappeler un prospect.')
ON CONFLICT (key) DO NOTHING;

GRANT SELECT ON public.app_settings TO anon, authenticated;
