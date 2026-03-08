import { Link } from "react-router-dom";
import { Tag } from "lucide-react";
import { glossaryTerms } from "@/data/glossaryTerms";

interface SuggestedKeywordsProps {
  tags: string[];
}

const SuggestedKeywords = ({ tags }: SuggestedKeywordsProps) => {
  // Match article tags to glossary entries
  const matchedTerms = glossaryTerms.filter((term) =>
    tags.some(
      (tag) =>
        term.term.toLowerCase().includes(tag.toLowerCase()) ||
        tag.toLowerCase().includes(term.term.toLowerCase()) ||
        term.tags.some((t) => t.toLowerCase().includes(tag.toLowerCase()))
    )
  );

  // Also add some popular glossary terms for internal linking
  const popularSlugs = ["franchise", "prime-assurance", "bonus-malus", "loi-hamon", "resiliation"];
  const popularTerms = glossaryTerms.filter(
    (t) => popularSlugs.includes(t.slug) && !matchedTerms.find((m) => m.id === t.id)
  );

  const allTerms = [...matchedTerms, ...popularTerms].slice(0, 8);

  if (allTerms.length === 0) return null;

  return (
    <div className="mt-10 p-6 bg-muted/50 rounded-2xl border border-border/30">
      <div className="flex items-center gap-2 mb-4">
        <Tag className="h-4 w-4 text-primary" aria-hidden="true" />
        <h3 className="font-semibold text-foreground text-sm uppercase tracking-wide">
          Mots-clés suggérés — Glossaire
        </h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {allTerms.map((term) => (
          <Link
            key={term.id}
            to={`/glossaire/${term.slug}`}
            className="inline-flex items-center px-3 py-1.5 rounded-full text-sm bg-primary/10 text-primary hover:bg-primary/20 transition-colors font-medium"
          >
            {term.term}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SuggestedKeywords;
