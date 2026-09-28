-- Garde-fou anti-derive : verifie que les noms de templates utilises par le
-- code (triggers, Edge Functions) correspondent a des lignes actives dans
-- email_templates. A appeler manuellement ou depuis un test/CI, jamais par
-- l'application elle-meme (pas de dependance runtime ajoutee).
--
-- Corrige le 2026-09-28 : la premiere version comparait une colonne "name"
-- ambigue (celle de unnest() masquait celle de email_templates dans le
-- WHERE), ce qui faisait que la fonction ne levait jamais d'exception meme
-- avec un nom manquant - prouve en base par Paul. Alias explicite sur la
-- colonne derivee de unnest() pour lever l'ambiguite.

CREATE OR REPLACE FUNCTION public.assert_template_names_exist(expected_names text[])
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_missing text[];
BEGIN
  SELECT array_agg(n.tname) INTO v_missing
  FROM unnest(expected_names) AS n(tname)
  WHERE NOT EXISTS (
    SELECT 1 FROM public.email_templates et
    WHERE et.name = n.tname AND et.is_active = true
  );

  IF v_missing IS NOT NULL THEN
    RAISE EXCEPTION 'Templates manquants ou inactifs : %', array_to_string(v_missing, ', ');
  END IF;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.assert_template_names_exist(text[]) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.assert_template_names_exist(text[]) FROM anon;
REVOKE EXECUTE ON FUNCTION public.assert_template_names_exist(text[]) FROM authenticated;
