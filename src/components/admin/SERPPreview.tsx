import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Save, Plus, Trash2, RefreshCw } from "lucide-react";
import { toast } from "sonner";

const TITLE_MAX = 60;
const DESC_MAX = 160;

const PAGES: { path: string; label: string; defaultTitle: string; defaultDesc: string }[] = [
  { path: "/", label: "Accueil", defaultTitle: "Assurance Moins Chère : Comparateur Gratuit | jemassuremoinscher.fr", defaultDesc: "Comparateur d'assurances gratuit. Comparez 50+ assureurs et économisez jusqu'à 280€. Devis en 2 min, sans engagement." },
  { path: "/assurance-auto", label: "Assurance Auto", defaultTitle: "Assurance Auto Moins Chère [Month] : -40% ⭐", defaultDesc: "50+ assureurs comparés gratuitement. Nos clients économisent 320€/an en moyenne. Devis auto instantané, sans engagement." },
  { path: "/assurance-moto", label: "Assurance Moto", defaultTitle: "Assurance Moto Moins Chère [Month] : -35% ⭐", defaultDesc: "Moto, scooter, 125cc : comparez 50+ assureurs. Tous risques dès 15€/mois. Devis gratuit et sans engagement." },
  { path: "/assurance-habitation", label: "Assurance Habitation", defaultTitle: "Assurance Habitation Moins Chère [Month] dès 3€", defaultDesc: "Comparez 50+ assureurs habitation en 2 min. Maison ou appartement, locataire ou propriétaire. Économisez jusqu'à 40%." },
  { path: "/assurance-sante", label: "Mutuelle Santé", defaultTitle: "Mutuelle Santé Moins Chère [Month] : -300€/an", defaultDesc: "Comparez 50+ mutuelles en 2 min. Optique, dentaire, hospitalisation : trouvez la formule idéale. 4.8/5 satisfaction client." },
  { path: "/assurance-animaux", label: "Assurance Animaux", defaultTitle: "Assurance Chien Chat dès 8€/mois [Month]", defaultDesc: "Mutuelle animaux : remboursement vétérinaire jusqu'à 100%. Comparez les offres chien et chat en 2 min. Sans délai de carence." },
  { path: "/assurance-vie", label: "Assurance Vie", defaultTitle: "Assurance Vie [Month] : Meilleurs Rendements", defaultDesc: "Fonds euros, unités de compte, PER : comparez les meilleures assurances vie. Fiscalité avantageuse après 8 ans. Devis gratuit." },
  { path: "/assurance-pret", label: "Assurance Prêt", defaultTitle: "Assurance Emprunteur [Month] : -15 000€ (Lemoine)", defaultDesc: "Loi Lemoine : changez d'assurance de prêt à tout moment. Comparez 50+ assureurs, économisez jusqu'à 50%. Devis gratuit en 2 min." },
  { path: "/assurance-prevoyance", label: "Prévoyance", defaultTitle: "Prévoyance [Month] : Protégez Votre Famille 9€/mois", defaultDesc: "Décès, invalidité, obsèques : comparez les garanties prévoyance de 50+ assureurs. Devis personnalisé gratuit en 2 min." },
  { path: "/assurance-rc-pro", label: "RC Professionnelle", defaultTitle: "RC Pro dès 15€/mois [Month] : Devis Gratuit", defaultDesc: "Responsabilité civile professionnelle : comparez 50+ assureurs. Tous secteurs : BTP, conseil, IT, commerce. Attestation immédiate." },
  { path: "/assurance-mrp", label: "Assurance MRP", defaultTitle: "Multirisque Pro (MRP) [Month] dès 20€/mois", defaultDesc: "Locaux, stock, matériel : protégez votre entreprise avec une MRP adaptée. 50+ assureurs comparés. Devis gratuit en 2 min." },
  { path: "/assurance-pno", label: "Assurance PNO", defaultTitle: "PNO Assurance dès 5€/mois [Month] | Copropriété", defaultDesc: "PNO assurance : comparez les assurances propriétaire non occupant. Obligatoire en copropriété (loi Alur). 50+ assureurs comparés. Devis gratuit." },
  { path: "/assurance-gli", label: "Garantie Loyers Impayés", defaultTitle: "GLI [Month] : Garantie Loyer Impayé dès 2,5%", defaultDesc: "Loyers impayés, dégradations, frais juridiques : sécurisez vos revenus locatifs. Comparez les GLI de 50+ assureurs. Devis gratuit." },
  { path: "/comparateur", label: "Comparateur", defaultTitle: "Comparateur d'Assurances Gratuit", defaultDesc: "Comparez les offres de 50+ assureurs en 2 minutes. Auto, santé, habitation, prêt. Sans engagement." },
  { path: "/blog", label: "Blog", defaultTitle: "Blog Assurance - Conseils & Guides", defaultDesc: "Guides complets, actualités et conseils pour économiser sur vos assurances." },
  { path: "/glossaire", label: "Glossaire", defaultTitle: "Glossaire de l'Assurance", defaultDesc: "Définitions claires de tous les termes d'assurance : franchise, prime, sinistre, responsabilité civile..." },
  { path: "/qui-sommes-nous", label: "Qui sommes-nous", defaultTitle: "Qui sommes-nous | jemassuremoinscher.fr", defaultDesc: "Découvrez notre équipe de courtiers en assurances. Indépendant, transparent, gratuit." },
  { path: "/contact", label: "Contact", defaultTitle: "Contactez-nous | jemassuremoinscher.fr", defaultDesc: "Besoin d'aide ? Contactez notre équipe de conseillers. Réponse sous 2h." },
  { path: "/nos-partenaires", label: "Nos Partenaires", defaultTitle: "Nos 50+ Partenaires Assureurs", defaultDesc: "AXA, Allianz, MAIF, Groupama... Découvrez tous nos assureurs partenaires." },
  { path: "/mutuelle-tns", label: "Mutuelle TNS", defaultTitle: "Mutuelle TNS : Meilleure Complémentaire Indépendant", defaultDesc: "Comparez les mutuelles TNS adaptées aux indépendants. Loi Madelin, déduction fiscale. Devis gratuit." },
];

const LengthBar = ({ current, max, label }: { current: number; max: number; label: string }) => {
  const ratio = current / max;
  const color = ratio <= 0.85 ? "bg-green-500" : ratio <= 1 ? "bg-amber-500" : "bg-destructive";
  const width = Math.min(ratio * 100, 100);

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{label}</span>
        <span className={ratio > 1 ? "text-destructive font-semibold" : ""}>{current}/{max}</span>
      </div>
      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${width}%` }} />
      </div>
    </div>
  );
};

type PageMeta = {
  id?: string;
  page_path: string;
  meta_title: string;
  meta_description: string;
  og_title: string;
  og_description: string;
};

const SERPPreview = () => {
  const [selectedPage, setSelectedPage] = useState("/");
  const [meta, setMeta] = useState<PageMeta>({
    page_path: "/",
    meta_title: "",
    meta_description: "",
    og_title: "",
    og_description: "",
  });
  const [savedMetas, setSavedMetas] = useState<PageMeta[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchAllMetas();
  }, []);

  const fetchAllMetas = async () => {
    setIsLoading(true);
    const { data } = await supabase
      .from("page_meta_overrides")
      .select("*")
      .order("page_path");
    if (data) setSavedMetas(data as PageMeta[]);
    setIsLoading(false);
  };

  useEffect(() => {
    const existing = savedMetas.find((m) => m.page_path === selectedPage);
    const pageDefaults = PAGES.find((p) => p.path === selectedPage);
    if (existing) {
      setMeta(existing);
    } else {
      setMeta({
        page_path: selectedPage,
        meta_title: pageDefaults?.defaultTitle || "",
        meta_description: pageDefaults?.defaultDesc || "",
        og_title: "",
        og_description: "",
      });
    }
  }, [selectedPage, savedMetas]);

  const handleSave = async () => {
    setIsSaving(true);
    const payload = {
      page_path: selectedPage,
      meta_title: meta.meta_title || null,
      meta_description: meta.meta_description || null,
      og_title: meta.og_title || null,
      og_description: meta.og_description || null,
    };

    if (meta.id) {
      const { error } = await supabase
        .from("page_meta_overrides")
        .update(payload as any)
        .eq("id", meta.id);
      if (error) toast.error("Erreur lors de la sauvegarde");
      else toast.success("Meta mis à jour ✓");
    } else {
      const { error } = await supabase
        .from("page_meta_overrides")
        .insert(payload as any);
      if (error) toast.error("Erreur lors de la création");
      else toast.success("Meta créé ✓");
    }
    await fetchAllMetas();
    setIsSaving(false);
  };

  const handleDelete = async () => {
    if (!meta.id) return;
    const { error } = await supabase
      .from("page_meta_overrides")
      .delete()
      .eq("id", meta.id);
    if (error) toast.error("Erreur suppression");
    else {
      toast.success("Meta supprimé");
      await fetchAllMetas();
    }
  };

  const url = `https://www.jemassuremoinscher.fr${selectedPage === "/" ? "" : selectedPage}`;
  const displayTitle = meta.meta_title || "Titre non défini";
  const displayDesc = meta.meta_description || "Description non définie";
  const truncatedTitle = displayTitle.length > 60 ? displayTitle.slice(0, 57) + "..." : displayTitle;
  const truncatedDesc = displayDesc.length > 160 ? displayDesc.slice(0, 157) + "..." : displayDesc;

  return (
    <div className="space-y-6">
      {/* Page selector */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5 text-primary" />
            Éditeur Meta SEO par page
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-3 items-end">
            <div className="flex-1 space-y-2">
              <Label>Page</Label>
              <Select value={selectedPage} onValueChange={setSelectedPage}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PAGES.map((p) => (
                    <SelectItem key={p.path} value={p.path}>
                      <span className="flex items-center gap-2">
                        {savedMetas.some((m) => m.page_path === p.path) && (
                          <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                        )}
                        {p.label}
                        <span className="text-muted-foreground text-xs ml-1">{p.path}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" size="icon" onClick={fetchAllMetas} disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Titre SEO</Label>
              <Input
                value={meta.meta_title}
                onChange={(e) => setMeta({ ...meta, meta_title: e.target.value })}
                placeholder="Titre de la page (max 60 car.)"
              />
              <LengthBar current={meta.meta_title.length} max={TITLE_MAX} label="Titre" />
            </div>
            <div className="space-y-2">
              <Label>OG Title</Label>
              <Input
                value={meta.og_title}
                onChange={(e) => setMeta({ ...meta, og_title: e.target.value })}
                placeholder="Titre Open Graph (25-35 car.)"
              />
              <LengthBar current={meta.og_title.length} max={35} label="OG Title" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Meta Description</Label>
              <Textarea
                value={meta.meta_description}
                onChange={(e) => setMeta({ ...meta, meta_description: e.target.value })}
                placeholder="Description (max 160 car.)"
                rows={3}
              />
              <LengthBar current={meta.meta_description.length} max={DESC_MAX} label="Description" />
            </div>
            <div className="space-y-2">
              <Label>OG Description</Label>
              <Textarea
                value={meta.og_description}
                onChange={(e) => setMeta({ ...meta, og_description: e.target.value })}
                placeholder="Description Open Graph (55-65 car.)"
                rows={3}
              />
              <LengthBar current={meta.og_description.length} max={65} label="OG Description" />
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSave} disabled={isSaving} className="gap-2">
              {meta.id ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              {meta.id ? "Mettre à jour" : "Enregistrer"}
            </Button>
            {meta.id && (
              <Button variant="destructive" size="sm" onClick={handleDelete} className="gap-2">
                <Trash2 className="h-4 w-4" />
                Supprimer
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Google SERP preview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm text-muted-foreground">Aperçu Google</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-white rounded-lg p-6 border border-border/50 max-w-2xl font-[Arial,sans-serif]">
            <div className="flex items-center gap-2 mb-1">
              <img src="/favicon.png" alt="favicon" className="w-7 h-7 rounded-full shrink-0 object-contain" />
              <div className="min-w-0">
                <p className="text-sm text-[#202124] truncate">jemassuremoinscher.fr</p>
                <p className="text-xs text-[#4d5156] truncate">{url}</p>
              </div>
            </div>
            <h3 className="text-xl text-[#1a0dab] hover:underline cursor-pointer leading-snug mt-1 mb-1">
              {truncatedTitle}
            </h3>
            <p className="text-sm text-[#4d5156] leading-relaxed">{truncatedDesc}</p>
          </div>

          <div className="mt-6">
            <p className="text-xs text-muted-foreground mb-2">📱 Aperçu mobile</p>
            <div className="bg-white rounded-lg p-4 border border-border/50 max-w-sm font-[Arial,sans-serif]">
              <div className="flex items-center gap-2 mb-1">
                <img src="/favicon.png" alt="favicon" className="w-6 h-6 rounded-full shrink-0 object-contain" />
                <p className="text-xs text-[#4d5156] truncate">{url}</p>
              </div>
              <h3 className="text-base text-[#1a0dab] leading-snug mt-1 mb-1">{truncatedTitle}</h3>
              <p className="text-xs text-[#4d5156] leading-relaxed line-clamp-2">{truncatedDesc}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Saved overrides list */}
      {savedMetas.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Pages avec meta personnalisés ({savedMetas.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {savedMetas.map((m) => (
                <button
                  key={m.page_path}
                  onClick={() => setSelectedPage(m.page_path)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    selectedPage === m.page_path
                      ? "bg-primary/10 text-primary font-medium"
                      : "hover:bg-muted"
                  }`}
                >
                  <span className="font-mono text-xs text-muted-foreground">{m.page_path}</span>
                  {m.meta_title && (
                    <p className="text-foreground truncate mt-0.5">{m.meta_title}</p>
                  )}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SERPPreview;
