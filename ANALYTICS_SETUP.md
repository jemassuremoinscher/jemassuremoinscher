# Analytics & Tracking Setup Guide

## 📊 Overview

This project implements comprehensive analytics and tracking using:
- **Google Analytics 4 (GA4)** - Event tracking and conversions
- **Microsoft Clarity** - Heatmaps, session recordings, and user insights

## 🚀 Configuration Steps

### 1. Google Analytics 4 Setup

1. Create a GA4 property at [Google Analytics](https://analytics.google.com/)
2. Get your Measurement ID (format: `G-XXXXXXXXXX`)
3. Replace `G-XXXXXXXXXX` in `index.html` with your actual Measurement ID (appears in 2 places)
4. Configure conversion events in GA4:
   - `callback_request` - Callback form submissions
   - `quote_request` - Quote request form submissions (value: 100€)
   - `newsletter_signup` - Newsletter subscriptions

### 2. Microsoft Clarity Setup

1. Create a project at [Microsoft Clarity](https://clarity.microsoft.com/)
2. Get your Project ID
3. Replace `CLARITY_PROJECT_ID` in `index.html` with your actual Project ID

**Why Clarity?**
- 100% free forever
- Heatmaps showing where users click
- Session recordings to watch user journeys
- Rage clicks and dead clicks detection
- No data sampling (unlike free GA4)

## 📈 Tracked Events

### Conversion Events (High Value)

| Event | Trigger | Value | Purpose |
|-------|---------|-------|---------|
| `callback_request` | Callback form submission | - | Lead generation |
| `quote_request` | Quote form submission | 100€ | High-intent lead |
| `newsletter_signup` | Newsletter subscription | - | Engagement |

### Engagement Events

| Event | Trigger | Category | Purpose |
|-------|---------|----------|---------|
| `chatbot_message` | AI chatbot interaction | engagement | User support |
| `insurance_type_click` | Insurance category clicked | engagement | Interest tracking |
| `partner_click` | Partner logo clicked | engagement | Partner interest |
| `faq_open` | FAQ item expanded | engagement | Content interest |

## 🎯 Implementation Details

### Using Analytics Hook

```typescript
import { useAnalytics } from "@/hooks/useAnalytics";

const { trackEvent, trackConversion, trackPageView } = useAnalytics();

// Track a simple event
trackEvent('insurance_type_click', {
  category: 'navigation',
  insurance_type: 'auto',
});

// Track a conversion
trackConversion('quote_request', 100);

// Track a page view
trackPageView('/assurance-auto', 'Assurance Auto');
```

### Current Implementation Locations

**Conversions tracked:**
- ✅ `src/components/contact/CallbackForm.tsx` - Callback requests
- ✅ `src/components/forms/QuoteRequestForm.tsx` - Quote requests
- ✅ `src/components/NewsletterSection.tsx` - Newsletter signups

**Engagement tracked:**
- ✅ `src/components/chatbot/AIChatbot.tsx` - Chatbot interactions

## 🔒 Privacy & GDPR Compliance

### Current Settings

- ✅ IP Anonymization enabled (`anonymize_ip: true`)
- ✅ Cookie consent banner implemented (`src/components/CookieBanner.tsx`)
- ✅ Secure cookie flags (`SameSite=None;Secure`)

### Recommended Additional Steps

1. Update Privacy Policy to mention GA4 and Clarity
2. Link to `src/pages/PolitiqueCookies.tsx` from footer
3. Consider implementing cookie consent before loading scripts
4. Add opt-out mechanisms for users

## 📊 Monitoring & Optimization

### Google Analytics 4

**Key Reports to Monitor:**
1. **Conversions** - Track lead generation (callback, quote requests)
2. **Events** - See all user interactions
3. **User Acquisition** - Understand traffic sources
4. **Engagement** - Time on site, pages per session
5. **Funnels** - Create custom funnels for conversion paths

### Microsoft Clarity

**Key Features to Use:**
1. **Heatmaps** - See where users click and scroll
2. **Session Recordings** - Watch actual user sessions
3. **Rage Clicks** - Find frustrating UI elements
4. **Dead Clicks** - Identify non-functional elements
5. **Dashboard** - Monitor key metrics daily

## 🎨 Custom Dashboards

### Recommended GA4 Custom Reports

1. **Lead Generation Report**
   - Metrics: Callback requests, Quote requests, Newsletter signups
   - Dimensions: Source/Medium, Landing page, Device

2. **Insurance Type Interest**
   - Metrics: insurance_type_click events
   - Dimensions: Insurance type, Traffic source

3. **Engagement Report**
   - Metrics: Chatbot messages, FAQ opens, Partner clicks
   - Dimensions: Page, Device, User type (new/returning)

## 🔧 Troubleshooting

### Events Not Showing in GA4

1. Check browser console for errors
2. Verify Measurement ID is correct
3. Use GA4 DebugView to see real-time events
4. Ensure ad blockers are disabled for testing
5. Wait 24-48 hours for data to appear in reports

### Clarity Not Recording

1. Verify Project ID is correct
2. Check console for errors
3. Ensure scripts are loading (Network tab)
4. Test in incognito mode (without extensions)

### Development Mode

In development, analytics events are logged to console:
```
Analytics Event: quote_request { category: 'lead_generation', insurance_type: 'auto', value: 100 }
```

## 📱 Next Steps

1. **Replace placeholder IDs** in `index.html` with your actual GA4 and Clarity IDs
2. **Test all conversion events** by submitting forms
3. **Set up GA4 custom reports** for your key metrics
4. **Configure Clarity dashboards** for heatmaps you want to monitor
5. **Monitor for 1-2 weeks** and adjust tracking based on insights
6. **Add additional events** for specific features (e.g., insurance calculator, comparison tool)
7. **Set up alerts** in GA4 for conversion drops
8. **Weekly review** of Clarity session recordings for UX improvements

## 🎯 Optimization Tips

1. Use Clarity heatmaps to identify dead zones on landing pages
2. Watch session recordings of users who abandon forms
3. Track rage clicks to find frustrating UI elements
4. Monitor conversion funnels in GA4 to identify drop-off points
5. A/B test CTA buttons and track with custom events
6. Segment users by traffic source to optimize campaigns
7. Use exit pages report to reduce bounce rate

---

**Note:** Replace all placeholder IDs before going to production!
