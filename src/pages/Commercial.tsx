import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GoalsAndBadges } from '@/components/commercial/GoalsAndBadges';
import { toast } from 'sonner';
import { Target, TrendingUp, Clock, Award, LogOut, Phone, Mail, LayoutDashboard, Trophy } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const Commercial = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [agentData, setAgentData] = useState<any>(null);
  const [leads, setLeads] = useState<any[]>([]);
  const [performance, setPerformance] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchData();
  }, [user]);

  const fetchData = async () => {
    if (!user) return;

    try {
      // Récupérer les infos du commercial
      const { data: agent } = await supabase
        .from('sales_agents')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (!agent) {
        toast.error("Vous n'êtes pas enregistré comme commercial");
        navigate('/');
        return;
      }

      setAgentData(agent);

      // Récupérer les leads assignés
      const [quotesResult, callbacksResult] = await Promise.all([
        supabase
          .from('insurance_quotes')
          .select('*')
          .eq('assigned_to', user.id)
          .is('deleted_at', null)
          .order('created_at', { ascending: false }),
        supabase
          .from('contact_callbacks')
          .select('*')
          .eq('assigned_to', user.id)
          .is('deleted_at', null)
          .order('created_at', { ascending: false }),
      ]);

      const allLeads = [
        ...(quotesResult.data?.map(q => ({ ...q, type: 'quote' })) || []),
        ...(callbacksResult.data?.map(c => ({ ...c, type: 'callback' })) || []),
      ];
      setLeads(allLeads);

      // Récupérer les performances
      const { data: perf } = await supabase
        .from('agent_performance')
        .select('*')
        .eq('agent_id', agent.id);

      setPerformance(perf || []);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const todayLeads = leads.filter(l => 
    new Date(l.created_at).toDateString() === new Date().toDateString()
  );
  const pendingLeads = leads.filter(l => l.status === 'pending');
  const hotLeads = leads.filter(l => l.lead_score >= 80);
  
  const totalConverted = performance.reduce((sum, p) => sum + p.converted_leads, 0);
  const totalLeads = performance.reduce((sum, p) => sum + p.total_leads, 0);
  const conversionRate = totalLeads > 0 ? ((totalConverted / totalLeads) * 100).toFixed(1) : '0';

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-red-100 text-red-800 dark:bg-red-900/20';
    if (score >= 60) return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20';
    if (score >= 40) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20';
    return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20';
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Dashboard Commercial</h1>
              <p className="text-sm text-muted-foreground">{agentData?.full_name}</p>
            </div>
            <Button variant="ghost" onClick={() => { signOut(); navigate('/'); }}>
              <LogOut className="h-4 w-4 mr-2" />
              Déconnexion
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="dashboard">
              <LayoutDashboard className="h-4 w-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="goals">
              <Trophy className="h-4 w-4 mr-2" />
              Objectifs & Badges
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Leads du jour</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{todayLeads.length}</div>
              <p className="text-xs text-muted-foreground">
                Max: {agentData?.max_daily_leads}
              </p>
            </CardContent>
          </Card>

          <Card className="border-red-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Leads chauds 🔥</CardTitle>
              <Award className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{hotLeads.length}</div>
              <p className="text-xs text-muted-foreground">Priorité urgente</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">En attente</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingLeads.length}</div>
              <p className="text-xs text-muted-foreground">À traiter</p>
            </CardContent>
          </Card>

          <Card className="border-green-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Taux conversion</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{conversionRate}%</div>
              <p className="text-xs text-muted-foreground">
                {totalConverted}/{totalLeads} leads
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Leads Priority List */}
        <Card>
          <CardHeader>
            <CardTitle>Mes Leads - Priorité par score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {leads.slice(0, 10).map((lead) => (
                <div
                  key={lead.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <Badge className={getScoreColor(lead.lead_score)}>
                        {lead.lead_score}
                      </Badge>
                      <div>
                        <p className="font-semibold">{lead.full_name}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {lead.phone}
                          </span>
                          <span className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {lead.email}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={lead.status === 'pending' ? 'destructive' : 'secondary'}>
                      {lead.status}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">
                      {format(new Date(lead.created_at), 'dd MMM HH:mm', { locale: fr })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Performance by Insurance Type */}
        <Card>
          <CardHeader>
            <CardTitle>Performances par Type d'Assurance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {performance.map((perf) => (
                <div
                  key={perf.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <p className="font-medium capitalize">{perf.insurance_type}</p>
                    <p className="text-sm text-muted-foreground">
                      {perf.converted_leads} conversions sur {perf.total_leads} leads
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">
                      {perf.conversion_rate}%
                    </div>
                    {perf.avg_conversion_time_days && (
                      <p className="text-xs text-muted-foreground">
                        Moy: {perf.avg_conversion_time_days.toFixed(1)}j
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
        </CardContent>
      </Card>
          </TabsContent>

          <TabsContent value="goals">
            {agentData && <GoalsAndBadges agentId={agentData.id} />}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Commercial;
