
DO $$ BEGIN
  CREATE TYPE public.deal_stage AS ENUM ('lead','qualified','quote_sent','subscription','incomplete','won','lost');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.doc_status AS ENUM ('manquant','attente','valide');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT, full_name TEXT, is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "profiles_select_self_or_admin" ON public.profiles;
CREATE POLICY "profiles_select_self_or_admin" ON public.profiles FOR SELECT TO authenticated
  USING (id = auth.uid() OR public.has_role(auth.uid(),'admin'::app_role));
DROP POLICY IF EXISTS "profiles_update_self_or_admin" ON public.profiles;
CREATE POLICY "profiles_update_self_or_admin" ON public.profiles FOR UPDATE TO authenticated
  USING (id = auth.uid() OR public.has_role(auth.uid(),'admin'::app_role));
DROP POLICY IF EXISTS "profiles_insert_self_or_admin" ON public.profiles;
CREATE POLICY "profiles_insert_self_or_admin" ON public.profiles FOR INSERT TO authenticated
  WITH CHECK (id = auth.uid() OR public.has_role(auth.uid(),'admin'::app_role));

INSERT INTO public.profiles (id, email, full_name)
SELECT u.id, u.email, COALESCE(u.raw_user_meta_data->>'full_name', split_part(u.email,'@',1))
FROM auth.users u ON CONFLICT (id) DO NOTHING;

CREATE OR REPLACE FUNCTION public.handle_new_user_profile()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id,email,full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email,'@',1)))
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END; $$;
DROP TRIGGER IF EXISTS on_auth_user_created_profile ON auth.users;
CREATE TRIGGER on_auth_user_created_profile AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_profile();

CREATE TABLE IF NOT EXISTS public.contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT, last_name TEXT, full_name TEXT,
  email TEXT, phone TEXT, source TEXT,
  tags TEXT[] NOT NULL DEFAULT '{}',
  rgpd_consent BOOLEAN NOT NULL DEFAULT false,
  rgpd_consent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (email)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.contacts TO authenticated;
GRANT ALL ON public.contacts TO service_role;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "contacts_read_auth" ON public.contacts;
CREATE POLICY "contacts_read_auth" ON public.contacts FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "contacts_write_admin" ON public.contacts;
CREATE POLICY "contacts_write_admin" ON public.contacts FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(),'admin'::app_role));
CREATE INDEX IF NOT EXISTS contacts_email_idx ON public.contacts (email);

CREATE TABLE IF NOT EXISTS public.deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id UUID REFERENCES public.contacts(id) ON DELETE SET NULL,
  assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  insurance_type TEXT NOT NULL,
  stage public.deal_stage NOT NULL DEFAULT 'lead',
  lead_score INTEGER,
  estimated_commission NUMERIC(10,2),
  actual_commission NUMERIC(10,2),
  source_type TEXT, source_id UUID,
  notes TEXT, deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (source_type, source_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.deals TO authenticated;
GRANT ALL ON public.deals TO service_role;
ALTER TABLE public.deals ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "deals_select_scoped" ON public.deals;
CREATE POLICY "deals_select_scoped" ON public.deals FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(),'admin'::app_role) OR assigned_to = auth.uid());
DROP POLICY IF EXISTS "deals_insert_admin" ON public.deals;
CREATE POLICY "deals_insert_admin" ON public.deals FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(),'admin'::app_role));
DROP POLICY IF EXISTS "deals_update_scoped" ON public.deals;
CREATE POLICY "deals_update_scoped" ON public.deals FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(),'admin'::app_role) OR assigned_to = auth.uid())
  WITH CHECK (public.has_role(auth.uid(),'admin'::app_role) OR assigned_to = auth.uid());
DROP POLICY IF EXISTS "deals_delete_admin" ON public.deals;
CREATE POLICY "deals_delete_admin" ON public.deals FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(),'admin'::app_role));
CREATE INDEX IF NOT EXISTS deals_stage_idx ON public.deals (stage);
CREATE INDEX IF NOT EXISTS deals_assigned_idx ON public.deals (assigned_to);
CREATE INDEX IF NOT EXISTS deals_contact_idx ON public.deals (contact_id);

CREATE TABLE IF NOT EXISTS public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id UUID NOT NULL REFERENCES public.deals(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  status public.doc_status NOT NULL DEFAULT 'manquant',
  file_path TEXT, uploaded_at TIMESTAMPTZ, notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.documents TO authenticated;
GRANT ALL ON public.documents TO service_role;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "documents_scoped_all" ON public.documents;
CREATE POLICY "documents_scoped_all" ON public.documents FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin'::app_role)
    OR EXISTS (SELECT 1 FROM public.deals d WHERE d.id = documents.deal_id AND d.assigned_to = auth.uid()))
  WITH CHECK (public.has_role(auth.uid(),'admin'::app_role)
    OR EXISTS (SELECT 1 FROM public.deals d WHERE d.id = documents.deal_id AND d.assigned_to = auth.uid()));
CREATE INDEX IF NOT EXISTS documents_deal_idx ON public.documents (deal_id);

CREATE TABLE IF NOT EXISTS public.activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id UUID NOT NULL REFERENCES public.deals(id) ON DELETE CASCADE,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action_type TEXT NOT NULL, description TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.activities TO authenticated;
GRANT ALL ON public.activities TO service_role;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "activities_select_scoped" ON public.activities;
CREATE POLICY "activities_select_scoped" ON public.activities FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(),'admin'::app_role)
    OR EXISTS (SELECT 1 FROM public.deals d WHERE d.id = activities.deal_id AND d.assigned_to = auth.uid()));
DROP POLICY IF EXISTS "activities_insert_scoped" ON public.activities;
CREATE POLICY "activities_insert_scoped" ON public.activities FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(),'admin'::app_role)
    OR EXISTS (SELECT 1 FROM public.deals d WHERE d.id = activities.deal_id AND d.assigned_to = auth.uid()));
CREATE INDEX IF NOT EXISTS activities_deal_idx ON public.activities (deal_id, created_at DESC);

DROP TRIGGER IF EXISTS trg_contacts_updated_at ON public.contacts;
CREATE TRIGGER trg_contacts_updated_at BEFORE UPDATE ON public.contacts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
DROP TRIGGER IF EXISTS trg_deals_updated_at ON public.deals;
CREATE TRIGGER trg_deals_updated_at BEFORE UPDATE ON public.deals
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
DROP TRIGGER IF EXISTS trg_documents_updated_at ON public.documents;
CREATE TRIGGER trg_documents_updated_at BEFORE UPDATE ON public.documents
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
DROP TRIGGER IF EXISTS trg_profiles_updated_at ON public.profiles;
CREATE TRIGGER trg_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.map_status_to_stage(_status TEXT)
RETURNS public.deal_stage LANGUAGE sql IMMUTABLE AS $$
  SELECT CASE lower(coalesce(_status,'pending'))
    WHEN 'pending' THEN 'lead'::public.deal_stage
    WHEN 'contacted' THEN 'qualified'::public.deal_stage
    WHEN 'quoted' THEN 'quote_sent'::public.deal_stage
    WHEN 'converted' THEN 'won'::public.deal_stage
    WHEN 'rejected' THEN 'lost'::public.deal_stage
    ELSE 'lead'::public.deal_stage END;
$$;

-- Backfill contacts
INSERT INTO public.contacts (email, full_name, phone, source, rgpd_consent, created_at)
SELECT DISTINCT ON (lower(iq.email))
  lower(iq.email), iq.full_name, iq.phone, 'insurance_quote', true, iq.created_at
FROM public.insurance_quotes iq
WHERE iq.email IS NOT NULL AND iq.deleted_at IS NULL
ORDER BY lower(iq.email), iq.created_at ASC
ON CONFLICT (email) DO NOTHING;

INSERT INTO public.contacts (email, full_name, phone, source, rgpd_consent, created_at)
SELECT DISTINCT ON (lower(cc.email))
  lower(cc.email), cc.full_name, cc.phone, 'contact_callback', true, cc.created_at
FROM public.contact_callbacks cc
WHERE cc.email IS NOT NULL AND cc.deleted_at IS NULL
ORDER BY lower(cc.email), cc.created_at ASC
ON CONFLICT (email) DO NOTHING;

-- Backfill deals (nullify assigned_to when user no longer exists)
INSERT INTO public.deals (contact_id, assigned_to, insurance_type, stage, lead_score, source_type, source_id, notes, created_at)
SELECT c.id,
       CASE WHEN u.id IS NULL THEN NULL ELSE iq.assigned_to END,
       iq.insurance_type,
       public.map_status_to_stage(iq.status), iq.lead_score,
       'insurance_quote', iq.id, iq.notes, iq.created_at
FROM public.insurance_quotes iq
JOIN public.contacts c ON c.email = lower(iq.email)
LEFT JOIN auth.users u ON u.id = iq.assigned_to
WHERE iq.deleted_at IS NULL
ON CONFLICT (source_type, source_id) DO NOTHING;

INSERT INTO public.deals (contact_id, assigned_to, insurance_type, stage, lead_score, source_type, source_id, notes, created_at)
SELECT c.id,
       CASE WHEN u.id IS NULL THEN NULL ELSE cc.assigned_to END,
       'contact',
       public.map_status_to_stage(cc.status), cc.lead_score,
       'contact_callback', cc.id, cc.notes, cc.created_at
FROM public.contact_callbacks cc
JOIN public.contacts c ON c.email = lower(cc.email)
LEFT JOIN auth.users u ON u.id = cc.assigned_to
WHERE cc.deleted_at IS NULL
ON CONFLICT (source_type, source_id) DO NOTHING;

-- Bridge triggers for future site inserts
CREATE OR REPLACE FUNCTION public.bridge_quote_to_deal()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_contact_id UUID; v_assigned UUID;
BEGIN
  INSERT INTO public.contacts (email, full_name, phone, source, rgpd_consent)
  VALUES (lower(NEW.email), NEW.full_name, NEW.phone, 'insurance_quote', true)
  ON CONFLICT (email) DO UPDATE SET
    full_name = COALESCE(EXCLUDED.full_name, public.contacts.full_name),
    phone = COALESCE(EXCLUDED.phone, public.contacts.phone),
    updated_at = now()
  RETURNING id INTO v_contact_id;

  SELECT id INTO v_assigned FROM auth.users WHERE id = NEW.assigned_to;

  INSERT INTO public.deals (contact_id, assigned_to, insurance_type, stage, lead_score, source_type, source_id, notes, created_at)
  VALUES (v_contact_id, v_assigned, NEW.insurance_type,
          public.map_status_to_stage(NEW.status), NEW.lead_score,
          'insurance_quote', NEW.id, NEW.notes, NEW.created_at)
  ON CONFLICT (source_type, source_id) DO NOTHING;
  RETURN NEW;
END; $$;
DROP TRIGGER IF EXISTS trg_bridge_quote_to_deal ON public.insurance_quotes;
CREATE TRIGGER trg_bridge_quote_to_deal AFTER INSERT ON public.insurance_quotes
  FOR EACH ROW EXECUTE FUNCTION public.bridge_quote_to_deal();

CREATE OR REPLACE FUNCTION public.bridge_callback_to_deal()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_contact_id UUID; v_assigned UUID;
BEGIN
  INSERT INTO public.contacts (email, full_name, phone, source, rgpd_consent)
  VALUES (lower(NEW.email), NEW.full_name, NEW.phone, 'contact_callback', true)
  ON CONFLICT (email) DO UPDATE SET
    full_name = COALESCE(EXCLUDED.full_name, public.contacts.full_name),
    phone = COALESCE(EXCLUDED.phone, public.contacts.phone),
    updated_at = now()
  RETURNING id INTO v_contact_id;

  SELECT id INTO v_assigned FROM auth.users WHERE id = NEW.assigned_to;

  INSERT INTO public.deals (contact_id, assigned_to, insurance_type, stage, lead_score, source_type, source_id, notes, created_at)
  VALUES (v_contact_id, v_assigned, 'contact',
          public.map_status_to_stage(NEW.status), NEW.lead_score,
          'contact_callback', NEW.id, NEW.notes, NEW.created_at)
  ON CONFLICT (source_type, source_id) DO NOTHING;
  RETURN NEW;
END; $$;
DROP TRIGGER IF EXISTS trg_bridge_callback_to_deal ON public.contact_callbacks;
CREATE TRIGGER trg_bridge_callback_to_deal AFTER INSERT ON public.contact_callbacks
  FOR EACH ROW EXECUTE FUNCTION public.bridge_callback_to_deal();

CREATE OR REPLACE FUNCTION public.bridge_newsletter_to_contact()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.contacts (email, source, tags, rgpd_consent)
  VALUES (lower(NEW.email), COALESCE(NEW.source,'newsletter'),
          ARRAY[COALESCE(NEW.source,'newsletter')], true)
  ON CONFLICT (email) DO UPDATE SET
    tags = (SELECT ARRAY(SELECT DISTINCT unnest(public.contacts.tags || ARRAY[COALESCE(NEW.source,'newsletter')]))),
    updated_at = now();
  RETURN NEW;
END; $$;
DROP TRIGGER IF EXISTS trg_bridge_newsletter_to_contact ON public.newsletter_subscribers;
CREATE TRIGGER trg_bridge_newsletter_to_contact AFTER INSERT ON public.newsletter_subscribers
  FOR EACH ROW EXECUTE FUNCTION public.bridge_newsletter_to_contact();

INSERT INTO public.contacts (email, source, tags, rgpd_consent, created_at)
SELECT lower(ns.email), COALESCE(ns.source,'newsletter'),
       ARRAY[COALESCE(ns.source,'newsletter')], true, ns.created_at
FROM public.newsletter_subscribers ns
WHERE ns.email IS NOT NULL
ON CONFLICT (email) DO UPDATE SET
  tags = (SELECT ARRAY(SELECT DISTINCT unnest(public.contacts.tags || EXCLUDED.tags)));
