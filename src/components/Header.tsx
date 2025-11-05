import { Shield, ChevronDown, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm" role="banner">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <Link 
              to="/" 
              className="flex items-center gap-2 group focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg"
              aria-label="Retour à la page d'accueil - Le Comparateur Assurance"
            >
              <div className="p-1.5 rounded-lg bg-primary">
                <Shield className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-xs font-semibold text-primary uppercase tracking-wide">Le Comparateur</span>
                <span className="text-lg font-black text-primary uppercase">Assurance</span>
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
        <nav className="hidden lg:block bg-gray-50 border-t border-gray-200" role="navigation" aria-label="Navigation principale">
          <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-8 py-3 overflow-x-auto">
            <Link
              to="/assurance-auto"
              className="text-sm font-medium text-gray-700 hover:text-primary whitespace-nowrap transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded px-2 py-1"
            >
              Assurance Auto
            </Link>
            <Link
              to="/assurance-sante"
              className="text-sm font-medium text-gray-700 hover:text-primary whitespace-nowrap transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded px-2 py-1"
            >
              Mutuelle Santé
            </Link>
            <Link
              to="/assurance-moto"
              className="text-sm font-medium text-gray-700 hover:text-primary whitespace-nowrap transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded px-2 py-1"
            >
              Assurance Moto
            </Link>
            <Link
              to="/assurance-habitation"
              className="text-sm font-medium text-gray-700 hover:text-primary whitespace-nowrap transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded px-2 py-1"
            >
              Assurance Habitation
            </Link>
            <Link
              to="/assurance-pret"
              className="text-sm font-medium text-gray-700 hover:text-primary whitespace-nowrap transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded px-2 py-1"
            >
              Assurance de prêt
            </Link>
            <Link
              to="/assurance-prevoyance"
              className="text-sm font-medium text-gray-700 hover:text-primary whitespace-nowrap transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded px-2 py-1"
            >
              Prévoyance
            </Link>
            <Link
              to="/assurance-animaux"
              className="text-sm font-medium text-gray-700 hover:text-primary whitespace-nowrap transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded px-2 py-1"
            >
              Assurance Animaux
            </Link>
            <Link
              to="/assurance-vie"
              className="text-sm font-medium text-gray-700 hover:text-primary whitespace-nowrap transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded px-2 py-1"
            >
              Assurance vie
            </Link>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  className="text-sm font-medium text-gray-700 hover:text-primary hover:bg-transparent whitespace-nowrap h-auto p-0 flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded px-2 py-1"
                  aria-label="Plus d'assurances - Ouvrir le menu déroulant"
                  aria-haspopup="true"
                >
                  Plus d'assurances
                  <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
                </Button>
              </PopoverTrigger>
              <PopoverContent 
                className="w-56 p-2 bg-white z-[100] border border-gray-200 shadow-lg" 
                align="start"
                role="menu"
                aria-label="Menu assurances professionnelles"
              >
                <div className="flex flex-col gap-1">
                  <Link
                    to="/assurance-mrp"
                    className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:bg-gray-50"
                    role="menuitem"
                  >
                    MRP
                  </Link>
                  <Link
                    to="/assurance-rc-pro"
                    className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:bg-gray-50"
                    role="menuitem"
                  >
                    RC Pro
                  </Link>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </nav>
    </header>

    {/* Mobile Menu */}
    {isMobileMenuOpen && (
      <>
        {/* Overlay */}
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
        
        {/* Mobile Menu Drawer */}
        <div 
          id="mobile-menu"
          className="fixed top-[73px] left-0 right-0 bottom-0 bg-white z-50 overflow-y-auto lg:hidden animate-slide-in-left"
          role="dialog"
          aria-label="Menu de navigation mobile"
        >
          <nav className="p-4" role="navigation" aria-label="Navigation mobile principale">
            <div className="space-y-1">
              <Link
                to="/assurance-auto"
                className="block px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary rounded-lg transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Assurance Auto
              </Link>
              <Link
                to="/assurance-sante"
                className="block px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary rounded-lg transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Mutuelle Santé
              </Link>
              <Link
                to="/assurance-moto"
                className="block px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary rounded-lg transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Assurance Moto
              </Link>
              <Link
                to="/assurance-habitation"
                className="block px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary rounded-lg transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Assurance Habitation
              </Link>
              <Link
                to="/assurance-pret"
                className="block px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary rounded-lg transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Assurance de prêt
              </Link>
              <Link
                to="/assurance-prevoyance"
                className="block px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary rounded-lg transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Prévoyance
              </Link>
              <Link
                to="/assurance-animaux"
                className="block px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary rounded-lg transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Assurance Animaux
              </Link>
              <Link
                to="/assurance-vie"
                className="block px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary rounded-lg transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Assurance vie
              </Link>

              {/* Section séparée pour les autres pages */}
              <div className="border-t border-gray-200 mt-4 pt-4">
                <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Assurances Pro
                </h3>
                <Link
                  to="/assurance-mrp"
                  className="block px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  MRP
                </Link>
                <Link
                  to="/assurance-rc-pro"
                  className="block px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  RC Pro
                </Link>
              </div>

              <div className="border-t border-gray-200 mt-4 pt-4">
                <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  À propos
                </h3>
                <Link
                  to="/qui-sommes-nous"
                  className="block px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Qui sommes-nous
                </Link>
                <Link
                  to="/nos-partenaires"
                  className="block px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Nos partenaires
                </Link>
                <Link
                  to="/avis-clients"
                  className="block px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Avis clients
                </Link>
                <Link
                  to="/blog"
                  className="block px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Blog
                </Link>
              </div>
            </div>
          </nav>
        </div>
      </>
    )}
  </>
);
};

export default Header;
