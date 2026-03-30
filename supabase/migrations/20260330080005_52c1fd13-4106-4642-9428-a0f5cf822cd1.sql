-- Fix: Allow admins to INSERT into sales_agents
CREATE POLICY "Admins can insert sales agents"
ON public.sales_agents
FOR INSERT TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Add signed_before_hot column to insurance_quotes
ALTER TABLE public.insurance_quotes 
ADD COLUMN IF NOT EXISTS signed_before_hot boolean DEFAULT false;

-- Add signed_before_hot column to contact_callbacks
ALTER TABLE public.contact_callbacks 
ADD COLUMN IF NOT EXISTS signed_before_hot boolean DEFAULT false;