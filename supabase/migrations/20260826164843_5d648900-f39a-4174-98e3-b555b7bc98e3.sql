CREATE TABLE public.backup_snapshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  trigger_source text NOT NULL DEFAULT 'cron',
  status text NOT NULL DEFAULT 'running',
  tables jsonb NOT NULL DEFAULT '{}'::jsonb,
  row_count integer NOT NULL DEFAULT 0,
  file_path text,
  size_bytes bigint,
  error_message text,
  completed_at timestamptz
);

GRANT SELECT ON public.backup_snapshots TO authenticated;
GRANT ALL ON public.backup_snapshots TO service_role;

ALTER TABLE public.backup_snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view backups"
ON public.backup_snapshots FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'owner'));

CREATE INDEX idx_backup_snapshots_created_at ON public.backup_snapshots (created_at DESC);

-- Récupération automatique des accès pour les comptes internes
CREATE OR REPLACE FUNCTION public.recover_internal_access()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _uid uuid := auth.uid();
  _email text;
  _granted boolean := false;
  _linked boolean := false;
BEGIN
  IF _uid IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'not_authenticated');
  END IF;

  SELECT email INTO _email FROM auth.users WHERE id = _uid;

  IF _email IS NULL OR lower(_email) NOT LIKE '%@jemassuremoinscher.fr' THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'not_internal');
  END IF;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (_uid, 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;
  _granted := FOUND;

  UPDATE public.sales_agents
     SET user_id = _uid, updated_at = now()
   WHERE lower(email) = lower(_email)
     AND (user_id IS NULL OR user_id <> _uid);
  _linked := FOUND;

  RETURN jsonb_build_object('ok', true, 'role_granted', _granted, 'agent_linked', _linked, 'email', _email);
END;
$$;

REVOKE ALL ON FUNCTION public.recover_internal_access() FROM public;
GRANT EXECUTE ON FUNCTION public.recover_internal_access() TO authenticated;