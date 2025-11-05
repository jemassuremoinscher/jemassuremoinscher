import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { ArrowRight, RefreshCw, History } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export const RedistributionHistory = () => {
  const queryClient = useQueryClient();

  const { data: redistributions, isLoading } = useQuery({
    queryKey: ['redistribution-history'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lead_redistribution_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      // Enrichir avec les noms des agents
      const enrichedData = await Promise.all(
        (data || []).map(async (log) => {
          const [fromAgent, toAgent] = await Promise.all([
            supabase
              .from('sales_agents')
              .select('full_name')
              .eq('user_id', log.from_agent)
              .maybeSingle(),
            supabase
              .from('sales_agents')
              .select('full_name')
              .eq('user_id', log.to_agent)
              .maybeSingle(),
          ]);

          return {
            ...log,
            from_agent_name: fromAgent.data?.full_name || 'Inconnu',
            to_agent_name: toAgent.data?.full_name || 'Inconnu',
          };
        })
      );

      return enrichedData;
    },
    refetchInterval: 30000,
  });

  const reassignMutation = useMutation({
    mutationFn: async () => {
      // Appeler une fonction RPC pour réassigner les leads en attente
      const { data, error } = await supabase.rpc('reassign_pending_leads');

      if (error) throw error;
      return data;
    },
    onSuccess: (count) => {
      toast.success(`${count} lead(s) réassigné(s) avec succès`);
      queryClient.invalidateQueries({ queryKey: ['redistribution-history'] });
      queryClient.invalidateQueries({ queryKey: ['commercial-supervision'] });
      queryClient.invalidateQueries({ queryKey: ['crm-leads'] });
    },
    onError: (error) => {
      toast.error('Erreur lors de la réassignation: ' + error.message);
    },
  });

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Historique des Redistributions
          </CardTitle>
          <Button
            onClick={() => reassignMutation.mutate()}
            disabled={reassignMutation.isPending}
            size="sm"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${reassignMutation.isPending ? 'animate-spin' : ''}`} />
            Réassigner les leads en attente
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {redistributions && redistributions.length > 0 ? (
          <div className="space-y-3">
            {redistributions.map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1">
                  <Badge variant="outline" className="text-xs">
                    {log.lead_type === 'insurance_quote' ? 'Devis' : 'Rappel'}
                  </Badge>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{log.from_agent_name}</span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-primary">{log.to_agent_name}</span>
                  </div>

                  <Badge variant="secondary" className="text-xs">
                    {log.reason}
                  </Badge>
                </div>

                <div className="text-right text-xs text-muted-foreground">
                  {format(new Date(log.created_at), 'dd MMM yyyy HH:mm', { locale: fr })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-8">
            <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Aucune redistribution enregistrée</p>
            <p className="text-xs mt-2">
              Les redistributions automatiques apparaîtront ici
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
