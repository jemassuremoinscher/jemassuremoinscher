import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export const RedistributionButton = () => {
  const [isReassigning, setIsReassigning] = useState(false);

  const handleReassign = async () => {
    setIsReassigning(true);
    
    try {
      // Appeler la fonction de réassignation
      const { data, error } = await supabase.rpc('reassign_pending_leads');
      
      if (error) throw error;
      
      const count = data || 0;
      
      if (count > 0) {
        toast.success(`✓ ${count} lead(s) réassigné(s) avec succès`, {
          description: 'Les leads en attente ont été distribués aux commerciaux disponibles',
        });
      } else {
        toast.info('Aucun lead en attente à réassigner', {
          description: 'Tous les leads sont déjà assignés',
        });
      }
    } catch (error: any) {
      console.error('Erreur réassignation:', error);
      toast.error('Erreur lors de la réassignation', {
        description: error.message,
      });
    } finally {
      setIsReassigning(false);
    }
  };

  return (
    <Button 
      onClick={handleReassign}
      disabled={isReassigning}
      variant="outline"
      className="gap-2"
    >
      <RefreshCw className={`h-4 w-4 ${isReassigning ? 'animate-spin' : ''}`} />
      {isReassigning ? 'Réassignation...' : 'Réassigner Leads en Attente'}
    </Button>
  );
};
