-- A: Approve the 4 pending drafts
UPDATE public.seo_article_suggestions
SET status = 'approved',
    published_at = LEAST(COALESCE(published_at, now()), now())
WHERE status = 'draft'
  AND id IN (
    '5c2063e3-186a-4a14-a113-e70a86ca425b',
    'ae853ab4-7136-4928-970a-6731381232bc',
    '147674a7-7e0d-4343-86da-166e0e7b94ff',
    'a58098d8-7b60-4153-af92-f7363eb4f9ae'
  );

-- B: Remove duplicate weekly cron
SELECT cron.unschedule(2);

-- C: Shared cron secret table (locked down, only postgres/service_role can read)
CREATE TABLE IF NOT EXISTS public.cron_config (
  key text PRIMARY KEY,
  value text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.cron_config ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.cron_config FROM anon, authenticated;
GRANT ALL ON public.cron_config TO service_role;

-- Generate random cron secret if not already set
INSERT INTO public.cron_config (key, value)
VALUES ('cron_secret', encode(decode(replace(gen_random_uuid()::text || gen_random_uuid()::text, '-', ''), 'hex'), 'hex'))
ON CONFLICT (key) DO NOTHING;

-- Reschedule the 3 cron jobs with proper auth: apikey=anon (gateway), Authorization=Bearer CRON_SECRET (function)
SELECT cron.unschedule(7);
SELECT cron.unschedule(8);
SELECT cron.unschedule(9);

DO $$
DECLARE
  v_secret text;
  v_anon text := 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlicXhwbmdrYmdvc29idGV0eGFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyNTM0NzksImV4cCI6MjA3NzgyOTQ3OX0.ekYS4QpTPlcJ82Cf4xXvwS1LsM4LhFodG-u31Mb7Rbg';
  v_cmd text;
BEGIN
  SELECT value INTO v_secret FROM public.cron_config WHERE key = 'cron_secret';

  v_cmd := format($f$
    SELECT net.http_post(
      url := 'https://ybqxpngkbgosobtetxac.supabase.co/functions/v1/generate-seo-suggestions',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'apikey', %L,
        'Authorization', 'Bearer ' || %L
      ),
      body := '{}'::jsonb,
      timeout_milliseconds := 120000
    ) AS request_id;
  $f$, v_anon, v_secret);

  PERFORM cron.schedule('seo-suggestions-mon', '0 8 * * 1', v_cmd);
  PERFORM cron.schedule('seo-suggestions-wed', '0 8 * * 3', v_cmd);
  PERFORM cron.schedule('seo-suggestions-fri', '0 8 * * 5', v_cmd);
END $$;