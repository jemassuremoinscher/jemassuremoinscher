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
import { Mail, MailOpen, MousePointerClick, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

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
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Mail className="h-5 w-5 text-primary" />
          Suivi des emails ({emails.length})
        </h3>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
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
