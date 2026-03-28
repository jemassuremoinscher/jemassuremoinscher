import { useState, useEffect, useCallback } from "react";
import { Calculator } from "lucide-react";
import { useLocation } from "react-router-dom";

const EXCLUDED_ROUTES = ["/admin", "/auth", "/commercial", "/merci"];

const StickyCTA = () => {
  const [isVisible, setIsVisible] = useState(false);
  const location = useLocation();

  const isExcluded = EXCLUDED_ROUTES.some(r => location.pathname.startsWith(r));

  useEffect(() => {
    if (isExcluded) return;
    const handleScroll = () => {
      setIsVisible(window.scrollY > window.innerHeight * 0.5);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isExcluded]);

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const form = document.getElementById("quote-form");
    if (form) {
      form.scrollIntoView({ behavior: "smooth", block: "center" });
    } else {
      window.location.href = "/comparateur";
    }
  }, []);

  if (isExcluded || !isVisible) return null;

  return (
    <button
      onClick={handleClick}
      className="fixed left-4 bottom-6 z-50 flex md:hidden items-center gap-2 py-2.5 px-4 rounded-full font-bold text-sm text-secondary-foreground bg-gradient-to-r from-[hsl(43_80%_65%)] to-[hsl(38_75%_58%)] shadow-lg hover:shadow-xl active:scale-95 transition-all duration-200 animate-fade-in"
      aria-label="Voir mon prix"
    >
      <Calculator className="w-4 h-4" aria-hidden="true" />
      <span>Prix direct</span>
    </button>
  );
};

export default StickyCTA;
