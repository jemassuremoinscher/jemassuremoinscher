-- Fix search_path for chatbot transfers function
CREATE OR REPLACE FUNCTION public.handle_chatbot_transfers_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public;