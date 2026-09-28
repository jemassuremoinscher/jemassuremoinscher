-- Rend visibles les échecs de notify_deal_stage_email() (jusqu'ici avalés
-- silencieusement par EXCEPTION WHEN OTHERS + RAISE WARNING, qui n'écrit
-- que dans les logs Postgres — jamais consulté en pratique, c'est
-- exactement comment le bug de noms de templates du 2026-09-12 est resté
-- invisible pendant 15 jours). Reprend le corps de la fonction tel que
-- corrigé par la migration 20260928000400 et ajoute une écriture dans
-- public.site_error_log au moment de l'exception.
--
-- Pourquoi ça marche en PL/pgSQL : les instructions du corps du bloc BEGIN
-- principal sont annulées (rollback) au moment où une exception est levée,
-- mais tout ce qu'exécute le handler EXCEPTION lui-même est une nouvelle
-- sous-transaction qui persiste normalement. D'où le second BEGIN/EXCEPTION
-- imbriqué : si l'INSERT dans site_error_log échoue à son tour (contrainte,
-- RLS...), il ne doit surtout pas empêcher RETURN NEW - la transition du
-- deal ne doit jamais être bloquée par un problème de journalisation.

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
  IF NEW.stage NOT IN ('won', 'subscription') THEN
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
