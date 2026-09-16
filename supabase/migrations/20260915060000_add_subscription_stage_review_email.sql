-- Étend notify_deal_stage_email() (migration 20260912090000) pour couvrir le
-- passage en stage "subscription" (Souscription) — confirmé par Paul comme
-- la vraie fin de l'expérience client (pas "won"/Validé, qui reste une
-- étape administrative interne). Déclenche l'envoi automatique du template
-- "Demande d'avis Google" (6ème template, à insérer par Paul dans
-- email_templates avec EXACTEMENT ce nom — le lookup dans
-- crm-send-auto-template se fait par correspondance exacte sur la colonne
-- `name`, cf. index.ts:93 `.eq("name", templateName)`).
--
-- Même mécanisme, mêmes garde-fous que la version précédente (anti-doublon
-- via deal_stage_email_log, transition entrante uniquement, échec silencieux
-- qui ne bloque jamais le changement de stage) — seule la liste des stages
-- ciblés et le mapping CASE changent.

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
  -- "subscription" ajouté ici (2026-09-15) : cf. commentaire ci-dessus.
  IF NEW.stage NOT IN ('won', 'incomplete', 'subscription') THEN
    RETURN NEW;
  END IF;
  IF TG_OP = 'UPDATE' AND OLD.stage IS NOT DISTINCT FROM NEW.stage THEN
    RETURN NEW;
  END IF;

  v_template_name := CASE NEW.stage
    WHEN 'won' THEN 'Confirmation de souscription'
    WHEN 'incomplete' THEN 'Demande de pièces manquantes'
    WHEN 'subscription' THEN 'Demande d''avis Google'
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
