import { Button } from "@/components/ui/button";
import { Car, Heart, Home, CreditCard, Users, Shield, Menu } from "lucide-react";

const Header = () => {
  return (
    <header className="bg-card border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-primary">Le Comparateur Assurance</span>
          </div>
          
          <nav className="hidden lg:flex items-center gap-6">
            <Button variant="ghost" className="gap-2">
              <Car className="h-4 w-4" />
              Assurance Auto
            </Button>
            <Button variant="ghost" className="gap-2">
              <Heart className="h-4 w-4" />
              Mutuelle Santé
            </Button>
            <Button variant="ghost" className="gap-2">
              <Users className="h-4 w-4" />
              Assurance Animaux
            </Button>
            <Button variant="ghost" className="gap-2">
              <Home className="h-4 w-4" />
              Assurance Habitation
            </Button>
            <Button variant="ghost" className="gap-2">
              <CreditCard className="h-4 w-4" />
              Assurance Prêt
            </Button>
          </nav>

          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
