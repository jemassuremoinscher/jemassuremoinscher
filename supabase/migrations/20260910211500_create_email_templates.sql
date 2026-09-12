-- Table des templates d'emails réutilisables pour l'envoi manuel depuis le CRM
-- (action "Envoyer template" de ActivityComposer.tsx). La table ne stocke que
-- le texte brut avec des placeholders {{prenom}} / {{produit}} — la substitution
-- se fait côté client avant l'appel à l'edge function crm-send-template, à
-- partir des données réelles du contact/deal. Aucune logique d'interpolation
-- côté base.
--
-- Expéditeur figé de tous les envois : hello@jemassuremoinscher.fr (domaine
-- racine, vérifié côté Resend le 2026-09-09).

CREATE TABLE public.email_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- updated_at auto : réutilise la fonction générique déjà en place
CREATE TRIGGER email_templates_set_updated_at
  BEFORE UPDATE ON public.email_templates
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;

-- anon (visiteur non authentifié) n'a aucune raison de toucher cette table,
-- même en lecture — REVOKE explicite au niveau table, comme le durcissement
-- sales_agents (20260904040519).
REVOKE ALL ON public.email_templates FROM anon;

-- Lecture : tout utilisateur authentifié du CRM voit les templates actifs.
-- Le CRM principal (/admin, DealDrawer, ActivityComposer) est derrière
-- <AuthRoute> seul, pas <RequireAdmin> — un commercial non-admin doit pouvoir
-- lister les templates pour en envoyer un. Les templates ne sont pas des
-- données sensibles ; seule leur curation est réservée aux admins.
CREATE POLICY "Authenticated users can read active email templates"
  ON public.email_templates
  FOR SELECT
  TO authenticated
  USING (is_active = true);

-- Gestion (création, modification, désactivation, suppression + lecture des
-- templates inactifs) : admins uniquement.
CREATE POLICY "Admins can manage email templates"
  ON public.email_templates
  FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
