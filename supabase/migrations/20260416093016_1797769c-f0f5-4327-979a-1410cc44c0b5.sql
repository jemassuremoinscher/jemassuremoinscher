
-- Table to track LinkedIn auto-posting configuration and history
CREATE TABLE public.linkedin_auto_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_slug TEXT NOT NULL,
  article_title TEXT NOT NULL,
  post_content TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'posted', 'failed')),
  posted_at TIMESTAMPTZ,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Table for storing the webhook URL config (single row)
CREATE TABLE public.linkedin_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  webhook_url TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  post_day TEXT NOT NULL DEFAULT 'monday',
  post_hour INTEGER NOT NULL DEFAULT 9,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS
ALTER TABLE public.linkedin_auto_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.linkedin_config ENABLE ROW LEVEL SECURITY;

-- Only admins can manage these tables
CREATE POLICY "Admins can manage linkedin posts"
ON public.linkedin_auto_posts FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage linkedin config"
ON public.linkedin_config FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Updated_at trigger for config
CREATE TRIGGER update_linkedin_config_updated_at
  BEFORE UPDATE ON public.linkedin_config
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
