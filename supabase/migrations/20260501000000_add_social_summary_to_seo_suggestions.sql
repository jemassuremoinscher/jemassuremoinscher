-- Add social_summary column to seo_article_suggestions table for social media previews
ALTER TABLE public.seo_article_suggestions 
ADD COLUMN social_summary TEXT;

-- Create index for better query performance
CREATE INDEX idx_seo_article_social_summary 
ON public.seo_article_suggestions(social_summary);
