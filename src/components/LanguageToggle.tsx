import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

const LanguageToggle = () => {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'fr' ? 'en' : 'fr');
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="flex items-center gap-1.5 px-2 py-1 h-8 text-sm font-medium text-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
      aria-label={language === 'fr' ? 'Switch to English' : 'Passer en Français'}
    >
      <Globe className="h-4 w-4" />
      <span className="uppercase font-bold">{language === 'fr' ? 'EN' : 'FR'}</span>
    </Button>
  );
};

export default LanguageToggle;
