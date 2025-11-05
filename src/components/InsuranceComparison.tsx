import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface Coverage {
  id: string;
  name: string;
  description: string | null;
  value: string | null;
}

interface Product {
  id: string;
  name: string;
  description: string | null;
  insurer_name: string;
  insurer_logo: string | null;
  coverages: Coverage[];
}

interface Quote {
  id: string;
  calculated_price: number;
  product: Product;
}

interface InsuranceComparisonProps {
  quotes: Quote[];
  onSelectQuote?: (quoteId: string) => void;
}

export const InsuranceComparison = ({ quotes, onSelectQuote }: InsuranceComparisonProps) => {
  if (!quotes || quotes.length === 0) {
    return null;
  }

  const sortedQuotes = [...quotes].sort((a, b) => a.calculated_price - b.calculated_price);

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-foreground mb-6">Comparez les offres</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedQuotes.map((quote, index) => (
          <Card 
            key={quote.id} 
            className={`relative transition-all hover:shadow-[var(--shadow-hover)] ${
              index === 0 ? 'border-primary border-2' : ''
            }`}
          >
            {index === 0 && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-secondary text-secondary-foreground">
                  Meilleure offre
                </Badge>
              </div>
            )}
            
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                {quote.product.insurer_logo ? (
                  <img 
                    src={quote.product.insurer_logo} 
                    alt={quote.product.insurer_name}
                    className="h-10 w-10 object-contain"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                    <span className="text-xs font-bold text-muted-foreground">
                      {quote.product.insurer_name.substring(0, 2).toUpperCase()}
                    </span>
                  </div>
                )}
                <div>
                  <CardTitle className="text-lg">{quote.product.insurer_name}</CardTitle>
                  <CardDescription className="text-sm">{quote.product.name}</CardDescription>
                </div>
              </div>
              
              <div className="text-center py-4 bg-muted rounded-lg">
                <div className="text-3xl font-bold text-primary">
                  {quote.calculated_price.toFixed(2)}€
                </div>
                <div className="text-sm text-muted-foreground">par mois</div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {quote.product.description && (
                <p className="text-sm text-muted-foreground">{quote.product.description}</p>
              )}
              
              <div className="space-y-2">
                <h4 className="font-semibold text-sm text-foreground">Garanties incluses :</h4>
                <ul className="space-y-2">
                  {quote.product.coverages.map((coverage) => (
                    <li key={coverage.id} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-medium">{coverage.name}</span>
                        {coverage.value && (
                          <span className="text-muted-foreground"> - {coverage.value}</span>
                        )}
                        {coverage.description && (
                          <p className="text-xs text-muted-foreground mt-1">{coverage.description}</p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <Button 
                className="w-full"
                variant={index === 0 ? "default" : "outline"}
                onClick={() => onSelectQuote?.(quote.id)}
              >
                Choisir cette offre
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
