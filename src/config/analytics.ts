// =============================================================
// Analytics Configuration
// Update these IDs when accounts are set up.
// This is the ONLY file you need to edit for analytics IDs.
// =============================================================

// Google Analytics 4 — get from: analytics.google.com > Admin > Data Streams
export const GA4_MEASUREMENT_ID = 'G-2S9BMSWT79';

// Google Ads — conversion tracking
export const GOOGLE_ADS_ID = 'AW-972332620';
export const GOOGLE_ADS_CONVERSION_LABEL = 'XXXXXXXXX'; // TODO: Create conversion actions in Google Ads to get per-action labels

// Microsoft Clarity
export const CLARITY_PROJECT_ID = 'vjn36y0aqr';

// Helper to check if analytics are configured
export const isGA4Configured = () => !GA4_MEASUREMENT_ID.includes('XXXXXXXXXX');
export const isAdsConversionConfigured = () => !GOOGLE_ADS_CONVERSION_LABEL.includes('XXXXXXXXX');
export const isClarityConfigured = () => CLARITY_PROJECT_ID.length > 0;
