import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

interface Campaign {
  id: string;
  campaign_id: string;
  campaign_name: string;
  status: string;
  total_spend: number;
  total_clicks: number;
  total_conversions: number;
  conversion_value: number;
}

interface CampaignMetric {
  campaign_id: string;
  campaign_name: string;
  total_spend: number;
  total_conversions: number;
  conversion_value: number;
  cost_per_lead: number;
  roi_percentage: number;
  conversion_rate: number;
}

interface GoogleAdsCampaignsTableProps {
  campaigns: Campaign[];
  metrics: CampaignMetric[];
}

export const GoogleAdsCampaignsTable = ({ campaigns, metrics }: GoogleAdsCampaignsTableProps) => {
  const getMetricsForCampaign = (campaignId: string) => {
    return metrics.find(m => m.campaign_id === campaignId);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "outline"> = {
      active: "default",
      paused: "secondary",
      ended: "outline",
    };
    return <Badge variant={variants[status] || "outline"}>{status}</Badge>;
  };

  const getRoiBadge = (roi: number) => {
    if (roi > 100) return <Badge className="bg-green-600">Excellent</Badge>;
    if (roi > 0) return <Badge className="bg-blue-600">Positif</Badge>;
    return <Badge variant="destructive">Négatif</Badge>;
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Détails des Campagnes</h3>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Campagne</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Dépenses</TableHead>
              <TableHead className="text-right">Clics</TableHead>
              <TableHead className="text-right">Conversions</TableHead>
              <TableHead className="text-right">Valeur</TableHead>
              <TableHead className="text-right">CPL</TableHead>
              <TableHead className="text-right">Taux Conv.</TableHead>
              <TableHead className="text-right">ROI</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {campaigns.map((campaign) => {
              const metric = getMetricsForCampaign(campaign.campaign_id);
              return (
                <TableRow key={campaign.id}>
                  <TableCell className="font-medium">
                    {campaign.campaign_name}
                  </TableCell>
                  <TableCell>{getStatusBadge(campaign.status)}</TableCell>
                  <TableCell className="text-right">
                    {campaign.total_spend.toFixed(2)}€
                  </TableCell>
                  <TableCell className="text-right">
                    {campaign.total_clicks}
                  </TableCell>
                  <TableCell className="text-right">
                    {campaign.total_conversions}
                  </TableCell>
                  <TableCell className="text-right">
                    {campaign.conversion_value.toFixed(2)}€
                  </TableCell>
                  <TableCell className="text-right">
                    {metric?.cost_per_lead ? `${Number(metric.cost_per_lead).toFixed(2)}€` : '-'}
                  </TableCell>
                  <TableCell className="text-right">
                    {metric?.conversion_rate ? `${Number(metric.conversion_rate).toFixed(2)}%` : '-'}
                  </TableCell>
                  <TableCell className="text-right">
                    {metric && getRoiBadge(Number(metric.roi_percentage))}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};
