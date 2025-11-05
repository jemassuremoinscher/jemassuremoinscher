import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Mail, MailOpen, MousePointerClick, Loader2, Download, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "sonner";
import { exportToCSV, formatEmailsForExport } from "@/utils/exportCSV";

interface EmailTracking {
  id: string;
  recipient_email: string;
  recipient_name: string;
  email_type: string;
  subject: string;
  status: string;
  sent_at: string;
  opened_at: string | null;
  clicked_at: string | null;
  open_count: number;
  click_count: number;
}

export const EmailTrackingTable = () => {
  const [emails, setEmails] = useState<EmailTracking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    fetchEmails();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('email-tracking-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'email_tracking'
        },
        () => {
          fetchEmails();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchEmails = async () => {
    try {
      const { data, error } = await supabase
        .from("email_tracking")
        .select("*")
        .order("sent_at", { ascending: false });

      if (error) throw error;
      setEmails(data || []);
    } catch (error) {
      console.error("Error fetching emails:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (email: EmailTracking) => {
    if (email.clicked_at) {
      return (
        <Badge className="bg-green-500 hover:bg-green-600">
          <MousePointerClick className="h-3 w-3 mr-1" />
          Cliqué ({email.click_count})
        </Badge>
      );
    }
    if (email.opened_at) {
      return (
        <Badge className="bg-blue-500 hover:bg-blue-600">
          <MailOpen className="h-3 w-3 mr-1" />
          Ouvert ({email.open_count})
        </Badge>
      );
    }
    return (
      <Badge variant="outline">
        <Mail className="h-3 w-3 mr-1" />
        Envoyé
      </Badge>
    );
  };

  const getEmailTypeBadge = (type: string) => {
    const types: Record<string, { label: string; className: string }> = {
      quote_confirmation: { label: "Confirmation client", className: "bg-primary" },
      quote_notification: { label: "Notification admin", className: "bg-secondary" },
    };

    const config = types[type] || { label: type, className: "bg-muted" };
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const handleExportSelected = () => {
    const selectedEmails = emails.filter(e => selectedIds.includes(e.id));
    const formattedData = formatEmailsForExport(selectedEmails);
    exportToCSV(formattedData, 'suivi-emails-selection');
    toast.success(`${selectedEmails.length} emails exportés`);
  };

  const handleDeleteSelected = async () => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer ${selectedIds.length} entrées de suivi d'emails ?`)) {
      return;
    }

    const { error } = await supabase
      .from('email_tracking')
      .delete()
      .in('id', selectedIds);

    if (error) {
      toast.error('Erreur lors de la suppression');
      console.error('Delete error:', error);
    } else {
      toast.success(`${selectedIds.length} entrées supprimées`);
      setSelectedIds([]);
      fetchEmails();
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === emails.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(emails.map(e => e.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  if (loading) {
    return (
      <Card className="p-8">
        <div className="flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Card>
    );
  }

  if (emails.length === 0) {
    return (
      <Card className="p-8">
        <div className="text-center text-muted-foreground">
          <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Aucun email envoyé pour le moment</p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" />
            Suivi des emails ({emails.length})
          </h3>
          {selectedIds.length > 0 && (
            <div className="flex gap-2">
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
            </div>
          )}
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedIds.length === emails.length && emails.length > 0}
                    onCheckedChange={toggleSelectAll}
                  />
                </TableHead>
                <TableHead>Date d'envoi</TableHead>
                <TableHead>Destinataire</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Sujet</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Dernière activité</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {emails.map((email) => (
                <TableRow key={email.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.includes(email.id)}
                      onCheckedChange={() => toggleSelect(email.id)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    {format(new Date(email.sent_at), "dd MMM yyyy HH:mm", { locale: fr })}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{email.recipient_name}</p>
                      <p className="text-sm text-muted-foreground">{email.recipient_email}</p>
                    </div>
                  </TableCell>
                  <TableCell>{getEmailTypeBadge(email.email_type)}</TableCell>
                  <TableCell className="max-w-xs truncate">{email.subject}</TableCell>
                  <TableCell>{getStatusBadge(email)}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {email.clicked_at
                      ? `Cliqué ${format(new Date(email.clicked_at), "dd/MM à HH:mm", { locale: fr })}`
                      : email.opened_at
                      ? `Ouvert ${format(new Date(email.opened_at), "dd/MM à HH:mm", { locale: fr })}`
                      : "Pas d'activité"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </Card>
  );
};
