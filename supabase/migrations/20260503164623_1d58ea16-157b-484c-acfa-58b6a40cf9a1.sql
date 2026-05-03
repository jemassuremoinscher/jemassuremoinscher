
CREATE TABLE public.published_drafts (
  slug text PRIMARY KEY,
  published_at timestamptz NOT NULL DEFAULT now(),
  published_by uuid REFERENCES auth.users(id) ON DELETE SET NULL
);

ALTER TABLE public.published_drafts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read published drafts"
  ON public.published_drafts FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert published drafts"
  ON public.published_drafts FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete published drafts"
  ON public.published_drafts FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
