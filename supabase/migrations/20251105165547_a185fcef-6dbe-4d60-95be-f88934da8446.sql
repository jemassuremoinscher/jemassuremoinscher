-- Add deleted_at column to insurance_quotes
ALTER TABLE public.insurance_quotes 
ADD COLUMN deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;

-- Add deleted_at column to contact_callbacks
ALTER TABLE public.contact_callbacks 
ADD COLUMN deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;

-- Create index for faster queries on deleted items
CREATE INDEX idx_insurance_quotes_deleted_at ON public.insurance_quotes(deleted_at) WHERE deleted_at IS NOT NULL;
CREATE INDEX idx_contact_callbacks_deleted_at ON public.contact_callbacks(deleted_at) WHERE deleted_at IS NOT NULL;

-- Function to permanently delete old items (older than 30 days)
CREATE OR REPLACE FUNCTION public.cleanup_old_deleted_items()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Delete insurance quotes older than 30 days
  DELETE FROM public.insurance_quotes
  WHERE deleted_at IS NOT NULL 
    AND deleted_at < NOW() - INTERVAL '30 days';

  -- Delete contact callbacks older than 30 days
  DELETE FROM public.contact_callbacks
  WHERE deleted_at IS NOT NULL 
    AND deleted_at < NOW() - INTERVAL '30 days';
END;
$$;