ALTER TABLE public.contact_callbacks DROP CONSTRAINT IF EXISTS contact_callbacks_status_check;
ALTER TABLE public.contact_callbacks ADD CONSTRAINT contact_callbacks_status_check CHECK (status = ANY (ARRAY['pending','contacted','no_answer','qualified','converted','completed','rejected','cancelled']));

ALTER TABLE public.insurance_quotes DROP CONSTRAINT IF EXISTS insurance_quotes_status_check;
ALTER TABLE public.insurance_quotes ADD CONSTRAINT insurance_quotes_status_check CHECK (status = ANY (ARRAY['pending','contacted','no_answer','qualified','converted','completed','rejected','cancelled']));