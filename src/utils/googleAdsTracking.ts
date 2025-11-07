/**
 * Google Ads Conversion Tracking Utility
 * Tracks conversions for leads (quotes and callbacks) with proper value assignment
 */

export type ConversionType = 'quote_request' | 'callback_request';

interface ConversionConfig {
  conversionId: string;
  conversionLabel: string;
  value?: number;
  currency?: string;
}

// Configuration des conversions Google Ads
// À remplacer par vos propres IDs de conversion après configuration dans Google Ads
const CONVERSION_CONFIGS: Record<ConversionType, ConversionConfig> = {
  quote_request: {
    conversionId: 'AW-XXXXXXXXX', // À remplacer
    conversionLabel: 'XXXXXXXXX', // À remplacer
    value: 100, // Valeur estimée d'un devis de qualité
    currency: 'EUR',
  },
  callback_request: {
    conversionId: 'AW-XXXXXXXXX', // À remplacer
    conversionLabel: 'XXXXXXXXX', // À remplacer
    value: 50, // Valeur estimée d'une demande de rappel
    currency: 'EUR',
  },
};

/**
 * Track a conversion event in Google Ads
 * @param type - Type of conversion (quote_request or callback_request)
 * @param customValue - Optional custom value to override default
 */
export const trackGoogleAdsConversion = (
  type: ConversionType,
  customValue?: number
): void => {
  if (typeof window === 'undefined' || !window.gtag) {
    console.warn('Google Ads tracking not available');
    return;
  }

  const config = CONVERSION_CONFIGS[type];
  const value = customValue ?? config.value;

  try {
    window.gtag('event', 'conversion', {
      send_to: `${config.conversionId}/${config.conversionLabel}`,
      value: value,
      currency: config.currency,
      transaction_id: generateTransactionId(),
    });

    console.log(`✅ Google Ads Conversion tracked: ${type}`, {
      value,
      currency: config.currency,
    });
  } catch (error) {
    console.error('Error tracking Google Ads conversion:', error);
  }
};

/**
 * Track a conversion with additional parameters
 * @param type - Type of conversion
 * @param params - Additional tracking parameters
 */
export const trackGoogleAdsConversionWithParams = (
  type: ConversionType,
  params: {
    value?: number;
    insuranceType?: string;
    postalCode?: string;
    source?: string;
  }
): void => {
  if (typeof window === 'undefined' || !window.gtag) {
    console.warn('Google Ads tracking not available');
    return;
  }

  const config = CONVERSION_CONFIGS[type];

  try {
    window.gtag('event', 'conversion', {
      send_to: `${config.conversionId}/${config.conversionLabel}`,
      value: params.value ?? config.value,
      currency: config.currency,
      transaction_id: generateTransactionId(),
      // Custom parameters (will appear in Google Ads reports if configured)
      insurance_type: params.insuranceType,
      postal_code: params.postalCode,
      source: params.source,
    });

    console.log(`✅ Google Ads Conversion tracked with params: ${type}`, params);
  } catch (error) {
    console.error('Error tracking Google Ads conversion:', error);
  }
};

/**
 * Generate a unique transaction ID for deduplication
 */
const generateTransactionId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Check if Google Ads tracking is properly configured
 */
export const isGoogleAdsConfigured = (): boolean => {
  return (
    typeof window !== 'undefined' &&
    typeof window.gtag === 'function' &&
    CONVERSION_CONFIGS.quote_request.conversionId !== 'AW-XXXXXXXXX'
  );
};

/**
 * Log configuration status (for debugging)
 */
export const logGoogleAdsStatus = (): void => {
  if (typeof window === 'undefined') {
    console.log('🔴 Google Ads: Window not available (SSR)');
    return;
  }

  const isConfigured = isGoogleAdsConfigured();
  const hasGtag = typeof window.gtag === 'function';

  console.log('📊 Google Ads Status:', {
    configured: isConfigured,
    gtagAvailable: hasGtag,
    conversions: Object.keys(CONVERSION_CONFIGS),
  });

  if (!isConfigured) {
    console.warn(
      '⚠️ Google Ads conversions not configured. Update CONVERSION_CONFIGS in googleAdsTracking.ts'
    );
  }
};
