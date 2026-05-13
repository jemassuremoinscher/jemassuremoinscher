import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, FileText, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { blogArticlesExpat2026 } from "@/data/blogArticlesExpat2026";
import { blogArticlesNiches2026 } from "@/data/blogArticlesNiches2026";

const parseFrenchDate = (s: string) => {
  const months: Record<string, number> = {
    janvier: 0, février: 1, fevrier: 1, mars: 2, avril: 3, mai: 4, juin: 5,
    juillet: 6, août: 7, aout: 7, septembre: 8, octobre: 9, novembre: 10, décembre: 11, decembre: 11,
  };
  const m = s.toLowerCase().match(/(\d+)\s+([a-zéûôà]+)\s+(\d{4})/);
  if (!m) return new Date(s);
  return new Date(parseInt(m[3]), months[m[2]] ?? 0, parseInt(m[1]));
};

export const StaticArticlesPanel = () => {
  const now = Date.now();
  const groups = [
    { label: "Expatriés", color: "bg-primary/10 text-primary", articles: blogArticlesExpat2026 },
    { label: "Niches", color: "bg-secondary/10 text-secondary-foreground", articles: blogArticlesNiches2026 },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <CardTitle className="flex items-center gap-2 flex-wrap">
              <FileText className="h-5 w-5 text-primary" />
              Articles statiques (code)
              <Badge variant="outline">
                {groups.reduce((n, g) => n + g.articles.length, 0)} articles
              </Badge>
            </CardTitle>
            <CardDescription className="flex items-center gap-1.5 text-xs">
              <Lock className="h-3 w-3" />
              Lecture seule — ces articles sont versionnés dans le code (auto-publication à la date prévue).
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {groups.map((g) => (
          <div key={g.label}>
            <div className="mb-3 flex items-center gap-2">
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${g.color}`}>{g.label}</span>
              <span className="text-xs text-muted-foreground">{g.articles.length} articles</span>
            </div>
            <div className="grid gap-2">
              {g.articles.map((a) => {
                const date = parseFrenchDate(a.date);
                const isPublished = date.getTime() <= now;
                return (
                  <div
                    key={a.slug}
                    className="flex items-center justify-between gap-3 p-3 rounded-lg border border-border hover:bg-muted/40 transition-colors"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="font-semibold text-sm truncate">{a.title}</span>
                        {isPublished ? (
                          <Badge className="bg-primary/15 text-primary text-[10px]">En ligne</Badge>
                        ) : (
                          <Badge variant="outline" className="text-[10px]">
                            Programmé · {a.date}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">/{a.slug}</p>
                    </div>
                    <Button asChild variant="outline" size="sm" className="rounded-full shrink-0">
                      <Link to={`/blog/${a.slug}`} target="_blank" rel="noopener noreferrer">
                        Voir
                        <ExternalLink className="ml-1.5 h-3 w-3" />
                      </Link>
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default StaticArticlesPanel;
