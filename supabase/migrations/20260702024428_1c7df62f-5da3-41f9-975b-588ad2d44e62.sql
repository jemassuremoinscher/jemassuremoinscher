ALTER TABLE public.newsletter_subscribers ADD COLUMN IF NOT EXISTS source text NOT NULL DEFAULT 'newsletter';
CREATE INDEX IF NOT EXISTS idx_newsletter_source ON public.newsletter_subscribers(source);