/**
 * Enregistrement des conversions "devis" pour le dashboard admin
 * (GoogleAdsDashboard.tsx, table google_ads_conversions).
 *
 * N'envoie plus rien à Google Ads elle-même — c'est trackConversion
 * (src/hooks/useAnalytics.ts) qui envoie l'unique conversion gtag, avec le
 * vrai label et le garde-fou "devis/rappel uniquement". Avant le chantier du
 * 2026-09-29, ce fichier envoyait sa propre conversion en parallèle avec un
 * label placeholder ('XXXXXXXXX') jamais configuré : une fois le vrai label
 * posé dans analytics.ts, les deux envois auraient doublé chaque conversion.
 * trackGoogleAdsConversion (sans logging DB, aucun autre appelant) a été
 * supprimée avec le reste du doublon.
 */

export type ConversionType = 'quote_request' | 'callback_request';

interface ConversionValueConfig {
  value?: number;
  currency?: string;
}

const CONVERSION_VALUES: Record<ConversionType, ConversionValueConfig> = {
  quote_request: { value: 100, currency: 'EUR' },
  callback_request: { value: 50, currency: 'EUR' },
};

/**
 * Enregistre une conversion "devis" dans google_ads_conversions, pour le
 * dashboard admin. N'envoie rien à Google Ads (voir trackConversion).
 */
export const trackGoogleAdsConversionWithParams = async (
  type: ConversionType,
  params: {
    value?: number;
    insuranceType?: string;
    postalCode?: string;
    source?: string;
    leadId?: string;
    campaignId?: string;
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
    utmContent?: string;
    utmTerm?: string;
  }
): Promise<void> => {
  const config = CONVERSION_VALUES[type];

  try {
    // Dynamic import pour éviter d'alourdir le bundle des formulaires.
    const { supabase } = await import('@/integrations/supabase/client');

    await supabase.from('google_ads_conversions').insert({
      campaign_id: params.campaignId || params.utmCampaign || null,
      conversion_type: type,
      conversion_value: params.value ?? config.value,
      insurance_type: params.insuranceType,
      postal_code: params.postalCode,
      source: params.source,
      utm_source: params.utmSource,
      utm_medium: params.utmMedium,
      utm_campaign: params.utmCampaign,
      utm_content: params.utmContent,
      utm_term: params.utmTerm,
      lead_id: params.leadId,
    });

    if (import.meta.env.DEV) {
      console.log(`Google Ads conversion enregistrée (dashboard) : ${type}`, params);
    }
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('Error logging Google Ads conversion:', error);
    }
  }
};
