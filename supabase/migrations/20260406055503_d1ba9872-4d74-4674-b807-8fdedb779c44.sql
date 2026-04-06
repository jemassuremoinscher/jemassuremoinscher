CREATE TABLE public.page_meta_overrides (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_path TEXT NOT NULL UNIQUE,
  meta_title TEXT,
  meta_description TEXT,
  og_title TEXT,
  og_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.page_meta_overrides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read page meta" ON public.page_meta_overrides
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage page meta" ON public.page_meta_overrides
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_page_meta_updated_at
  BEFORE UPDATE ON public.page_meta_overrides
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();