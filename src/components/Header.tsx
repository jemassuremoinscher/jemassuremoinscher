import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Car, Heart, Home, CreditCard, Users, Shield, Menu, Bike, ChevronDown } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const navigationLinks = [
    { 
      to: "/assurance-auto", 
      icon: Car, 
      label: "Assurance Auto",
      description: "Comparez les meilleures offres auto"
    },
    { 
      to: "/assurance-sante", 
      icon: Heart, 
      label: "Mutuelle Santé",
      description: "Trouvez votre mutuelle santé idéale"
    },
    { 
      to: "/assurance-moto", 
      icon: Bike, 
      label: "Assurance Moto",
      description: "Protégez votre deux-roues"
    },
    { 
      to: "/assurance-animaux", 
      icon: Users, 
      label: "Assurance Animaux",
      description: "Prenez soin de vos compagnons"
    },
    { 
      to: "/assurance-habitation", 
      icon: Home, 
      label: "Assurance Habitation",
      description: "Assurez votre logement"
    },
    { 
      to: "/assurance-pret", 
      icon: CreditCard, 
      label: "Assurance Prêt",
      description: "Protégez votre emprunt immobilier"
    },
  ];

  return (
    <header className="bg-card/95 backdrop-blur-md border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-primary/80 group-hover:shadow-lg transition-all duration-300 group-hover:scale-105">
              <Shield className="h-7 w-7 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              Le Comparateur Assurance
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2 hover:bg-primary/5 hover:text-primary transition-all">
                  Nos Comparateurs
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 bg-card/95 backdrop-blur-md">
                {navigationLinks.map((link, index) => (
                  <div key={link.to}>
                    {index > 0 && <DropdownMenuSeparator />}
                    <DropdownMenuItem 
                      className="p-4 cursor-pointer focus:bg-primary/5 focus:text-primary"
                      onClick={() => navigate(link.to)}
                    >
                      <div className="flex gap-3 items-start w-full">
                        <div className="p-2 rounded-lg bg-primary/10 mt-0.5">
                          <link.icon className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-card-foreground">{link.label}</div>
                          <div className="text-sm text-muted-foreground mt-0.5">{link.description}</div>
                        </div>
                      </div>
                    </DropdownMenuItem>
                  </div>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="ghost" asChild>
              <Link to="/qui-sommes-nous">Qui sommes-nous</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/nos-partenaires">Nos partenaires</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/avis-clients">Avis clients</Link>
            </Button>
          </nav>

          {/* Mobile Navigation */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden hover:bg-primary/10">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Navigation
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-3 mt-8">
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
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
