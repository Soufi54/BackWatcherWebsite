# Supabase Setup Instructions

## Step 1: Create Supabase Project

1. Go to https://supabase.com
2. Create account (free tier is sufficient)
3. Create new project
   - Choose a project name
   - Set a database password (save it securely!)
   - Select a region close to your users
   - Wait for project to initialize (~2 minutes)

## Step 2: Get Your Credentials

After project is created, note these credentials:

### Project URL
- Go to: Settings → API
- Copy: **Project URL** (looks like: `https://xxxxx.supabase.co`)

### Anon Key
- Still in Settings → API
- Copy: **anon public** key (starts with `eyJ...`)

**Save these - you'll need them for the website!**

## Step 3: Create Database Tables

1. Go to: **SQL Editor** (left sidebar)
2. Click: **New Query**
3. Open the file: `supabase_setup.sql` in this folder
4. Copy the entire SQL content
5. Paste into the SQL Editor
6. Click: **Run** (or press Cmd/Ctrl + Enter)

**Verify tables were created:**
- Go to: **Table Editor** (left sidebar)
- You should see 3 tables: `users`, `licenses`, `payments`

## Step 4: Add Edge Function Secrets

1. Go to: **Settings** → **Edge Functions** → **Secrets**
2. Click: **Add new secret**
3. Add these secrets one by one:

### Required Secrets:

| Secret Name | Value | Where to Get It |
|------------|-------|----------------|
| `STRIPE_SECRET_KEY` | `sk_test_...` | Stripe Dashboard → Developers → API keys |
| `STRIPE_PRICE_ID` | `price_xxxxx` | Stripe Dashboard → Products → Your product → Price ID |
| `RESEND_API_KEY` | `re_xxxxx` | Resend Dashboard → API Keys → Create API key |

**Note:** `STRIPE_WEBHOOK_SECRET` will be added in Phase 2 after creating the webhook endpoint.

## Step 5: Verify Setup

✅ Project created  
✅ Project URL copied  
✅ Anon Key copied  
✅ Tables created (users, licenses, payments)  
✅ Secrets added (STRIPE_SECRET_KEY, STRIPE_PRICE_ID, RESEND_API_KEY)

## Next Steps

Once Phase 1 is complete, proceed to Phase 2:
- Create Edge Functions
- Set up Stripe webhook
- Add STRIPE_WEBHOOK_SECRET
