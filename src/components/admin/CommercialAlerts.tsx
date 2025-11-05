import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Bell, AlertTriangle, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

interface AgentAlert {
  id: string;
  name: string;
  currentLoad: number;
  maxLoad: number;
  percentage: number;
  level: 'warning' | 'critical';
}

export const CommercialAlerts = () => {
  const [alerts, setAlerts] = useState<AgentAlert[]>([]);
  const [notifiedAgents, setNotifiedAgents] = useState<Set<string>>(new Set());

  const { data: agents } = useQuery({
    queryKey: ['agent-load-monitoring'],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0];

      // Récupérer tous les commerciaux actifs
      const { data: agentsData, error: agentsError } = await supabase
        .from('sales_agents')
        .select('id, user_id, full_name, max_daily_leads, is_active')
        .eq('is_active', true);

      if (agentsError) throw agentsError;

      // Pour chaque commercial, compter les leads du jour
      const agentsWithLoad = await Promise.all(
        (agentsData || []).map(async (agent) => {
          const { count: quotesCount } = await supabase
            .from('insurance_quotes')
            .select('*', { count: 'exact', head: true })
            .eq('assigned_to', agent.user_id)
            .in('status', ['pending', 'contacted', 'qualified'])
            .gte('created_at', today);

          const { count: callbacksCount } = await supabase
            .from('contact_callbacks')
            .select('*', { count: 'exact', head: true })
            .eq('assigned_to', agent.user_id)
            .in('status', ['pending', 'contacted'])
            .gte('created_at', today);

          const currentLoad = (quotesCount || 0) + (callbacksCount || 0);
          const percentage = (currentLoad / agent.max_daily_leads) * 100;

          return {
            id: agent.id,
            name: agent.full_name,
            currentLoad,
            maxLoad: agent.max_daily_leads,
            percentage,
          };
        })
      );

      return agentsWithLoad;
    },
    refetchInterval: 15000, // Vérifier toutes les 15 secondes
  });

  useEffect(() => {
    if (!agents) return;

    const newAlerts: AgentAlert[] = [];

    agents.forEach((agent) => {
      // Alerte critique à 100%
      if (agent.percentage >= 100) {
        newAlerts.push({
          ...agent,
          level: 'critical',
        });

        // Notifier si pas encore fait
        if (!notifiedAgents.has(`${agent.id}-critical`)) {
          toast.error(`⚠️ ${agent.name} a atteint sa charge maximale !`, {
            description: `${agent.currentLoad}/${agent.maxLoad} leads - Pas de nouvelle attribution possible`,
            duration: 8000,
          });
          setNotifiedAgents(prev => new Set(prev).add(`${agent.id}-critical`));
          
          // Jouer un son d'alerte
          playAlertSound('critical');
        }
      }
      // Alerte warning à 80%
      else if (agent.percentage >= 80) {
        newAlerts.push({
          ...agent,
          level: 'warning',
        });

        if (!notifiedAgents.has(`${agent.id}-warning`)) {
          toast.warning(`⚡ ${agent.name} approche de sa charge max`, {
            description: `${agent.currentLoad}/${agent.maxLoad} leads (${agent.percentage.toFixed(0)}%)`,
            duration: 5000,
          });
          setNotifiedAgents(prev => new Set(prev).add(`${agent.id}-warning`));
          
          // Jouer un son d'alerte léger
          playAlertSound('warning');
        }
      }
      // Réinitialiser les notifications si charge redescend
      else if (agent.percentage < 80) {
        setNotifiedAgents(prev => {
          const newSet = new Set(prev);
          newSet.delete(`${agent.id}-warning`);
          newSet.delete(`${agent.id}-critical`);
          return newSet;
        });
      }
    });

    setAlerts(newAlerts);
  }, [agents]);

  const playAlertSound = (type: 'warning' | 'critical') => {
    // Créer un son d'alerte simple avec Web Audio API
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Fréquence plus haute pour critical
      oscillator.frequency.value = type === 'critical' ? 800 : 600;
      oscillator.type = 'sine';

      // Volume
      gainNode.gain.value = 0.3;

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.2);

      // Son double pour critical
      if (type === 'critical') {
        setTimeout(() => {
          const osc2 = audioContext.createOscillator();
          const gain2 = audioContext.createGain();
          osc2.connect(gain2);
          gain2.connect(audioContext.destination);
          osc2.frequency.value = 800;
          osc2.type = 'sine';
          gain2.gain.value = 0.3;
          osc2.start(audioContext.currentTime);
          osc2.stop(audioContext.currentTime + 0.2);
        }, 300);
      }
    } catch (error) {
      console.error('Erreur son d\'alerte:', error);
    }
  };

  if (alerts.length === 0) {
    return (
      <Card className="border-green-200 bg-green-50 dark:bg-green-900/10">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2 text-green-700 dark:text-green-400">
            <Bell className="h-4 w-4" />
            Alertes Charge Commerciaux
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-green-700 dark:text-green-400">
            ✓ Tous les commerciaux ont une charge normale
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-orange-200 bg-orange-50 dark:bg-orange-900/10">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2 text-orange-700 dark:text-orange-400">
          <Bell className="h-4 w-4 animate-pulse" />
          Alertes Charge Commerciaux
          <Badge variant="destructive" className="ml-auto">
            {alerts.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {alerts.map((alert) => (
          <Alert
            key={alert.id}
            variant={alert.level === 'critical' ? 'destructive' : 'default'}
            className={alert.level === 'warning' ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/10' : ''}
          >
            <div className="flex items-center gap-2">
              {alert.level === 'critical' ? (
                <AlertTriangle className="h-4 w-4" />
              ) : (
                <TrendingUp className="h-4 w-4" />
              )}
              <AlertDescription className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-semibold">{alert.name}</span>
                    <p className="text-xs mt-1">
                      {alert.currentLoad}/{alert.maxLoad} leads ({alert.percentage.toFixed(0)}%)
                    </p>
                  </div>
                  <Badge 
                    variant={alert.level === 'critical' ? 'destructive' : 'secondary'}
                    className="text-xs"
                  >
                    {alert.level === 'critical' ? '100% Saturé' : '⚠️ 80%+'}
                  </Badge>
                </div>
              </AlertDescription>
            </div>
          </Alert>
        ))}
      </CardContent>
    </Card>
  );
};
