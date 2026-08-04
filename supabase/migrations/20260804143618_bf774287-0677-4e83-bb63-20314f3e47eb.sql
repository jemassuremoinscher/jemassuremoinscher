DROP POLICY IF EXISTS "Anyone can request quotes" ON public.insurance_quotes;
CREATE POLICY "Anyone can request quotes"
ON public.insurance_quotes
FOR INSERT
TO public
WITH CHECK (
  status = 'pending'
  AND signed_before_hot IS NOT TRUE
  AND deleted_at IS NULL
  AND last_contacted_at IS NULL
  AND next_follow_up IS NULL
  AND notes IS NULL
  AND (lead_score IS NULL OR lead_score BETWEEN 0 AND 100)
);