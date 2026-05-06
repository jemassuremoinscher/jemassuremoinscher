import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, FileSpreadsheet, TrendingUp, Percent } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const OWNER_EMAIL = "contact@jemassuremoinscher.fr";

export const FinancePanel = () => {
  const { user } = useAuth();
  const isOwner = (user?.email || "").toLowerCase() === OWNER_EMAIL.toLowerCase();

  if (!isOwner) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-primary" />
            Finance — Accès restreint
          </CardTitle>
          <CardDescription>
            Cette section est réservée au propriétaire du compte.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Si vous pensez devoir y accéder, contactez l'administrateur.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Finance
        </CardTitle>
        <CardDescription>Pilotage économique : grilles, marges et commissions.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="grilles" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="grilles" className="gap-1.5">
              <FileSpreadsheet className="h-4 w-4" /> Grilles tarifaires
            </TabsTrigger>
            <TabsTrigger value="marges" className="gap-1.5">
              <TrendingUp className="h-4 w-4" /> Marges
            </TabsTrigger>
            <TabsTrigger value="commissions" className="gap-1.5">
              <Percent className="h-4 w-4" /> Commissions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="grilles" className="mt-4">
            <div className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
              <FileSpreadsheet className="h-8 w-8 mx-auto mb-2 text-primary/60" />
              <p className="font-semibold mb-1">Grilles tarifaires par assureur</p>
              <p>Importez vos grilles (Auto, Moto, Habitation…) — à venir.</p>
            </div>
          </TabsContent>

          <TabsContent value="marges" className="mt-4">
            <div className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
              <TrendingUp className="h-8 w-8 mx-auto mb-2 text-primary/60" />
              <p className="font-semibold mb-1">Marges par produit</p>
              <p>Suivi de la marge brute / nette par type d'assurance — à venir.</p>
            </div>
          </TabsContent>

          <TabsContent value="commissions" className="mt-4">
            <div className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
              <Percent className="h-8 w-8 mx-auto mb-2 text-primary/60" />
              <p className="font-semibold mb-1">Commissions commerciaux</p>
              <p>Barèmes, calculs et historique de versement — à venir.</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
