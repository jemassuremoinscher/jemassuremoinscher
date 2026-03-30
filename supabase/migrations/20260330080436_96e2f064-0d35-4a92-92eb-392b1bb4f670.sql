-- Allow agents without auth accounts (assignable-only agents)
ALTER TABLE public.sales_agents ALTER COLUMN user_id DROP NOT NULL;