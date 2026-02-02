import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import logoNew from "@/assets/logo-new.png";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { label: "Nos Assurances", id: "assurances" },
    { label: "Pourquoi nous ?", id: "pourquoi-nous" },
    { label: "Contact", id: "contact" },
  ];

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? "bg-white/95 backdrop-blur-md shadow-md" 
            : "bg-white"
        }`} 
        role="banner"
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="flex items-center focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg" 
              aria-label="Retour en haut - jemassuremoinscher"
            >
              <img 
                alt="jemassuremoinscher.fr" 
                className="h-10 md:h-12 w-auto object-contain" 
                src={logoNew} 
              />
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8" role="navigation" aria-label="Navigation principale">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                >
                  {link.label}
                </button>
              ))}
              
              <Button 
                onClick={() => scrollToSection("devis")}
                className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold px-6 py-2 shadow-gold btn-press"
              >
                Devis Rapide
              </Button>
            </nav>

            {/* Mobile Menu Button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden focus:ring-2 focus:ring-primary focus:ring-offset-2" 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
              aria-label={isMobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"} 
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </header>

      {/* Spacer for fixed header */}
      <div className="h-16 md:h-20" />

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm" 
          onClick={() => setIsMobileMenuOpen(false)} 
        />
      )}
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div 
          className="fixed top-16 left-0 right-0 bg-white z-50 lg:hidden shadow-lg animate-slide-in-left"
          role="dialog" 
          aria-label="Menu de navigation mobile"
        >
          <nav className="p-6 space-y-4" role="navigation">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className="block w-full text-left px-4 py-3 text-lg font-medium text-foreground hover:bg-muted hover:text-primary rounded-lg transition-colors"
              >
                {link.label}
              </button>
            ))}
            
            <Button 
              onClick={() => scrollToSection("devis")}
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold py-3 shadow-gold btn-press"
            >
              Devis Rapide
            </Button>
          </nav>
        </div>
      )}
    </>
  );
};

export default Header;