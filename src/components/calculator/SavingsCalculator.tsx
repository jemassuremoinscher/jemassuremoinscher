import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, TrendingDown, DollarSign, Percent } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export const SavingsCalculator = () => {
  const [currentPrice, setCurrentPrice] = useState<string>("");
  const [insuranceType, setInsuranceType] = useState<string>("auto");
  const [age, setAge] = useState<string>("");
  const [vehicleAge, setVehicleAge] = useState<string>("");
  const [calculated, setCalculated] = useState(false);

  const calculateSavings = () => {
    setCalculated(true);
  };

  const averageSavingsPercent = 35;
  const estimatedNewPrice = currentPrice
    ? Math.round(Number(currentPrice) * (1 - averageSavingsPercent / 100))
    : 0;
  const annualSavings = currentPrice
    ? Math.round((Number(currentPrice) - estimatedNewPrice) * 12)
    : 0;

  return (
    <section className="py-16 bg-gradient-to-b from-muted/20 to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <Calculator className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Calculez vos <span className="text-primary">économies potentielles</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Découvrez combien vous pourriez économiser en changeant d'assurance
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <Card className="p-8">
            <h3 className="text-2xl font-bold mb-6">Vos informations</h3>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="insurance-type">Type d'assurance</Label>
                <Select value={insuranceType} onValueChange={setInsuranceType}>
                  <SelectTrigger id="insurance-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto">Assurance Auto</SelectItem>
                    <SelectItem value="moto">Assurance Moto</SelectItem>
                    <SelectItem value="habitation">Assurance Habitation</SelectItem>
                    <SelectItem value="sante">Mutuelle Santé</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="current-price">Prix actuel mensuel (€)</Label>
                <Input
                  id="current-price"
                  type="number"
                  placeholder="Ex: 65"
                  value={currentPrice}
                  onChange={(e) => setCurrentPrice(e.target.value)}
                  min="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="age">Votre âge</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="Ex: 35"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  min="18"
                  max="100"
                />
              </div>

              {insuranceType === "auto" && (
                <div className="space-y-2">
                  <Label htmlFor="vehicle-age">Âge du véhicule (années)</Label>
                  <Input
                    id="vehicle-age"
                    type="number"
                    placeholder="Ex: 5"
                    value={vehicleAge}
                    onChange={(e) => setVehicleAge(e.target.value)}
                    min="0"
                    max="50"
                  />
                </div>
              )}

              <Button
                onClick={calculateSavings}
                className="w-full"
                size="lg"
                disabled={!currentPrice || !age}
              >
                <Calculator className="mr-2 h-5 w-5" />
                Calculer mes économies
              </Button>
            </div>
          </Card>

          <Card className="p-8 bg-gradient-to-br from-primary/5 to-accent/5">
            <h3 className="text-2xl font-bold mb-6">Vos économies potentielles</h3>
            
            {!calculated || !currentPrice ? (
              <div className="flex items-center justify-center h-[300px]">
                <p className="text-muted-foreground text-center">
                  Remplissez le formulaire pour voir vos économies potentielles
                </p>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Prix actuel</span>
                    <span className="text-2xl font-bold line-through text-muted-foreground">
                      {currentPrice}€/mois
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Prix estimé</span>
                    <span className="text-3xl font-bold text-primary">
                      {estimatedNewPrice}€/mois
                    </span>
                  </div>

                  <Progress value={averageSavingsPercent} className="h-3" />
                  
                  <div className="flex items-center justify-center gap-2 text-accent">
                    <Percent className="h-5 w-5" />
                    <span className="text-2xl font-bold">{averageSavingsPercent}% d'économies</span>
                  </div>
                </div>

                <div className="border-t border-border pt-6">
                  <div className="grid grid-cols-2 gap-4">
                    <Card className="p-4 bg-background/50">
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="h-4 w-4 text-primary" />
                        <p className="text-sm text-muted-foreground">Économie mensuelle</p>
                      </div>
                      <p className="text-2xl font-bold text-primary">
                        {Number(currentPrice) - estimatedNewPrice}€
                      </p>
                    </Card>

                    <Card className="p-4 bg-background/50">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingDown className="h-4 w-4 text-accent" />
                        <p className="text-sm text-muted-foreground">Économie annuelle</p>
                      </div>
                      <p className="text-2xl font-bold text-accent">
                        {annualSavings}€
                      </p>
                    </Card>
                  </div>
                </div>

                <div className="bg-accent/10 rounded-lg p-4 border border-accent/20">
                  <p className="text-sm text-center font-semibold">
                    En {Math.ceil(annualSavings / 200)} ans, vous aurez économisé de quoi partir en vacances ! 🏖️
                  </p>
                </div>

                <Button className="w-full" size="lg" variant="default">
                  Comparer les offres maintenant
                </Button>
              </div>
            )}
          </Card>
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            * Estimation basée sur les économies moyennes constatées. Les économies réelles peuvent varier selon votre profil.
          </p>
        </div>
      </div>
    </section>
  );
};
