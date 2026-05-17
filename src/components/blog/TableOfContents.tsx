import { List } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export interface TocItem {
  id: string;
  title: string;
  level?: 2 | 3;
}

interface TableOfContentsProps {
  items: TocItem[];
  title?: string;
}

/**
 * Sommaire / Table of Contents with anchor links.
 * Semantic <nav> + <ul> for accessibility and SEO.
 */
const TableOfContents = ({ items, title = "Sommaire" }: TableOfContentsProps) => {
  const { t } = useLanguage();
  if (items.length === 0) return null;

  return (
    <nav
      aria-label={t("a11y.blog.toc")}
      className="bg-muted/30 border border-border/50 rounded-xl p-5 md:p-6"
    >
      <div className="flex items-center gap-2 mb-4">
        <List className="h-4 w-4 text-primary" aria-hidden="true" />
        <span className="text-sm font-semibold text-foreground uppercase tracking-wide">
          {title}
        </span>
      </div>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.id} className={item.level === 3 ? "ml-4" : ""}>
            <a
              href={`#${item.id}`}
              className="text-sm text-muted-foreground hover:text-primary transition-colors hover:underline underline-offset-2"
            >
              {item.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default TableOfContents;
