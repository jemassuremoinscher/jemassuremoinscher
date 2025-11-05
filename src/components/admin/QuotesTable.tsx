import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileText, Mail, Phone, MapPin, Calendar, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

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
}

export const QuotesTable = ({ quotes, onUpdate }: QuotesTableProps) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');

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
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
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
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  Aucune demande de devis trouvée
                </TableCell>
              </TableRow>
            ) : (
              filteredQuotes.map((quote) => (
                <TableRow key={quote.id}>
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
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      )}
                      {quote.status !== 'rejected' && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => updateQuoteStatus(quote.id, 'rejected')}
                        >
                          <XCircle className="h-4 w-4 text-red-500" />
                        </Button>
                      )}
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
