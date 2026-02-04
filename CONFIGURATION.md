# Configuration Guide

## ⚠️ CRITICAL: Before Going Live

### Security Checklist
- [ ] **Supabase RLS enabled** - Run the SQL setup script which includes Row Level Security
- [ ] **Verify RLS policies** - Check Supabase Table Editor → each table → Policies tab
- [ ] **Stripe webhook secret** - Ensure `STRIPE_WEBHOOK_SECRET` is set in Supabase secrets
- [ ] **Test in Stripe test mode first** - Never go live without testing!

---

## Files to Update Before Going Live

### 1. `js/download.js`
The download URL is configured to:
```javascript
const DOWNLOAD_URL = "https://github.com/Soufi54/BackWatcherWebsite/releases/download/v1.2.4/BackWatcher-1.2.4-arm64.dmg";
```
Update if your release filename is different.

**Also update Supabase credentials** (should match checkout.js):
```javascript
const SUPABASE_URL = 'https://xxxxx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJ...';
```

### 2. `js/checkout.js`
Update these values with your Supabase credentials:
```javascript
const SUPABASE_URL = 'YOUR_SUPABASE_URL'; // e.g., https://xxxxx.supabase.co
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
```

**Where to find:**
- Go to Supabase Dashboard → Settings → API
- Copy **Project URL** → paste as `SUPABASE_URL`
- Copy **anon public** key → paste as `SUPABASE_ANON_KEY`

### 3. Verify Stripe Price ID
Make sure your Stripe product price is set to **$99** and the `STRIPE_PRICE_ID` secret in Supabase matches.

### 4. Update Email "From" Address (Optional)
In your Supabase `stripe-webhook` Edge Function, update:
```typescript
from: "BackWatcher <onboarding@resend.dev>"
```
Replace with your verified Resend domain email, or keep `onboarding@resend.dev` for testing.

---

## Quick Checklist

### Configuration
- [x] Updated `DOWNLOAD_URL` in `js/download.js`
- [ ] Updated `SUPABASE_URL` in `js/download.js` and `js/checkout.js`
- [ ] Updated `SUPABASE_ANON_KEY` in `js/download.js` and `js/checkout.js`
- [ ] Verified Stripe price is $99

### Security
- [ ] Ran `supabase_setup.sql` (includes RLS policies)
- [ ] Verified RLS is enabled on all 4 tables
- [ ] Set `STRIPE_WEBHOOK_SECRET` in Supabase secrets

### Testing
- [ ] Tested download flow (email saved to download_leads table)
- [ ] Tested checkout flow (Stripe integration)
- [ ] Tested payment with test card: `4242 4242 4242 4242`
- [ ] Verified license key email is received

---

## Testing

### Test Card (Stripe Test Mode)
- Card: `4242 4242 4242 4242`
- Expiry: Any future date (e.g., 12/25)
- CVC: Any 3 digits (e.g., 123)

### Test Flow
1. Go to homepage
2. Enter email → Click "Download Free Trial for macOS"
3. Download link appears
4. **Verify**: Check Supabase → Table Editor → download_leads (email should appear)
5. Go to checkout page
6. **Verify**: Email should be pre-filled from step 2
7. Click "Proceed to Payment"
8. Complete test payment with test card
9. Check email for license key
10. Verify license key format: `BW-XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX`

---

## Deployment

### GitHub Pages
1. Push all files to your repository
2. Go to Settings → Pages
3. Select branch and folder (usually `main` / `root`)
4. Your site will be live at: `https://YOUR_USERNAME.github.io/REPO_NAME/`

### Custom Domain (backwatcher.app)
1. Add `CNAME` file with your domain name
2. Update DNS records as instructed by GitHub Pages
3. **Update webhook URL in Stripe** with your custom domain

---

## Support

If you encounter issues:
- Check browser console for errors
- Verify all configuration values are correct
- Check Supabase logs for Edge Function errors
- Test with Stripe test mode first
- Contact: contact@backwatcher.app
