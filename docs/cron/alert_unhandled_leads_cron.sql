-- À APPLIQUER MANUELLEMENT (Paul), après un dry-run de la fonction :
--   POST https://ybqxpngkbgosobtetxac.supabase.co/functions/v1/alert-unhandled-leads
--   Authorization: Bearer <cron_secret>   body: {"dryRun": true}
-- Volontairement HORS de supabase/migrations pour qu'aucune synchronisation
-- (Lovable) ne l'applique automatiquement.
--
--
-- Cron toutes les 10 minutes pour alert-unhandled-leads, sur le même modèle
-- que send-followup-reminders-daily : net.http_post (schéma "net"), secret
-- lu depuis public.cron_config au moment de l'exécution, jamais codé en dur.
-- Le cron tourne 24h/24 (pg_cron est en UTC ici) : c'est la fonction SQL
-- get_unhandled_leads() qui ne renvoie rien hors 8h-19h heure de Paris, et
-- la fonction edge refuse aussi d'envoyer hors de ces horaires.

SELECT cron.unschedule('alert-unhandled-leads-10min')
WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'alert-unhandled-leads-10min');

SELECT cron.schedule(
  'alert-unhandled-leads-10min',
  '*/10 * * * *',
  $$
  SELECT net.http_post(
    url := 'https://ybqxpngkbgosobtetxac.supabase.co/functions/v1/alert-unhandled-leads',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || (SELECT value FROM public.cron_config WHERE lower(key) = 'cron_secret' LIMIT 1)
    ),
    body := '{}'::jsonb,
    timeout_milliseconds := 60000
  );
  $$
);
