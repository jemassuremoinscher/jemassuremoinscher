import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, Target, TrendingUp, Award } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface GoalsAndBadgesProps {
  agentId: string;
}

export const GoalsAndBadges = ({ agentId }: GoalsAndBadgesProps) => {
  const [monthlyGoal, setMonthlyGoal] = useState<any>(null);
  const [badges, setBadges] = useState<any[]>([]);
  const [allBadges, setAllBadges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [agentId]);

  const fetchData = async () => {
    try {
      const currentMonth = new Date();
      currentMonth.setDate(1);

      // Récupérer l'objectif du mois actuel
      const { data: goal } = await supabase
        .from('monthly_goals')
        .select('*')
        .eq('agent_id', agentId)
        .eq('month', currentMonth.toISOString().split('T')[0])
        .maybeSingle();

      setMonthlyGoal(goal);

      // Récupérer les badges obtenus
      const { data: earnedBadges } = await supabase
        .from('agent_badges')
        .select(`
          *,
          achievement_badges (*)
        `)
        .eq('agent_id', agentId)
        .order('earned_at', { ascending: false });

      setBadges(earnedBadges || []);

      // Récupérer tous les badges disponibles
      const { data: availableBadges } = await supabase
        .from('achievement_badges')
        .select('*')
        .order('requirement_value', { ascending: true });

      setAllBadges(availableBadges || []);
    } catch (error) {
      console.error('Error fetching goals and badges:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  const leadsProgress = monthlyGoal 
    ? (monthlyGoal.current_leads / monthlyGoal.goal_leads) * 100 
    : 0;
  const conversionsProgress = monthlyGoal 
    ? (monthlyGoal.current_conversions / monthlyGoal.goal_conversions) * 100 
    : 0;

  const totalPoints = badges.reduce((sum, b) => sum + (b.achievement_badges?.points || 0), 0);
  const earnedBadgeIds = badges.map(b => b.badge_id);

  return (
    <div className="space-y-6">
      {/* Objectifs Mensuels */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Objectifs du Mois
            </CardTitle>
            <Badge variant="secondary" className="text-lg">
              {totalPoints} points
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {monthlyGoal ? (
            <>
              {/* Objectif Leads */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Leads traités</span>
                  <span className="text-muted-foreground">
                    {monthlyGoal.current_leads} / {monthlyGoal.goal_leads}
                  </span>
                </div>
                <Progress value={Math.min(leadsProgress, 100)} className="h-3" />
                <div className="text-xs text-muted-foreground text-right">
                  {leadsProgress.toFixed(0)}% complété
                </div>
              </div>

              {/* Objectif Conversions */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Conversions</span>
                  <span className="text-muted-foreground">
                    {monthlyGoal.current_conversions} / {monthlyGoal.goal_conversions}
                  </span>
                </div>
                <Progress value={Math.min(conversionsProgress, 100)} className="h-3" />
                <div className="text-xs text-muted-foreground text-right">
                  {conversionsProgress.toFixed(0)}% complété
                </div>
              </div>

              {/* Messages de motivation */}
              {conversionsProgress >= 100 && (
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium text-green-600">
                    🎉 Objectif atteint ! Bravo !
                  </span>
                </div>
              )}
              {conversionsProgress >= 80 && conversionsProgress < 100 && (
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-medium text-blue-600">
                    Presque là ! Plus que {monthlyGoal.goal_conversions - monthlyGoal.current_conversions} conversion(s)
                  </span>
                </div>
              )}
            </>
          ) : (
            <div className="text-center text-muted-foreground py-4">
              Aucun objectif défini pour ce mois. Les objectifs se créent automatiquement avec vos premiers leads.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Badges Obtenus */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Badges Obtenus ({badges.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {badges.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {badges.map((badge) => (
                <div
                  key={badge.id}
                  className="p-4 border rounded-lg bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20"
                >
                  <div className="text-center space-y-2">
                    <div className="text-4xl">{badge.achievement_badges?.icon}</div>
                    <div className="font-semibold text-sm">{badge.achievement_badges?.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {badge.achievement_badges?.description}
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      +{badge.achievement_badges?.points} pts
                    </Badge>
                    <div className="text-xs text-muted-foreground">
                      {format(new Date(badge.earned_at), 'dd MMM yyyy', { locale: fr })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-8">
              Aucun badge obtenu pour le moment. Continuez à convertir des leads !
            </div>
          )}
        </CardContent>
      </Card>

      {/* Badges à Débloquer */}
      <Card>
        <CardHeader>
          <CardTitle>Badges à Débloquer</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {allBadges
              .filter(badge => !earnedBadgeIds.includes(badge.id))
              .map((badge) => (
                <div
                  key={badge.id}
                  className="p-3 border rounded-lg bg-muted/50 opacity-60"
                >
                  <div className="text-center space-y-2">
                    <div className="text-3xl grayscale">{badge.icon}</div>
                    <div className="font-semibold text-xs">{badge.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {badge.description}
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {badge.requirement_value}
                      {badge.requirement_type === 'conversions' && ' conversions'}
                      {badge.requirement_type === 'conversion_rate' && '% taux'}
                    </Badge>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
