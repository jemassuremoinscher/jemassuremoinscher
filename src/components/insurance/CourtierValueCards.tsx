import { Award, FileCheck, Search, ShieldCheck } from "lucide-react";
import { Card } from "@/components/ui/card";

type ProductContext =
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
  | "gestion-locative";

const productLabels: Record<ProductContext, string> = {
  auto: "l'assurance auto",
  moto: "l'assurance moto",
  habitation: "l'assurance habitation",
  sante: "la mutuelle santé",
  animaux: "l'assurance animaux",
  "rc-pro": "la RC Pro",
  mrp: "la multirisque professionnelle",
  "metiers-atypiques": "les métiers atypiques",
  vie: "l'assurance vie",
  pret: "l'assurance emprunteur",
  prevoyance: "la prévoyance",
  gli: "la garantie loyers impayés",
  pno: "l'assurance PNO",
  "gestion-locative": "la gestion locative",
};

const productSpecificCopy: Partial<Record<ProductContext, string[]>> = {
  "metiers-atypiques": [
    "Nous présentons votre activité à des assureurs de niche réellement appétents, au lieu de multiplier les refus généralistes.",
    "Vos certifications, process sécurité, fréquentation et sinistralité sont valorisés pour réduire les surprimes injustifiées.",
    "Votre dossier est défendu par un courtier qui connaît les risques aggravés : accrobranche, outdoor, événementiel et travaux en hauteur.",
  ],
  vie: [
    "Nous orientons votre épargne vers des contrats lisibles, avec 0% de frais d'entrée sur nos contrats partenaires.",
    "Les frais d'arbitrage sont offerts sur les contrats sélectionnés, pour ajuster votre allocation sans friction inutile.",
    "Un conseiller vous aide à comparer fonds euros, unités de compte, gestion pilotée et fiscalité après 8 ans.",
  ],
  pret: [
    "Nous vérifions l'équivalence des garanties pour faciliter l'acceptation par la banque.",
    "La loi Lemoine permet de changer à tout moment : nous cadrons la substitution sans frais ni perte de couverture.",
    "Le gain se joue souvent sur plusieurs milliers d'euros sur la durée restante du prêt.",
  ],
};

interface CourtierValueCardsProps {
  product: ProductContext;
}

const CourtierValueCards = ({ product }: CourtierValueCardsProps) => {
  const label = productLabels[product];
  const descriptions = productSpecificCopy[product] || [
    `Nous comparons les contrats de ${label} selon votre profil réel, pas seulement selon un prix d'appel.`,
    "Un courtier vérifie les exclusions, franchises, plafonds et options utiles avant de vous orienter.",
    "Vous gagnez du temps : nous mettons en concurrence les assureurs et vous accompagnons jusqu'au choix final.",
  ];

  const cards = [
    { icon: Search, title: "Comparaison ciblée", description: descriptions[0] },
    { icon: FileCheck, title: "Garanties vérifiées", description: descriptions[1] },
    { icon: ShieldCheck, title: "Dossier défendu", description: descriptions[2] },
    { icon: Award, title: "Conseil indépendant", description: "Notre recommandation reste centrée sur votre besoin, votre budget et la qualité réelle des garanties." },
  ];

  return (
    <section className="max-w-5xl mx-auto mb-12" aria-labelledby={`courtier-value-${product}`}>
      <div className="text-center mb-8">
        <h2 id={`courtier-value-${product}`} className="text-2xl md:text-3xl font-bold text-foreground mb-3">
          Pourquoi passer par un courtier spécialisé pour {label} ?
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Un accompagnement humain pour comparer, comprendre et choisir une couverture cohérente.
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