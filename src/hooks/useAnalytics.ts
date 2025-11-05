import { useCallback } from 'react';

// Google Analytics 4 event tracking
declare global {
  interface Window {
    gtag?: (command: string, ...args: any[]) => void;
    clarity?: (command: string, ...args: any[]) => void;
  }
}

export type AnalyticsEvent = 
  | 'callback_request'
  | 'quote_request'
  | 'newsletter_signup'
  | 'chatbot_message'
  | 'insurance_type_click'
  | 'partner_click'
  | 'faq_open'
  | 'phone_click'
  | 'email_click';

interface EventParams {
  category?: string;
  label?: string;
  value?: number;
  insurance_type?: string;
  partner_name?: string;
  [key: string]: any;
}

export const useAnalytics = () => {
  const trackEvent = useCallback((eventName: AnalyticsEvent, params?: EventParams) => {
    // Google Analytics 4
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', eventName, {
        event_category: params?.category || 'engagement',
        event_label: params?.label,
        value: params?.value,
        ...params,
      });
    }

    // Microsoft Clarity custom tags
    if (typeof window !== 'undefined' && window.clarity) {
      window.clarity('event', eventName);
    }

    // Console log in development
    if (import.meta.env.DEV) {
      console.log('Analytics Event:', eventName, params);
    }
  }, []);

  const trackPageView = useCallback((path: string, title?: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', 'G-XXXXXXXXXX', {
        page_path: path,
        page_title: title,
      });
    }
  }, []);

  const trackConversion = useCallback((conversionType: string, value?: number) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'conversion', {
        send_to: 'AW-CONVERSION-ID',
        value: value || 0,
        currency: 'EUR',
        transaction_id: `${Date.now()}-${Math.random()}`,
        conversion_type: conversionType,
      });
    }

    // Track in Clarity
    if (typeof window !== 'undefined' && window.clarity) {
      window.clarity('event', 'conversion', conversionType);
    }
  }, []);

  return {
    trackEvent,
    trackPageView,
    trackConversion,
  };
};
