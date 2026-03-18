import { useState, useMemo } from "react";
import { Calculator, TrendingDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface SurchargeSimulatorProps {
  coefficient: number;
  label: string;
  explanation: string;
}

const SurchargeSimulator = ({ coefficient, label, explanation }: SurchargeSimulatorProps) => {
  const [currentPrice, setCurrentPrice] = useState("");

  const results = useMemo(() => {
    const price = parseFloat(currentPrice);
    if (!price || price <= 0) return null;

    const newPrice = Math.round(price * coefficient);
    const courtierPrice = Math.round(newPrice * 0.75); // 25% reduction via courtier
    const saving = newPrice - courtierPrice;

    return { newPrice, courtierPrice, saving };
  }, [currentPrice, coefficient]);

  return (
    <Card className="p-6 md:p-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-xl bg-primary/10">
          <Calculator className="w-5 h-5 text-primary" />
        </div>
        <h2 className="text-xl font-bold text-foreground">Simulateur de Surprime</h2>
      </div>

      <p className="text-sm text-muted-foreground mb-6">{explanation}</p>

      <div className="space-y-4">
        <div>
          <label htmlFor="current-price" className="text-sm font-medium text-foreground mb-1 block">
            Votre prime annuelle avant l'incident (€/an)
          </label>
          <Input
            id="current-price"
            type="number"
            placeholder="Ex : 600"
            value={currentPrice}
            onChange={(e) => setCurrentPrice(e.target.value)}
            className="max-w-xs"
          />
        </div>

        {results && (
          <div className="grid sm:grid-cols-3 gap-4 mt-6" style={{ animation: "fadeIn 0.4s ease-out" }}>
            <div className="p-4 rounded-xl bg-destructive/5 border border-destructive/20 text-center">
              <p className="text-xs text-muted-foreground mb-1">{label}</p>
              <p className="text-2xl font-bold text-destructive">{results.newPrice}€<span className="text-sm font-normal">/an</span></p>
              <p className="text-xs text-muted-foreground mt-1">+{Math.round((coefficient - 1) * 100)}% du tarif initial</p>
            </div>

            <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <TrendingDown className="w-3 h-3 text-primary" />
                <p className="text-xs text-muted-foreground">Via nos courtiers</p>
              </div>
              <p className="text-2xl font-bold text-primary">{results.courtierPrice}€<span className="text-sm font-normal">/an</span></p>
              <p className="text-xs text-muted-foreground mt-1">-25 à 30% négocié</p>
            </div>

            <div className="p-4 rounded-xl bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 text-center">
              <p className="text-xs text-muted-foreground mb-1">Économie estimée</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{results.saving}€<span className="text-sm font-normal">/an</span></p>
              <p className="text-xs text-muted-foreground mt-1">sur la surprime marché</p>
            </div>
          </div>
        )}

        <p className="text-xs text-muted-foreground italic mt-4 p-3 rounded-lg bg-muted/50">
          ⚠️ Ceci est une estimation haute basée sur les coefficients moyens du marché. Nos courtiers partenaires parviennent souvent à réduire cette hausse de 20 à 30% grâce à des contrats spécialisés. Demandez votre devis personnalisé pour un tarif exact.
        </p>
      </div>
    </Card>
  );
};

export default SurchargeSimulator;
