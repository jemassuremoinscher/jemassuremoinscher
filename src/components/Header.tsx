import { ChevronDown, Menu, X, Car, Bike, Home, Heart, PiggyBank, Users, Building2, FileText } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle";
import arthurThumbsUp from "@/assets/mascotte/arthur-thumbs-up.png";
import { cn } from "@/lib/utils";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openPopover, setOpenPopover] = useState<string | null>(null);
  const location = useLocation();
  const { trackEvent } = useAnalytics();
  const { t } = useLanguage();

  const handleInsuranceTypeClick = (type: string, category: string) => {
    trackEvent('insurance_type_click', {
      category: 'navigation',
      label: `${category}_${type}`,
      insurance_type: type
    });
  };

  const assurancesParticuliers = [
    { to: "/assurance-auto", label: t('insurance.auto'), icon: Car },
    { to: "/assurance-moto", label: t('insurance.moto'), icon: Bike },
    { to: "/assurance-habitation", label: t('insurance.home'), icon: Home },
    { to: "/assurance-sante", label: t('insurance.health'), icon: Heart },
    { to: "/assurance-animaux", label: t('insurance.pets'), icon: Heart },
  ];

  const assurancesPro = [
    { to: "/assurance-rc-pro", label: t('insurance.rcPro'), icon: Building2 },
    { to: "/assurance-mrp", label: t('insurance.mrp'), icon: Building2 },
  ];

  const assurancesVieEpargne = [
    { to: "/assurance-vie", label: t('insurance.life'), icon: PiggyBank },
    { to: "/assurance-pret", label: t('insurance.loan'), icon: FileText },
    { to: "/assurance-prevoyance", label: t('insurance.provident'), icon: Users },
  ];

  const assurancesImmobilier = [
    { to: "/assurance-gli", label: t('insurance.gli'), icon: Building2 },
    { to: "/assurance-pno", label: t('insurance.pno'), icon: Home },
    { to: "/gestion-locative", label: t('insurance.rentalManagement'), icon: Building2 },
  ];

  // Floating pill tab component
  const NavPill = ({ 
    to, 
    children, 
    isActive = false,
    onClick,
    className 
  }: { 
    to?: string; 
    children: React.ReactNode; 
    isActive?: boolean;
    onClick?: () => void;
    className?: string;
  }) => {
    const baseClasses = cn(
      "px-4 py-2.5 text-sm font-medium rounded-full transition-all duration-300",
      "backdrop-blur-md border border-white/20",
      "hover:scale-105 hover:-translate-y-0.5",
      "active:scale-95",
      "min-h-[44px] min-w-[44px] flex items-center justify-center gap-1.5",
      isActive 
        ? "bg-gradient-to-r from-primary to-primary/80 text-white shadow-lg shadow-primary/30 border-transparent" 
        : "bg-white/80 text-foreground hover:bg-white hover:shadow-lg hover:shadow-primary/10",
      className
    );

    if (to) {
      return (
        <Link to={to} className={baseClasses} onClick={onClick}>
          {children}
        </Link>
      );
    }

    return (
      <button type="button" className={baseClasses} onClick={onClick}>
        {children}
      </button>
    );
  };

  return (
    <>
      {/* Main Header - Frosted Glass */}
      <header 
        className="sticky top-0 z-50 volumetric-light" 
        role="banner"
      >
        {/* Glass Background Layer */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/95 to-white/80 backdrop-blur-xl border-b border-white/30" />
        
        <div className="relative container mx-auto px-4">
          <div className="flex items-center justify-center py-4 md:py-5">
            {/* Centered Logo with Mascot - Floating */}
            <Link 
              to="/" 
              className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 rounded-full px-4 py-2 -my-2 transition-all duration-300 hover:scale-105" 
              aria-label="Retour à la page d'accueil - jemassuremoinscher"
            >
              {/* Arthur Mascot with glow */}
              <div className="relative">
                <img 
                  src={arthurThumbsUp} 
                  alt="Arthur, la mascotte" 
                  className="h-10 w-10 sm:h-11 sm:w-11 md:h-12 md:w-12 object-contain drop-shadow-lg animate-float-gentle"
                />
                {/* Subtle glow behind mascot */}
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl scale-150 -z-10 group-hover:bg-primary/30 transition-colors" />
              </div>
              
              {/* Text Logo with neon effect */}
              <span className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight">
                <span className="text-primary neon-text">jemassure</span>
                <span className="text-secondary">moinscher.fr</span>
              </span>
            </Link>

            {/* Right side controls */}
            <div className="absolute right-4 flex items-center gap-2">
              {/* Language Toggle - Desktop - Pill style */}
              <div className="hidden lg:block">
                <LanguageToggle />
              </div>
              
              {/* Mobile Menu Button - Pill style */}
              <Button 
                variant="ghost" 
                size="icon" 
                className={cn(
                  "lg:hidden rounded-full",
                  "bg-white/80 backdrop-blur-md border border-white/30",
                  "hover:bg-white hover:shadow-lg hover:shadow-primary/10",
                  "transition-all duration-300"
                )}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
                aria-label={isMobileMenuOpen ? t('nav.closeMenu') : t('nav.openMenu')} 
                aria-expanded={isMobileMenuOpen} 
                aria-controls="mobile-menu"
              >
                {isMobileMenuOpen ? <X className="h-5 w-5 text-foreground" aria-hidden="true" /> : <Menu className="h-5 w-5 text-foreground" aria-hidden="true" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Desktop Navigation - Floating Pills */}
        <nav 
          className="hidden lg:block relative pb-4" 
          role="navigation" 
          aria-label="Navigation principale"
        >
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center gap-2 flex-wrap">
              {/* Main CTA Pill - Glowing */}
              <NavPill 
                to="/comparateur-garanties" 
                isActive={location.pathname === "/comparateur-garanties"}
                onClick={() => trackEvent('insurance_type_click', { category: 'navigation', label: 'comparateur_garanties_header' })}
                className="shadow-lg shadow-primary/20"
              >
                ✨ {t('nav.comparator')}
              </NavPill>

              {/* Separator - Soft glow line */}
              <div className="w-px h-6 bg-gradient-to-b from-transparent via-primary/20 to-transparent mx-1" />

              {/* Category Dropdowns as Pills */}
              <Popover open={openPopover === "particuliers"} onOpenChange={open => setOpenPopover(open ? "particuliers" : null)}>
                <PopoverTrigger asChild>
                  <NavPill className="cursor-pointer">
                    {t('nav.individuals')}
                    <ChevronDown className={cn("h-4 w-4 transition-transform", openPopover === "particuliers" && "rotate-180")} />
                  </NavPill>
                </PopoverTrigger>
                <PopoverContent 
                  className="w-64 p-3 glass-panel rounded-2xl border-white/30 shadow-xl" 
                  align="center"
                  sideOffset={8}
                >
                  <div className="space-y-1">
                    {assurancesParticuliers.map(({ to, label, icon: Icon }) => (
                      <Link 
                        key={to} 
                        to={to} 
                        className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-foreground hover:bg-primary/5 hover:text-primary rounded-xl transition-all hover:translate-x-1" 
                        onClick={() => {
                          setOpenPopover(null);
                          handleInsuranceTypeClick(label.toLowerCase(), 'particuliers');
                        }}
                      >
                        <div className="p-2 rounded-lg bg-primary/10">
                          <Icon className="h-4 w-4 text-primary" />
                        </div>
                        {label}
                      </Link>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>

              <Popover open={openPopover === "pro"} onOpenChange={open => setOpenPopover(open ? "pro" : null)}>
                <PopoverTrigger asChild>
                  <NavPill className="cursor-pointer">
                    {t('nav.professionals')}
                    <ChevronDown className={cn("h-4 w-4 transition-transform", openPopover === "pro" && "rotate-180")} />
                  </NavPill>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-3 glass-panel rounded-2xl border-white/30 shadow-xl" align="center" sideOffset={8}>
                  <div className="space-y-1">
                    {assurancesPro.map(({ to, label, icon: Icon }) => (
                      <Link 
                        key={to} 
                        to={to} 
                        className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-foreground hover:bg-primary/5 hover:text-primary rounded-xl transition-all hover:translate-x-1" 
                        onClick={() => {
                          setOpenPopover(null);
                          handleInsuranceTypeClick(label.toLowerCase(), 'professionnels');
                        }}
                      >
                        <div className="p-2 rounded-lg bg-primary/10">
                          <Icon className="h-4 w-4 text-primary" />
                        </div>
                        {label}
                      </Link>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>

              <Popover open={openPopover === "epargne"} onOpenChange={open => setOpenPopover(open ? "epargne" : null)}>
                <PopoverTrigger asChild>
                  <NavPill className="cursor-pointer">
                    {t('nav.lifeAndSavings')}
                    <ChevronDown className={cn("h-4 w-4 transition-transform", openPopover === "epargne" && "rotate-180")} />
                  </NavPill>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-3 glass-panel rounded-2xl border-white/30 shadow-xl" align="center" sideOffset={8}>
                  <div className="space-y-1">
                    {assurancesVieEpargne.map(({ to, label, icon: Icon }) => (
                      <Link 
                        key={to} 
                        to={to} 
                        className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-foreground hover:bg-primary/5 hover:text-primary rounded-xl transition-all hover:translate-x-1" 
                        onClick={() => {
                          setOpenPopover(null);
                          handleInsuranceTypeClick(label.toLowerCase(), 'vie_epargne');
                        }}
                      >
                        <div className="p-2 rounded-lg bg-primary/10">
                          <Icon className="h-4 w-4 text-primary" />
                        </div>
                        {label}
                      </Link>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>

              <Popover open={openPopover === "immobilier"} onOpenChange={open => setOpenPopover(open ? "immobilier" : null)}>
                <PopoverTrigger asChild>
                  <NavPill className="cursor-pointer">
                    {t('nav.realEstate')}
                    <ChevronDown className={cn("h-4 w-4 transition-transform", openPopover === "immobilier" && "rotate-180")} />
                  </NavPill>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-3 glass-panel rounded-2xl border-white/30 shadow-xl" align="center" sideOffset={8}>
                  <div className="space-y-1">
                    {assurancesImmobilier.map(({ to, label, icon: Icon }) => (
                      <Link 
                        key={to} 
                        to={to} 
                        className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-foreground hover:bg-primary/5 hover:text-primary rounded-xl transition-all hover:translate-x-1" 
                        onClick={() => {
                          setOpenPopover(null);
                          handleInsuranceTypeClick(label.toLowerCase(), 'immobilier');
                        }}
                      >
                        <div className="p-2 rounded-lg bg-primary/10">
                          <Icon className="h-4 w-4 text-primary" />
                        </div>
                        {label}
                      </Link>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>

              {/* Separator */}
              <div className="w-px h-6 bg-gradient-to-b from-transparent via-primary/20 to-transparent mx-1" />

              {/* Secondary Links as subtle pills */}
              <NavPill to="/qui-sommes-nous" isActive={location.pathname === "/qui-sommes-nous"}>
                {t('nav.aboutUs')}
              </NavPill>
              <NavPill to="/nos-partenaires" isActive={location.pathname === "/nos-partenaires"}>
                {t('nav.partners')}
              </NavPill>
              <NavPill to="/avis-clients" isActive={location.pathname === "/avis-clients"}>
                {t('nav.reviews')}
              </NavPill>
              <NavPill to="/blog" isActive={location.pathname === "/blog"}>
                {t('nav.blog')}
              </NavPill>
            </div>
          </div>
        </nav>
      </header>

      {/* Overlay for mobile menu - Frosted glass */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-white/60 backdrop-blur-lg z-40 lg:hidden" 
          onClick={() => setIsMobileMenuOpen(false)} 
          aria-hidden="true" 
        />
      )}
      
      {/* Mobile Menu Drawer - Glass panel */}
      {isMobileMenuOpen && (
        <div 
          id="mobile-menu" 
          className="fixed top-[80px] left-4 right-4 bottom-4 z-50 overflow-hidden lg:hidden animate-scale-in"
          role="dialog" 
          aria-label="Menu de navigation mobile"
        >
          <div className="h-full glass-panel rounded-3xl shadow-2xl overflow-y-auto">
            <nav className="p-6 space-y-6" role="navigation" aria-label="Navigation mobile principale">
              {/* Language Toggle - Mobile */}
              <div className="flex justify-end">
                <LanguageToggle />
              </div>
              
              {/* Main CTA */}
              <Link 
                to="/comparateur-garanties" 
                className="block px-6 py-4 text-base font-semibold text-white bg-gradient-to-r from-primary to-primary/80 rounded-2xl transition-all text-center shadow-lg shadow-primary/30 hover:scale-[1.02] active:scale-95" 
                onClick={() => setIsMobileMenuOpen(false)}
              >
                ✨ {t('nav.comparator')}
              </Link>

              {/* Categories */}
              <div className="space-y-4">
                <div>
                  <h3 className="px-2 py-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">{t('nav.individuals')}</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {assurancesParticuliers.map(({ to, label, icon: Icon }) => (
                      <Link 
                        key={to} 
                        to={to} 
                        className="flex items-center gap-2 px-4 py-3 text-sm font-medium bg-white/60 hover:bg-white rounded-full transition-all border border-white/30 hover:shadow-md active:scale-95" 
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Icon className="h-4 w-4 text-primary" />
                        {label}
                      </Link>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="px-2 py-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">{t('nav.professionals')}</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {assurancesPro.map(({ to, label, icon: Icon }) => (
                      <Link 
                        key={to} 
                        to={to} 
                        className="flex items-center gap-2 px-4 py-3 text-sm font-medium bg-white/60 hover:bg-white rounded-full transition-all border border-white/30 hover:shadow-md active:scale-95" 
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Icon className="h-4 w-4 text-primary" />
                        {label}
                      </Link>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="px-2 py-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">{t('nav.lifeAndSavings')}</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {assurancesVieEpargne.map(({ to, label, icon: Icon }) => (
                      <Link 
                        key={to} 
                        to={to} 
                        className="flex items-center gap-2 px-4 py-3 text-sm font-medium bg-white/60 hover:bg-white rounded-full transition-all border border-white/30 hover:shadow-md active:scale-95" 
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Icon className="h-4 w-4 text-primary" />
                        {label}
                      </Link>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="px-2 py-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">{t('nav.realEstate')}</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {assurancesImmobilier.map(({ to, label, icon: Icon }) => (
                      <Link 
                        key={to} 
                        to={to} 
                        className="flex items-center gap-2 px-4 py-3 text-sm font-medium bg-white/60 hover:bg-white rounded-full transition-all border border-white/30 hover:shadow-md active:scale-95" 
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Icon className="h-4 w-4 text-primary" />
                        {label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Secondary links */}
              <div className="border-t border-white/30 pt-4">
                <div className="flex flex-wrap gap-2">
                  <Link to="/qui-sommes-nous" className="px-4 py-3 text-sm font-medium bg-white/40 hover:bg-white rounded-full transition-all border border-white/20" onClick={() => setIsMobileMenuOpen(false)}>
                    {t('nav.aboutUs')}
                  </Link>
                  <Link to="/nos-partenaires" className="px-4 py-3 text-sm font-medium bg-white/40 hover:bg-white rounded-full transition-all border border-white/20" onClick={() => setIsMobileMenuOpen(false)}>
                    {t('nav.partners')}
                  </Link>
                  <Link to="/avis-clients" className="px-4 py-3 text-sm font-medium bg-white/40 hover:bg-white rounded-full transition-all border border-white/20" onClick={() => setIsMobileMenuOpen(false)}>
                    {t('nav.reviews')}
                  </Link>
                  <Link to="/blog" className="px-4 py-3 text-sm font-medium bg-white/40 hover:bg-white rounded-full transition-all border border-white/20" onClick={() => setIsMobileMenuOpen(false)}>
                    {t('nav.blog')}
                  </Link>
                </div>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
