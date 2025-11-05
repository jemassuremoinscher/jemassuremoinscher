-- Create table for blog comments
CREATE TABLE IF NOT EXISTS public.blog_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  article_slug TEXT NOT NULL,
  author_name TEXT NOT NULL,
  author_email TEXT NOT NULL,
  content TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT blog_comments_status_check CHECK (status IN ('pending', 'approved', 'rejected'))
);

-- Enable Row Level Security
ALTER TABLE public.blog_comments ENABLE ROW LEVEL SECURITY;

-- Create policies for blog comments
CREATE POLICY "Anyone can submit comments" 
ON public.blog_comments 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Only approved comments are visible" 
ON public.blog_comments 
FOR SELECT 
USING (status = 'approved');

-- Create index for better performance
CREATE INDEX idx_blog_comments_article_slug ON public.blog_comments(article_slug);
CREATE INDEX idx_blog_comments_status ON public.blog_comments(status);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_blog_comments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_blog_comments_updated_at
BEFORE UPDATE ON public.blog_comments
FOR EACH ROW
EXECUTE FUNCTION public.update_blog_comments_updated_at();

-- Create table for insurance quotes
CREATE TABLE IF NOT EXISTS public.insurance_quotes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  insurance_type TEXT NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  quote_data JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT insurance_quotes_status_check CHECK (status IN ('pending', 'contacted', 'converted', 'cancelled'))
);

-- Enable Row Level Security
ALTER TABLE public.insurance_quotes ENABLE ROW LEVEL SECURITY;

-- Create policy for insurance quotes
CREATE POLICY "Anyone can request quotes" 
ON public.insurance_quotes 
FOR INSERT 
WITH CHECK (true);

-- Create index for better performance
CREATE INDEX idx_insurance_quotes_insurance_type ON public.insurance_quotes(insurance_type);
CREATE INDEX idx_insurance_quotes_email ON public.insurance_quotes(email);
CREATE INDEX idx_insurance_quotes_created_at ON public.insurance_quotes(created_at);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_insurance_quotes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_insurance_quotes_updated_at
BEFORE UPDATE ON public.insurance_quotes
FOR EACH ROW
EXECUTE FUNCTION public.update_insurance_quotes_updated_at();