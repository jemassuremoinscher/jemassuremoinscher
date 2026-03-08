import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLanguage } from "@/contexts/LanguageContext";

const StickyCTA = () => {
  const [isVisible, setIsVisible] = useState(false);
  const isMobile = useIsMobile();
  const { t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -100, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed left-4 bottom-6 z-50 md:bottom-8"
        >
          <Link
            to="/comparateur"
            className="flex items-center gap-2 py-3 px-5 rounded-full font-bold text-sm md:text-base text-secondary-foreground bg-gradient-to-r from-[hsl(43_80%_65%)] to-[hsl(38_75%_58%)] shadow-[var(--shadow-elegant)] hover:shadow-[var(--shadow-lg)] active:scale-95 transition-all"
            aria-label={t('stickyCta.text')}
          >
            <span>{t('stickyCta.text')}</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StickyCTA;