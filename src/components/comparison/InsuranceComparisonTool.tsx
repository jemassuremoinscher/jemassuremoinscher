import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Star, Shield, Check, X, TrendingUp, Filter } from "lucide-react";

interface InsuranceOffer {
  id: string;
  insurer: string;
  logo?: string;
  price: number;
  rating: number;
  coverage: string[];
  deductible: number;
  monthlyPayment: number;
  benefits: string[];
  popular?: boolean;
}

const mockOffers: InsuranceOffer[] = [
  {
    id: "1",
    insurer: "AXA Premium",
    price: 45,
    rating: 4.8,
    coverage: ["Responsabilité civile", "Tous risques", "Protection juridique", "Bris de glace"],
    deductible: 200,
    monthlyPayment: 45,
    benefits: ["Assistance 24/7", "Véhicule de remplacement", "Protection du bonus"],
    popular: true,
  },
  {
    id: "2",
    insurer: "Allianz Confort",
    price: 52,
    rating: 4.6,
    coverage: ["Responsabilité civile", "Tous risques", "Vol et incendie"],
    deductible: 150,
    monthlyPayment: 52,
    benefits: ["Assistance Europe", "Garantie conducteur"],
  },
  {
    id: "3",
    insurer: "MAIF Équilibre",
    price: 38,
    rating: 4.7,
    coverage: ["Responsabilité civile", "Dommages collision", "Protection juridique"],
    deductible: 300,
    monthlyPayment: 38,
    benefits: ["Prix compétitif", "Sans frais de dossier"],
  },
  {
    id: "4",
    insurer: "Groupama Sérénité",
    price: 48,
    rating: 4.5,
    coverage: ["Responsabilité civile", "Tous risques", "Assistance panne", "Bris de glace"],
    deductible: 250,
    monthlyPayment: 48,
    benefits: ["Réseau local", "Gestion sinistre rapide"],
  },
];

export const InsuranceComparisonTool = () => {
  const [maxPrice, setMaxPrice] = useState<number>(100);
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>("price");
  const [selectedCoverage, setSelectedCoverage] = useState<string>("all");

  const filteredOffers = mockOffers
    .filter((offer) => offer.price <= maxPrice)
    .filter((offer) => offer.rating >= minRating)
    .filter((offer) => {
      if (selectedCoverage === "all") return true;
      return offer.coverage.includes(selectedCoverage);
    })
    .sort((a, b) => {
      if (sortBy === "price") return a.price - b.price;
      if (sortBy === "rating") return b.rating - a.rating;
      return 0;
    });

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Comparez les offres <span className="text-primary">en temps réel</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Filtrez et comparez pour trouver la meilleure assurance selon vos critères
          </p>
        </div>

        {/* Filtres */}
        <Card className="p-6 mb-8">
          <div className="flex items-center gap-2 mb-6">
            <Filter className="h-5 w-5 text-primary" />
            <h3 className="text-xl font-semibold">Filtres de recherche</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <Label>Prix maximum (€/mois)</Label>
              <div className="flex items-center gap-4">
                <Slider
                  value={[maxPrice]}
                  onValueChange={(value) => setMaxPrice(value[0])}
                  max={150}
                  min={20}
                  step={5}
                  className="flex-1"
                />
                <span className="min-w-[60px] text-center font-semibold">{maxPrice}€</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Note minimum</Label>
              <Select value={minRating.toString()} onValueChange={(value) => setMinRating(Number(value))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Toutes les notes</SelectItem>
                  <SelectItem value="4">4+ étoiles</SelectItem>
                  <SelectItem value="4.5">4.5+ étoiles</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Type de couverture</Label>
              <Select value={selectedCoverage} onValueChange={setSelectedCoverage}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les couvertures</SelectItem>
                  <SelectItem value="Tous risques">Tous risques</SelectItem>
                  <SelectItem value="Protection juridique">Protection juridique</SelectItem>
                  <SelectItem value="Bris de glace">Bris de glace</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Trier par</Label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="price">Prix croissant</SelectItem>
                  <SelectItem value="rating">Meilleure note</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Résultats */}
        <div className="grid gap-6">
          {filteredOffers.map((offer) => (
            <Card key={offer.id} className="p-6 hover-lift relative">
              {offer.popular && (
                <Badge className="absolute top-4 right-4 bg-accent">
                  Plus populaire
                </Badge>
              )}
              
              <div className="grid md:grid-cols-4 gap-6">
                <div className="md:col-span-1 flex flex-col items-center justify-center border-r border-border pr-6">
                  <h3 className="text-2xl font-bold text-center mb-2">{offer.insurer}</h3>
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(offer.rating)
                            ? "fill-accent text-accent"
                            : "text-muted-foreground"
                        }`}
                      />
                    ))}
                    <span className="ml-2 font-semibold">{offer.rating}</span>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-primary">{offer.price}€</p>
                    <p className="text-sm text-muted-foreground">par mois</p>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    Couvertures incluses
                  </h4>
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {offer.coverage.map((item, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Franchise</p>
                      <p className="font-semibold">{offer.deductible}€</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Paiement mensuel</p>
                      <p className="font-semibold">{offer.monthlyPayment}€</p>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-semibold mb-3 text-sm">Avantages</h4>
                    <ul className="space-y-2">
                      {offer.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <TrendingUp className="h-3 w-3 text-accent mt-1 flex-shrink-0" />
                          <span className="text-xs">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Button className="w-full mt-4" size="lg">
                    Obtenir un devis
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredOffers.length === 0 && (
          <Card className="p-12 text-center">
            <X className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Aucune offre trouvée</h3>
            <p className="text-muted-foreground">
              Essayez de modifier vos critères de recherche
            </p>
          </Card>
        )}
      </div>
    </section>
  );
};
