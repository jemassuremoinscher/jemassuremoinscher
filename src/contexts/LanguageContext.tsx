import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import fr from '@/i18n/fr';

export type Language = 'fr' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
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
  // Toujours 'fr' au premier rendu : identique au HTML prerendered/statique,
  // pour ne pas provoquer de désaccord d'hydratation. La préférence sauvegardée
  // n'est appliquée qu'après le montage (voir effet ci-dessous).
  const [language, setLanguageState] = useState<Language>('fr');
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

  // Restaure la préférence sauvegardée une fois le montage effectué (post-hydratation).
  useEffect(() => {
    const saved = localStorage.getItem('language') as Language | null;
    if (saved === 'en') {
      loadEnTranslations().then(() => {
        setEnLoaded(true);
        setLanguageState('en');
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const t = useCallback((key: string, vars?: Record<string, string | number>): string => {
    let raw: string;
    if (language === 'en' && enTranslations) {
      raw = enTranslations[key] || fr[key] || key;
    } else {
      raw = fr[key] || key;
    }
    if (vars) {
      for (const [k, v] of Object.entries(vars)) {
        raw = raw.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
      }
    }
    return raw;
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
