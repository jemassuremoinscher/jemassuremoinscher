import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { FileText, Mail, Phone, MapPin, Calendar, CheckCircle, XCircle, Download, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { exportToCSV, formatQuotesForExport } from '@/utils/exportCSV';

interface Quote {
  id: string;
  insurance_type: string;
  full_name: string;
  email: string;
  phone: string;
  quote_data: any;
  status: string;
  created_at: string;
}

interface QuotesTableProps {
  quotes: Quote[];
  onUpdate: () => void;
  highlightedId?: string | null;
}

export const QuotesTable = ({ quotes, onUpdate, highlightedId }: QuotesTableProps) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const filteredQuotes = filterStatus === 'all' 
    ? quotes 
    : quotes.filter(q => q.status === filterStatus);

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
        return <Badge variant="outline" className="bg-orange-50">En attente</Badge>;
      case 'contacted':
        return <Badge variant="outline" className="bg-blue-50">Contacté</Badge>;
      case 'converted':
        return <Badge variant="outline" className="bg-green-50">Converti</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50">Rejeté</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getInsuranceTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      auto: 'Auto',
      moto: 'Moto',
      habitation: 'Habitation',
      sante: 'Santé',
      pret: 'Prêt',
      animaux: 'Animaux',
    };
    return types[type] || type;
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
                Export CSV
              </Button>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filtrer par statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="contacted">Contacté</SelectItem>
                  <SelectItem value="converted">Converti</SelectItem>
                  <SelectItem value="rejected">Rejeté</SelectItem>
                </SelectContent>
              </Select>
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
              <TableHead>Statut</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredQuotes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
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
                  <TableCell>{getStatusBadge(quote.status)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {quote.status === 'pending' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuoteStatus(quote.id, 'contacted')}
                          title="Marquer comme contacté"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      )}
                      {quote.status !== 'rejected' && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => updateQuoteStatus(quote.id, 'rejected')}
                          title="Rejeter"
                        >
                          <XCircle className="h-4 w-4 text-red-500" />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteQuote(quote.id, quote.full_name)}
                        title="Supprimer définitivement"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};
