
CREATE TABLE public.deal_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id uuid NOT NULL REFERENCES public.deals(id) ON DELETE CASCADE,
  actor_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  actor_email text,
  action text NOT NULL,
  field_name text,
  old_value text,
  new_value text,
  metadata jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX deal_audit_log_deal_idx ON public.deal_audit_log(deal_id, created_at DESC);
CREATE INDEX deal_audit_log_actor_idx ON public.deal_audit_log(actor_id);

GRANT SELECT, INSERT ON public.deal_audit_log TO authenticated;
GRANT ALL ON public.deal_audit_log TO service_role;

ALTER TABLE public.deal_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "audit_select_scoped" ON public.deal_audit_log
  FOR SELECT TO authenticated
  USING (
    has_role(auth.uid(), 'admin'::app_role)
    OR EXISTS (
      SELECT 1 FROM public.deals d
      WHERE d.id = deal_audit_log.deal_id AND d.assigned_to = auth.uid()
    )
  );

CREATE POLICY "audit_insert_auth" ON public.deal_audit_log
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

-- Trigger function: record changes on deals
CREATE OR REPLACE FUNCTION public.log_deal_changes()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_actor uuid := auth.uid();
  v_email text;
BEGIN
  SELECT email INTO v_email FROM auth.users WHERE id = v_actor;

  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.deal_audit_log (deal_id, actor_id, actor_email, action, new_value, metadata)
    VALUES (NEW.id, v_actor, v_email, 'created', NEW.stage::text,
            jsonb_build_object('insurance_type', NEW.insurance_type, 'source_type', NEW.source_type));
    RETURN NEW;
  END IF;

  IF TG_OP = 'UPDATE' THEN
    IF NEW.stage IS DISTINCT FROM OLD.stage THEN
      INSERT INTO public.deal_audit_log (deal_id, actor_id, actor_email, action, field_name, old_value, new_value)
      VALUES (NEW.id, v_actor, v_email, 'stage_changed', 'stage', OLD.stage::text, NEW.stage::text);
    END IF;
    IF NEW.assigned_to IS DISTINCT FROM OLD.assigned_to THEN
      INSERT INTO public.deal_audit_log (deal_id, actor_id, actor_email, action, field_name, old_value, new_value)
      VALUES (NEW.id, v_actor, v_email, 'assigned', 'assigned_to', OLD.assigned_to::text, NEW.assigned_to::text);
    END IF;
    IF NEW.notes IS DISTINCT FROM OLD.notes THEN
      INSERT INTO public.deal_audit_log (deal_id, actor_id, actor_email, action, field_name, old_value, new_value)
      VALUES (NEW.id, v_actor, v_email, 'updated', 'notes', left(coalesce(OLD.notes,''), 500), left(coalesce(NEW.notes,''), 500));
    END IF;
    IF NEW.estimated_commission IS DISTINCT FROM OLD.estimated_commission THEN
      INSERT INTO public.deal_audit_log (deal_id, actor_id, actor_email, action, field_name, old_value, new_value)
      VALUES (NEW.id, v_actor, v_email, 'updated', 'estimated_commission', OLD.estimated_commission::text, NEW.estimated_commission::text);
    END IF;
    IF NEW.actual_commission IS DISTINCT FROM OLD.actual_commission THEN
      INSERT INTO public.deal_audit_log (deal_id, actor_id, actor_email, action, field_name, old_value, new_value)
      VALUES (NEW.id, v_actor, v_email, 'updated', 'actual_commission', OLD.actual_commission::text, NEW.actual_commission::text);
    END IF;
    IF NEW.insurance_type IS DISTINCT FROM OLD.insurance_type THEN
      INSERT INTO public.deal_audit_log (deal_id, actor_id, actor_email, action, field_name, old_value, new_value)
      VALUES (NEW.id, v_actor, v_email, 'updated', 'insurance_type', OLD.insurance_type, NEW.insurance_type);
    END IF;
    IF NEW.lead_score IS DISTINCT FROM OLD.lead_score THEN
      INSERT INTO public.deal_audit_log (deal_id, actor_id, actor_email, action, field_name, old_value, new_value)
      VALUES (NEW.id, v_actor, v_email, 'updated', 'lead_score', OLD.lead_score::text, NEW.lead_score::text);
    END IF;
    IF NEW.deleted_at IS DISTINCT FROM OLD.deleted_at THEN
      INSERT INTO public.deal_audit_log (deal_id, actor_id, actor_email, action, field_name, old_value, new_value)
      VALUES (NEW.id, v_actor, v_email,
              CASE WHEN NEW.deleted_at IS NULL THEN 'restored' ELSE 'deleted' END,
              'deleted_at', OLD.deleted_at::text, NEW.deleted_at::text);
    END IF;
    RETURN NEW;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_log_deal_changes ON public.deals;
CREATE TRIGGER trg_log_deal_changes
  AFTER INSERT OR UPDATE ON public.deals
  FOR EACH ROW EXECUTE FUNCTION public.log_deal_changes();
