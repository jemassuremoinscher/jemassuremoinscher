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
const CONSENT_EVENT = 'cookie-consent-updated';
// Durée de validité du choix (acceptation comme refus) : 6 mois, puis la
// bannière est reproposée. Même règle dans le loader analytics
// (scripts/analytics-loader.snippet.html, CONSENT_MAX_AGE_MONTHS).
export const CONSENT_MAX_AGE_MONTHS = 6;

const defaultPreferences: CookiePreferences = {
  necessary: true, // Always true, can't be disabled
  analytics: false,
  marketing: false,
};

// Horodatage absent ou illisible : traité comme expiré (on redemande).
const isExpired = (consent: CookieConsent): boolean => {
  const given = new Date(consent.timestamp);
  if (Number.isNaN(given.getTime())) return true;
  const expiry = new Date(given);
  expiry.setMonth(expiry.getMonth() + CONSENT_MAX_AGE_MONTHS);
  return Date.now() >= expiry.getTime();
};

const readStoredConsent = (): CookieConsent | null => {
  try {
    const raw = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CookieConsent;
    if (isExpired(parsed)) {
      localStorage.removeItem(COOKIE_CONSENT_KEY);
      return null;
    }
    return parsed;
  } catch (error) {
    console.error('Error parsing cookie consent:', error);
    return null;
  }
};

export const useCookieConsent = () => {
  const [consent, setConsent] = useState<CookieConsent | null>(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const stored = readStoredConsent();
    if (stored) {
      setConsent(stored);
      setShowBanner(false);
      return;
    }
    // Delay so the banner never competes with the hero's LCP paint
    const timer = setTimeout(() => setShowBanner(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Garde toutes les instances du hook synchronisées : saveConsent/resetConsent
    // appelé depuis une instance (ex. le bouton "Gérer mes préférences" sur
    // /politique-cookies) doit rouvrir/fermer la bannière montée ailleurs dans
    // l'arbre (CookieBanner, dans le layout) — sinon "Gérer mes préférences"
    // efface le consentement sans jamais rouvrir la bannière (bug constaté le
    // 2026-09-29, aucun état partagé entre instances de ce hook auparavant).
    const handler = () => {
      const stored = readStoredConsent();
      setConsent(stored);
      setShowBanner(!stored);
    };
    window.addEventListener(CONSENT_EVENT, handler);
    return () => window.removeEventListener(CONSENT_EVENT, handler);
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
    // Lu par le loader analytics (scripts/analytics-loader.snippet.html) pour
    // charger/neutraliser GA4, Clarity, Ads et Meta Pixel immédiatement, sans
    // recharger la page, et par les autres instances de ce hook (ci-dessus).
    window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: newConsent }));
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
    window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: null }));
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
