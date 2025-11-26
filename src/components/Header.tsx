import { Shield, ChevronDown, Menu, X, Car, Bike, Home, Heart, PiggyBank, Users, Building2, FileText, HomeIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAnalytics } from "@/hooks/useAnalytics";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openPopover, setOpenPopover] = useState<string | null>(null);
  const { trackEvent } = useAnalytics();

  const handleInsuranceTypeClick = (type: string, category: string) => {
    trackEvent('insurance_type_click', {
      category: 'navigation',
      label: `${category}_${type}`,
      insurance_type: type,
    });
  };

  const assurancesParticuliers = [
    { to: "/assurance-auto", label: "Auto", icon: Car },
    { to: "/assurance-moto", label: "Moto", icon: Bike },
    { to: "/assurance-habitation", label: "Habitation", icon: Home },
    { to: "/assurance-sante", label: "Santé", icon: Heart },
    { to: "/assurance-animaux", label: "Animaux", icon: Heart },
  ];

  const assurancesPro = [
    { to: "/assurance-rc-pro", label: "RC Pro", icon: Building2 },
    { to: "/assurance-mrp", label: "MRP", icon: Building2 },
  ];

  const assurancesVieEpargne = [
    { to: "/assurance-vie", label: "Assurance Vie", icon: PiggyBank },
    { to: "/assurance-pret", label: "Assurance de Prêt", icon: FileText },
    { to: "/assurance-prevoyance", label: "Prévoyance", icon: Users },
  ];

  const assurancesImmobilier = [
    { to: "/assurance-gli", label: "Garantie Loyer Impayée", icon: Shield },
    { to: "/assurance-pno", label: "PNO", icon: Home },
    { to: "/gestion-locative", label: "Gestion Locative", icon: Building2 },
  ];

  return (
    <>
      <header className="bg-card border-b border-border sticky top-0 z-50 shadow-sm" role="banner">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <Link 
              to="/" 
              className="flex items-center gap-2 group focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg"
              aria-label="Retour à la page d'accueil - jemassuremoinscher"
            >
              <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-primary/80 shadow-md">
                <Shield className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-xs font-semibold text-primary uppercase tracking-wide">Le Comparateur</span>
                <span className="text-xl font-black text-primary uppercase">Assurance</span>
              </div>
            </Link>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden focus:ring-2 focus:ring-primary focus:ring-offset-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
            </Button>
          </div>
        </div>

        {/* Desktop Navigation Menu */}
        <nav className="hidden lg:block bg-gradient-to-r from-muted to-muted/50 border-t border-border" role="navigation" aria-label="Navigation principale">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center gap-2 py-3">
              <Link
                to="/comparateur-garanties"
                className="px-4 py-2 text-sm font-semibold text-white bg-primary hover:bg-primary/90 rounded-lg shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                onClick={() => {
                  trackEvent('insurance_type_click', {
                    category: 'navigation',
                    label: 'comparateur_garanties_header',
                  });
                }}
              >
                Comparateur Garanties
              </Link>

              <Popover open={openPopover === "particuliers"} onOpenChange={(open) => setOpenPopover(open ? "particuliers" : null)}>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    className="px-4 py-2 text-sm font-medium text-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all flex items-center gap-1"
                  >
                    Particuliers
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-2 bg-card shadow-lg border border-border" align="start">
                  <div className="space-y-1">
                    {assurancesParticuliers.map(({ to, label, icon: Icon }) => (
                      <Link
                        key={to}
                        to={to}
                        className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-foreground hover:bg-primary/5 hover:text-primary rounded-md transition-colors"
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

              <Popover open={openPopover === "pro"} onOpenChange={(open) => setOpenPopover(open ? "pro" : null)}>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    className="px-4 py-2 text-sm font-medium text-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all flex items-center gap-1"
                  >
                    Professionnels
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-2 bg-card shadow-lg border border-border" align="start">
                  <div className="space-y-1">
                    {assurancesPro.map(({ to, label, icon: Icon }) => (
                      <Link
                        key={to}
                        to={to}
                        className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-foreground hover:bg-primary/5 hover:text-primary rounded-md transition-colors"
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

              <Popover open={openPopover === "epargne"} onOpenChange={(open) => setOpenPopover(open ? "epargne" : null)}>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    className="px-4 py-2 text-sm font-medium text-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all flex items-center gap-1"
                  >
                    Vie & Épargne
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-2 bg-card shadow-lg border border-border" align="start">
                  <div className="space-y-1">
                    {assurancesVieEpargne.map(({ to, label, icon: Icon }) => (
                      <Link
                        key={to}
                        to={to}
                        className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-foreground hover:bg-primary/5 hover:text-primary rounded-md transition-colors"
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

              <Popover open={openPopover === "immobilier"} onOpenChange={(open) => setOpenPopover(open ? "immobilier" : null)}>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    className="px-4 py-2 text-sm font-medium text-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all flex items-center gap-1"
                  >
                    Immobilier
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-2 bg-card shadow-lg border border-border" align="start">
                  <div className="space-y-1">
                    {assurancesImmobilier.map(({ to, label, icon: Icon }) => (
                      <Link
                        key={to}
                        to={to}
                        className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-foreground hover:bg-primary/5 hover:text-primary rounded-md transition-colors"
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

              <div className="h-6 w-px bg-border mx-2" aria-hidden="true" />

              <Link
                to="/qui-sommes-nous"
                className="px-4 py-2 text-sm font-medium text-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
              >
                Qui sommes-nous ?
              </Link>
              <Link
                to="/nos-partenaires"
                className="px-4 py-2 text-sm font-medium text-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
              >
                Nos Partenaires
              </Link>
              <Link
                to="/avis-clients"
                className="px-4 py-2 text-sm font-medium text-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
              >
                Avis Clients
              </Link>
              <Link
                to="/blog"
                className="px-4 py-2 text-sm font-medium text-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
              >
                Blog
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}
      
      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div 
          id="mobile-menu"
          className="fixed top-[73px] left-0 right-0 bottom-0 bg-card z-50 overflow-y-auto lg:hidden animate-slide-in-left"
          role="dialog"
          aria-label="Menu de navigation mobile"
        >
          <nav className="p-4 space-y-6" role="navigation" aria-label="Navigation mobile principale">
            <div>
              <Link
                to="/comparateur-garanties"
                className="block px-4 py-3 mb-3 text-base font-semibold text-white bg-primary hover:bg-primary/90 rounded-lg transition-all text-center shadow-md"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Comparateur Garanties
              </Link>
            </div>

            <div>
              <h3 className="px-4 py-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">Particuliers</h3>
              <div className="space-y-1 mt-2">
                {assurancesParticuliers.map(({ to, label, icon: Icon }) => (
                  <Link
                    key={to}
                    to={to}
                    className="flex items-center gap-3 px-4 py-3 text-base font-medium text-foreground hover:bg-primary/5 hover:text-primary rounded-lg transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className="h-5 w-5 text-primary" />
                    {label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h3 className="px-4 py-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">Professionnels</h3>
              <div className="space-y-1 mt-2">
                {assurancesPro.map(({ to, label, icon: Icon }) => (
                  <Link
                    key={to}
                    to={to}
                    className="flex items-center gap-3 px-4 py-3 text-base font-medium text-foreground hover:bg-primary/5 hover:text-primary rounded-lg transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className="h-5 w-5 text-primary" />
                    {label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h3 className="px-4 py-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">Vie & Épargne</h3>
              <div className="space-y-1 mt-2">
                {assurancesVieEpargne.map(({ to, label, icon: Icon }) => (
                  <Link
                    key={to}
                    to={to}
                    className="flex items-center gap-3 px-4 py-3 text-base font-medium text-foreground hover:bg-primary/5 hover:text-primary rounded-lg transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className="h-5 w-5 text-primary" />
                    {label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h3 className="px-4 py-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">Immobilier</h3>
              <div className="space-y-1 mt-2">
                {assurancesImmobilier.map(({ to, label, icon: Icon }) => (
                  <Link
                    key={to}
                    to={to}
                    className="flex items-center gap-3 px-4 py-3 text-base font-medium text-foreground hover:bg-primary/5 hover:text-primary rounded-lg transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className="h-5 w-5 text-primary" />
                    {label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="border-t border-border pt-4">
              <div className="space-y-1">
                <Link
                  to="/qui-sommes-nous"
                  className="block px-4 py-3 text-base font-medium text-foreground hover:bg-muted hover:text-primary rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Qui sommes-nous ?
                </Link>
                <Link
                  to="/nos-partenaires"
                  className="block px-4 py-3 text-base font-medium text-foreground hover:bg-muted hover:text-primary rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Nos Partenaires
                </Link>
                <Link
                  to="/avis-clients"
                  className="block px-4 py-3 text-base font-medium text-foreground hover:bg-muted hover:text-primary rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Avis Clients
                </Link>
                <Link
                  to="/blog"
                  className="block px-4 py-3 text-base font-medium text-foreground hover:bg-muted hover:text-primary rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Blog
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
