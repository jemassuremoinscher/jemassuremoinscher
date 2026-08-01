import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { blogArticles, type BlogArticle } from "@/data/blogArticles";

// `category`, `read_time`, `tags`, `noindex`, `social_headlines`, `legacy_id`
// et `source` existent en base mais ne figurent pas dans
// src/integrations/supabase/types.ts (généré, pas régénéré depuis leur ajout —
// cf. crmApi.ts pour le même contournement sur d'autres tables/colonnes).
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const seoArticleSuggestions = (): any => supabase.from("seo_article_suggestions");

const SELECT_COLUMNS =
  "title, slug, suggested_meta_description, suggested_content, suggested_author, image_url, " +
  "published_at, created_at, target_keyword, category, read_time, tags, social_headlines, legacy_id";

interface SupabaseArticleRow {
  title: string;
  slug: string;
  suggested_meta_description: string | null;
  suggested_content: string | null;
  suggested_author: string | null;
  image_url: string | null;
  published_at: string | null;
  created_at: string;
  target_keyword: string | null;
  category: string | null;
  read_time: string | null;
  tags: string[] | null;
  social_headlines: BlogArticle["socialHeadlines"] | null;
  legacy_id: string | null;
}

const formatFrenchDate = (value?: string | null) => {
  if (!value) return new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  return new Date(value).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
};

// Dérive category/readTime/tags quand la colonne DB est vide (les 97 lignes
// existantes n'ont pas encore été renseignées) — jamais afficher du vide.
export const mapSupabaseRowToArticle = (row: SupabaseArticleRow): BlogArticle => {
  const wordCount = (row.suggested_content || "").split(/\s+/).length;
  return {
    id: row.legacy_id || `dynamic-${row.slug}`,
    title: row.title,
    slug: row.slug,
    description: row.suggested_meta_description || row.title,
    category: row.category || "Conseils Experts",
    date: formatFrenchDate(row.published_at || row.created_at),
    readTime: row.read_time || `${Math.max(5, Math.ceil(wordCount / 220))} min`,
    author: row.suggested_author || "L'équipe d'experts Jemassuremoinscher",
    image: row.image_url || undefined,
    content: row.suggested_content || "",
    tags: row.tags?.length ? row.tags : [row.target_keyword, "assurance", "conseils"].filter(Boolean) as string[],
    socialHeadlines: row.social_headlines || undefined,
  };
};

// Filtre commun : seuls les articles réellement publiés et indexables.
// noindex=true et published_at NULL ou futur sont exclus (cf. generate-static-pages.mjs
// qui applique la même règle status='approved' AND published_at<=now côté build statique).
const applyPublishedFilter = (query: any) =>
  query
    .eq("status", "approved")
    .eq("noindex", false)
    .not("published_at", "is", null)
    .lte("published_at", new Date().toISOString())
    .not("slug", "ilike", "%test%");

const existingSlugs = new Set(blogArticles.map((a) => a.slug));

// Liste des articles Supabase absents de src/data/ (évite les doublons avec les
// slugs déjà sourcés en code, ex. loi-lemoine-assurance-emprunteur-2026).
// Un seul fetch partagé entre tous les consommateurs via react-query.
export const useSupabaseBlogArticles = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["supabase-blog-articles"],
    queryFn: async () => {
      const { data, error } = await applyPublishedFilter(
        seoArticleSuggestions().select(SELECT_COLUMNS),
      ).order("published_at", { ascending: false });
      if (error) throw error;
      return ((data ?? []) as SupabaseArticleRow[])
        .filter((row) => !existingSlugs.has(row.slug))
        .map(mapSupabaseRowToArticle);
    },
    staleTime: 5 * 60 * 1000,
  });

  return { articles: data ?? [], isLoading };
};

// Article Supabase unique par slug — utilisé en repli quand le slug n'existe
// pas dans src/data/ (cf. BlogArticle.tsx). `enabled` doit rester false tant
// qu'un article statique correspondant a déjà été trouvé.
export const useSupabaseBlogArticle = (slug: string | undefined, enabled: boolean) => {
  const { data, isLoading } = useQuery({
    queryKey: ["supabase-blog-article", slug],
    queryFn: async () => {
      const { data, error } = await applyPublishedFilter(
        seoArticleSuggestions().select(SELECT_COLUMNS).eq("slug", slug),
      ).maybeSingle();
      if (error) throw error;
      return data ? mapSupabaseRowToArticle(data as SupabaseArticleRow) : null;
    },
    enabled: enabled && !!slug,
    staleTime: 5 * 60 * 1000,
  });

  return { article: data ?? null, isLoading: enabled ? isLoading : false };
};
