import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import fr from '@/i18n/fr';

export type Language = 'fr' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// EN translations loaded lazily - only when user switches to English
let enTranslations: Record<string, string> | null = null;
const loadEnTranslations = async () => {
  if (!enTranslations) {
    const mod = await import('@/i18n/en');
    enTranslations = mod.default;
  }
  return enTranslations;
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('language') as Language;
    return saved && (saved === 'fr' || saved === 'en') ? saved : 'fr';
  });
  const [enLoaded, setEnLoaded] = useState(false);

  const setLanguage = useCallback((lang: Language) => {
    if (lang === 'en' && !enTranslations) {
      loadEnTranslations().then(() => {
        setEnLoaded(true);
        setLanguageState(lang);
        localStorage.setItem('language', lang);
        document.documentElement.lang = lang;
      });
    } else {
      setLanguageState(lang);
      localStorage.setItem('language', lang);
      document.documentElement.lang = lang;
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    // If saved language is EN, load translations on mount
    if (language === 'en' && !enTranslations) {
      loadEnTranslations().then(() => setEnLoaded(true));
    }
  }, [language]);

  const t = useCallback((key: string): string => {
    if (language === 'en' && enTranslations) {
      return enTranslations[key] || fr[key] || key;
    }
    return fr[key] || key;
  }, [language, enLoaded]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
