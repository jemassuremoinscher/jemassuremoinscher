-- Enable pg_cron extension for scheduling
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule SEO suggestions generation 3x per week: Monday, Wednesday, Friday at 9:00 UTC
SELECT cron.schedule(
    'generate-seo-suggestions-3x-weekly',
    '0 9 * * 1,3,5',
    $$
  SELECT
      net.http_post(
        url:='https://YOUR_SUPABASE_URL/functions/v1/generate-seo-suggestions',
        headers:=jsonb_build_object(
          'Authorization', 'Bearer YOUR_ANON_KEY',
          'Content-Type', 'application/json'
        ),
        body:='{}'::jsonb
      ) as request_id;
  $$
) AS cron_job_id;

-- NOTE: Replace YOUR_SUPABASE_URL and YOUR_ANON_KEY with actual values
-- Cron schedule: '0 9 * * 1,3,5' = 9:00 UTC on Monday (1), Wednesday (3), Friday (5)
