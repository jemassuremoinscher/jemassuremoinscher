import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { UserPlus, TrendingUp, Users, Target } from "lucide-react";

const INSURANCE_TYPES = [
  { value: "auto", label: "Auto" },
  { value: "habitation", label: "Habitation" },
  { value: "sante", label: "Santé" },
  { value: "vie", label: "Vie" },
  { value: "pret", label: "Prêt" },
  { value: "prevoyance", label: "Prévoyance" },
  { value: "rc-pro", label: "RC Pro" },
  { value: "mrp", label: "MRP" },
  { value: "gli", label: "GLI" },
  { value: "pno", label: "PNO" },
  { value: "moto", label: "Moto" },
  { value: "animaux", label: "Animaux" },
];

export const SalesAgentsManager = () => {
  const [isAddingAgent, setIsAddingAgent] = useState(false);
  const [newAgent, setNewAgent] = useState({
    full_name: "",
    email: "",
    phone: "",
    max_daily_leads: 10,
    specializations: [] as string[],
  });

  const queryClient = useQueryClient();

  // Récupérer les commerciaux
  const { data: agents, isLoading } = useQuery({
    queryKey: ["sales-agents"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sales_agents")
        .select(`
          *,
          agent_performance (
            insurance_type,
            total_leads,
            converted_leads,
            conversion_rate
          )
        `)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  // Récupérer la charge actuelle de chaque agent
  const { data: agentLoads } = useQuery({
    queryKey: ["agent-loads"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("insurance_quotes")
        .select("assigned_to")
        .in("status", ["pending", "contacted", "qualified"])
        .gte("created_at", new Date().toISOString().split("T")[0]);
      
      if (error) throw error;
      
      // Compter les leads par agent
      const loads: Record<string, number> = {};
      data?.forEach((lead) => {
        if (lead.assigned_to) {
          loads[lead.assigned_to] = (loads[lead.assigned_to] || 0) + 1;
        }
      });
      
      return loads;
    },
  });

  // Créer un commercial
  const createAgentMutation = useMutation({
    mutationFn: async (agentData: typeof newAgent & { user_id: string }) => {
      const { data, error } = await supabase
        .from("sales_agents")
        .insert([agentData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales-agents"] });
      toast.success("Commercial ajouté avec succès");
      setIsAddingAgent(false);
      setNewAgent({
        full_name: "",
        email: "",
        phone: "",
        max_daily_leads: 10,
        specializations: [],
      });
    },
    onError: (error) => {
      toast.error("Erreur lors de l'ajout: " + error.message);
    },
  });

  // Mettre à jour le statut actif
  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase
        .from("sales_agents")
        .update({ is_active })
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales-agents"] });
      toast.success("Statut mis à jour");
    },
  });

  // Generate cryptographically secure password using Web Crypto API
  const generateSecurePassword = (): string => {
    const array = new Uint8Array(24);
    crypto.getRandomValues(array);
    // Convert to base64-like string with special chars for password requirements
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    return Array.from(array, byte => chars[byte % chars.length]).join('');
  };

  const handleAddAgent = async () => {
    // Generate a secure password - agent will need to use password reset to access their account
    const securePassword = generateSecurePassword();
    
    const { data: userData, error: authError } = await supabase.auth.signUp({
      email: newAgent.email,
      password: securePassword,
      options: {
        data: {
          full_name: newAgent.full_name,
        },
      },
    });

    if (authError) {
      toast.error("Erreur lors de la création du compte: " + authError.message);
      return;
    }

    if (userData.user) {
      createAgentMutation.mutate({
        ...newAgent,
        user_id: userData.user.id,
      });
      // Note: Agent should use password reset flow to set their own password
      toast.info("L'agent devra utiliser 'Mot de passe oublié' pour définir son mot de passe");
    }
  };

  const toggleSpecialization = (type: string) => {
    setNewAgent((prev) => ({
      ...prev,
      specializations: prev.specializations.includes(type)
        ? prev.specializations.filter((s) => s !== type)
        : [...prev.specializations, type],
    }));
  };

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Gestion des Commerciaux</h2>
          <p className="text-muted-foreground">
            Attribution automatique basée sur charge, spécialisations et performances
          </p>
        </div>
        <Dialog open={isAddingAgent} onOpenChange={setIsAddingAgent}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Ajouter un commercial
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Nouveau commercial</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Nom complet</Label>
                  <Input
                    id="full_name"
                    value={newAgent.full_name}
                    onChange={(e) => setNewAgent({ ...newAgent, full_name: e.target.value })}
                    placeholder="Jean Dupont"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newAgent.email}
                    onChange={(e) => setNewAgent({ ...newAgent, email: e.target.value })}
                    placeholder="jean.dupont@example.com"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input
                    id="phone"
                    value={newAgent.phone}
                    onChange={(e) => setNewAgent({ ...newAgent, phone: e.target.value })}
                    placeholder="+33 6 12 34 56 78"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max_leads">Max leads/jour</Label>
                  <Input
                    id="max_leads"
                    type="number"
                    value={newAgent.max_daily_leads}
                    onChange={(e) => setNewAgent({ ...newAgent, max_daily_leads: parseInt(e.target.value) })}
                    min={1}
                    max={50}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Spécialisations</Label>
                <div className="grid grid-cols-3 gap-2">
                  {INSURANCE_TYPES.map((type) => (
                    <Button
                      key={type.value}
                      variant={newAgent.specializations.includes(type.value) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleSpecialization(type.value)}
                    >
                      {type.label}
                    </Button>
                  ))}
                </div>
              </div>

              <Button onClick={handleAddAgent} className="w-full">
                Créer le commercial
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {agents?.map((agent) => {
          const currentLoad = agentLoads?.[agent.user_id] || 0;
          const loadPercentage = (currentLoad / agent.max_daily_leads) * 100;
          const totalConverted = agent.agent_performance?.reduce((sum, p) => sum + p.converted_leads, 0) || 0;
          const totalLeads = agent.agent_performance?.reduce((sum, p) => sum + p.total_leads, 0) || 0;
          const overallConversion = totalLeads > 0 ? (totalConverted / totalLeads * 100).toFixed(1) : "0";

          return (
            <Card key={agent.id} className={!agent.is_active ? "opacity-50" : ""}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{agent.full_name}</CardTitle>
                    <CardDescription>{agent.email}</CardDescription>
                  </div>
                  <Switch
                    checked={agent.is_active}
                    onCheckedChange={(checked) =>
                      toggleActiveMutation.mutate({ id: agent.id, is_active: checked })
                    }
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Charge du jour</span>
                    <span className="font-medium">
                      {currentLoad}/{agent.max_daily_leads}
                    </span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div
                      className="bg-primary rounded-full h-2 transition-all"
                      style={{ width: `${Math.min(loadPercentage, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <div className="text-2xl font-bold">{totalLeads}</div>
                    <div className="text-xs text-muted-foreground">Leads total</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{totalConverted}</div>
                    <div className="text-xs text-muted-foreground">Conversions</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{overallConversion}%</div>
                    <div className="text-xs text-muted-foreground">Taux</div>
                  </div>
                </div>

                {agent.specializations && agent.specializations.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Spécialisations</div>
                    <div className="flex flex-wrap gap-1">
                      {agent.specializations.map((spec) => (
                        <Badge key={spec} variant="secondary" className="text-xs">
                          {INSURANCE_TYPES.find((t) => t.value === spec)?.label || spec}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
