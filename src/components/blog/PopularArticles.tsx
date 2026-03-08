import { Link } from "react-router-dom";
import { TrendingUp, Clock } from "lucide-react";
import { blogArticles } from "@/data/blogArticles";

interface PopularArticlesProps {
  currentSlug?: string;
}

const PopularArticles = ({ currentSlug }: PopularArticlesProps) => {
  // Pick 5 popular articles (first 5 excluding current)
  const popular = blogArticles
    .filter((a) => a.slug !== currentSlug)
    .slice(0, 5);

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
