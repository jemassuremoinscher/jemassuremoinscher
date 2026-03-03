import { Card } from '@/components/ui/card';
import { FileText, Phone, Clock, Users } from 'lucide-react';

interface StatsCardsProps {
  quotesCount: number;
  callbacksCount: number;
  pendingQuotes: number;
  pendingCallbacks: number;
}

export const StatsCards = ({ quotesCount, callbacksCount, pendingQuotes, pendingCallbacks }: StatsCardsProps) => {
  const totalLeads = quotesCount + callbacksCount;
  const totalPending = pendingQuotes + pendingCallbacks;

  const stats = [
    {
      title: 'Demandes de devis',
      value: quotesCount,
      icon: FileText,
      subtitle: quotesCount === 0 ? 'Aucune demande' : `${quotesCount} reçue${quotesCount > 1 ? 's' : ''}`,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Demandes de rappel',
      value: callbacksCount,
      icon: Phone,
      subtitle: callbacksCount === 0 ? 'Aucune demande' : `${callbacksCount} reçue${callbacksCount > 1 ? 's' : ''}`,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Devis en attente',
      value: pendingQuotes,
      icon: Clock,
      subtitle: pendingQuotes === 0 ? 'Tout est traité ✓' : `${pendingQuotes} à traiter`,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      title: 'Rappels en attente',
      value: pendingCallbacks,
      icon: Users,
      subtitle: pendingCallbacks === 0 ? 'Tout est traité ✓' : `${pendingCallbacks} à traiter`,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-8">
      {stats.map((stat, index) => (
        <Card key={index} className="p-4 sm:p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-xs sm:text-sm text-muted-foreground mb-1 truncate">{stat.title}</p>
              <h3 className="text-2xl sm:text-3xl font-bold">{stat.value}</h3>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1 sm:mt-2 truncate">{stat.subtitle}</p>
            </div>
            <div className={`${stat.bgColor} p-2 sm:p-3 rounded-lg shrink-0`}>
              <stat.icon className={`h-4 w-4 sm:h-6 sm:w-6 ${stat.color}`} />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
