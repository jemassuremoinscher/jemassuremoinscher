import { useEffect, useState, useRef, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LogOut, RefreshCw, LayoutDashboard, Trash2, Target, Users, Trophy, UserCog, TrendingUp, Menu, Sparkles, Search, Bell, BellOff, Linkedin, ShieldCheck } from 'lucide-react';
import { ManualLeadForm } from '@/components/admin/ManualLeadForm';
import arthurWaving from '@/assets/mascotte/arthur-waving.png';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { StatsCards } from '@/components/admin/StatsCards';
import { QuotesTable } from '@/components/admin/QuotesTable';
import { CallbacksTable } from '@/components/admin/CallbacksTable';
import { ChartsSection } from '@/components/admin/ChartsSection';
import { GlobalSearch } from '@/components/admin/GlobalSearch';
import { LeadsFilters, FilterOptions } from '@/components/admin/LeadsFilters';
import { TrashBin } from '@/components/admin/TrashBin';
import { CRMDashboard } from '@/components/admin/CRMDashboard';
import { SalesAgentsManager } from '@/components/admin/SalesAgentsManager';
import { GoalsManager } from '@/components/admin/GoalsManager';
import { CommercialSupervision } from '@/components/admin/CommercialSupervision';
import { CommercialAlerts } from '@/components/admin/CommercialAlerts';
import { RedistributionLog } from '@/components/admin/RedistributionLog';
import { RedistributionButton } from '@/components/admin/RedistributionButton';
import { RedistributionHistory } from '@/components/admin/RedistributionHistory';
import { GoogleAnalyticsDashboard } from '@/components/admin/GoogleAnalyticsDashboard';
import { SEOSuggestions } from '@/components/admin/SEOSuggestions';
import SERPPreview from '@/components/admin/SERPPreview';
import { GeoScoreCard } from '@/components/admin/GeoScoreCard';
import { LinkedInAutoPoster } from '@/components/admin/LinkedInAutoPoster';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useLeadNotifications } from '@/hooks/useLeadNotifications';

const Admin = () => {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [quotes, setQuotes] = useState<any[]>([]);
  const [callbacks, setCallbacks] = useState<any[]>([]);
  const [filteredQuotes, setFilteredQuotes] = useState<any[]>([]);
  const [filteredCallbacks, setFilteredCallbacks] = useState<any[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [notificationsEnabled, setNotificationsEnabled] = useState(() => {
    return localStorage.getItem('admin-notifications') === 'true';
  });
  const quotesTableRef = useRef<HTMLDivElement>(null);
  const callbacksTableRef = useRef<HTMLDivElement>(null);
  const { requestPermission } = useLeadNotifications(notificationsEnabled && isAdmin);

  const toggleNotifications = useCallback(async () => {
    if (!notificationsEnabled) {
      const perm = await requestPermission();
      if (perm === 'granted') {
        setNotificationsEnabled(true);
        localStorage.setItem('admin-notifications', 'true');
        toast.success('🔔 Notifications activées ! Vous serez alerté pour chaque nouveau prospect.');
      } else if (perm === 'denied') {
        toast.error('Notifications bloquées. Autorisez-les dans les paramètres de votre navigateur.');
      } else {
        toast.info('Veuillez autoriser les notifications dans la popup du navigateur.');
      }
    } else {
      setNotificationsEnabled(false);
      localStorage.setItem('admin-notifications', 'false');
      toast.info('Notifications désactivées.');
    }
  }, [notificationsEnabled, requestPermission]);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchData();
      
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

  // Guard: block non-admin authenticated users (after all hooks)
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) return null;

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-8 text-center">
        <h1 className="text-2xl font-bold text-destructive">Accès refusé</h1>
        <p className="text-muted-foreground">Vous n'avez pas les permissions nécessaires pour accéder à cette page.</p>
        <Button variant="outline" onClick={() => navigate('/')}>Retour à l'accueil</Button>
      </div>
    );
  }

  const fetchData = async () => {
    setIsRefreshing(true);
    
    const [quotesResult, callbacksResult] = await Promise.all([
      supabase
        .from('insurance_quotes')
        .select('*')
        .is('deleted_at', null)
        .in('status', ['pending', 'no_answer'])
        .order('created_at', { ascending: false }),
      supabase
        .from('contact_callbacks')
        .select('*')
        .is('deleted_at', null)
        .eq('status', 'pending')
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
    const targetRef = result.type === 'quote' ? quotesTableRef : callbacksTableRef;
    if (targetRef.current) {
      targetRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
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

  const pendingQuotes = filteredQuotes.filter(q => q.status === 'pending').length;
  const pendingCallbacks = filteredCallbacks.filter(c => c.status === 'pending').length;

  const categories = [
    {
      label: 'Dashboard',
      tabs: [
        { value: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      ],
    },
    {
      label: 'Marketing',
      tabs: [
        { value: 'analytics', label: 'Analytics', icon: TrendingUp },
        { value: 'seo', label: 'SEO', icon: Sparkles },
        { value: 'geo', label: 'GEO', icon: ShieldCheck },
        { value: 'serp', label: 'SERP', icon: Search },
        { value: 'linkedin', label: 'LinkedIn', icon: Linkedin },
      ],
    },
    {
      label: 'Commercial',
      tabs: [
        { value: 'crm', label: 'CRM', icon: Target },
        { value: 'supervision', label: 'Supervision', icon: UserCog },
        { value: 'agents', label: 'Commerciaux', icon: Users },
        { value: 'trash', label: 'Corbeille', icon: Trash2 },
      ],
    },
  ];

  const allTabs = categories.flatMap(c => c.tabs);

  return (
    <>
      <Helmet>
        <title>Dashboard Admin | jemassuremoinscher.fr</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex flex-col gap-3 sm:gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden shrink-0">
                  <img src={arthurWaving} alt="Arthur mascotte" className="w-full h-full object-contain" width={40} height={40} loading="lazy" decoding="async" />
                </div>
                <div className="min-w-0">
                  <h1 className="text-lg sm:text-2xl font-bold truncate">Dashboard Admin</h1>
                  <p className="text-xs sm:text-sm text-muted-foreground truncate">{user?.email}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                <Button
                  variant={notificationsEnabled ? "default" : "outline"}
                  size="icon"
                  onClick={toggleNotifications}
                  aria-label={notificationsEnabled ? "Désactiver les notifications" : "Activer les notifications"}
                  title={notificationsEnabled ? "Notifications activées" : "Activer les notifications"}
                  className={notificationsEnabled ? "bg-green-600 hover:bg-green-700 text-white" : ""}
                >
                  {notificationsEnabled ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchData}
                  disabled={isRefreshing}
                  className="hidden sm:flex"
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                  Actualiser
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={fetchData}
                  disabled={isRefreshing}
                  className="sm:hidden"
                  aria-label="Actualiser les données"
                >
                  <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/')}
                  className="hidden md:flex"
                >
                  Voir le site
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleSignOut}
                  className="hidden sm:flex"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Déconnexion
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={handleSignOut}
                  className="sm:hidden"
                  aria-label="Déconnexion"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
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
      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Tabs - single row with category separators */}
          <TabsList className="flex w-full overflow-x-auto no-scrollbar gap-1 p-1.5 mb-6 bg-primary/10 border border-primary/20 rounded-lg">
            {categories.map((cat, ci) => (
              <div key={cat.label} className="flex items-center shrink-0">
                {ci > 0 && <div className="w-px h-6 bg-primary/30 mx-1.5 shrink-0" />}
                <span className="text-[10px] font-semibold text-primary/60 uppercase tracking-wider px-2 shrink-0 hidden sm:inline">{cat.label}</span>
                {cat.tabs.map(tab => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="flex items-center gap-1.5 shrink-0 text-xs sm:text-sm px-3 py-2 text-primary/70 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md hover:bg-primary/20 transition-colors rounded-md"
                  >
                    <tab.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                    <span className="sm:hidden">{tab.label.length > 6 ? tab.label.slice(0, 6) + '.' : tab.label}</span>
                  </TabsTrigger>
                ))}
              </div>
            ))}
          </TabsList>

          <TabsContent value="dashboard" className="space-y-4 sm:space-y-8">
            <div className="flex items-center justify-between">
              <StatsCards
                quotesCount={filteredQuotes.length}
                callbacksCount={filteredCallbacks.length}
                pendingQuotes={pendingQuotes}
                pendingCallbacks={pendingCallbacks}
              />
              <ManualLeadForm onLeadCreated={fetchData} />
            </div>

            <ChartsSection quotes={filteredQuotes} callbacks={filteredCallbacks} />

            <LeadsFilters onFilterChange={applyFilters} />

            <div className="space-y-4 sm:space-y-8">
              <div ref={quotesTableRef} className="overflow-x-auto">
                <QuotesTable quotes={filteredQuotes} onUpdate={fetchData} highlightedId={highlightedId} />
              </div>
              <div ref={callbacksTableRef} className="overflow-x-auto">
                <CallbacksTable callbacks={filteredCallbacks} onUpdate={fetchData} highlightedId={highlightedId} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <GoogleAnalyticsDashboard />
          </TabsContent>

          <TabsContent value="seo">
            <SEOSuggestions />
          </TabsContent>

          <TabsContent value="geo">
            <GeoScoreCard />
          </TabsContent>

          <TabsContent value="serp">
            <SERPPreview />
          </TabsContent>

          <TabsContent value="linkedin">
            <LinkedInAutoPoster />
          </TabsContent>

          <TabsContent value="supervision">
            <div className="space-y-4 sm:space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h2 className="text-xl sm:text-2xl font-bold">Supervision Commerciale</h2>
                <RedistributionButton />
              </div>
              <CommercialAlerts />
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                <div className="lg:col-span-2">
                  <CommercialSupervision />
                </div>
                <div>
                  <RedistributionLog />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="crm">
            <CRMDashboard />
          </TabsContent>

          <TabsContent value="agents">
            <div className="space-y-8">
              <SalesAgentsManager />
              <GoalsManager />
            </div>
          </TabsContent>

          <TabsContent value="trash">
            <TrashBin />
          </TabsContent>
        </Tabs>
      </main>
    </div>
    </>
  );
};

export default Admin;
