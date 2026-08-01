import { Link } from "react-router-dom";
import { blogArticles } from "@/data/blogArticles";
import { useSupabaseBlogArticles } from "@/hooks/useSupabaseBlogArticles";

interface RelatedArticlesProps {
  currentSlug?: string;
  category?: string;
  tags?: string[];
  /** Filter articles whose slug or tags/category match one of these keywords (used on pillar pages). */
  keywords?: string[];
  limit?: number;
  title?: string;
}

const norm = (s: string) => s.toLowerCase();

const RelatedArticles = ({
  currentSlug,
  category,
  tags = [],
  keywords,
  limit = 4,
  title = "Articles similaires",
}: RelatedArticlesProps) => {
  const { articles: dynamicArticles } = useSupabaseBlogArticles();
  const pool = [...dynamicArticles, ...blogArticles].filter((a) => a.slug !== currentSlug);

  const scored = pool
    .map((a) => {
      let score = 0;
      const hay = `${a.slug} ${a.category} ${a.tags.join(" ")}`.toLowerCase();
      if (keywords?.length) {
        for (const kw of keywords) if (hay.includes(norm(kw))) score += 3;
      }
      if (category && a.category === category) score += 2;
      for (const t of tags) {
        if (a.tags.some((at) => norm(at) === norm(t))) score += 1;
      }
      return { article: a, score };
    })
    .filter((x) => (keywords?.length ? x.score > 0 : true))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.article);

  if (scored.length === 0) return null;

  return (
    <section className="mt-12 border-t border-border/40 pt-8" aria-labelledby="related-articles-heading">
      <h2 id="related-articles-heading" className="text-xl md:text-2xl font-bold text-foreground mb-4">
        {title}
      </h2>
      <ul className="grid gap-3 sm:grid-cols-2">
        {scored.map((a) => (
          <li key={a.id}>
            <Link
              to={`/blog/${a.slug}`}
              className="block rounded-xl border border-border/40 bg-card p-4 hover:border-primary/40 hover:shadow-sm transition-colors"
            >
              <span className="block text-sm font-semibold text-foreground line-clamp-2">{a.title}</span>
              <span className="mt-1 block text-xs text-muted-foreground line-clamp-2">{a.description}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default RelatedArticles;
