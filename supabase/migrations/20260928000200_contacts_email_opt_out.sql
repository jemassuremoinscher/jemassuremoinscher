-- Ajoute un flag de desabonnement email sur contacts, absent jusqu'ici
-- (seul newsletter_subscribers avait un mecanisme equivalent, sans rapport
-- avec les contacts issus des devis/callbacks). Necessaire pour honorer le
-- droit d'opposition promis par la politique de confidentialite (privacy.s7)
-- avant tout envoi automatique non transactionnel (relances, avis Google,
-- futurs emails de fidelisation).

ALTER TABLE public.contacts
  ADD COLUMN IF NOT EXISTS email_opt_out boolean NOT NULL DEFAULT false;

-- Pas de nouvelle policy necessaire : contacts_write_admin (FOR ALL, admin
-- uniquement) couvre deja la mise a jour de cette colonne cote CRM.
-- L'ecriture par email-optout (Edge Function publique) se fait avec la
-- cle service_role, qui contourne RLS - voir supabase/functions/email-optout.
