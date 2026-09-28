-- Retire 'won' de l'envoi automatique de notify_deal_stage_email : le
-- template "Confirmation de souscription / Accueil client" promet une
-- pièce jointe et un espace client dont l'existence n'a pas été vérifiée -
-- un envoi automatique ne doit pas partir tant que ce n'est pas confirmé.
-- Appliqué directement en base ; cette migration resynchronise le dépôt.
-- Ne touche à rien d'autre dans la fonction (CASE, log, appel HTTP,
-- gestion d'erreur) — reprend telle quelle la version de la migration
-- 20260928000500, seul le filtre de garde change.

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
  IF NEW.stage NOT IN ('subscription') THEN
    RETURN NEW;
  END IF;
  IF TG_OP = 'UPDATE' AND OLD.stage IS NOT DISTINCT FROM NEW.stage THEN
    RETURN NEW;
  END IF;

  v_template_name := CASE NEW.stage
    WHEN 'won' THEN 'Confirmation de souscription / Accueil client'
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

  SELECT value INTO v_secret FROM public.cron_config WHERE lower(key) = 'cron_secret' LIMIT 1;
  IF v_secret IS NULL THEN
    RETURN NEW;
  END IF;

  SELECT net.http_post(
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
  BEGIN
    INSERT INTO public.site_error_log (page_path, error_type, message, context)
    VALUES (
      'trigger:notify_deal_stage_email',
      'deal_stage_email_trigger_exception',
      SQLERRM,
      jsonb_build_object('deal_id', NEW.id, 'stage', NEW.stage, 'sqlstate', SQLSTATE)
    );
  EXCEPTION WHEN OTHERS THEN
    NULL; -- jamais bloquer la transition du deal pour un problème de logging
  END;
  RETURN NEW;
END;
$$;
