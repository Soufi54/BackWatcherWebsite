# Configuration Guide

## Files to Update Before Going Live

### 1. `js/download.js`
Update the download URL:
```javascript
const DOWNLOAD_URL = "https://github.com/YOUR_USERNAME/BackWatcher/releases/latest/download/BackWatcher.dmg";
```
Replace `YOUR_USERNAME` with your GitHub username and update the filename if different.

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

- [ ] Updated `DOWNLOAD_URL` in `js/download.js`
- [ ] Updated `SUPABASE_URL` in `js/checkout.js`
- [ ] Updated `SUPABASE_ANON_KEY` in `js/checkout.js`
- [ ] Verified Stripe price is $99
- [ ] Tested download flow (email validation)
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
2. Enter email → Click "Download for macOS"
3. Download link appears
4. Click "Buy Lifetime License" → Scrolls to pricing
5. Click "BUY NOW FOR $99" → Goes to checkout
6. Enter email → Click "Proceed to Payment"
7. Complete test payment
8. Check email for license key
9. Verify license key format: `BW-XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX`

---

## Deployment

### GitHub Pages
1. Push all files to your repository
2. Go to Settings → Pages
3. Select branch and folder (usually `main` / `root`)
4. Your site will be live at: `https://YOUR_USERNAME.github.io/REPO_NAME/`

### Custom Domain (Optional)
1. Add `CNAME` file with your domain name
2. Update DNS records as instructed by GitHub Pages
3. Update webhook URL in Stripe with your custom domain

---

## Support

If you encounter issues:
- Check browser console for errors
- Verify all configuration values are correct
- Test with Stripe test mode first
- Contact: backwatcherdev@gmail.com
