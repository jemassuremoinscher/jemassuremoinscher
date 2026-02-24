/**
 * Meta Pixel (Facebook Pixel) Tracking Utility
 * Pixel ID: 2130973847755698
 */

const META_PIXEL_ID = '2130973847755698';

/**
 * Track a standard Meta Pixel event
 */
export const trackMetaEvent = (
  eventName: string,
  params?: Record<string, unknown>
): void => {
  if (typeof window === 'undefined' || !(window as any).fbq) {
    if (import.meta.env.DEV) {
      console.warn('Meta Pixel: fbq not available');
    }
    return;
  }

  try {
    (window as any).fbq('track', eventName, params);
    if (import.meta.env.DEV) {
      console.log(`Meta Pixel event tracked: ${eventName}`, params);
    }
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('Meta Pixel tracking error:', error);
    }
  }
};

/**
 * Track a Lead event (quote form submission)
 */
export const trackMetaLead = (params?: {
  content_name?: string;
  content_category?: string;
  value?: number;
  currency?: string;
}): void => {
  trackMetaEvent('Lead', {
    content_name: params?.content_name || 'Demande de devis',
    content_category: params?.content_category || 'Assurance',
    value: params?.value || 0,
    currency: params?.currency || 'EUR',
  });
};

export { META_PIXEL_ID };
