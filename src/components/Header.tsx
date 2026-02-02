import { ChevronDown, Menu, X, Car, Bike, Home, Heart, PiggyBank, Users, Building2, FileText, HomeIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle";
import logoNew from "@/assets/logo-new.png";
const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openPopover, setOpenPopover] = useState<string | null>(null);
  const {
    trackEvent
  } = useAnalytics();
  const {
    t
  } = useLanguage();
  const handleInsuranceTypeClick = (type: string, category: string) => {
    trackEvent('insurance_type_click', {
      category: 'navigation',
      label: `${category}_${type}`,
      insurance_type: type
    });
  };
  const assurancesParticuliers = [{
    to: "/assurance-auto",
    label: t('insurance.auto'),
    icon: Car
  }, {
    to: "/assurance-moto",
    label: t('insurance.moto'),
    icon: Bike
  }, {
    to: "/assurance-habitation",
    label: t('insurance.home'),
    icon: Home
  }, {
    to: "/assurance-sante",
    label: t('insurance.health'),
    icon: Heart
  }, {
    to: "/assurance-animaux",
    label: t('insurance.pets'),
    icon: Heart
  }];
  const assurancesPro = [{
    to: "/assurance-rc-pro",
    label: t('insurance.rcPro'),
    icon: Building2
  }, {
    to: "/assurance-mrp",
    label: t('insurance.mrp'),
    icon: Building2
  }];
  const assurancesVieEpargne = [{
    to: "/assurance-vie",
    label: t('insurance.life'),
    icon: PiggyBank
  }, {
    to: "/assurance-pret",
    label: t('insurance.loan'),
    icon: FileText
  }, {
    to: "/assurance-prevoyance",
    label: t('insurance.provident'),
    icon: Users
  }];
  const assurancesImmobilier = [{
    to: "/assurance-gli",
    label: t('insurance.gli'),
    icon: Building2
  }, {
    to: "/assurance-pno",
    label: t('insurance.pno'),
    icon: Home
  }, {
    to: "/gestion-locative",
    label: t('insurance.rentalManagement'),
    icon: Building2
  }];
  return <>
      <header className="bg-primary border-b border-border sticky top-0 z-50 shadow-sm" role="banner">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center py-6 md:py-8 relative">
            {/* Centered Logo Text */}
            <Link 
              to="/" 
              className="flex items-center focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-primary rounded-lg" 
              aria-label="Retour à la page d'accueil - jemassuremoinscher"
            >
              <span className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
                <span className="text-white">jemassure</span>
                <span className="text-amber-400">moinscher.fr</span>
              </span>
            </Link>

            {/* Right side controls */}
            <div className="absolute right-0 flex items-center gap-2">
              {/* Language Toggle - Desktop */}
              <div className="hidden lg:block">
                <LanguageToggle />
              </div>
              
              {/* Mobile Menu Button */}
              <Button 
                variant="ghost" 
                size="icon" 
                className="lg:hidden focus:ring-2 focus:ring-white/50 text-white hover:bg-white/10" 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
                aria-label={isMobileMenuOpen ? t('nav.closeMenu') : t('nav.openMenu')} 
                aria-expanded={isMobileMenuOpen} 
                aria-controls="mobile-menu"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Desktop Navigation Menu */}
        <nav className="hidden lg:block bg-gradient-to-r from-muted to-muted/50 border-t border-border" role="navigation" aria-label="Navigation principale">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center gap-2 py-3">
              <Link to="/comparateur-garanties" className="px-4 py-2 text-sm font-semibold text-white bg-primary hover:bg-primary/90 rounded-lg shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2" onClick={() => {
              trackEvent('insurance_type_click', {
                category: 'navigation',
                label: 'comparateur_garanties_header'
              });
            }}>
                {t('nav.comparator')}
              </Link>

              <Popover open={openPopover === "particuliers"} onOpenChange={open => setOpenPopover(open ? "particuliers" : null)}>
                <PopoverTrigger asChild>
                  <Button variant="ghost" className="px-4 py-2 text-sm font-medium text-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all flex items-center gap-1">
                    {t('nav.individuals')}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-2 bg-card shadow-lg border border-border" align="start">
                  <div className="space-y-1">
                    {assurancesParticuliers.map(({
                    to,
                    label,
                    icon: Icon
                  }) => <Link key={to} to={to} className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-foreground hover:bg-primary/5 hover:text-primary rounded-md transition-colors" onClick={() => {
                    setOpenPopover(null);
                    handleInsuranceTypeClick(label.toLowerCase(), 'particuliers');
                  }}>
                        <Icon className="h-4 w-4 text-primary" />
                        {label}
                      </Link>)}
                  </div>
                </PopoverContent>
              </Popover>

              <Popover open={openPopover === "pro"} onOpenChange={open => setOpenPopover(open ? "pro" : null)}>
                <PopoverTrigger asChild>
                  <Button variant="ghost" className="px-4 py-2 text-sm font-medium text-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all flex items-center gap-1">
                    {t('nav.professionals')}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-2 bg-card shadow-lg border border-border" align="start">
                  <div className="space-y-1">
                    {assurancesPro.map(({
                    to,
                    label,
                    icon: Icon
                  }) => <Link key={to} to={to} className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-foreground hover:bg-primary/5 hover:text-primary rounded-md transition-colors" onClick={() => {
                    setOpenPopover(null);
                    handleInsuranceTypeClick(label.toLowerCase(), 'professionnels');
                  }}>
                        <Icon className="h-4 w-4 text-primary" />
                        {label}
                      </Link>)}
                  </div>
                </PopoverContent>
              </Popover>

              <Popover open={openPopover === "epargne"} onOpenChange={open => setOpenPopover(open ? "epargne" : null)}>
                <PopoverTrigger asChild>
                  <Button variant="ghost" className="px-4 py-2 text-sm font-medium text-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all flex items-center gap-1">
                    {t('nav.lifeAndSavings')}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-2 bg-card shadow-lg border border-border" align="start">
                  <div className="space-y-1">
                    {assurancesVieEpargne.map(({
                    to,
                    label,
                    icon: Icon
                  }) => <Link key={to} to={to} className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-foreground hover:bg-primary/5 hover:text-primary rounded-md transition-colors" onClick={() => {
                    setOpenPopover(null);
                    handleInsuranceTypeClick(label.toLowerCase(), 'vie_epargne');
                  }}>
                        <Icon className="h-4 w-4 text-primary" />
                        {label}
                      </Link>)}
                  </div>
                </PopoverContent>
              </Popover>

              <Popover open={openPopover === "immobilier"} onOpenChange={open => setOpenPopover(open ? "immobilier" : null)}>
                <PopoverTrigger asChild>
                  <Button variant="ghost" className="px-4 py-2 text-sm font-medium text-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all flex items-center gap-1">
                    {t('nav.realEstate')}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-2 bg-card shadow-lg border border-border" align="start">
                  <div className="space-y-1">
                    {assurancesImmobilier.map(({
                    to,
                    label,
                    icon: Icon
                  }) => <Link key={to} to={to} className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-foreground hover:bg-primary/5 hover:text-primary rounded-md transition-colors" onClick={() => {
                    setOpenPopover(null);
                    handleInsuranceTypeClick(label.toLowerCase(), 'immobilier');
                  }}>
                        <Icon className="h-4 w-4 text-primary" />
                        {label}
                      </Link>)}
                  </div>
                </PopoverContent>
              </Popover>

              <div className="h-6 w-px bg-border mx-2" aria-hidden="true" />

              <Link to="/qui-sommes-nous" className="px-4 py-2 text-sm font-medium text-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all">
                {t('nav.aboutUs')}
              </Link>
              <Link to="/nos-partenaires" className="px-4 py-2 text-sm font-medium text-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all">
                {t('nav.partners')}
              </Link>
              <Link to="/avis-clients" className="px-4 py-2 text-sm font-medium text-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all">
                {t('nav.reviews')}
              </Link>
              <Link to="/blog" className="px-4 py-2 text-sm font-medium text-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all">
                {t('nav.blog')}
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} aria-hidden="true" />}
      
      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && <div id="mobile-menu" className="fixed top-[73px] left-0 right-0 bottom-0 bg-card z-50 overflow-y-auto lg:hidden animate-slide-in-left" role="dialog" aria-label="Menu de navigation mobile">
          <nav className="p-4 space-y-6" role="navigation" aria-label="Navigation mobile principale">
            {/* Language Toggle - Mobile */}
            <div className="flex justify-end mb-2">
              <LanguageToggle />
            </div>
            
            <div>
              <Link to="/comparateur-garanties" className="block px-4 py-3 mb-3 text-base font-semibold text-white bg-primary hover:bg-primary/90 rounded-lg transition-all text-center shadow-md" onClick={() => setIsMobileMenuOpen(false)}>
                {t('nav.comparator')}
              </Link>
            </div>

            <div>
              <h3 className="px-4 py-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">{t('nav.individuals')}</h3>
              <div className="space-y-1 mt-2">
                {assurancesParticuliers.map(({
              to,
              label,
              icon: Icon
            }) => <Link key={to} to={to} className="flex items-center gap-3 px-4 py-3 text-base font-medium text-foreground hover:bg-primary/5 hover:text-primary rounded-lg transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                    <Icon className="h-5 w-5 text-primary" />
                    {label}
                  </Link>)}
              </div>
            </div>

            <div>
              <h3 className="px-4 py-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">{t('nav.professionals')}</h3>
              <div className="space-y-1 mt-2">
                {assurancesPro.map(({
              to,
              label,
              icon: Icon
            }) => <Link key={to} to={to} className="flex items-center gap-3 px-4 py-3 text-base font-medium text-foreground hover:bg-primary/5 hover:text-primary rounded-lg transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                    <Icon className="h-5 w-5 text-primary" />
                    {label}
                  </Link>)}
              </div>
            </div>

            <div>
              <h3 className="px-4 py-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">{t('nav.lifeAndSavings')}</h3>
              <div className="space-y-1 mt-2">
                {assurancesVieEpargne.map(({
              to,
              label,
              icon: Icon
            }) => <Link key={to} to={to} className="flex items-center gap-3 px-4 py-3 text-base font-medium text-foreground hover:bg-primary/5 hover:text-primary rounded-lg transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                    <Icon className="h-5 w-5 text-primary" />
                    {label}
                  </Link>)}
              </div>
            </div>

            <div>
              <h3 className="px-4 py-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">{t('nav.realEstate')}</h3>
              <div className="space-y-1 mt-2">
                {assurancesImmobilier.map(({
              to,
              label,
              icon: Icon
            }) => <Link key={to} to={to} className="flex items-center gap-3 px-4 py-3 text-base font-medium text-foreground hover:bg-primary/5 hover:text-primary rounded-lg transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                    <Icon className="h-5 w-5 text-primary" />
                    {label}
                  </Link>)}
              </div>
            </div>

            <div className="border-t border-border pt-4">
              <div className="space-y-1">
                <Link to="/qui-sommes-nous" className="block px-4 py-3 text-base font-medium text-foreground hover:bg-muted hover:text-primary rounded-lg transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                  {t('nav.aboutUs')}
                </Link>
                <Link to="/nos-partenaires" className="block px-4 py-3 text-base font-medium text-foreground hover:bg-muted hover:text-primary rounded-lg transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                  {t('nav.partners')}
                </Link>
                <Link to="/avis-clients" className="block px-4 py-3 text-base font-medium text-foreground hover:bg-muted hover:text-primary rounded-lg transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                  {t('nav.reviews')}
                </Link>
                <Link to="/blog" className="block px-4 py-3 text-base font-medium text-foreground hover:bg-muted hover:text-primary rounded-lg transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                  {t('nav.blog')}
                </Link>
              </div>
            </div>
          </nav>
        </div>}
    </>;
};
export default Header;