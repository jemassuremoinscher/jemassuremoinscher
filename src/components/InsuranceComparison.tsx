import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { useState } from "react";
import { SubscriptionModal } from "./comparison/SubscriptionModal";
import { useLanguage } from "@/contexts/LanguageContext";

interface Insurer {
  name: string;
  price: number;
  logo?: string;
  coverage: string[];
  discount?: string;
}

interface InsuranceComparisonProps {
  insurers: Insurer[];
  onNewQuote: () => void;
  formData?: Record<string, any>;
  insuranceType?: string;
}

const InsuranceComparison = ({ insurers, onNewQuote, formData, insuranceType }: InsuranceComparisonProps) => {
  const { t } = useLanguage();
  const [selectedOffer, setSelectedOffer] = useState<Insurer | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubscribe = (insurer: Insurer) => {
    setSelectedOffer(insurer);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-3xl font-bold mb-2 text-primary">{t('comparison.title')}</h3>
        <p className="text-muted-foreground">{t('comparison.subtitle')}</p>
      </div>

      <div className="grid gap-4">
        {insurers.map((insurer, index) => (
          <Card 
            key={index} 
            className={`p-6 transition-all hover:shadow-lg ${
              index === 0 ? 'border-primary border-2 shadow-md' : ''
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  {index === 0 && (
                    <Badge className="bg-accent text-accent-foreground">
                      {t('comparison.bestOffer')}
                    </Badge>
                  )}
                  <h4 className="text-xl font-bold text-card-foreground">{insurer.name}</h4>
                  {insurer.discount && (
                    <Badge variant="outline" className="text-primary border-primary">
                      {insurer.discount}
                    </Badge>
                  )}
                </div>
                <div className="space-y-1">
                  {insurer.coverage.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="h-4 w-4 text-primary" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex flex-col items-center md:items-end gap-3">
                <div className="text-center md:text-right">
                  <div className="text-3xl font-bold text-accent">{insurer.price}€</div>
                  <div className="text-sm text-muted-foreground">{t('common.perMonth')}</div>
                </div>
                <Button 
                  className="w-full md:w-auto min-w-[140px]"
                  variant={index === 0 ? "subscribe-best" : "subscribe"}
                  size="lg"
                  onClick={() => handleSubscribe(insurer)}
                >
                  {t('comparison.callbackBtn')}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="text-center pt-6">
        <Button onClick={onNewQuote} variant="outline" size="lg">
          {t('comparison.newRequest')}
        </Button>
      </div>

      {selectedOffer && (
        <SubscriptionModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          offerDetails={{
            insurer: selectedOffer.name,
            price: selectedOffer.price,
            coverage: selectedOffer.coverage.join(", "),
            insuranceType: insuranceType || "Assurance",
            formData: formData,
          }}
        />
      )}
    </div>
  );
};

export default InsuranceComparison;
