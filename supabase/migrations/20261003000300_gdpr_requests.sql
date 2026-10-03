-- Traçabilité des demandes RGPD traitées par la fonction gdpr-contact
-- (phase 1 : export et simulation d'effacement, aucun effacement réel).
--
-- Aucune donnée personnelle en clair : la personne concernée n'est
-- identifiée que par l'empreinte SHA-256 de son email normalisé (minuscules,
-- sans espaces). requested_by est l'identifiant du compte admin qui a lancé
-- la demande. counts ne contient que des nombres de lignes par table.
--
-- Écriture par la fonction (service_role) uniquement ; lecture réservée aux
-- administrateurs connectés.
--
-- Renommée le 3 octobre 2026 (ancien nom 20261002000100_gdpr_requests.sql)
-- pour passer après les migrations déjà appliquées sur main.

CREATE TABLE IF NOT EXISTS public.gdpr_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  requested_by uuid NOT NULL,
  email_hash text NOT NULL CHECK (email_hash ~ '^[0-9a-f]{64}$'),
  action text NOT NULL CHECK (action IN ('export', 'simulate')),
  outcome text NOT NULL CHECK (outcome IN ('found', 'not_found', 'manual_review')),
  counts jsonb NOT NULL DEFAULT '{}'::jsonb,
  manual_reasons text[] NOT NULL DEFAULT '{}',
  fingerprint text CHECK (fingerprint IS NULL OR fingerprint ~ '^[0-9a-f]{64}$')
);

CREATE INDEX IF NOT EXISTS gdpr_requests_email_hash_idx ON public.gdpr_requests (email_hash);
CREATE INDEX IF NOT EXISTS gdpr_requests_created_at_idx ON public.gdpr_requests (created_at DESC);

ALTER TABLE public.gdpr_requests ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.gdpr_requests FROM anon, authenticated;
GRANT ALL ON public.gdpr_requests TO service_role;
GRANT SELECT ON public.gdpr_requests TO authenticated;

DROP POLICY IF EXISTS "Admins can read gdpr_requests" ON public.gdpr_requests;
CREATE POLICY "Admins can read gdpr_requests"
  ON public.gdpr_requests
  FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));
