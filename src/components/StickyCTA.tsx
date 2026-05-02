import { useState, useEffect, useCallback } from "react";
import { Calculator } from "lucide-react";
import { useLocation } from "react-router-dom";

const EXCLUDED_ROUTES = ["/admin", "/auth", "/commercial", "/merci"];
const COOKIE_CONSENT_KEY = 'cookie-consent';

const StickyCTA = () => {
  const [cookieBannerVisible, setCookieBannerVisible] = useState(() => {
    try { return !localStorage.getItem(COOKIE_CONSENT_KEY); } catch { return true; }
  });
  const [isVisible, setIsVisible] = useState(false);
  const location = useLocation();

  const isExcluded = EXCLUDED_ROUTES.some(r => location.pathname.startsWith(r));

  useEffect(() => {
    if (isExcluded) return;
    const handleScroll = () => {
      setIsVisible(window.scrollY > window.innerHeight * 0.15);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isExcluded]);

  // Listen for cookie consent changes to hide/show CTA
  useEffect(() => {
    const checkCookieConsent = () => {
      try { setCookieBannerVisible(!localStorage.getItem(COOKIE_CONSENT_KEY)); } catch { /* noop */ }
    };
    window.addEventListener('storage', checkCookieConsent);
    const interval = setInterval(checkCookieConsent, 1000);
    return () => { window.removeEventListener('storage', checkCookieConsent); clearInterval(interval); };
  }, []);

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const form = document.getElementById("quote-form");
    if (form) {
      form.scrollIntoView({ behavior: "smooth", block: "center" });
    } else {
      window.location.href = "/comparateur";
    }
  }, []);

  if (isExcluded || !isVisible || cookieBannerVisible) return null;

  return (
    <button
      onClick={handleClick}
      className="fixed left-4 bottom-24 lg:bottom-6 z-40 flex items-center gap-2 py-2.5 px-4 rounded-full font-bold text-sm text-secondary-foreground bg-gradient-to-r from-[hsl(43_80%_65%)] to-[hsl(38_75%_58%)] shadow-lg hover:shadow-xl active:scale-95 transition-all duration-200 animate-fade-in"
      aria-label="Voir mon prix"
    >
      <Calculator className="w-4 h-4" aria-hidden="true" />
      <span>Prix direct</span>
    </button>
  );
};

export default StickyCTA;
