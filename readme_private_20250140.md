BackWatcher Website & Backend Setup Guide
What this does
Simple flow:
User visits website → clicks "Buy License"
User pays via Stripe
After payment → backend generates license key
Backend emails license key to user
User pastes key in app → activates
Database setup (Supabase)
Step 1: Create Supabase project
Go to https://supabase.com
Create account (free tier)
Create new project
Note your credentials:
Project URL: https://xxxxx.supabase.co
Anon Key: Settings → API → anon public key
Step 2: Create tables
Go to Supabase → SQL Editor → New Query → Paste and run:
-- Table 1: Users (people who purchase licenses)CREATE TABLE users (  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),  email TEXT UNIQUE NOT NULL,  created_at TIMESTAMPTZ DEFAULT NOW(),  updated_at TIMESTAMPTZ DEFAULT NOW());-- Table 2: Licenses (the actual license keys)CREATE TABLE licenses (  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),  user_id UUID REFERENCES users(id) ON DELETE CASCADE,  license_key TEXT UNIQUE NOT NULL,  type TEXT DEFAULT 'lifetime',  stripe_payment_id TEXT,  stripe_customer_id TEXT,  issued_at TIMESTAMPTZ DEFAULT NOW(),  revoked_at TIMESTAMPTZ,  metadata JSONB DEFAULT '{}'::jsonb);-- Table 3: Payments (track Stripe payments)CREATE TABLE payments (  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),  user_id UUID REFERENCES users(id) ON DELETE CASCADE,  license_id UUID REFERENCES licenses(id) ON DELETE SET NULL,  stripe_payment_intent_id TEXT UNIQUE NOT NULL,  stripe_customer_id TEXT,  amount INTEGER NOT NULL,  currency TEXT DEFAULT 'usd',  status TEXT NOT NULL,  created_at TIMESTAMPTZ DEFAULT NOW(),  updated_at TIMESTAMPTZ DEFAULT NOW());-- Create indexesCREATE INDEX idx_licenses_user_id ON licenses(user_id);CREATE INDEX idx_licenses_license_key ON licenses(license_key);CREATE INDEX idx_payments_user_id ON payments(user_id);CREATE INDEX idx_payments_stripe_payment_intent_id ON payments(stripe_payment_intent_id);CREATE INDEX idx_users_email ON users(email);
License key generation
Format
The app accepts:
Default: BW-XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX (UUID-like)
Custom: BW-LIFETIME-XXXXXXXX (shorter)
Generation code (use in backend)
function generateLicenseKey(format = 'default') {  if (format === 'custom') {    const random = Math.random().toString(36).substring(2, 10).toUpperCase();    return `BW-LIFETIME-${random}`;  } else {    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {      const r = Math.random() * 16 | 0;      const v = c === 'x' ? r : (r & 0x3 | 0x8);      return v.toString(16);    });    return `BW-${uuid.toUpperCase()}`;  }}
Requirements
Must be unique (database enforces this)
Must match app format
Recommended: use default format (UUID-like)
Stripe payment setup
Step 1: Create Stripe account
Go to https://stripe.com
Create account
Go to Developers → API keys
Note:
Publishable key: pk_test_... (frontend)
Secret key: sk_test_... (backend - keep secret)
Step 2: Create product
Go to Products → Add Product
Create:
Name: "BackWatcher Lifetime License"
Price: e.g., $29.99
Billing: One-time
Note the Price ID: price_xxxxx
Step 3: Set up webhooks
Go to Developers → Webhooks
Add endpoint: https://your-project.supabase.co/functions/v1/stripe-webhook
Select events:
payment_intent.succeeded
payment_intent.payment_failed
checkout.session.completed
Copy Webhook Signing Secret: whsec_xxxxx
Step 4: Add to Supabase secrets
Go to Supabase → Settings → Edge Functions → Secrets → Add:
STRIPE_SECRET_KEY = sk_test_...
STRIPE_WEBHOOK_SECRET = whsec_xxxxx
STRIPE_PRICE_ID = price_xxxxx
Email setup (Resend)
Step 1: Create account
Go to https://resend.com
Create account (free: 3,000 emails/month)
Go to API Keys → Create API key
Copy key: re_xxxxx
Step 2: Add to Supabase
Add RESEND_API_KEY to Supabase Edge Functions secrets
Backend API functions needed
Function 1: Create checkout session
Path: /create-checkout-session
Input: { email: "user@example.com" }
Output: { success: true, url: "https://checkout.stripe.com/..." }
What it does: Creates Stripe checkout session, returns URL
Function 2: Stripe webhook handler
Path: /stripe-webhook
What it does:
Verifies webhook signature
On payment_intent.succeeded:
Creates payment record
Generates license key
Creates license record
Sends email with license key
Website pages needed
index.html - Landing page with "Buy License" button
checkout.html - Payment page with Stripe integration
success.html - Success page after payment
download.html - Download page for app
Environment variables
Supabase secrets (add in dashboard)
STRIPE_SECRET_KEY=sk_test_xxxxxSTRIPE_WEBHOOK_SECRET=whsec_xxxxxSTRIPE_PRICE_ID=price_xxxxxRESEND_API_KEY=re_xxxxx
Website .env file
SUPABASE_URL=https://xxxxx.supabase.coSUPABASE_ANON_KEY=your-anon-keySTRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
Complete user flow
User visits website → clicks "Buy License"
User enters email → clicks "Buy"
Website calls /create-checkout-session
User redirected to Stripe → pays
Stripe sends webhook → backend receives payment
Backend generates license key → saves to database
Backend sends email with license key
User redirected to success page
User opens app → pastes key → activates
Testing
Stripe test cards
Success: 4242 4242 4242 4242
Decline: 4000 0000 0000 0002
Any future expiry, any CVC
Test checklist
[ ] Make test payment
[ ] Check Stripe dashboard → payment appears
[ ] Check Supabase → payments table has record
[ ] Check Supabase → licenses table has license
[ ] Check email → license key received
[ ] Test license key in app → activates
File structure
backwatcher-website/├── index.html├── checkout.html├── success.html├── download.html├── styles.css├── script.js├── .env.example└── README.md
Next steps
Set up Supabase → Create project, run SQL
Set up Stripe → Create account, get keys, create product
Set up Resend → Create account, get API key
Add secrets to Supabase
Create Edge Functions (code provided separately)
Build website (code provided separately)
Test end-to-end
Deploy
Cost
Supabase: Free tier (up to 500MB)
Resend: Free (3,000 emails/month)
Stripe: 2.9% + $0.30 per transaction
Website: Free (Vercel/Netlify)
Copy this README into your website repository. Tell me when you're ready, and I'll provide:
Supabase Edge Function code (TypeScript)
Website HTML/JS code
Email template code
This covers the database, license generation, and Stripe setup.