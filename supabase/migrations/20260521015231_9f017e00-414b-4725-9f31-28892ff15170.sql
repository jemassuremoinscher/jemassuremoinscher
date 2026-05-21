UPDATE public.seo_article_suggestions
SET status = 'pending', published_at = NULL
WHERE id IN (
  '50932511-c3c4-41ec-b852-3717e74f37b2',
  'cf6e7d18-8dd6-4740-bf3f-5f5423e6335f',
  '23648e4b-b71e-41ce-9f9d-986fa3fc2e22',
  'bd52ca54-8daa-40e9-ba45-ccf5d6dbb7ef',
  '1de13f35-a0c7-44ca-bb09-3187401dd5a0',
  '925d0504-5075-4cd3-87b0-b20e975731e8',
  'a79828e1-a38a-4246-be03-2b3fcb209a3b'
);