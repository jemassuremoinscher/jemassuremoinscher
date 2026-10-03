import { useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { formatDate, formatEUR, formatNumber } from "@/lib/i18nFormat";

/** Formats de la langue courante : dates, nombres, montants en EUR. */
export const useFormat = () => {
  const { language } = useLanguage();
  return useMemo(
    () => ({
      date: (d: Date | string | number, o?: Intl.DateTimeFormatOptions) => formatDate(d, language, o),
      number: (n: number, o?: Intl.NumberFormatOptions) => formatNumber(n, language, o),
      eur: (n: number, o?: Intl.NumberFormatOptions) => formatEUR(n, language, o),
    }),
    [language],
  );
};
