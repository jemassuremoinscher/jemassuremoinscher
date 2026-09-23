import { Award, FileCheck, Search, ShieldCheck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

export type ProductContext =
  | "auto"
  | "moto"
  | "habitation"
  | "sante"
  | "animaux"
  | "rc-pro"
  | "mrp"
  | "metiers-atypiques"
  | "vie"
  | "pret"
  | "prevoyance"
  | "gli"
  | "pno"
  | "gestion-locative"
  | "sans-permis"
  | "camping-car"
  | "auto-temporaire"
  | "flotte-auto"
  | "cyber"
  | "decennale"
  | "mutuelle-entreprise"
  | "protection-juridique"
  | "velo"
  | "trottinette"
  | "scooter-50cc"
  | "vtc"
  | "drone"
  | "coach-sportif"
  | "rc-pro-micro-entreprise"
  | "influenceur"
  | "auto-entrepreneur";

interface CourtierValueCardsProps {
  product: ProductContext;
}

const CourtierValueCards = ({ product }: CourtierValueCardsProps) => {
  const { t } = useLanguage();
  const label = t(`courtierValue.product.${product}`);

  const has = (k: string) => t(k) !== k;
  const desc1 = has(`courtierValue.copy.${product}.0`)
    ? t(`courtierValue.copy.${product}.0`)
    : t("courtierValue.copy.default.0", { product: label });
  const desc2 = has(`courtierValue.copy.${product}.1`)
    ? t(`courtierValue.copy.${product}.1`)
    : t("courtierValue.copy.default.1");
  const desc3 = has(`courtierValue.copy.${product}.2`)
    ? t(`courtierValue.copy.${product}.2`)
    : t("courtierValue.copy.default.2");

  const cards = [
    { icon: Search, title: t("courtierValue.card1.title"), description: desc1 },
    { icon: FileCheck, title: t("courtierValue.card2.title"), description: desc2 },
    { icon: ShieldCheck, title: t("courtierValue.card3.title"), description: desc3 },
    { icon: Award, title: t("courtierValue.card4.title"), description: t("courtierValue.card4.desc") },
  ];

  return (
    <section className="max-w-5xl mx-auto mb-12" aria-labelledby={`courtier-value-${product}`}>
      <div className="text-center mb-8">
        <h2 id={`courtier-value-${product}`} className="text-2xl md:text-3xl font-bold text-foreground mb-3">
          {t("courtierValue.title", { product: label })}
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          {t("courtierValue.subtitle")}
        </p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {cards.map((item) => (
          <Card key={item.title} className="p-6 h-full border-2 border-border/60 transition-all duration-300 hover:border-primary/30 hover:shadow-[var(--shadow-card)]">
            <div className="p-3 rounded-2xl bg-primary/10 w-fit mb-4">
              <item.icon className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-bold text-foreground mb-2">{item.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default CourtierValueCards;
