-- Alerte "demande de devis non traitée après 45 minutes ouvrées"
-- (fonction alert-unhandled-leads). Deux tables :
--
-- 1) alert_recipients : destinataires de l'alerte, jamais codés en dur dans
--    la fonction. Si aucun destinataire actif, la fonction n'envoie rien et
--    écrit une erreur dans site_error_log.
-- 2) lead_alert_log : une ligne par deal et par tentative. Même principe que
--    quote_followup_log : 'sent' n'est écrit qu'après succès Resend confirmé,
--    l'index unique partiel garantit une seule alerte 'sent' par deal, et un
--    'failed' reste retentable (arrêt après 3 'failed', appliqué dans
--    get_unhandled_leads()).
--
-- RLS activée, accès service_role uniquement (aucune policy pour anon ni
-- authenticated).

CREATE TABLE IF NOT EXISTS public.alert_recipients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.alert_recipients ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.alert_recipients FROM anon, authenticated;
GRANT ALL ON public.alert_recipients TO service_role;

CREATE TABLE IF NOT EXISTS public.lead_alert_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id uuid NOT NULL REFERENCES public.deals(id) ON DELETE CASCADE,
  status text NOT NULL CHECK (status IN ('sent', 'failed')),
  error_message text,
  resend_email_id text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Une seule alerte confirmée par deal ; les 'failed' ne sont pas couverts.
CREATE UNIQUE INDEX IF NOT EXISTS lead_alert_log_sent_unique
  ON public.lead_alert_log (deal_id)
  WHERE status = 'sent';

CREATE INDEX IF NOT EXISTS lead_alert_log_deal_idx ON public.lead_alert_log (deal_id);

ALTER TABLE public.lead_alert_log ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.lead_alert_log FROM anon, authenticated;
GRANT ALL ON public.lead_alert_log TO service_role;
