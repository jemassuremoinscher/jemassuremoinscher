CREATE OR REPLACE FUNCTION public.cleanup_old_deleted_items()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  IF NOT has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'Unauthorized: admin role required';
  END IF;

  DELETE FROM public.insurance_quotes
  WHERE deleted_at IS NOT NULL AND deleted_at < NOW() - INTERVAL '180 days';

  DELETE FROM public.contact_callbacks
  WHERE deleted_at IS NOT NULL AND deleted_at < NOW() - INTERVAL '180 days';

  DELETE FROM public.deals
  WHERE deleted_at IS NOT NULL AND deleted_at < NOW() - INTERVAL '180 days';
END;
$function$;