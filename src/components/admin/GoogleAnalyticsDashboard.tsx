import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';
import {
  Users, Eye, Clock, TrendingUp, Globe, FileText,
  Loader2, AlertCircle, RefreshCw, ArrowUpRight,
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const SOURCE_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316', '#14b8a6', '#6366f1'];

const formatDuration = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}m ${secs}s`;
};

export const GoogleAnalyticsDashboard = () => {
  const [dateRange, setDateRange] = useState('30daysAgo');

  const { data, isLoading, error, refetch, isRefetching } = useQuery({
    queryKey: ['ga4-analytics', dateRange],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Non authentifié');

      const response = await supabase.functions.invoke('ga4-analytics', {
        body: { startDate: dateRange, endDate: 'today' },
      });

      if (response.error) throw response.error;
      if (response.data?.error && !response.data?.overview) {
        return { notConfigured: true, message: response.data.message };
      }
      return response.data;
    },
    refetchInterval: 60000,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Erreur lors du chargement des données Analytics : {(error as Error).message}
        </AlertDescription>
      </Alert>
    );
  }

  if (data?.notConfigured) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {data.message || 'Google Analytics n\'est pas encore configuré. Ajoutez les secrets GA4_PROPERTY_ID et GA4_SERVICE_ACCOUNT_JSON.'}
        </AlertDescription>
      </Alert>
    );
  }

  const { overview, pages, sources, daily } = data || {};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
            <TrendingUp className="h-7 w-7 text-primary" />
            Google Analytics
          </h2>
          <p className="text-muted-foreground mt-1">Statistiques de trafic en temps réel</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7daysAgo">7 derniers jours</SelectItem>
              <SelectItem value="30daysAgo">30 derniers jours</SelectItem>
              <SelectItem value="90daysAgo">90 derniers jours</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={() => refetch()} disabled={isRefetching} aria-label="Rafraîchir les données Analytics">
            <RefreshCw className={`h-4 w-4 ${isRefetching ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      {overview && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <Users className="h-4 w-4 text-primary" />
              <span className="text-xs text-muted-foreground">Utilisateurs</span>
            </div>
            <p className="text-2xl font-bold">{overview.activeUsers.toLocaleString('fr-FR')}</p>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <ArrowUpRight className="h-4 w-4 text-green-600" />
              <span className="text-xs text-muted-foreground">Nouveaux</span>
            </div>
            <p className="text-2xl font-bold">{overview.newUsers.toLocaleString('fr-FR')}</p>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <Globe className="h-4 w-4 text-blue-600" />
              <span className="text-xs text-muted-foreground">Sessions</span>
            </div>
            <p className="text-2xl font-bold">{overview.sessions.toLocaleString('fr-FR')}</p>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <Eye className="h-4 w-4 text-purple-600" />
              <span className="text-xs text-muted-foreground">Pages vues</span>
            </div>
            <p className="text-2xl font-bold">{overview.pageViews.toLocaleString('fr-FR')}</p>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="h-4 w-4 text-orange-600" />
              <span className="text-xs text-muted-foreground">Durée moy.</span>
            </div>
            <p className="text-2xl font-bold">{formatDuration(overview.avgSessionDuration)}</p>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-4 w-4 text-red-600" />
              <span className="text-xs text-muted-foreground">Taux rebond</span>
            </div>
            <p className="text-2xl font-bold">{(overview.bounceRate * 100).toFixed(1)}%</p>
          </Card>
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily visitors chart */}
        {daily && daily.length > 0 && (
          <Card className="p-4 sm:p-6">
            <h3 className="text-lg font-bold mb-4">Visiteurs par jour</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={daily}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={2} name="Utilisateurs" dot={false} />
                <Line type="monotone" dataKey="sessions" stroke="#10b981" strokeWidth={2} name="Sessions" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        )}

        {/* Sources pie chart */}
        {sources && sources.length > 0 && (
          <Card className="p-4 sm:p-6">
            <h3 className="text-lg font-bold mb-4">Sources de trafic</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={sources.map((s: any) => ({ name: s.source || '(direct)', value: s.sessions }))}
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  dataKey="value"
                  label={({ name, percent }) => percent > 0.05 ? `${(percent * 100).toFixed(0)}%` : null}
                  labelLine={false}
                >
                  {sources.map((_: any, i: number) => (
                    <Cell key={i} fill={SOURCE_COLORS[i % SOURCE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => [`${value} sessions`, '']} />
                <Legend layout="horizontal" verticalAlign="bottom" wrapperStyle={{ fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        )}
      </div>

      {/* Pages vues chart */}
      {daily && daily.length > 0 && (
        <Card className="p-4 sm:p-6">
          <h3 className="text-lg font-bold mb-4">Pages vues par jour</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={daily}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="pageViews" fill="#8b5cf6" name="Pages vues" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* Top pages table */}
      {pages && pages.length > 0 && (
        <Card className="p-4 sm:p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Pages les plus visitées
          </h3>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Page</TableHead>
                  <TableHead className="text-right">Vues</TableHead>
                  <TableHead className="text-right">Utilisateurs</TableHead>
                  <TableHead className="text-right">Durée moy.</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pages.map((page: any, index: number) => (
                  <TableRow key={index}>
                    <TableCell className="font-mono text-sm max-w-xs truncate">
                      {page.path}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {page.views.toLocaleString('fr-FR')}
                    </TableCell>
                    <TableCell className="text-right">
                      {page.users.toLocaleString('fr-FR')}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {formatDuration(page.avgDuration)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}

      {/* Sources table */}
      {sources && sources.length > 0 && (
        <Card className="p-4 sm:p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            Détail des sources de trafic
          </h3>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Source</TableHead>
                  <TableHead className="text-right">Sessions</TableHead>
                  <TableHead className="text-right">Utilisateurs</TableHead>
                  <TableHead className="text-right">Taux rebond</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sources.map((source: any, index: number) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: SOURCE_COLORS[index % SOURCE_COLORS.length] }} />
                        {source.source || '(direct)'}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">{source.sessions.toLocaleString('fr-FR')}</TableCell>
                    <TableCell className="text-right">{source.users.toLocaleString('fr-FR')}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant={source.bounceRate > 0.7 ? 'destructive' : 'outline'}>
                        {(source.bounceRate * 100).toFixed(1)}%
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}
    </div>
  );
};
