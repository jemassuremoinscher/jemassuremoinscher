-- Durcissement de sales_agents, trouvé en marge de l'investigation du bug "Gestion des
-- Commerciaux" signalé par le moniteur Lovable (2026-09-04). Le bug de permission original
-- ne s'est pas reproduit avec le vrai compte admin (contact@) : CREATE et UPDATE ont été
-- testés en direct et fonctionnent. Il datait très probablement d'avant la bascule du
-- projet Supabase / le correctif de timeout AuthContext de ce soir et s'est résolu avec eux.
--
-- Deux points de robustesse trouvés en chemin, indépendants de ce bug, corrigés ici :

-- 1) SÉCURITÉ : anon (visiteur non authentifié) avait DELETE/INSERT/UPDATE/TRUNCATE sur
--    sales_agents au niveau table. SELECT était déjà révoqué (20260318173812) ; seule la RLS
--    empêchait l'exploitation publique en écriture. anon n'a besoin d'aucun de ces privilèges.
REVOKE DELETE, INSERT, UPDATE, TRUNCATE ON public.sales_agents FROM anon;

-- 2) ROBUSTESSE : la policy "Admins can manage sales agents" (FOR ALL) n'avait pas de
--    WITH CHECK explicite. Postgres retombe sur USING en son absence pour une policy FOR ALL
--    (comportement vérifié en conditions réelles), mais un WITH CHECK explicite rend
--    l'intention lisible sans dépendre de ce comportement implicite.
DROP POLICY IF EXISTS "Admins can manage sales agents" ON public.sales_agents;
CREATE POLICY "Admins can manage sales agents"
  ON public.sales_agents
  FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
