import type { Language } from "@/contexts/LanguageContext";

/**
 * Formats par langue (Intl). Public : personnes résidant en France, donc
 * devise EUR quelle que soit la langue ; seule la présentation change
 * (fr : « 2,90 € », en : « €2.90 », it : « 2,90 € »).
 */
export const LOCALES: Record<Language, string> = { fr: "fr-FR", en: "en-GB", it: "it-IT" };

type DateInput = Date | string | number;
const toDate = (d: DateInput) => (d instanceof Date ? d : new Date(d));

export const formatDate = (date: DateInput, lang: Language, options: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" }) =>
  new Intl.DateTimeFormat(LOCALES[lang], { timeZone: "Europe/Paris", ...options }).format(toDate(date));

export const formatNumber = (value: number, lang: Language, options: Intl.NumberFormatOptions = {}) =>
  new Intl.NumberFormat(LOCALES[lang], options).format(value);

export const formatEUR = (value: number, lang: Language, options: Intl.NumberFormatOptions = {}) =>
  new Intl.NumberFormat(LOCALES[lang], {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
    maximumFractionDigits: 2,
    ...options,
  }).format(value);
