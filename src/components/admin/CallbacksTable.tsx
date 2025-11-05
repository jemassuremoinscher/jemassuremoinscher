import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Phone, Mail, Clock, Calendar, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Callback {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  preferred_time: string;
  message: string | null;
  status: string;
  created_at: string;
}

interface CallbacksTableProps {
  callbacks: Callback[];
  onUpdate: () => void;
  highlightedId?: string | null;
}

export const CallbacksTable = ({ callbacks, onUpdate, highlightedId }: CallbacksTableProps) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredCallbacks = filterStatus === 'all' 
    ? callbacks 
    : callbacks.filter(c => c.status === filterStatus);

  const updateCallbackStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase
      .from('contact_callbacks')
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
      case 'called':
        return <Badge variant="outline" className="bg-blue-50">Appelé</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-50">Terminé</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-red-50">Annulé</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Phone className="h-6 w-6 text-primary" />
            Demandes de rappel
          </h2>
          <p className="text-muted-foreground mt-1">
            {filteredCallbacks.length} demande{filteredCallbacks.length > 1 ? 's' : ''}
          </p>
        </div>
        
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrer par statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="pending">En attente</SelectItem>
            <SelectItem value="called">Appelé</SelectItem>
            <SelectItem value="completed">Terminé</SelectItem>
            <SelectItem value="cancelled">Annulé</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Créneau préféré</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCallbacks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  Aucune demande de rappel trouvée
                </TableCell>
              </TableRow>
            ) : (
              filteredCallbacks.map((callback) => (
                <TableRow 
                  key={callback.id}
                  id={`row-${callback.id}`}
                  className={`transition-colors ${highlightedId === callback.id ? 'bg-yellow-100 dark:bg-yellow-900/20' : ''}`}
                >
                  <TableCell className="font-medium">{callback.full_name}</TableCell>
                  <TableCell>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        <a href={`mailto:${callback.email}`} className="hover:underline">
                          {callback.email}
                        </a>
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        <a href={`tel:${callback.phone}`} className="hover:underline">
                          {callback.phone}
                        </a>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <Clock className="h-3 w-3" />
                      {callback.preferred_time}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs truncate text-sm">
                    {callback.message || '-'}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(callback.created_at), 'dd MMM yyyy', { locale: fr })}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(callback.status)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {callback.status === 'pending' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateCallbackStatus(callback.id, 'called')}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      )}
                      {callback.status !== 'cancelled' && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => updateCallbackStatus(callback.id, 'cancelled')}
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
