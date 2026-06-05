import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ManualLeadForm } from '@/components/admin/ManualLeadForm';
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
  CheckCircle2,
  Plus,
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface SalesAgent {
  id: string;
  full_name: string;
  email: string;
  user_id?: string;
}

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
  signed_before_hot?: boolean;
  type: 'quote' | 'callback';
  agent_name?: string;
  quote_data?: any;
  message?: string;
  preferred_time?: string;
}

const FIELD_LABELS: Record<string, string> = {
  postalCode: 'Code postal',
  city: 'Ville',
  address: 'Adresse',
  birthDate: 'Date de naissance',
  age: 'Âge',
  profession: 'Profession',
  maritalStatus: 'Situation familiale',
  currentInsurer: 'Assureur actuel',
  contractEndDate: 'Échéance du contrat',
  desiredStartDate: 'Date de début souhaitée',
  monthlyBudget: 'Budget mensuel',
  // Auto / moto
  vehicleBrand: 'Marque',
  vehicleModel: 'Modèle',
  vehicleYear: 'Année',
  vehicleVersion: 'Version',
  fuelType: 'Carburant',
  registrationDate: 'Mise en circulation',
  licensePlate: 'Immatriculation',
  vehicleUsage: 'Usage du véhicule',
  annualKm: 'Km/an',
  parkingType: 'Stationnement',
  licenseDate: "Date d'obtention du permis",
  bonusMalus: 'Bonus-Malus',
  claimsLast3Years: 'Sinistres (3 ans)',
  coverageType: 'Formule souhaitée',
  // Habitation / PNO
  housingType: 'Type de logement',
  surface: 'Surface (m²)',
  rooms: 'Nombre de pièces',
  occupancyType: 'Statut occupant',
  constructionYear: 'Année de construction',
  // Santé / prévoyance
  beneficiaries: 'Bénéficiaires',
  smokingStatus: 'Fumeur',
  coverageLevel: 'Niveau de couverture',
  // Pro
  companyName: 'Entreprise',
  legalStatus: 'Statut juridique',
  siret: 'SIRET',
  turnover: "Chiffre d'affaires",
  activity: 'Activité',
  employees: 'Effectif',
  // Tracking
  source: 'Source',
  utm_data: 'UTM',
};

const formatFieldValue = (value: any): string => {
  if (value === null || value === undefined || value === '') return '—';
  if (typeof value === 'boolean') return value ? 'Oui' : 'Non';
  if (Array.isArray(value)) return value.join(', ');
  if (typeof value === 'object') return JSON.stringify(value, null, 2);
  return String(value);
};

const humanizeKey = (key: string): string =>
  FIELD_LABELS[key] ||
  key
    .replace(/_/g, ' ')
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (s) => s.toUpperCase())
    .trim();

const getScoreColor = (score: number) => {
  if (score >= 80) return 'text-green-600 bg-green-50 dark:bg-green-900/20';
  if (score >= 60) return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20';
  if (score >= 40) return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20';
  return 'text-red-600 bg-red-50 dark:bg-red-900/20';
};

const getScoreBadge = (score: number) => {
  if (score >= 80) return { label: 'Devis envoyé', variant: 'default' as const };
  if (score >= 60) return { label: 'Qualifié ✓', variant: 'secondary' as const };
  if (score >= 40) return { label: 'Tiède', variant: 'outline' as const };
  return { label: 'Froid', variant: 'destructive' as const };
};

export const CRMDashboard = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [agents, setAgents] = useState<SalesAgent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [filterScore, setFilterScore] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterAgent, setFilterAgent] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'score' | 'date'>('score');

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const [quotesResult, callbacksResult, agentsResult] = await Promise.all([
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
        supabase
          .from('sales_agents')
          .select('id, full_name, email, user_id')
          .eq('is_active', true),
      ]);

      const agentsList = (agentsResult.data || []) as SalesAgent[];
      setAgents(agentsList);

      const agentsMap = new Map<string, string>();
      agentsList.forEach((a) => {
        agentsMap.set(a.id, a.full_name);
        if (a.user_id) agentsMap.set(a.user_id, a.full_name);
      });

      const allLeads: Lead[] = [
        ...(quotesResult.data?.map((q: any) => ({
          ...q,
          type: 'quote' as const,
          agent_name: q.assigned_to ? agentsMap.get(q.assigned_to) || null : null,
        })) || []),
        ...(callbacksResult.data?.map((c: any) => ({
          ...c,
          type: 'callback' as const,
          agent_name: c.assigned_to ? agentsMap.get(c.assigned_to) || null : null,
        })) || []),
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
      // Update local state immediately for instant UI feedback
      setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: newStatus, last_contacted_at: new Date().toISOString() } : l));
      setSelectedLead(prev => prev && prev.id === leadId ? { ...prev, status: newStatus } : prev);
      // Also refetch to ensure consistency
      fetchLeads();
    }
  };

  const toggleSigned = async (leadId: string, type: string, value: boolean) => {
    const table = type === 'quote' ? 'insurance_quotes' : 'contact_callbacks';
    const { error } = await supabase
      .from(table)
      .update({ signed_before_hot: value } as any)
      .eq('id', leadId);

    if (error) {
      toast.error('Erreur lors de la mise à jour');
    } else {
      toast.success(value ? 'Marqué comme converti' : 'Marquage retiré');
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
      if (filterAgent !== 'all' && lead.assigned_to !== filterAgent) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'score') return b.lead_score - a.lead_score;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  const stats = {
    total: leads.length,
    converted: leads.filter((l) => l.status === 'converted' || l.signed_before_hot).length,
    devisEnvoye: leads.filter((l) => l.lead_score >= 80).length,
    qualified: leads.filter((l) => l.lead_score >= 60 && l.lead_score < 80).length,
    pending: leads.filter((l) => l.status === 'pending').length,
    avgScore: Math.round(leads.reduce((acc, l) => acc + l.lead_score, 0) / leads.length || 0),
  };

  const statusGroups = {
    pending: filteredLeads.filter((l) => l.status === 'pending'),
    contacted: filteredLeads.filter((l) => l.status === 'contacted'),
    no_answer: filteredLeads.filter((l) => l.status === 'no_answer'),
    qualified: filteredLeads.filter((l) => l.status === 'qualified'),
    converted: filteredLeads.filter((l) => l.status === 'converted'),
    rejected: filteredLeads.filter((l) => l.status === 'rejected'),
  };

  const renderLeadDetail = (lead: Lead) => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold">{lead.full_name}</h3>
        <Badge {...getScoreBadge(lead.lead_score)}>
          {getScoreBadge(lead.lead_score).label} ({lead.lead_score}/100)
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{lead.email}</span>
        </div>
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{lead.phone}</span>
        </div>
      </div>

      {lead.insurance_type && (
        <div>
          <p className="text-sm text-muted-foreground mb-1">Type d'assurance</p>
          <Badge variant="secondary">{lead.insurance_type}</Badge>
        </div>
      )}

      <div>
        <p className="text-sm text-muted-foreground mb-1">Source</p>
        <Badge variant="outline">{lead.lead_source}</Badge>
      </div>

      {lead.agent_name && (
        <div>
          <p className="text-sm text-muted-foreground mb-1">Commercial assigné</p>
          <div className="p-3 bg-muted rounded-lg">
            <div className="font-medium">{lead.agent_name}</div>
          </div>
        </div>
      )}

      <div>
        <p className="text-sm text-muted-foreground mb-2">Changer le statut</p>
        <Select
          value={lead.status}
          onValueChange={(v) => updateLeadStatus(lead.id, lead.type, v)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">En attente</SelectItem>
            <SelectItem value="contacted">Contacté</SelectItem>
            <SelectItem value="no_answer">Ne répond pas</SelectItem>
            <SelectItem value="qualified">Qualifié</SelectItem>
            <SelectItem value="converted">Converti</SelectItem>
            <SelectItem value="rejected">Rejeté</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
        <Checkbox
          id="signed-check"
          checked={lead.signed_before_hot || false}
          onCheckedChange={(checked) => {
            toggleSigned(lead.id, lead.type, !!checked);
            setSelectedLead({ ...lead, signed_before_hot: !!checked });
          }}
        />
        <label htmlFor="signed-check" className="text-sm font-medium cursor-pointer">
          ✍️ Converti
        </label>
      </div>

      <div>
        <p className="text-sm text-muted-foreground mb-2">Notes internes</p>
        <Textarea
          placeholder="Ajouter des notes sur ce lead..."
          defaultValue={lead.notes || ''}
          rows={4}
          onChange={(e) => {
            setSelectedLead({ ...lead, notes: e.target.value });
          }}
        />
        <Button
          className="mt-2"
          onClick={() => updateLeadNotes(lead.id, lead.type, lead.notes || '')}
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          Sauvegarder les notes
        </Button>
      </div>

      {lead.type === 'callback' && (lead.message || lead.preferred_time) && (
        <div className="rounded-lg border bg-muted/30 p-4 space-y-2">
          <p className="text-sm font-semibold">Demande de rappel</p>
          {lead.preferred_time && (
            <div className="text-sm">
              <span className="text-muted-foreground">Créneau préféré : </span>
              {lead.preferred_time}
            </div>
          )}
          {lead.message && (
            <div className="text-sm whitespace-pre-wrap">
              <span className="text-muted-foreground">Message : </span>
              {lead.message}
            </div>
          )}
        </div>
      )}

      {lead.type === 'quote' && lead.quote_data && Object.keys(lead.quote_data).length > 0 && (
        <div className="rounded-lg border bg-muted/30 p-4">
          <p className="text-sm font-semibold mb-3">
            Informations du formulaire ({Object.keys(lead.quote_data).length} champs)
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 text-sm">
            {Object.entries(lead.quote_data).map(([key, value]) => {
              if (key === 'utm_data' || value === null || value === undefined || value === '') return null;
              const formatted = formatFieldValue(value);
              const isLong = formatted.length > 60 || formatted.includes('\n');
              return (
                <div
                  key={key}
                  className={`flex flex-col gap-0.5 ${isLong ? 'md:col-span-2' : ''}`}
                >
                  <span className="text-xs text-muted-foreground">{humanizeKey(key)}</span>
                  <span className="font-medium break-words whitespace-pre-wrap">{formatted}</span>
                </div>
              );
            })}
          </div>
          {lead.quote_data.utm_data && (
            <details className="mt-3">
              <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">
                Données de tracking (UTM)
              </summary>
              <pre className="mt-2 text-xs bg-background p-2 rounded overflow-x-auto">
                {JSON.stringify(lead.quote_data.utm_data, null, 2)}
              </pre>
            </details>
          )}
        </div>
      )}

      {lead.last_contacted_at && (
        <div className="text-sm text-muted-foreground">
          Dernier contact: {format(new Date(lead.last_contacted_at), 'dd/MM/yyyy à HH:mm', { locale: fr })}
        </div>
      )}
    </div>
  );

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
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Leads</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
            <Users className="h-8 w-8 text-primary" />
          </div>
        </Card>

        <Card className="p-4 border-emerald-200 dark:border-emerald-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Convertis ✍️</p>
              <p className="text-2xl font-bold text-emerald-600">{stats.converted}</p>
            </div>
            <CheckCircle2 className="h-8 w-8 text-emerald-600" />
          </div>
        </Card>

        <Card className="p-4 border-red-200 dark:border-red-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Devis envoyés 🔥</p>
              <p className="text-2xl font-bold text-red-600">{stats.devisEnvoye}</p>
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

      {/* Filters + Add Lead */}
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
              <SelectItem value="80">Devis envoyés (80+)</SelectItem>
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
              <SelectItem value="no_answer">Ne répond pas</SelectItem>
              <SelectItem value="qualified">Qualifié</SelectItem>
              <SelectItem value="converted">Converti</SelectItem>
              <SelectItem value="rejected">Rejeté</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterAgent} onValueChange={setFilterAgent}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Commercial" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les commerciaux</SelectItem>
              {agents.map((agent) => (
                <SelectItem key={agent.id} value={agent.id}>
                  {agent.full_name}
                </SelectItem>
              ))}
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

          <div className="ml-auto">
            <ManualLeadForm onLeadCreated={fetchLeads} />
          </div>
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
                  {status === 'no_answer' && '🚫 Ne répond pas'}
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
                            {lead.agent_name && (
                              <p className="text-xs text-muted-foreground">
                                👤 {lead.agent_name}
                              </p>
                            )}
                            {lead.signed_before_hot && (
                              <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">
                                ✍️ Converti
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
                        {selectedLead && renderLeadDetail(selectedLead)}
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
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <Badge className={`${getScoreColor(lead.lead_score)} font-bold shrink-0`}>
                    {lead.lead_score}
                  </Badge>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold">{lead.full_name}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
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
                    <Badge variant="secondary" className="shrink-0">{lead.insurance_type}</Badge>
                  )}
                  <Badge variant="outline" className="shrink-0 bg-primary/5">
                    👤 Nom : {lead.agent_name || 'Non attribué'}
                  </Badge>
                  {lead.signed_before_hot && (
                    <Badge variant="outline" className="shrink-0 bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">
                      ✍️ Converti
                    </Badge>
                  )}
                  <Badge {...getScoreBadge(lead.lead_score)} className="shrink-0">
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
                    <DialogHeader>
                      <DialogTitle>Détails du Lead</DialogTitle>
                    </DialogHeader>
                    {selectedLead && renderLeadDetail(selectedLead)}
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
