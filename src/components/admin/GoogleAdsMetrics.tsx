import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Target, DollarSign, MousePointer, Users } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ElementType;
  format?: "currency" | "percentage" | "number";
  trend?: "up" | "down" | "neutral";
}

const MetricCard = ({ title, value, change, icon: Icon, format = "number", trend }: MetricCardProps) => {
  const getTrendColor = () => {
    if (!trend || trend === "neutral") return "text-muted-foreground";
    if (title.includes("Coût")) {
      // Pour le coût, down est bon (vert), up est mauvais (rouge)
      return trend === "down" ? "text-green-600" : "text-red-600";
    }
    // Pour les autres métriques, up est bon (vert), down est mauvais (rouge)
    return trend === "up" ? "text-green-600" : "text-red-600";
  };

  const TrendIcon = trend === "up" ? TrendingUp : TrendingDown;

  const formatValue = (val: string | number) => {
    if (format === "currency") {
      return `${typeof val === "number" ? val.toFixed(2) : val}€`;
    }
    if (format === "percentage") {
      return `${typeof val === "number" ? val.toFixed(1) : val}%`;
    }
    return val;
  };

  return (
    <Card className="p-6 hover-lift">
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 rounded-full bg-primary/10">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        {change !== undefined && (
          <div className={`flex items-center gap-1 text-sm font-medium ${getTrendColor()}`}>
            <TrendIcon className="h-4 w-4" />
            {Math.abs(change).toFixed(1)}%
          </div>
        )}
      </div>
      <h3 className="text-sm font-medium text-muted-foreground mb-1">{title}</h3>
      <p className="text-3xl font-bold">{formatValue(value)}</p>
    </Card>
  );
};

interface GoogleAdsMetricsProps {
  totalSpend: number;
  totalConversions: number;
  conversionValue: number;
  totalClicks: number;
  costPerLead?: number;
  roi?: number;
  conversionRate?: number;
}

export const GoogleAdsMetrics = ({
  totalSpend,
  totalConversions,
  conversionValue,
  totalClicks,
  costPerLead,
  roi,
  conversionRate,
}: GoogleAdsMetricsProps) => {
  const calculatedCostPerLead = costPerLead ?? (totalConversions > 0 ? totalSpend / totalConversions : 0);
  const calculatedROI = roi ?? (totalSpend > 0 ? ((conversionValue - totalSpend) / totalSpend) * 100 : 0);
  const calculatedConversionRate = conversionRate ?? (totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <MetricCard
        title="Dépenses Totales"
        value={totalSpend}
        icon={DollarSign}
        format="currency"
        trend="neutral"
      />
      <MetricCard
        title="Conversions"
        value={totalConversions}
        icon={Target}
        format="number"
        trend="up"
      />
      <MetricCard
        title="Valeur des Conversions"
        value={conversionValue}
        icon={TrendingUp}
        format="currency"
        trend="up"
      />
      <MetricCard
        title="Coût par Lead"
        value={calculatedCostPerLead}
        icon={DollarSign}
        format="currency"
        trend={calculatedCostPerLead < 50 ? "down" : "up"}
      />
      <MetricCard
        title="ROI"
        value={calculatedROI}
        icon={TrendingUp}
        format="percentage"
        trend={calculatedROI > 0 ? "up" : "down"}
        change={calculatedROI}
      />
      <MetricCard
        title="Taux de Conversion"
        value={calculatedConversionRate}
        icon={Users}
        format="percentage"
        trend={calculatedConversionRate > 3 ? "up" : "down"}
      />
    </div>
  );
};
