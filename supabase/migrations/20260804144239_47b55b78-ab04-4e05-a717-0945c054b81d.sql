GRANT SELECT ON public.sales_agents TO authenticated;
GRANT ALL ON public.sales_agents TO service_role;

DROP FUNCTION IF EXISTS public.supprimer_deal_manuel(uuid);

CREATE OR REPLACE FUNCTION public.supprimer_deal_manuel(p_deal_id uuid, p_confirm_site boolean DEFAULT false)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE v_source text; v_stage text; v_nom text;
BEGIN
  SELECT d.source_type, d.stage::text, coalesce(c.full_name,'sans nom')
    INTO v_source, v_stage, v_nom
  FROM deals d LEFT JOIN contacts c ON c.id=d.contact_id
  WHERE d.id=p_deal_id AND d.deleted_at IS NULL;

  IF v_source IS NULL THEN
    RETURN jsonb_build_object('ok',false,'motif','Deal introuvable ou déjà supprimé');
  END IF;

  IF v_source NOT IN ('crm_manual','opportunite_multi_equipement') THEN
    IF NOT public.has_role(auth.uid(), 'admin') THEN
      RETURN jsonb_build_object('ok',false,
        'motif','Ce lead provient du site ('||v_source||'). Seul un administrateur peut le supprimer.');
    END IF;
    IF NOT p_confirm_site THEN
      RETURN jsonb_build_object('ok',false,
        'motif','Ce lead provient du site ('||v_source||'). Une double confirmation est requise.');
    END IF;
  END IF;

  UPDATE deals SET deleted_at = now(), updated_at = now() WHERE id = p_deal_id;

  INSERT INTO activities (deal_id, author_id, action_type, description, metadata, created_at)
  VALUES (p_deal_id, auth.uid(), 'deal_deleted',
          'Lead supprimé : '||v_nom,
          jsonb_build_object('source_type',v_source,'stage',v_stage,'confirme_site',p_confirm_site), now());

  RETURN jsonb_build_object('ok',true,'message','Lead « '||v_nom||' » supprimé');
END;
$$;

UPDATE public.site_error_log SET resolved_at = now() WHERE resolved_at IS NULL;