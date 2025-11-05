import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Car, Heart, Home, CreditCard, Users, Shield, Menu, Bike, X } from "lucide-react";
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

            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                className="hidden md:flex border-2 border-primary text-primary hover:bg-primary hover:text-white font-semibold"
                asChild
              >
                <Link to="/assurance-prevoyance">Prévoyance</Link>
              </Button>
              
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
      <div className={`fixed top-[73px] right-0 h-[calc(100vh-73px)] w-80 bg-white border-l border-gray-200 shadow-2xl transform transition-transform duration-300 ease-in-out z-40 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
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
              className="w-full bg-primary hover:bg-primary/90 text-white font-semibold mb-2"
              asChild
            >
              <Link to="/assurance-prevoyance" onClick={() => setIsOpen(false)}>
                Prévoyance
              </Link>
            </Button>
            <Button 
              variant="outline"
              className="w-full border-2 border-primary text-primary hover:bg-primary hover:text-white font-semibold"
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
