CREATE TABLE public.quote_funnel_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  insurance_type TEXT,
  step_index INTEGER NOT NULL,
  step_id TEXT,
  event_type TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_qfe_session ON public.quote_funnel_events(session_id);
CREATE INDEX idx_qfe_created ON public.quote_funnel_events(created_at DESC);
CREATE INDEX idx_qfe_step ON public.quote_funnel_events(step_index, event_type);

ALTER TABLE public.quote_funnel_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can log funnel events"
ON public.quote_funnel_events
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Admins can read funnel events"
ON public.quote_funnel_events
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));