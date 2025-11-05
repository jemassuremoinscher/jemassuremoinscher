import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LogOut, RefreshCw, Shield, LayoutDashboard, Trash2, Target, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { StatsCards } from '@/components/admin/StatsCards';
import { QuotesTable } from '@/components/admin/QuotesTable';
import { CallbacksTable } from '@/components/admin/CallbacksTable';
import { ChartsSection } from '@/components/admin/ChartsSection';
import { GlobalSearch } from '@/components/admin/GlobalSearch';
import { EmailTrackingTable } from '@/components/admin/EmailTrackingTable';
import { LeadsFilters, FilterOptions } from '@/components/admin/LeadsFilters';
import { TrashBin } from '@/components/admin/TrashBin';
import { CRMDashboard } from '@/components/admin/CRMDashboard';
import { SalesAgentsManager } from '@/components/admin/SalesAgentsManager';

const Admin = () => {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [quotes, setQuotes] = useState<any[]>([]);
  const [callbacks, setCallbacks] = useState<any[]>([]);
  const [filteredQuotes, setFilteredQuotes] = useState<any[]>([]);
  const [filteredCallbacks, setFilteredCallbacks] = useState<any[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const quotesTableRef = useRef<HTMLDivElement>(null);
  const callbacksTableRef = useRef<HTMLDivElement>(null);

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
        .is('deleted_at', null)
        .order('created_at', { ascending: false }),
      supabase
        .from('contact_callbacks')
        .select('*')
        .is('deleted_at', null)
        .order('created_at', { ascending: false }),
    ]);

    if (quotesResult.data) {
      setQuotes(quotesResult.data);
      setFilteredQuotes(quotesResult.data);
    }
    if (callbacksResult.data) {
      setCallbacks(callbacksResult.data);
      setFilteredCallbacks(callbacksResult.data);
    }
    
    setIsRefreshing(false);
  };

  const applyFilters = (filters: FilterOptions) => {
    // Filter quotes
    let newFilteredQuotes = quotes.filter(quote => {
      const matchesSearch = !filters.searchQuery || 
        quote.full_name.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        quote.email.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        quote.phone.includes(filters.searchQuery);
      
      const matchesType = filters.insuranceType === 'all' || quote.insurance_type === filters.insuranceType;
      const matchesStatus = filters.status === 'all' || quote.status === filters.status;
      
      const quoteDate = new Date(quote.created_at);
      const matchesDateFrom = !filters.dateFrom || quoteDate >= filters.dateFrom;
      const matchesDateTo = !filters.dateTo || quoteDate <= filters.dateTo;

      return matchesSearch && matchesType && matchesStatus && matchesDateFrom && matchesDateTo;
    });

    // Filter callbacks
    let newFilteredCallbacks = callbacks.filter(callback => {
      const matchesSearch = !filters.searchQuery || 
        callback.full_name.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        callback.email.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        callback.phone.includes(filters.searchQuery);
      
      const matchesStatus = filters.status === 'all' || callback.status === filters.status;
      
      const callbackDate = new Date(callback.created_at);
      const matchesDateFrom = !filters.dateFrom || callbackDate >= filters.dateFrom;
      const matchesDateTo = !filters.dateTo || callbackDate <= filters.dateTo;

      return matchesSearch && matchesStatus && matchesDateFrom && matchesDateTo;
    });

    setFilteredQuotes(newFilteredQuotes);
    setFilteredCallbacks(newFilteredCallbacks);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const handleSearchResultClick = (result: any) => {
    setHighlightedId(result.id);
    
    // Scroll to the appropriate table
    const targetRef = result.type === 'quote' ? quotesTableRef : callbacksTableRef;
    
    if (targetRef.current) {
      targetRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      
      // Highlight effect
      setTimeout(() => {
        const element = document.getElementById(`row-${result.id}`);
        if (element) {
          element.classList.add('bg-yellow-100', 'dark:bg-yellow-900/20');
          setTimeout(() => {
            element.classList.remove('bg-yellow-100', 'dark:bg-yellow-900/20');
            setHighlightedId(null);
          }, 2000);
        }
      }, 300);
    }

    toast.success(`${result.type === 'quote' ? 'Devis' : 'Rappel'} trouvé: ${result.name}`);
  };

  if (loading || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const pendingQuotes = filteredQuotes.filter(q => q.status === 'pending').length;
  const pendingCallbacks = filteredCallbacks.filter(c => c.status === 'pending').length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col gap-4">
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
            
            {/* Global Search */}
            <div className="w-full">
              <GlobalSearch
                quotes={quotes}
                callbacks={callbacks}
                onResultClick={handleSearchResultClick}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6 max-w-3xl">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <LayoutDashboard className="h-4 w-4" />
              Tableau de bord
            </TabsTrigger>
            <TabsTrigger value="crm" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              CRM Pipeline
            </TabsTrigger>
            <TabsTrigger value="agents" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Commerciaux
            </TabsTrigger>
            <TabsTrigger value="trash" className="flex items-center gap-2">
              <Trash2 className="h-4 w-4" />
              Corbeille
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-8">
            <StatsCards
              quotesCount={filteredQuotes.length}
              callbacksCount={filteredCallbacks.length}
              pendingQuotes={pendingQuotes}
              pendingCallbacks={pendingCallbacks}
            />

            <ChartsSection quotes={filteredQuotes} callbacks={filteredCallbacks} />

            <LeadsFilters onFilterChange={applyFilters} />

            <div className="mb-8">
              <EmailTrackingTable />
            </div>

            <div className="space-y-8">
              <div ref={quotesTableRef}>
                <QuotesTable quotes={filteredQuotes} onUpdate={fetchData} highlightedId={highlightedId} />
              </div>
              <div ref={callbacksTableRef}>
                <CallbacksTable callbacks={filteredCallbacks} onUpdate={fetchData} highlightedId={highlightedId} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="crm">
            <CRMDashboard />
          </TabsContent>

          <TabsContent value="agents">
            <SalesAgentsManager />
          </TabsContent>

          <TabsContent value="trash">
            <TrashBin />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
