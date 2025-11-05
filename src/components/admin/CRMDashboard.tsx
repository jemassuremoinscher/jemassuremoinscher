import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  TrendingUp,
  TrendingDown,
  Users,
  Target,
  Phone,
  Mail,
  Calendar,
  MessageSquare,
  Award,
  Filter,
  ArrowRight,
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Lead {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  insurance_type?: string;
  status: string;
  lead_score: number;
  lead_source: string;
  created_at: string;
  last_contacted_at?: string;
  next_follow_up?: string;
  notes?: string;
  assigned_to?: string;
  type: 'quote' | 'callback';
}

const getScoreColor = (score: number) => {
  if (score >= 80) return 'text-green-600 bg-green-50 dark:bg-green-900/20';
  if (score >= 60) return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20';
  if (score >= 40) return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20';
  return 'text-red-600 bg-red-50 dark:bg-red-900/20';
};

const getScoreBadge = (score: number) => {
  if (score >= 80) return { label: 'Chaud 🔥', variant: 'default' as const };
  if (score >= 60) return { label: 'Qualifié ✓', variant: 'secondary' as const };
  if (score >= 40) return { label: 'Tiède', variant: 'outline' as const };
  return { label: 'Froid', variant: 'destructive' as const };
};

export const CRMDashboard = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [filterScore, setFilterScore] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'score' | 'date'>('score');

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const [quotesResult, callbacksResult] = await Promise.all([
        supabase
          .from('insurance_quotes')
          .select('*')
          .is('deleted_at', null)
          .order('lead_score', { ascending: false }),
        supabase
          .from('contact_callbacks')
          .select('*')
          .is('deleted_at', null)
          .order('lead_score', { ascending: false }),
      ]);

      const allLeads: Lead[] = [
        ...(quotesResult.data?.map((q) => ({ ...q, type: 'quote' as const })) || []),
        ...(callbacksResult.data?.map((c) => ({ ...c, type: 'callback' as const })) || []),
      ];

      setLeads(allLeads);
    } catch (error) {
      console.error('Error fetching leads:', error);
      toast.error('Erreur lors du chargement des leads');
    } finally {
      setLoading(false);
    }
  };

  const updateLeadStatus = async (leadId: string, type: string, newStatus: string) => {
    const table = type === 'quote' ? 'insurance_quotes' : 'contact_callbacks';
    const { error } = await supabase
      .from(table)
      .update({ status: newStatus, last_contacted_at: new Date().toISOString() })
      .eq('id', leadId);

    if (error) {
      toast.error('Erreur lors de la mise à jour');
    } else {
      toast.success('Statut mis à jour');
      fetchLeads();
    }
  };

  const updateLeadNotes = async (leadId: string, type: string, notes: string) => {
    const table = type === 'quote' ? 'insurance_quotes' : 'contact_callbacks';
    const { error } = await supabase
      .from(table)
      .update({ notes, last_contacted_at: new Date().toISOString() })
      .eq('id', leadId);

    if (error) {
      toast.error('Erreur lors de la sauvegarde');
    } else {
      toast.success('Notes sauvegardées');
      fetchLeads();
      setSelectedLead(null);
    }
  };

  const filteredLeads = leads
    .filter((lead) => {
      if (filterScore !== 'all') {
        const scoreThreshold = parseInt(filterScore);
        if (lead.lead_score < scoreThreshold) return false;
      }
      if (filterStatus !== 'all' && lead.status !== filterStatus) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'score') {
        return b.lead_score - a.lead_score;
      }
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  const stats = {
    total: leads.length,
    hot: leads.filter((l) => l.lead_score >= 80).length,
    qualified: leads.filter((l) => l.lead_score >= 60 && l.lead_score < 80).length,
    pending: leads.filter((l) => l.status === 'pending').length,
    avgScore: Math.round(leads.reduce((acc, l) => acc + l.lead_score, 0) / leads.length || 0),
  };

  const statusGroups = {
    pending: filteredLeads.filter((l) => l.status === 'pending'),
    contacted: filteredLeads.filter((l) => l.status === 'contacted'),
    qualified: filteredLeads.filter((l) => l.status === 'qualified'),
    converted: filteredLeads.filter((l) => l.status === 'converted'),
    rejected: filteredLeads.filter((l) => l.status === 'rejected'),
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Leads</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
            <Users className="h-8 w-8 text-primary" />
          </div>
        </Card>

        <Card className="p-4 border-red-200 dark:border-red-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Chauds 🔥</p>
              <p className="text-2xl font-bold text-red-600">{stats.hot}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-red-600" />
          </div>
        </Card>

        <Card className="p-4 border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Qualifiés</p>
              <p className="text-2xl font-bold text-blue-600">{stats.qualified}</p>
            </div>
            <Target className="h-8 w-8 text-blue-600" />
          </div>
        </Card>

        <Card className="p-4 border-yellow-200 dark:border-yellow-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">En attente</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <TrendingDown className="h-8 w-8 text-yellow-600" />
          </div>
        </Card>

        <Card className="p-4 border-green-200 dark:border-green-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Score Moyen</p>
              <p className="text-2xl font-bold text-green-600">{stats.avgScore}</p>
            </div>
            <Award className="h-8 w-8 text-green-600" />
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Filtres:</span>
          </div>
          
          <Select value={filterScore} onValueChange={setFilterScore}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Score minimum" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les scores</SelectItem>
              <SelectItem value="80">Chauds (80+)</SelectItem>
              <SelectItem value="60">Qualifiés (60+)</SelectItem>
              <SelectItem value="40">Tièdes (40+)</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="pending">En attente</SelectItem>
              <SelectItem value="contacted">Contacté</SelectItem>
              <SelectItem value="qualified">Qualifié</SelectItem>
              <SelectItem value="converted">Converti</SelectItem>
              <SelectItem value="rejected">Rejeté</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={(v) => setSortBy(v as 'score' | 'date')}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Trier par" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="score">Score (décroissant)</SelectItem>
              <SelectItem value="date">Date (récent)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Pipeline View */}
      <Tabs defaultValue="pipeline" className="w-full">
        <TabsList>
          <TabsTrigger value="pipeline">Vue Pipeline</TabsTrigger>
          <TabsTrigger value="list">Vue Liste</TabsTrigger>
        </TabsList>

        <TabsContent value="pipeline" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {Object.entries(statusGroups).map(([status, statusLeads]) => (
              <Card key={status} className="p-4">
                <h3 className="font-semibold mb-4 capitalize flex items-center justify-between">
                  {status === 'pending' && '🔔 En attente'}
                  {status === 'contacted' && '📞 Contactés'}
                  {status === 'qualified' && '✅ Qualifiés'}
                  {status === 'converted' && '🎉 Convertis'}
                  {status === 'rejected' && '❌ Rejetés'}
                  <Badge variant="outline">{statusLeads.length}</Badge>
                </h3>
                <div className="space-y-2 max-h-[600px] overflow-y-auto">
                  {statusLeads.map((lead) => (
                    <Dialog key={lead.id}>
                      <DialogTrigger asChild>
                        <Card
                          className="p-3 cursor-pointer hover:shadow-md transition-shadow"
                          onClick={() => setSelectedLead(lead)}
                        >
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <p className="font-medium text-sm truncate">{lead.full_name}</p>
                              <Badge className={`${getScoreColor(lead.lead_score)} text-xs`}>
                                {lead.lead_score}
                              </Badge>
                            </div>
                            {lead.insurance_type && (
                              <Badge variant="outline" className="text-xs">
                                {lead.insurance_type}
                              </Badge>
                            )}
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {format(new Date(lead.created_at), 'dd MMM', { locale: fr })}
                            </p>
                          </div>
                        </Card>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Détails du Lead</DialogTitle>
                        </DialogHeader>
                        {selectedLead && (
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <h3 className="text-xl font-bold">{selectedLead.full_name}</h3>
                              <Badge {...getScoreBadge(selectedLead.lead_score)}>
                                {getScoreBadge(selectedLead.lead_score).label} ({selectedLead.lead_score}/100)
                              </Badge>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">{selectedLead.email}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">{selectedLead.phone}</span>
                              </div>
                            </div>

                            {selectedLead.insurance_type && (
                              <div>
                                <p className="text-sm text-muted-foreground mb-1">Type d'assurance</p>
                                <Badge variant="secondary">{selectedLead.insurance_type}</Badge>
                              </div>
                            )}

                            <div>
                              <p className="text-sm text-muted-foreground mb-1">Source</p>
                              <Badge variant="outline">{selectedLead.lead_source}</Badge>
                            </div>

                            <div>
                              <p className="text-sm text-muted-foreground mb-2">Changer le statut</p>
                              <Select
                                value={selectedLead.status}
                                onValueChange={(v) => updateLeadStatus(selectedLead.id, selectedLead.type, v)}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">En attente</SelectItem>
                                  <SelectItem value="contacted">Contacté</SelectItem>
                                  <SelectItem value="qualified">Qualifié</SelectItem>
                                  <SelectItem value="converted">Converti</SelectItem>
                                  <SelectItem value="rejected">Rejeté</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div>
                              <p className="text-sm text-muted-foreground mb-2">Notes internes</p>
                              <Textarea
                                placeholder="Ajouter des notes sur ce lead..."
                                defaultValue={selectedLead.notes || ''}
                                rows={4}
                                onChange={(e) => {
                                  setSelectedLead({ ...selectedLead, notes: e.target.value });
                                }}
                              />
                              <Button
                                className="mt-2"
                                onClick={() => updateLeadNotes(selectedLead.id, selectedLead.type, selectedLead.notes || '')}
                              >
                                <MessageSquare className="h-4 w-4 mr-2" />
                                Sauvegarder les notes
                              </Button>
                            </div>

                            {selectedLead.last_contacted_at && (
                              <div className="text-sm text-muted-foreground">
                                Dernier contact: {format(new Date(selectedLead.last_contacted_at), 'dd/MM/yyyy à HH:mm', { locale: fr })}
                              </div>
                            )}
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="list" className="space-y-2">
          {filteredLeads.map((lead) => (
            <Card key={lead.id} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <Badge className={`${getScoreColor(lead.lead_score)} font-bold`}>
                    {lead.lead_score}
                  </Badge>
                  <div className="flex-1">
                    <p className="font-semibold">{lead.full_name}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {lead.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {lead.phone}
                      </span>
                    </div>
                  </div>
                  {lead.insurance_type && (
                    <Badge variant="secondary">{lead.insurance_type}</Badge>
                  )}
                  <Badge variant="outline">{lead.lead_source}</Badge>
                  <Badge {...getScoreBadge(lead.lead_score)}>
                    {getScoreBadge(lead.lead_score).label}
                  </Badge>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" onClick={() => setSelectedLead(lead)}>
                      Voir détails
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    {/* Same content as above */}
                  </DialogContent>
                </Dialog>
              </div>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};
