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
        className="glass-header sticky top-0 z-50 transition-all duration-300"
        role="banner"
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-2 md:py-3">
            
            {/* Left: Smart Back Button or Logo */}
            <div className="flex items-center gap-3">
              {!isHomePage && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleBack}
                  className="nav-pill h-10 w-10 rounded-full hover:bg-muted/80"
                  aria-label="Retour"
                >
                  <ArrowLeft className="h-5 w-5 text-foreground" />
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
                  className="h-8 w-8 sm:h-10 sm:w-10 object-contain"
                />
                <span className="text-base sm:text-lg font-bold tracking-tight hidden sm:block">
                  <span className="text-primary">jemassure</span>
                  <span className="text-secondary">moinscher</span>
                </span>
              </Link>
            </div>

            {/* Center: Navigation Pills - Desktop */}
            <nav className="hidden lg:flex items-center gap-1" role="navigation" aria-label="Navigation principale">
              <Link 
                to="/comparateur-garanties" 
                className="nav-pill active"
                onClick={() => trackEvent('insurance_type_click', { category: 'navigation', label: 'comparateur_garanties_header' })}
              >
                {t('nav.comparator')}
              </Link>

              <Popover open={openPopover === "particuliers"} onOpenChange={open => setOpenPopover(open ? "particuliers" : null)}>
                <PopoverTrigger asChild>
                  <button className="nav-pill flex items-center gap-1">
                    {t('nav.individuals')}
                    <ChevronDown className="h-3 w-3 opacity-60" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-56 p-2 rounded-2xl bg-card/95 backdrop-blur-xl shadow-lg" align="center" sideOffset={8}>
                  <div className="space-y-0.5">
                    {assurancesParticuliers.map(({ to, label, icon: Icon }) => (
                      <Link 
                        key={to} 
                        to={to} 
                        className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted rounded-xl transition-colors"
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
                  <button className="nav-pill flex items-center gap-1">
                    {t('nav.professionals')}
                    <ChevronDown className="h-3 w-3 opacity-60" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-56 p-2 rounded-2xl bg-card/95 backdrop-blur-xl shadow-lg" align="center" sideOffset={8}>
                  <div className="space-y-0.5">
                    {assurancesPro.map(({ to, label, icon: Icon }) => (
                      <Link 
                        key={to} 
                        to={to} 
                        className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted rounded-xl transition-colors"
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
                  <button className="nav-pill flex items-center gap-1">
                    {t('nav.lifeAndSavings')}
                    <ChevronDown className="h-3 w-3 opacity-60" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-56 p-2 rounded-2xl bg-card/95 backdrop-blur-xl shadow-lg" align="center" sideOffset={8}>
                  <div className="space-y-0.5">
                    {assurancesVieEpargne.map(({ to, label, icon: Icon }) => (
                      <Link 
                        key={to} 
                        to={to} 
                        className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted rounded-xl transition-colors"
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
                  <button className="nav-pill flex items-center gap-1">
                    {t('nav.realEstate')}
                    <ChevronDown className="h-3 w-3 opacity-60" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-56 p-2 rounded-2xl bg-card/95 backdrop-blur-xl shadow-lg" align="center" sideOffset={8}>
                  <div className="space-y-0.5">
                    {assurancesImmobilier.map(({ to, label, icon: Icon }) => (
                      <Link 
                        key={to} 
                        to={to} 
                        className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted rounded-xl transition-colors"
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
              <div className="w-2" aria-hidden="true" />

              <Link to="/qui-sommes-nous" className="nav-pill">{t('nav.aboutUs')}</Link>
              <Link to="/blog" className="nav-pill">{t('nav.blog')}</Link>
            </nav>

            {/* Right: Actions Menu + Language + Mobile Toggle */}
            <div className="flex items-center gap-1">
              {/* Unified Actions Menu */}
              <Popover open={actionsOpen} onOpenChange={setActionsOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="nav-pill h-10 w-10 rounded-full hidden sm:flex"
                    aria-label="Plus d'actions"
                  >
                    <MoreHorizontal className="h-5 w-5 text-foreground" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-48 p-2 rounded-2xl bg-card/95 backdrop-blur-xl shadow-lg" align="end" sideOffset={8}>
                  <div className="space-y-0.5">
                    <button 
                      onClick={handleShare}
                      className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted rounded-xl transition-colors"
                    >
                      <Share2 className="h-4 w-4 text-primary" />
                      Partager
                    </button>
                    <button 
                      className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted rounded-xl transition-colors"
                      onClick={() => setActionsOpen(false)}
                    >
                      <BookmarkPlus className="h-4 w-4 text-primary" />
                      Favoris
                    </button>
                    <button 
                      onClick={handlePrint}
                      className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted rounded-xl transition-colors"
                    >
                      <Printer className="h-4 w-4 text-primary" />
                      Imprimer
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
                className="lg:hidden nav-pill h-10 w-10 rounded-full" 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
                aria-label={isMobileMenuOpen ? t('nav.closeMenu') : t('nav.openMenu')} 
                aria-expanded={isMobileMenuOpen} 
                aria-controls="mobile-menu"
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
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
          className="fixed top-[56px] left-0 right-0 bottom-0 bg-card/98 backdrop-blur-xl z-50 overflow-y-auto lg:hidden"
          role="dialog" 
          aria-label="Menu de navigation mobile"
        >
          <nav className="p-4 space-y-6" role="navigation" aria-label="Navigation mobile principale">
            {/* Language Toggle - Mobile */}
            <div className="flex justify-end mb-2">
              <LanguageToggle />
            </div>
            
            <div>
              <Link 
                to="/comparateur-garanties" 
                className="block px-4 py-3 mb-3 text-base font-semibold text-primary-foreground bg-primary rounded-2xl transition-all text-center shadow-lg"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('nav.comparator')}
              </Link>
            </div>

            <div>
              <h3 className="px-4 py-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">{t('nav.individuals')}</h3>
              <div className="space-y-0.5 mt-2">
                {assurancesParticuliers.map(({ to, label, icon: Icon }) => (
                  <Link 
                    key={to} 
                    to={to} 
                    className="flex items-center gap-3 px-4 py-3 text-base font-medium text-foreground hover:bg-muted rounded-xl transition-colors"
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
                    className="flex items-center gap-3 px-4 py-3 text-base font-medium text-foreground hover:bg-muted rounded-xl transition-colors"
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
                    className="flex items-center gap-3 px-4 py-3 text-base font-medium text-foreground hover:bg-muted rounded-xl transition-colors"
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
                    className="flex items-center gap-3 px-4 py-3 text-base font-medium text-foreground hover:bg-muted rounded-xl transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className="h-5 w-5 text-primary" />
                    {label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Secondary links - no border separator */}
            <div className="pt-4 bg-muted/30 -mx-4 px-4 rounded-t-3xl">
              <div className="space-y-0.5">
                <Link 
                  to="/qui-sommes-nous" 
                  className="block px-4 py-3 text-base font-medium text-foreground hover:bg-muted rounded-xl transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t('nav.aboutUs')}
                </Link>
                <Link 
                  to="/nos-partenaires" 
                  className="block px-4 py-3 text-base font-medium text-foreground hover:bg-muted rounded-xl transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t('nav.partners')}
                </Link>
                <Link 
                  to="/avis-clients" 
                  className="block px-4 py-3 text-base font-medium text-foreground hover:bg-muted rounded-xl transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t('nav.reviews')}
                </Link>
                <Link 
                  to="/blog" 
                  className="block px-4 py-3 text-base font-medium text-foreground hover:bg-muted rounded-xl transition-colors"
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
