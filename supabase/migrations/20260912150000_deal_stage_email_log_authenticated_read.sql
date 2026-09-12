-- Correctif : deal_stage_email_log n'avait qu'une policy SELECT admin-only,
-- mais le Kanban (badge "email auto envoyé" sur les cartes) est accessible à
-- tout utilisateur authentifié, pas seulement aux admins (le CRM principal
-- est derrière <AuthRoute> seul, pas <RequireAdmin> — même situation déjà
-- rencontrée et corrigée pour email_templates). Sans ce correctif, un
-- commercial non-admin ne verrait jamais le badge, silencieusement.
--
-- Les lignes ne contiennent rien de sensible (deal_id, stage, sent_at, un
-- resend_email_id opaque) : ouvrir la lecture à tout authentifié est sans
-- risque. La policy admin existante reste (redondante mais inoffensive).
CREATE POLICY "Authenticated users can read deal stage email log"
  ON public.deal_stage_email_log
  FOR SELECT
  TO authenticated
  USING (true);
