
-- Normalize existing insurance_type values to canonical slugs
UPDATE public.insurance_quotes SET insurance_type = 'auto' WHERE LOWER(TRIM(insurance_type)) IN ('assurance auto', 'assurance automobile', 'automobile');
UPDATE public.insurance_quotes SET insurance_type = 'moto' WHERE LOWER(TRIM(insurance_type)) IN ('assurance moto');
UPDATE public.insurance_quotes SET insurance_type = 'habitation' WHERE LOWER(TRIM(insurance_type)) IN ('assurance habitation');
UPDATE public.insurance_quotes SET insurance_type = 'sante' WHERE LOWER(TRIM(insurance_type)) IN ('assurance sante', 'assurance santé', 'mutuelle', 'mutuelle santé', 'mutuelle tns', 'santé');
UPDATE public.insurance_quotes SET insurance_type = 'pret' WHERE LOWER(TRIM(insurance_type)) IN ('assurance pret', 'assurance prêt', 'assurance prêt immobilier', 'assurance pret immobilier', 'prêt');
UPDATE public.insurance_quotes SET insurance_type = 'animaux' WHERE LOWER(TRIM(insurance_type)) IN ('assurance animaux');
UPDATE public.insurance_quotes SET insurance_type = 'vie' WHERE LOWER(TRIM(insurance_type)) IN ('assurance vie');
UPDATE public.insurance_quotes SET insurance_type = 'prevoyance' WHERE LOWER(TRIM(insurance_type)) IN ('assurance prevoyance', 'assurance prévoyance', 'prévoyance');
UPDATE public.insurance_quotes SET insurance_type = 'rc_pro' WHERE LOWER(TRIM(insurance_type)) IN ('rc pro', 'rc professionnelle', 'assurance rc pro', 'assurance rcpro');
UPDATE public.insurance_quotes SET insurance_type = 'mrp' WHERE LOWER(TRIM(insurance_type)) IN ('assurance mrp', 'multirisque professionnelle');
UPDATE public.insurance_quotes SET insurance_type = 'gli' WHERE LOWER(TRIM(insurance_type)) IN ('assurance gli', 'garantie loyers impayés', 'garantie loyers impayes');
UPDATE public.insurance_quotes SET insurance_type = 'pno' WHERE LOWER(TRIM(insurance_type)) IN ('assurance pno', 'propriétaire non occupant', 'proprietaire non occupant');
