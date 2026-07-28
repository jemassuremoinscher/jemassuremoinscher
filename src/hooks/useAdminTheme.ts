import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'crm.theme';
type Theme = 'light' | 'dark';

const prefersDark = () =>
  typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-color-scheme: dark)').matches;

// Thème sombre scopé à l'admin CRM : la classe `dark` est posée sur le
// conteneur racine de CrmLayout (voir son usage), jamais sur <html>. Le site
// public a son propre bootstrap `theme`/<html> dans index.html — clé
// localStorage distincte ici pour ne jamais l'influencer.
export function useAdminTheme() {
  // `explicit` = choix posé par l'utilisateur via le toggle (persisté). Tant
  // qu'il est null, le thème suit le système en direct — un choix explicite
  // fige le thème et n'est plus jamais écrasé par un changement d'OS.
  const [explicit, setExplicit] = useState<Theme | null>(() => {
    if (typeof window === 'undefined') return null;
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === 'dark' || stored === 'light' ? stored : null;
  });
  const [systemDark, setSystemDark] = useState<boolean>(prefersDark);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = (e: MediaQueryListEvent) => setSystemDark(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const isDark = explicit ? explicit === 'dark' : systemDark;

  const toggle = useCallback(() => {
    setExplicit((current) => {
      const currentlyDark = current ? current === 'dark' : systemDark;
      const next: Theme = currentlyDark ? 'light' : 'dark';
      localStorage.setItem(STORAGE_KEY, next);
      return next;
    });
  }, [systemDark]);

  return { isDark, toggle };
}
