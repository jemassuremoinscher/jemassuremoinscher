import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ChevronRight } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  baseUrl?: string;
}

const Breadcrumbs = ({ items, baseUrl = "https://www.jemassuremoinscher.fr" }: BreadcrumbsProps) => {
  const allItems: BreadcrumbItem[] = [{ label: "Accueil", href: "/" }, ...items];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": allItems.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.label,
      ...(item.href ? { "item": `${baseUrl}${item.href}` } : {}),
    })),
  };

  return (
    <>
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>
      <nav aria-label="Breadcrumb" className="container mx-auto px-4 py-3">
        <ul className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
          {allItems.map((item, index) => {
            const isLast = index === allItems.length - 1;
            return (
              <li key={index} className="flex items-center gap-1">
                {index > 0 && (
                  <ChevronRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                )}
                {isLast || !item.href ? (
                  <span aria-current={isLast ? "page" : undefined} className="text-foreground/70">
                    {item.label}
                  </span>
                ) : (
                  <Link
                    to={item.href}
                    className="hover:text-primary transition-colors hover:underline"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
};

export default Breadcrumbs;
