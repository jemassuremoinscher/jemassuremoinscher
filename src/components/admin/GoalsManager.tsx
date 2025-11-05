import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Target, Plus, Edit } from 'lucide-react';

export const GoalsManager = () => {
  const [selectedAgent, setSelectedAgent] = useState<any>(null);
  const [goalLeads, setGoalLeads] = useState(50);
  const [goalConversions, setGoalConversions] = useState(10);
  const queryClient = useQueryClient();

  const { data: agents } = useQuery({
    queryKey: ['sales-agents-with-goals'],
    queryFn: async () => {
      const currentMonth = new Date();
      currentMonth.setDate(1);

      const { data, error } = await supabase
        .from('sales_agents')
        .select(`
          *,
          monthly_goals!monthly_goals_agent_id_fkey (
            id,
            month,
            goal_leads,
            goal_conversions,
            current_leads,
            current_conversions
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const setGoalMutation = useMutation({
    mutationFn: async ({ agentId, goals }: { agentId: string; goals: any }) => {
      const currentMonth = new Date();
      currentMonth.setDate(1);

      const { error } = await supabase
        .from('monthly_goals')
        .upsert({
          agent_id: agentId,
          month: currentMonth.toISOString().split('T')[0],
          goal_leads: goals.leads,
          goal_conversions: goals.conversions,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales-agents-with-goals'] });
      toast.success('Objectifs mis à jour');
      setSelectedAgent(null);
    },
    onError: (error) => {
      toast.error('Erreur: ' + error.message);
    },
  });

  const handleSetGoals = () => {
    if (!selectedAgent) return;
    setGoalMutation.mutate({
      agentId: selectedAgent.id,
      goals: { leads: goalLeads, conversions: goalConversions },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Gestion des Objectifs</h2>
          <p className="text-muted-foreground">
            Définir les objectifs mensuels des commerciaux
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {agents?.map((agent) => {
          const currentGoal = agent.monthly_goals?.[0];
          const leadsProgress = currentGoal
            ? (currentGoal.current_leads / currentGoal.goal_leads) * 100
            : 0;
          const conversionsProgress = currentGoal
            ? (currentGoal.current_conversions / currentGoal.goal_conversions) * 100
            : 0;

          return (
            <Card key={agent.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{agent.full_name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{agent.email}</p>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedAgent(agent);
                          setGoalLeads(currentGoal?.goal_leads || 50);
                          setGoalConversions(currentGoal?.goal_conversions || 10);
                        }}
                      >
                        {currentGoal ? <Edit className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Définir les objectifs - {agent.full_name}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="goal-leads">Objectif Leads</Label>
                          <Input
                            id="goal-leads"
                            type="number"
                            value={goalLeads}
                            onChange={(e) => setGoalLeads(parseInt(e.target.value))}
                            min={1}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="goal-conversions">Objectif Conversions</Label>
                          <Input
                            id="goal-conversions"
                            type="number"
                            value={goalConversions}
                            onChange={(e) => setGoalConversions(parseInt(e.target.value))}
                            min={1}
                          />
                        </div>
                        <Button onClick={handleSetGoals} className="w-full">
                          Enregistrer
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {currentGoal ? (
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Leads</span>
                        <span>
                          {currentGoal.current_leads}/{currentGoal.goal_leads}
                        </span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div
                          className="bg-primary rounded-full h-2 transition-all"
                          style={{ width: `${Math.min(leadsProgress, 100)}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Conversions</span>
                        <span>
                          {currentGoal.current_conversions}/{currentGoal.goal_conversions}
                        </span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div
                          className="bg-green-600 rounded-full h-2 transition-all"
                          style={{ width: `${Math.min(conversionsProgress, 100)}%` }}
                        />
                      </div>
                    </div>
                    {conversionsProgress >= 100 && (
                      <Badge className="w-full justify-center bg-green-600">
                        🎉 Objectif atteint !
                      </Badge>
                    )}
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-4">
                    Aucun objectif défini
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
