import { Card } from '@/components/ui/card';
import { FileText, Phone, TrendingUp, Users } from 'lucide-react';

interface StatsCardsProps {
  quotesCount: number;
  callbacksCount: number;
  pendingQuotes: number;
  pendingCallbacks: number;
}

export const StatsCards = ({ quotesCount, callbacksCount, pendingQuotes, pendingCallbacks }: StatsCardsProps) => {
  const stats = [
    {
      title: 'Demandes de devis',
      value: quotesCount,
      icon: FileText,
      trend: '+12%',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Demandes de rappel',
      value: callbacksCount,
      icon: Phone,
      trend: '+8%',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Devis en attente',
      value: pendingQuotes,
      icon: TrendingUp,
      trend: `${pendingQuotes} actifs`,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      title: 'Rappels en attente',
      value: pendingCallbacks,
      icon: Users,
      trend: `${pendingCallbacks} actifs`,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
              <h3 className="text-3xl font-bold">{stat.value}</h3>
              <p className="text-sm text-muted-foreground mt-2">{stat.trend}</p>
            </div>
            <div className={`${stat.bgColor} p-3 rounded-lg`}>
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
