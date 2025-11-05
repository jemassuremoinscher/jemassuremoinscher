-- Create table for chatbot transfer requests
CREATE TABLE public.chatbot_transfers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  visitor_name TEXT,
  visitor_email TEXT NOT NULL,
  visitor_phone TEXT,
  conversation_history JSONB NOT NULL DEFAULT '[]'::jsonb,
  transfer_reason TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'assigned', 'completed', 'cancelled')),
  assigned_to UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.chatbot_transfers ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can create a transfer request
CREATE POLICY "Anyone can create transfer requests"
ON public.chatbot_transfers
FOR INSERT
TO anon
WITH CHECK (true);

-- Policy: Authenticated users can view all transfer requests (for admin dashboard)
CREATE POLICY "Authenticated users can view transfers"
ON public.chatbot_transfers
FOR SELECT
TO authenticated
USING (true);

-- Policy: Authenticated users can update transfer requests
CREATE POLICY "Authenticated users can update transfers"
ON public.chatbot_transfers
FOR UPDATE
TO authenticated
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.handle_chatbot_transfers_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_chatbot_transfers_updated_at
BEFORE UPDATE ON public.chatbot_transfers
FOR EACH ROW
EXECUTE FUNCTION public.handle_chatbot_transfers_updated_at();

-- Create index for faster queries
CREATE INDEX idx_chatbot_transfers_status ON public.chatbot_transfers(status);
CREATE INDEX idx_chatbot_transfers_created_at ON public.chatbot_transfers(created_at DESC);