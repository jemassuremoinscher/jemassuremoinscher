import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import fr from '@/i18n/fr';
import { APP_SETTINGS_AVAILABLE } from '@/config/site';

export type Language = 'fr' | 'en' | 'it';

export const ALL_LANGUAGES: Language[] = ['fr', 'en', 'it'];
// Langues proposées tant que app_settings 'languages_enabled' n'est pas lu
// (table absente, erreur réseau) : l'italien reste caché.
export const DEFAULT_LANGUAGES_ENABLED: Language[] = ['fr', 'en'];

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  /** Langues affichées par le bouton de langue (app_settings 'languages_enabled'). */
  languagesEnabled: Language[];
  t: (key: string, vars?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const isLanguage = (v: unknown): v is Language => typeof v === 'string' && (ALL_LANGUAGES as string[]).includes(v);

// Traductions chargées paresseusement, seulement quand la langue est choisie.
const dictionaries: Partial<Record<Language, Record<string, string>>> = { fr };
const loaders: Record<Exclude<Language, 'fr'>, () => Promise<{ default: Record<string, string> }>> = {
  en: () => import('@/i18n/en'),
  it: () => import('@/i18n/it'),
};
const loadDictionary = async (lang: Language) => {
  if (!dictionaries[lang] && lang !== 'fr') dictionaries[lang] = (await loaders[lang]()).default;
  return dictionaries[lang]!;
};

const readSaved = (): Language | null => {
  try {
    const v = localStorage.getItem('language');
    return isLanguage(v) ? v : null;
  } catch {
    return null;
  }
};

// Instrument QA : avec window.__I18N_QA = true, chaque clé qui retombe sur le
// français (présente en français, absente de la langue choisie ; les clés
// sondées qui n'existent dans aucune langue ne sont pas des replis) est
// journalisée une fois et
// accumulée dans window.__I18N_MISSES (lu par le test Playwright).
declare global {
  interface Window {
    __I18N_QA?: boolean;
    __I18N_MISSES?: { lang: Language; key: string }[];
  }
}
const reportedMisses = new Set<string>();
const reportFallback = (lang: Language, key: string) => {
  if (typeof window === 'undefined' || !window.__I18N_QA) return;
  const id = `${lang}:${key}`;
  if (reportedMisses.has(id)) return;
  reportedMisses.add(id);
  (window.__I18N_MISSES ||= []).push({ lang, key });
  console.warn(`[i18n] repli fr (${lang}) :`, key);
};

// app_settings 'languages_enabled' : lu une fois par session. Désactivé tant
// que la table n'existe pas en base (APP_SETTINGS_AVAILABLE, src/config/site.ts) :
// une requête vers une table absente renvoie un 404 journalisé en console.
const loadLanguagesEnabled = async (): Promise<Language[]> => {
  if (!APP_SETTINGS_AVAILABLE) return DEFAULT_LANGUAGES_ENABLED;
  try {
    const cached = sessionStorage.getItem('languages_enabled');
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.every(isLanguage)) return parsed;
    }
  } catch { /* stockage indisponible */ }
  try {
    const { supabase } = await import('@/integrations/supabase/client');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- table absente des types générés tant que la migration n'est pas appliquée
    const { data, error } = await (supabase as any)
      .from('app_settings')
      .select('value')
      .eq('key', 'languages_enabled')
      .maybeSingle();
    const value = !error && Array.isArray(data?.value) ? (data.value as unknown[]).filter(isLanguage) : null;
    const list: Language[] = value && value.length ? (value.includes('fr') ? value : ['fr', ...value]) : DEFAULT_LANGUAGES_ENABLED;
    try { sessionStorage.setItem('languages_enabled', JSON.stringify(list)); } catch { /* ignore */ }
    return list;
  } catch {
    return DEFAULT_LANGUAGES_ENABLED;
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Toujours 'fr' au premier rendu : identique au HTML prerendered/statique,
  // pour ne pas provoquer de désaccord d'hydratation. La préférence sauvegardée
  // n'est appliquée qu'après le montage (voir effet ci-dessous).
  const [language, setLanguageState] = useState<Language>('fr');
  const [languagesEnabled, setLanguagesEnabled] = useState<Language[]>(DEFAULT_LANGUAGES_ENABLED);

  const applyLanguage = useCallback(async (lang: Language, persist: boolean) => {
    await loadDictionary(lang);
    setLanguageState(lang);
    if (persist) {
      try { localStorage.setItem('language', lang); } catch { /* ignore */ }
    }
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    void applyLanguage(lang, true);
  }, [applyLanguage]);

  // Après le montage : langues activées, puis préférence sauvegardée si elle
  // en fait partie. Aucune détection ni redirection : sans choix enregistré,
  // le site reste en français.
  useEffect(() => {
    let active = true;
    void loadLanguagesEnabled().then((enabled) => {
      if (!active) return;
      setLanguagesEnabled(enabled);
      const saved = readSaved();
      if (saved && saved !== 'fr' && enabled.includes(saved)) void applyLanguage(saved, false);
    });
    return () => { active = false; };
  }, [applyLanguage]);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  // Le dictionnaire de la langue est toujours chargé avant setLanguageState
  // (applyLanguage) : t() n'a pas besoin d'autre dépendance que la langue.
  const t = useCallback((key: string, vars?: Record<string, string | number>): string => {
    let raw: string;
    if (language === 'fr') {
      raw = fr[key] || key;
    } else {
      // Une valeur vide est une traduction voulue (ex. mot absent de la
      // phrase anglaise) : seule une clé absente retombe sur le français.
      const value = dictionaries[language]?.[key];
      if (value === undefined && key in fr) reportFallback(language, key);
      raw = value ?? fr[key] ?? key;
    }
    if (vars) {
      for (const [k, v] of Object.entries(vars)) {
        raw = raw.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
      }
    }
    return raw;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, languagesEnabled, t }}>
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
