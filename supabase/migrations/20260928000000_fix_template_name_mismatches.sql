-- Corrige deux noms de template errones dans notify_deal_stage_email(),
-- decouverts le 2026-09-27 : le trigger cherchait un nom tronque/different
-- de celui reellement en base dans email_templates, provoquant un 404
-- silencieux (fire-and-forget, jamais verifie par le trigger) a chaque
-- transition de deal vers 'won' ou 'incomplete' depuis le 12/09 (creation
-- du trigger). Aucun client n'a recu ces deux emails depuis cette date.
-- Correction appliquee directement en base par Paul le 2026-09-27 ;
-- cette migration reproduit cet etat pour resynchroniser le depot.
--
-- 'won' : 'Confirmation de souscription' -> 'Confirmation de souscription / Accueil client'
-- 'incomplete' : 'Demande de pieces manquantes' -> 'Demande de pieces justificatives manquantes'
-- 'subscription' : 'Demande d''avis Google' - correct, inchange.

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
  IF NEW.stage NOT IN ('won', 'incomplete', 'subscription') THEN
    RETURN NEW;
  END IF;
  IF TG_OP = 'UPDATE' AND OLD.stage IS NOT DISTINCT FROM NEW.stage THEN
    RETURN NEW;
  END IF;

  v_template_name := CASE NEW.stage
    WHEN 'won' THEN 'Confirmation de souscription / Accueil client'
    WHEN 'incomplete' THEN 'Demande de pièces justificatives manquantes'
    WHEN 'subscription' THEN 'Demande d''avis Google'
  END;

  INSERT INTO public.deal_stage_email_log (deal_id, stage)
  VALUES (NEW.id, NEW.stage)
  ON CONFLICT (deal_id, stage) DO NOTHING
  RETURNING id INTO v_log_id;

  IF v_log_id IS NULL THEN
    RETURN NEW;
  END IF;

  SELECT email, full_name INTO v_contact_email, v_contact_name
  FROM public.contacts
  WHERE id = NEW.contact_id;

  IF v_contact_email IS NULL THEN
    RETURN NEW;
  END IF;

  SELECT value INTO v_secret FROM public.cron_config WHERE key = 'cron_secret';
  IF v_secret IS NULL THEN
    RETURN NEW;
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
  RAISE WARNING 'notify_deal_stage_email failed for deal %: %', NEW.id, SQLERRM;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_notify_deal_stage_email ON public.deals;
CREATE TRIGGER trg_notify_deal_stage_email
AFTER UPDATE OF stage ON public.deals
FOR EACH ROW
EXECUTE FUNCTION public.notify_deal_stage_email();
