import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Car, Heart, Home, CreditCard, Users, Shield, Bike, ChevronDown, Briefcase, Building2, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

const Header = () => {
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
            </div>
          </div>
        </div>
      </header>
  );
};

export default Header;
