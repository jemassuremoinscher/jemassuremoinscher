import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Search } from "lucide-react";

const TITLE_MAX = 60;
const DESC_MAX = 160;

const LengthBar = ({ current, max, label }: { current: number; max: number; label: string }) => {
  const ratio = current / max;
  const color = ratio <= 0.85 ? "bg-green-500" : ratio <= 1 ? "bg-amber-500" : "bg-destructive";
  const width = Math.min(ratio * 100, 100);

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{label}</span>
        <span className={ratio > 1 ? "text-destructive font-semibold" : ""}>
          {current}/{max}
        </span>
      </div>
      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${width}%` }} />
      </div>
    </div>
  );
};

const SERPPreview = () => {
  const [title, setTitle] = useState("Assurance Auto Moins Chère : -40% en 2 min ⭐");
  const [description, setDescription] = useState(
    "50+ assureurs comparés gratuitement. Nos clients économisent 320€/an en moyenne. Devis auto instantané, sans engagement."
  );
  const [url, setUrl] = useState("https://www.jemassuremoinscher.fr/assurance-auto");

  const truncatedTitle = title.length > 60 ? title.slice(0, 57) + "..." : title;
  const truncatedDesc = description.length > 160 ? description.slice(0, 157) + "..." : description;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5 text-primary" />
            SERP Snippet Preview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="serp-url">URL de la page</Label>
            <Input
              id="serp-url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://www.jemassuremoinscher.fr/..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="serp-title">Titre SEO</Label>
            <Input
              id="serp-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Titre de la page (max 60 caractères)"
            />
            <LengthBar current={title.length} max={TITLE_MAX} label="Longueur du titre" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="serp-desc">Meta Description</Label>
            <Textarea
              id="serp-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description de la page (max 160 caractères)"
              rows={3}
            />
            <LengthBar current={description.length} max={DESC_MAX} label="Longueur de la description" />
          </div>
        </CardContent>
      </Card>

      {/* Google SERP render */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm text-muted-foreground">Aperçu Google</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-white rounded-lg p-6 border border-border/50 max-w-2xl font-[Arial,sans-serif]">
            {/* URL line */}
            <div className="flex items-center gap-2 mb-1">
              <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center shrink-0">
                <span className="text-[10px] font-bold text-muted-foreground">J</span>
              </div>
              <div className="min-w-0">
                <p className="text-sm text-[#202124] truncate">jemassuremoinscher.fr</p>
                <p className="text-xs text-[#4d5156] truncate">{url}</p>
              </div>
            </div>
            {/* Title */}
            <h3 className="text-xl text-[#1a0dab] hover:underline cursor-pointer leading-snug mt-1 mb-1">
              {truncatedTitle}
            </h3>
            {/* Description */}
            <p className="text-sm text-[#4d5156] leading-relaxed">
              {truncatedDesc}
            </p>
          </div>

          {/* Mobile preview */}
          <div className="mt-6">
            <p className="text-xs text-muted-foreground mb-2">📱 Aperçu mobile</p>
            <div className="bg-white rounded-lg p-4 border border-border/50 max-w-sm font-[Arial,sans-serif]">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center shrink-0">
                  <span className="text-[8px] font-bold text-muted-foreground">J</span>
                </div>
                <p className="text-xs text-[#4d5156] truncate">{url}</p>
              </div>
              <h3 className="text-base text-[#1a0dab] leading-snug mt-1 mb-1">
                {truncatedTitle}
              </h3>
              <p className="text-xs text-[#4d5156] leading-relaxed line-clamp-2">
                {truncatedDesc}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SERPPreview;
