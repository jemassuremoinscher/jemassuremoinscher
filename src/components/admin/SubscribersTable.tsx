import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Download, RefreshCw, Mail } from "lucide-react";
import { toast } from "sonner";
import { exportToCSV } from "@/utils/exportCSV";

interface Subscriber {
  id: string;
  email: string;
  status: string;
  source: string;
  subscribed_at: string | null;
  confirmed_at: string | null;
  unsubscribed_at: string | null;
  created_at: string;
}

const SOURCE_LABELS: Record<string, { label: string; color: string }> = {
  newsletter: { label: "Newsletter", color: "bg-blue-500/10 text-blue-700 dark:text-blue-300" },
  lead_magnet_guide: { label: "Guide 7 erreurs", color: "bg-purple-500/10 text-purple-700 dark:text-purple-300" },
  homepage_lead_magnet: { label: "Guide (home)", color: "bg-purple-500/10 text-purple-700 dark:text-purple-300" },
  lead_magnet_7_erreurs: { label: "Guide 7 erreurs", color: "bg-purple-500/10 text-purple-700 dark:text-purple-300" },
};

function sourceMeta(src: string) {
  return (
    SOURCE_LABELS[src] || {
      label: src || "—",
      color: "bg-muted text-muted-foreground",
    }
  );
}

const STATUS_LABEL: Record<string, string> = {
  pending: "En attente",
  confirmed: "Confirmé",
  unsubscribed: "Désinscrit",
};

export function SubscribersTable() {
  const [rows, setRows] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const fetchRows = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("newsletter_subscribers" as any)
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      toast.error("Erreur chargement abonnés");
      console.error(error);
    } else {
      setRows((data as any) || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRows();
    const channel = supabase
      .channel("newsletter_subscribers_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "newsletter_subscribers" },
        () => fetchRows(),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const sources = useMemo(() => {
    const set = new Set<string>();
    rows.forEach((r) => set.add(r.source || "newsletter"));
    return Array.from(set);
  }, [rows]);

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (sourceFilter !== "all" && (r.source || "newsletter") !== sourceFilter)
        return false;
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!r.email.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [rows, sourceFilter, statusFilter, search]);

  const counts = useMemo(() => {
    const c = { total: rows.length, newsletter: 0, guide: 0, confirmed: 0, pending: 0 };
    rows.forEach((r) => {
      const src = r.source || "newsletter";
      if (src === "newsletter") c.newsletter++;
      else c.guide++;
      if (r.status === "confirmed") c.confirmed++;
      if (r.status === "pending") c.pending++;
    });
    return c;
  }, [rows]);

  const handleExport = () => {
    if (filtered.length === 0) {
      toast.warning("Aucune donnée à exporter");
      return;
    }
    const data = filtered.map((r) => ({
      Email: r.email,
      Source: sourceMeta(r.source || "newsletter").label,
      Statut: STATUS_LABEL[r.status] || r.status,
      "Date inscription": r.created_at
        ? new Date(r.created_at).toLocaleString("fr-FR")
        : "",
      "Date confirmation": r.confirmed_at
        ? new Date(r.confirmed_at).toLocaleString("fr-FR")
        : "",
      "Date désinscription": r.unsubscribed_at
        ? new Date(r.unsubscribed_at).toLocaleString("fr-FR")
        : "",
    }));
    exportToCSV(data, "abonnes-newsletter-guides");
    toast.success(`${filtered.length} lignes exportées`);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" />
            Abonnés newsletter & guides
          </h2>
          <p className="text-sm text-muted-foreground">
            {counts.total} au total · {counts.newsletter} newsletter · {counts.guide} guide(s) · {counts.confirmed} confirmés · {counts.pending} en attente
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchRows} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Actualiser
          </Button>
          <Button size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Input
          placeholder="Rechercher un email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select value={sourceFilter} onValueChange={setSourceFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Source" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes sources</SelectItem>
            {sources.map((s) => (
              <SelectItem key={s} value={s}>
                {sourceMeta(s).label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous statuts</SelectItem>
            <SelectItem value="pending">En attente</SelectItem>
            <SelectItem value="confirmed">Confirmé</SelectItem>
            <SelectItem value="unsubscribed">Désinscrit</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-lg border border-border bg-card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Inscrit le</TableHead>
              <TableHead>Confirmé le</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                  Chargement…
                </TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                  Aucun abonné trouvé.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((r) => {
                const meta = sourceMeta(r.source || "newsletter");
                return (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">
                      <a href={`mailto:${r.email}`} className="hover:underline">
                        {r.email}
                      </a>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={meta.color}>
                        {meta.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          r.status === "confirmed"
                            ? "default"
                            : r.status === "unsubscribed"
                              ? "destructive"
                              : "secondary"
                        }
                      >
                        {STATUS_LABEL[r.status] || r.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(r.created_at).toLocaleDateString("fr-FR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {r.confirmed_at
                        ? new Date(r.confirmed_at).toLocaleDateString("fr-FR")
                        : "—"}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default SubscribersTable;
