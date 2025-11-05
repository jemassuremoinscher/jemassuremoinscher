import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Car, Heart, Home, CreditCard, Users, Shield, Menu, Bike, ChevronDown } from "lucide-react";
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
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        {/* Horizontal layout with logo and menu side by side */}
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-8">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
              <div className="p-1.5 rounded-lg bg-primary">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-xs font-semibold text-primary uppercase tracking-wide">Le Comparateur</span>
                <span className="text-lg font-black text-primary uppercase">Assurance</span>
              </div>
            </Link>
            
            {/* Desktop Navigation - Horizontal Menu next to logo */}
            <nav className="hidden xl:flex items-center gap-1">
              {navigationLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="px-3 py-2 text-sm font-semibold text-gray-700 hover:text-primary transition-colors duration-200 whitespace-nowrap"
                >
                  {link.label}
                </Link>
              ))}
              
              {/* More dropdown */}
              <div className="relative group">
                <button className="px-3 py-2 text-sm font-semibold text-gray-700 hover:text-primary transition-colors duration-200 flex items-center gap-1">
                  Plus d'assurances
                  <ChevronDown className="h-3 w-3" />
                </button>
                
                {/* Dropdown menu */}
                <div className="absolute left-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  {moreLinks.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-primary/5 hover:text-primary transition-colors first:rounded-t-lg last:rounded-b-lg"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            </nav>
          </div>

          {/* Right side - Prévoyance button */}
          <div className="hidden xl:block">
            <Button 
              variant="outline" 
              className="border-2 border-primary text-primary hover:bg-primary hover:text-white font-semibold"
              asChild
            >
              <Link to="/qui-sommes-nous">Prévoyance</Link>
            </Button>
          </div>

          {/* Mobile Navigation */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="xl:hidden hover:bg-primary/10">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Menu
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-2 mt-8">
                {navigationLinks.map((link) => (
                  <Button 
                    key={link.to}
                    variant="ghost" 
                    className="justify-start gap-3 h-12 text-base hover:bg-primary/5 hover:text-primary transition-all" 
                    asChild
                    onClick={() => setIsOpen(false)}
                  >
                    <Link to={link.to}>
                      <link.icon className="h-5 w-5" />
                      {link.label}
                    </Link>
                  </Button>
                ))}
                <div className="h-px bg-gray-200 my-2" />
                {moreLinks.map((link) => (
                  <Button 
                    key={link.to}
                    variant="ghost" 
                    className="justify-start h-10 text-sm hover:bg-primary/5 hover:text-primary transition-all" 
                    asChild
                    onClick={() => setIsOpen(false)}
                  >
                    <Link to={link.to}>
                      {link.label}
                    </Link>
                  </Button>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
