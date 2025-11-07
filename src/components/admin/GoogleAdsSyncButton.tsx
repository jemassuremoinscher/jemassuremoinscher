import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RefreshCw, Download } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const GoogleAdsSyncButton = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSync = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('sync-google-ads', {
        body: {},
      });

      if (error) throw error;

      toast.success(`✅ Synchronisation réussie`, {
        description: `${data.campaigns} campagnes synchronisées`,
      });

      // Rafraîchir la page pour voir les nouvelles données
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error('Sync error:', error);
      toast.error("❌ Erreur de synchronisation", {
        description: error instanceof Error ? error.message : "Vérifiez vos credentials Google Ads",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6 mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold mb-2">Synchronisation Google Ads</h3>
          <p className="text-sm text-muted-foreground">
            Importer les dernières données de campagnes depuis Google Ads
          </p>
        </div>
        <Button
          onClick={handleSync}
          disabled={isLoading}
          className="gap-2"
        >
          {isLoading ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              Synchronisation...
            </>
          ) : (
            <>
              <Download className="h-4 w-4" />
              Synchroniser maintenant
            </>
          )}
        </Button>
      </div>
    </Card>
  );
};
