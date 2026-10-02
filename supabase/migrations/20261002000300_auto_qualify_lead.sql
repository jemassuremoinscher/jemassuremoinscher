-- Passage automatique d'un deal de 'lead' à 'qualified' dès qu'un membre de
-- l'équipe enregistre une action manuelle (appel, email, SMS, rendez-vous,
-- note, tâche terminée) sur ce deal.
--
-- Reproduit à l'identique ce que Paul a appliqué en base. Idempotent :
-- CREATE OR REPLACE de la fonction, REVOKE sans effet s'il est déjà fait,
-- DROP TRIGGER IF EXISTS puis CREATE TRIGGER. Rejouée, la migration laisse
-- la base dans le même état.
--
-- - Seules les activités avec auteur (author_id non nul) comptent : les
--   activités système ne qualifient pas un deal.
-- - Seuls les deals encore en 'lead' et non supprimés sont modifiés.

CREATE OR REPLACE FUNCTION public.auto_qualify_lead_on_manual_activity()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  IF NEW.author_id IS NOT NULL
     AND NEW.deal_id IS NOT NULL
     AND NEW.action_type IN ('call', 'email', 'sms', 'meeting', 'note', 'task_completed') THEN
    UPDATE public.deals
       SET stage = 'qualified'
     WHERE id = NEW.deal_id
       AND stage = 'lead'
       AND deleted_at IS NULL;
  END IF;
  RETURN NEW;
END;
$function$;

REVOKE EXECUTE ON FUNCTION public.auto_qualify_lead_on_manual_activity() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS trg_auto_qualify_lead ON public.activities;
CREATE TRIGGER trg_auto_qualify_lead
  AFTER INSERT ON public.activities
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_qualify_lead_on_manual_activity();
