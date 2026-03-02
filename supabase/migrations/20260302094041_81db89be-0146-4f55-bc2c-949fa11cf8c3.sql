-- Drop overly permissive policies if they still exist
DROP POLICY IF EXISTS "Authenticated users can view transfers" ON public.chatbot_transfers;
DROP POLICY IF EXISTS "Authenticated users can update transfers" ON public.chatbot_transfers;