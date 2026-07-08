import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarPicker } from '@/components/ui/calendar';
import { FileText, Mail, Phone, MapPin, Calendar, CheckCircle, XCircle, Download, Trash2, UserCheck, Eye, CalendarIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { exportToCSV, formatQuotesForExport } from '@/utils/exportCSV';
import { INSURANCE_TYPE_LABELS, normalizeInsuranceType, CANONICAL_INSURANCE_TYPES } from '@/utils/insuranceTypeNormalizer';

const FIELD_LABELS: Record<string, string> = {
  postalCode: 'Code postal', city: 'Ville', address: 'Adresse',
  birthDate: 'Date de naissance', age: 'Âge', profession: 'Profession',
  maritalStatus: 'Situation familiale', currentInsurer: 'Assureur actuel',
  contractEndDate: 'Échéance du contrat', desiredStartDate: 'Date de début souhaitée',
  monthlyBudget: 'Budget mensuel',
  vehicleBrand: 'Marque', vehicleModel: 'Modèle', vehicleYear: 'Année',
  vehicleVersion: 'Version', fuelType: 'Carburant', registrationDate: 'Mise en circulation',
  licensePlate: 'Immatriculation', vehicleUsage: 'Usage du véhicule', annualKm: 'Km/an',
  parkingType: 'Stationnement', licenseDate: "Date d'obtention du permis",
  bonusMalus: 'Bonus-Malus', claimsLast3Years: 'Sinistres (3 ans)', coverageType: 'Formule',
  housingType: 'Type de logement', surface: 'Surface (m²)', rooms: 'Nombre de pièces',
  occupancyType: 'Statut occupant', constructionYear: 'Année de construction',
  beneficiaries: 'Bénéficiaires', smokingStatus: 'Fumeur', coverageLevel: 'Niveau de couverture',
  companyName: 'Entreprise', legalStatus: 'Statut juridique', siret: 'SIRET',
  turnover: "Chiffre d'affaires", activity: 'Activité', employees: 'Effectif',
  source: 'Source',
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
  key.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase()).trim();

interface Quote {
  id: string;
  insurance_type: string;
  full_name: string;
  email: string;
  phone: string;
  quote_data: any;
  status: string;
  created_at: string;
  assigned_to?: string | null;
}

interface QuotesTableProps {
  quotes: Quote[];
  onUpdate: () => void;
  highlightedId?: string | null;
}

export const QuotesTable = ({ quotes, onUpdate, highlightedId }: QuotesTableProps) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [dateFrom, setDateFrom] = useState<Date | undefined>();
  const [dateTo, setDateTo] = useState<Date | undefined>();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);

  const { data: agents } = useQuery({
    queryKey: ['sales-agents-list'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sales_agents')
        .select('id, full_name, user_id, is_active')
        .eq('is_active', true)
        .order('full_name');
      if (error) throw error;
      return data;
    },
  });

  const assignQuote = async (quoteId: string, agentId: string | null) => {
    const agent = agents?.find(a => a.id === agentId);

    const { error } = await supabase
      .from('insurance_quotes')
      .update({ assigned_to: agentId })
      .eq('id', quoteId);

    if (error) {
      toast.error("Erreur lors de l'attribution");
    } else {
      const agentName = agent?.full_name || 'Non attribué';
      toast.success(`Lead attribué à ${agentName}`);
      setSelectedQuote(prev => prev && prev.id === quoteId ? { ...prev, assigned_to: agentId } : prev);
      onUpdate();
    }
  };

  const filteredQuotes = quotes.filter((q) => {
    if (filterStatus !== 'all' && q.status !== filterStatus) return false;
    if (filterType !== 'all' && normalizeInsuranceType(q.insurance_type) !== filterType) return false;
    if (dateFrom) {
      const d = new Date(q.created_at);
      const from = new Date(dateFrom); from.setHours(0, 0, 0, 0);
      if (d < from) return false;
    }
    if (dateTo) {
      const d = new Date(q.created_at);
      const to = new Date(dateTo); to.setHours(23, 59, 59, 999);
      if (d > to) return false;
    }
    return true;
  });

  const updateQuoteStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase
      .from('insurance_quotes')
      .update({ status: newStatus })
      .eq('id', id);

    if (error) {
      toast.error('Erreur lors de la mise à jour');
    } else {
      toast.success('Statut mis à jour');
      onUpdate();
    }
  };

  const deleteQuote = async (id: string, clientName: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir déplacer le devis de ${clientName} dans la corbeille ?`)) {
      return;
    }

    const { error } = await supabase
      .from('insurance_quotes')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      toast.error('Erreur lors de la suppression');
      console.error('Delete error:', error);
    } else {
      toast.success('Devis déplacé dans la corbeille (disponible 30 jours)');
      onUpdate();
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-orange-50">⏳ En attente</Badge>;
      case 'contacted':
        return <Badge variant="outline" className="bg-blue-50">📞 Contacté</Badge>;
      case 'no_answer':
        return <Badge variant="outline" className="bg-yellow-50">🚫 Ne répond pas</Badge>;
      case 'pending_documents':
          return <Badge variant="outline" className="bg-purple-50">📄 En attente de documents</Badge>;
      case 'qualified':
        return <Badge variant="outline" className="bg-emerald-50">✅ Qualifié</Badge>;
      case 'converted':
        return <Badge variant="outline" className="bg-green-50">🎉 Converti</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50">❌ Rejeté</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getInsuranceTypeLabel = (type: string) => {
    const normalized = normalizeInsuranceType(type);
    return (INSURANCE_TYPE_LABELS as Record<string, string>)[normalized] || type;
  };

  const handleExport = () => {
    const formattedData = formatQuotesForExport(filteredQuotes);
    exportToCSV(formattedData, 'devis-assurance');
    toast.success(`${filteredQuotes.length} devis exportés`);
  };

  const handleExportSelected = () => {
    const selectedQuotes = filteredQuotes.filter(q => selectedIds.includes(q.id));
    const formattedData = formatQuotesForExport(selectedQuotes);
    exportToCSV(formattedData, 'devis-assurance-selection');
    toast.success(`${selectedQuotes.length} devis exportés`);
  };

  const handleDeleteSelected = async () => {
    if (!confirm(`Êtes-vous sûr de vouloir déplacer ${selectedIds.length} devis dans la corbeille ?`)) {
      return;
    }

    const { error } = await supabase
      .from('insurance_quotes')
      .update({ deleted_at: new Date().toISOString() })
      .in('id', selectedIds);

    if (error) {
      toast.error('Erreur lors de la suppression');
      console.error('Delete error:', error);
    } else {
      toast.success(`${selectedIds.length} devis déplacés dans la corbeille`);
      setSelectedIds([]);
      onUpdate();
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredQuotes.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredQuotes.map(q => q.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            Demandes de devis
          </h2>
          <p className="text-muted-foreground mt-1">
            {filteredQuotes.length} demande{filteredQuotes.length > 1 ? 's' : ''}
          </p>
        </div>
        
        <div className="flex gap-2">
          {selectedIds.length > 0 ? (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportSelected}
              >
                <Download className="h-4 w-4 mr-2" />
                Exporter sélection ({selectedIds.length})
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDeleteSelected}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Supprimer sélection ({selectedIds.length})
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedIds([])}
              >
                Désélectionner
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
                disabled={filteredQuotes.length === 0}
              >
                <Download className="h-4 w-4 mr-2" />
                Export CSV ({filteredQuotes.length})
              </Button>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-44">
                  <SelectValue placeholder="Type d'assurance" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  {CANONICAL_INSURANCE_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {(INSURANCE_TYPE_LABELS as Record<string, string>)[type]?.replace(/^Assurance\s+/, '') || type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="w-32 justify-start font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateFrom ? format(dateFrom, 'dd/MM/yy', { locale: fr }) : 'Du'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarPicker mode="single" selected={dateFrom} onSelect={setDateFrom} initialFocus locale={fr} />
                </PopoverContent>
              </Popover>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="w-32 justify-start font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateTo ? format(dateTo, 'dd/MM/yy', { locale: fr }) : 'Au'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarPicker mode="single" selected={dateTo} onSelect={setDateTo} initialFocus locale={fr} />
                </PopoverContent>
              </Popover>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="pending">⏳ En attente</SelectItem>
                  <SelectItem value="contacted">📞 Contacté</SelectItem>
                  <SelectItem value="no_answer">🚫 Ne répond pas</SelectItem>
                  <SelectItem value="pending_documents">📄 En attente de documents</SelectItem>
            <SelectItem value="qualified">✅ Qualifié</SelectItem>
                  <SelectItem value="converted">🎉 Converti</SelectItem>
                  <SelectItem value="rejected">❌ Rejeté</SelectItem>
                </SelectContent>
              </Select>
              {(filterType !== 'all' || filterStatus !== 'all' || dateFrom || dateTo) && (
                <Button variant="ghost" size="sm" onClick={() => { setFilterType('all'); setFilterStatus('all'); setDateFrom(undefined); setDateTo(undefined); }}>
                  Réinitialiser
                </Button>
              )}
            </>
          )}
        </div>
      </div>




      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedIds.length === filteredQuotes.length && filteredQuotes.length > 0}
                  onCheckedChange={toggleSelectAll}
                />
              </TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Détails</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Attribué à</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredQuotes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                  Aucune demande de devis trouvée
                </TableCell>
              </TableRow>
            ) : (
              filteredQuotes.map((quote) => (
                <TableRow 
                  key={quote.id} 
                  id={`row-${quote.id}`}
                  className={`transition-colors ${highlightedId === quote.id ? 'bg-yellow-100 dark:bg-yellow-900/20' : ''}`}
                >
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.includes(quote.id)}
                      onCheckedChange={() => toggleSelect(quote.id)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    {getInsuranceTypeLabel(quote.insurance_type)}
                  </TableCell>
                  <TableCell>{quote.full_name}</TableCell>
                  <TableCell>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        <a href={`mailto:${quote.email}`} className="hover:underline">
                          {quote.email}
                        </a>
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        <a href={`tel:${quote.phone}`} className="hover:underline">
                          {quote.phone}
                        </a>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">
                    {quote.quote_data?.postalCode && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {quote.quote_data.postalCode}
                      </div>
                    )}
                    {quote.quote_data?.currentInsurer && (
                      <div className="text-muted-foreground">
                        Assureur: {quote.quote_data.currentInsurer}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(quote.created_at), 'dd MMM yyyy', { locale: fr })}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={agents?.find(a => a.id === quote.assigned_to)?.id || 'unassigned'}
                      onValueChange={(value) => assignQuote(quote.id, value === 'unassigned' ? null : value)}
                    >
                      <SelectTrigger className="w-[140px] h-8 text-xs">
                        <SelectValue placeholder="Non attribué" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unassigned">— Non attribué</SelectItem>
                        {agents?.map((agent) => (
                          <SelectItem key={agent.id} value={agent.id}>
                            {agent.full_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>{getStatusBadge(quote.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Select
                        value={quote.status}
                        onValueChange={(value) => updateQuoteStatus(quote.id, value)}
                      >
                        <SelectTrigger className="w-[140px] h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">⏳ En attente</SelectItem>
                          <SelectItem value="contacted">📞 Contacté</SelectItem>
                          <SelectItem value="no_answer">🚫 Ne répond pas</SelectItem>
                          <SelectItem value="pending_documents">📄 En attente de documents</SelectItem>
                          <SelectItem value="qualified">✅ Qualifié</SelectItem>
                          <SelectItem value="converted">🎉 Converti</SelectItem>
                          <SelectItem value="rejected">❌ Rejeté</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setSelectedQuote(quote)}
                        title="Voir les détails"
                        className="h-8 w-8 p-0"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteQuote(quote.id, quote.full_name)}
                        title="Supprimer"
                        className="h-8 w-8 p-0"
                      >
                        <Trash2 className="h-3.5 w-3.5 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!selectedQuote} onOpenChange={(open) => !open && setSelectedQuote(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedQuote?.full_name} — {selectedQuote && getInsuranceTypeLabel(selectedQuote.insurance_type)}
            </DialogTitle>
          </DialogHeader>
          {selectedQuote && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <a href={`mailto:${selectedQuote.email}`} className="hover:underline">{selectedQuote.email}</a>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <a href={`tel:${selectedQuote.phone}`} className="hover:underline">{selectedQuote.phone}</a>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  {format(new Date(selectedQuote.created_at), 'dd MMM yyyy à HH:mm', { locale: fr })}
                </div>
                <div>{getStatusBadge(selectedQuote.status)}</div>
              </div>

              <div className="rounded-lg border bg-muted/30 p-4 flex items-center gap-3">
                <UserCheck className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="text-sm font-medium shrink-0">Attribuer à :</span>
                <Select
                  value={agents?.find(a => a.id === selectedQuote.assigned_to)?.id || 'unassigned'}
                  onValueChange={(value) => assignQuote(selectedQuote.id, value === 'unassigned' ? null : value)}
                >
                  <SelectTrigger className="w-full max-w-xs">
                    <SelectValue placeholder="Non attribué" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unassigned">— Non attribué</SelectItem>
                    {agents?.map((agent) => (
                      <SelectItem key={agent.id} value={agent.id}>{agent.full_name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedQuote.quote_data && Object.keys(selectedQuote.quote_data).length > 0 ? (
                <div className="rounded-lg border bg-muted/30 p-4">
                  <p className="text-sm font-semibold mb-3">
                    Informations du formulaire ({Object.keys(selectedQuote.quote_data).filter(k => k !== 'utm_data').length} champs)
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3 text-sm">
                    {Object.entries(selectedQuote.quote_data).map(([key, value]) => {
                      if (key === 'utm_data' || value === null || value === undefined || value === '') return null;
                      const formatted = formatFieldValue(value);
                      const isLong = formatted.length > 60 || formatted.includes('\n');
                      return (
                        <div key={key} className={`flex flex-col gap-0.5 ${isLong ? 'md:col-span-2' : ''}`}>
                          <span className="text-xs text-muted-foreground">{humanizeKey(key)}</span>
                          <span className="font-medium break-words whitespace-pre-wrap">{formatted}</span>
                        </div>
                      );
                    })}
                  </div>
                  {selectedQuote.quote_data.utm_data && (
                    <details className="mt-3">
                      <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">
                        Données de tracking (UTM)
                      </summary>
                      <pre className="mt-2 text-xs bg-background p-2 rounded overflow-x-auto">
                        {JSON.stringify(selectedQuote.quote_data.utm_data, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic">Aucune information additionnelle.</p>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
};
