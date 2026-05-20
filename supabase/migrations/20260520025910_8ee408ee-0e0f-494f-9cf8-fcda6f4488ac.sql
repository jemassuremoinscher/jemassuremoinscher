-- Add 'owner' role to app_role enum for server-side gated Finance panel access
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'owner';