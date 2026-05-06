import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAnalytics } from "@/hooks/useAnalytics";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

const ZapIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>
  </svg>
);

type InsType = {
  value: string;
  label: string;
  mascot: string;
};

const INSURANCE_TYPES: InsType[] = [
  { value: "auto", label: "Auto", mascot: "/arthur-car.webp" },
  { value: "moto", label: "Moto", mascot: "/arthur-moto.webp" },
  { value: "habitation", label: "Habitation", mascot: "/arthur-house.webp" },
  { value: "animaux", label: "Animaux", mascot: "/arthur-animals.webp" },
  { value: "sante", label: "Santé", mascot: "/arthur-sick.webp" },
  { value: "vie", label: "Vie", mascot: "/arthur-idea.webp" },
  { value: "rc_pro", label: "RC Pro", mascot: "/arthur-thumbs-up.webp" },
  { value: "mrp", label: "MRP", mascot: "/arthur-thumbs-up.webp" },
  { value: "metiers_atypiques", label: "Métiers Atypiques", mascot: "/arthur-wink-thumbsup.webp" },
  { value: "pret", label: "Emprunteur", mascot: "/arthur-idea.webp" },
  { value: "prevoyance", label: "Prévoyance", mascot: "/arthur-idea.webp" },
  { value: "gli", label: "GLI", mascot: "/arthur-house.webp" },
  { value: "pno", label: "PNO", mascot: "/arthur-house.webp" },
];

export const HeroQuoteForm = () => {
  const navigate = useNavigate();
  const { trackEvent } = useAnalytics();
  const [type, setType] = useState<string>("auto");
  const [age, setAge] = useState<string>("");
  const [zipcode, setZipcode] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    trackEvent("insurance_type_click", { category: "hero_form", label: type, ref: "hero_form" });
    const params = new URLSearchParams();
    params.set("type", type);
    if (age) params.set("age", age);
    if (zipcode) params.set("zipcode", zipcode);
    navigate(`/comparateur?${params.toString()}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl shadow-2xl p-5 md:p-7 space-y-4 border border-white/40"
      aria-label="Formulaire de demande de devis"
    >
      {/* Type */}
      <div className="space-y-1.5">
        <label htmlFor="hero-type" className="text-sm font-semibold text-foreground">
          Type d'assurance
        </label>
        <Select value={type} onValueChange={setType}>
          <SelectTrigger id="hero-type" className="h-12 text-base bg-background">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-popover z-[60] max-h-[360px]">
            {INSURANCE_TYPES.map((t) => (
              <SelectItem key={t.value} value={t.value}>
                <span className="flex items-center gap-2">
                  <img src={t.mascot} alt="" className="h-9 w-9 object-contain shrink-0" loading="lazy" decoding="async" />
                  <span>Assurance {t.label}</span>
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Age + ZIP */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label htmlFor="hero-age" className="text-sm font-semibold text-foreground">Âge</label>
          <input
            id="hero-age"
            type="number"
            inputMode="numeric"
            min={18}
            max={120}
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="35"
            className="w-full h-12 rounded-md border border-input bg-background px-3 text-base focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="hero-zip" className="text-sm font-semibold text-foreground">Code postal</label>
          <input
            id="hero-zip"
            type="text"
            inputMode="numeric"
            maxLength={5}
            pattern="[0-9]{5}"
            value={zipcode}
            onChange={(e) => setZipcode(e.target.value.replace(/\D/g, "").slice(0, 5))}
            placeholder="75001"
            className="w-full h-12 rounded-md border border-input bg-background px-3 text-base focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[hsl(43_80%_65%)] to-[hsl(38_75%_58%)] hover:from-[hsl(43_80%_60%)] hover:to-[hsl(38_75%_53%)] text-foreground font-bold text-base md:text-lg px-6 py-3.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-95"
        aria-label="Découvrez votre prix en 2 min"
      >
        <ZapIcon />
        Découvrez votre prix en 2 min
      </button>
    </form>
  );
};

export default HeroQuoteForm;
