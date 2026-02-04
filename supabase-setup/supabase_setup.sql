-- BackWatcher Supabase Database Setup
-- Run this in Supabase SQL Editor: SQL Editor → New Query → Paste and Run

-- Table 1: Users (people who purchase licenses)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table 2: Licenses (the actual license keys)
CREATE TABLE licenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  license_key TEXT UNIQUE NOT NULL,
  type TEXT DEFAULT 'lifetime',
  stripe_payment_id TEXT,
  stripe_customer_id TEXT,
  issued_at TIMESTAMPTZ DEFAULT NOW(),
  revoked_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Table 3: Payments (track Stripe payments)
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  license_id UUID REFERENCES licenses(id) ON DELETE SET NULL,
  stripe_payment_intent_id TEXT UNIQUE NOT NULL,
  stripe_customer_id TEXT,
  amount INTEGER NOT NULL,
  currency TEXT DEFAULT 'usd',
  status TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table 4: Download leads (people who downloaded the trial)
CREATE TABLE download_leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL,
  downloaded_at TIMESTAMPTZ DEFAULT NOW(),
  source TEXT DEFAULT 'website',
  converted BOOLEAN DEFAULT FALSE
);

-- Create indexes for better query performance
CREATE INDEX idx_licenses_user_id ON licenses(user_id);
CREATE INDEX idx_licenses_license_key ON licenses(license_key);
CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_stripe_payment_intent_id ON payments(stripe_payment_intent_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_download_leads_email ON download_leads(email);

-- ============================================
-- ROW LEVEL SECURITY (RLS) - CRITICAL!
-- ============================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE licenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE download_leads ENABLE ROW LEVEL SECURITY;

-- Policy: Users table - Only service role can read/write (no public access)
CREATE POLICY "Service role only" ON users
  FOR ALL USING (auth.role() = 'service_role');

-- Policy: Licenses table - Only service role can read/write
CREATE POLICY "Service role only" ON licenses
  FOR ALL USING (auth.role() = 'service_role');

-- Policy: Payments table - Only service role can read/write
CREATE POLICY "Service role only" ON payments
  FOR ALL USING (auth.role() = 'service_role');-- Policy: Download leads - Allow insert from anon (for email collection), but no read
CREATE POLICY "Allow anonymous insert" ON download_leads
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Service role read only" ON download_leads
  FOR SELECT USING (auth.role() = 'service_role');

-- ============================================
-- IMPORTANT NOTES:
-- ============================================
-- 1. The anon key can ONLY insert into download_leads table
-- 2. All other tables require service_role (used by Edge Functions)
-- 3. Edge Functions use the service_role key internally
-- 4. This prevents anyone from reading your user/license/payment data