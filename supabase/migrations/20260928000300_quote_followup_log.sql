-- Log d'idempotence pour send-followup-reminders. Contrairement a
-- deal_stage_email_log (qui marque "envoye" avant confirmation, defaut
-- decouvert et corrige le 2026-09-27 sur notify_deal_stage_email), cette
-- table n'enregistre un statut 'sent' qu'apres succes Resend confirme.
-- Un statut 'failed' n'empeche pas un futur passage du cron de retenter
-- (pas de contrainte UNIQUE sur les lignes 'failed').

CREATE TABLE IF NOT EXISTS public.quote_followup_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id uuid NOT NULL REFERENCES public.deals(id) ON DELETE CASCADE,
  milestone text NOT NULL CHECK (milestone IN ('j3', 'j7')),
  status text NOT NULL CHECK (status IN ('sent', 'failed')),
  resend_email_id text,
  error_message text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Unicite uniquement sur les envois confirmes reussis : un deal ne doit
-- jamais recevoir deux fois la meme relance, mais un echec doit pouvoir
-- etre retente (donc pas couvert par la contrainte).
CREATE UNIQUE INDEX quote_followup_log_sent_unique
  ON public.quote_followup_log (deal_id, milestone)
  WHERE status = 'sent';

CREATE INDEX quote_followup_log_deal_idx ON public.quote_followup_log (deal_id);

ALTER TABLE public.quote_followup_log ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.quote_followup_log FROM anon;
GRANT ALL ON public.quote_followup_log TO service_role;

CREATE POLICY "Admins can read followup log"
  ON public.quote_followup_log
  FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));
