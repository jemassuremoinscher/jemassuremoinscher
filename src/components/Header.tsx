import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Car, Heart, Home, CreditCard, Users, Shield, Menu, Bike, X, ChevronDown, Briefcase, Building2, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navigationLinks = [
    { to: "/assurance-auto", label: "Assurance Auto", icon: Car },
    { to: "/assurance-sante", label: "Mutuelle Santé", icon: Heart },
    { to: "/assurance-moto", label: "Assurance Moto", icon: Bike },
    { to: "/assurance-habitation", label: "Assurance Habitation", icon: Home },
    { to: "/assurance-pret", label: "Assurance de prêt", icon: CreditCard },
    { to: "/assurance-animaux", label: "Assurance Animaux", icon: Users },
  ];

  const moreLinks = [
    { to: "/qui-sommes-nous", label: "Qui sommes-nous" },
    { to: "/nos-partenaires", label: "Nos partenaires" },
    { to: "/avis-clients", label: "Avis clients" },
    { to: "/blog", label: "Blog" },
  ];

  return (
    <>
      {/* Top Header Bar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="p-1.5 rounded-lg bg-primary">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-xs font-semibold text-primary uppercase tracking-wide">Le Comparateur</span>
                <span className="text-lg font-black text-primary uppercase">Assurance</span>
              </div>
            </Link>

            <div className="flex items-center gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="hidden lg:flex border-2 border-primary text-primary hover:bg-primary hover:text-white font-semibold gap-1"
                  >
                    Nos Assurances
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-2" align="end">
                  <div className="flex flex-col gap-1">
                    <Link
                      to="/assurance-auto"
                      className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-primary/5 hover:text-primary rounded-md transition-colors"
                    >
                      <Car className="h-4 w-4" />
                      Assurance Auto
                    </Link>
                    <Link
                      to="/assurance-sante"
                      className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-primary/5 hover:text-primary rounded-md transition-colors"
                    >
                      <Heart className="h-4 w-4" />
                      Mutuelle Santé
                    </Link>
                    <Link
                      to="/assurance-moto"
                      className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-primary/5 hover:text-primary rounded-md transition-colors"
                    >
                      <Bike className="h-4 w-4" />
                      Assurance Moto
                    </Link>
                    <Link
                      to="/assurance-habitation"
                      className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-primary/5 hover:text-primary rounded-md transition-colors"
                    >
                      <Home className="h-4 w-4" />
                      Assurance Habitation
                    </Link>
                    <Link
                      to="/assurance-pret"
                      className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-primary/5 hover:text-primary rounded-md transition-colors"
                    >
                      <CreditCard className="h-4 w-4" />
                      Assurance de prêt
                    </Link>
                    <Link
                      to="/assurance-animaux"
                      className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-primary/5 hover:text-primary rounded-md transition-colors"
                    >
                      <Users className="h-4 w-4" />
                      Assurance Animaux
                    </Link>
                  </div>
                </PopoverContent>
              </Popover>

              <Button 
                variant="outline" 
                size="sm"
                className="hidden lg:flex border-2 border-primary text-primary hover:bg-primary hover:text-white font-semibold"
                asChild
              >
                <Link to="/assurance-prevoyance">Prévoyance</Link>
              </Button>
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="hidden lg:flex border-2 border-primary text-primary hover:bg-primary hover:text-white font-semibold gap-1"
                  >
                    <Briefcase className="h-4 w-4" />
                    Assurance Pro
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56 p-2" align="end">
                  <div className="flex flex-col gap-1">
                    <Link
                      to="/assurance-mrp"
                      className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-primary/5 hover:text-primary rounded-md transition-colors"
                    >
                      <Building2 className="h-4 w-4" />
                      MRP
                    </Link>
                    <Link
                      to="/assurance-rc-pro"
                      className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-primary/5 hover:text-primary rounded-md transition-colors"
                    >
                      <ShieldCheck className="h-4 w-4" />
                      RC Pro
                    </Link>
                  </div>
                </PopoverContent>
              </Popover>
              
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setIsOpen(!isOpen)}
                className="hover:bg-primary/10"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Vertical Sidebar Menu */}
      <div className={`fixed top-[73px] left-0 h-[calc(100vh-73px)] w-80 bg-white border-r border-gray-200 shadow-2xl z-40 ${isOpen ? 'animate-slide-in-left' : 'animate-slide-out-left pointer-events-none'}`}>
        <nav className="flex flex-col h-full overflow-y-auto">
          {/* Main Insurance Links */}
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 px-3">Nos Assurances</h3>
            <div className="space-y-1">
              {navigationLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-primary/5 hover:text-primary rounded-lg transition-colors duration-200 group"
                >
                  <div className="p-2 rounded-lg bg-gray-100 group-hover:bg-primary/10 transition-colors">
                    <link.icon className="h-5 w-5" />
                  </div>
                  <span className="font-medium">{link.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Prevoyance */}
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 px-3">Prévoyance</h3>
            <Link
              to="/assurance-prevoyance"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-primary/5 hover:text-primary rounded-lg transition-colors duration-200 group"
            >
              <div className="p-2 rounded-lg bg-gray-100 group-hover:bg-primary/10 transition-colors">
                <Shield className="h-5 w-5" />
              </div>
              <span className="font-medium">Assurance Prévoyance</span>
            </Link>
          </div>

          {/* Professional Insurance */}
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 px-3">Assurance Pro</h3>
            <div className="space-y-1">
              <Link
                to="/assurance-mrp"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-primary/5 hover:text-primary rounded-lg transition-colors duration-200 group"
              >
                <div className="p-2 rounded-lg bg-gray-100 group-hover:bg-primary/10 transition-colors">
                  <Building2 className="h-5 w-5" />
                </div>
                <span className="font-medium">MRP</span>
              </Link>
              <Link
                to="/assurance-rc-pro"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-primary/5 hover:text-primary rounded-lg transition-colors duration-200 group"
              >
                <div className="p-2 rounded-lg bg-gray-100 group-hover:bg-primary/10 transition-colors">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <span className="font-medium">RC Pro</span>
              </Link>
            </div>
          </div>

          {/* Additional Links */}
          <div className="p-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 px-3">Plus d'informations</h3>
            <div className="space-y-1">
              {moreLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 text-gray-700 hover:bg-primary/5 hover:text-primary rounded-lg transition-colors duration-200 font-medium"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="mt-auto p-4 border-t border-gray-200">
            <Button 
              className="w-full bg-primary hover:bg-primary/90 text-white font-semibold"
              asChild
            >
              <Link to="/assurance-auto" onClick={() => setIsOpen(false)}>
                Comparer maintenant
              </Link>
            </Button>
          </div>
        </nav>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-30 top-[73px]"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Header;
