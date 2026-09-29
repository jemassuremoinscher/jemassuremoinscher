-- Cron quotidien pour send-followup-reminders, sur le même modèle que
-- db-backup-daily (migrations 20260826165148/165230) : net.http_post nu
-- (schéma "net", pas "extensions.net"), secret lu depuis public.cron_config
-- au moment de l'exécution (jamais codé en dur dans la migration).
--
-- Horaire choisi : 8h UTC, soit ~10h heure de Paris en heure d'été
-- (comme actuellement, fin septembre) et 9h en heure d'hiver - pg_cron
-- tourne en UTC ici (aucune configuration de timezone trouvée dans ce
-- projet, cf. db-backup-daily qui suppose la même chose). À vérifier après
-- déploiement si l'heure réelle d'envoi ne convient pas.

SELECT cron.unschedule('send-followup-reminders-daily')
WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'send-followup-reminders-daily');

SELECT cron.schedule(
  'send-followup-reminders-daily',
  '0 8 * * *',
  $$
  SELECT net.http_post(
    url := 'https://ybqxpngkbgosobtetxac.supabase.co/functions/v1/send-followup-reminders',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || (SELECT value FROM public.cron_config WHERE lower(key) = 'cron_secret' LIMIT 1)
    ),
    body := '{}'::jsonb,
    timeout_milliseconds := 120000
  );
  $$
);
