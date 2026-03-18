-- Fix 1: Revoke anon SELECT on sensitive tables
REVOKE SELECT ON public.insurance_quotes FROM anon;
REVOKE SELECT ON public.sales_agents FROM anon;
REVOKE SELECT ON public.chatbot_transfers FROM anon;

-- Fix 2: Drop overly broad chatbot_transfers policies
DROP POLICY IF EXISTS "Authenticated users can view transfers" ON public.chatbot_transfers;
DROP POLICY IF EXISTS "Authenticated users can update transfers" ON public.chatbot_transfers;

-- Fix 3: Drop any broad public SELECT policies that may exist
DROP POLICY IF EXISTS "Public can view sales agents" ON public.sales_agents;
DROP POLICY IF EXISTS "Anyone can view sales agents" ON public.sales_agents;
DROP POLICY IF EXISTS "Public can view insurance quotes" ON public.insurance_quotes;
DROP POLICY IF EXISTS "Anyone can view insurance quotes" ON public.insurance_quotes;