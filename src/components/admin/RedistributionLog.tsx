import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowRight, RefreshCw, AlertCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

export const RedistributionLog = () => {
  const { data: redistributions, isLoading } = useQuery({
    queryKey: ['redistribution-log'],
    queryFn: async () => {
      // Récupérer les redistributions
      const { data: logData, error: logError } = await supabase
        .from('lead_redistribution_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (logError) throw logError;

      // Récupérer les infos des agents
      const agentIds = new Set<string>();
      logData?.forEach(log => {
        if (log.from_agent) agentIds.add(log.from_agent);
        if (log.to_agent) agentIds.add(log.to_agent);
      });

      const { data: agentsData } = await supabase
        .from('sales_agents')
        .select('user_id, full_name')
        .in('user_id', Array.from(agentIds));

      const agentsMap = new Map();
      agentsData?.forEach(agent => {
        agentsMap.set(agent.user_id, agent.full_name);
      });

      // Enrichir les données avec les noms
      return logData?.map(log => ({
        ...log,
        from_agent_name: agentsMap.get(log.from_agent) || 'Agent inconnu',
        to_agent_name: agentsMap.get(log.to_agent) || 'Agent inconnu',
      }));
    },
    refetchInterval: 30000, // Rafraîchir toutes les 30 secondes
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5 animate-spin" />
            Chargement...
          </CardTitle>
        </CardHeader>
      </Card>
    );
  }

  const todayRedistributions = redistributions?.filter(r => {
    const today = new Date().toDateString();
    return new Date(r.created_at).toDateString() === today;
  }).length || 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            Historique des Redistributions
          </CardTitle>
          <Badge variant="secondary">
            {todayRedistributions} aujourd'hui
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {!redistributions || redistributions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>Aucune redistribution enregistrée</p>
          </div>
        ) : (
          <ScrollArea className="h-[500px] pr-4">
            <div className="space-y-3">
              {redistributions.map((redistribution) => (
                <div
                  key={redistribution.id}
                  className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className="text-xs">
                      {redistribution.lead_type === 'insurance_quote' ? 'Devis' : 'Rappel'}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(redistribution.created_at), {
                        addSuffix: true,
                        locale: fr,
                      })}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex-1">
                      <div className="text-sm font-medium">
                        {redistribution.from_agent_name}
                      </div>
                      <div className="text-xs text-muted-foreground">Agent source</div>
                    </div>

                    <ArrowRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />

                    <div className="flex-1">
                      <div className="text-sm font-medium text-green-600">
                        {redistribution.to_agent_name}
                      </div>
                      <div className="text-xs text-muted-foreground">Nouveau agent</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-2 p-2 bg-muted/30 rounded text-xs">
                    <AlertCircle className="h-3 w-3" />
                    <span className="text-muted-foreground">{redistribution.reason}</span>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};
