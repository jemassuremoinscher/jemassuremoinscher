import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

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

interface ConversionData {
  date: string;
  quotes: number;
  callbacks: number;
  total: number;
}

interface GoogleAdsCampaignChartsProps {
  campaigns: CampaignMetric[];
  conversionsByDate: ConversionData[];
}

const COLORS = ['#8B5CF6', '#EC4899', '#06B6D4', '#10B981', '#F59E0B', '#EF4444'];

export const GoogleAdsCampaignCharts = ({ campaigns, conversionsByDate }: GoogleAdsCampaignChartsProps) => {
  // Préparer les données pour le graphique de dépenses vs conversions
  const spendVsConversions = campaigns.map(c => ({
    name: c.campaign_name.substring(0, 20),
    dépenses: Number(c.total_spend),
    conversions: Number(c.total_conversions),
    roi: Number(c.roi_percentage),
  }));

  // Préparer les données pour le pie chart des conversions par campagne
  const conversionsByCampaign = campaigns.map(c => ({
    name: c.campaign_name.substring(0, 20),
    value: Number(c.total_conversions),
  }));

  // Préparer les données pour le graphique ROI
  const roiData = campaigns.map(c => ({
    name: c.campaign_name.substring(0, 20),
    roi: Number(c.roi_percentage),
    cpl: Number(c.cost_per_lead),
  }));

  return (
    <div className="space-y-6">
      <Tabs defaultValue="spend" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="spend">Dépenses vs Conversions</TabsTrigger>
          <TabsTrigger value="roi">ROI par Campagne</TabsTrigger>
          <TabsTrigger value="distribution">Distribution</TabsTrigger>
          <TabsTrigger value="timeline">Chronologie</TabsTrigger>
        </TabsList>

        <TabsContent value="spend">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Dépenses vs Conversions par Campagne</h3>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={spendVsConversions}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="dépenses" fill="#8B5CF6" name="Dépenses (€)" />
                <Bar yAxisId="right" dataKey="conversions" fill="#10B981" name="Conversions" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>

        <TabsContent value="roi">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">ROI et Coût par Lead</h3>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={roiData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="roi" fill="#EC4899" name="ROI (%)" />
                <Bar yAxisId="right" dataKey="cpl" fill="#F59E0B" name="Coût/Lead (€)" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>

        <TabsContent value="distribution">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Distribution des Conversions</h3>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={conversionsByCampaign}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {conversionsByCampaign.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>

        <TabsContent value="timeline">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Conversions dans le Temps</h3>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={conversionsByDate}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="quotes" stroke="#8B5CF6" name="Devis" strokeWidth={2} />
                <Line type="monotone" dataKey="callbacks" stroke="#EC4899" name="Rappels" strokeWidth={2} />
                <Line type="monotone" dataKey="total" stroke="#10B981" name="Total" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
