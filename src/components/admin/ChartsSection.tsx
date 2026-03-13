import { Card } from '@/components/ui/card';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import { INSURANCE_TYPE_LABELS, normalizeInsuranceType } from '@/utils/insuranceTypeNormalizer';

interface ChartsSectionProps {
  quotes: any[];
  callbacks: any[];
}

const INSURANCE_COLORS = [
  '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
  '#ec4899', '#06b6d4', '#f97316', '#14b8a6', '#6366f1',
  '#84cc16', '#e11d48',
];

const STATUS_COLORS = ['#f59e0b', '#3b82f6', '#10b981', '#f97316', '#8b5cf6'];

const renderCustomLabel = ({ name, percent }: { name: string; percent: number }) => {
  if (percent < 0.05) return null;
  return `${(percent * 100).toFixed(0)}%`;
};

export const ChartsSection = ({ quotes, callbacks }: ChartsSectionProps) => {
  // Group quotes by insurance type
  const quotesByType = quotes.reduce((acc, quote) => {
    const type = normalizeInsuranceType(quote.insurance_type);
    const label = (INSURANCE_TYPE_LABELS as Record<string, string>)[type] || type;
    acc[label] = (acc[label] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const insuranceData = Object.entries(quotesByType)
    .map(([name, value]) => ({ name, value: value as number }))
    .sort((a, b) => b.value - a.value);

  // Group by status
  const statusData = [
    { name: 'Devis en attente', value: quotes.filter(q => q.status === 'pending').length },
    { name: 'Devis contactés', value: quotes.filter(q => q.status === 'contacted').length },
    { name: 'Devis convertis', value: quotes.filter(q => q.status === 'converted').length },
    { name: 'Rappels en attente', value: callbacks.filter(c => c.status === 'pending').length },
    { name: 'Rappels terminés', value: callbacks.filter(c => c.status === 'completed').length },
  ].filter(d => d.value > 0);

  const hasInsuranceData = insuranceData.length > 0;
  const hasStatusData = statusData.length > 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-8">
      <Card className="p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-bold mb-4">Demandes par type d'assurance</h3>
        {hasInsuranceData ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={insuranceData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomLabel}
                outerRadius={90}
                fill="#8884d8"
                dataKey="value"
              >
                {insuranceData.map((_entry, index) => (
                  <Cell key={`cell-ins-${index}`} fill={INSURANCE_COLORS[index % INSURANCE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => [`${value} demande${value > 1 ? 's' : ''}`, '']} />
              <Legend
                layout="horizontal"
                verticalAlign="bottom"
                wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-[300px] text-muted-foreground">
            Aucune demande de devis pour le moment
          </div>
        )}
      </Card>

      <Card className="p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-bold mb-4">Répartition par statut</h3>
        {hasStatusData ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomLabel}
                outerRadius={90}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((_entry, index) => (
                  <Cell key={`cell-status-${index}`} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => [`${value}`, '']} />
              <Legend
                layout="horizontal"
                verticalAlign="bottom"
                wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-[300px] text-muted-foreground">
            Aucune donnée pour le moment
          </div>
        )}
      </Card>
    </div>
  );
};
