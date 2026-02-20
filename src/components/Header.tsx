import { ChevronDown, Menu, X, Car, Bike, Home, Heart, PiggyBank, Users, Building2, FileText, ArrowLeft, MoreHorizontal, Share2, BookmarkPlus, Printer } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle";
import arthurThumbsUp from "@/assets/mascotte/arthur-thumbs-up.png";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openPopover, setOpenPopover] = useState<string | null>(null);
  const [actionsOpen, setActionsOpen] = useState(false);
  const { trackEvent } = useAnalytics();
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  const isHomePage = location.pathname === "/";

  const handleInsuranceTypeClick = (type: string, category: string) => {
    trackEvent('insurance_type_click', {
      category: 'navigation',
      label: `${category}_${type}`,
      insurance_type: type
    });
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: document.title,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
    setActionsOpen(false);
  };

  const handlePrint = () => {
    window.print();
    setActionsOpen(false);
  };

  const assurancesParticuliers = [
    { to: "/assurance-auto", label: t('insurance.auto'), icon: Car },
    { to: "/assurance-moto", label: t('insurance.moto'), icon: Bike },
    { to: "/assurance-habitation", label: t('insurance.home'), icon: Home },
    { to: "/assurance-sante", label: t('insurance.health'), icon: Heart },
    { to: "/assurance-animaux", label: t('insurance.pets'), icon: Heart }
  ];

  const assurancesPro = [
    { to: "/assurance-rc-pro", label: t('insurance.rcPro'), icon: Building2 },
    { to: "/assurance-mrp", label: t('insurance.mrp'), icon: Building2 }
  ];

  const assurancesVieEpargne = [
    { to: "/assurance-vie", label: t('insurance.life'), icon: PiggyBank },
    { to: "/assurance-pret", label: t('insurance.loan'), icon: FileText },
    { to: "/assurance-prevoyance", label: t('insurance.provident'), icon: Users }
  ];

  const assurancesImmobilier = [
    { to: "/assurance-gli", label: t('insurance.gli'), icon: Building2 },
    { to: "/assurance-pno", label: t('insurance.pno'), icon: Home },
    { to: "/gestion-locative", label: t('insurance.rentalManagement'), icon: Building2 }
  ];

  return (
    <>
      {/* Unified Compact Sticky Header - 2026 Design */}
      <header 
        className="sticky top-0 z-50 transition-all duration-300 bg-primary shadow-lg"
        role="banner"
      >
        <div className="container mx-auto px-4">
          {/* Main Header Row */}
          <div className="flex items-center justify-between py-3 md:py-4">
            
            {/* Left: Smart Back Button + Logo */}
            <div className="flex items-center gap-2 min-w-0 shrink-0">
              {!isHomePage && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleBack}
                  className="h-10 w-10 rounded-full hover:bg-muted/80 shrink-0"
                  aria-label="Retour"
                >
                  <ArrowLeft className="h-5 w-5 text-white" />
                </Button>
              )}
              
              <Link 
                to="/" 
                className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-full p-1" 
                aria-label="Retour à la page d'accueil - jemassuremoinscher"
              >
                <img 
                  src={arthurThumbsUp} 
                  alt="Arthur, la mascotte" 
                  className="h-9 w-9 sm:h-10 sm:w-10 object-contain shrink-0"
                />
                <span className="text-base sm:text-lg font-bold tracking-tight whitespace-nowrap">
                  <span className="text-white">jemassure</span>
                  <span className="text-secondary">moinscher</span>
                  <span className="text-white">.fr</span>
                </span>
              </Link>
            </div>

            {/* Right: Actions + Language + Mobile Toggle */}
            <div className="flex items-center gap-1 shrink-0">
              {/* Unified Actions Menu */}
              <Popover open={actionsOpen} onOpenChange={setActionsOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-full hover:bg-muted/80 hidden sm:flex"
                    aria-label="Plus d'actions"
                  >
                    <MoreHorizontal className="h-5 w-5 text-white" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-48 p-2 rounded-3xl bg-card/95 backdrop-blur-xl shadow-lg" align="end" sideOffset={8}>
                  <div className="space-y-0.5">
                    <button 
                      onClick={handleShare}
                      className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted rounded-2xl transition-colors"
                    >
                      <Share2 className="h-4 w-4 text-primary" />
                      {t('nav.share')}
                    </button>
                    <button 
                      className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted rounded-2xl transition-colors"
                      onClick={() => setActionsOpen(false)}
                    >
                      <BookmarkPlus className="h-4 w-4 text-primary" />
                      {t('nav.favorites')}
                    </button>
                    <button 
                      onClick={handlePrint}
                      className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted rounded-2xl transition-colors"
                    >
                      <Printer className="h-4 w-4 text-primary" />
                      {t('nav.print')}
                    </button>
                  </div>
                </PopoverContent>
              </Popover>

              {/* Language Toggle - Desktop */}
              <div className="hidden lg:block">
                <LanguageToggle />
              </div>
              
              {/* Mobile Menu Button */}
              <Button 
                variant="ghost" 
                size="icon" 
                className="lg:hidden h-10 w-10 rounded-full hover:bg-muted/80" 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
                aria-label={isMobileMenuOpen ? t('nav.closeMenu') : t('nav.openMenu')} 
                aria-expanded={isMobileMenuOpen} 
                aria-controls="mobile-menu"
              >
                {isMobileMenuOpen ? <X className="h-5 w-5 text-white" /> : <Menu className="h-5 w-5 text-white" />}
              </Button>
            </div>
          </div>

          {/* Desktop Navigation - Separate Row */}
          <nav className="hidden lg:block pb-3" role="navigation" aria-label="Navigation principale">
            <div className="flex items-center justify-center gap-1 flex-wrap">

              <Popover open={openPopover === "particuliers"} onOpenChange={open => setOpenPopover(open ? "particuliers" : null)}>
                <PopoverTrigger asChild>
                  <button className="nav-pill flex items-center gap-1 text-white">
                    {t('nav.individuals')}
                    <ChevronDown className="h-3 w-3 opacity-60 text-white" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-56 p-2 rounded-3xl bg-card/95 backdrop-blur-xl shadow-lg" align="center" sideOffset={8}>
                  <div className="space-y-0.5">
                    {assurancesParticuliers.map(({ to, label, icon: Icon }) => (
                      <Link 
                        key={to} 
                        to={to} 
                        className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted rounded-2xl transition-colors"
                        onClick={() => {
                          setOpenPopover(null);
                          handleInsuranceTypeClick(label.toLowerCase(), 'particuliers');
                        }}
                      >
                        <Icon className="h-4 w-4 text-primary" />
                        {label}
                      </Link>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>

              <Popover open={openPopover === "pro"} onOpenChange={open => setOpenPopover(open ? "pro" : null)}>
                <PopoverTrigger asChild>
                  <button className="nav-pill flex items-center gap-1 text-white">
                    {t('nav.professionals')}
                    <ChevronDown className="h-3 w-3 opacity-60 text-white" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-56 p-2 rounded-3xl bg-card/95 backdrop-blur-xl shadow-lg" align="center" sideOffset={8}>
                  <div className="space-y-0.5">
                    {assurancesPro.map(({ to, label, icon: Icon }) => (
                      <Link 
                        key={to} 
                        to={to} 
                        className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted rounded-2xl transition-colors"
                        onClick={() => {
                          setOpenPopover(null);
                          handleInsuranceTypeClick(label.toLowerCase(), 'professionnels');
                        }}
                      >
                        <Icon className="h-4 w-4 text-primary" />
                        {label}
                      </Link>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>

              <Popover open={openPopover === "epargne"} onOpenChange={open => setOpenPopover(open ? "epargne" : null)}>
                <PopoverTrigger asChild>
                  <button className="nav-pill flex items-center gap-1 text-white">
                    {t('nav.lifeAndSavings')}
                    <ChevronDown className="h-3 w-3 opacity-60 text-white" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-56 p-2 rounded-3xl bg-card/95 backdrop-blur-xl shadow-lg" align="center" sideOffset={8}>
                  <div className="space-y-0.5">
                    {assurancesVieEpargne.map(({ to, label, icon: Icon }) => (
                      <Link 
                        key={to} 
                        to={to} 
                        className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted rounded-2xl transition-colors"
                        onClick={() => {
                          setOpenPopover(null);
                          handleInsuranceTypeClick(label.toLowerCase(), 'vie_epargne');
                        }}
                      >
                        <Icon className="h-4 w-4 text-primary" />
                        {label}
                      </Link>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>

              <Popover open={openPopover === "immobilier"} onOpenChange={open => setOpenPopover(open ? "immobilier" : null)}>
                <PopoverTrigger asChild>
                  <button className="nav-pill flex items-center gap-1 text-white">
                    {t('nav.realEstate')}
                    <ChevronDown className="h-3 w-3 opacity-60 text-white" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-56 p-2 rounded-3xl bg-card/95 backdrop-blur-xl shadow-lg" align="center" sideOffset={8}>
                  <div className="space-y-0.5">
                    {assurancesImmobilier.map(({ to, label, icon: Icon }) => (
                      <Link 
                        key={to} 
                        to={to} 
                        className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted rounded-2xl transition-colors"
                        onClick={() => {
                          setOpenPopover(null);
                          handleInsuranceTypeClick(label.toLowerCase(), 'immobilier');
                        }}
                      >
                        <Icon className="h-4 w-4 text-primary" />
                        {label}
                      </Link>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>

              {/* Subtle visual separator using spacing only */}
              <div className="w-3" aria-hidden="true" />

              <Link to="/qui-sommes-nous" className="nav-pill text-white">{t('nav.aboutUs')}</Link>
              <Link to="/nos-partenaires" className="nav-pill text-white">{t('nav.partners')}</Link>
              <Link to="/blog" className="nav-pill text-white">{t('nav.blog')}</Link>
            </div>
          </nav>
        </div>
      </header>

      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-background/60 backdrop-blur-sm z-40 lg:hidden" 
          onClick={() => setIsMobileMenuOpen(false)} 
          aria-hidden="true" 
        />
      )}
      
      {/* Mobile Menu Drawer - Updated with no borders */}
      {isMobileMenuOpen && (
        <div 
          id="mobile-menu" 
          className="fixed top-[64px] left-0 right-0 bottom-0 bg-card/98 backdrop-blur-xl z-50 overflow-y-auto lg:hidden"
          role="dialog" 
          aria-label="Menu de navigation mobile"
        >
          <nav className="p-4 space-y-6" role="navigation" aria-label="Navigation mobile principale">
            {/* Language Toggle - Mobile */}
            <div className="flex justify-end mb-2">
              <LanguageToggle />
            </div>
            

            <div>
              <h3 className="px-4 py-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">{t('nav.individuals')}</h3>
              <div className="space-y-0.5 mt-2">
                {assurancesParticuliers.map(({ to, label, icon: Icon }) => (
                  <Link 
                    key={to} 
                    to={to} 
                    className="flex items-center gap-3 px-4 py-3 text-base font-medium text-foreground hover:bg-muted rounded-2xl transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className="h-5 w-5 text-primary" />
                    {label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h3 className="px-4 py-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">{t('nav.professionals')}</h3>
              <div className="space-y-0.5 mt-2">
                {assurancesPro.map(({ to, label, icon: Icon }) => (
                  <Link 
                    key={to} 
                    to={to} 
                    className="flex items-center gap-3 px-4 py-3 text-base font-medium text-foreground hover:bg-muted rounded-2xl transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className="h-5 w-5 text-primary" />
                    {label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h3 className="px-4 py-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">{t('nav.lifeAndSavings')}</h3>
              <div className="space-y-0.5 mt-2">
                {assurancesVieEpargne.map(({ to, label, icon: Icon }) => (
                  <Link 
                    key={to} 
                    to={to} 
                    className="flex items-center gap-3 px-4 py-3 text-base font-medium text-foreground hover:bg-muted rounded-2xl transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className="h-5 w-5 text-primary" />
                    {label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h3 className="px-4 py-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">{t('nav.realEstate')}</h3>
              <div className="space-y-0.5 mt-2">
                {assurancesImmobilier.map(({ to, label, icon: Icon }) => (
                  <Link 
                    key={to} 
                    to={to} 
                    className="flex items-center gap-3 px-4 py-3 text-base font-medium text-foreground hover:bg-muted rounded-2xl transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className="h-5 w-5 text-primary" />
                    {label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Secondary links - no border separator */}
            <div className="pt-4 bg-muted/30 -mx-4 px-4 rounded-t-[2rem]">
              <div className="space-y-0.5">
                <Link 
                  to="/qui-sommes-nous" 
                  className="block px-4 py-3 text-base font-medium text-foreground hover:bg-muted rounded-2xl transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t('nav.aboutUs')}
                </Link>
                <Link 
                  to="/nos-partenaires" 
                  className="block px-4 py-3 text-base font-medium text-foreground hover:bg-muted rounded-2xl transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t('nav.partners')}
                </Link>
                <Link 
                  to="/avis-clients" 
                  className="block px-4 py-3 text-base font-medium text-foreground hover:bg-muted rounded-2xl transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t('nav.reviews')}
                </Link>
                <Link 
                  to="/blog" 
                  className="block px-4 py-3 text-base font-medium text-foreground hover:bg-muted rounded-2xl transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t('nav.blog')}
                </Link>
              </div>
            </div>
          </nav>
        </div>
      )}
    </>
  );
};

export default Header;
