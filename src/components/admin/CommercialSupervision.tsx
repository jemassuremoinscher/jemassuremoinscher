import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  TrendingUp, 
  Phone, 
  CheckCircle2, 
  Clock, 
  Target,
  Activity,
  Award,
  Calendar
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

export const CommercialSupervision = () => {
  // Récupérer tous les commerciaux avec leurs stats
  const { data: agents, isLoading } = useQuery({
    queryKey: ['commercial-supervision'],
    queryFn: async () => {
      const currentMonth = new Date();
      currentMonth.setDate(1);

      const { data, error } = await supabase
        .from('sales_agents')
        .select(`
          *,
          agent_performance (
            insurance_type,
            total_leads,
            converted_leads,
            conversion_rate
          ),
          monthly_goals!monthly_goals_agent_id_fkey (
            goal_leads,
            goal_conversions,
            current_leads,
            current_conversions
          ),
          agent_badges (
            id,
            achievement_badges (
              name,
              icon,
              points
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Pour chaque agent, récupérer ses leads récents
      const agentsWithLeads = await Promise.all(
        (data || []).map(async (agent) => {
          const [quotesResult, callbacksResult] = await Promise.all([
            supabase
              .from('insurance_quotes')
              .select('*')
              .eq('assigned_to', agent.user_id)
              .is('deleted_at', null)
              .order('created_at', { ascending: false })
              .limit(5),
            supabase
              .from('contact_callbacks')
              .select('*')
              .eq('assigned_to', agent.user_id)
              .is('deleted_at', null)
              .order('created_at', { ascending: false })
              .limit(5),
          ]);

          const recentLeads = [
            ...(quotesResult.data?.map(q => ({ ...q, type: 'quote' })) || []),
            ...(callbacksResult.data?.map(c => ({ ...c, type: 'callback' })) || []),
          ].sort((a, b) => 
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          ).slice(0, 5);

          // Compter leads du jour
          const today = new Date().toISOString().split('T')[0];
          const todayLeads = [
            ...(quotesResult.data || []),
            ...(callbacksResult.data || []),
          ].filter(lead => lead.created_at.startsWith(today));

          return {
            ...agent,
            recentLeads,
            todayLeadsCount: todayLeads.length,
          };
        })
      );

      return agentsWithLeads;
    },
    refetchInterval: 30000, // Rafraîchir toutes les 30 secondes
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const activeAgents = agents?.filter(a => a.is_active) || [];
  const totalAgents = agents?.length || 0;
  const totalTodayLeads = activeAgents.reduce((sum, a) => sum + a.todayLeadsCount, 0);
  const avgConversionRate = activeAgents.reduce((sum, a) => {
    const rate = a.agent_performance?.reduce((s, p) => s + p.conversion_rate, 0) / (a.agent_performance?.length || 1);
    return sum + rate;
  }, 0) / (activeAgents.length || 1);

  return (
    <div className="space-y-6">
      {/* Stats Globales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Commerciaux Actifs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeAgents.length}/{totalAgents}</div>
            <p className="text-xs text-muted-foreground">Total dans l'équipe</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Leads du Jour</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTodayLeads}</div>
            <p className="text-xs text-muted-foreground">En cours de traitement</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Taux Conversion Moyen</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{avgConversionRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Performance équipe</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Objectifs Atteints</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {activeAgents.filter(a => {
                const goal = a.monthly_goals?.[0];
                return goal && goal.current_conversions >= goal.goal_conversions;
              }).length}
            </div>
            <p className="text-xs text-muted-foreground">Ce mois-ci</p>
          </CardContent>
        </Card>
      </div>

      {/* Vue Détaillée par Commercial */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="performance">Performances</TabsTrigger>
          <TabsTrigger value="activity">Activité Récente</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {activeAgents.map((agent) => {
            const goal = agent.monthly_goals?.[0];
            const totalBadges = agent.agent_badges?.length || 0;
            const totalPoints = agent.agent_badges?.reduce((sum, b) => 
              sum + (b.achievement_badges?.points || 0), 0) || 0;
            const conversionProgress = goal 
              ? (goal.current_conversions / goal.goal_conversions) * 100 
              : 0;

            return (
              <Card key={agent.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {agent.full_name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{agent.full_name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{agent.email}</p>
                        {agent.specializations && agent.specializations.length > 0 && (
                          <div className="flex gap-1 mt-1">
                            {agent.specializations.slice(0, 3).map((spec) => (
                              <Badge key={spec} variant="outline" className="text-xs">
                                {spec}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={agent.is_active ? "default" : "secondary"}>
                        {agent.is_active ? "Actif" : "Inactif"}
                      </Badge>
                      <div className="mt-2 text-sm text-muted-foreground">
                        {totalBadges} badges • {totalPoints} pts
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Objectif du mois */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <Target className="h-4 w-4" />
                        Objectif Mensuel
                      </div>
                      {goal ? (
                        <>
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span>Conversions</span>
                              <span>{goal.current_conversions}/{goal.goal_conversions}</span>
                            </div>
                            <Progress value={Math.min(conversionProgress, 100)} className="h-2" />
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {conversionProgress >= 100 ? (
                              <span className="text-green-600 font-medium">✓ Objectif atteint !</span>
                            ) : (
                              <span>{conversionProgress.toFixed(0)}% complété</span>
                            )}
                          </div>
                        </>
                      ) : (
                        <p className="text-xs text-muted-foreground">Aucun objectif défini</p>
                      )}
                    </div>

                    {/* Activité */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <Activity className="h-4 w-4" />
                        Activité
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Aujourd'hui</span>
                          <span className="font-medium">{agent.todayLeadsCount} leads</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Max/jour</span>
                          <span className="font-medium">{agent.max_daily_leads}</span>
                        </div>
                        <Progress 
                          value={(agent.todayLeadsCount / agent.max_daily_leads) * 100} 
                          className="h-2" 
                        />
                      </div>
                    </div>

                    {/* Performances */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <TrendingUp className="h-4 w-4" />
                        Performances
                      </div>
                      <div className="space-y-1">
                        {agent.agent_performance?.slice(0, 2).map((perf) => (
                          <div key={perf.insurance_type} className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground capitalize">{perf.insurance_type}</span>
                            <span className="font-medium text-green-600">{perf.conversion_rate}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Classement par Taux de Conversion</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[...activeAgents]
                  .sort((a, b) => {
                    const aRate = a.agent_performance?.reduce((sum, p) => sum + p.conversion_rate, 0) / (a.agent_performance?.length || 1);
                    const bRate = b.agent_performance?.reduce((sum, p) => sum + p.conversion_rate, 0) / (b.agent_performance?.length || 1);
                    return bRate - aRate;
                  })
                  .map((agent, index) => {
                    const avgRate = agent.agent_performance?.reduce((sum, p) => sum + p.conversion_rate, 0) / (agent.agent_performance?.length || 1) || 0;
                    const totalConverted = agent.agent_performance?.reduce((sum, p) => sum + p.converted_leads, 0) || 0;
                    
                    return (
                      <div key={agent.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="text-2xl font-bold text-muted-foreground w-8">
                            #{index + 1}
                          </div>
                          <Avatar>
                            <AvatarFallback>
                              {agent.full_name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{agent.full_name}</p>
                            <p className="text-sm text-muted-foreground">
                              {totalConverted} conversions
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-600">
                            {avgRate.toFixed(1)}%
                          </div>
                          <p className="text-xs text-muted-foreground">Taux moyen</p>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          {activeAgents.map((agent) => (
            <Card key={agent.id}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>
                      {agent.full_name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-base">{agent.full_name}</CardTitle>
                    <p className="text-sm text-muted-foreground">Activité récente</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {agent.recentLeads.length > 0 ? (
                  <div className="space-y-3">
                    {agent.recentLeads.map((lead) => (
                      <div key={lead.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          {lead.status === 'converted' ? (
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                          ) : lead.status === 'contacted' ? (
                            <Phone className="h-5 w-5 text-blue-600" />
                          ) : (
                            <Clock className="h-5 w-5 text-yellow-600" />
                          )}
                          <div>
                            <p className="font-medium text-sm">{lead.full_name}</p>
                            <p className="text-xs text-muted-foreground">
                              {lead.type === 'quote' && 'insurance_type' in lead && lead.insurance_type 
                                ? lead.insurance_type 
                                : 'Demande de rappel'}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant={
                            lead.status === 'converted' ? 'default' :
                            lead.status === 'contacted' ? 'secondary' :
                            'outline'
                          }>
                            {lead.status}
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatDistanceToNow(new Date(lead.created_at), { 
                              addSuffix: true,
                              locale: fr 
                            })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-4">
                    Aucune activité récente
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};
