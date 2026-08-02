import { Link } from "react-router-dom";
import { TrendingUp, Clock } from "lucide-react";
import { blogArticles, type BlogArticle } from "@/data/blogArticles";
import { useSupabaseBlogArticles } from "@/hooks/useSupabaseBlogArticles";

interface PopularArticlesProps {
  currentSlug?: string;
}

// Alterne les deux provenances (un Supabase, un .ts, etc.) plutôt que de
// laisser les articles dynamiques (souvent plus nombreux) monopoliser la
// liste. Une fois une source épuisée, complète avec le reste de l'autre.
const interleave = (a: BlogArticle[], b: BlogArticle[]): BlogArticle[] => {
  const result: BlogArticle[] = [];
  const max = Math.max(a.length, b.length);
  for (let i = 0; i < max; i++) {
    if (i < a.length) result.push(a[i]);
    if (i < b.length) result.push(b[i]);
  }
  return result;
};

const PopularArticles = ({ currentSlug }: PopularArticlesProps) => {
  const { articles: dynamicArticles } = useSupabaseBlogArticles();
  const dynamic = dynamicArticles.filter((a) => a.slug !== currentSlug);
  const stat = blogArticles.filter((a) => a.slug !== currentSlug);
  // Pick 5 popular articles, provenance alternée
  const popular = interleave(dynamic, stat).slice(0, 5);

  return (
    <aside className="bg-muted/30 rounded-2xl border border-border/30 p-5">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="h-4 w-4 text-primary" aria-hidden="true" />
        <h3 className="font-bold text-foreground text-sm uppercase tracking-wide">
          Articles populaires
        </h3>
      </div>
      <nav aria-label="Articles populaires">
        <ul className="space-y-3">
          {popular.map((article) => (
            <li key={article.id}>
              <Link
                to={`/blog/${article.slug}`}
                className="group block"
              >
                <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                  {article.title}
                </p>
                <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" aria-hidden="true" />
                  <span>{article.readTime}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default PopularArticles;
