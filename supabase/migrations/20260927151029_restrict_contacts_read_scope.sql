-- Audit securite du 2026-09-27 : contacts_read_auth autorisait TOUT
-- utilisateur authentifie (USING (true)) a lire TOUTE la table contacts
-- (noms, emails, telephones de tous les leads), sans lien avec ses propres
-- dossiers. deals/activities/documents sont deja scopes par assigned_to ;
-- contacts n'avait pas la meme granularite. Corrige pour aligner :
-- admin OU agent ayant un deal assigne pointant vers ce contact.

DROP POLICY IF EXISTS "contacts_read_auth" ON public.contacts;

CREATE POLICY "contacts_read_scoped" ON public.contacts FOR SELECT TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin'::app_role)
    OR EXISTS (
      SELECT 1 FROM public.deals d
      WHERE d.contact_id = contacts.id
        AND d.assigned_to = auth.uid()
    )
  );

-- contacts_write_admin (INSERT/UPDATE/DELETE reserve aux admins) est deja
-- correctement scope depuis la migration d'origine - inchange ici.
