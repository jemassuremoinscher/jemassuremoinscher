-- Fonction de ciblage pour send-followup-reminders. Reprend telle quelle
-- (pg_get_functiondef) la version durcie déjà appliquée en base par Paul,
-- au-delà de ce qui avait été proposé initialement ici : DISTINCT ON
-- contact (un seul envoi par contact par passage, même si plusieurs deals
-- sont éligibles), exclusion si le contact a déjà reçu une relance 'sent'
-- (tout milestone/deal confondu) dans les 7 derniers jours, et arrêt après
-- 3 échecs 'failed' pour un même deal+milestone (pas de retentative
-- indéfinie sur un deal structurellement cassé).

CREATE OR REPLACE FUNCTION public.get_deals_due_for_followup(p_milestone text)
 RETURNS TABLE(deal_id uuid, contact_id uuid, contact_email text, contact_name text, insurance_type text, stage text)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  WITH stage_entered AS (
    SELECT d.id AS deal_id,
      (
        SELECT dal.created_at FROM public.deal_audit_log dal
        WHERE dal.deal_id = d.id
          AND dal.action IN ('stage_changed', 'created')
          AND dal.new_value = d.stage::text
        ORDER BY dal.created_at DESC
        LIMIT 1
      ) AS entered_at
    FROM public.deals d
    WHERE d.deleted_at IS NULL
      AND (
        (p_milestone = 'j3' AND d.stage = 'quote_sent')
        OR (p_milestone = 'j7' AND d.stage IN ('lead', 'qualified') AND d.source_type = 'insurance_quote')
      )
  ), eligible AS (
    SELECT d.id AS deal_id, d.contact_id, c.email AS contact_email,
           COALESCE(c.full_name, c.email) AS contact_name,
           d.insurance_type, d.stage::text AS stage, se.entered_at
    FROM public.deals d
    JOIN stage_entered se ON se.deal_id = d.id
    JOIN public.contacts c ON c.id = d.contact_id
    LEFT JOIN public.insurance_quotes iq ON d.source_type = 'insurance_quote' AND iq.id = d.source_id
    WHERE se.entered_at IS NOT NULL
      AND se.entered_at BETWEEN
        (CASE p_milestone WHEN 'j3' THEN now() - interval '14 days' WHEN 'j7' THEN now() - interval '21 days' END)
        AND
        (CASE p_milestone WHEN 'j3' THEN now() - interval '3 days' WHEN 'j7' THEN now() - interval '7 days' END)
      AND c.email_opt_out = false
      AND c.email IS NOT NULL
      AND (p_milestone = 'j3' OR iq.last_contacted_at IS NULL)
      AND NOT EXISTS (
        SELECT 1 FROM public.quote_followup_log q
        WHERE q.deal_id = d.id AND q.milestone = p_milestone AND q.status = 'sent'
      )
      AND (
        SELECT count(*) FROM public.quote_followup_log q
        WHERE q.deal_id = d.id AND q.milestone = p_milestone AND q.status = 'failed'
      ) < 3
      AND NOT EXISTS (
        SELECT 1 FROM public.quote_followup_log q
        JOIN public.deals d2 ON d2.id = q.deal_id
        WHERE d2.contact_id = d.contact_id AND q.status = 'sent'
          AND q.created_at > now() - interval '7 days'
      )
  )
  SELECT DISTINCT ON (e.contact_id)
    e.deal_id, e.contact_id, e.contact_email, e.contact_name, e.insurance_type, e.stage
  FROM eligible e
  ORDER BY e.contact_id, e.entered_at ASC;
$function$;

REVOKE EXECUTE ON FUNCTION public.get_deals_due_for_followup(text) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.get_deals_due_for_followup(text) FROM anon;
REVOKE EXECUTE ON FUNCTION public.get_deals_due_for_followup(text) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.get_deals_due_for_followup(text) TO service_role;
GRANT EXECUTE ON FUNCTION public.assert_template_names_exist(text[]) TO service_role;
