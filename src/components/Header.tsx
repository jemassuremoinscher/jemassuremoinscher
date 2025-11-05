import { Button } from "@/components/ui/button";
import { Car, Heart, Home, CreditCard, Users, Shield, Menu } from "lucide-react";
import { Link } from "react-router-dom";

const Header = () => {
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
          
          <nav className="hidden lg:flex items-center gap-2">
            <Button variant="ghost" className="gap-2 hover:bg-primary/5 hover:text-primary transition-all" asChild>
              <Link to="/assurance-auto">
                <Car className="h-4 w-4" />
                Assurance Auto
              </Link>
            </Button>
            <Button variant="ghost" className="gap-2 hover:bg-primary/5 hover:text-primary transition-all" asChild>
              <Link to="/assurance-sante">
                <Heart className="h-4 w-4" />
                Mutuelle Santé
              </Link>
            </Button>
            <Button variant="ghost" className="gap-2 hover:bg-primary/5 hover:text-primary transition-all" asChild>
              <Link to="/assurance-animaux">
                <Users className="h-4 w-4" />
                Assurance Animaux
              </Link>
            </Button>
            <Button variant="ghost" className="gap-2 hover:bg-primary/5 hover:text-primary transition-all" asChild>
              <Link to="/assurance-habitation">
                <Home className="h-4 w-4" />
                Assurance Habitation
              </Link>
            </Button>
            <Button variant="ghost" className="gap-2 hover:bg-primary/5 hover:text-primary transition-all" asChild>
              <Link to="/assurance-pret">
                <CreditCard className="h-4 w-4" />
                Assurance Prêt
              </Link>
            </Button>
          </nav>

          <Button variant="ghost" size="icon" className="lg:hidden hover:bg-primary/10">
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
