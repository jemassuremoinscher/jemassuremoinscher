-- Envoi automatique de templates email quand un deal change de stage vers
-- "won" (Validé → Confirmation de souscription) ou "incomplete" (Dossier
-- incomplet → Demande de pièces manquantes). Couvre les deux chemins
-- d'écriture existants du stage (drag-and-drop Kanban CrmKanban.tsx et menu
-- déroulant EditDealSection.tsx) puisque tous deux font un simple
-- UPDATE deals SET stage = ... — un seul trigger AFTER UPDATE suffit.
--
-- Anti-doublon en deux couches, volontairement redondantes :
-- 1) Le trigger ne se déclenche que sur une vraie transition ENTRANTE
--    (NEW.stage distinct de OLD.stage), pas sur un re-save qui laisse le
--    stage inchangé — même garde que queue_social_post_on_article_approval
--    (migration 20260428024411).
-- 2) Un log dédié (deal_stage_email_log, UNIQUE deal_id+stage) empêche un
--    second envoi si le deal ressort de ce stage puis y revient par erreur.
--    Compromis assumé : un deal qui repasserait légitimement par "won" une
--    seconde fois (cas rare) ne recevrait pas de second email — préférence
--    donnée à éviter les doublons plutôt qu'à couvrir ce cas de figure.
--
-- Auth de l'appel edge function : un trigger n'a pas de session utilisateur,
-- donc pas de JWT possible. Réutilise public.cron_config (déjà en place,
-- verrouillée service_role, migration 20260621135820) — même mécanisme que
-- generate-seo-suggestions/db-backup dans ce projet.

CREATE TABLE IF NOT EXISTS public.deal_stage_email_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id UUID NOT NULL REFERENCES public.deals(id) ON DELETE CASCADE,
  stage TEXT NOT NULL,
  sent_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  resend_email_id TEXT,
  UNIQUE (deal_id, stage)
);

ALTER TABLE public.deal_stage_email_log ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.deal_stage_email_log FROM anon;
GRANT ALL ON public.deal_stage_email_log TO service_role;

CREATE POLICY "Admins can read deal stage email log"
  ON public.deal_stage_email_log
  FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE OR REPLACE FUNCTION public.notify_deal_stage_email()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  v_template_name text;
  v_contact_email text;
  v_contact_name text;
  v_secret text;
  v_anon text := 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlicXhwbmdrYmdvc29idGV0eGFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyNTM0NzksImV4cCI6MjA3NzgyOTQ3OX0.ekYS4QpTPlcJ82Cf4xXvwS1LsM4LhFodG-u31Mb7Rbg';
  v_request_id bigint;
  v_log_id uuid;
BEGIN
  -- Ne réagit qu'aux deux stages ciblés, et seulement sur une vraie transition.
  IF NEW.stage NOT IN ('won', 'incomplete') THEN
    RETURN NEW;
  END IF;
  IF TG_OP = 'UPDATE' AND OLD.stage IS NOT DISTINCT FROM NEW.stage THEN
    RETURN NEW;
  END IF;

  v_template_name := CASE NEW.stage
    WHEN 'won' THEN 'Confirmation de souscription'
    WHEN 'incomplete' THEN 'Demande de pièces manquantes'
  END;

  -- Réservation anti-doublon : si déjà envoyé pour ce deal+stage, on s'arrête.
  INSERT INTO public.deal_stage_email_log (deal_id, stage)
  VALUES (NEW.id, NEW.stage)
  ON CONFLICT (deal_id, stage) DO NOTHING
  RETURNING id INTO v_log_id;

  IF v_log_id IS NULL THEN
    RETURN NEW; -- déjà envoyé pour cette combinaison deal+stage
  END IF;

  SELECT email, full_name INTO v_contact_email, v_contact_name
  FROM public.contacts
  WHERE id = NEW.contact_id;

  IF v_contact_email IS NULL THEN
    RETURN NEW; -- pas d'email connu pour ce contact, rien à envoyer
  END IF;

  SELECT value INTO v_secret FROM public.cron_config WHERE key = 'cron_secret';
  IF v_secret IS NULL THEN
    RETURN NEW; -- pas de secret configuré, on n'essaie pas d'appeler la fonction
  END IF;

  SELECT extensions.net.http_post(
    url := 'https://ybqxpngkbgosobtetxac.supabase.co/functions/v1/crm-send-auto-template',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'apikey', v_anon,
      'Authorization', 'Bearer ' || v_secret
    ),
    body := jsonb_build_object(
      'dealId', NEW.id,
      'templateName', v_template_name,
      'recipientEmail', v_contact_email,
      'recipientName', COALESCE(v_contact_name, v_contact_email),
      'product', NEW.insurance_type
    ),
    timeout_milliseconds := 15000
  ) INTO v_request_id;

  UPDATE public.deal_stage_email_log SET resend_email_id = v_request_id::text WHERE id = v_log_id;

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Ne jamais bloquer le changement de stage lui-même si l'envoi échoue.
  RAISE WARNING 'notify_deal_stage_email failed for deal %: %', NEW.id, SQLERRM;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_notify_deal_stage_email ON public.deals;
CREATE TRIGGER trg_notify_deal_stage_email
AFTER UPDATE OF stage ON public.deals
FOR EACH ROW
EXECUTE FUNCTION public.notify_deal_stage_email();
