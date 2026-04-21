CREATE POLICY "Admins can delete campaigns"
ON public.google_ads_campaigns
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));