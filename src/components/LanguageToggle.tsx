import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
const LanguageToggle = () => {
  const {
    language,
    setLanguage
  } = useLanguage();
  const toggleLanguage = () => {
    setLanguage(language === 'fr' ? 'en' : 'fr');
  };
  return <Button variant="ghost" size="sm" onClick={toggleLanguage} className="flex items-center gap-1.5 px-2 py-1 h-8 text-sm font-medium text-white hover:text-white/80 hover:bg-white/10 rounded-lg transition-all" aria-label={language === 'fr' ? 'Switch to English' : 'Passer en Français'}>
      <Globe className="h-4 w-4 text-white/70" />
      <span className="uppercase font-bold text-white">{language === 'fr' ? 'EN' : 'FR'}</span>
    </Button>;
};
export default LanguageToggle;