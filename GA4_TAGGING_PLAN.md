# Google Analytics 4 Tagging Plan

## Measurement ID
**G-L5YPR2LR29**

## Overview
This document outlines all GA4 events tracked on the BackWatcher website for analytics and conversion tracking.

---

## Events Summary

### Engagement Events

| Event Name | Description | Trigger | File | Label |
|------------|-------------|---------|------|-------|
| `email_entry` | User submits email to download trial | Click "Download Free Trial" button | `js/download.js` | `download_form` |
| `download_click` | User clicks the actual download link | Click "Download Now" after email submit | `js/download.js` | `macos_dmg` |
| `github_click` | User downloads from GitHub releases | Click download link (GitHub URL) | `js/download.js` | `release_download` |
| `buy_click` | User clicks a Buy button | Click Buy buttons | `index.html` | `nav_button`, `main_cta` |
| `privacy_policy_click` | User clicks privacy policy link | Click any privacy policy link | `index.html` | `privacy_section`, `features_section`, `footer` |

### Conversion Events

| Event Name | Description | Trigger | File | Label | Value |
|------------|-------------|---------|------|-------|-------|
| `checkout_initiated` | User proceeds to Stripe checkout | Successful redirect to Stripe | `js/checkout.js` | `stripe_redirect` | - |
| `purchase_complete` | User completes purchase | Landing on success page | `success.html` | `lifetime_license` | $99 USD |

---

## Event Details

### `email_entry`
- **Category:** engagement
- **When:** User enters a valid email and clicks "Download Free Trial for macOS"
- **Purpose:** Track lead generation from download form

### `download_click` / `github_click`
- **Category:** engagement  
- **When:** User clicks the "Download Now" button after email submission
- **Purpose:** Track actual downloads (both events fire together)

### `buy_click`
- **Category:** engagement
- **Labels:**
  - `nav_button` - Buy button in navigation bar
  - `main_cta` - "BUY NOW FOR $99" button in pricing section
- **Purpose:** Track purchase intent

### `privacy_policy_click`
- **Category:** engagement
- **Labels:**
  - `privacy_section` - Link in Privacy & Camera section
  - `features_section` - Link in features grid
  - `footer` - Link in page footer
- **Purpose:** Track privacy policy engagement

### `checkout_initiated`
- **Category:** conversion
- **When:** User submits email on checkout page and is redirected to Stripe
- **Purpose:** Track checkout funnel entry

### `purchase_complete`
- **Category:** conversion
- **When:** User lands on success.html after Stripe payment
- **Value:** $99 USD
- **Purpose:** Track completed purchases (main conversion)

---

## Pages with GA4 Tracking

| Page | GA4 Enabled | Custom Events |
|------|-------------|---------------|
| `index.html` | ✅ | `buy_click`, `privacy_policy_click` |
| `checkout.html` | ✅ | `checkout_initiated` (via checkout.js) |
| `success.html` | ✅ | `purchase_complete` |
| `privacy-policy.html` | ✅ | - |
| `terms-of-service.html` | ✅ | - |
| `404.html` | ❌ | - |

---

## Recommended GA4 Setup

### Mark as Conversions
In GA4 Admin > Conversions, mark these events as conversions:
1. `purchase_complete` (primary conversion)
2. `checkout_initiated` (micro-conversion)
3. `email_entry` (lead generation)

### Create Audiences
Suggested audiences for remarketing:
- Users who triggered `email_entry` but not `purchase_complete`
- Users who triggered `checkout_initiated` but not `purchase_complete`

---

## Testing

### Realtime Testing
1. Open your website in a browser
2. Go to GA4 > Reports > Realtime
3. Perform actions (click buttons, submit forms)
4. Verify events appear in realtime view

### Debug Mode
Add `?debug_mode=1` to any URL to enable GA4 debug mode, then use the GA4 DebugView:
- GA4 > Admin > DebugView

---

## Files Modified

- `index.html` - Added onclick tracking for buy buttons and privacy links
- `js/download.js` - Added `email_entry`, `download_click`, `github_click` events
- `js/checkout.js` - Added `checkout_initiated` event
- `success.html` - Added `purchase_complete` event

---

*Last updated: February 1, 2026*
