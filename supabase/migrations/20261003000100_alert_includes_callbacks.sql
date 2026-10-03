-- Alerte « demande non traitée » : surveille aussi les demandes de rappel
-- (deals.source_type = 'contact_callback', créés par bridge_callback_to_deal).
--
-- Versionne la correction faite en base le 3 octobre 2026. Par rapport à
-- 20261001000200_get_unhandled_leads.sql, seuls changent :
-- - cibles : source_type 'insurance_quote' OU 'contact_callback' ;
-- - produit affiché : « Demande de rappel » pour un rappel (insurance_type
--   vaut 'contact' sur ces dossiers) ;
-- - « traité » : last_contacted_at lu sur contact_callbacks pour un rappel,
--   sur insurance_quotes pour un devis ;
-- - prénom : repli sur contact_callbacks.full_name pour un rappel.
-- Le reste est inchangé (horloge 8h-19h Europe/Paris, 45 min, une seule
-- alerte 'sent', arrêt après 3 'failed', plafond 10, lecture seule).
-- Idempotente : CREATE OR REPLACE, même signature, mêmes REVOKE/GRANT.

CREATE OR REPLACE FUNCTION public.get_unhandled_leads(p_limit integer DEFAULT 10)
 RETURNS TABLE(
   deal_id uuid,
   first_name text,
   insurance_type text,
   requested_at timestamptz,
   clock_start timestamptz,
   due_at timestamptz,
   business_minutes_elapsed integer,
   failed_attempts integer
 )
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  WITH cfg AS (
    SELECT CASE
             WHEN value ~ '^\d{4}-\d{2}-\d{2}' THEN value::timestamptz
             ELSE NULL
           END AS activated_at
    FROM public.cron_config
    WHERE key = 'lead_alert_activated_at'
    LIMIT 1
  ),
  now_paris AS (
    SELECT now() AS ts, (now() AT TIME ZONE 'Europe/Paris') AS local_ts
  ),
  candidates AS (
    SELECT d.id AS deal_id,
           d.contact_id,
           d.source_id,
           d.insurance_type,
           d.source_type,
           d.created_at,
           (d.created_at AT TIME ZONE 'Europe/Paris') AS local_created
    FROM public.deals d
    CROSS JOIN cfg
    WHERE cfg.activated_at IS NOT NULL
      AND d.created_at >= cfg.activated_at
      AND d.stage = 'lead'
      AND d.source_type IN ('insurance_quote', 'contact_callback')
      AND d.deleted_at IS NULL
  ),
  clocked AS (
    SELECT c.*,
           CASE
             WHEN c.local_created::time >= time '08:00' AND c.local_created::time < time '19:00'
               THEN c.created_at
             WHEN c.local_created::time < time '08:00'
               THEN (c.local_created::date + time '08:00') AT TIME ZONE 'Europe/Paris'
             ELSE ((c.local_created::date + 1) + time '08:00') AT TIME ZONE 'Europe/Paris'
           END AS clock_start
    FROM candidates c
  )
  SELECT k.deal_id,
         COALESCE(
           NULLIF(btrim(ct.first_name), ''),
           NULLIF(split_part(btrim(COALESCE(ct.full_name, iq.full_name, cb.full_name, '')), ' ', 1), '')
         ) AS first_name,
         CASE WHEN k.source_type = 'contact_callback' THEN 'Demande de rappel' ELSE k.insurance_type END AS insurance_type,
         k.created_at AS requested_at,
         k.clock_start,
         k.clock_start + interval '45 minutes' AS due_at,
         (
           SELECT COALESCE(sum(GREATEST(0, EXTRACT(EPOCH FROM (
                    LEAST(np.ts, (day::date + time '19:00') AT TIME ZONE 'Europe/Paris')
                    - GREATEST(k.clock_start, (day::date + time '08:00') AT TIME ZONE 'Europe/Paris')
                  )) / 60)), 0)::integer
           FROM generate_series(
             (k.clock_start AT TIME ZONE 'Europe/Paris')::date,
             np.local_ts::date,
             interval '1 day'
           ) AS day
         ) AS business_minutes_elapsed,
         (
           SELECT count(*)::integer FROM public.lead_alert_log l
           WHERE l.deal_id = k.deal_id AND l.status = 'failed'
         ) AS failed_attempts
  FROM clocked k
  CROSS JOIN now_paris np
  LEFT JOIN public.contacts ct ON ct.id = k.contact_id
  LEFT JOIN public.insurance_quotes iq
    ON k.source_type = 'insurance_quote' AND iq.id = k.source_id
  LEFT JOIN public.contact_callbacks cb
    ON k.source_type = 'contact_callback' AND cb.id = k.source_id
  WHERE np.local_ts::time >= time '08:00'
    AND np.local_ts::time < time '19:00'
    AND np.ts >= k.clock_start + interval '45 minutes'
    AND (CASE WHEN k.source_type = 'contact_callback' THEN cb.last_contacted_at
              ELSE iq.last_contacted_at END) IS NULL
    AND NOT EXISTS (
      SELECT 1 FROM public.activities a
      WHERE a.deal_id = k.deal_id
        AND a.author_id IS NOT NULL
        AND a.action_type IN ('task_completed', 'email', 'note', 'call', 'sms', 'meeting')
    )
    AND NOT EXISTS (
      SELECT 1 FROM public.lead_alert_log l
      WHERE l.deal_id = k.deal_id AND l.status = 'sent'
    )
    AND (
      SELECT count(*) FROM public.lead_alert_log l
      WHERE l.deal_id = k.deal_id AND l.status = 'failed'
    ) < 3
  ORDER BY k.created_at ASC
  LIMIT GREATEST(1, LEAST(COALESCE(p_limit, 10), 10));
$function$;

REVOKE EXECUTE ON FUNCTION public.get_unhandled_leads(integer) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.get_unhandled_leads(integer) FROM anon;
REVOKE EXECUTE ON FUNCTION public.get_unhandled_leads(integer) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.get_unhandled_leads(integer) TO service_role;
