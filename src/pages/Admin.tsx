import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, RefreshCw, Shield } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { StatsCards } from '@/components/admin/StatsCards';
import { QuotesTable } from '@/components/admin/QuotesTable';
import { CallbacksTable } from '@/components/admin/CallbacksTable';
import { ChartsSection } from '@/components/admin/ChartsSection';

const Admin = () => {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [quotes, setQuotes] = useState<any[]>([]);
  const [callbacks, setCallbacks] = useState<any[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    } else if (!loading && user && !isAdmin) {
      toast.error('Accès refusé. Vous devez être administrateur.');
      navigate('/');
    }
  }, [user, isAdmin, loading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchData();
      
      // Set up realtime subscriptions
      const quotesChannel = supabase
        .channel('insurance_quotes_changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'insurance_quotes' }, () => {
          fetchData();
        })
        .subscribe();

      const callbacksChannel = supabase
        .channel('contact_callbacks_changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'contact_callbacks' }, () => {
          fetchData();
        })
        .subscribe();

      return () => {
        supabase.removeChannel(quotesChannel);
        supabase.removeChannel(callbacksChannel);
      };
    }
  }, [isAdmin]);

  const fetchData = async () => {
    setIsRefreshing(true);
    
    const [quotesResult, callbacksResult] = await Promise.all([
      supabase
        .from('insurance_quotes')
        .select('*')
        .order('created_at', { ascending: false }),
      supabase
        .from('contact_callbacks')
        .select('*')
        .order('created_at', { ascending: false }),
    ]);

    if (quotesResult.data) setQuotes(quotesResult.data);
    if (callbacksResult.data) setCallbacks(callbacksResult.data);
    
    setIsRefreshing(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  if (loading || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const pendingQuotes = quotes.filter(q => q.status === 'pending').length;
  const pendingCallbacks = callbacks.filter(c => c.status === 'pending').length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Dashboard Admin</h1>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={fetchData}
                disabled={isRefreshing}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Actualiser
              </Button>
              <Button
                variant="ghost"
                onClick={() => navigate('/')}
              >
                Voir le site
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <StatsCards
          quotesCount={quotes.length}
          callbacksCount={callbacks.length}
          pendingQuotes={pendingQuotes}
          pendingCallbacks={pendingCallbacks}
        />

        <ChartsSection quotes={quotes} callbacks={callbacks} />

        <div className="space-y-8">
          <QuotesTable quotes={quotes} onUpdate={fetchData} />
          <CallbacksTable callbacks={callbacks} onUpdate={fetchData} />
        </div>
      </main>
    </div>
  );
};

export default Admin;
