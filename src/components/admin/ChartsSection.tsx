import { Card } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

interface ChartsSectionProps {
  quotes: any[];
  callbacks: any[];
}

export const ChartsSection = ({ quotes, callbacks }: ChartsSectionProps) => {
  // Group quotes by insurance type
  const quotesByType = quotes.reduce((acc, quote) => {
    const type = quote.insurance_type;
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const insuranceData = Object.entries(quotesByType).map(([type, count]) => ({
    name: type,
    value: count as number,
  }));

  // Group by status
  const statusData = [
    { name: 'Devis en attente', value: quotes.filter(q => q.status === 'pending').length },
    { name: 'Devis contactés', value: quotes.filter(q => q.status === 'contacted').length },
    { name: 'Devis convertis', value: quotes.filter(q => q.status === 'converted').length },
    { name: 'Rappels en attente', value: callbacks.filter(c => c.status === 'pending').length },
    { name: 'Rappels terminés', value: callbacks.filter(c => c.status === 'completed').length },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <Card className="p-6">
        <h3 className="text-lg font-bold mb-4">Demandes par type d'assurance</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={insuranceData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-bold mb-4">Répartition par statut</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={statusData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {statusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};
