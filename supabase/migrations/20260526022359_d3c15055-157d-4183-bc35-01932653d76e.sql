UPDATE public.page_meta_overrides
SET
  meta_title = regexp_replace(meta_title, '\(?\s*(Janvier|Février|Fevrier|Mars|Avril|Mai|Juin|Juillet|Août|Aout|Septembre|Octobre|Novembre|Décembre|Decembre)\s+\d{4}\s*\)?', '[Month]', 'gi'),
  meta_description = regexp_replace(meta_description, '\(?\s*(Janvier|Février|Fevrier|Mars|Avril|Mai|Juin|Juillet|Août|Aout|Septembre|Octobre|Novembre|Décembre|Decembre)\s+\d{4}\s*\)?', '[Month]', 'gi'),
  og_title = regexp_replace(og_title, '\(?\s*(Janvier|Février|Fevrier|Mars|Avril|Mai|Juin|Juillet|Août|Aout|Septembre|Octobre|Novembre|Décembre|Decembre)\s+\d{4}\s*\)?', '[Month]', 'gi'),
  og_description = regexp_replace(og_description, '\(?\s*(Janvier|Février|Fevrier|Mars|Avril|Mai|Juin|Juillet|Août|Aout|Septembre|Octobre|Novembre|Décembre|Decembre)\s+\d{4}\s*\)?', '[Month]', 'gi')
WHERE page_path NOT LIKE '\_\_content-improvement\_\_/%' ESCAPE '\'
  AND (
    meta_title ~* '(Janvier|Février|Fevrier|Mars|Avril|Mai|Juin|Juillet|Août|Aout|Septembre|Octobre|Novembre|Décembre|Decembre)\s+\d{4}'
    OR meta_description ~* '(Janvier|Février|Fevrier|Mars|Avril|Mai|Juin|Juillet|Août|Aout|Septembre|Octobre|Novembre|Décembre|Decembre)\s+\d{4}'
    OR og_title ~* '(Janvier|Février|Fevrier|Mars|Avril|Mai|Juin|Juillet|Août|Aout|Septembre|Octobre|Novembre|Décembre|Decembre)\s+\d{4}'
    OR og_description ~* '(Janvier|Février|Fevrier|Mars|Avril|Mai|Juin|Juillet|Août|Aout|Septembre|Octobre|Novembre|Décembre|Decembre)\s+\d{4}'
  );