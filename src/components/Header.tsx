import { Shield, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
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
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="bg-gray-50 border-t border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-8 py-3 overflow-x-auto">
            <Link
              to="/assurance-auto"
              className="text-sm font-medium text-gray-700 hover:text-primary whitespace-nowrap transition-colors"
            >
              Assurance Auto
            </Link>
            <Link
              to="/assurance-sante"
              className="text-sm font-medium text-gray-700 hover:text-primary whitespace-nowrap transition-colors"
            >
              Mutuelle Santé
            </Link>
            <Link
              to="/assurance-moto"
              className="text-sm font-medium text-gray-700 hover:text-primary whitespace-nowrap transition-colors"
            >
              Assurance Moto
            </Link>
            <Link
              to="/assurance-habitation"
              className="text-sm font-medium text-gray-700 hover:text-primary whitespace-nowrap transition-colors"
            >
              Assurance Habitation
            </Link>
            <Link
              to="/assurance-pret"
              className="text-sm font-medium text-gray-700 hover:text-primary whitespace-nowrap transition-colors"
            >
              Assurance de prêt
            </Link>
            <Link
              to="/assurance-prevoyance"
              className="text-sm font-medium text-gray-700 hover:text-primary whitespace-nowrap transition-colors"
            >
              Prévoyance
            </Link>
            <Link
              to="/assurance-animaux"
              className="text-sm font-medium text-gray-700 hover:text-primary whitespace-nowrap transition-colors"
            >
              Assurance Animaux
            </Link>
            <Link
              to="/assurance-vie"
              className="text-sm font-medium text-gray-700 hover:text-primary whitespace-nowrap transition-colors"
            >
              Assurance vie
            </Link>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  className="text-sm font-medium text-gray-700 hover:text-primary hover:bg-transparent whitespace-nowrap h-auto p-0 flex items-center gap-1"
                >
                  Plus d'assurances
                  <ChevronDown className="h-3.5 w-3.5" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-2 bg-white z-[100]" align="start">
                <div className="flex flex-col gap-1">
                  <Link
                    to="/assurance-mrp"
                    className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary rounded-md transition-colors"
                  >
                    MRP
                  </Link>
                  <Link
                    to="/assurance-rc-pro"
                    className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary rounded-md transition-colors"
                  >
                    RC Pro
                  </Link>
                  <Link
                    to="/qui-sommes-nous"
                    className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary rounded-md transition-colors"
                  >
                    Qui sommes-nous
                  </Link>
                  <Link
                    to="/nos-partenaires"
                    className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary rounded-md transition-colors"
                  >
                    Nos partenaires
                  </Link>
                  <Link
                    to="/avis-clients"
                    className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary rounded-md transition-colors"
                  >
                    Avis clients
                  </Link>
                  <Link
                    to="/blog"
                    className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary rounded-md transition-colors"
                  >
                    Blog
                  </Link>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
