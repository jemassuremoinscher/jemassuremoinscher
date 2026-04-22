
-- ============================================================
-- 1. Add missing admin UPDATE/DELETE policies on google_ads_conversions
-- ============================================================
CREATE POLICY "Admins can update conversions"
ON public.google_ads_conversions
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete conversions"
ON public.google_ads_conversions
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- ============================================================
-- 2. Server-side validation for public form submissions
-- These triggers enforce data quality without breaking the
-- "anyone can INSERT" policy required for anonymous lead capture.
-- ============================================================

-- Helper: validate basic email format
CREATE OR REPLACE FUNCTION public.is_valid_email(_email text)
RETURNS boolean
LANGUAGE sql
IMMUTABLE
SET search_path = public
AS $$
  SELECT _email IS NOT NULL
    AND length(_email) BETWEEN 5 AND 254
    AND _email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$';
$$;

-- Validate insurance_quotes
CREATE OR REPLACE FUNCTION public.validate_insurance_quote()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT is_valid_email(NEW.email) THEN
    RAISE EXCEPTION 'Invalid email format';
  END IF;
  IF length(NEW.full_name) < 2 OR length(NEW.full_name) > 120 THEN
    RAISE EXCEPTION 'Invalid full name length';
  END IF;
  IF length(NEW.phone) < 6 OR length(NEW.phone) > 30 THEN
    RAISE EXCEPTION 'Invalid phone length';
  END IF;
  IF length(NEW.insurance_type) > 60 THEN
    RAISE EXCEPTION 'Invalid insurance type';
  END IF;
  IF NEW.notes IS NOT NULL AND length(NEW.notes) > 5000 THEN
    RAISE EXCEPTION 'Notes too long';
  END IF;
  -- Force safe defaults on public insert (prevent privilege injection via insert)
  IF auth.uid() IS NULL THEN
    NEW.assigned_to := NULL;
    NEW.status := 'pending';
    NEW.deleted_at := NULL;
    NEW.last_contacted_at := NULL;
    NEW.next_follow_up := NULL;
    NEW.notes := NULL;
    NEW.signed_before_hot := false;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS validate_insurance_quote_trigger ON public.insurance_quotes;
CREATE TRIGGER validate_insurance_quote_trigger
BEFORE INSERT ON public.insurance_quotes
FOR EACH ROW EXECUTE FUNCTION public.validate_insurance_quote();

-- Validate contact_callbacks
CREATE OR REPLACE FUNCTION public.validate_contact_callback()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT is_valid_email(NEW.email) THEN
    RAISE EXCEPTION 'Invalid email format';
  END IF;
  IF length(NEW.full_name) < 2 OR length(NEW.full_name) > 120 THEN
    RAISE EXCEPTION 'Invalid full name length';
  END IF;
  IF length(NEW.phone) < 6 OR length(NEW.phone) > 30 THEN
    RAISE EXCEPTION 'Invalid phone length';
  END IF;
  IF NEW.message IS NOT NULL AND length(NEW.message) > 5000 THEN
    RAISE EXCEPTION 'Message too long';
  END IF;
  IF length(NEW.preferred_time) > 100 THEN
    RAISE EXCEPTION 'Invalid preferred time';
  END IF;
  IF auth.uid() IS NULL THEN
    NEW.assigned_to := NULL;
    NEW.status := 'pending';
    NEW.deleted_at := NULL;
    NEW.last_contacted_at := NULL;
    NEW.next_follow_up := NULL;
    NEW.notes := NULL;
    NEW.signed_before_hot := false;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS validate_contact_callback_trigger ON public.contact_callbacks;
CREATE TRIGGER validate_contact_callback_trigger
BEFORE INSERT ON public.contact_callbacks
FOR EACH ROW EXECUTE FUNCTION public.validate_contact_callback();

-- Validate newsletter_subscribers
CREATE OR REPLACE FUNCTION public.validate_newsletter_subscriber()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT is_valid_email(NEW.email) THEN
    RAISE EXCEPTION 'Invalid email format';
  END IF;
  IF auth.uid() IS NULL THEN
    -- Anonymous insert can only create a pending subscription
    NEW.status := COALESCE(NEW.status, 'pending');
    IF NEW.status NOT IN ('pending', 'confirmed') THEN
      NEW.status := 'pending';
    END IF;
    NEW.confirmed_at := NULL;
    NEW.unsubscribed_at := NULL;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS validate_newsletter_subscriber_trigger ON public.newsletter_subscribers;
CREATE TRIGGER validate_newsletter_subscriber_trigger
BEFORE INSERT ON public.newsletter_subscribers
FOR EACH ROW EXECUTE FUNCTION public.validate_newsletter_subscriber();

-- Validate blog_comments
CREATE OR REPLACE FUNCTION public.validate_blog_comment()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT is_valid_email(NEW.author_email) THEN
    RAISE EXCEPTION 'Invalid email format';
  END IF;
  IF length(NEW.author_name) < 2 OR length(NEW.author_name) > 80 THEN
    RAISE EXCEPTION 'Invalid author name length';
  END IF;
  IF length(NEW.content) < 2 OR length(NEW.content) > 5000 THEN
    RAISE EXCEPTION 'Invalid comment length';
  END IF;
  IF length(NEW.article_slug) > 200 THEN
    RAISE EXCEPTION 'Invalid article slug';
  END IF;
  -- Anonymous comments must always start as pending (moderation)
  IF auth.uid() IS NULL THEN
    NEW.status := 'pending';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS validate_blog_comment_trigger ON public.blog_comments;
CREATE TRIGGER validate_blog_comment_trigger
BEFORE INSERT ON public.blog_comments
FOR EACH ROW EXECUTE FUNCTION public.validate_blog_comment();

-- Validate chatbot_transfers
CREATE OR REPLACE FUNCTION public.validate_chatbot_transfer()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT is_valid_email(NEW.visitor_email) THEN
    RAISE EXCEPTION 'Invalid email format';
  END IF;
  IF NEW.visitor_name IS NOT NULL AND length(NEW.visitor_name) > 120 THEN
    RAISE EXCEPTION 'Invalid visitor name length';
  END IF;
  IF NEW.visitor_phone IS NOT NULL AND length(NEW.visitor_phone) > 30 THEN
    RAISE EXCEPTION 'Invalid phone length';
  END IF;
  IF NEW.transfer_reason IS NOT NULL AND length(NEW.transfer_reason) > 1000 THEN
    RAISE EXCEPTION 'Transfer reason too long';
  END IF;
  -- Cap the conversation history size (~64KB)
  IF octet_length(NEW.conversation_history::text) > 65536 THEN
    RAISE EXCEPTION 'Conversation history too large';
  END IF;
  IF auth.uid() IS NULL THEN
    NEW.assigned_to := NULL;
    NEW.status := 'pending';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS validate_chatbot_transfer_trigger ON public.chatbot_transfers;
CREATE TRIGGER validate_chatbot_transfer_trigger
BEFORE INSERT ON public.chatbot_transfers
FOR EACH ROW EXECUTE FUNCTION public.validate_chatbot_transfer();

-- Validate quiz_leads
CREATE OR REPLACE FUNCTION public.validate_quiz_lead()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT is_valid_email(NEW.email) THEN
    RAISE EXCEPTION 'Invalid email format';
  END IF;
  IF length(NEW.full_name) < 2 OR length(NEW.full_name) > 120 THEN
    RAISE EXCEPTION 'Invalid full name length';
  END IF;
  IF NEW.recommendations IS NOT NULL AND length(NEW.recommendations) > 5000 THEN
    RAISE EXCEPTION 'Recommendations too long';
  END IF;
  IF octet_length(NEW.answers::text) > 32768 THEN
    RAISE EXCEPTION 'Answers payload too large';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS validate_quiz_lead_trigger ON public.quiz_leads;
CREATE TRIGGER validate_quiz_lead_trigger
BEFORE INSERT ON public.quiz_leads
FOR EACH ROW EXECUTE FUNCTION public.validate_quiz_lead();
