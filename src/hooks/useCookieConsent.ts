import { useState, useEffect } from 'react';

export interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

export interface CookieConsent {
  hasConsented: boolean;
  preferences: CookiePreferences;
  timestamp: string;
}

const COOKIE_CONSENT_KEY = 'cookie-consent';

const defaultPreferences: CookiePreferences = {
  necessary: true, // Always true, can't be disabled
  analytics: false,
  marketing: false,
};

export const useCookieConsent = () => {
  const [consent, setConsent] = useState<CookieConsent | null>(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const storedConsent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (storedConsent) {
      try {
        const parsedConsent = JSON.parse(storedConsent) as CookieConsent;
        setConsent(parsedConsent);
        setShowBanner(false);
      } catch (error) {
        console.error('Error parsing cookie consent:', error);
        setShowBanner(true);
      }
    } else {
      setShowBanner(true);
    }
  }, []);

  const saveConsent = (preferences: CookiePreferences) => {
    const newConsent: CookieConsent = {
      hasConsented: true,
      preferences: { ...preferences, necessary: true },
      timestamp: new Date().toISOString(),
    };
    
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(newConsent));
    setConsent(newConsent);
    setShowBanner(false);
  };

  const acceptAll = () => {
    saveConsent({
      necessary: true,
      analytics: true,
      marketing: true,
    });
  };

  const rejectAll = () => {
    saveConsent(defaultPreferences);
  };

  const updatePreferences = (preferences: CookiePreferences) => {
    saveConsent(preferences);
  };

  const resetConsent = () => {
    localStorage.removeItem(COOKIE_CONSENT_KEY);
    setConsent(null);
    setShowBanner(true);
  };

  return {
    consent,
    showBanner,
    acceptAll,
    rejectAll,
    updatePreferences,
    resetConsent,
  };
};
