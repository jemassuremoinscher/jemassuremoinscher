import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2, RotateCcw, XCircle, FileText, Phone, Calendar, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format, differenceInDays } from 'date-fns';
import { fr } from 'date-fns/locale';

interface DeletedQuote {
  id: string;
  insurance_type: string;
  full_name: string;
  email: string;
  phone: string;
  deleted_at: string;
  created_at: string;
}

interface DeletedCallback {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  preferred_time: string;
  deleted_at: string;
  created_at: string;
}

export const TrashBin = () => {
  const [deletedQuotes, setDeletedQuotes] = useState<DeletedQuote[]>([]);
  const [deletedCallbacks, setDeletedCallbacks] = useState<DeletedCallback[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDeletedItems();
  }, []);

  const fetchDeletedItems = async () => {
    setLoading(true);
    
    const [quotesResult, callbacksResult] = await Promise.all([
      supabase
        .from('insurance_quotes')
        .select('*')
        .not('deleted_at', 'is', null)
        .order('deleted_at', { ascending: false }),
      supabase
        .from('contact_callbacks')
        .select('*')
        .not('deleted_at', 'is', null)
        .order('deleted_at', { ascending: false }),
    ]);

    if (quotesResult.data) setDeletedQuotes(quotesResult.data);
    if (callbacksResult.data) setDeletedCallbacks(callbacksResult.data);
    
    setLoading(false);
  };

  const restoreQuote = async (id: string, name: string) => {
    const { error } = await supabase
      .from('insurance_quotes')
      .update({ deleted_at: null })
      .eq('id', id);

    if (error) {
      toast.error('Erreur lors de la restauration');
    } else {
      toast.success(`Devis de ${name} restauré`);
      fetchDeletedItems();
    }
  };

  const restoreCallback = async (id: string, name: string) => {
    const { error } = await supabase
      .from('contact_callbacks')
      .update({ deleted_at: null })
      .eq('id', id);

    if (error) {
      toast.error('Erreur lors de la restauration');
    } else {
      toast.success(`Demande de ${name} restaurée`);
      fetchDeletedItems();
    }
  };

  const permanentlyDelete = async (type: 'quote' | 'callback', id: string, name: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer définitivement ${type === 'quote' ? 'le devis' : 'la demande'} de ${name} ? Cette action est IRRÉVERSIBLE.`)) {
      return;
    }

    const table = type === 'quote' ? 'insurance_quotes' : 'contact_callbacks';
    const { error } = await supabase
      .from(table)
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Erreur lors de la suppression définitive');
    } else {
      toast.success('Supprimé définitivement');
      fetchDeletedItems();
    }
  };

  const getDaysRemaining = (deletedAt: string) => {
    const deletedDate = new Date(deletedAt);
    const expiryDate = new Date(deletedDate);
    expiryDate.setDate(expiryDate.getDate() + 30);
    const daysLeft = differenceInDays(expiryDate, new Date());
    return Math.max(0, daysLeft);
  };

  const getDaysRemainingBadge = (deletedAt: string) => {
    const days = getDaysRemaining(deletedAt);
    if (days <= 3) {
      return <Badge variant="destructive">{days} jour{days > 1 ? 's' : ''} restant{days > 1 ? 's' : ''}</Badge>;
    } else if (days <= 7) {
      return <Badge variant="outline" className="bg-orange-50">{days} jours restants</Badge>;
    }
    return <Badge variant="outline" className="bg-green-50">{days} jours restants</Badge>;
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Trash2 className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">Corbeille</h2>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <AlertCircle className="h-4 w-4" />
          <p>Les éléments sont automatiquement supprimés définitivement après 30 jours</p>
        </div>
      </div>

      <Tabs defaultValue="quotes" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="quotes">
            <FileText className="h-4 w-4 mr-2" />
            Devis ({deletedQuotes.length})
          </TabsTrigger>
          <TabsTrigger value="callbacks">
            <Phone className="h-4 w-4 mr-2" />
            Rappels ({deletedCallbacks.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="quotes">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Supprimé le</TableHead>
                  <TableHead>Expiration</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {deletedQuotes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      Aucun devis dans la corbeille
                    </TableCell>
                  </TableRow>
                ) : (
                  deletedQuotes.map((quote) => (
                    <TableRow key={quote.id}>
                      <TableCell className="font-medium">{quote.insurance_type}</TableCell>
                      <TableCell>{quote.full_name}</TableCell>
                      <TableCell className="text-sm">
                        <div>{quote.email}</div>
                        <div className="text-muted-foreground">{quote.phone}</div>
                      </TableCell>
                      <TableCell className="text-sm">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {format(new Date(quote.deleted_at), 'dd MMM yyyy', { locale: fr })}
                        </div>
                      </TableCell>
                      <TableCell>{getDaysRemainingBadge(quote.deleted_at)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => restoreQuote(quote.id, quote.full_name)}
                            title="Restaurer"
                          >
                            <RotateCcw className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => permanentlyDelete('quote', quote.id, quote.full_name)}
                            title="Supprimer définitivement"
                          >
                            <XCircle className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="callbacks">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Créneau</TableHead>
                  <TableHead>Supprimé le</TableHead>
                  <TableHead>Expiration</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {deletedCallbacks.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      Aucune demande de rappel dans la corbeille
                    </TableCell>
                  </TableRow>
                ) : (
                  deletedCallbacks.map((callback) => (
                    <TableRow key={callback.id}>
                      <TableCell className="font-medium">{callback.full_name}</TableCell>
                      <TableCell className="text-sm">
                        <div>{callback.email}</div>
                        <div className="text-muted-foreground">{callback.phone}</div>
                      </TableCell>
                      <TableCell className="text-sm">{callback.preferred_time}</TableCell>
                      <TableCell className="text-sm">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {format(new Date(callback.deleted_at), 'dd MMM yyyy', { locale: fr })}
                        </div>
                      </TableCell>
                      <TableCell>{getDaysRemainingBadge(callback.deleted_at)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => restoreCallback(callback.id, callback.full_name)}
                            title="Restaurer"
                          >
                            <RotateCcw className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => permanentlyDelete('callback', callback.id, callback.full_name)}
                            title="Supprimer définitivement"
                          >
                            <XCircle className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};
