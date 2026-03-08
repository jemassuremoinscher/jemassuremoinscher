import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

const FloatingCTA = () => {
  const [isVisible, setIsVisible] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (isMobile) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -100, opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="fixed left-6 top-1/2 -translate-y-1/2 z-50"
        >
          <Link
            to="/comparateur"
            className="group flex items-center gap-2.5 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-sm px-5 py-3.5 rounded-full shadow-[var(--shadow-elegant)] hover:shadow-[var(--shadow-glow)] transition-all duration-300 hover:scale-105 active:scale-95 writing-mode-vertical"
            aria-label="Voir mon prix en 2 minutes"
            style={{ writingMode: "vertical-lr", textOrientation: "mixed" }}
          >
            <Zap className="w-4 h-4 rotate-90" aria-hidden="true" />
            <span className="tracking-wide">VOIR MON PRIX EN 2 MIN</span>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FloatingCTA;
