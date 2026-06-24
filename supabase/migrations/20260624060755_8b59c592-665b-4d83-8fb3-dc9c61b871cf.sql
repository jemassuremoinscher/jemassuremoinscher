
-- chatbot_transfers
DROP POLICY IF EXISTS "Anyone can create transfer requests" ON public.chatbot_transfers;
CREATE POLICY "Anyone can create transfer requests"
ON public.chatbot_transfers
FOR INSERT
WITH CHECK (
  status = 'pending'
  AND assigned_to IS NULL
);

-- contact_callbacks
DROP POLICY IF EXISTS "Anyone can request callbacks" ON public.contact_callbacks;
CREATE POLICY "Anyone can request callbacks"
ON public.contact_callbacks
FOR INSERT
WITH CHECK (
  status = 'pending'
  AND assigned_to IS NULL
  AND signed_before_hot IS NOT TRUE
  AND deleted_at IS NULL
  AND last_contacted_at IS NULL
  AND next_follow_up IS NULL
  AND notes IS NULL
  AND (lead_score IS NULL OR lead_score BETWEEN 0 AND 100)
);

-- insurance_quotes
DROP POLICY IF EXISTS "Anyone can request quotes" ON public.insurance_quotes;
CREATE POLICY "Anyone can request quotes"
ON public.insurance_quotes
FOR INSERT
WITH CHECK (
  status = 'pending'
  AND assigned_to IS NULL
  AND signed_before_hot IS NOT TRUE
  AND deleted_at IS NULL
  AND last_contacted_at IS NULL
  AND next_follow_up IS NULL
  AND notes IS NULL
  AND (lead_score IS NULL OR lead_score BETWEEN 0 AND 100)
);

-- quiz_leads
DROP POLICY IF EXISTS "Anyone can submit quiz leads" ON public.quiz_leads;
CREATE POLICY "Anyone can submit quiz leads"
ON public.quiz_leads
FOR INSERT
WITH CHECK (
  length(coalesce(full_name, '')) BETWEEN 2 AND 120
  AND length(coalesce(email, '')) BETWEEN 5 AND 254
  AND (recommendations IS NULL OR length(recommendations) <= 5000)
  AND octet_length(coalesce(answers::text, '{}')) <= 32768
);
