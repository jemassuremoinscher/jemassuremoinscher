-- Créer une table pour suivre les emails envoyés
CREATE TABLE public.email_tracking (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  quote_id UUID REFERENCES public.insurance_quotes(id) ON DELETE SET NULL,
  recipient_email TEXT NOT NULL,
  recipient_name TEXT NOT NULL,
  email_type TEXT NOT NULL,
  subject TEXT NOT NULL,
  resend_email_id TEXT,
  status TEXT NOT NULL DEFAULT 'sent',
  sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  opened_at TIMESTAMP WITH TIME ZONE,
  clicked_at TIMESTAMP WITH TIME ZONE,
  open_count INTEGER NOT NULL DEFAULT 0,
  click_count INTEGER NOT NULL DEFAULT 0,
  last_event_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.email_tracking ENABLE ROW LEVEL SECURITY;

-- Admin can view all email tracking data
CREATE POLICY "Admins can view all email tracking"
ON public.email_tracking
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admin can update email tracking data (for webhook updates)
CREATE POLICY "Admins can update email tracking"
ON public.email_tracking
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Allow edge function to insert email tracking
CREATE POLICY "Service role can insert email tracking"
ON public.email_tracking
FOR INSERT
WITH CHECK (true);

-- Allow edge function to update email tracking
CREATE POLICY "Service role can update email tracking"
ON public.email_tracking
FOR UPDATE
USING (true);

-- Create index for faster queries
CREATE INDEX idx_email_tracking_quote_id ON public.email_tracking(quote_id);
CREATE INDEX idx_email_tracking_recipient ON public.email_tracking(recipient_email);
CREATE INDEX idx_email_tracking_resend_id ON public.email_tracking(resend_email_id);

-- Create trigger to update updated_at
CREATE TRIGGER update_email_tracking_updated_at
BEFORE UPDATE ON public.email_tracking
FOR EACH ROW
EXECUTE FUNCTION public.update_newsletter_updated_at();