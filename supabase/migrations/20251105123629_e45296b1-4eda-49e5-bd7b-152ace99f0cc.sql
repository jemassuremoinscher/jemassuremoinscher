-- Create table for contact callbacks
CREATE TABLE IF NOT EXISTS public.contact_callbacks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  preferred_time TEXT NOT NULL,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT contact_callbacks_status_check CHECK (status IN ('pending', 'contacted', 'completed', 'cancelled'))
);

-- Enable Row Level Security
ALTER TABLE public.contact_callbacks ENABLE ROW LEVEL SECURITY;

-- Create policy for contact callbacks
CREATE POLICY "Anyone can request callbacks" 
ON public.contact_callbacks 
FOR INSERT 
WITH CHECK (true);

-- Create index for better performance
CREATE INDEX idx_contact_callbacks_status ON public.contact_callbacks(status);
CREATE INDEX idx_contact_callbacks_created_at ON public.contact_callbacks(created_at);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_contact_callbacks_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_contact_callbacks_updated_at
BEFORE UPDATE ON public.contact_callbacks
FOR EACH ROW
EXECUTE FUNCTION public.update_contact_callbacks_updated_at();