SELECT cron.unschedule('db-backup-daily');

SELECT cron.schedule(
  'db-backup-daily',
  '0 1 * * *',
  $$
  SELECT net.http_post(
    url := 'https://ybqxpngkbgosobtetxac.supabase.co/functions/v1/db-backup',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || (SELECT value FROM public.cron_config WHERE lower(key) = 'cron_secret' LIMIT 1)
    ),
    body := '{}'::jsonb,
    timeout_milliseconds := 300000
  );
  $$
);