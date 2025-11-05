-- Fix Newsletter Subscriber RLS Policies

-- 1. Drop the insecure public SELECT policy
DROP POLICY IF EXISTS "Public can view confirmed subscriptions" ON public.newsletter_subscribers;

-- 2. Drop the insecure UPDATE policy that allows anyone to modify anything
DROP POLICY IF EXISTS "Users can update their subscription" ON public.newsletter_subscribers;

-- 3. Create a secure UPDATE policy that uses confirmation tokens
-- Only allow updates when the confirmation token matches
CREATE POLICY "Users can update via confirmation token" 
ON public.newsletter_subscribers 
FOR UPDATE 
USING (confirmation_token IS NOT NULL)
WITH CHECK (
  status IN ('active', 'unsubscribed') AND
  confirmation_token IS NOT NULL
);

-- 4. Add admin-only SELECT policy (for future admin functionality)
-- This denies all SELECT operations by default
CREATE POLICY "No public access to subscriber data" 
ON public.newsletter_subscribers 
FOR SELECT 
USING (false);